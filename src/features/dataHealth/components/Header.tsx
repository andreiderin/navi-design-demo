import React from "react";
import { Database, RefreshCcw, Sparkles } from "lucide-react";
import Button from "../../../components/common/Button";
import Pill from "../../../components/common/Pill";
import { cx } from "../../../utils/cx";

export default function Header({
  readiness,
  onRefresh,
  onSync,
}: {
  readiness: { label: string; tone: string; icon: any };
  onRefresh: () => void;
  onSync: () => void;
}) {
  const Icon = readiness.icon;
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold">Data Health</div>
          <div className="text-sm text-zinc-600">
            Validator + issues + snapshots & diffs
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Pill className={cx("border", readiness.tone)}>
          <Icon className="h-3.5 w-3.5 mr-1" />
          Planning readiness: <span className="ml-1 font-semibold">{readiness.label}</span>
        </Pill>

        <Button variant="secondary" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
          Refresh checks
        </Button>

        <Button onClick={onSync}>
          <Database className="h-4 w-4" />
          Sync from ERP now
        </Button>
      </div>
    </div>
  );
}
