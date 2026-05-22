import { createQueryService } from "@jyh-dev/kit/create-query-service";
import { apiClient } from "@/common/lib/apiClient";

export const ticketService = createQueryService({
  namespace: "tickets",
  queries: ({ query }) => ({
    list: {
      getTickets: query({
        fn: async (params: $Ticket.GetTicketsParams) => {
          return apiClient.get<$Ticket.GetTicketsResponse>("/api/tickets", {
            params,
          });
        },
      }),
    },

    detail: {
      getTicket: query({
        fn: async (id: $Ticket.GetTicketParams) => {
          return apiClient.get<$Ticket.GetTicketResponse>(`/api/tickets/${id}`);
        },
      }),
    },
  }),

  mutations: ({ mutation }) => ({
    updateStatus: mutation({
      fn: async ({ id, status }: $Ticket.UpdateStatusPayload) => {
        return apiClient.patch<$Ticket.UpdateStatusResponse>(
          `/api/tickets/${id}`,
          { status },
        );
      },
      invalidates: ({ keys, variables }) => [
        keys.list.getTickets(),
        keys.detail.getTicket(variables.id),
      ],
    }),

    bulkUpdateStatus: mutation({
      fn: async (payload: $Ticket.BulkUpdateStatusPayload) => {
        return apiClient.post<$Ticket.BulkUpdateStatusResponse>(
          "/api/tickets/bulk-status",
          payload,
        );
      },
      invalidates: ({ keys }) => [keys.list.getTickets()],
    }),

    addReply: mutation({
      fn: async ({ ticketId, ...payload }: $Ticket.AddReplyPayload) => {
        return apiClient.post<$Ticket.AddReplyResponse>(
          `/api/tickets/${ticketId}/reply`,
          payload,
        );
      },
      invalidates: ({ keys, variables }) => [
        keys.list.getTickets(),
        keys.detail.getTicket(variables.ticketId),
      ],
    }),

    deleteTicket: mutation({
      fn: async (id: $Ticket.DeleteTicketParams) => {
        return apiClient.delete<$Ticket.DeleteTicketResponse>(
          `/api/tickets/${id}`,
        );
      },
      invalidates: ({ keys }) => [keys.list.getTickets()],
    }),

    presignUpload: mutation({
      fn: async (payload: $Ticket.PresignUploadRequest) => {
        return apiClient.post<$Ticket.PresignUploadResponse>(
          "/api/uploads/presign",
          payload,
        );
      },
    }),
  }),
});
