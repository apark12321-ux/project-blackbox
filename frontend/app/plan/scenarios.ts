// frontend/app/plan/scenarios.ts
// AlgoMaker v5 · 직관적인 스타일 이름 + 한 줄 설명

export type StructureCategory = 'economy' | 'analysis' | 'general';

export interface SubParamOption {
  value: string;
  label: string;
}

export interface SubParamDef {
  key: string;
  label: string;
  hint?: string;
  kind: 'segments' | 'stepper' | 'dropdown';
  options?: SubParamOption[];
  min?: number;
  max?: number;
  default: string | number;
}

export interface Structure {
  id: string;
  name: string;
  emoji: string;
  category: StructureCategory;
  affinity: number;
  tagline: string;
  subParams: SubParamDef[];
}

// ──────────────────────────────────────────────────────
// 영상 스타일 12종 (직관적 이름 + 쉬운 설명)
// ──────────────────────────────────────────────────────
export const STRUCTURES: Structure[] = [
  // 경제 · 사회 특화
  {
    id: 'clue-hunt',
    name: '사건 추적형',
    emoji: '🔍',
    category: 'economy',
    affinity: 95,
    tagline: '의문 → 단서 공개 → 진실',
    subParams: [
      {
        key: 'clue_pace',
        label: '단서 푸는 속도',
        kind: 'segments',
        default: 'steady',
        options: [
          { value: 'slow', label: '천천히' },
          { value: 'steady', label: '보통' },
          { value: 'rapid', label: '빠르게' },
        ],
      },
      {
        key: 'red_herrings',
        label: '함정 단서 개수',
        hint: '다시 보게 만듦',
        kind: 'stepper',
        default: 2,
        min: 0,
        max: 3,
      },
      {
        key: 'narrator',
        label: '말투',
        kind: 'dropdown',
        default: 'skeptical',
        options: [
          { value: 'neutral', label: '차분하게' },
          { value: 'skeptical', label: '의심하듯이' },
          { value: 'empathetic', label: '공감하듯이' },
          { value: 'prosecutorial', label: '따지듯이' },
        ],
      },
      {
        key: 'resolution',
        label: '결론 방식',
        kind: 'segments',
        default: 'probable',
        options: [
          { value: 'definitive', label: '단정' },
          { value: 'probable', label: '추정' },
          { value: 'open', label: '열어둠' },
        ],
      },
    ],
  },
  {
    id: 'reverse-narrative',
    name: '결말 스포일러형',
    emoji: '📖',
    category: 'economy',
    affinity: 88,
    tagline: '결말부터 → 과거로 거슬러',
    subParams: [
      {
        key: 'spoiler_intensity',
        label: '결말 미리 보여주기',
        kind: 'segments',
        default: 'medium',
        options: [
          { value: 'weak', label: '살짝' },
          { value: 'medium', label: '보통' },
          { value: 'strong', label: '강하게' },
        ],
      },
      {
        key: 'pov',
        label: '누구 입장에서',
        kind: 'dropdown',
        default: 'analyst',
        options: [
          { value: 'victim', label: '피해자 입장' },
          { value: 'observer', label: '지켜보는 사람' },
          { value: 'insider', label: '내부자 입장' },
          { value: 'analyst', label: '분석가 입장' },
        ],
      },
    ],
  },
  {
    id: 'origin-trail',
    name: '유래 추적형',
    emoji: '🏛️',
    category: 'economy',
    affinity: 85,
    tagline: '지금 현상 → 과거 원인 → 지금 의미',
    subParams: [
      {
        key: 'depth',
        label: '얼마나 과거로',
        kind: 'segments',
        default: 'decade',
        options: [
          { value: 'year', label: '1년 전' },
          { value: 'decade', label: '10년 전' },
          { value: 'century', label: '100년 전+' },
        ],
      },
    ],
  },
  {
    id: 'what-if-world',
    name: '가상 시나리오형',
    emoji: '🔮',
    category: 'economy',
    affinity: 82,
    tagline: '"만약 이렇다면?" 가상 상황',
    subParams: [
      {
        key: 'scenario_count',
        label: '상황 개수',
        kind: 'stepper',
        default: 3,
        min: 2,
        max: 5,
      },
    ],
  },

  // 정보 · 분석
  {
    id: 'experiment-log',
    name: '실험 검증형',
    emoji: '🧪',
    category: 'analysis',
    affinity: 70,
    tagline: '주장 → 실제 확인 → 결론',
    subParams: [
      {
        key: 'data_density',
        label: '숫자·자료 많이 쓰기',
        kind: 'segments',
        default: 'medium',
        options: [
          { value: 'low', label: '조금만' },
          { value: 'medium', label: '보통' },
          { value: 'high', label: '많이' },
        ],
      },
    ],
  },
  {
    id: 'head-to-head',
    name: '비교 분석형',
    emoji: '⚖️',
    category: 'analysis',
    affinity: 68,
    tagline: 'A vs B 항목별 비교',
    subParams: [
      {
        key: 'criteria_count',
        label: '비교 항목 수',
        kind: 'stepper',
        default: 4,
        min: 3,
        max: 7,
      },
    ],
  },
  {
    id: 'flip-convention',
    name: '통념 뒤집기형',
    emoji: '🔄',
    category: 'analysis',
    affinity: 65,
    tagline: '당연한 것 → 흔들기 → 재해석',
    subParams: [
      {
        key: 'controversy_level',
        label: '논란 강도',
        kind: 'segments',
        default: 'moderate',
        options: [
          { value: 'mild', label: '부드럽게' },
          { value: 'moderate', label: '보통' },
          { value: 'bold', label: '과감하게' },
        ],
      },
    ],
  },

  // 범용
  {
    id: 'four-beats',
    name: '기승전결형',
    emoji: '📐',
    category: 'general',
    affinity: 60,
    tagline: '질문 → 설명 → 반전 → 마무리',
    subParams: [],
  },
  {
    id: 'stage-arc',
    name: '3막 구조형',
    emoji: '🎭',
    category: 'general',
    affinity: 58,
    tagline: '도입 20% → 심화 60% → 결단 20%',
    subParams: [
      {
        key: 'midpoint_twist',
        label: '중간에 반전 넣기',
        kind: 'segments',
        default: 'yes',
        options: [
          { value: 'no', label: '안 넣음' },
          { value: 'yes', label: '넣음' },
        ],
      },
    ],
  },
  {
    id: 'empathy-remedy',
    name: '문제 해결형',
    emoji: '💡',
    category: 'general',
    affinity: 55,
    tagline: '고민 → 원인 → 해법 → 실천',
    subParams: [],
  },
  {
    id: 'countdown',
    name: '순위 카운트다운',
    emoji: '📊',
    category: 'general',
    affinity: 50,
    tagline: 'N위부터 1위까지 역순 공개',
    subParams: [
      {
        key: 'item_count',
        label: '순위 개수',
        kind: 'stepper',
        default: 5,
        min: 3,
        max: 10,
      },
    ],
  },
  {
    id: 'field-record',
    name: '다큐멘터리형',
    emoji: '🎬',
    category: 'general',
    affinity: 48,
    tagline: '인터뷰 + 내레이션 + 자료 화면',
    subParams: [],
  },
];

