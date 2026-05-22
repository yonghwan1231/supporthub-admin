import type {
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
} from "@/tickets/constants/ticket-labels";

declare global {
  namespace $Ticket {
    type Status = (typeof ticketStatuses)[number];
    type Priority = (typeof ticketPriorities)[number];
    type Category = (typeof ticketCategories)[number];

    type StatusFilter = "all" | Status;
    type PriorityFilter = "all" | Priority;
    type Sort = "latest" | "oldest" | "priority";

    type Attachment = $Common.Attachment;

    type Reply = {
      id: string;
      authorName: string;
      message: string;
      attachments: Attachment[];
      createdAt: string;
    };

    type Item = {
      id: string;
      title: string;
      content: string;
      customerName: string;
      customerEmail: string;
      status: Status;
      priority: Priority;
      priorityWeight: number;
      category: Category;
      tags: string[];
      attachments: Attachment[];
      replies: Reply[];
      createdAt: string;
      updatedAt: string;
    };

    type GetTicketsParams = {
      page: number;
      size: number;
      keyword: string;
      status: StatusFilter;
      priority: PriorityFilter;
      sort: Sort;
    };

    type GetTicketsItem = Item;

    type GetTicketsResponse = {
      items: GetTicketsItem[];
      meta: $Common.PageMeta;
    };

    type GetTicketParams = string;
    type GetTicketResponse = GetTicketsItem;

    type UpdateStatusPayload = {
      id: string;
      status: Status;
    };

    type UpdateStatusResponse = GetTicketsItem;

    type BulkUpdateStatusPayload = {
      ids: string[];
      status: Status;
    };

    type BulkUpdateStatusResponse = {
      updatedCount: number;
      status: string;
    };

    type AddReplyPayload = {
      ticketId: string;
      message: string;
      attachments: Attachment[];
    };

    type AddReplyResponse = GetTicketsItem;

    type DeleteTicketParams = string;

    type DeleteTicketResponse = {
      deleted: boolean;
    };

    type PresignUploadRequest = {
      fileName: string;
      contentType: string;
      size: number;
    };

    type PresignUploadResponse = {
      uploadUrl: string;
      fileUrl: string;
      key: string;
    };
  }
}

export {};
