import { DELETED_TICKETS_PASSWORD_HEADER } from "@/deleted-tickets/constants/deleted-ticket-access";
import { isDeletedTicketsPasswordValid } from "./deleted-ticket-password";

export function verifyDeletedTicketsAccess(request: Request) {
  const configuredPassword = process.env.SUPPORTHUB_RESET_PASSWORD;
  const inputPassword = request.headers.get(DELETED_TICKETS_PASSWORD_HEADER);

  if (isDeletedTicketsPasswordValid(inputPassword, configuredPassword)) {
    return null;
  }

  return Response.json(
    { message: "삭제된 문의를 볼 권한이 없습니다." },
    { status: 401 },
  );
}
