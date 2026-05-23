"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ModalFrame } from "@jyh-dev/kit";
import { PackageCheck, ShieldCheck, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";

const INTRO_MODAL_HIDDEN_UNTIL_KEY = "supporthub:intro-modal-hidden-until";

const kitFeatures = [
  "createQueryService",
  "promise-modal",
  "useUrlState",
  "useSelection",
  "usePagination",
  "useFile",
  "useObjectState",
  "table-primitives",
  "realtime SSE",
];

const techStacks = [
  "Next.js App Router",
  "TypeScript",
  "MongoDB Atlas",
  "S3 presigned URL",
  "Tanstack Query",
  "React Hook Form",
  "Zod",
  "Tailwind CSS",
  "Storybook",
  "Sentry",
];

export function ProjectIntroModal() {
  const shouldShowIntro = useSyncExternalStore(
    subscribeIntroPreference,
    shouldShowIntroModal,
    () => false,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const isOpen = shouldShowIntro && !isDismissed;

  const close = useCallback(() => {
    if (hideToday) {
      window.localStorage.setItem(
        INTRO_MODAL_HIDDEN_UNTIL_KEY,
        String(getEndOfToday()),
      );
    }

    setIsDismissed(true);
  }, [hideToday]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  if (!isOpen) return null;

  return (
    <ModalFrame.Root zIndex={10}>
      <ModalFrame.Panel className="flex max-h-[90vh] w-[min(600px,calc(100vw-2rem))] max-w-none flex-col overflow-hidden">
        <ModalFrame.Header
          title="SupportHub Admin"
          className="pb-4"
          onClose={close}
        />
        <ModalFrame.Body className="space-y-5 overflow-auto">
          <p className="text-sm leading-6 text-slate-700">
            이 프로젝트는 자체 개발 라이브러리{" "}
            <strong className="font-extrabold text-ink">@jyh-dev/kit</strong>을
            실제 관리자 콘솔 개발에 적용해본 고객문의 헬프데스크 샘플입니다.
            문의 목록, 문의 생성, 상세 답변, 첨부파일 업로드, 대시보드, 긴급
            문의 알림 등의 기능에 활용했습니다.
          </p>

          <section>
            <h3 className="text-sm font-extrabold text-ink">
              @jyh-dev/kit 적용 기능
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {kitFeatures.map((feature) => (
                <span
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700"
                  key={feature}
                >
                  {feature}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-extrabold text-ink">기술 스택</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {techStacks.map((stack) => (
                <div
                  className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
                  key={stack}
                >
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  {stack}
                </div>
              ))}
            </div>
          </section>
        </ModalFrame.Body>

        <ModalFrame.Footer className="flex-col gap-3  sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              checked={hideToday}
              className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              onChange={(event) => setHideToday(event.target.checked)}
              type="checkbox"
            />
            오늘 하루 보지 않기
          </label>

          <Button className="sm:w-24" onClick={close} type="button">
            확인
          </Button>
        </ModalFrame.Footer>
      </ModalFrame.Panel>
    </ModalFrame.Root>
  );
}

function getEndOfToday() {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return endOfToday.getTime();
}

function shouldShowIntroModal() {
  const hiddenUntil = Number(
    window.localStorage.getItem(INTRO_MODAL_HIDDEN_UNTIL_KEY),
  );

  return !Number.isFinite(hiddenUntil) || hiddenUntil <= Date.now();
}

function subscribeIntroPreference(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}
