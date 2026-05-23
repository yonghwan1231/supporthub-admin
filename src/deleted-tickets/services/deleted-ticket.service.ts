import { createQueryService } from "@jyh-dev/kit/create-query-service";
import { apiClient } from "@/common/lib/apiClient";
import { DELETED_TICKETS_PASSWORD_HEADER } from "@/deleted-tickets/constants/deleted-ticket-access";

export const deletedTicketService = createQueryService({
  namespace: "deleted-tickets",
  queries: ({ query }) => ({
    list: {
      getDeletedTickets: query({
        fn: async ({
          page,
          password,
          size,
        }: $DeletedTicket.GetDeletedTicketsParams) => {
          return apiClient.get<$DeletedTicket.ListResponse>(
            "/api/admin/deleted-tickets",
            {
              headers: {
                [DELETED_TICKETS_PASSWORD_HEADER]: password,
              },
              params: {
                page,
                size,
              },
            },
          );
        },
      }),
    },

    detail: {
      getDeletedTicket: query({
        fn: async ({
          deletedTicketId,
          password,
        }: {
          deletedTicketId: string;
          password: string;
        }) => {
          return apiClient.get<$DeletedTicket.DetailResponse>(
            `/api/admin/deleted-tickets/${deletedTicketId}`,
            {
              headers: {
                [DELETED_TICKETS_PASSWORD_HEADER]: password,
              },
            },
          );
        },
      }),
    },
  }),
});
