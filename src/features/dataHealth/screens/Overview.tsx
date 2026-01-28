import React from "react";
import { AlertCircle, Clock, Database, Sparkles } from "lucide-react";
import Card from "../../../components/common/Card";
import Pill from "../../../components/common/Pill";
import Button from "../../../components/common/Button";
import Metric from "../../../components/Metric";
import type { SyncRun } from "../../../types";
import { cx } from "../../../utils/cx";

export default function Overview({
  readiness,
  counts,
  lastSync,
  onGoIssues,
  onSync,
}: {
  readiness: { label: string; tone: string; icon: any };
  counts: { open: number; blockers: number; majors: number; minors: number };
  lastSync: SyncRun | undefined;
  onGoIssues: () => void;
  onSync: () => void;
}) {
  const Icon = readiness.icon;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          title="Planning readiness"
          icon={Sparkles}
          right={
            <Pill className={cx("border", readiness.tone)}>
              <Icon className="h-3.5 w-3.5 mr-1" />
              {readiness.label}
            </Pill>
          }
        >
          <div className="text-sm text-zinc-600">
            Based on open issues.
          </div>
          <div className="mt-4">
            <Button onClick={onGoIssues} variant="secondary">
              <AlertCircle className="h-4 w-4" />
              View issues
            </Button>
          </div>
        </Card>

        <Card title="Open issues" icon={AlertCircle}>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Blockers" value={counts.blockers} />
            <Metric label="Majors" value={counts.majors} />
            <Metric label="Minors" value={counts.minors} />
          </div>
        </Card>

        <Card title="Last sync" icon={Clock}>
          {lastSync ? (
            <>
              <div className="text-sm">
                <div className="font-semibold">{lastSync.startedAt}</div>
                <div className="text-zinc-600 mt-1">
                  {lastSync.status === "SUCCESS" ? "Success" : "Failed"} •{" "}
                  {lastSync.rowsUpdated} rows • {lastSync.durationSec}s
                </div>
              </div>
              {lastSync.status === "FAILED" ? (
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                  {lastSync.error}
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
            <div className="text-sm text-zinc-600">No sync history.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
