// frontend/app/plan/scenarios.ts
// AlgoMaker v6 · 채팅형 UI · 백엔드 API 연동

// API 베이스 URL (Vercel 환경변수 또는 Railway 프로덕션 URL)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ENV_API = (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL as
  | string
  | undefined;

export const API_BASE =
  ENV_API ||
  'https://project-blackbox-production.up.railway.app';

// ──────────────────────────────────────────────────────
// 타입
// ──────────────────────────────────────────────────────
export interface Structure {
  id: string;
  name: string;
  tagline: string;
}

export const STRUCTURES: Structure[] = [
  { id: 'clue-hunt', name: '사건 추적형', tagline: '의문 → 단서 공개 → 진실' },
  { id: 'reverse-narrative', name: '결말 스포일러형', tagline: '결말부터 → 과거로 거슬러' },
  { id: 'origin-trail', name: '유래 추적형', tagline: '지금 현상 → 과거 원인 → 지금 의미' },
  { id: 'what-if-world', name: '가상 시나리오형', tagline: '"만약 이렇다면?" 가상 상황' },
  { id: 'experiment-log', name: '실험 검증형', tagline: '주장 → 실제 확인 → 결론' },
  { id: 'head-to-head', name: '비교 분석형', tagline: 'A vs B 항목별 비교' },
  { id: 'flip-convention', name: '통념 뒤집기형', tagline: '당연한 것 → 흔들기 → 재해석' },
  { id: 'four-beats', name: '기승전결형', tagline: '질문 → 설명 → 반전 → 마무리' },
  { id: 'stage-arc', name: '3막 구조형', tagline: '도입 20% → 심화 60% → 결단 20%' },
  { id: 'empathy-remedy', name: '문제 해결형', tagline: '고민 → 원인 → 해법 → 실천' },
  { id: 'countdown', name: '순위 카운트다운', tagline: 'N위부터 1위까지 역순 공개' },
  { id: 'field-record', name: '다큐멘터리형', tagline: '인터뷰 + 내레이션 + 자료 화면' },
];

export interface Beat {
  id: string;
  order: number;
  kind: string;
  title: string;
  time_start: string;
  time_end: string;
  retention: number;
  risk: 'low' | 'med' | 'hi';
  pull_quote: string;
  notes: string[];
}

export interface PlanMetrics {
  grade: string;
  avg_retention: number;
  cpm_range: string;
  algo_shield: number;
}

export interface Plan {
  structure_id: string;
  headline: string;
  dek: string;
  beats: Beat[];
  metrics: PlanMetrics;
  ai_message: string;
  highlighted_beat_ids: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// ──────────────────────────────────────────────────────
// API 호출
// ──────────────────────────────────────────────────────
export async function apiInitPlan(
  category: string,
  keyword: string,
  structureId: string = 'clue-hunt',
): Promise<Plan> {
  const res = await fetch(`${API_BASE}/api/v1/plan/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      keyword,
      structure_id: structureId,
      target_duration_min: 8,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Init failed (${res.status}): ${err}`);
  }
  return res.json();
}

export async function apiRefinePlan(
  userMessage: string,
  currentPlan: Plan,
  structureId: string,
): Promise<Plan> {
  const res = await fetch(`${API_BASE}/api/v1/plan/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_message: userMessage,
      current_plan: currentPlan,
      structure_id: structureId,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Refine failed (${res.status}): ${err}`);
  }
  return res.json();
}

export async function apiSwitchStructure(
  category: string,
  keyword: string,
  newStructureId: string,
  currentPlan: Plan | null,
): Promise<Plan> {
  const res = await fetch(`${API_BASE}/api/v1/plan/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      keyword,
      new_structure_id: newStructureId,
      current_plan: currentPlan,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Switch failed (${res.status}): ${err}`);
  }
  return res.json();
}

// ──────────────────────────────────────────────────────
// 유틸
// ──────────────────────────────────────────────────────
export function getStructureById(id: string): Structure | undefined {
  return STRUCTURES.find((s) => s.id === id);
}

export function newMsgId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
