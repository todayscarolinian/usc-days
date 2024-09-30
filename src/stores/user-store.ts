import { create } from 'zustand'

interface UserState{
  email: string;
  name: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  name: '',
  setEmail: (email) => set({ email }),
  setName: (name) => set({ name }),
  resetUser: () => set({ email: '', name: '' }),
}));