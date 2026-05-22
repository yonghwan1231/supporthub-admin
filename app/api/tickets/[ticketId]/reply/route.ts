import { NextResponse } from "next/server";
import { addTicketReplySchema } from "@/tickets/schema/ticket.schemas";
import { errorResponse, ok } from "../../../_lib/api-response";
import {
  getTicketCollection,
  toObjectId,
  toTicket,
} from "../../_lib/ticket-db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    ticketId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { ticketId } = await context.params;
    const body = addTicketReplySchema.parse(await request.json());
    const collection = await getTicketCollection();
    const now = new Date().toISOString();
    const ticketDocument = await collection.findOneAndUpdate(
      { _id: toObjectId(ticketId) },
      {
        $push: {
          replies: {
            id: crypto.randomUUID(),
            authorName: "Support",
            message: body.message,
            attachments: body.attachments,
            createdAt: now,
          },
        },
        $set: {
          status: "in_progress" satisfies $Ticket.Status,
          updatedAt: now,
        },
      },
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
