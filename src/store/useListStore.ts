import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

export interface ListProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;
}

interface ListStore {
  profiles: ListProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isInList: (userId: string) => boolean;
  reorderProfiles: (startIndex: number, endIndex: number) => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile, platform) => {
        const existing = get().profiles.find(
          (p) => p.user_id === profile.user_id
        );
        if (existing) return false;

        set((state) => ({
          profiles: [
            ...state.profiles,
            { ...profile, platform, addedAt: Date.now() },
          ],
        }));
        return true;
      },

      removeProfile: (userId) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.user_id !== userId),
        }));
      },

      clearList: () => set({ profiles: [] }),

      isInList: (userId) => {
        return get().profiles.some((p) => p.user_id === userId);
      },

      reorderProfiles: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.profiles);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { profiles: result };
        });
      },
    }),
    {
      name: "wobb-selected-profiles",
    }
  )
);
