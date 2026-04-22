/**
 * AlgoMaker 시나리오 스타일 정의
 * 
 * 각 스타일은 UI 표시용 정보 + 백엔드 API에 전달할 프롬프트 정보를 포함
 * hook_triggers / opinion_seeds 배열이 실제 대본 생성에 반영됨
 */

export type StyleId =
  | 'mystery'      // 미스터리 추적
  | 'spoiler'      // 결론 먼저
  | 'origin'       // 뿌리 찾기
  | 'whatif'       // 만약에
  | 'verify'       // 직접 확인
  | 'match'        // 맞대결
  | 'flip'         // 상식 깨기
  | 'classic'      // 정석 구성
  | 'threeact'     // 3단 고조
  | 'solution'     // 해법 찾기
  | 'ranking'      // 랭킹 역순
  | 'docu';        // 다큐 스타일

export type StyleGroup = '경제·사회' | '정보·분석' | '범용';
export type StyleTier = 'free' | 'pro';

export interface ScenarioStyle {
  id: StyleId;
  emoji: string;
  name: string;              // 한글 이름
  flow: string;              // 한 줄 흐름 설명
  desc: string;              // 긴 설명
  retention: number;         // 평균 시청 유지율 (기본값)
  tier: StyleTier;
  group: StyleGroup;

  // 백엔드 프롬프트 주입용
  hook_triggers: string[];   // 대본의 훅 문구로 사용
  opinion_seeds: string[];   // 의견/톤의 씨앗 단어
  core_facts: string[];      // 고정 패턴
  sectionPattern: string[];  // 섹션 구성 힌트 (사용자 표시용)
}

