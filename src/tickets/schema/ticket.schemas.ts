import { z } from "zod";
import { ticketPriorities, ticketStatuses } from "@/tickets/constants/ticket-labels";

export const getTicketsSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(5).max(100).default(20),
  keyword: z.string().trim().default(""),
  status: z.enum(["all", ...ticketStatuses]).default("all"),
  priority: z.enum(["all", ...ticketPriorities]).default("all"),
  sort: z.enum(["latest", "oldest", "priority"]).default("latest"),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(ticketStatuses),
});

export const bulkUpdateTicketStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(ticketStatuses),
});

export const ticketAttachmentSchema = z.object({
  id: z.string().min(1),
  originalName: z.string().min(1),
  fileUrl: z.string().url(),
  fileKey: z.string().min(1),
  fileSize: z.number().int().min(0),
  contentType: z.string().min(1),
  uploadedAt: z.string().min(1),
});

export const replyFormSchema = z.object({
  message: z.string().trim().min(1, "답변 내용을 입력해주세요."),
});

export const addTicketReplySchema = replyFormSchema.extend({
  attachments: z.array(ticketAttachmentSchema).default([]),
});

export const presignUploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  size: z
    .number()
    .int()
    .positive()
    .max(20 * 1024 * 1024),
});

export type ReplyFormValues = z.infer<typeof replyFormSchema>;
