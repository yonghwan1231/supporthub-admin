export const ticketStatuses = [
  "open",
  "in_progress",
  "resolved",
  "hold",
] as const;

export const ticketPriorities = ["low", "medium", "high", "urgent"] as const;

export const ticketCategories = [
  "account",
  "billing",
  "technical",
  "general",
] as const;

export const statusLabels: Record<$Ticket.Status, string> = {
  open: "대기",
  in_progress: "처리중",
  resolved: "완료",
  hold: "보류",
};

export const priorityLabels: Record<$Ticket.Priority, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

export const categoryLabels: Record<$Ticket.Category, string> = {
  account: "계정",
  billing: "결제",
  technical: "기술",
  general: "일반",
};

export const statusTone = {
  open: "amber",
  in_progress: "cyan",
  resolved: "emerald",
  hold: "slate",
} as const;

export const priorityTone = {
  low: "slate",
  medium: "cyan",
  high: "amber",
  urgent: "rose",
} as const;
