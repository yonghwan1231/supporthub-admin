import { createQueryService } from "@jyh-dev/kit/create-query-service";
import { apiClient } from "@/common/lib/apiClient";

export const dashboardService = createQueryService({
  namespace: "dashboard",
  queries: ({ query }) => ({
    summary: {
      getDashboard: query({
        fn: async () => {
          return apiClient.get<$Dashboard.SummaryResponse>("/api/dashboard");
        },
        options: {
          placeholderData: (previousData) => previousData,
        },
      }),
    },
  }),
});
