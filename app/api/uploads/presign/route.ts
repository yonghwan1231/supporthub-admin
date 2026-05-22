import { presignUploadSchema } from "@/tickets/schema/ticket.schemas";
import { errorResponse, ok } from "../../_lib/api-response";
import { createPresignedUploadUrl } from "../_lib/s3-presign";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = presignUploadSchema.parse(await request.json());
    return ok(await createPresignedUploadUrl(body));
  } catch (error) {
    return errorResponse(error);
  }
}
