import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { errorResponse, ok } from "../../../_lib/api-response";
import { verifyDeletedTicketsAccess } from "../_lib/deleted-ticket-access";
import {
  getDeletedTicketCollection,
  toDeletedTicket,
} from "../_lib/deleted-ticket-db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    deletedTicketId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const forbidden = verifyDeletedTicketsAccess(request);
    if (forbidden) return forbidden;

    const { deletedTicketId } = await context.params;
    if (!ObjectId.isValid(deletedTicketId)) {
      return NextResponse.json(
        { message: "삭제된 문의를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const collection = await getDeletedTicketCollection();
    const document = await collection.findOne({
      _id: new ObjectId(deletedTicketId),
    });

    if (!document) {
      return NextResponse.json(
        { message: "삭제된 문의를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return ok<$DeletedTicket.DetailResponse>(toDeletedTicket(document));
  } catch (error) {
    return errorResponse(error);
  }
}
