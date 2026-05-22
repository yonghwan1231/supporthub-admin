import { Badge } from "@/common/components/ui/badge";
import {
  categoryLabels,
  priorityLabels,
  priorityTone,
  statusLabels,
  statusTone,
} from "@/tickets/constants/ticket-labels";

export function StatusBadge({ status }: { status: $Ticket.Status }) {
  return <Badge tone={statusTone[status]}>{statusLabels[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: $Ticket.Priority }) {
  return (
    <Badge tone={priorityTone[priority]}>{priorityLabels[priority]}</Badge>
  );
}

export function CategoryBadge({ category }: { category: $Ticket.Category }) {
  return <Badge>{categoryLabels[category]}</Badge>;
}
