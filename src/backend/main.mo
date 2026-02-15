import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";
import Migration "migration";

// Migration enabled via `with` syntax.
(with migration = Migration.run)
actor {
  // Types (Replicated for stable serialization)
  public type GalleryItem = {
    id : Text;
    image : Storage.ExternalBlob;
    caption : Text;
    order : Nat;
  };

  public type LoveMessage = {
    id : Text;
    title : Text;
    preview : Text;
    fullText : Text;
    order : Nat;
  };

  public type TimelineMilestone = {
    id : Text;
    date : Time.Time;
    title : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    order : Nat;
  };

  public type QuizQuestion = {
    question : Text;
    options : [Text];
    correctAnswer : Text;
  };

  public type FlipCard = {
    front : Text;
    back : Text;
  };

  public type InteractiveSurpriseConfig = {
    quizQuestions : [QuizQuestion];
    flipCards : [FlipCard];
  };

  public type FinalDedication = {
    title : Text;
    message : Text;
  };

  public type ContentVersion = {
    galleryItems : Map.Map<Text, GalleryItem>;
    loveMessages : Map.Map<Text, LoveMessage>;
    timelineMilestones : Map.Map<Text, TimelineMilestone>;
    interactiveSurpriseConfig : ?InteractiveSurpriseConfig;
    finalDedication : ?FinalDedication;
  };

  public type UserProfile = {
    name : Text;
  };

  public type PublishStatus = {
    lastPublished : ?Time.Time;
    draftLastUpdated : ?Time.Time;
    isPublished : Bool;
  };

  public type VersionPublishData = {
    lastPublished : ?Time.Time;
    draftLastUpdated : ?Time.Time;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();
  let publishedContent : Map.Map<Text, ContentVersion> = Map.empty<Text, ContentVersion>();
  let draftContent : Map.Map<Text, ContentVersion> = Map.empty<Text, ContentVersion>();
  let contentOwnership : Map.Map<Text, Principal> = Map.empty<Text, Principal>();
  let versionPublishData : Map.Map<Text, VersionPublishData> = Map.empty<Text, VersionPublishData>();

  // User Profile API
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Authorization helper: Check if caller owns the version or is admin
  func verifyOwnership(caller : Principal, version : Text) {
    switch (contentOwnership.get(version)) {
      case (null) {
        // No owner yet - caller becomes owner
        contentOwnership.add(version, caller);
      };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only modify your own content");
        };
      };
    };
  };

  public shared ({ caller }) func publishDraft(_version : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can publish draft");
    };
    verifyOwnership(caller, _version);

    switch (draftContent.get(_version)) {
      case (null) { Runtime.trap("No draft content found for this version") };
      case (?draft) {
        publishedContent.add(_version, draft);
        updateVersionPublishData(_version, #published);
      };
    };
  };

  public query ({ caller }) func getPublishStatus(version : Text) : async PublishStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view publish status");
    };

    switch (versionPublishData.get(version)) {
      case (null) {
        {
          lastPublished = null;
          draftLastUpdated = null;
          isPublished = false;
        };
      };
      case (?data) {
        let draftUpdated = if (data.draftLastUpdated == null and data.lastPublished != null) {
          data.lastPublished;
        } else { data.draftLastUpdated };

        {
          lastPublished = data.lastPublished;
          draftLastUpdated = draftUpdated;
          isPublished = data.lastPublished != null;
        };
      };
    };
  };

  // Gallery API - Works on Draft
  public shared ({ caller }) func addGalleryItem(version : Text, id : Text, image : Storage.ExternalBlob, caption : Text, order : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add gallery items");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let item : GalleryItem = { id; image; caption; order };
    let draft = getOrCreateDraft(version);
    draft.galleryItems.add(id, item);
    draftContent.add(version, draft);
  };

  public shared ({ caller }) func updateGalleryItemOrder(version : Text, id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update gallery items");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    switch (draft.galleryItems.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        let updatedItem = { item with order = newOrder };
        draft.galleryItems.add(id, updatedItem);
        draftContent.add(version, draft);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(version : Text, id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete gallery items");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    draft.galleryItems.remove(id);
    draftContent.add(version, draft);
  };

  // LoveMessages Workflow
  public shared ({ caller }) func addLoveMessage(version : Text, id : Text, title : Text, preview : Text, fullText : Text, order : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add love messages");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let message : LoveMessage = { id; title; preview; fullText; order };
    let draft = getOrCreateDraft(version);
    draft.loveMessages.add(id, message);
    draftContent.add(version, draft);
  };

  public shared ({ caller }) func updateLoveMessage(version : Text, id : Text, title : Text, preview : Text, fullText : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update love messages");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    switch (draft.loveMessages.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?message) {
        let updatedMessage = { message with title; preview; fullText };
        draft.loveMessages.add(id, updatedMessage);
        draftContent.add(version, draft);
      };
    };
  };

  public shared ({ caller }) func updateLoveMessageOrder(version : Text, id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update love messages");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    switch (draft.loveMessages.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?message) {
        let updatedMessage = { message with order = newOrder };
        draft.loveMessages.add(id, updatedMessage);
        draftContent.add(version, draft);
      };
    };
  };

  public shared ({ caller }) func deleteLoveMessage(version : Text, id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete love messages");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    draft.loveMessages.remove(id);
    draftContent.add(version, draft);
  };

  // Timeline API
  public shared ({ caller }) func addTimelineMilestone(
    version : Text,
    id : Text,
    date : Time.Time,
    title : Text,
    description : Text,
    photo : ?Storage.ExternalBlob,
    order : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add timeline milestones");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let milestone : TimelineMilestone = {
      id;
      date;
      title;
      description;
      photo;
      order;
    };
    let draft = getOrCreateDraft(version);
    draft.timelineMilestones.add(id, milestone);
    draftContent.add(version, draft);
  };

  public shared ({ caller }) func updateTimelineMilestone(
    version : Text,
    id : Text,
    date : Time.Time,
    title : Text,
    description : Text,
    photo : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update timeline milestones");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    switch (draft.timelineMilestones.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?milestone) {
        let updatedMilestone = { milestone with date; title; description; photo };
        draft.timelineMilestones.add(id, updatedMilestone);
        draftContent.add(version, draft);
      };
    };
  };

  public shared ({ caller }) func updateTimelineMilestoneOrder(version : Text, id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update timeline milestones");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    switch (draft.timelineMilestones.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?milestone) {
        let updatedMilestone = { milestone with order = newOrder };
        draft.timelineMilestones.add(id, updatedMilestone);
        draftContent.add(version, draft);
      };
    };
  };

  public shared ({ caller }) func deleteTimelineMilestone(version : Text, id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete timeline milestones");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    draft.timelineMilestones.remove(id);
    draftContent.add(version, draft);
  };

  // Interactive Surprise API
  public shared ({ caller }) func setInteractiveSurpriseConfig(version : Text, config : InteractiveSurpriseConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set interactive surprise config");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    draftContent.add(
      version,
      { draft with interactiveSurpriseConfig = ?config },
    );
  };

  // Final Dedication API
  public shared ({ caller }) func setFinalDedication(version : Text, dedication : FinalDedication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set final dedication");
    };
    verifyOwnership(caller, version);
    updateVersionPublishData(version, #draft);

    let draft = getOrCreateDraft(version);
    draftContent.add(version, { draft with finalDedication = ?dedication });
  };

  // Internal helpers
  func updateVersionPublishData(version : Text, action : { #draft; #published }) {
    let now = ?Time.now();
    switch (versionPublishData.get(version)) {
      case (null) {
        let newData : VersionPublishData = {
          lastPublished = if (action == #published) { now } else { null };
          draftLastUpdated = if (action == #draft) { now } else { null };
        };
        versionPublishData.add(version, newData);
      };
      case (?existingData) {
        let updatedData : VersionPublishData = {
          lastPublished = if (action == #published) { now } else { existingData.lastPublished };
          draftLastUpdated = if (action == #draft) { now } else { existingData.draftLastUpdated };
        };
        versionPublishData.add(version, updatedData);
      };
    };
  };

  func getOrCreateDraft(version : Text) : ContentVersion {
    switch (draftContent.get(version)) {
      case (?draft) { draft };
      case (null) {
        {
          galleryItems = Map.empty<Text, GalleryItem>();
          loveMessages = Map.empty<Text, LoveMessage>();
          timelineMilestones = Map.empty<Text, TimelineMilestone>();
          interactiveSurpriseConfig = null;
          finalDedication = null;
        };
      };
    };
  };

  func mapToArray<K, V>(map : Map.Map<K, V>) : [V] {
    let list = List.empty<V>();
    map.forEach(func(_, v) { list.add(v) });
    list.toArray();
  };

  public query ({ caller }) func getDraftContent(version : Text) : async ?{
    galleryItems : [GalleryItem];
    loveMessages : [LoveMessage];
    timelineMilestones : [TimelineMilestone];
    interactiveSurpriseConfig : ?InteractiveSurpriseConfig;
    finalDedication : ?FinalDedication;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view draft content");
    };

    // Verify ownership before returning draft content
    switch (contentOwnership.get(version)) {
      case (null) { return null }; // No content exists yet
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own draft content");
        };
      };
    };

    switch (draftContent.get(version)) {
      case (null) { null };
      case (?draft) {
        let galleryArray = mapToArray(draft.galleryItems);
        let loveMessagesArray = mapToArray(draft.loveMessages);
        let timelineArray = mapToArray(draft.timelineMilestones);

        ?{
          galleryItems = galleryArray;
          loveMessages = loveMessagesArray;
          timelineMilestones = timelineArray;
          interactiveSurpriseConfig = draft.interactiveSurpriseConfig;
          finalDedication = draft.finalDedication;
        };
      };
    };
  };

  // PUBLIC: No authentication required - visitors must be able to view published content
  public query func getPublishedContent(version : Text) : async ?{
    galleryItems : [GalleryItem];
    loveMessages : [LoveMessage];
    timelineMilestones : [TimelineMilestone];
    interactiveSurpriseConfig : ?InteractiveSurpriseConfig;
    finalDedication : ?FinalDedication;
  } {
    switch (publishedContent.get(version)) {
      case (null) { null };
      case (?published) {
        let galleryArray = mapToArray(published.galleryItems);
        let loveMessagesArray = mapToArray(published.loveMessages);
        let timelineArray = mapToArray(published.timelineMilestones);

        ?{
          galleryItems = galleryArray;
          loveMessages = loveMessagesArray;
          timelineMilestones = timelineArray;
          interactiveSurpriseConfig = published.interactiveSurpriseConfig;
          finalDedication = published.finalDedication;
        };
      };
    };
  };

  // PUBLIC: No authentication required - visitors need to know available versions
  public query func getVersions() : async [Text] {
    // Return only published versions for public access
    publishedContent.keys().toArray();
  };
};
