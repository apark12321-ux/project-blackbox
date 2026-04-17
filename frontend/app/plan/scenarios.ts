// frontend/app/plan/scenarios.ts
// AlgoMaker 시나리오 엔진 v2 · 구조 12종 + 세부 파라미터 정의
// Step 1: 프론트엔드 목업. Step 2에서 백엔드 API로 대체 예정.

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
  affinity: number; // 0~100
  tagline: string;
  subParams: SubParamDef[];
}

// ──────────────────────────────────────────────────────
// 12구조 라이브러리 (리네이밍 완료 — Videoto 용어 없음)
// ──────────────────────────────────────────────────────
export const STRUCTURES: Structure[] = [
  // 경제 · 사회 특화
  {
    id: 'clue-hunt',
    name: '단서 사냥',
    emoji: '🔍',
    category: 'economy',
    affinity: 95,
    tagline: '의문 제시 → 단서 공개 → 진실',
    subParams: [
      {
        key: 'clue_pace',
        label: '단서 공개 속도',
        kind: 'segments',
        default: 'steady',
        options: [
          { value: 'slow', label: '느림' },
          { value: 'steady', label: '중간' },
          { value: 'rapid', label: '빠름' },
        ],
      },
      {
        key: 'red_herrings',
        label: '페이크 단서',
        hint: '재시청 유도',
        kind: 'stepper',
        default: 2,
        min: 0,
        max: 3,
      },
      {
        key: 'narrator',
        label: '화자 톤',
        kind: 'dropdown',
        default: 'skeptical',
        options: [
          { value: 'neutral', label: '중립적 조사자' },
          { value: 'skeptical', label: '회의적 관찰자' },
          { value: 'empathetic', label: '공감형 내레이터' },
          { value: 'prosecutorial', label: '검사 스타일' },
        ],
      },
      {
        key: 'resolution',
        label: '결론 확정성',
        kind: 'segments',
        default: 'probable',
        options: [
          { value: 'definitive', label: '확정' },
          { value: 'probable', label: '개연' },
          { value: 'open', label: '개방' },
        ],
      },
    ],
  },
  {
    id: 'reverse-narrative',
    name: '역시간 서사',
    emoji: '📖',
    category: 'economy',
    affinity: 88,
    tagline: '결말 먼저 → 거슬러 올라가기',
    subParams: [
      {
        key: 'spoiler_intensity',
        label: '결말 스포 강도',
        kind: 'segments',
        default: 'medium',
        options: [
          { value: 'weak', label: '약' },
          { value: 'medium', label: '중' },
          { value: 'strong', label: '강' },
        ],
      },
      {
        key: 'pov',
        label: '화자 시점',
        kind: 'dropdown',
        default: 'analyst',
        options: [
          { value: 'victim', label: '피해자 시점' },
          { value: 'observer', label: '관찰자 시점' },
          { value: 'insider', label: '내부자 시점' },
          { value: 'analyst', label: '분석가 시점' },
        ],
      },
    ],
  },
  {
    id: 'origin-trail',
    name: '기원 추적',
    emoji: '🏛️',
    category: 'economy',
    affinity: 85,
    tagline: '현재 → 기원 → 변천 → 현재 의미',
    subParams: [
      {
        key: 'depth',
        label: '시간 깊이',
        kind: 'segments',
        default: 'decade',
        options: [
          { value: 'year', label: '최근 1년' },
          { value: 'decade', label: '10년' },
          { value: 'century', label: '100년+' },
        ],
      },
    ],
  },
  {
    id: 'what-if-world',
    name: '만약의 세계',
    emoji: '🔮',
    category: 'economy',
    affinity: 82,
    tagline: '"만약 X라면" 가상 시나리오',
    subParams: [
      {
        key: 'scenario_count',
        label: '시나리오 개수',
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
    name: '실험 노트',
    emoji: '🧪',
    category: 'analysis',
    affinity: 70,
    tagline: '가설 → 검증 → 결론',
    subParams: [
      {
        key: 'data_density',
        label: '데이터 밀도',
        kind: 'segments',
        default: 'medium',
        options: [
          { value: 'low', label: '가볍게' },
          { value: 'medium', label: '중간' },
          { value: 'high', label: '집중' },
        ],
      },
    ],
  },
  {
    id: 'head-to-head',
    name: '맞대결',
    emoji: '⚖️',
    category: 'analysis',
    affinity: 68,
    tagline: 'A vs B 지표별 비교',
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
    name: '상식 뒤집기',
    emoji: '🔄',
    category: 'analysis',
    affinity: 65,
    tagline: '당연한 것 → 흔들기 → 재정의',
    subParams: [
      {
        key: 'controversy_level',
        label: '논란 강도',
        kind: 'segments',
        default: 'moderate',
        options: [
          { value: 'mild', label: '순함' },
          { value: 'moderate', label: '중간' },
          { value: 'bold', label: '과감' },
        ],
      },
    ],
  },

  // 범용
  {
    id: 'four-beats',
    name: '4장 흐름',
    emoji: '📐',
    category: 'general',
    affinity: 60,
    tagline: '질문 → 설명 → 전환 → 결론',
    subParams: [],
  },
  {
    id: 'stage-arc',
    name: '무대 전개',
    emoji: '🎭',
    category: 'general',
    affinity: 58,
    tagline: '도입 20% / 심화 60% / 결단 20%',
    subParams: [
      {
        key: 'midpoint_twist',
        label: '중간 반전',
        kind: 'segments',
        default: 'yes',
        options: [
          { value: 'no', label: '없음' },
          { value: 'yes', label: '있음' },
        ],
      },
    ],
  },
  {
    id: 'empathy-remedy',
    name: '공감 처방전',
    emoji: '💡',
    category: 'general',
    affinity: 55,
    tagline: '가려움 → 원인 → 해법 → 행동',
    subParams: [],
  },
  {
    id: 'countdown',
    name: '카운트다운',
    emoji: '📊',
    category: 'general',
    affinity: 50,
    tagline: 'N위 → 1위 역순 공개',
    subParams: [
      {
        key: 'item_count',
        label: '순위 항목 수',
        kind: 'stepper',
        default: 5,
        min: 3,
        max: 10,
      },
    ],
  },
  {
    id: 'field-record',
    name: '현장 기록',
    emoji: '🎬',
    category: 'general',
    affinity: 48,
    tagline: '인터뷰 + 내레이션 + 자료화면',
    subParams: [],
  },
];

export const CATEGORY_LABELS: Record<StructureCategory, string> = {
  economy: '경제 · 사회 특화',
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
// 섹션 (Beat) 타입
// ──────────────────────────────────────────────────────
export interface Beat {
  id: string;
  order: number;
  kind: string; // "hook", "ground", "clue-i" 등
  title: string;
  time_start: string; // "00:00"
  time_end: string; // "00:30"
  retention: number; // 0~100
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
// 목업 데이터 생성기 (Step 2에서 API로 교체 예정)
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

  // 구조별 기본 섹션 템플릿 (여기는 목업, 실제는 백엔드 생성)
  const templates: Record<string, Beat[]> = {
    'clue-hunt': [
      {
        id: 'b1',
        order: 1,
        kind: 'Hook · 훅',
        title: '400%의 환상, 72시간의 침묵',
        time_start: '00:00',
        time_end: '00:30',
        retention: 98,
        risk: 'low',
        pull_quote: '"하루 만에 400% 오른 종목, 그 끝은 감옥이었다."',
        notes: [
          '차트 화면 오픈 — 급등 구간 시각적 충격',
          '"왜 이렇게 올랐을까?" 질문 던지기',
          '결말 힌트만 살짝 (전액 손실) · 스포 강도 약',
        ],
      },
      {
        id: 'b2',
        order: 2,
        kind: 'Ground · 배경',
        title: '우연이라기엔 너무 많다',
        time_start: '00:30',
        time_end: '02:00',
        retention: 85,
        risk: 'med',
        pull_quote:
          '지난 2년, 유사 사례는 143건. 피해액은 이미 2조 원을 넘었다.',
        notes: [
          '금감원 통계 인용 — 불공정거래 제재 증가 추이',
          '개인 투자자 비중 확대 시점 명시',
          '"우연의 일치가 아닌 구조적 문제" 제시',
        ],
      },
      {
        id: 'b3',
        order: 3,
        kind: 'Clue I · 첫 단서',
        title: '거래량 없는 3일',
        time_start: '02:00',
        time_end: '04:00',
        retention: 72,
        risk: 'med',
        pull_quote: '"거래가 거의 없었는데, 주가는 왜 오르고 있었을까?"',
        notes: [
          '1단계 저점 매집 메커니즘 설명',
          '증권사 리포트 2종 교차 검증',
          '"소량으로 주가 올리는 기술" 도해',
        ],
      },
      {
        id: 'b4',
        order: 4,
        kind: 'Clue II · 페이크',
        title: 'SNS 바이럴이 원인? 아니다',
        time_start: '04:00',
        time_end: '06:00',
        retention: 65,
        risk: 'med',
        pull_quote: '진짜 트리거는 더 조용한 곳에서 시작됐다.',
        notes: [
          '의심 가설 1 ("여론 확산") 제시 후 반박',
          '리딩방 단톡방 로그 간접 제시',
          '재시청 유도 장치: 두 번 봐야 보이는 단서 심기',
        ],
      },
      {
        id: 'b5',
        order: 5,
        kind: 'Reveal · 진실',
        title: '매집·띄우기·탈출',
        time_start: '06:00',
        time_end: '08:00',
        retention: 58,
        risk: 'low',
        pull_quote: '3단계의 작전은 정확한 시간표를 따라 움직였다.',
        notes: [
          '작전 3단계 시각화 — 주가 차트 오버레이',
          '개미 유입 타이밍 = 세력 탈출 타이밍',
          '실제 사건 1개 익명 케이스 스터디',
        ],
      },
      {
        id: 'b6',
        order: 6,
        kind: 'Closing · 결론',
        title: '세 가지 경고 신호',
        time_start: '08:00',
        time_end: '08:30',
        retention: 50,
        risk: 'low',
        pull_quote:
          '"오를 종목을 찾기보다, 잃지 않을 원칙이 먼저다."',
        notes: [
          '거래량 급변 · 정체불명 호재 · 리딩방 추천',
          '3대 경고 신호 체크리스트 제공',
          '결론 확정성: 개연성 (댓글 토론 유도)',
        ],
      },
    ],
  };

  // 선택된 구조의 템플릿이 없으면 clue-hunt 템플릿 재사용하되 kind/title만 바꿈
  let beats = templates[structureId];
  if (!beats) {
    const fallback = templates['clue-hunt'];
    beats = fallback.map((b) => ({
      ...b,
      kind: `Section ${b.order} · ${struct.name}`,
      title: `${struct.name} — ${b.order}부`,
      pull_quote: `${struct.tagline} (${b.order}번째 흐름)`,
      notes: [
        `${struct.name} 구조의 ${b.order}번째 섹션`,
        `세부 파라미터: ${JSON.stringify(subParams).slice(0, 60)}...`,
        '(목업 데이터 · Step 2에서 실제 백엔드로 교체)',
      ],
    }));
  }

  // 등급은 구조의 affinity로 단순 매핑 (목업)
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
      grade_reason: `${struct.name} 구조는 ${struct.affinity}% 적합도로, 해당 키워드에서 평균 이상의 시청 지속률을 보입니다.`,
      avg_retention: Math.round(
        beats.reduce((a, b) => a + b.retention, 0) / beats.length,
      ),
      cpm_range: grade === 'A+' ? '$15–22' : grade === 'A' ? '$12–18' : '$8–14',
      algo_shield: struct.affinity - 5,
    },
  };
}
