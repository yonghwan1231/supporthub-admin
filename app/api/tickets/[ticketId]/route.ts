import { NextResponse } from "next/server";
import { updateTicketStatusSchema } from "@/tickets/schema/ticket.schemas";
import { errorResponse, ok } from "../../_lib/api-response";
import {
  createDeletedTicketDocument,
  getDeletedTicketCollection,
} from "../../admin/deleted-tickets/_lib/deleted-ticket-db";
import {
  ensureSeedTickets,
  getTicketCollection,
  toObjectId,
  toTicket,
} from "../_lib/ticket-db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    ticketId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { ticketId } = await context.params;
    await ensureSeedTickets();

    const collection = await getTicketCollection();
    const ticketDocument = await collection.findOne({
      _id: toObjectId(ticketId),
    });
    const ticket = ticketDocument ? toTicket(ticketDocument) : null;

    if (!ticket) {
      return NextResponse.json(
        { message: "문의를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return ok(ticket);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { ticketId } = await context.params;
    const body = updateTicketStatusSchema.parse(await request.json());
    const collection = await getTicketCollection();
    const now = new Date().toISOString();
    const ticketDocument = await collection.findOneAndUpdate(
      { _id: toObjectId(ticketId) },
      { $set: { status: body.status, updatedAt: now } },
      { returnDocument: "after" },
    );
    const ticket = ticketDocument ? toTicket(ticketDocument) : null;

    if (!ticket) {
      return NextResponse.json(
        { message: "문의를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return ok(ticket);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { ticketId } = await context.params;
    const collection = await getTicketCollection();
    const _id = toObjectId(ticketId);
    const ticketDocument = await collection.findOne({ _id });

    if (!ticketDocument) {
      return ok({ deleted: false });
    }

    const deletedTicketCollection = await getDeletedTicketCollection();
    await deletedTicketCollection.insertOne(
      createDeletedTicketDocument(toTicket(ticketDocument)),
    );

    const result = await collection.deleteOne({ _id });

    return ok({ deleted: result.deletedCount > 0 });
  } catch (error) {
    return errorResponse(error);
  }
}
