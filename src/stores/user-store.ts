import { create } from 'zustand'

interface UserState{
  email: string;
  name: string;
  picture: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setPicture: (picture: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  name: '',
  picture: '',
  setEmail: (email) => set({ email }),
  setName: (name) => set({ name }),
  setPicture: (picture) => set({ picture }),
  resetUser: () => set({ email: '', name: '' }),
}));