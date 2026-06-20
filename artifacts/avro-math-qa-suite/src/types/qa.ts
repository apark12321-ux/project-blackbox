export type Severity = "pass" | "low" | "medium" | "high";

export type QAStatus = "pass" | "warning" | "fail";

export type QACategory =
  | "latex"
  | "rendering"
  | "mathml"
  | "layout"
  | "accessibility"
  | "metadata"
  | "content";

export interface MathQAInput {
  id: string;
  grade?: string;
  subject?: string;
  unit?: string;
  unitCode?: string;
  questionHtml?: string;
  latex?: string;
  answer?: string;
  explanation?: string;
  altText?: string;
}

export interface QAFinding {
  id: string;
  category: QACategory;
  severity: Severity;
  status: QAStatus;
  title: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ParsedMathToken {
  type:
    | "command"
    | "fraction"
    | "sqrt"
    | "superscript"
    | "subscript"
    | "operator"
    | "variable"
    | "number"
    | "brace"
    | "text"
    | "unknown";
  raw: string;
  label: string;
}

export interface QAResult {
  inputId: string;
  overallStatus: QAStatus;
  score: number;
  findings: QAFinding[];
  parsedTokens: ParsedMathToken[];
  createdAt: string;
}

export interface QASummary {
  total: number;
  pass: number;
  warning: number;
  fail: number;
  high: number;
  medium: number;
  low: number;
  averageScore: number;
}
