"use client";

import { createPromiseModal } from "@jyh-dev/kit";
import { CreateTicketModal } from "@/tickets/modals/create-ticket-modal";

export const appModal = createPromiseModal({
  CreateTicketModal,
});
