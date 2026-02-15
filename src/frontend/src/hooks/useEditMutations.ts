import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { GalleryItem, LoveMessage, TimelineMilestone, InteractiveSurpriseConfig, FinalDedication } from '../backend';

// Gallery Mutations
export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, image, caption, order }: { id: string; image: ExternalBlob; caption: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryItem(id, image, caption, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      await queryClient.refetchQueries({ queryKey: ['galleryItems'], type: 'active' });
    }
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryItem(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      await queryClient.refetchQueries({ queryKey: ['galleryItems'], type: 'active' });
    }
  });
}

export function useUpdateGalleryItemOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItemOrder(id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      await queryClient.refetchQueries({ queryKey: ['galleryItems'], type: 'active' });
    }
  });
}

// Love Messages Mutations
export function useAddLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, preview, fullText, order }: { id: string; title: string; preview: string; fullText: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLoveMessage(id, title, preview, fullText, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['loveMessages'] });
      await queryClient.refetchQueries({ queryKey: ['loveMessages'], type: 'active' });
    }
  });
}

export function useUpdateLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, preview, fullText }: { id: string; title: string; preview: string; fullText: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLoveMessage(id, title, preview, fullText);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['loveMessages'] });
      await queryClient.refetchQueries({ queryKey: ['loveMessages'], type: 'active' });
    }
  });
}

export function useDeleteLoveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLoveMessage(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['loveMessages'] });
      await queryClient.refetchQueries({ queryKey: ['loveMessages'], type: 'active' });
    }
  });
}

export function useUpdateLoveMessageOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLoveMessageOrder(id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['loveMessages'] });
      await queryClient.refetchQueries({ queryKey: ['loveMessages'], type: 'active' });
    }
  });
}

// Timeline Mutations
export function useAddTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date, title, description, photo, order }: { id: string; date: bigint; title: string; description: string; photo: ExternalBlob | null; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTimelineMilestone(id, date, title, description, photo, order);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['timelineMilestones'] });
      await queryClient.refetchQueries({ queryKey: ['timelineMilestones'], type: 'active' });
    }
  });
}

export function useUpdateTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date, title, description, photo }: { id: string; date: bigint; title: string; description: string; photo: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineMilestone(id, date, title, description, photo);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['timelineMilestones'] });
      await queryClient.refetchQueries({ queryKey: ['timelineMilestones'], type: 'active' });
    }
  });
}

export function useDeleteTimelineMilestone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTimelineMilestone(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['timelineMilestones'] });
      await queryClient.refetchQueries({ queryKey: ['timelineMilestones'], type: 'active' });
    }
  });
}

export function useUpdateTimelineMilestoneOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTimelineMilestoneOrder(id, newOrder);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['timelineMilestones'] });
      await queryClient.refetchQueries({ queryKey: ['timelineMilestones'], type: 'active' });
    }
  });
}

// Interactive Surprise Mutations
export function useSetInteractiveSurpriseConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: InteractiveSurpriseConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setInteractiveSurpriseConfig(config);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['interactiveSurpriseConfig'] });
      await queryClient.refetchQueries({ queryKey: ['interactiveSurpriseConfig'], type: 'active' });
    }
  });
}

// Final Dedication Mutations
export function useSetFinalDedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dedication: FinalDedication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setFinalDedication(dedication);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finalDedication'] });
      await queryClient.refetchQueries({ queryKey: ['finalDedication'], type: 'active' });
    }
  });
}
