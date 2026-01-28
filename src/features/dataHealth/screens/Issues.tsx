import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import type { Issue, IssueStatus, Severity } from "../../../types";
import { cx } from "../../../utils/cx";
import { severityTone, statusTone } from "../../../utils/dataHealth.tone";
import { sevLabel, typeLabel } from "../../../utils/dataHealth.format";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import EmptyState from "../../../components/common/EmptyState";
import Input from "../../../components/common/Input";
import Pill from "../../../components/common/Pill";
import Select from "../../../components/common/Select";

export type IssuesFilterState = {
  q: string;
  severity: "ALL" | Severity;
  status: "ALL" | IssueStatus;
};

export default function IssuesScreen({
  issues,
  onSelectIssue,
  onRefresh,
  onBulk,
}: {
  issues: Issue[];
  onSelectIssue: (id: string) => void;
  onRefresh: () => void;
  onBulk: (ids: string[], action: "ack" | "suppress" | "resolve") => void;
}) {
  const [filters, setFilters] = useState<IssuesFilterState>({
    q: "",
    severity: "ALL",
    status: "ALL",
  });
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return issues.filter((i) => {
      if (filters.severity !== "ALL" && i.severity !== filters.severity)
        return false;
      if (filters.status !== "ALL" && i.status !== filters.status) return false;
      if (!q) return true;
      const hay =
        `${i.id} ${i.objectType} ${i.objectKey} ${i.ruleName} ${i.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [issues, filters]);

  const selection = useMemo(
    () => Object.keys(selectedIds).filter((k) => selectedIds[k]),
    [selectedIds]
  );

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((i) => selectedIds[i.id]);

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      const next = { ...selectedIds };
      filtered.forEach((i) => (next[i.id] = false));
      setSelectedIds(next);
      return;
    }
    const next = { ...selectedIds };
    filtered.forEach((i) => (next[i.id] = true));
    setSelectedIds(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold">Issues</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <Card title="Filters" icon={Filter}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Input
            value={filters.q}
            onChange={(v) => setFilters((p) => ({ ...p, q: v }))}
            placeholder="Search…"
            icon={Search}
          />
          <Select
            label="Severity"
            value={filters.severity}
            onChange={(v) => setFilters((p) => ({ ...p, severity: v as any }))}
            options={[
              { value: "ALL", label: "All" },
              { value: "BLOCKER", label: "Blocker" },
              { value: "MAJOR", label: "Major" },
              { value: "MINOR", label: "Minor" },
            ]}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v as any }))}
            options={[
              { value: "ALL", label: "All" },
              { value: "OPEN", label: "Open" },
              { value: "ACKNOWLEDGED", label: "Acknowledged" },
              { value: "SUPPRESSED", label: "Suppressed" },
              { value: "RESOLVED", label: "Resolved" },
            ]}
          />
        </div>
      </Card>

      <AnimatePresence>
        {selection.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm">
                <span className="font-semibold">{selection.length}</span>{" "}
                selected
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => onBulk(selection, "ack")}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onBulk(selection, "resolve")}
                >
                  Resolve
                </Button>
                <Button variant="ghost" onClick={() => setSelectedIds({})}>
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No issues"
          subtitle="Try a different filter."
        />
      ) : (
        <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
            <div className="text-sm text-zinc-600">
              {filtered.length} results
            </div>
            <button
              className="text-sm text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-2"
              onClick={toggleAllVisible}
            >
              <span
                className={cx(
                  "h-4 w-4 rounded border flex items-center justify-center",
                  allVisibleSelected
                    ? "bg-black border-black"
                    : "bg-white border-zinc-300"
                )}
              >
                {allVisibleSelected ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : null}
              </span>
              {allVisibleSelected ? "Unselect" : "Select"}
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {filtered.map((i) => {
              const checked = !!selectedIds[i.id];
              return (
                <button
                  key={i.id}
                  onClick={() => onSelectIssue(i.id)}
                  className="w-full text-left px-5 py-4 hover:bg-zinc-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedIds((p) => ({ ...p, [i.id]: !checked }));
                        }}
                        className={cx(
                          "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
                          checked
                            ? "bg-black border-black"
                            : "bg-white border-zinc-300"
                        )}
                      >
                        {checked ? (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        ) : null}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill className={cx("border", severityTone(i.severity))}>
                          {sevLabel(i.severity)}
                        </Pill>
                        <Pill className="bg-white border border-zinc-200 text-zinc-700">
                          {typeLabel(i.type)}
                        </Pill>
                        <Pill className={cx(statusTone(i.status))}>
                          {i.status}
                        </Pill>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-900">
                            {i.objectType} • {i.objectKey}
                          </div>
                          <div className="text-sm text-zinc-600 truncate">
                            {i.message}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-400 flex-none" />
                      </div>

                      <div className="mt-2 text-xs text-zinc-500">
                        Last seen {i.lastSeenAt}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
