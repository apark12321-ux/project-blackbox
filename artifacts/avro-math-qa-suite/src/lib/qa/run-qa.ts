import type { MathQAInput, QAFinding, QAResult, QAStatus, QASummary } from "@/types/qa";
import { validateLatex } from "./latex-validator";
import { tokenizeLatex } from "./math-tokenizer";
import { validateRendering } from "./render-validator";
import { validateMetadata } from "./metadata-validator";
import { validateAccessibility } from "./accessibility-validator";
import { validateLayout } from "./layout-validator";

function calculateScore(findings: QAFinding[]): number {
  const penalty = findings.reduce((total, finding) => {
    if (finding.status === "pass") return total;
    if (finding.severity === "high") return total + 25;
    if (finding.severity === "medium") return total + 12;
    if (finding.severity === "low") return total + 5;
    return total;
  }, 0);

  return Math.max(0, 100 - penalty);
}

function calculateStatus(findings: QAFinding[]): QAStatus {
  if (findings.some((finding) => finding.status === "fail" && finding.severity === "high")) {
    return "fail";
  }
  if (findings.some((finding) => finding.status !== "pass" && (finding.severity === "medium" || finding.severity === "high"))) {
    return "warning";
  }
  if (findings.some((finding) => finding.status !== "pass")) {
    return "warning";
  }
  return "pass";
}

export async function runMathQA(input: MathQAInput): Promise<QAResult> {
  const latex = input.latex ?? "";
  const findings = [
    ...validateLatex(latex),
    ...validateRendering(latex),
    ...validateMetadata(input),
    ...validateAccessibility(input),
    ...validateLayout(input)
  ];

  return {
    inputId: input.id || "NO-ID",
    overallStatus: calculateStatus(findings),
    score: calculateScore(findings),
    findings,
    parsedTokens: tokenizeLatex(latex),
    createdAt: new Date().toISOString()
  };
}

export async function runBatchMathQA(inputs: MathQAInput[]): Promise<QAResult[]> {
  return Promise.all(inputs.map((input) => runMathQA(input)));
}

export function summarizeResults(results: QAResult[]): QASummary {
  const total = results.length;
  const pass = results.filter((result) => result.overallStatus === "pass").length;
  const warning = results.filter((result) => result.overallStatus === "warning").length;
  const fail = results.filter((result) => result.overallStatus === "fail").length;
  const high = results.reduce((count, result) => count + result.findings.filter((finding) => finding.severity === "high").length, 0);
  const medium = results.reduce((count, result) => count + result.findings.filter((finding) => finding.severity === "medium").length, 0);
  const low = results.reduce((count, result) => count + result.findings.filter((finding) => finding.severity === "low").length, 0);
  const averageScore = total ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / total) : 0;

  return { total, pass, warning, fail, high, medium, low, averageScore };
}
