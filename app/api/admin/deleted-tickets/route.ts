import { errorResponse, ok } from "../../_lib/api-response";
import { verifyDeletedTicketsAccess } from "./_lib/deleted-ticket-access";
import {
  getDeletedTicketCollection,
  toDeletedTicketListItem,
} from "./_lib/deleted-ticket-db";
import { parseDeletedTicketListParams } from "./_lib/deleted-ticket-pagination";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const forbidden = verifyDeletedTicketsAccess(request);
    if (forbidden) return forbidden;

    const { searchParams } = new URL(request.url);
    const params = parseDeletedTicketListParams(searchParams);
    const skip = (params.page - 1) * params.size;
    const collection = await getDeletedTicketCollection();
    const [documents, totalCount] = await Promise.all([
      collection
        .find({})
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(params.size)
        .toArray(),
      collection.countDocuments({}),
    ]);

    return ok<$DeletedTicket.ListResponse>({
      items: documents.map(toDeletedTicketListItem),
      meta: {
        page: params.page,
        size: params.size,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / params.size)),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
