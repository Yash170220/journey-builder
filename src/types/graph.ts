

export interface FieldSchemaProperty {
  type?: string;
  title?: string;
  format?: string;
  items?: { enum?: string[]; type?: string };
  enum?: string[];
  avantos_type?: string;
}

export interface FieldSchema {
  type: 'object';
  properties: Record<string, FieldSchemaProperty>;
  required?: string[];
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  is_reusable?: boolean;
  field_schema: FieldSchema;
  ui_schema?: Record<string, unknown>;
  dynamic_field_config?: Record<string, unknown>;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles?: string[];
  input_mapping?: Record<string, unknown>;
  sla_duration?: { number: number; unit: string };
  approval_required?: boolean;
  approval_roles?: string[];
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface BlueprintGraph {
  $schema?: string;
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  category?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  branches?: unknown[];
  triggers?: unknown[];
}

/* ---------- Prefill / mapping types ---------- */

/** A saved mapping from one form field to a data element. */
export interface PrefillMapping {
  targetNodeId: string;
  targetFieldKey: string;
  sourceId: string;
  /**
   * Source-specific identifier. The source provider knows how to interpret
   * it. For upstream-form sources we use `${nodeId}.${fieldKey}`.
   */
  sourcePath: string;
  label: string;
}

/** A single selectable element shown in the picker. */
export interface DataElement {
  path: string;
  label: string;
  type?: string;
  sourceId: string;
}

/** A collapsible group in the picker (e.g. one upstream form, or one global namespace). */
export interface DataElementGroup {
  sourceId: string;
  groupId: string;
  groupLabel: string;
  elements: DataElement[];
}
