import { useMemo, useState } from "react";
import { ChevronRight, Plus, Sparkles, Wrench } from "lucide-react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Pill from "../../../components/common/Pill";
import Toggle from "../../../components/common/Toggle";
import EmptyState from "../../../components/common/EmptyState";
import type { DataContract, LogicalRule, ObjectType } from "../../../types";
import { cx } from "../../../utils/cx";
import { severityTone } from "../../../utils/dataHealth.tone";
import { sevLabel } from "../../../utils/dataHealth.format";

type DataType = "categorical" | "non-categorical";

type FieldConfig = {
  id: string;
  naviDefinition: string;
  erpName: string;
  dataType: DataType;
  categories: string[];
  referencedEntity?: ObjectType;
};

type EntityConfig = {
  entity: ObjectType;
  fields: FieldConfig[];
};

const DEFAULT_ENTITY_CONFIGS: EntityConfig[] = [
  {
    entity: "WorkOrder",
    fields: [
      {
        id: "wo-product",
        naviDefinition: "Product",
        erpName: "product_code",
        dataType: "categorical",
        categories: [],
        referencedEntity: "Product",
      },
      {
        id: "wo-qty",
        naviDefinition: "Quantity",
        erpName: "qty",
        dataType: "non-categorical",
        categories: [],
      },
      {
        id: "wo-status",
        naviDefinition: "Status",
        erpName: "status",
        dataType: "categorical",
        categories: ["Planned", "In Progress", "Completed", "Cancelled"],
      },
    ],
  },
  {
    entity: "Product",
    fields: [
      {
        id: "prod-type",
        naviDefinition: "Product Type",
        erpName: "product_type",
        dataType: "categorical",
        categories: ["FG", "WIP", "RM"],
      },
      {
        id: "prod-family",
        naviDefinition: "Product Family",
        erpName: "family",
        dataType: "categorical",
        categories: ["Standard", "Custom"],
      },
    ],
  },
  {
    entity: "Machine",
    fields: [
      {
        id: "machine-availability",
        naviDefinition: "Availability",
        erpName: "availability",
        dataType: "categorical",
        categories: ["Up", "Down", "Maintenance"],
      },
    ],
  },
  { entity: "Route", fields: [] },
  { entity: "Operation", fields: [] },
];

