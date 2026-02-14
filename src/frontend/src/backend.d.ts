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
    addGalleryItem(id: string, image: ExternalBlob, caption: string, order: bigint): Promise<void>;
    addLoveMessage(id: string, title: string, preview: string, fullText: string, order: bigint): Promise<void>;
    addTimelineMilestone(id: string, date: Time, title: string, description: string, photo: ExternalBlob | null, order: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    deleteLoveMessage(id: string): Promise<void>;
    deleteTimelineMilestone(id: string): Promise<void>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllLoveMessages(): Promise<Array<LoveMessage>>;
    getAllTimelineMilestones(): Promise<Array<TimelineMilestone>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinalDedication(): Promise<FinalDedication | null>;
    getInteractiveSurpriseConfig(): Promise<InteractiveSurpriseConfig | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFinalDedication(dedication: FinalDedication): Promise<void>;
    setInteractiveSurpriseConfig(config: InteractiveSurpriseConfig): Promise<void>;
    updateGalleryItemOrder(id: string, newOrder: bigint): Promise<void>;
    updateLoveMessage(id: string, title: string, preview: string, fullText: string): Promise<void>;
    updateLoveMessageOrder(id: string, newOrder: bigint): Promise<void>;
    updateTimelineMilestone(id: string, date: Time, title: string, description: string, photo: ExternalBlob | null): Promise<void>;
    updateTimelineMilestoneOrder(id: string, newOrder: bigint): Promise<void>;
}
