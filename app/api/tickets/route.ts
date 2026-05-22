import { getTicketsSearchParamsSchema } from "@/tickets/schema/ticket.schemas";
import { errorResponse, ok } from "../_lib/api-response";
import {
  ensureSeedTickets,
  getTicketCollection,
  toTicket
} from "./_lib/ticket-db";
import type { TicketDocument } from "./_lib/ticket-db";
import type { Filter, Sort } from "mongodb";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = getTicketsSearchParamsSchema.parse({
      page: searchParams.get("page") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      keyword: searchParams.get("keyword") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    await ensureSeedTickets();

    const collection = await getTicketCollection();
    const filter = createListFilter(params);
    const sort = createSort(params.sort);
    const skip = (params.page - 1) * params.size;
    const [items, totalCount] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(params.size)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return ok({
      items: items.map(toTicket),
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

function createListFilter(
  params: $Ticket.GetTicketsParams,
): Filter<TicketDocument> {
  const filter: Filter<TicketDocument> = {};

  if (params.status !== "all") {
    filter.status = params.status;
  }

  if (params.priority !== "all") {
    filter.priority = params.priority;
  }

  if (params.keyword) {
    const regex = new RegExp(escapeRegex(params.keyword), "i");
    filter.$or = [
      { title: regex },
      { customerName: regex },
      { customerEmail: regex },
      { tags: regex },
    ];
  }

  return filter;
}

function createSort(sort: $Ticket.GetTicketsParams["sort"]): Sort {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "priority") return { priorityWeight: -1, updatedAt: -1 };
  return { createdAt: -1 };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
