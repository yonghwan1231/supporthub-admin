import { isRealtimeEnabled } from "./realtime-config";
import { createSseEventChunk } from "./sse-format";

type TicketEventSubscriber = (chunk: string) => void;

declare global {
  var supporthubTicketEventSubscribers:
    | Set<TicketEventSubscriber>
    | undefined;
}

const subscribers =
  globalThis.supporthubTicketEventSubscribers ??
  new Set<TicketEventSubscriber>();

globalThis.supporthubTicketEventSubscribers = subscribers;

export function subscribeTicketEvents(subscriber: TicketEventSubscriber) {
  if (!isRealtimeEnabled()) {
    return () => undefined;
  }

  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}

export function publishTicketEvent({
  data,
  event,
}: {
  data: unknown;
  event: string;
}) {
  if (!isRealtimeEnabled()) return;

  const chunk = createSseEventChunk({ data, event });

  subscribers.forEach((subscriber) => subscriber(chunk));
}

export function getTicketEventSubscriberCount() {
  return subscribers.size;
}

export function publishUrgentTicket(ticket: $Ticket.Item) {
  publishTicketEvent({
    event: "ticket.urgent",
    data: {
      category: ticket.category,
      createdAt: ticket.createdAt,
      customerName: ticket.customerName,
      id: ticket.id,
      priority: ticket.priority,
      title: ticket.title,
    } satisfies $Ticket.UrgentTicketEvent,
  });
}
