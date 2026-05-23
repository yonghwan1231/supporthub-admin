type AttachmentLinkTarget = {
  fileKey?: string;
  fileUrl: string;
  originalName?: string;
};

export function getAttachmentDownloadUrl(attachment: AttachmentLinkTarget) {
  if (!attachment.fileKey) return attachment.fileUrl;

  const params = new URLSearchParams({
    key: attachment.fileKey,
  });

  if (attachment.originalName) {
    params.set("name", attachment.originalName);
  }

  return `/api/uploads/download?${params.toString()}`;
}
