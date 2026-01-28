import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";

import Header from "./components/Header";
import ChatbotDrawer from "./components/ChatbotDrawer";
import IssueDrawer from "./components/IssueDrawer";

import Config from "./screens/Config";
import Diffs from "./screens/Diffs";
import Issues from "./screens/Issues";
import Overview from "./screens/Overview";
import Sync from "./screens/Sync";

import type {
  Issue,
  IssueStatus,
  LogicalRule,
  NavKey,
  SyncRun,
} from "../../types";

import {
  DEFAULT_LOGICAL_RULES,
  MOCK_DIFF,
  MOCK_ISSUES,
  MOCK_SNAPSHOTS,
  MOCK_SYNC_RUNS,
} from "../../data/dataHealth.mock";

export function DataHealthPage({
  nav,
  setNav,
}: {
  nav: NavKey;
  setNav: (k: NavKey) => void;
}) {
  // Data
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [logicalRules, setLogicalRules] = useState<LogicalRule[]>(
    DEFAULT_LOGICAL_RULES
  );
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>(MOCK_SYNC_RUNS);

  // UI
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const selectedIssue = useMemo(
    () => issues.find((i) => i.id === selectedIssueId) ?? null,
    [issues, selectedIssueId]
  );

  const counts = useMemo(() => {
    const open = issues.filter((i) => i.status === "OPEN");
    return {
      open: open.length,
      blockers: open.filter((i) => i.severity === "BLOCKER").length,
      majors: open.filter((i) => i.severity === "MAJOR").length,
      minors: open.filter((i) => i.severity === "MINOR").length,
    };
  }, [issues]);

  const readiness = useMemo(() => {
    if (counts.blockers > 0)
      return { label: "FAIL", tone: "bg-black text-white", icon: AlertCircle };
    if (counts.majors > 0)
      return {
        label: "WARN",
        tone: "bg-zinc-900/10 text-zinc-900 border border-zinc-900/10",
        icon: AlertCircle,
      };
    return {
      label: "PASS",
      tone: "bg-zinc-900/5 text-zinc-900 border border-zinc-900/10",
      icon: CheckCircle2,
    };
  }, [counts]);

  const refreshChecks = () =>
    setIssues((prev) => prev.map((i) => ({ ...i, isNewSinceLastSync: false })));

  const syncNow = () => {
    const now = "2026-01-27 13:00";
    const newRun: SyncRun = {
      id: `SYNC-${180 + Math.floor(Math.random() * 10)}`,
      startedAt: now,
      durationSec: 49,
      rowsUpdated: 312,
      status: "SUCCESS",
      triggeredBy: "MANUAL",
    };
    setSyncRuns((prev) => [newRun, ...prev]);

    // demo: resolve one issue after sync
    setIssues((prev) =>
      prev.map((i) =>
        i.id === "ISS-001"
          ? { ...i, status: "RESOLVED", lastSeenAt: now }
          : { ...i, isNewSinceLastSync: false }
      )
    );
    setSelectedIssueId(null);
  };

  const updateIssueStatus = (id: string, status: IssueStatus) =>
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));

  return (
    <>
      <Header readiness={readiness} onRefresh={refreshChecks} onSync={syncNow} />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {nav === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Overview
                readiness={readiness}
                counts={counts}
                lastSync={syncRuns[0]}
                onGoIssues={() => setNav("issues")}
                onRefresh={refreshChecks}
                onSync={syncNow}
              />
            </motion.div>
          )}

          {nav === "issues" && (
            <motion.div
              key="issues"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Issues
                issues={issues}
                onSelectIssue={(id) => setSelectedIssueId(id)}
                onRefresh={refreshChecks}
                onSync={syncNow}
                onBulk={(ids, action) => {
                  if (action === "ack")
                    ids.forEach((id) => updateIssueStatus(id, "ACKNOWLEDGED"));
                  if (action === "suppress")
                    ids.forEach((id) => updateIssueStatus(id, "SUPPRESSED"));
                  if (action === "resolve")
                    ids.forEach((id) => updateIssueStatus(id, "RESOLVED"));
                }}
              />
            </motion.div>
          )}

          {nav === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Config
                logicalRules={logicalRules}
                setLogicalRules={setLogicalRules}
                onTest={() =>
                  alert("Test run: would execute rules on current snapshot.")
                }
              />
            </motion.div>
          )}

          {nav === "sync" && (
            <motion.div
              key="sync"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Sync runs={syncRuns} onSync={syncNow} />
            </motion.div>
          )}

          {nav === "diffs" && (
            <motion.div
              key="diffs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Diffs snapshots={MOCK_SNAPSHOTS} diff={MOCK_DIFF} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssueId(null)}
        onAcknowledge={() =>
          selectedIssue && updateIssueStatus(selectedIssue.id, "ACKNOWLEDGED")
        }
        onSuppress={() =>
          selectedIssue && updateIssueStatus(selectedIssue.id, "SUPPRESSED")
        }
        onResolve={() =>
          selectedIssue && updateIssueStatus(selectedIssue.id, "RESOLVED")
        }
        onSyncNow={syncNow}
      />
      <ChatbotDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-2xl bg-black text-white shadow-lg flex items-center justify-center hover:bg-zinc-800 z-40"
          aria-label="Open assistant"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      ) : null}
    </>
  );
}