export const SCENARIOS: ScenarioStyle[] = [
  // ============== 경제·사회 ==============
  {
    id: 'mystery',
    emoji: '🔍',
    name: '미스터리 추적',
    flow: '의문 던지기 → 단서 공개 → 진실 폭로',
    desc: '호기심을 자극하는 질문으로 시작해 증거를 쌓아가며 진실에 도달하는 구조',
    retention: 95,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '대부분이 모르는 진실이 있습니다',
      '지금부터 그 숨겨진 이야기를 공개합니다',
      '이 영상 끝까지 보셔야 진짜 답이 나옵니다',
      '왜 지금까지 아무도 말하지 않았을까요',
    ],
    opinion_seeds: ['의문', '단서', '진실', '폭로', '숨겨진'],
    core_facts: ['의문 제시로 시작', '3~4개 단서 순차 공개', '마지막 반전 또는 진실 공개'],
    sectionPattern: ['의문 제시', '첫 단서', '두번째 단서', '반전', '진실 공개', '결론'],
  },
  {
    id: 'spoiler',
    emoji: '📖',
    name: '결론 먼저',
    flow: '충격 결말 먼저 → 되돌아 원인 추적',
    desc: '결론을 먼저 던져 호기심을 끌고, 어떻게 이렇게 됐는지 거꾸로 풀어가는 방식',
    retention: 88,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '결론부터 말씀드리면',
      '먼저 답을 알려드릴게요',
      '왜 이런 결과가 나왔는지 지금부터 설명드립니다',
      '이 결론에 도달한 이유는 다음과 같습니다',
    ],
    opinion_seeds: ['결과', '원인', '과정', '되돌아보면'],
    core_facts: ['결론 선제시', '원인 역추적 3단계', '현재 시사점'],
    sectionPattern: ['충격 결말', '원인 역추적 1', '원인 2', '원인 3', '현재 의미', '결론 강조'],
  },
  {
    id: 'origin',
    emoji: '🏛️',
    name: '뿌리 찾기',
    flow: '현재 현상 → 역사 속 원인 → 오늘의 의미',
    desc: '지금 벌어지는 일의 역사적 뿌리를 추적해 깊이 있는 맥락을 제공',
    retention: 85,
    tier: 'pro',
    group: '경제·사회',
    hook_triggers: [
      '이 현상의 뿌리는 10년 전으로 거슬러 올라갑니다',
      '처음 시작된 지점을 아는 사람은 많지 않습니다',
      '역사를 알면 미래가 보입니다',
    ],
    opinion_seeds: ['역사', '뿌리', '기원', '맥락', '흐름'],
    core_facts: ['현재 현상 제시', '시대별 추적', '오늘의 교훈'],
    sectionPattern: ['현상 제시', '기원', '전환점', '현재 영향', '미래 전망'],
  },
  {
    id: 'whatif',
    emoji: '🔮',
    name: '만약에',
    flow: '"~한다면?" 상상 → 결과 시뮬레이션',
    desc: '가상의 상황을 가정해 구체적 결과를 시뮬레이션하는 몰입형 구조',
    retention: 82,
    tier: 'pro',
    group: '경제·사회',
    hook_triggers: [
      '만약 이런 일이 일어난다면',
      '이 상황을 가정해봅시다',
      '상상만 해도 놀라운 결과가 나옵니다',
    ],
    opinion_seeds: ['만약', '가정', '시나리오', '결과', '시뮬레이션'],
    core_facts: ['가정 제시', '시나리오 3종', '최종 결과 분석'],
    sectionPattern: ['가정 설정', '낙관 시나리오', '비관 시나리오', '현실 시나리오', '결론'],
  },

  // ============== 정보·분석 ==============
  {
    id: 'verify',
    emoji: '🧪',
    name: '직접 확인',
    flow: '주장 제시 → 실제 검증 → 결론',
    desc: '떠도는 주장을 실제 데이터·사례로 검증하는 팩트체크 스타일',
    retention: 70,
    tier: 'free',
    group: '정보·분석',
    hook_triggers: [
      '이 주장, 정말 사실일까요',
      '직접 확인해봤습니다',
      '데이터로 검증한 결과',
    ],
    opinion_seeds: ['검증', '팩트체크', '데이터', '사실', '확인'],
    core_facts: ['주장 소개', '데이터 3종 검증', '사실/거짓 판정'],
    sectionPattern: ['주장 소개', '검증 1', '검증 2', '검증 3', '결론'],
  },
  {
    id: 'match',
    emoji: '⚖️',
    name: '맞대결',
    flow: 'A vs B 라운드별 항목 비교',
    desc: '두 대상을 여러 기준으로 라운드별로 비교해 승자를 가리는 토너먼트 형식',
    retention: 68,
    tier: 'pro',
    group: '정보·분석',
    hook_triggers: [
      '오늘은 두 가지를 직접 비교해보겠습니다',
      '라운드별로 승자를 가려봅시다',
      '결국 어느 쪽이 더 나을까요',
    ],
    opinion_seeds: ['비교', '대결', '승부', '라운드', '승자'],
    core_facts: ['A와 B 소개', '4~5라운드 항목 비교', '종합 승자'],
    sectionPattern: ['대상 소개', '라운드 1', '라운드 2', '라운드 3', '라운드 4', '종합 승자'],
  },
  {
    id: 'flip',
    emoji: '🔄',
    name: '상식 깨기',
    flow: '당연한 통념 → 의심 → 반전',
    desc: '누구나 당연하다 믿는 것을 뒤집는 역발상 구조. 강력한 후킹',
    retention: 65,
    tier: 'pro',
    group: '정보·분석',
    hook_triggers: [
      '당신이 알고 있던 상식은 틀렸습니다',
      '이건 완전히 반대입니다',
      '진짜는 이렇습니다',
    ],
    opinion_seeds: ['통념', '반전', '역발상', '오해', '진짜'],
    core_facts: ['통념 소개', '의심의 근거', '반전 제시', '재해석'],
    sectionPattern: ['통념 제시', '의심의 시작', '반대 증거', '반전', '새 관점'],
  },

  // ============== 범용 ==============
  {
    id: 'classic',
    emoji: '📐',
    name: '정석 구성',
    flow: '질문 → 설명 → 반전 → 정리',
    desc: '안정적인 기승전결 구조. 어떤 주제에도 무난하게 맞는 클래식',
    retention: 60,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '오늘은 이 질문에 답해드립니다',
      '순서대로 알려드릴게요',
      '핵심만 정리해드립니다',
    ],
    opinion_seeds: ['설명', '정리', '핵심', '순서'],
    core_facts: ['질문 제기', '배경 설명', '반전 또는 중요 포인트', '요약 정리'],
    sectionPattern: ['도입 질문', '설명 1', '설명 2', '반전 포인트', '정리'],
  },
  {
    id: 'threeact',
    emoji: '🎭',
    name: '3단 고조',
    flow: '도입 20% → 심화 60% → 절정 20%',
    desc: '영화 같은 기승전결. 중간 심화를 길게 잡고 절정으로 몰아가는 구성',
    retention: 58,
    tier: 'pro',
    group: '범용',
    hook_triggers: [
      '이야기를 들려드립니다',
      '지금부터 본격적으로',
      '마지막에 결정적 순간이 옵니다',
    ],
    opinion_seeds: ['도입', '전개', '절정', '해결'],
    core_facts: ['짧은 도입', '긴 심화(3개 블록)', '강한 절정'],
    sectionPattern: ['도입', '심화 1', '심화 2', '심화 3', '절정', '여운'],
  },
  {
    id: 'solution',
    emoji: '💡',
    name: '해법 찾기',
    flow: '고민 → 원인 → 해법 → 실천법',
    desc: '실용적 문제 해결. 고민 공감 → 원인 분석 → 구체적 액션 플랜',
    retention: 55,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '이 고민, 해결책이 있습니다',
      '당장 실천할 수 있는 방법입니다',
      '3가지 해법을 알려드릴게요',
    ],
    opinion_seeds: ['고민', '원인', '해법', '실천', '방법'],
    core_facts: ['고민 공감', '원인 3가지', '해법 3가지', '실천 단계'],
    sectionPattern: ['고민 공감', '원인 분석', '해법 1', '해법 2', '해법 3', '실천법'],
  },
  {
    id: 'ranking',
    emoji: '📊',
    name: '랭킹 역순',
    flow: '5위부터 1위까지 공개',
    desc: '순위를 낮은 쪽부터 하나씩 공개하며 1위까지 끌고 가는 중독성 강한 구조',
    retention: 50,
    tier: 'pro',
    group: '범용',
    hook_triggers: [
      '오늘은 TOP 5를 공개합니다',
      '5위부터 시작합니다',
      '1위는 끝까지 보셔야 압니다',
    ],
    opinion_seeds: ['순위', '랭킹', '1위', 'TOP'],
    core_facts: ['주제 소개', '5위 공개', '4위', '3위', '2위', '1위 반전'],
    sectionPattern: ['도입', '5위', '4위', '3위', '2위', '1위'],
  },
  {
    id: 'docu',
    emoji: '🎬',
    name: '다큐 스타일',
    flow: '내레이션 + 자료 + 인터뷰 인용',
    desc: 'BBC/넷플릭스 스타일의 차분하고 깊이 있는 다큐멘터리 구조',
    retention: 48,
    tier: 'pro',
    group: '범용',
    hook_triggers: [
      '그 시작은 이러했습니다',
      '전문가들은 말합니다',
      '진실은 우리가 생각한 것보다 복잡합니다',
    ],
    opinion_seeds: ['다큐', '내레이션', '취재', '전문가', '기록'],
    core_facts: ['차분한 도입', '취재 자료 3개', '전문가 인용', '종합 결론'],
    sectionPattern: ['도입 내레이션', '배경 자료', '심층 사례', '전문가 의견', '종합'],
  },
];

/**
 * 스타일 ID로 전체 정보 조회
 */
export function getScenarioById(id: string | undefined | null): ScenarioStyle | null {
  if (!id) return null;
  return SCENARIOS.find((s) => s.id === id) || null;
}

/**
 * 그룹별 필터
 */
export function getScenariosByGroup(group: StyleGroup): ScenarioStyle[] {
  return SCENARIOS.filter((s) => s.group === group);
}

/**
 * AI 추천 3개 생성 (랜덤, 매번 다르게)
 */
export function pickRecommendedScenarios(seed: string = ''): ScenarioStyle[] {
  // 시드 기반 섞기 (같은 seed면 같은 결과, 다른 seed면 다른 결과)
  const seedNum = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + Date.now();
  const arr = [...SCENARIOS];
  // Fisher-Yates with seeded random
  let random = seedNum;
  const pseudoRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}
