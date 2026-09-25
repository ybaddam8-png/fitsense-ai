import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultProfile, profileStorageKey } from "@/src/types/pose";
type Profile = ReturnType<typeof defaultProfile>;
type UserState = { profile: Profile; hydrated: boolean; hydrate: () => Promise<void>; updateProfile: (patch: Partial<Profile>) => Promise<void>; };
export const useUserStore = create<UserState>((set, get) => ({ profile: defaultProfile(), hydrated: false,
  hydrate: async () => { const raw = await AsyncStorage.getItem(profileStorageKey()); if (raw) { try { set({ profile: { ...defaultProfile(), ...JSON.parse(raw) }, hydrated: true }); return; } catch { /* reset to safe local default */ } } set({ hydrated: true }); },
  updateProfile: async (patch) => { const profile = { ...get().profile, ...patch }; set({ profile }); await AsyncStorage.setItem(profileStorageKey(), JSON.stringify(profile)); },
}));
