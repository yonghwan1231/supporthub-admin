import { NextResponse } from "next/server";
import { errorResponse } from "../../_lib/api-response";
import { createPresignedDownloadUrl } from "../_lib/s3-presign";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key || !key.startsWith("attachments/")) {
      return NextResponse.json(
        { message: "유효한 첨부 파일 경로가 아닙니다." },
        { status: 400 },
      );
    }

    const downloadUrl = await createPresignedDownloadUrl({
      key,
      fileName: searchParams.get("name") ?? undefined,
    });

    return NextResponse.redirect(downloadUrl, { status: 302 });
  } catch (error) {
    return errorResponse(error);
  }
}
