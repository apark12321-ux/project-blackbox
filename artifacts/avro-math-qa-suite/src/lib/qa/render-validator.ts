import katex from "katex";
import type { QAFinding } from "@/types/qa";

export function renderLatexToHtml(latex = "", displayMode = true): string {
  return katex.renderToString(latex, {
    throwOnError: true,
    displayMode,
    strict: "warn",
    output: "htmlAndMathml"
  });
}

export function validateRendering(latex = ""): QAFinding[] {
  const trimmed = latex.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const html = renderLatexToHtml(trimmed);
    const findings: QAFinding[] = [];

    if (!html || html.trim().length < 10) {
      findings.push({
        id: "render-empty",
        category: "rendering",
        severity: "high",
        status: "fail",
        title: "수식 렌더링 결과 없음",
        message: "수식 렌더링 결과가 비어 있습니다.",
        suggestion: "LaTeX 문법 또는 렌더러 지원 여부를 확인하세요."
      });
    }

    if (!html.includes("katex")) {
      findings.push({
        id: "render-no-katex-wrapper",
        category: "rendering",
        severity: "medium",
        status: "warning",
        title: "렌더링 래퍼 확인 필요",
        message: "KaTeX 래퍼가 결과 HTML에서 확인되지 않습니다.",
        suggestion: "렌더링 라이브러리 설정을 확인하세요."
      });
    }

    if (!html.includes("<math")) {
      findings.push({
        id: "mathml-missing",
        category: "mathml",
        severity: "medium",
        status: "warning",
        title: "MathML 출력 확인 필요",
        message: "렌더링 결과에서 MathML 구조가 확인되지 않습니다.",
        suggestion: "스크린리더 대응을 위해 htmlAndMathml 출력 설정을 확인하세요."
      });
    }

    if (findings.length === 0) {
      findings.push({
        id: "render-pass",
        category: "rendering",
        severity: "pass",
        status: "pass",
        title: "수식 렌더링 통과",
        message: "KaTeX 기반 수식 렌더링이 정상적으로 완료되었습니다."
      });
    }

    return findings;
  } catch (error) {
    return [
      {
        id: "render-error",
        category: "rendering",
        severity: "high",
        status: "fail",
        title: "수식 렌더링 실패",
        message: error instanceof Error ? error.message : "수식 렌더링 중 오류가 발생했습니다.",
        suggestion: "LaTeX 문법 또는 지원 명령어를 확인하세요."
      }
    ];
  }
}
