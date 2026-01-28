import React, { useMemo, useState } from "react";
import { Database, Wrench } from "lucide-react";
import Card from "../../../components/common/Card";
import Pill from "../../../components/common/Pill";
import Select from "../../../components/common/Select";
import DiffBox from "../../../components/DiffBox";
import type { DiffItem, Snapshot } from "../../../types";
import { cx } from "../../../utils/cx";

export default function DiffsScreen({
  snapshots,
  diff,
}: {
  snapshots: Snapshot[];
  diff: DiffItem[];
}) {
  const planRuns = snapshots.filter((s) => s.kind === "PLAN_RUN");
  const [selectedPlan, setSelectedPlan] = useState<string>(
    planRuns[0]?.id ?? ""
  );

  const replanRecommendation = useMemo(() => {
    const wo = diff.find((d) => d.objectType === "WorkOrder");
    const machine = diff.find((d) => d.objectType === "Machine");
    const woChange = (wo?.added?.length ?? 0) + (wo?.removed?.length ?? 0) > 0;
    const machineChange = (machine?.modified ?? []).some((m) =>
      m.changes.some((c) =>
        String(c.field).toLowerCase().includes("availability")
      )
    );
    const yes = woChange || machineChange;
    return {
      yes,
      reasons: [
        woChange ? "Work orders changed" : null,
        machineChange ? "Machine availability changed" : null,
      ].filter(Boolean) as string[],
    };
  }, [diff]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold">Snapshots & Diffs</div>
          <div className="text-sm text-zinc-600">
            Compare plan-run inputs with current reality.
          </div>
        </div>
        <div className="min-w-[280px]">
          <Select
            label="Plan run"
            value={selectedPlan}
            onChange={setSelectedPlan}
            options={planRuns.map((s) => ({ value: s.id, label: s.label }))}
          />
        </div>
      </div>

      <Card
        title="Decision"
        icon={Wrench}
        right={
          <Pill
            className={cx(
              "border",
              replanRecommendation.yes
                ? "bg-black text-white border-black"
                : "bg-zinc-900/5 border-zinc-200 text-zinc-900"
            )}
          >
            {replanRecommendation.yes
              ? "Re-plan recommended"
              : "Plan still valid"}
          </Pill>
        }
      >
        {replanRecommendation.yes ? (
          <div className="text-sm text-zinc-700">
            Reasons:{" "}
            <span className="font-medium text-zinc-900">
              {replanRecommendation.reasons.join(", ")}
            </span>
          </div>
        ) : (
          <div className="text-sm text-zinc-700">
            No planning-critical differences detected (heuristic).
          </div>
        )}
      </Card>

      {diff.map((d) => (
        <Card key={d.objectType} title={`${d.objectType} changes`} icon={Database}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DiffBox title="Added" items={d.added} />
            <DiffBox title="Removed" items={d.removed} />
            <div className="rounded-3xl border border-zinc-200 bg-white p-4">
              <div className="text-sm font-semibold">Modified</div>
              <div className="mt-2 space-y-2">
                {d.modified.length === 0 ? (
                  <div className="text-sm text-zinc-600">None</div>
                ) : (
                  d.modified.map((m) => (
                    <div
                      key={m.key}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
                    >
                      <div className="text-sm font-semibold">{m.key}</div>
                      <div className="mt-2 space-y-1 text-sm text-zinc-700">
                        {m.changes.map((c, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="text-zinc-600">{c.field}</span>
                            <span className="font-mono text-xs text-zinc-700">
                              {String(c.before)} → {String(c.after)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