export default function ConfigScreen({
  contract,
  setContract,
  logicalRules,
  setLogicalRules,
  onTest,
}: {
  contract: DataContract;
  setContract: React.Dispatch<React.SetStateAction<DataContract>>;
  logicalRules: LogicalRule[];
  setLogicalRules: React.Dispatch<React.SetStateAction<LogicalRule[]>>;
  onTest: () => void;
}) {
  const [tab, setTab] = useState<"mapping" | "logical">("mapping");
  const [entities, setEntities] = useState<EntityConfig[]>(
    DEFAULT_ENTITY_CONFIGS
  );
  const [activeEntity, setActiveEntity] = useState<ObjectType>("WorkOrder");

  const active = useMemo(
    () => entities.find((e) => e.entity === activeEntity),
    [entities, activeEntity]
  );

  const updateField = (
    entity: ObjectType,
    fieldId: string,
    patch: Partial<FieldConfig>
  ) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.entity !== entity
          ? e
          : {
              ...e,
              fields: e.fields.map((f) =>
                f.id === fieldId ? { ...f, ...patch } : f
              ),
            }
      )
    );
  };

  const addField = (entity: ObjectType) => {
    const newField: FieldConfig = {
      id: `${entity}-${Math.random().toString(36).slice(2, 7)}`,
      naviDefinition: "",
      erpName: "",
      dataType: "non-categorical",
      categories: [],
    };
    setEntities((prev) =>
      prev.map((e) =>
        e.entity === entity ? { ...e, fields: [newField, ...e.fields] } : e
      )
    );
  };

  const addCategory = (entity: ObjectType, fieldId: string, value: string) => {
    if (!value.trim()) return;
    setEntities((prev) =>
      prev.map((e) =>
        e.entity !== entity
          ? e
          : {
              ...e,
              fields: e.fields.map((f) =>
                f.id !== fieldId
                  ? f
                  : {
                      ...f,
                      categories: Array.from(
                        new Set([...f.categories, value.trim()])
                      ),
                    }
              ),
            }
      )
    );
  };

  const removeCategory = (
    entity: ObjectType,
    fieldId: string,
    value: string
  ) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.entity !== entity
          ? e
          : {
              ...e,
              fields: e.fields.map((f) =>
                f.id !== fieldId
                  ? f
                  : { ...f, categories: f.categories.filter((c) => c !== value) }
              ),
            }
      )
    );
  };

  const toggleRuleEnabled = (id: string) =>
    setLogicalRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );

  const editRule = (id: string) => {
    const r = logicalRules.find((x) => x.id === id);
    if (!r) return;
    const name = prompt("Rule name:", r.name) ?? r.name;
    const desc = prompt("Rule description:", r.description) ?? r.description;
    setLogicalRules((prev) =>
      prev.map((x) => (x.id === id ? { ...x, name, description: desc } : x))
    );
  };

  const createRule = () => {
    const name = prompt("Rule name?");
    if (!name) return;
    setLogicalRules((prev) => [
      {
        id: `LR-${Math.floor(100 + Math.random() * 900)}`,
        name,
        description: "New custom logical rule (edit me).",
        severity: "MAJOR",
        enabled: true,
        lastTriggeredCount: 0,
        template: "Event/State Mismatch",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-semibold">Configuration</div>
          <div className="text-sm text-zinc-600">Set mappings and rules.</div>
        </div>
        <Button variant="secondary" onClick={onTest}>
          <Wrench className="h-4 w-4" />
          Test rules
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={cx(
            "rounded-2xl px-4 py-2 text-sm border",
            tab === "mapping"
              ? "bg-black text-white border-black"
              : "bg-white border-zinc-200 hover:bg-zinc-50"
          )}
          onClick={() => setTab("mapping")}
        >
          Entity mapping
        </button>
        <button
          className={cx(
            "rounded-2xl px-4 py-2 text-sm border",
            tab === "logical"
              ? "bg-black text-white border-black"
              : "bg-white border-zinc-200 hover:bg-zinc-50"
          )}
          onClick={() => setTab("logical")}
        >
          Logical rules
        </button>
      </div>

      {tab === "mapping" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-3">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-600">
                ENTITIES
              </div>
              <div className="mt-1 flex flex-col gap-1">
                {entities.map((e) => {
                  const active = e.entity === activeEntity;
                  return (
                    <button
                      key={e.entity}
                      onClick={() => setActiveEntity(e.entity)}
                      className={cx(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                        active
                          ? "bg-zinc-900 text-white"
                          : "hover:bg-zinc-100 text-zinc-900"
                      )}
                    >
                      <span>{e.entity}</span>
                      <ChevronRight
                        className={cx(
                          "h-4 w-4",
                          active ? "text-white/80" : "text-zinc-400"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <Card
              title={active ? `${active.entity} fields` : "Fields"}
              icon={Sparkles}
              right={
                <Button
                  variant="secondary"
                  onClick={() => addField(activeEntity)}
                >
                  <Plus className="h-4 w-4" />
                  Add field
                </Button>
              }
            >
              <div className="grid grid-cols-12 gap-3 text-xs text-zinc-500">
                <div className="col-span-4">Navi definition</div>
                <div className="col-span-3">ERP name</div>
                <div className="col-span-3">Data type</div>
                <div className="col-span-2">Categories</div>
              </div>

              <div className="mt-3 space-y-3">
                {!active || active.fields.length === 0 ? (
                  <div className="text-sm text-zinc-600">
                    No fields configured yet.
                  </div>
                ) : (
                  active.fields.map((field) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-start"
                    >
                      <div className="col-span-4 space-y-2">
                        <input
                          value={field.naviDefinition}
                          onChange={(e) =>
                            updateField(activeEntity, field.id, {
                              naviDefinition: e.target.value,
                            })
                          }
                          placeholder="Navi definition"
                          className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none"
                        />
                        {field.referencedEntity ? (
                          <button
                            onClick={() => setActiveEntity(field.referencedEntity!)}
                            className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900"
                          >
                            <span className="font-medium">Entity:</span>
                            <span>{field.referencedEntity}</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        ) : null}
                      </div>
                      <input
                        value={field.erpName}
                        onChange={(e) =>
                          updateField(activeEntity, field.id, {
                            erpName: e.target.value,
                          })
                        }
                        placeholder="ERP name"
                        className="col-span-3 rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none"
                      />
                      <select
                        value={field.dataType}
                        onChange={(e) =>
                          updateField(activeEntity, field.id, {
                            dataType: e.target.value as DataType,
                            categories:
                              e.target.value === "categorical"
                                ? field.categories
                                : [],
                          })
                        }
                        className="col-span-3 rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none"
                      >
                        <option value="categorical">Categorical</option>
                        <option value="non-categorical">Non-categorical</option>
                      </select>

                      <div className="col-span-2">
                        {field.dataType === "categorical" ? (
                          <CategoryEditor
                            values={field.categories}
                            onAdd={(v) => addCategory(activeEntity, field.id, v)}
                            onRemove={(v) =>
                              removeCategory(activeEntity, field.id, v)
                            }
                          />
                        ) : (
                          <div className="text-xs text-zinc-500 pt-2">—</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card
            title="Logical rules"
            icon={Wrench}
            right={
              <Button onClick={createRule}>
                <Sparkles className="h-4 w-4" />
                New rule
              </Button>
            }
          >
            <div className="text-sm text-zinc-600">Factory-specific logic.</div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {logicalRules.map((r) => (
              <div
                key={r.id}
                className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900">
                        {r.name}
                      </div>
                      <Pill className={cx("border", severityTone(r.severity))}>
                        {sevLabel(r.severity)}
                      </Pill>
                      <Pill className="bg-white border border-zinc-200 text-zinc-700">
                        {r.template}
                      </Pill>
                      {r.enabled ? (
                        <Pill className="bg-black text-white">Enabled</Pill>
                      ) : (
                        <Pill className="bg-zinc-100 text-zinc-700 border border-zinc-200">
                          Disabled
                        </Pill>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {r.description}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      Last triggered: {r.lastTriggeredCount}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Toggle
                      checked={r.enabled}
                      onChange={() => toggleRuleEnabled(r.id)}
                      label="Enabled"
                    />
                    <Button variant="secondary" onClick={() => editRule(r.id)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {logicalRules.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No logical rules yet."
                subtitle="Create rules to capture factory-specific logic."
                action={<Button onClick={createRule}>Create rule</Button>}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryEditor({
  values,
  onAdd,
  onRemove,
}: {
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {values.length === 0 ? (
          <span className="text-xs text-zinc-500">No categories</span>
        ) : (
          values.map((v) => (
            <button
              key={v}
              onClick={() => onRemove(v)}
              className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50"
              title="Remove category"
            >
              {v} ×
            </button>
          ))
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add"
          className="w-full rounded-2xl border border-zinc-200 px-2 py-1 text-xs outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(draft);
              setDraft("");
            }
          }}
        />
        <button
          className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-50"
          onClick={() => {
            onAdd(draft);
            setDraft("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
