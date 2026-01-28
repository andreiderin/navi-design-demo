import type { IssueStatus, Severity } from "../types";

export function statusTone(st: IssueStatus) {
  switch (st) {
    case "OPEN":
      return "bg-white border border-zinc-200 text-zinc-900";
    case "ACKNOWLEDGED":
      return "bg-zinc-900/5 border border-zinc-200 text-zinc-900";
    case "SUPPRESSED":
      return "bg-zinc-900/5 border border-zinc-200 text-zinc-700";
    case "RESOLVED":
      return "bg-zinc-900/5 border border-zinc-200 text-zinc-600";
  }
}

export function severityTone(sev: Severity) {
  if (sev === "BLOCKER") return "bg-black text-white";
  if (sev === "MAJOR")
    return "bg-zinc-900/10 text-zinc-900 border border-zinc-900/10";
  return "bg-zinc-900/5 text-zinc-900 border border-zinc-900/10";
}
