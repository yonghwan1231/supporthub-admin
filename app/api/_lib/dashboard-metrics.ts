const DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 7;

const statusLabels: Record<$Ticket.Status, string> = {
  open: "대기",
  in_progress: "처리중",
  resolved: "완료",
  hold: "보류",
};

const statusOrder: $Ticket.Status[] = [
  "open",
  "in_progress",
  "resolved",
  "hold",
];

export function buildDashboardSummary(
  tickets: $Ticket.Item[],
  now = new Date(),
): $Dashboard.SummaryResponse {
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved",
  ).length;
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status !== "resolved",
  ).length;
  const urgentPendingTickets = tickets.filter(
    (ticket) => ticket.priority === "urgent" && ticket.status !== "resolved",
  ).length;
  const dayAgo = now.getTime() - DAY_MS;
  const newTicketsLast24h = tickets.filter((ticket) => {
    return Date.parse(ticket.createdAt) >= dayAgo;
  }).length;

  return {
    metrics: {
      completionRate: getRate(resolvedTickets, totalTickets),
      newTicketsLast24h,
      pendingTickets,
      resolvedTickets,
      totalTickets,
      urgentPendingTickets,
    },
    priorityQueue: createPriorityQueue(tickets),
    recentActivities: createRecentActivities(tickets),
    recentTickets: createRecentTickets(tickets),
    statusSummary: createStatusSummary(tickets),
    trend: createTrend(tickets, now),
  };
}

function createStatusSummary(tickets: $Ticket.Item[]) {
  return statusOrder.map((status) => {
    const count = tickets.filter((ticket) => ticket.status === status).length;

    return {
      count,
      label: statusLabels[status],
      rate: getRate(count, tickets.length),
      status,
    };
  });
}

function createTrend(tickets: $Ticket.Item[], now: Date) {
  const today = startOfDay(now);
  const days = Array.from({ length: TREND_DAYS }, (_, index) => {
    return addDays(today, index - (TREND_DAYS - 1));
  });

  return days.map((day) => {
    const key = toDateKey(day);

    return {
      created: tickets.filter((ticket) => toDateKey(ticket.createdAt) === key)
        .length,
      date: key,
      label: formatTrendLabel(day),
      resolved: tickets.filter((ticket) => {
        return (
          ticket.status === "resolved" && toDateKey(ticket.updatedAt) === key
        );
      }).length,
    };
  });
}

function createPriorityQueue(
  tickets: $Ticket.Item[],
): $Dashboard.PriorityQueueItem[] {
  return tickets
    .filter((ticket) => {
      return (
        ticket.status !== "resolved" &&
        (ticket.priority === "urgent" || ticket.priority === "high")
      );
    })
    .sort((left, right) => {
      if (right.priorityWeight !== left.priorityWeight) {
        return right.priorityWeight - left.priorityWeight;
      }

      return Date.parse(left.createdAt) - Date.parse(right.createdAt);
    })
    .slice(0, 4)
    .map((ticket) => ({
      customerName: ticket.customerName,
      id: ticket.id,
      priority: ticket.priority,
      status: ticket.status,
      title: ticket.title,
      updatedAt: ticket.updatedAt,
    }));
}

function createRecentTickets(tickets: $Ticket.Item[]) {
  return tickets
    .slice()
    .sort((left, right) => {
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    })
    .slice(0, 7)
    .map((ticket) => ({
      createdAt: ticket.createdAt,
      customerName: ticket.customerName,
      id: ticket.id,
      priority: ticket.priority,
      status: ticket.status,
      title: ticket.title,
    }));
}

function createRecentActivities(tickets: $Ticket.Item[]) {
  const replyActivities = tickets.flatMap((ticket) => {
    return ticket.replies.map((reply) => ({
      at: reply.createdAt,
      description: `${ticket.title} - ${reply.authorName}`,
      id: `${ticket.id}-${reply.id}`,
      ticketId: ticket.id,
      title: "답변 등록",
      type: "reply" as const,
    }));
  });
  const resolvedActivities = tickets
    .filter((ticket) => ticket.status === "resolved")
    .map((ticket) => ({
      at: ticket.updatedAt,
      description: ticket.title,
      id: `${ticket.id}-resolved`,
      ticketId: ticket.id,
      title: "문의 완료 처리",
      type: "resolved" as const,
    }));
  const createdActivities = tickets.map((ticket) => ({
    at: ticket.createdAt,
    description: `${ticket.customerName} 고객 문의`,
    id: `${ticket.id}-created`,
    ticketId: ticket.id,
    title: "문의 접수",
    type: "created" as const,
  }));

  return [...replyActivities, ...resolvedActivities, ...createdActivities]
    .sort((left, right) => Date.parse(right.at) - Date.parse(left.at))
    .slice(0, 5);
}

function getRate(value: number, total: number) {
  if (total <= 0) return 0;

  return Math.round((value / total) * 100);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function toDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTrendLabel(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    day: "numeric",
    month: "numeric",
  });
}
