"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isUnauthorizedApiError } from "@/common/lib/apiClient";
import { appModal } from "@/common/modals/app-modal";
import { useDeletedTicketAccessStore } from "@/deleted-tickets/stores/deleted-ticket-access.store";

export function useDeletedTicketAccessGate() {
  const modal = appModal.useModal();
  const router = useRouter();
  const promptedRef = useRef(false);
  const { clearPassword, password, setPassword } =
    useDeletedTicketAccessStore();

  useEffect(() => {
    if (password || promptedRef.current) return;

    promptedRef.current = true;
    void (async () => {
      const input = await modal.prompt({
        title: "접근 제한",
        description: "삭제된 문의를 확인하려면 관리자 비밀번호가 필요합니다.",
        label: "Password",
        placeholder: "관리자 비밀번호",
        inputType: "password",
        required: "비밀번호를 입력해주세요.",
        trim: true,
        closeOnBackdrop: false,
        confirmText: "확인",
        cancelText: "대시보드로 이동",
      });

      if (!input) {
        router.replace("/dashboard");
        return;
      }

      setPassword(input);
    })();
  }, [modal, password, router, setPassword]);

  return { clearPassword, password };
}

export function useDeletedTicketUnauthorizedHandler(error: unknown) {
  const modal = appModal.useModal();
  const router = useRouter();
  const handledRef = useRef(false);
  const clearPassword = useDeletedTicketAccessStore(
    (state) => state.clearPassword,
  );

  useEffect(() => {
    if (!error || handledRef.current || !isUnauthorizedApiError(error)) return;

    handledRef.current = true;
    clearPassword();
    void (async () => {
      await modal.alert({
        title: "권한이 없습니다.",
        description: "비밀번호가 올바르지 않거나 접근 권한이 만료되었습니다.",
      });
      router.replace("/dashboard");
    })();
  }, [clearPassword, error, modal, router]);
}
