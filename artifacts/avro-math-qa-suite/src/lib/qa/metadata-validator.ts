import type { MathQAInput, QAFinding } from "@/types/qa";

const IMAGE_HINTS = ["그림", "도형", "그래프", "좌표평면", "함수 그래프", "삼각형", "사각형", "원", "표", "이미지"];

function warn(id: string, title: string, message: string, suggestion: string, location?: string): QAFinding {
  return {
    id,
    category: "metadata",
    severity: "low",
    status: "warning",
    title,
    message,
    suggestion,
    location
  };
}

export function validateMetadata(input: MathQAInput): QAFinding[] {
  const findings: QAFinding[] = [];
  const html = input.questionHtml ?? "";
  const explanation = input.explanation ?? "";
  const combined = `${html} ${explanation}`;

  if (!input.id?.trim()) {
    findings.push(warn("meta-id-missing", "문제 ID 누락", "문제 ID가 비어 있습니다.", "문제은행 추적을 위해 고유 ID를 입력하세요.", "id"));
  }
  if (!input.grade?.trim()) {
    findings.push(warn("meta-grade-missing", "학년 누락", "학년 정보가 비어 있습니다.", "학년 또는 과정 정보를 입력하세요.", "grade"));
  }
  if (!input.subject?.trim()) {
    findings.push(warn("meta-subject-missing", "과목 누락", "과목 정보가 비어 있습니다.", "과목명을 입력하세요.", "subject"));
  }
  if (!input.unit?.trim()) {
    findings.push(warn("meta-unit-missing", "단원명 누락", "단원명이 비어 있습니다.", "문항 검색과 분류를 위해 단원명을 입력하세요.", "unit"));
  }
  if (!input.unitCode?.trim()) {
    findings.push(warn("meta-unit-code-missing", "단원 코드 누락", "단원 코드가 누락되었습니다.", "문제은행 관리와 검색 정확도를 위해 단원 코드를 입력하세요.", "unitCode"));
  }
  if (input.latex?.trim() && !html.trim()) {
    findings.push(warn("meta-question-missing", "문제 본문 누락", "수식은 있지만 문제 본문이 비어 있습니다.", "문제 본문을 입력하거나 데이터 매핑을 확인하세요.", "questionHtml"));
  }
  if (input.answer?.trim() && !explanation.trim()) {
    findings.push(warn("meta-explanation-missing", "해설 누락", "정답은 있지만 해설이 비어 있습니다.", "검수 기준에 따라 해설 또는 풀이 근거를 입력하세요.", "explanation"));
  }

  const needsAlt = IMAGE_HINTS.some((hint) => combined.includes(hint)) || /<img\s/i.test(html);
  if (needsAlt && !input.altText?.trim()) {
    findings.push({
      id: "meta-alt-missing",
      category: "accessibility",
      severity: "medium",
      status: "warning",
      title: "대체텍스트 누락 가능성",
      message: "도형·그래프·이미지 관련 표현이 있으나 대체 설명이 비어 있습니다.",
      suggestion: "스크린리더 사용자를 위한 도형·그래프 설명을 altText에 추가하세요.",
      location: "altText"
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "meta-pass",
      category: "metadata",
      severity: "pass",
      status: "pass",
      title: "메타데이터 통과",
      message: "필수 메타데이터가 기본 기준을 충족합니다."
    });
  }

  return findings;
}
