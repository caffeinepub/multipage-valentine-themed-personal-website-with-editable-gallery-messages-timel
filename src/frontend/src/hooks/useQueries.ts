import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GalleryItem, LoveMessage, TimelineMilestone, InteractiveSurpriseConfig, FinalDedication, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Gallery Queries
export function useGetAllGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !isFetching
  });
}

// Love Messages Queries
export function useGetAllLoveMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<LoveMessage[]>({
    queryKey: ['loveMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoveMessages();
    },
    enabled: !!actor && !isFetching
  });
}

// Timeline Queries
export function useGetAllTimelineMilestones() {
  const { actor, isFetching } = useActor();

  return useQuery<TimelineMilestone[]>({
    queryKey: ['timelineMilestones'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTimelineMilestones();
    },
    enabled: !!actor && !isFetching
  });
}

// Interactive Surprise Queries
export function useGetInteractiveSurpriseConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<InteractiveSurpriseConfig | null>({
    queryKey: ['interactiveSurpriseConfig'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getInteractiveSurpriseConfig();
    },
    enabled: !!actor && !isFetching
  });
}

// Final Dedication Queries
export function useGetFinalDedication() {
  const { actor, isFetching } = useActor();

  return useQuery<FinalDedication | null>({
    queryKey: ['finalDedication'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFinalDedication();
    },
    enabled: !!actor && !isFetching
  });
}
