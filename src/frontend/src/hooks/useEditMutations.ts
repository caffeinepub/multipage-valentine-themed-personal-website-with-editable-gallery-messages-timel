import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useContentVersion } from './useContentVersion';
import { ExternalBlob } from '../backend';
import type { InteractiveSurpriseConfig, FinalDedication } from '../backend';

// Gallery Mutations
export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, image, caption, order }: { id: string; image: ExternalBlob; caption: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryItem(activeVersion, id, image, caption, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryItem(activeVersion, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useUpdateGalleryItemOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItemOrder(activeVersion, id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

// Love Messages Mutations
export function useAddLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, title, preview, fullText, order }: { id: string; title: string; preview: string; fullText: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLoveMessage(activeVersion, id, title, preview, fullText, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useUpdateLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, title, preview, fullText }: { id: string; title: string; preview: string; fullText: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLoveMessage(activeVersion, id, title, preview, fullText);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useDeleteLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLoveMessage(activeVersion, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useUpdateLoveMessageOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLoveMessageOrder(activeVersion, id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

// Timeline Mutations
export function useAddTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, date, title, description, photo, order }: { id: string; date: bigint; title: string; description: string; photo: ExternalBlob | null; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTimelineMilestone(activeVersion, id, date, title, description, photo, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useUpdateTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, date, title, description, photo }: { id: string; date: bigint; title: string; description: string; photo: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineMilestone(activeVersion, id, date, title, description, photo);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useDeleteTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTimelineMilestone(activeVersion, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

export function useUpdateTimelineMilestoneOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineMilestoneOrder(activeVersion, id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

// Interactive Surprise Mutations
export function useSetInteractiveSurpriseConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async (config: InteractiveSurpriseConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setInteractiveSurpriseConfig(activeVersion, config);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

// Final Dedication Mutations
export function useSetFinalDedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async (dedication: FinalDedication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setFinalDedication(activeVersion, dedication);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['draftContent', activeVersion] });
      await queryClient.refetchQueries({ queryKey: ['draftContent', activeVersion], type: 'active' });
    }
  });
}

// Publish Mutation
export function usePublishDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { activeVersion } = useContentVersion();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishDraft(activeVersion);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['publishedContent', activeVersion] });
      await queryClient.invalidateQueries({ queryKey: ['publishStatus'] });
      await queryClient.invalidateQueries({ queryKey: ['versions'] });
      await queryClient.refetchQueries({ queryKey: ['publishedContent', activeVersion], type: 'active' });
      await queryClient.refetchQueries({ queryKey: ['publishStatus'], type: 'active' });
      await queryClient.refetchQueries({ queryKey: ['versions'], type: 'active' });
    }
  });
}