export const CATEGORY_LABELS: Record<StructureCategory, string> = {
  economy: '경제 · 사회',
  analysis: '정보 · 분석',
  general: '범용',
};

export function getStructureById(id: string): Structure | undefined {
  return STRUCTURES.find((s) => s.id === id);
}

export function getStructuresByCategory(cat: StructureCategory): Structure[] {
  return STRUCTURES.filter((s) => s.category === cat);
}

// ──────────────────────────────────────────────────────
// 섹션 타입
// ──────────────────────────────────────────────────────
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

export interface Plan {
  structure_id: string;
  total_duration: string;
  headline: string;
  dek: string;
  beats: Beat[];
  metrics: {
    grade: string;
    grade_reason: string;
    avg_retention: number;
    cpm_range: string;
    algo_shield: number;
  };
}

// ──────────────────────────────────────────────────────
// 목업 데이터 생성기
// ──────────────────────────────────────────────────────
export function generateMockPlan(
  structureId: string,
  subParams: Record<string, string | number>,
  keyword: string = '주식 급등 작전',
): Plan {
  const struct = getStructureById(structureId);
  if (!struct) {
    throw new Error(`Unknown structure: ${structureId}`);
  }

  const templates: Record<string, Beat[]> = {
    'clue-hunt': [
      {
        id: 'b1',
        order: 1,
        kind: '도입 · 시선 잡기',
        title: '400%의 환상, 72시간의 침묵',
        time_start: '00:00',
        time_end: '00:30',
        retention: 98,
        risk: 'low',
        pull_quote: '"하루 만에 400% 오른 종목, 그 끝은 감옥이었다."',
        notes: [
          '차트 화면 오픈 — 급등 구간 시각적 충격',
          '"왜 이렇게 올랐을까?" 질문 던지기',
          '결말 힌트만 살짝 (전액 손실)',
        ],
      },
      {
        id: 'b2',
        order: 2,
        kind: '배경 설명',
        title: '우연이라기엔 너무 많다',
        time_start: '00:30',
        time_end: '02:00',
        retention: 85,
        risk: 'med',
        pull_quote: '지난 2년, 유사 사례는 143건. 피해액은 이미 2조 원을 넘었다.',
        notes: [
          '금감원 통계 — 불공정거래 제재 건수 증가 추이',
          '개인 투자자 비중 확대 시점 명시',
          '"우연이 아닌 구조적 문제" 제시',
        ],
      },
      {
        id: 'b3',
        order: 3,
        kind: '첫 번째 단서',
        title: '거래량 없는 3일',
        time_start: '02:00',
        time_end: '04:00',
        retention: 72,
        risk: 'med',
        pull_quote: '"거래가 거의 없었는데, 주가는 왜 오르고 있었을까?"',
        notes: [
          '1단계 저점 매집 방식 설명',
          '증권사 리포트 2종 교차 확인',
          '"소량으로 주가 올리는 기술" 도해',
        ],
      },
      {
        id: 'b4',
        order: 4,
        kind: '두 번째 단서 · 함정',
        title: 'SNS 바이럴이 원인? 아니다',
        time_start: '04:00',
        time_end: '06:00',
        retention: 65,
        risk: 'med',
        pull_quote: '진짜 트리거는 더 조용한 곳에서 시작됐다.',
        notes: [
          '의심 가설 ("여론 확산") 제시 후 뒤집기',
          '리딩방 단톡방 로그 간접 제시',
          '다시 보게 만드는 장치: 두 번 봐야 보이는 단서',
        ],
      },
      {
        id: 'b5',
        order: 5,
        kind: '진실 공개',
        title: '매집 · 띄우기 · 탈출',
        time_start: '06:00',
        time_end: '08:00',
        retention: 58,
        risk: 'low',
        pull_quote: '3단계 작전은 정확한 시간표대로 움직였다.',
        notes: [
          '작전 3단계 시각화 — 주가 차트 겹쳐 보기',
          '개미 유입 타이밍 = 세력 탈출 타이밍',
          '실제 사건 1개 익명 사례 소개',
        ],
      },
      {
        id: 'b6',
        order: 6,
        kind: '마무리',
        title: '세 가지 경고 신호',
        time_start: '08:00',
        time_end: '08:30',
        retention: 50,
        risk: 'low',
        pull_quote: '"오를 종목을 찾기보다, 잃지 않을 원칙이 먼저다."',
        notes: [
          '거래량 급변 · 정체불명 호재 · 리딩방 추천',
          '3대 경고 신호 체크리스트 제공',
          '댓글 토론 유도 문구',
        ],
      },
    ],
  };

  let beats = templates[structureId];
  if (!beats) {
    const fallback = templates['clue-hunt'];
    beats = fallback.map((b) => ({
      ...b,
      kind: `섹션 ${b.order} · ${struct.name}`,
      title: `${struct.name} — ${b.order}부`,
      pull_quote: `${struct.tagline} (${b.order}번째 흐름)`,
      notes: [
        `${struct.name} 스타일의 ${b.order}번째 섹션`,
        `세부 설정: ${JSON.stringify(subParams).slice(0, 60)}...`,
        '(예시 데이터 · 백엔드 연결 시 실제 내용 생성)',
      ],
    }));
  }

  const grade =
    struct.affinity >= 85
      ? 'A+'
      : struct.affinity >= 70
        ? 'A'
        : struct.affinity >= 60
          ? 'B+'
          : 'B';

  return {
    structure_id: structureId,
    total_duration: '8:30',
    headline: '개미들이 3일 만에\n전액을 잃은 이유',
    dek: `${keyword}을(를) ${struct.name}으로 풀어낸 구성. ${struct.tagline}.`,
    beats,
    metrics: {
      grade,
      grade_reason: `${struct.name}은 ${struct.affinity}% 적합도로, 해당 주제에서 평균 이상의 시청 유지율을 보입니다.`,
      avg_retention: Math.round(
        beats.reduce((a, b) => a + b.retention, 0) / beats.length,
      ),
      cpm_range:
        grade === 'A+' ? '$15–22' : grade === 'A' ? '$12–18' : '$8–14',
      algo_shield: struct.affinity - 5,
    },
  };
}
