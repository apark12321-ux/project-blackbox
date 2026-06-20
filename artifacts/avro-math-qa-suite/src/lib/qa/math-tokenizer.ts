import type { ParsedMathToken } from "@/types/qa";

const COMMAND_LABELS: Record<string, ParsedMathToken["label"]> = {
  "\\frac": "분수식",
  "\\sqrt": "제곱근",
  "\\pm": "플러스마이너스",
  "\\times": "곱셈 기호",
  "\\div": "나눗셈 기호",
  "\\cdot": "곱셈 점",
  "\\leq": "작거나 같음",
  "\\geq": "크거나 같음",
  "\\neq": "같지 않음",
  "\\approx": "근삿값",
  "\\pi": "원주율",
  "\\theta": "세타",
  "\\angle": "각",
  "\\triangle": "삼각형",
  "\\parallel": "평행",
  "\\perp": "수직"
};

function classifyCommand(raw: string): ParsedMathToken {
  if (raw === "\\frac") return { type: "fraction", raw, label: "분수식" };
  if (raw === "\\sqrt") return { type: "sqrt", raw, label: "제곱근" };
  return { type: "command", raw, label: COMMAND_LABELS[raw] ?? "LaTeX 명령어" };
}

export function tokenizeLatex(latex = ""): ParsedMathToken[] {
  const tokens: ParsedMathToken[] = [];
  let index = 0;

  while (index < latex.length) {
    const current = latex[index];

    if (/\s/.test(current)) {
      index += 1;
      continue;
    }

    if (current === "\\") {
      const match = latex.slice(index).match(/^\\[A-Za-z]+/);
      if (match) {
        tokens.push(classifyCommand(match[0]));
        index += match[0].length;
        continue;
      }
      tokens.push({ type: "unknown", raw: current, label: "미분류 역슬래시" });
      index += 1;
      continue;
    }

    if (current === "{" || current === "}") {
      tokens.push({ type: "brace", raw: current, label: "경계자" });
      index += 1;
      continue;
    }

    if (current === "^") {
      tokens.push({ type: "superscript", raw: current, label: "거듭제곱" });
      index += 1;
      continue;
    }

    if (current === "_") {
      tokens.push({ type: "subscript", raw: current, label: "아래첨자" });
      index += 1;
      continue;
    }

    if (/[+\-=*/()\[\],<>]/.test(current)) {
      tokens.push({ type: "operator", raw: current, label: "연산자" });
      index += 1;
      continue;
    }

    if (/\d/.test(current)) {
      const match = latex.slice(index).match(/^\d+(\.\d+)?/);
      const raw = match?.[0] ?? current;
      tokens.push({ type: "number", raw, label: "숫자" });
      index += raw.length;
      continue;
    }

    if (/[A-Za-z가-힣]/.test(current)) {
      const match = latex.slice(index).match(/^[A-Za-z가-힣]+/);
      const raw = match?.[0] ?? current;
      tokens.push({ type: "variable", raw, label: "변수/상수" });
      index += raw.length;
      continue;
    }

    tokens.push({ type: "text", raw: current, label: "텍스트" });
    index += 1;
  }

  return tokens;
}
