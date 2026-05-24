"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareReply,
  TicketCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { formatDateTime } from "@/common/lib/format";
import { dashboardService } from "@/dashboard/services/dashboard.service";
import { PriorityBadge, StatusBadge } from "@/tickets/components/ticket-badges";
import { DashboardSkeleton } from "../components/dashboard-skeleton";
import type { LucideIcon } from "lucide-react";

const DashboardTrendChart = dynamic(
  () =>
    import("@/dashboard/components/dashboard-trend-chart").then(
      (module) => module.DashboardTrendChart,
    ),
  {
    loading: () => <div className="h-full rounded-md bg-slate-50" />,
    ssr: false,
  },
);

const emptySummary: $Dashboard.SummaryResponse = {
  metrics: {
    completionRate: 0,
    newTicketsLast24h: 0,
    pendingTickets: 0,
    resolvedTickets: 0,
    totalTickets: 0,
    urgentPendingTickets: 0,
  },
  priorityQueue: [],
  recentActivities: [],
  recentTickets: [],
  statusSummary: [],
  trend: [],
};

const statusBarClassName: Record<$Ticket.Status, string> = {
  open: "bg-amber-500",
  in_progress: "bg-cyan-600",
  resolved: "bg-emerald-600",
  hold: "bg-slate-500",
};

const activityIcon = {
  created: Inbox,
  reply: MessageSquareReply,
  resolved: CheckCircle2,
};

export function DashboardPage() {
  const { data, isError, isFetching, isLoading } =
    dashboardService.queries.useGetDashboard();
  const summary = data ?? emptySummary;
  const { metrics } = summary;

  if (isLoading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <section className="page inner overflow-auto">
      <header className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">대시보드</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            문의 유입, 처리 상태, 우선 처리 대상을 한 화면에서 확인합니다.
          </p>
        </div>
        {isFetching ? (
          <span className="inline-flex w-fit items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-brand">
            업데이트 중
          </span>
        ) : null}
      </header>

      {isError ? (
        <section className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          대시보드 데이터를 불러오지 못했습니다.
        </section>
      ) : null}

      <section className="grid gap-3 grid-cols-4">
        <MetricCard
          description="최근 24시간 기준"
          icon={Inbox}
          isLoading={isLoading}
          title="신규 문의"
          value={`${metrics.newTicketsLast24h}건`}
        />
        <MetricCard
          description="완료 전 상태의 문의"
          icon={Clock3}
          isLoading={isLoading}
          title="처리 대기"
          value={`${metrics.pendingTickets}건`}
        />
        <MetricCard
          description={`${metrics.resolvedTickets}/${metrics.totalTickets}건 해결 상태`}
          icon={TicketCheck}
          isLoading={isLoading}
          title="처리 완료율"
          value={`${metrics.completionRate}%`}
        />
        <MetricCard
          description="우선 처리 필요"
          icon={AlertTriangle}
          isLoading={isLoading}
          tone="danger"
          title="미해결 긴급"
          value={`${metrics.urgentPendingTickets}건`}
        />
      </section>

      <section className="grid gap-4 grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <DashboardPanel
          description="최근 7일 기준"
          title="문의 유입 및 해결 추이"
        >
          <div className="h-100 mt-10">
            <DashboardTrendChart data={summary.trend} />
          </div>
        </DashboardPanel>

        <div className="grid gap-4">
          <DashboardPanel description="전체 문의 기준" title="상태별 문의">
            <div className="space-y-4">
              {summary.statusSummary.map((item) => (
                <div
                  className="grid grid-cols-[72px_minmax(0,1fr)_42px] items-center gap-3 text-sm"
                  key={item.status}
                >
                  <span className="text-ink">{item.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${statusBarClassName[item.status]}`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  <span className="text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel description="긴급/높음 우선순위" title="우선 처리">
            <div className="divide-y divide-line">
              {summary.priorityQueue.length > 0 ? (
                summary.priorityQueue.map((ticket) => (
                  <Link
                    className="grid gap-2 py-3 first:pt-0 last:pb-0"
                    href={`/tickets/${ticket.id}`}
                    key={ticket.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm text-ink">
                        {ticket.title}
                      </p>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs text-muted">
                      <span>{ticket.customerName}</span>
                      <span className="font-semibold">
                        {formatDateTime(ticket.updatedAt)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyText>우선 처리할 문의가 없습니다.</EmptyText>
              )}
            </div>
          </DashboardPanel>
        </div>
      </section>

      <section className="grid gap-4 grid-cols-2">
        <DashboardPanel description="최신 접수 순" title="최근 문의">
          <div className="overflow-hidden rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-muted border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left">문의</th>
                  <th className="px-4 py-3 text-left">고객</th>
                  <th className="px-4 py-3 text-left">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {summary.recentTickets.map((ticket) => (
                  <tr className="bg-white" key={ticket.id}>
                    <td className="px-4 py-3">
                      <Link
                        className="text-ink hover:text-brand"
                        href={`/tickets/${ticket.id}`}
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {ticket.customerName}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <DashboardPanel description="문의 접수/답변/완료" title="최근 활동">
          <div className="space-y-3">
            {summary.recentActivities.length > 0 ? (
              summary.recentActivities.map((activity) => {
                const Icon = activityIcon[activity.type];

                return (
                  <Link
                    className="flex items-start gap-3 rounded-md border border-line bg-white px-3 py-3 transition hover:border-brand/30 hover:bg-blue-50/40"
                    href={`/tickets/${activity.ticketId}`}
                    key={activity.id}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-600">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {activity.title}
                      </span>
                      <span className=" block truncate text-sm text-muted">
                        {activity.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-muted">
                      {formatDateTime(activity.at)}
                    </span>
                  </Link>
                );
              })
            ) : (
              <EmptyText>최근 활동이 없습니다.</EmptyText>
            )}
          </div>
        </DashboardPanel>
      </section>
    </section>
  );
}

function MetricCard({
  description,
  icon: Icon,
  isLoading,
  title,
  tone = "default",
  value,
}: {
  description: string;
  icon: LucideIcon;
  isLoading: boolean;
  title: string;
  tone?: "danger" | "default";
  value: string;
}) {
  return (
    <article className="rounded-md border border-line bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-ink">
            {isLoading ? "-" : value}
          </p>
        </div>
        <span
          className={
            tone === "danger"
              ? "grid h-10 w-10 place-items-center rounded-md bg-red-50 text-red-600"
              : "grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-brand"
          }
        >
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-xs text-muted">{description}</p>
    </article>
  );
}

function DashboardPanel({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-md border border-line bg-panel">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-sm font-black text-ink">{title}</h2>
        <span className="text-xs text-muted">{description}</span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-slate-50 px-3 py-8 text-center text-sm font-semibold text-muted">
      {children}
    </p>
  );
}
