import React, { useState } from "react";
import { ChevronRight, Database } from "lucide-react";
import { DataHealthPage } from "./features/dataHealth";
import type { NavKey } from "./types";

type AppSection = "dataHealth" | "schedule" | "reports";

function cx(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function App() {
  const [section, setSection] = useState<AppSection>("dataHealth");
  const [dataHealthNav, setDataHealthNav] = useState<NavKey>("overview");
  const [dataHealthOpen, setDataHealthOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: NAVI SUPER-APP NAV */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-3">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-600">
                NAVI
              </div>

              <div className="mt-1 flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (section === "dataHealth") {
                      setDataHealthOpen((prev) => !prev);
                      return;
                    }
                    setDataHealthOpen(true);
                  }}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    section === "dataHealth"
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 text-zinc-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Database
                      className={cx(
                        "h-4 w-4",
                        section === "dataHealth"
                          ? "text-white"
                          : "text-zinc-700"
                      )}
                    />
                    Data Health
                  </span>
                  <ChevronRight
                    className={cx(
                      "h-4 w-4 transition-transform",
                      section === "dataHealth"
                        ? "text-white/80"
                        : "text-zinc-500"
                    )}
                    style={{
                      transform: dataHealthOpen ? "rotate(90deg)" : "rotate(0)",
                    }}
                  />
                </button>

                {dataHealthOpen ? (
                  <div className="mt-1 ml-2 flex flex-col gap-1">
                    {(
                      [
                        { key: "overview", label: "Overview" },
                        { key: "issues", label: "Issues" },
                        { key: "config", label: "Configuration" },
                        { key: "sync", label: "Sync & Activity" },
                        { key: "diffs", label: "Snapshots & Diffs" },
                      ] as { key: NavKey; label: string }[]
                    ).map((item) => {
                      const active = dataHealthNav === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setSection("dataHealth");
                            setDataHealthNav(item.key);
                          }}
                          className={cx(
                            "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                            active
                              ? "bg-zinc-900 text-white"
                              : "hover:bg-zinc-100 text-zinc-900"
                          )}
                        >
                          <span>{item.label}</span>
                          {active ? (
                            <span className="text-xs text-white/80">Active</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <button
                  onClick={() => setSection("schedule")}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    section === "schedule"
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 text-zinc-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Database
                      className={cx(
                        "h-4 w-4",
                        section === "schedule"
                          ? "text-white"
                          : "text-zinc-700"
                      )}
                    />
                    Schedule
                  </span>
                  <span
                    className={cx(
                      "text-xs",
                      section === "schedule"
                        ? "text-white/80"
                        : "text-zinc-600"
                    )}
                  >
                    Module
                  </span>
                </button>

                <button
                  onClick={() => setSection("reports")}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    section === "reports"
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 text-zinc-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Database
                      className={cx(
                        "h-4 w-4",
                        section === "reports"
                          ? "text-white"
                          : "text-zinc-700"
                      )}
                    />
                    Reports
                  </span>
                  <span
                    className={cx(
                      "text-xs",
                      section === "reports"
                        ? "text-white/80"
                        : "text-zinc-600"
                    )}
                  >
                    Module
                  </span>
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs font-semibold text-zinc-700">
                  Workspace
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  This is the “super app” shell. More modules can be added
                  later.
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: MODULE CONTENT */}
          <main className="col-span-12 lg:col-span-9">
            {section === "dataHealth" ? (
              <DataHealthPage nav={dataHealthNav} setNav={setDataHealthNav} />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
