import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TimelineMilestone {
    id: string;
    title: string;
    order: bigint;
    date: Time;
    description: string;
    photo?: ExternalBlob;
}
export type Time = bigint;
export interface InteractiveSurpriseConfig {
    quizQuestions: Array<QuizQuestion>;
    flipCards: Array<FlipCard>;
}
export interface QuizQuestion {
    question: string;
    correctAnswer: string;
    options: Array<string>;
}
export interface PublishStatus {
    isPublished: boolean;
    lastPublished?: Time;
    draftLastUpdated?: Time;
}
export interface LoveMessage {
    id: string;
    title: string;
    order: bigint;
    preview: string;
    fullText: string;
}
export interface FlipCard {
    front: string;
    back: string;
}
export interface GalleryItem {
    id: string;
    order: bigint;
    caption: string;
    image: ExternalBlob;
}
export interface FinalDedication {
    title: string;
    message: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryItem(version: string, id: string, image: ExternalBlob, caption: string, order: bigint): Promise<void>;
    addLoveMessage(version: string, id: string, title: string, preview: string, fullText: string, order: bigint): Promise<void>;
    addTimelineMilestone(version: string, id: string, date: Time, title: string, description: string, photo: ExternalBlob | null, order: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryItem(version: string, id: string): Promise<void>;
    deleteLoveMessage(version: string, id: string): Promise<void>;
    deleteTimelineMilestone(version: string, id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDraftContent(version: string): Promise<{
        interactiveSurpriseConfig?: InteractiveSurpriseConfig;
        galleryItems: Array<GalleryItem>;
        timelineMilestones: Array<TimelineMilestone>;
        loveMessages: Array<LoveMessage>;
        finalDedication?: FinalDedication;
    } | null>;
    getPublishStatus(version: string): Promise<PublishStatus>;
    getPublishedContent(version: string): Promise<{
        interactiveSurpriseConfig?: InteractiveSurpriseConfig;
        galleryItems: Array<GalleryItem>;
        timelineMilestones: Array<TimelineMilestone>;
        loveMessages: Array<LoveMessage>;
        finalDedication?: FinalDedication;
    } | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVersions(): Promise<Array<string>>;
    isCallerAdmin(): Promise<boolean>;
    publishDraft(_version: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFinalDedication(version: string, dedication: FinalDedication): Promise<void>;
    setInteractiveSurpriseConfig(version: string, config: InteractiveSurpriseConfig): Promise<void>;
    updateGalleryItemOrder(version: string, id: string, newOrder: bigint): Promise<void>;
    updateLoveMessage(version: string, id: string, title: string, preview: string, fullText: string): Promise<void>;
    updateLoveMessageOrder(version: string, id: string, newOrder: bigint): Promise<void>;
    updateTimelineMilestone(version: string, id: string, date: Time, title: string, description: string, photo: ExternalBlob | null): Promise<void>;
    updateTimelineMilestoneOrder(version: string, id: string, newOrder: bigint): Promise<void>;
}
