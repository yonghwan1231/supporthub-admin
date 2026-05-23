import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { errorResponse, ok } from "../../_lib/api-response";
import { resetTicketCollection } from "../../tickets/_lib/ticket-db";

export const runtime = "nodejs";

const resetDataSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const configuredPassword = process.env.SUPPORTHUB_RESET_PASSWORD;
    if (!configuredPassword) {
      throw new Error("SUPPORTHUB_RESET_PASSWORD must be configured.");
    }

    const body = resetDataSchema.parse(await request.json());
    if (!isSamePassword(body.password, configuredPassword)) {
      return Response.json(
        { message: "초기화 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const result = await resetTicketCollection();

    return ok(result);
  } catch (error) {
    return errorResponse(error);
  }
}

function isSamePassword(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  return (
    inputBuffer.length === expectedBuffer.length &&
    timingSafeEqual(inputBuffer, expectedBuffer)
  );
}
