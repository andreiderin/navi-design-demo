import type {
  DataContract,
  DiffItem,
  Issue,
  LogicalRule,
  Snapshot,
  SyncRun,
} from "../types";

export const MOCK_ISSUES: Issue[] = [
  {
    id: "ISS-001",
    severity: "BLOCKER",
    type: "DEPENDENCY",
    status: "OPEN",
    objectType: "WorkOrder",
    objectKey: "WO-1042",
    ruleName: "WO must reference existing product",
    message:
      "Work order references product PROD-88, but that product does not exist.",
    firstSeenAt: "2026-01-27 09:14",
    lastSeenAt: "2026-01-27 12:02",
    isNewSinceLastSync: true,
    evidence: {
      work_order: "WO-1042",
      product_code: "PROD-88",
      hint: "Create product or correct product_code on the work order.",
      affected_fields: ["product_code"],
    },
  },
  {
    id: "ISS-002",
    severity: "MAJOR",
    type: "NULL",
    status: "OPEN",
    objectType: "Operation",
    objectKey: "OP-3301",
    ruleName: "Operation cycle_time must be > 0",
    message: "Operation cycle_time is null.",
    firstSeenAt: "2026-01-27 08:41",
    lastSeenAt: "2026-01-27 12:02",
    evidence: {
      operation: "OP-3301",
      route: "ROUTE-12",
      fields: { cycle_time: null, machine: "M-5" },
      hint: "Set a positive cycle_time for this operation.",
    },
  },
  {
    id: "ISS-003",
    severity: "MAJOR",
    type: "LOGICAL",
    status: "OPEN",
    objectType: "WorkOrder",
    objectKey: "WO-1039",
    ruleName: "Last operation scanned but WO still In Progress",
    message:
      "End scan received for last operation, but work order status is still In Progress.",
    firstSeenAt: "2026-01-26 17:12",
    lastSeenAt: "2026-01-27 12:02",
    evidence: {
      work_order: "WO-1039",
      last_operation: "OP-3199",
      last_end_scan_at: "2026-01-26 17:08",
      work_order_status: "In Progress",
      hint: "Update WO status to Completed or investigate missing completion workflow.",
    },
  },
  {
    id: "ISS-004",
    severity: "MINOR",
    type: "NULL",
    status: "ACKNOWLEDGED",
    objectType: "Machine",
    objectKey: "M-12",
    ruleName: "Machine must have capability group",
    message: "Machine capability_group is missing.",
    firstSeenAt: "2026-01-25 10:22",
    lastSeenAt: "2026-01-27 12:02",
    evidence: {
      machine: "M-12",
      field: "capability_group",
      hint: "Assign a capability group (optional if unused).",
    },
  },
  {
    id: "ISS-005",
    severity: "MINOR",
    type: "LOGICAL",
    status: "SUPPRESSED",
    objectType: "Route",
    objectKey: "ROUTE-7",
    ruleName: "Route should include packaging step",
    message: "Route missing packaging step (suppressed for this route).",
    firstSeenAt: "2026-01-22 11:03",
    lastSeenAt: "2026-01-27 12:02",
    evidence: {
      route: "ROUTE-7",
      missing_step: "Packaging",
      reason: "Special-case product line",
    },
  },
];

export const DEFAULT_CONTRACT: DataContract = {
  WorkOrder: {
    requiredFields: ["product_code", "qty", "status"],
    requiredRelations: [{ name: "product_code", targetType: "Product" }],
    numericConstraints: [{ field: "qty", op: ">", value: 0 }],
    enumConstraints: [
      {
        field: "status",
        allowed: ["Planned", "In Progress", "Completed", "Cancelled"],
      },
    ],
  },
  Product: {
    requiredFields: ["product_code", "name"],
    requiredRelations: [],
    numericConstraints: [],
    enumConstraints: [],
  },
  Machine: {
    requiredFields: ["machine_code", "name"],
    requiredRelations: [],
    numericConstraints: [],
    enumConstraints: [],
  },
  Route: {
    requiredFields: ["route_code", "product_code"],
    requiredRelations: [{ name: "product_code", targetType: "Product" }],
    numericConstraints: [],
    enumConstraints: [],
  },
  Operation: {
    requiredFields: ["operation_code", "route_code", "machine_code"],
    requiredRelations: [
      { name: "route_code", targetType: "Route" },
      { name: "machine_code", targetType: "Machine" },
    ],
    numericConstraints: [{ field: "cycle_time", op: ">", value: 0 }],
    enumConstraints: [],
  },
};

export const DEFAULT_LOGICAL_RULES: LogicalRule[] = [
  {
    id: "LR-01",
    name: "Last operation scanned but WO not completed",
    description:
      "If last operation has an end scan, WO status must be Completed.",
    severity: "MAJOR",
    enabled: true,
    lastTriggeredCount: 7,
    template: "Event/State Mismatch",
  },
  {
    id: "LR-02",
    name: "Mandatory machine appears in all product routes",
    description:
      "Certain products require a mandatory machine across all routes.",
    severity: "BLOCKER",
    enabled: true,
    lastTriggeredCount: 2,
    template: "Invalid Route Membership",
  },
  {
    id: "LR-03",
    name: "No negative cycle time",
    description: "cycle_time must be a positive number.",
    severity: "MAJOR",
    enabled: true,
    lastTriggeredCount: 0,
    template: "Missing Step",
  },
];

export const MOCK_SYNC_RUNS: SyncRun[] = [
  {
    id: "SYNC-180",
    startedAt: "2026-01-27 12:00",
    durationSec: 52,
    rowsUpdated: 1284,
    status: "SUCCESS",
    triggeredBy: "MANUAL",
  },
  {
    id: "SYNC-179",
    startedAt: "2026-01-27 10:00",
    durationSec: 48,
    rowsUpdated: 210,
    status: "SUCCESS",
    triggeredBy: "SCHEDULED",
  },
  {
    id: "SYNC-178",
    startedAt: "2026-01-27 08:00",
    durationSec: 44,
    rowsUpdated: 0,
    status: "FAILED",
    error: "ERP auth token expired. Reconnect source.",
    triggeredBy: "SCHEDULED",
  },
];

export const MOCK_SNAPSHOTS: Snapshot[] = [
  {
    id: "SNAP-CURRENT",
    kind: "CURRENT",
    createdAt: "2026-01-27 12:00",
    label: "Current (latest sync)",
  },
  {
    id: "SNAP-PLAN-20260127-0905",
    kind: "PLAN_RUN",
    createdAt: "2026-01-27 09:05",
    label: "Plan Run — 2026-01-27 09:05",
  },
  {
    id: "SNAP-PLAN-20260126-1600",
    kind: "PLAN_RUN",
    createdAt: "2026-01-26 16:00",
    label: "Plan Run — 2026-01-26 16:00",
  },
];

export const MOCK_DIFF: DiffItem[] = [
  {
    objectType: "WorkOrder",
    added: ["WO-1044"],
    removed: [],
    modified: [
      {
        key: "WO-1040",
        changes: [
          { field: "due_date", before: "2026-01-29", after: "2026-01-28" },
        ],
      },
    ],
  },
  {
    objectType: "Machine",
    added: [],
    removed: [],
    modified: [
      {
        key: "M-5",
        changes: [{ field: "availability", before: "Up", after: "Down" }],
      },
    ],
  },
];
