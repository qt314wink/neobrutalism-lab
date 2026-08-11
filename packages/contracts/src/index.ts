export const relationKinds = [
  'depends_on',
  'derived_from',
  'implements',
  'uses_token',
  'composes',
  'validated_by',
  'constrained_by',
  'optimizes',
  'alternative_to',
] as const;

export type RelationKind = (typeof relationKinds)[number];

export type SystemLayer =
  | 'contracts'
  | 'tokens'
  | 'interaction'
  | 'primitives'
  | 'patterns'
  | 'assemblies'
  | 'compositions'
  | 'apps'
  | 'governance';

export interface SystemNode {
  id: string;
  kind: 'package' | 'token' | 'mechanism' | 'primitive' | 'pattern' | 'assembly' | 'composition' | 'test' | 'observation' | 'constraint' | 'benchmark' | 'proposal';
  layer: SystemLayer;
  status: 'candidate' | 'accepted' | 'deprecated';
  label?: string;
}

export interface SystemEdge {
  id: string;
  from: string;
  to: string;
  kind: RelationKind;
}

export interface ObservationRef {
  id: string;
  statement: string;
  evidence?: string[];
}

export interface ConstraintRef {
  id: string;
  statement: string;
}

export interface BenchmarkRef {
  id: string;
  statement: string;
  measure: string;
}

export interface ValidationCheck {
  id: string;
  status: 'pass' | 'fail' | 'blocked';
  detail: string;
}

export interface Receipt {
  id: string;
  subjectId: string;
  checks: ValidationCheck[];
  accepted: boolean;
}

export function isRelationKind(value: string): value is RelationKind {
  return (relationKinds as readonly string[]).includes(value);
}
