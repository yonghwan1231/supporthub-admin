import { getDb } from "../../../_lib/mongodb";
import {
  createDeletedTicketDocument,
  toDeletedTicket,
  toDeletedTicketListItem,
} from "./deleted-ticket-archive";
import type { DeletedTicketDocument } from "./deleted-ticket-archive";

const COLLECTION_NAME = "deletedTickets";

export async function getDeletedTicketCollection() {
  const db = await getDb();
  const collection = db.collection<DeletedTicketDocument>(COLLECTION_NAME);
  await collection.createIndex({ deletedAt: -1 });
  await collection.createIndex({ originalId: 1 });

  return collection;
}

export { createDeletedTicketDocument, toDeletedTicket, toDeletedTicketListItem };
