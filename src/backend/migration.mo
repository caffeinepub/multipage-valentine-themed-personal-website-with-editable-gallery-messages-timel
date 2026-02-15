import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type QuizQuestion = {
    question : Text;
    options : [Text];
    correctAnswer : Text;
  };

  type FlipCard = {
    front : Text;
    back : Text;
  };

  type InteractiveSurpriseConfig = {
    quizQuestions : [QuizQuestion];
    flipCards : [FlipCard];
  };

  type FinalDedication = {
    title : Text;
    message : Text;
  };

  type GalleryItem = {
    id : Text;
    image : Storage.ExternalBlob;
    caption : Text;
    order : Nat;
  };

  type LoveMessage = {
    id : Text;
    title : Text;
    preview : Text;
    fullText : Text;
    order : Nat;
  };

  type TimelineMilestone = {
    id : Text;
    date : Time.Time;
    title : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    order : Nat;
  };

  type ContentVersion = {
    galleryItems : Map.Map<Text, GalleryItem>;
    loveMessages : Map.Map<Text, LoveMessage>;
    timelineMilestones : Map.Map<Text, TimelineMilestone>;
    interactiveSurpriseConfig : ?InteractiveSurpriseConfig;
    finalDedication : ?FinalDedication;
  };

  type UserProfile = {
    name : Text;
  };

  type VersionPublishData = {
    lastPublished : ?Time.Time;
    draftLastUpdated : ?Time.Time;
  };

  // Previous version with deprecated stable fields.
  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    publishedContent : Map.Map<Text, ContentVersion>;
    draftContent : Map.Map<Text, ContentVersion>;
    contentOwnership : Map.Map<Text, Principal>;
    lastPublishedTime : ?Time.Time;
    draftLastUpdatedTime : ?Time.Time;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    publishedContent : Map.Map<Text, ContentVersion>;
    draftContent : Map.Map<Text, ContentVersion>;
    contentOwnership : Map.Map<Text, Principal>;
    versionPublishData : Map.Map<Text, VersionPublishData>;
  };

  public func run(old : OldActor) : NewActor {
    let versionPublishData = Map.empty<Text, VersionPublishData>();
    { old with versionPublishData };
  };
};
