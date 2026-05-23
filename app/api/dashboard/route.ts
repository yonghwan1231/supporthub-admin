import { errorResponse, ok } from "../_lib/api-response";
import { buildDashboardSummary } from "../_lib/dashboard-metrics";
import {
  ensureSeedTickets,
  getTicketCollection,
  toTicket,
} from "../tickets/_lib/ticket-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureSeedTickets();

    const collection = await getTicketCollection();
    const tickets = await collection.find({}).toArray();

    return ok(buildDashboardSummary(tickets.map(toTicket)));
  } catch (error) {
    return errorResponse(error);
  }
}
