import { Database } from "lucide-react";
import type { SyncRun } from "../../../types";
import { cx } from "../../../utils/cx";
import Button from "../../../components/common/Button";
import Pill from "../../../components/common/Pill";

export default function SyncScreen({
  runs,
  onSync,
}: {
  runs: SyncRun[];
  onSync: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Sync</div>
        </div>
        <Button onClick={onSync}>
          <Database className="h-4 w-4" />
          Sync now
        </Button>
      </div>

      <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 text-sm font-semibold">
          History
        </div>
        <div className="divide-y divide-zinc-100">
          {runs.map((r) => (
            <div key={r.id} className="px-5 py-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {r.startedAt}
                  </div>
                  <div className="text-sm text-zinc-600">
                    {r.status === "SUCCESS" ? "Success" : "Failed"} •{" "}
                    {r.rowsUpdated} rows • {r.durationSec}s
                  </div>
                </div>
                <Pill
                  className={cx(
                    "border",
                    r.status === "SUCCESS"
                      ? "bg-zinc-900/5 border-zinc-200"
                      : "bg-black text-white border-black"
                  )}
                >
                  {r.status}
                </Pill>
              </div>

              {r.status === "FAILED" && r.error ? (
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                  {r.error}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
