import { z } from "zod";
import {
  ticketCategories,
  ticketPriorities,
  ticketStatuses,
} from "@/tickets/constants/ticket-labels";

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
  message: z.string().trim().min(1, "답변 내용을 입력해 주세요."),
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

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "문의 제목을 2자 이상 입력해주세요.")
    .max(100, "문의 제목은 100자 이하로 입력해주세요."),
  content: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해주세요.")
    .max(2000, "문의 내용은 2000자 이하로 입력해주세요."),
  customerName: z
    .string()
    .trim()
    .min(2, "고객명을 2자 이상 입력해주세요.")
    .max(30, "고객명은 30자 이하로 입력해주세요."),
  customerEmail: z
    .string()
    .trim()
    .email("올바른 이메일 주소를 입력해주세요."),
  category: z.enum(ticketCategories),
  priority: z.enum(ticketPriorities),
  tags: z.array(z.string().trim().min(1)).max(8).default([]),
});

export const createTicketFormSchema = createTicketSchema
  .omit({ tags: true })
  .extend({
    tagsText: z
      .string()
      .trim()
      .max(120, "태그는 쉼표 포함 120자 이하로 입력해주세요."),
  });

export type ReplyFormValues = z.infer<typeof replyFormSchema>;
export type CreateTicketFormValues = z.infer<typeof createTicketFormSchema>;
