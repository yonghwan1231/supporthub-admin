declare global {
  namespace $Common {
    type Attachment = {
      id: string;
      originalName: string;
      fileUrl: string;
      fileKey: string;
      fileSize: number;
      contentType: string;
      uploadedAt: string;
    };

    type PageMeta = {
      page: number;
      size: number;
      totalCount: number;
      totalPages: number;
    };
  }
}

export {};
