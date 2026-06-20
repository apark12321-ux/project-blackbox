import type { QAFinding } from "@/types/qa";

export async function runAxeCheck(html: string): Promise<QAFinding[]> {
  if (!html.trim()) return [];

  return [
    {
      id: "axe-pending",
      category: "accessibility",
      severity: "low",
      status: "warning",
      title: "브라우저 접근성 검사 확장 필요",
      message: "MVP에서는 정적 접근성 검사를 우선 수행합니다. Playwright 실행 환경에서는 axe-core 연동으로 확장할 수 있습니다.",
      suggestion: "운영 빌드에서는 @axe-core/playwright 기반 브라우저 검사를 별도 CI에서 실행하세요."
    }
  ];
}
