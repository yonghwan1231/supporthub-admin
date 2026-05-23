import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

export async function createPresignedUploadUrl({
  contentType,
  fileName,
}: $Ticket.PresignUploadRequest): Promise<$Ticket.PresignUploadResponse> {
  if (!region || !bucketName) {
    throw new Error("AWS_REGION and S3_BUCKET_NAME must be configured.");
  }

  const key = createObjectKey(fileName);
  const client = new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 5 });
  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL ??
    `https://${bucketName}.s3.${region}.amazonaws.com`;

  return {
    uploadUrl,
    fileUrl: `${publicBaseUrl.replace(/\/$/, "")}/${key}`,
    key,
  };
}

export async function createPresignedDownloadUrl({
  fileName,
  key,
}: {
  fileName?: string;
  key: string;
}) {
  if (!region || !bucketName) {
    throw new Error("AWS_REGION and S3_BUCKET_NAME must be configured.");
  }

  const client = new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition: fileName
      ? createContentDisposition(fileName)
      : undefined,
  });

  return getSignedUrl(client, command, { expiresIn: 60 * 5 });
}

function createObjectKey(fileName: string) {
  const safeName = fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `attachments/${date}/${crypto.randomUUID()}-${safeName || "file"}`;
}

function createContentDisposition(fileName: string) {
  const fallbackName = fileName
    .replace(/[^\x20-\x7E]+/g, "_")
    .replace(/["\\]/g, "");

  return `inline; filename="${fallbackName || "file"}"; filename*=UTF-8''${encodeRFC5987Value(fileName)}`;
}

function encodeRFC5987Value(value: string) {
  return encodeURIComponent(value).replace(/['()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}
