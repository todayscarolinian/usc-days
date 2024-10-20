import { create } from 'zustand';
import { useEffect } from 'react';

interface UserState {
    email: string;
    name: string;
    picture: string;
    setEmail: (email: string) => void;
    setName: (name: string) => void;
    setPicture: (picture: string) => void;
    resetUser: () => void;
    initializeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    email: '',
    name: '',
    picture: '',
    setEmail: (email) => {
        set({ email });
        localStorage.setItem('email', email);
    },
    setName: (name) => {
        set({ name });
        localStorage.setItem('name', name);
    },
    setPicture: (picture) => {
        set({ picture });
        localStorage.setItem('picture', picture);
    },
    resetUser: () => {
        set({ email: '', name: '', picture: '' });
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('picture');
    },
    initializeUser: () => {
        const email = localStorage.getItem('email') || '';
        const name = localStorage.getItem('name') || '';
        const picture = localStorage.getItem('picture') || '';
        set({ email, name, picture });
    },
}));

// Custom hook to initialize the user state on the client side
export const useInitializeUserStore = () => {
    const initializeUser = useUserStore((state) => state.initializeUser);

    useEffect(() => {
        initializeUser();
    }, [initializeUser]);
};
