declare global {
  namespace $Dashboard {
    type StatusSummary = {
      count: number;
      label: string;
      rate: number;
      status: $Ticket.Status;
    };

    type TrendPoint = {
      created: number;
      date: string;
      label: string;
      resolved: number;
    };

    type PriorityQueueItem = {
      customerName: string;
      id: string;
      priority: $Ticket.Priority;
      status: $Ticket.Status;
      title: string;
      updatedAt: string;
    };

    type RecentTicket = {
      createdAt: string;
      customerName: string;
      id: string;
      priority: $Ticket.Priority;
      status: $Ticket.Status;
      title: string;
    };

    type RecentActivity = {
      at: string;
      description: string;
      id: string;
      ticketId: string;
      title: string;
      type: "created" | "reply" | "resolved";
    };

    type Metrics = {
      completionRate: number;
      newTicketsLast24h: number;
      pendingTickets: number;
      resolvedTickets: number;
      totalTickets: number;
      urgentPendingTickets: number;
    };

    type SummaryResponse = {
      metrics: Metrics;
      priorityQueue: PriorityQueueItem[];
      recentActivities: RecentActivity[];
      recentTickets: RecentTicket[];
      statusSummary: StatusSummary[];
      trend: TrendPoint[];
    };
  }
}

export {};
