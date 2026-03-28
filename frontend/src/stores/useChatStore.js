import { create } from 'zustand'

export const useChatStore = create((set) => ({
  isChatOpen: false,
  setIsChatOpen: (val) => set({ isChatOpen: val }),
}))
