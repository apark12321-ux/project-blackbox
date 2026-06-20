import type { QAFinding } from "@/types/qa";

export const SUPPORTED_COMMANDS = [
  "\\frac",
  "\\sqrt",
  "\\pm",
  "\\times",
  "\\div",
  "\\cdot",
  "\\leq",
  "\\geq",
  "\\neq",
  "\\approx",
  "\\pi",
  "\\theta",
  "\\alpha",
  "\\beta",
  "\\gamma",
  "\\sin",
  "\\cos",
  "\\tan",
  "\\log",
  "\\ln",
  "\\left",
  "\\right",
  "\\overline",
  "\\angle",
  "\\triangle",
  "\\parallel",
  "\\perp"
];

const UNSAFE_COMMANDS = ["\\html", "\\href", "\\includegraphics", "\\write", "\\input"];

function finding(id: string, overrides: Partial<QAFinding>): QAFinding {
  return {
    id,
    category: "latex",
    severity: "pass",
    status: "pass",
    title: "LaTeX 검사",
    message: "LaTeX 기본 문법이 정상입니다.",
    ...overrides
  };
}

function countChar(source: string, char: string): number {
  return source.split(char).length - 1;
}

export function validateLatex(latex = ""): QAFinding[] {
  const findings: QAFinding[] = [];
  const trimmed = latex.trim();

  if (!trimmed) {
    return [
      finding("latex-empty", {
        severity: "low",
        status: "warning",
        title: "LaTeX 수식 없음",
        message: "검사할 LaTeX 수식이 입력되지 않았습니다.",
        suggestion: "수식이 없는 문항이면 무시해도 되지만, 수식형 문항이면 원본 수식을 입력하세요."
      })
    ];
  }

  const open = countChar(trimmed, "{");
  const close = countChar(trimmed, "}");
  if (open !== close) {
    findings.push(
      finding("latex-brace-mismatch", {
        severity: "high",
        status: "fail",
        title: "중괄호 개수 불일치",
        message: `수식의 중괄호 개수가 맞지 않습니다. 여는 중괄호 ${open}개, 닫는 중괄호 ${close}개입니다.`,
        suggestion: "닫는 중괄호 또는 여는 중괄호 누락 여부를 확인하세요."
      })
    );
  }

  const leftCount = (trimmed.match(/\\left/g) ?? []).length;
  const rightCount = (trimmed.match(/\\right/g) ?? []).length;
  if (leftCount !== rightCount) {
    findings.push(
      finding("latex-left-right-mismatch", {
        severity: "medium",
        status: "warning",
        title: "left/right 쌍 불일치",
        message: `\\left ${leftCount}개와 \\right ${rightCount}개의 개수가 다릅니다.`,
        suggestion: "괄호 크기 자동 조절 명령어의 짝을 맞추세요."
      })
    );
  }

  const commands = Array.from(new Set(trimmed.match(/\\[A-Za-z]+/g) ?? []));
  const unsupported = commands.filter((command) => !SUPPORTED_COMMANDS.includes(command));
  const unsafe = commands.filter((command) => UNSAFE_COMMANDS.includes(command));

  if (unsupported.length > 0) {
    findings.push(
      finding("latex-unsupported-command", {
        severity: "medium",
        status: "warning",
        title: "지원 목록 외 LaTeX 명령어",
        message: `지원 목록에 없는 LaTeX 명령어가 포함되어 있습니다: ${unsupported.join(", ")}`,
        suggestion: "실제 렌더링 환경에서 정상 표시되는지 확인하고, 필요한 경우 지원 명령어 목록을 확장하세요."
      })
    );
  }

  if (unsafe.length > 0) {
    findings.push(
      finding("latex-unsafe-command", {
        severity: "high",
        status: "fail",
        title: "위험 가능성이 있는 LaTeX 명령어",
        message: `보안 또는 렌더링 안정성 문제가 생길 수 있는 명령어가 포함되어 있습니다: ${unsafe.join(", ")}`,
        suggestion: "외부 입력 기반 명령어는 제거하고 안전한 수식 명령어만 사용하세요."
      })
    );
  }

  if (trimmed.length > 180) {
    findings.push(
      finding("latex-long-expression", {
        severity: "low",
        status: "warning",
        title: "긴 수식",
        message: "수식 길이가 길어 모바일 화면에서 줄바꿈 또는 가로 넘침이 발생할 수 있습니다.",
        suggestion: "display mode, 줄바꿈 정책, overflow-x 처리를 확인하세요."
      })
    );
  }

  if (findings.length === 0) {
    findings.push(finding("latex-pass", {}));
  }

  return findings;
}
