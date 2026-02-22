import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Schedule, Item } from '../backend';

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
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
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
    },
  });
}

export function useListSchedules() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Schedule[]>({
    queryKey: ['schedules'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSchedules();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSchedule(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Schedule | null>({
    queryKey: ['schedule', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getSchedule(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useSaveSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      location: string;
      preferredDateTime: bigint;
      budget: bigint;
      items: Item[];
      selectedShop: { name: string } | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveSchedule(
        params.location,
        params.preferredDateTime,
        params.budget,
        params.items,
        params.selectedShop
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useDeleteSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSchedule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useGetQuickBuyList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Item[]>({
    queryKey: ['quickBuyList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuickBuyList();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddQuickBuyItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Item) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuickBuyItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickBuyList'] });
    },
  });
}

export function useRemoveQuickBuyItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeQuickBuyItem(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickBuyList'] });
    },
  });
}
