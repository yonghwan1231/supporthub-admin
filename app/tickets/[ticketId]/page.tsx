import { TicketDetailPage } from "@/tickets/pages/ticket-detail-page";

type PageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketPage({ params }: PageProps) {
  const { ticketId } = await params;

  return <TicketDetailPage ticketId={ticketId} />;
}
