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



actor {
  // Types
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

  public type UserProfile = {
    name : Text;
  };

  let galleryItems = Map.empty<Text, GalleryItem>();
  let loveMessages = Map.empty<Text, LoveMessage>();
  let timelineMilestones = Map.empty<Text, TimelineMilestone>();
  var interactiveSurpriseConfig : ?InteractiveSurpriseConfig = null;
  var finalDedication : ?FinalDedication = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // Gallery API - Admin only for modifications, users can view
  public shared ({ caller }) func addGalleryItem(id : Text, image : Storage.ExternalBlob, caption : Text, order : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    let item : GalleryItem = { id; image; caption; order };
    galleryItems.add(id, item);
  };

  public shared ({ caller }) func updateGalleryItemOrder(id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };
    switch (galleryItems.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        let updatedItem = { item with order = newOrder };
        galleryItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    galleryItems.remove(id);
  };

  public query func getAllGalleryItems() : async [GalleryItem] {
    // Allow anyone (including guests) to view gallery items
    galleryItems.entries().map(func((_, item)) { item }).toArray();
  };

  // Love Messages API - Admin only for modifications, users can view
  public shared ({ caller }) func addLoveMessage(id : Text, title : Text, preview : Text, fullText : Text, order : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add love messages");
    };
    let message : LoveMessage = { id; title; preview; fullText; order };
    loveMessages.add(id, message);
  };

  public shared ({ caller }) func updateLoveMessage(id : Text, title : Text, preview : Text, fullText : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update love messages");
    };
    switch (loveMessages.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?message) {
        let updatedMessage = { message with title; preview; fullText };
        loveMessages.add(id, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func updateLoveMessageOrder(id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update love messages");
    };
    switch (loveMessages.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?message) {
        let updatedMessage = { message with order = newOrder };
        loveMessages.add(id, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func deleteLoveMessage(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete love messages");
    };
    loveMessages.remove(id);
  };

  public query func getAllLoveMessages() : async [LoveMessage] {
    // Allow anyone (including guests) to view love messages
    loveMessages.entries().map(func((_, message)) { message }).toArray();
  };

  // Timeline API - Admin only for modifications, users can view
  public shared ({ caller }) func addTimelineMilestone(
    id : Text,
    date : Time.Time,
    title : Text,
    description : Text,
    photo : ?Storage.ExternalBlob,
    order : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add timeline milestones");
    };
    let milestone : TimelineMilestone = {
      id;
      date;
      title;
      description;
      photo;
      order;
    };
    timelineMilestones.add(id, milestone);
  };

  public shared ({ caller }) func updateTimelineMilestone(
    id : Text,
    date : Time.Time,
    title : Text,
    description : Text,
    photo : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update timeline milestones");
    };
    switch (timelineMilestones.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?milestone) {
        let updatedMilestone = { milestone with date; title; description; photo };
        timelineMilestones.add(id, updatedMilestone);
      };
    };
  };

  public shared ({ caller }) func updateTimelineMilestoneOrder(id : Text, newOrder : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update timeline milestones");
    };
    switch (timelineMilestones.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?milestone) {
        let updatedMilestone = { milestone with order = newOrder };
        timelineMilestones.add(id, updatedMilestone);
      };
    };
  };

  public shared ({ caller }) func deleteTimelineMilestone(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete timeline milestones");
    };
    timelineMilestones.remove(id);
  };

  public query func getAllTimelineMilestones() : async [TimelineMilestone] {
    // Allow anyone (including guests) to view timeline milestones
    timelineMilestones.entries().map(func((_, milestone)) { milestone }).toArray();
  };

  // Interactive Surprise API - Admin only for modifications, users can view
  public shared ({ caller }) func setInteractiveSurpriseConfig(config : InteractiveSurpriseConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set interactive surprise config");
    };
    interactiveSurpriseConfig := ?config;
  };

  public query func getInteractiveSurpriseConfig() : async ?InteractiveSurpriseConfig {
    // Allow anyone (including guests) to view interactive surprise config
    interactiveSurpriseConfig;
  };

  // Final Dedication API - Admin only for modifications, users can view
  public shared ({ caller }) func setFinalDedication(dedication : FinalDedication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set final dedication");
    };
    finalDedication := ?dedication;
  };

  public query func getFinalDedication() : async ?FinalDedication {
    // Allow anyone (including guests) to view final dedication
    finalDedication;
  };
};
