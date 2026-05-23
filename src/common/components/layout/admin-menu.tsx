"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, DatabaseBackup, UserCircle } from "lucide-react";
import { apiClient } from "@/common/lib/apiClient";
import { appModal } from "@/common/modals/app-modal";

type ResetDataResult = {
  deletedCount: number;
  insertedCount: number;
};

export function AdminMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const modal = appModal.useModal();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const resetData = async () => {
    setOpen(false);

    const reset = {
      result: null as ResetDataResult | null,
    };
    const password = await modal.prompt({
      title: "데이터 초기화",
      description: "현재 문의 데이터를 seed 초기 데이터로 다시 설정합니다.",
      label: "Password",
      placeholder: "초기화 비밀번호",
      inputType: "password",
      required: "초기화 비밀번호를 입력해주세요.",
      trim: true,
      closeOnBackdrop: false,
      confirmText: "초기화",
      cancelText: "취소",
      tone: "danger",
      confirmButton: {
        loadingText: "초기화",
        action: async ({ button }) => {
          reset.result = await apiClient.post<ResetDataResult>(
            "/api/admin/reset-data",
            { password: button.value ?? "" },
          );
        },
      },
    });

    if (!password || !reset.result) return;

    await queryClient.invalidateQueries();
    await modal.alert({
      title: "데이터를 초기화했습니다.",
      description: `기존 ${reset.result.deletedCount}개 문의를 삭제하고 ${reset.result.insertedCount}개 초기 문의를 다시 생성했습니다.`,
    });
  };

  return (
    <div className="relative ml-auto" ref={rootRef}>
      <button
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-ink transition hover:bg-slate-100"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <UserCircle className="text-muted" size={24} />
        Admin
        <ChevronDown
          className="text-muted transition"
          data-open={open ? "true" : undefined}
          size={16}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-md border border-line bg-white py-1 shadow-lg">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
            onClick={() => void resetData()}
            type="button"
          >
            <DatabaseBackup className="h-4 w-4" />
            데이터 초기화
          </button>
        </div>
      ) : null}
    </div>
  );
}
