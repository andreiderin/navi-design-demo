export type NavKey = "overview" | "issues" | "config" | "sync" | "diffs";

export type Severity = "BLOCKER" | "MAJOR" | "MINOR";
export type IssueType = "NULL" | "DEPENDENCY" | "LOGICAL";
export type IssueStatus = "OPEN" | "ACKNOWLEDGED" | "SUPPRESSED" | "RESOLVED";
export type ObjectType = "WorkOrder" | "Product" | "Machine" | "Route" | "Operation";

export type Issue = {
  id: string;
  severity: Severity;
  type: IssueType;
  status: IssueStatus;
  objectType: ObjectType;
  objectKey: string;
  ruleName: string;
  message: string;
  firstSeenAt: string;
  lastSeenAt: string;
  evidence: Record<string, any>;
  isNewSinceLastSync?: boolean;
};

export type DataContract = {
  [K in ObjectType]: {
    requiredFields: string[];
    requiredRelations: { name: string; targetType: ObjectType }[];
    numericConstraints: {
      field: string;
      op: ">" | ">=" | "!=";
      value: number;
    }[];
    enumConstraints: { field: string; allowed: string[] }[];
  };
};

export type LogicalRule = {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  enabled: boolean;
  lastTriggeredCount: number;
  template:
    | "Event/State Mismatch"
    | "Missing Step"
    | "Invalid Route Membership";
};

export type SyncRun = {
  id: string;
  startedAt: string;
  durationSec: number;
  rowsUpdated: number;
  status: "SUCCESS" | "FAILED";
  error?: string;
  triggeredBy: "SCHEDULED" | "MANUAL";
};

export type Snapshot = {
  id: string;
  kind: "PLAN_RUN" | "CURRENT";
  createdAt: string;
  label: string;
};

export type DiffItem = {
  objectType: ObjectType;
  added: string[];
  removed: string[];
  modified: {
    key: string;
    changes: { field: string; before: any; after: any }[];
  }[];
};
