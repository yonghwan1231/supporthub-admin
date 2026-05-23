type DocumentId = {
  toHexString: () => string;
};

export type DeletedTicketDocument = Omit<$DeletedTicket.Item, "id"> & {
  _id?: DocumentId;
};

export function createDeletedTicketDocument(
  ticket: $Ticket.Item,
  deletedAt = new Date().toISOString(),
): DeletedTicketDocument {
  return {
    deletedAt,
    deletedBy: "admin",
    originalId: ticket.id,
    ticket,
  };
}

export function toDeletedTicket(
  document: DeletedTicketDocument,
): $DeletedTicket.Item {
  if (!document._id) {
    throw new Error("Deleted ticket document does not have _id.");
  }

  return {
    deletedAt: document.deletedAt,
    deletedBy: document.deletedBy,
    id: document._id.toHexString(),
    originalId: document.originalId,
    ticket: document.ticket,
  };
}

export function toDeletedTicketListItem(
  document: DeletedTicketDocument,
): $DeletedTicket.ListItem {
  const deletedTicket = toDeletedTicket(document);

  return {
    category: deletedTicket.ticket.category,
    customerEmail: deletedTicket.ticket.customerEmail,
    customerName: deletedTicket.ticket.customerName,
    deletedAt: deletedTicket.deletedAt,
    id: deletedTicket.id,
    originalId: deletedTicket.originalId,
    priority: deletedTicket.ticket.priority,
    status: deletedTicket.ticket.status,
    title: deletedTicket.ticket.title,
    updatedAt: deletedTicket.ticket.updatedAt,
  };
}
