"use client";

import { create } from "zustand";

type DeletedTicketAccessState = {
  clearPassword: () => void;
  password: string | null;
  setPassword: (password: string) => void;
};

export const useDeletedTicketAccessStore = create<DeletedTicketAccessState>()(
  (set) => ({
    clearPassword: () => set({ password: null }),
    password: null,
    setPassword: (password) => set({ password }),
  }),
);
