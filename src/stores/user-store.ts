import { create } from 'zustand'

interface UserState {
    email: string;
    name: string;
    picture: string;
    setEmail: (email: string) => void;
    setName: (name: string) => void;
    setPicture: (picture: string) => void;
    resetUser: () => void;
}

// Utility function to safely access localStorage on the client side
const getLocalStorageValue = (key: string, defaultValue: string) => {
    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") as string)[key];
        return storedValue ? storedValue : defaultValue;
    }
    return defaultValue;
};

export const useUserStore = create<UserState>((set) => ({
    email: getLocalStorageValue('email', ''),
    name: getLocalStorageValue('name', ''),
    picture: getLocalStorageValue('picture', ''),
    setEmail: (email) => set({ email }),
    setName: (name) => set({ name }),
    setPicture: (picture) => set({ picture }),
    resetUser: () => set({ email: '', name: '' }),
}));