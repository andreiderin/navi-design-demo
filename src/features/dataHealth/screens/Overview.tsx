import { AlertCircle, Clock, Database, RefreshCcw, Sparkles, Wrench } from "lucide-react";
import Card from "../../../components/common/Card";
import Pill from "../../../components/common/Pill";
import Button from "../../../components/common/Button";
import Metric from "../../../components/Metric";
import NextStep from "../../../components/NextStep";
import type { SyncRun } from "../../../types";
import { cx } from "../../../utils/cx";

export default function Overview({
  readiness,
  counts,
  lastSync,
  onGoIssues,
  onRefresh,
  onSync,
}: {
  readiness: { label: string; tone: string; icon: any };
  counts: { open: number; blockers: number; majors: number; minors: number };
  lastSync: SyncRun | undefined;
  onGoIssues: () => void;
  onRefresh: () => void;
  onSync: () => void;
}) {
  const Icon = readiness.icon;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          title="Planning Readiness"
          icon={Sparkles}
          right={
            <Pill className={cx("border", readiness.tone)}>
              <Icon className="h-3.5 w-3.5 mr-1" />
              {readiness.label}
            </Pill>
          }
        >
          <div className="text-sm text-zinc-600">
            Readiness is based on open issues by severity. Blockers should be
            resolved before planning.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onGoIssues} variant="secondary">
              <AlertCircle className="h-4 w-4" />
              View issues
            </Button>
            <Button onClick={onRefresh} variant="ghost">
              <RefreshCcw className="h-4 w-4" />
              Refresh checks
            </Button>
          </div>
        </Card>

        <Card title="Open Issues" icon={AlertCircle}>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Blockers" value={counts.blockers} />
            <Metric label="Majors" value={counts.majors} />
            <Metric label="Minors" value={counts.minors} />
          </div>
          <div className="mt-4 text-sm text-zinc-600">
            Focus on <span className="font-medium text-zinc-900">systemic</span>{" "}
            blockers first.
          </div>
        </Card>

        <Card title="Last Sync" icon={Clock}>
          {lastSync ? (
            <>
              <div className="text-sm">
                <div className="font-semibold">{lastSync.startedAt}</div>
                <div className="text-zinc-600 mt-1">
                  {lastSync.status === "SUCCESS" ? "Success" : "Failed"} •{" "}
                  {lastSync.rowsUpdated} rows • {lastSync.durationSec}s •{" "}
                  {lastSync.triggeredBy}
                </div>
              </div>
              {lastSync.status === "FAILED" ? (
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                  <div className="font-semibold">Error</div>
                  <div className="mt-1">{lastSync.error}</div>
                </div>
              ) : null}
              <div className="mt-4">
                <Button onClick={onSync}>
                  <Database className="h-4 w-4" />
                  Sync now
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-zinc-600">No sync history yet.</div>
          )}
        </Card>
      </div>

      <Card title="Next steps" icon={Wrench}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <NextStep
            title="Resolve blockers"
            desc="Start with dependency and missing-field issues that prevent planning from running correctly."
          />
          <NextStep
            title="Confirm rule agreement"
            desc="Use Configuration to align required fields and relationships with how your factory actually runs."
          />
          <NextStep
            title="Track diffs after planning"
            desc="Compare plan-run input data with current reality to decide whether to re-plan."
          />
        </div>
      </Card>
    </div>
  );
}
