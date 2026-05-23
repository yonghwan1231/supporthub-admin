import { DeletedTicketDetailPage } from "@/deleted-tickets/pages/deleted-ticket-detail-page";

type PageProps = {
  params: Promise<{
    deletedTicketId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { deletedTicketId } = await params;

  return <DeletedTicketDetailPage deletedTicketId={deletedTicketId} />;
}
