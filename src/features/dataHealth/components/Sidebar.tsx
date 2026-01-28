import { AlertCircle, Clock, Settings, SlidersHorizontal, Wrench } from "lucide-react";
import type { NavKey } from "../../../types";
import { cx } from "../../../utils/cx";
import StatMini from "../../../components/StatMini";

export default function Sidebar({
  nav,
  setNav,
  counts,
}: {
  nav: NavKey;
  setNav: (k: NavKey) => void;
  counts: { open: number; blockers: number; majors: number; minors: number };
}) {
  const items: { key: NavKey; label: string; icon: any; hint?: string }[] = [
    { key: "overview", label: "Overview", icon: SlidersHorizontal },
    {
      key: "issues",
      label: "Issues",
      icon: AlertCircle,
      hint: `${counts.open} open`,
    },
    { key: "config", label: "Configuration", icon: Settings },
    { key: "sync", label: "Sync & Activity", icon: Clock },
    { key: "diffs", label: "Snapshots & Diffs", icon: Wrench },
  ];

  return (
    <aside className="col-span-12 lg:col-span-3">
      <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-3">
        <div className="px-3 py-2 text-xs font-semibold text-zinc-600">
          NAVIGATION
        </div>
        <div className="mt-1 flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = nav === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setNav(it.key)}
                className={cx(
                  "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-zinc-900 text-white"
                    : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className={cx(
                      "h-4 w-4",
                      active ? "text-white" : "text-zinc-700"
                    )}
                  />
                  {it.label}
                </span>
                {it.hint ? (
                  <span
                    className={cx(
                      "text-xs",
                      active ? "text-white/80" : "text-zinc-600"
                    )}
                  >
                    {it.hint}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black" />
            Quick stats
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <StatMini label="Blockers" value={counts.blockers} />
            <StatMini label="Majors" value={counts.majors} />
            <StatMini label="Minors" value={counts.minors} />
          </div>
        </div>
      </div>
    </aside>
  );
}
