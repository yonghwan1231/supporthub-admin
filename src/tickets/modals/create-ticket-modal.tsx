"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ModalFrame } from "@jyh-dev/kit";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/common/components/ui/button";
import { Input, Select, Textarea } from "@/common/components/ui/field";
import {
  categoryLabels,
  priorityLabels,
  ticketCategories,
  ticketPriorities,
} from "@/tickets/constants/ticket-labels";
import { createTicketFormSchema } from "@/tickets/schema/ticket.schemas";
import { ticketService } from "@/tickets/services/ticket.service";
import type { CreateTicketFormValues } from "@/tickets/schema/ticket.schemas";
import type { CustomModalProps } from "@jyh-dev/kit";

export function CreateTicketModal({
  close,
  resolve,
}: CustomModalProps<void, $Ticket.CreateTicketResponse>) {
  const createTicket = ticketService.mutations.useCreateTicket();
  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketFormSchema),
    defaultValues: {
      category: "general",
      content: "",
      customerEmail: "",
      customerName: "",
      priority: "medium",
      tagsText: "",
      title: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const ticket = await createTicket.mutateAsync({
        ...values,
        tags: parseTags(values.tagsText),
      });

      resolve(ticket);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "문의 생성 중 오류가 발생했습니다.",
      });
    }
  });

  const closeModal = () => {
    if (isSubmitting) return;
    close("close-button");
  };

  return (
    <ModalFrame.Root closeOnBackdrop={!isSubmitting} onClose={closeModal}>
      <ModalFrame.Panel className="w-auto max-w-none">
        <ModalFrame.Header
          className="pb-4"
          title="문의 생성"
          onClose={closeModal}
        />
        <ModalFrame.Body className="overflow-auto">
          <form className="flex min-h-0 flex-1 flex-col gap-4">
            <FieldError message={form.formState.errors.root?.message} />

            <div className="grid gap-4 grid-cols-2">
              <label>
                <FieldLabel>고객명</FieldLabel>
                <Input
                  aria-invalid={Boolean(form.formState.errors.customerName)}
                  placeholder="홍길동"
                  {...form.register("customerName")}
                />
                <FieldError
                  message={form.formState.errors.customerName?.message}
                />
              </label>

              <label>
                <FieldLabel>이메일</FieldLabel>
                <Input
                  aria-invalid={Boolean(form.formState.errors.customerEmail)}
                  placeholder="customer@example.com"
                  type="email"
                  {...form.register("customerEmail")}
                />
                <FieldError
                  message={form.formState.errors.customerEmail?.message}
                />
              </label>
            </div>

            <label>
              <FieldLabel>제목</FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.title)}
                placeholder="문의 제목을 입력하세요."
                {...form.register("title")}
              />
              <FieldError message={form.formState.errors.title?.message} />
            </label>

            <div className="grid gap-4 grid-cols-2">
              <label>
                <FieldLabel>분류</FieldLabel>
                <Select
                  aria-invalid={Boolean(form.formState.errors.category)}
                  {...form.register("category")}
                >
                  {ticketCategories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
                </Select>
                <FieldError message={form.formState.errors.category?.message} />
              </label>

              <label>
                <FieldLabel>우선순위</FieldLabel>
                <Select
                  aria-invalid={Boolean(form.formState.errors.priority)}
                  {...form.register("priority")}
                >
                  {ticketPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabels[priority]}
                    </option>
                  ))}
                </Select>
                <FieldError message={form.formState.errors.priority?.message} />
              </label>
            </div>

            <label>
              <FieldLabel>태그</FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.tagsText)}
                placeholder="결제, VIP, 모바일"
                {...form.register("tagsText")}
              />
              <FieldHint>쉼표로 구분해 최대 8개까지 저장됩니다.</FieldHint>
              <FieldError message={form.formState.errors.tagsText?.message} />
            </label>

            <label>
              <FieldLabel>문의 내용</FieldLabel>
              <Textarea
                aria-invalid={Boolean(form.formState.errors.content)}
                placeholder="고객이 문의한 내용을 입력하세요."
                {...form.register("content")}
              />
              <FieldError message={form.formState.errors.content?.message} />
            </label>
          </form>
        </ModalFrame.Body>

        <ModalFrame.Footer>
          <Button
            disabled={isSubmitting}
            onClick={closeModal}
            type="button"
            variant="ghost"
          >
            취소
          </Button>
          <Button disabled={isSubmitting} type="submit" onClick={onSubmit}>
            {isSubmitting ? (
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? "생성 중" : "문의 생성"}
          </Button>
        </ModalFrame.Footer>
      </ModalFrame.Panel>
    </ModalFrame.Root>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
      {children}
    </span>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-muted">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1.5 text-sm text-danger">{message}</p>;
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8);
}
