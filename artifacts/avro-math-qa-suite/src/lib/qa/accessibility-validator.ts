import type { MathQAInput, QAFinding } from "@/types/qa";

export function validateAccessibility(input: MathQAInput): QAFinding[] {
  const html = input.questionHtml ?? "";
  const latex = input.latex ?? "";
  const findings: QAFinding[] = [];

  if (/<img\b(?![^>]*\balt=)/i.test(html)) {
    findings.push({
      id: "a11y-img-alt-missing",
      category: "accessibility",
      severity: "medium",
      status: "warning",
      title: "이미지 alt 속성 누락",
      message: "HTML 이미지 태그에 alt 속성이 없습니다.",
      suggestion: "이미지의 의미를 설명하는 alt 속성을 추가하세요."
    });
  }

  if (/<button\b[^>]*>\s*<\/button>/i.test(html)) {
    findings.push({
      id: "a11y-empty-button",
      category: "accessibility",
      severity: "medium",
      status: "warning",
      title: "버튼 이름 누락",
      message: "텍스트가 없는 버튼이 있습니다.",
      suggestion: "버튼 내부 텍스트 또는 aria-label을 추가하세요."
    });
  }

  if (/<input\b/i.test(html) && !/<label\b/i.test(html) && !/aria-label=/i.test(html)) {
    findings.push({
      id: "a11y-input-label-missing",
      category: "accessibility",
      severity: "medium",
      status: "warning",
      title: "입력폼 레이블 누락",
      message: "input 요소가 있으나 label 또는 aria-label이 확인되지 않습니다.",
      suggestion: "입력폼에 명확한 레이블을 연결하세요."
    });
  }

  if (latex.trim() && !input.altText?.trim()) {
    findings.push({
      id: "a11y-math-alt-missing",
      category: "accessibility",
      severity: "low",
      status: "warning",
      title: "수식 대체 설명 확인 필요",
      message: "수식이 있으나 별도 대체 설명이 비어 있습니다.",
      suggestion: "복잡한 수식은 자연어 설명 또는 MathML 출력 상태를 함께 확인하세요."
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "a11y-pass",
      category: "accessibility",
      severity: "pass",
      status: "pass",
      title: "접근성 기본 검사 통과",
      message: "정적 접근성 검사에서 주요 누락 후보가 발견되지 않았습니다."
    });
  }

  return findings;
}
