import { Inbox, PackageCheck, UserCircle } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs font-semibold uppercase text-blue-200">
            SupportHub
          </p>
          <h1 className="mt-1 text-2xl font-bold">Helpdesk Admin</h1>
        </div>

        <nav className="flex-1 px-3 py-5">
          <p className="px-3 text-xs font-bold uppercase text-slate-500">
            Workspace
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <Link
                className="flex items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-semibold text-ink transition"
                href="/tickets"
              >
                <Inbox className="text-ink" size={18} />
                <span className="text-ink">고객 문의</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center gap-3 text-slate-300">
            <PackageCheck size={18} />
            <span className="text-sm font-semibold">@jyh-dev/kit</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Next Route Handler, MongoDB, S3 presigned URL 기반 적용 예시
          </p>
        </div>
      </aside>

      <div className="min-h-screen min-w-0 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
            <Link className="flex items-center gap-2 lg:hidden" href="/tickets">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-white">
                <PackageCheck size={18} />
              </span>
              <span className="text-sm font-bold text-ink">SupportHub</span>
            </Link>
            <div className="ml-auto flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-ink">
              <UserCircle className="text-muted" size={24} />
              Admin
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-5 pt-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
