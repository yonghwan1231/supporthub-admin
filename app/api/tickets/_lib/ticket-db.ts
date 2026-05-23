import { ObjectId } from "mongodb";
import { getDb } from "../../_lib/mongodb";
import { seedTickets } from "./ticket.seed";

export type TicketDocument = Omit<$Ticket.Item, "id"> & {
  _id?: ObjectId;
};

const COLLECTION_NAME = "tickets";

export async function getTicketCollection() {
  const db = await getDb();
  const collection = db.collection<TicketDocument>(COLLECTION_NAME);
  await collection.createIndex({ updatedAt: -1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ priority: 1 });
  return collection;
}

export async function ensureSeedTickets() {
  const collection = await getTicketCollection();
  const count = await collection.estimatedDocumentCount();
  if (count > 0) return;

  await collection.insertMany(seedTickets);
}

export async function resetTicketCollection() {
  const collection = await getTicketCollection();
  const deleteResult = await collection.deleteMany({});
  const insertResult = await collection.insertMany(seedTickets);

  return {
    deletedCount: deleteResult.deletedCount,
    insertedCount: insertResult.insertedCount,
  };
}

export function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ticket id.");
  }

  return new ObjectId(id);
}

export function toTicket(document: TicketDocument): $Ticket.Item {
  if (!document._id) {
    throw new Error("Ticket document does not have _id.");
  }

  return {
    id: document._id.toHexString(),
    title: document.title,
    content: document.content,
    customerName: document.customerName,
    customerEmail: document.customerEmail,
    status: document.status,
    priority: document.priority,
    priorityWeight: document.priorityWeight,
    category: document.category,
    tags: document.tags,
    attachments: document.attachments,
    replies: document.replies,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}
