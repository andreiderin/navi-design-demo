import type { IssueType, Severity } from "../types";

export function sevLabel(sev: Severity) {
  if (sev === "BLOCKER") return "Blocker";
  if (sev === "MAJOR") return "Major";
  return "Minor";
}

export function typeLabel(t: IssueType) {
  if (t === "NULL") return "Null";
  if (t === "DEPENDENCY") return "Dependency";
  return "Logical";
}
