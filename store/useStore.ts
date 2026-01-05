import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
    hasVisited: boolean;
    setHasVisited: (value: boolean) => void;
    recentlyViewed: string[];
    addToRecentlyViewed: (path: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            hasVisited: false,
            setHasVisited: (value) => set({ hasVisited: value }),
            recentlyViewed: [],
            addToRecentlyViewed: (path) => set((state) => {
                const newHistory = [path, ...state.recentlyViewed.filter(p => p !== path)].slice(0, 5);
                return { recentlyViewed: newHistory };
            }),
        }),
        {
            name: 'countenance-session-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
