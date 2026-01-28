import { useState } from "react";
import { ChevronLeft, ChevronRight, Database, X } from "lucide-react";
import { DataHealthPage } from "./features/dataHealth";
import type { NavKey } from "./types";

type AppSection = "dataHealth" | "schedule" | "reports";

function cx(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

type AppTab =
  | { id: string; section: "dataHealth"; nav: NavKey; label: string }
  | { id: string; section: "schedule"; label: string }
  | { id: string; section: "reports"; label: string };

export default function App() {
  const [section, setSection] = useState<AppSection>("dataHealth");
  const [dataHealthNav, setDataHealthNav] = useState<NavKey>("overview");
  const [dataHealthOpen, setDataHealthOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tabs, setTabs] = useState<AppTab[]>([
    { id: "dataHealth:overview", section: "dataHealth", nav: "overview", label: "Overview" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("dataHealth:overview");

  const openDataHealthTab = (nav: NavKey, label: string) => {
    const id = `dataHealth:${nav}`;
    setTabs((prev) => {
      if (prev.some((t) => t.id === id)) return prev;
      return [...prev, { id, section: "dataHealth", nav, label }];
    });
    setActiveTabId(id);
    setSection("dataHealth");
    setDataHealthNav(nav);
  };

  const openSectionTab = (nextSection: "schedule" | "reports", label: string) => {
    const id = `${nextSection}`;
    setTabs((prev) => {
      if (prev.some((t) => t.id === id)) return prev;
      return [...prev, { id, section: nextSection, label }];
    });
    setActiveTabId(id);
    setSection(nextSection);
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        return [{ id: "dataHealth:overview", section: "dataHealth", nav: "overview", label: "Overview" }];
      }
      return next;
    });
    setActiveTabId((prevActive) => {
      if (prevActive !== id) return prevActive;
      const remaining = tabs.filter((t) => t.id !== id);
      return (remaining[remaining.length - 1] ?? tabs[0]).id;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: NAVI SUPER-APP NAV */}
          <aside
            className={cx(
              "col-span-12",
              sidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"
            )}
          >
            <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-3">
              <div className="px-3 py-2 flex items-center justify-between">
                {!sidebarCollapsed ? (
                  <div className="text-xs font-semibold text-zinc-600">NAVI</div>
                ) : (
                  <div className="w-6" />
                )}
                <button
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  className="h-8 w-8 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center hover:bg-zinc-200"
                  title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
                  aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
                >
                  <ChevronLeft
                    className={cx(
                      "h-4 w-4 transition-transform",
                      sidebarCollapsed ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>
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
                      : "hover:bg-zinc-100 text-zinc-900",
                    sidebarCollapsed && "justify-center px-2"
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
                    {!sidebarCollapsed ? "Data Health" : null}
                  </span>
                  {!sidebarCollapsed ? (
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
                  ) : null}
                </button>

                {dataHealthOpen && !sidebarCollapsed ? (
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
                            openDataHealthTab(item.key, item.label);
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
                  onClick={() => openSectionTab("schedule", "Schedule")}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    section === "schedule"
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 text-zinc-900",
                    sidebarCollapsed && "justify-center px-2"
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
                    {!sidebarCollapsed ? "Schedule" : null}
                  </span>
                  {!sidebarCollapsed ? (
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
                  ) : null}
                </button>

                <button
                  onClick={() => openSectionTab("reports", "Reports")}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                    section === "reports"
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 text-zinc-900",
                    sidebarCollapsed && "justify-center px-2"
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
                    {!sidebarCollapsed ? "Reports" : null}
                  </span>
                  {!sidebarCollapsed ? (
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
                  ) : null}
                </button>
              </div>

              {!sidebarCollapsed ? (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-xs font-semibold text-zinc-700">
                    Workspace
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">
                    This is the “super app” shell. More modules can be added
                    later.
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          {/* RIGHT: MODULE CONTENT */}
          <main
            className={cx(
              "col-span-12",
              sidebarCollapsed ? "lg:col-span-11" : "lg:col-span-9"
            )}
          >
            <div className="mb-4 flex items-center gap-2 overflow-x-auto">
              {tabs.map((tab) => {
                const active = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    className={cx(
                      "group inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm",
                      active
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white border-zinc-200 text-zinc-700"
                    )}
                    onClick={() => {
                      setActiveTabId(tab.id);
                      setSection(tab.section);
                      if (tab.section === "dataHealth") {
                        setDataHealthNav(tab.nav);
                      }
                    }}
                  >
                    <span>{tab.label}</span>
                    <button
                      className={cx(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        active ? "hover:bg-white/10" : "hover:bg-zinc-100"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      aria-label={`Close ${tab.label}`}
                    >
                      <X className={cx("h-3 w-3", active ? "text-white" : "text-zinc-500")} />
                    </button>
                  </div>
                );
              })}
            </div>

            {section === "dataHealth" ? (
              <DataHealthPage nav={dataHealthNav} setNav={setDataHealthNav} />
            ) : section === "schedule" ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                Schedule module placeholder.
              </div>
            ) : section === "reports" ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                Reports module placeholder.
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
