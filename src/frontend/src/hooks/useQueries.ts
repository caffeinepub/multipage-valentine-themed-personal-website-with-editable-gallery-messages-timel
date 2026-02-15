import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useContentVersion } from './useContentVersion';
import type { GalleryItem, LoveMessage, TimelineMilestone, InteractiveSurpriseConfig, FinalDedication, UserProfile, PublishStatus } from '../backend';

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
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await queryClient.refetchQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Publish Status Query - Version-scoped
export function useGetPublishStatus() {
  const { actor, isFetching } = useActor();
  const { activeVersion } = useContentVersion();

  return useQuery<PublishStatus>({
    queryKey: ['publishStatus', activeVersion],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPublishStatus(activeVersion);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 1000 // 10 seconds
  });
}

// Versions Query
export function useGetVersions() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['versions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVersions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000 // 30 seconds
  });
}

// Draft Content Queries (for editing)
export function useGetDraftContent() {
  const { actor, isFetching } = useActor();
  const { activeVersion } = useContentVersion();

  return useQuery({
    queryKey: ['draftContent', activeVersion],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDraftContent(activeVersion);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000, // 30 seconds
    retry: false, // Don't retry on authorization errors
  });
}

export function useGetDraftGalleryItems() {
  const { data: draftContent, isLoading, isFetched } = useGetDraftContent();
  
  return {
    data: draftContent?.galleryItems ?? [],
    isLoading,
    isFetched
  };
}

export function useGetDraftLoveMessages() {
  const { data: draftContent, isLoading, isFetched } = useGetDraftContent();
  
  return {
    data: draftContent?.loveMessages ?? [],
    isLoading,
    isFetched
  };
}

export function useGetDraftTimelineMilestones() {
  const { data: draftContent, isLoading, isFetched } = useGetDraftContent();
  
  return {
    data: draftContent?.timelineMilestones ?? [],
    isLoading,
    isFetched
  };
}

export function useGetDraftInteractiveSurpriseConfig() {
  const { data: draftContent, isLoading } = useGetDraftContent();
  
  return {
    data: draftContent?.interactiveSurpriseConfig ?? null,
    isLoading
  };
}

export function useGetDraftFinalDedication() {
  const { data: draftContent, isLoading } = useGetDraftContent();
  
  return {
    data: draftContent?.finalDedication ?? null,
    isLoading
  };
}

// Helper to detect if an error is authorization-related
function isAuthorizationError(error: any): boolean {
  if (!error) return false;
  const message = error.message || String(error);
  return message.includes('Unauthorized') || 
         message.includes('not authorized') ||
         message.includes('permission denied') ||
         message.includes('access denied');
}

// Published Content Queries (for public pages) - Enhanced for unauthenticated access
export function useGetPublishedContent() {
  const { actor, isFetching } = useActor();
  const { activeVersion } = useContentVersion();

  return useQuery({
    queryKey: ['publishedContent', activeVersion],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPublishedContent(activeVersion);
      } catch (error) {
        // If it's an authorization error, treat as "not published" rather than error
        if (isAuthorizationError(error)) {
          return null;
        }
        // Re-throw other errors for proper error handling
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      // Don't retry authorization errors
      if (isAuthorizationError(error)) {
        return false;
      }
      // Retry other errors once
      return failureCount < 1;
    },
    staleTime: 60 * 1000 // 1 minute
  });
}

export function useGetPublishedGalleryItems() {
  const { data: publishedContent, isLoading, error, isError } = useGetPublishedContent();
  
  // Filter out authorization errors from being treated as errors
  const isRealError = isError && !isAuthorizationError(error);
  
  return {
    data: publishedContent?.galleryItems ?? [],
    isLoading,
    isPublished: publishedContent !== null,
    error: isRealError ? error : null,
    isError: isRealError
  };
}

export function useGetPublishedLoveMessages() {
  const { data: publishedContent, isLoading, error, isError } = useGetPublishedContent();
  
  const isRealError = isError && !isAuthorizationError(error);
  
  return {
    data: publishedContent?.loveMessages ?? [],
    isLoading,
    isPublished: publishedContent !== null,
    error: isRealError ? error : null,
    isError: isRealError
  };
}

export function useGetPublishedTimelineMilestones() {
  const { data: publishedContent, isLoading, error, isError } = useGetPublishedContent();
  
  const isRealError = isError && !isAuthorizationError(error);
  
  return {
    data: publishedContent?.timelineMilestones ?? [],
    isLoading,
    isPublished: publishedContent !== null,
    error: isRealError ? error : null,
    isError: isRealError
  };
}

export function useGetPublishedInteractiveSurpriseConfig() {
  const { data: publishedContent, isLoading, error, isError } = useGetPublishedContent();
  
  const isRealError = isError && !isAuthorizationError(error);
  
  return {
    data: publishedContent?.interactiveSurpriseConfig ?? null,
    isLoading,
    isPublished: publishedContent !== null,
    error: isRealError ? error : null,
    isError: isRealError
  };
}

export function useGetPublishedFinalDedication() {
  const { data: publishedContent, isLoading, error, isError } = useGetPublishedContent();
  
  const isRealError = isError && !isAuthorizationError(error);
  
  return {
    data: publishedContent?.finalDedication ?? null,
    isLoading,
    isPublished: publishedContent !== null,
    error: isRealError ? error : null,
    isError: isRealError
  };
}
