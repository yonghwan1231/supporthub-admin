export function DashboardSkeleton() {
  return (
    <section className="page inner overflow-auto">
      <header className="flex flex-col gap-3">
        <SkeletonBlock className="h-9 w-44" />
        <SkeletonBlock className="h-5 w-full max-w-xl" />
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            className="rounded-md border border-line bg-panel p-4"
            key={index}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="mt-4 h-9 w-24" />
              </div>
              <SkeletonBlock className="h-10 w-10 rounded-md" />
            </div>
            <SkeletonBlock className="mt-5 h-3 w-32" />
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <DashboardPanelShell>
          <PanelHeaderSkeleton />
          <div className="p-4">
            <SkeletonBlock className="mt-8 h-[462px] w-full" />
          </div>
        </DashboardPanelShell>

        <div className="grid gap-4">
          <DashboardPanelShell>
            <PanelHeaderSkeleton />
            <div className="space-y-4 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  className="grid grid-cols-[72px_minmax(0,1fr)_42px] items-center gap-3"
                  key={index}
                >
                  <SkeletonBlock className="h-4 w-14" />
                  <SkeletonBlock className="h-3 w-full rounded-full" />
                  <SkeletonBlock className="h-4 w-8" />
                </div>
              ))}
            </div>
          </DashboardPanelShell>

          <DashboardPanelShell>
            <PanelHeaderSkeleton />
            <div className="divide-y divide-line p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  className="grid gap-2 py-3 first:pt-0 last:pb-0"
                  key={index}
                >
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-6 w-14 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBlock className="h-3 w-20" />
                    <SkeletonBlock className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanelShell>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardPanelShell>
          <PanelHeaderSkeleton />
          <div className="p-4">
            <div className="overflow-hidden rounded-md border border-line">
              <div className="grid grid-cols-[minmax(0,1fr)_120px_90px] gap-3 border-b border-line bg-slate-50 px-4 py-3">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-3 w-14" />
                <SkeletonBlock className="h-3 w-14" />
              </div>
              <div className="divide-y divide-line bg-white">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_120px_90px] gap-3 px-4 py-3"
                    key={index}
                  >
                    <SkeletonBlock className="h-4 w-full max-w-52" />
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardPanelShell>

        <DashboardPanelShell>
          <PanelHeaderSkeleton />
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="flex items-start gap-3 rounded-md border border-line bg-white px-3 py-3"
                key={index}
              >
                <SkeletonBlock className="h-9 w-9 rounded-md" />
                <div className="min-w-0 flex-1">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="mt-2 h-3 w-full max-w-64" />
                </div>
                <SkeletonBlock className="h-3 w-20" />
              </div>
            ))}
          </div>
        </DashboardPanelShell>
      </section>
    </section>
  );
}
function PanelHeaderSkeleton() {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-3 w-20" />
    </header>
  );
}

function DashboardPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-panel">
      {children}
    </section>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className ?? ""}`}
    />
  );
}
