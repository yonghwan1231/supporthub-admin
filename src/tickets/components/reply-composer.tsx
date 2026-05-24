"use client";

import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAsyncAction,
  useDraftForm,
  useFileUploader,
  usePromiseModal,
} from "@jyh-dev/kit";
import axios from "axios";
import { Paperclip, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/field";
import { cn } from "@/common/lib/cn";
import { formatFileSize } from "@/common/lib/format";
import { replyFormSchema } from "@/tickets/schema/ticket.schemas";
import { ticketService } from "@/tickets/services/ticket.service";
import type { ReplyFormValues } from "@/tickets/schema/ticket.schemas";

export function ReplyComposer({ ticketId }: { ticketId: string }) {
  const modal = usePromiseModal();
  const addReply = ticketService.mutations.useAddReply();
  const fileInputId = useId();
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      message: "",
    },
  });
  const draft = useDraftForm({
    key: `supporthub:reply:${ticketId}`,
    form,
    storage: "localStorage",
    debounceMs: 500,
    expireIn: "7d",
    shouldSave: ({ values }) => values.message.trim().length > 0,
  });
  const uploader = useFileUploader<
    $Ticket.Attachment,
    $Ticket.PresignUploadResponse,
    void
  >({
    accept: ["png", "jpeg", "jpg", "pdf", "txt"],
    maxFiles: 5,
    maxFileSize: 20,
    maxFileSizeUnit: "MB",
    uploadMode: "manual",
    concurrency: 3,
    presign: (fileItem) =>
      ticketService.api.mutation.presignUpload({
        fileName: fileItem.name,
        contentType: fileItem.type || "application/octet-stream",
        size: fileItem.size,
      }),
    upload: async ({ fileItem, presigned, signal, onProgress }) => {
      await axios.put(presigned.uploadUrl, fileItem.file, {
        signal,
        headers: {
          "Content-Type": fileItem.type || "application/octet-stream",
        },
        onUploadProgress: (event) => {
          onProgress(event.total ? event.loaded / event.total : 0);
        },
      });
    },
    mapUploaded: ({ fileItem, presigned }) => ({
      id: crypto.randomUUID(),
      originalName: fileItem.name,
      fileUrl: presigned.fileUrl,
      fileKey: presigned.key,
      fileSize: fileItem.size,
      contentType: fileItem.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
    }),
    onValidationError: (errors) => {
      void modal.alert({
        title: "파일을 첨부할 수 없습니다.",
        description: errors[0]?.message ?? "파일 검증에 실패했습니다.",
      });
    },
    onUploadError: (error, item) => {
      void modal.alert({
        title: "파일 업로드 실패",
        description: `${item.name}: ${error.message}`,
      });
    },
  });

  const submitAction = useAsyncAction<[], void>({
    action: async () => {
      const values = form.getValues();
      const uploadedItems = await uploader.uploadAll();
      const attachments = uploadedItems
        .map((item) => item.uploaded)
        .filter((item): item is $Ticket.Attachment => Boolean(item));

      await addReply.mutateAsync({
        ticketId,
        message: values.message,
        attachments,
      });

      draft.clear();
      form.reset({ message: "" });
      uploader.clearFiles();
    },
  });

  const onSubmit = form.handleSubmit(async () => {
    const ok = await modal.confirm({
      title: "답변을 등록할까요?",
      description: "답변을 등록하면 문의 상태가 처리중으로 변경됩니다.",
      confirmText: "등록",
      cancelText: "취소",
    });

    if (!ok) return;
    const result = await submitAction.run();

    if (!result.ok) {
      await modal.alert({
        title: "답변 등록 실패",
        description: result.error.message,
      });
    }
  });

  return (
    <form
      className="rounded-md border border-line bg-panel p-5"
      onSubmit={onSubmit}
    >
      <div className="flex gap-2 items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">답변 작성</h2>
          <p className="mt-1 text-sm text-muted">
            작성 중인 답변은 localStorage에 임시 저장됩니다.
          </p>
        </div>
        {draft.hasDraft ? (
          <div className="flex gap-2">
            <Button
              onClick={() => draft.restore()}
              type="button"
              variant="secondary"
            >
              임시저장 복원
            </Button>
            <Button
              onClick={() => draft.discard()}
              type="button"
              variant="ghost"
            >
              삭제
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <Textarea
          placeholder="고객에게 전달할 답변을 입력하세요."
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="mt-2 text-sm font-semibold text-rose-600">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="mt-4 rounded-md border border-dashed border-line bg-slate-50 p-4">
        <label
          aria-disabled={Boolean(uploader.inputProps.disabled)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100",
            uploader.inputProps.disabled && "pointer-events-none opacity-60",
          )}
          htmlFor={fileInputId}
        >
          <Paperclip className="h-4 w-4" />
          파일 첨부
        </label>
        <input id={fileInputId} hidden {...uploader.inputProps} />

        {uploader.items.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {uploader.items.map((item) => (
              <li
                className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm ring-1 ring-line"
                key={item.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(item.size)} · {item.status}
                    {item.status === "uploading"
                      ? ` · ${Math.round(item.progress * 100)}%`
                      : null}
                  </p>
                </div>
                <button
                  aria-label={`${item.name} 제거`}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => uploader.removeFile(item.id)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          disabled={submitAction.isLoading || uploader.isUploading}
          type="submit"
        >
          <Send className="h-4 w-4" />
          {submitAction.isLoading || uploader.isUploading
            ? "등록 중"
            : "답변 등록"}
        </Button>
      </div>
    </form>
  );
}
