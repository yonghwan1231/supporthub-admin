declare global {
  namespace $DeletedTicket {
    type Item = {
      deletedAt: string;
      deletedBy: "admin";
      id: string;
      originalId: string;
      ticket: $Ticket.Item;
    };

    type ListItem = {
      category: $Ticket.Category;
      customerEmail: string;
      customerName: string;
      deletedAt: string;
      id: string;
      originalId: string;
      priority: $Ticket.Priority;
      status: $Ticket.Status;
      title: string;
      updatedAt: string;
    };

    type GetDeletedTicketsParams = {
      page: number;
      password: string;
      size: number;
    };

    type ListResponse = {
      items: ListItem[];
      meta: $Common.PageMeta;
    };

    type DetailResponse = Item;
  }
}

export {};
