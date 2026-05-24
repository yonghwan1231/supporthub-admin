import { FaGithub } from "react-icons/fa";
import { AdminMenu } from "@/common/components/layout/admin-menu";
import { SidebarNav } from "@/common/components/layout/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas min-w-7xl">
      <aside className="w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white flex">
        <div className="border-b border-white/10 px-6 py-6">
          <h1 className="text-xl font-bold uppercase">SupportHub admin</h1>{" "}
          <p className="mt-1 text-xs font-semibold  text-blue-200">
            with @jyh-dev/kit
          </p>
        </div>

        <SidebarNav />

        <div className="border-t border-white/10 px-6 py-5">
          <a
            href="https://github.com/yonghwan1231/supporthub-admin"
            target="blank"
            className="flex items-center gap-3 text-slate-300"
          >
            <FaGithub size={20} />
            <p className="text-sm font-semibold">GitHub Source</p>
          </a>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            @jyh-dev/kit 기반 헬프데스크 어드민 샘플
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-line bg-white/95 px-4  backdrop-blur px-8">
          <div className="mx-auto flex items-center justify-between gap-3">
            <AdminMenu />
          </div>
        </header>
        <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
