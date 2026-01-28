import { motion, AnimatePresence } from "framer-motion";
import { Database, X } from "lucide-react";
import type { Issue } from "../../../types";
import { cx } from "../../../utils/cx";
import { severityTone, statusTone } from "../../../utils/dataHealth.tone";
import { sevLabel, typeLabel } from "../../../utils/dataHealth.format";
import Button from "../../../components/common/Button";
import Pill from "../../../components/common/Pill";

export default function IssueDrawer({
  issue,
  onClose,
  onAcknowledge,
  onSuppress,
  onResolve,
  onSyncNow,
}: {
  issue: Issue | null;
  onClose: () => void;
  onAcknowledge: () => void;
  onSuppress: () => void;
  onResolve: () => void;
  onSyncNow: () => void;
}) {
  return (
    <AnimatePresence>
      {issue ? (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-white z-50 shadow-2xl border-l border-zinc-200"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900">
                    {issue.objectType} • {issue.objectKey}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {issue.message}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-2xl p-2 hover:bg-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className={cx("border", severityTone(issue.severity))}>
                    {sevLabel(issue.severity)}
                  </Pill>
                  <Pill className="bg-white border border-zinc-200 text-zinc-700">
                    {typeLabel(issue.type)}
                  </Pill>
                  <Pill className={cx(statusTone(issue.status))}>
                    {issue.status}
                  </Pill>
                  {issue.isNewSinceLastSync ? (
                    <Pill className="bg-black text-white">New</Pill>
                  ) : null}
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold">Rule</div>
                  <div className="mt-1 text-sm text-zinc-700">
                    {issue.ruleName}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-600">
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3">
                      <div className="font-semibold text-zinc-700">
                        First seen
                      </div>
                      <div className="mt-1">{issue.firstSeenAt}</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3">
                      <div className="font-semibold text-zinc-700">
                        Last seen
                      </div>
                      <div className="mt-1">{issue.lastSeenAt}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold">Evidence</div>
                  <div className="mt-2 rounded-2xl bg-zinc-50 border border-zinc-200 p-3 font-mono text-xs whitespace-pre-wrap">
                    {JSON.stringify(issue.evidence, null, 2)}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold">Actions</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={onAcknowledge}>
                      Acknowledge
                    </Button>
                    <Button variant="secondary" onClick={onSuppress}>
                      Suppress
                    </Button>
                    <Button variant="secondary" onClick={onResolve}>
                      Mark resolved
                    </Button>
                    <Button onClick={onSyncNow}>
                      <Database className="h-4 w-4" />
                      Sync from ERP now
                    </Button>
                  </div>
                  <div className="mt-3 text-xs text-zinc-600">
                    Fixes happen in the ERP. Use “Sync” to verify quickly.
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="text-xs text-zinc-600">
                  Click outside to close
                </div>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
