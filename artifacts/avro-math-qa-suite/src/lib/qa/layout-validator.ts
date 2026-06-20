import type { MathQAInput, QAFinding } from "@/types/qa";

export function validateLayout(input: MathQAInput): QAFinding[] {
  const html = input.questionHtml ?? "";
  const latex = input.latex ?? "";
  const findings: QAFinding[] = [];

  if (latex.length > 120) {
    findings.push({
      id: "layout-long-latex",
      category: "layout",
      severity: "low",
      status: "warning",
      title: "모바일 수식 넘침 가능성",
      message: "긴 수식이 모바일 화면에서 컨테이너를 벗어날 수 있습니다.",
      suggestion: "수식 컨테이너에 overflow-x:auto를 적용하거나 display 수식 줄바꿈 정책을 확인하세요."
    });
  }

  if (/https?:\/\/\S{60,}/i.test(html)) {
    findings.push({
      id: "layout-long-url",
      category: "layout",
      severity: "low",
      status: "warning",
      title: "긴 URL 줄바꿈 경고",
      message: "긴 URL 또는 연속 문자열이 모바일 폭을 초과할 수 있습니다.",
      suggestion: "word-break 또는 overflow-wrap 스타일을 적용하세요."
    });
  }

  if (/<table\b/i.test(html) && !/(overflow-x|table-wrap|responsive-table|nt-table)/i.test(html)) {
    findings.push({
      id: "layout-table-responsive",
      category: "layout",
      severity: "medium",
      status: "warning",
      title: "표 반응형 처리 확인 필요",
      message: "HTML table이 있으나 반응형 wrapper 또는 overflow-x 처리가 확인되지 않습니다.",
      suggestion: "표를 가로 스크롤 wrapper로 감싸 모바일 깨짐을 방지하세요."
    });
  }

  if (/<img\b[^>]*(width=\"\d+\"|style=\"[^\"]*width:\s*\d+px)/i.test(html) && !/(max-width|width:\s*100%)/i.test(html)) {
    findings.push({
      id: "layout-fixed-image",
      category: "layout",
      severity: "medium",
      status: "warning",
      title: "고정폭 이미지 경고",
      message: "고정 px 이미지가 모바일 화면을 벗어날 수 있습니다.",
      suggestion: "max-width:100%; height:auto; 스타일을 적용하세요."
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "layout-pass",
      category: "layout",
      severity: "pass",
      status: "pass",
      title: "레이아웃 기본 검사 통과",
      message: "정적 레이아웃 검사에서 주요 깨짐 후보가 발견되지 않았습니다."
    });
  }

  return findings;
}
