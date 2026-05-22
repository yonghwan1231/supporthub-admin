import { bulkUpdateTicketStatusSchema } from "@/tickets/schema/ticket.schemas";
import { errorResponse, ok } from "../../_lib/api-response";
import { getTicketCollection, toObjectId } from "../_lib/ticket-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = bulkUpdateTicketStatusSchema.parse(await request.json());
    const collection = await getTicketCollection();
    const now = new Date().toISOString();
    const objectIds = body.ids.map(toObjectId);

    await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { status: body.status, updatedAt: now } },
    );

    return ok({ updatedCount: objectIds.length, status: body.status });
  } catch (error) {
    return errorResponse(error);
  }
}
