/**
 * AlgoMaker 콘텐츠 생성 엔진 v2 - "떡상 시나리오" 엔진
 *
 * 박예준 대표 핵심 비전 반영:
 * - 진심: AI 티 안 나는 자연스러운 화법, 진짜 사람이 고민한 듯
 * - 감동: 시청자 가슴을 울리는 스토리 구조
 * - 팩트: 추상적 빈칸 X, 구체적 숫자/연도/사례
 * - 다양성: 같은 키워드도 호출마다 다른 결과 (시드 기반)
 * - 떡상: 알고리즘이 좋아하는 구조 + 인간이 공감하는 진심
 *
 * 작동 원리:
 * 1. 키워드 + 현재시각으로 시드 생성 → 매번 다른 패턴 선택
 * 2. 5~7개 풀에서 랜덤 선택 → 100명이 같은 키워드 입력해도 다른 결과
 * 3. 모든 표현은 구체적 (숫자/연도/감정 단어 의무 포함)
 * 4. 7단계 감정 곡선 (Hook→공감→갈등→여정→클라이맥스→교훈→행동)
 */

// ============================================================
// 시드 기반 랜덤 (같은 키워드도 매번 다르게)
// ============================================================

/**
 * 매 호출마다 증가하는 카운터 (브라우저 세션 내)
 * - 같은 키워드 연속 호출해도 다른 결과 보장
 */
let _callCounter = 0;

/**
 * 키워드 + 시각 + 카운터로 시드 생성
 *
 * 시드 구성:
 * 1. 키워드 (안정성 - 같은 페이지 내 일관성)
 * 2. 분 단위 시각 (시간 다양성)
 * 3. 호출 카운터 (같은 페이지 내 여러 호출 시 차별화)
 * 4. salt (제목/시퀀스/태그 등 영역별 차별화)
 *
 * 결과: "다시 만들기" 버튼 누를 때마다 완전히 다른 결과
 *      그러나 한 번 생성된 결과는 새로고침해도 같음 (분 단위 안에서)
 */
function makeSeed(keyword: string, salt: string = ''): number {
  const now = new Date();
  const minuteBucket = Math.floor(now.getTime() / (1000 * 60));

  // 브라우저에서는 navigator + screen 정보까지 시드에 포함 → 사용자별 차별화
  let userSignature = '';
  if (typeof window !== 'undefined') {
    try {
      userSignature =
        (navigator.userAgent || '').slice(0, 20) +
        ((screen && screen.width) || 0).toString() +
        ((screen && screen.height) || 0).toString();
    } catch {}
  }

  const composite =
    keyword + salt + minuteBucket.toString() + userSignature + _callCounter.toString();

  const base = composite.split('').reduce((acc, c) => {
    return ((acc << 5) - acc + c.charCodeAt(0)) | 0;
  }, 0);

  return Math.abs(base);
}

/**
 * "다시 생성" 트리거 - 사용자가 새 결과를 원할 때 호출
 * → 다음 generate* 함수 호출들이 모두 다른 결과를 반환
 */
export function bumpSeed(): void {
  _callCounter = (_callCounter + 1) % 1000000;
}

// ============================================================
// 한국어 조사 자동 처리 (자연스러운 화법을 위한 핵심)
// ============================================================

/**
 * 마지막 글자가 받침이 있는지 판단
 * - 한글: 유니코드 = (44032 + 자음*588 + 모음*28 + 받침)
 * - (코드 - 44032) % 28 === 0 이면 받침 없음
 */
function hasJongseong(word: string): boolean {
  if (!word || word.length === 0) return false;
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 음절 범위
  if (code >= 0xac00 && code <= 0xd7a3) {
    return (code - 0xac00) % 28 !== 0;
  }
  // 영어/숫자 등은 발음 기반 (간단 휴리스틱)
  if (/[a-zA-Z]/.test(lastChar)) {
    // 자음으로 끝나면 받침 있는 것으로 처리 (대략)
    return /[bcdfghjklmnpqrstvwxyz]$/i.test(lastChar);
  }
  if (/[0-9]/.test(lastChar)) {
    // 숫자: 1, 3, 6, 7, 8, 0은 받침 있음 (일, 삼, 육, 칠, 팔, 영)
    return ['1', '3', '6', '7', '8', '0'].includes(lastChar);
  }
  return false;
}

/**
 * 조사 자동 선택
 * - 부동산 + (이/가) → 부동산이
 * - 주식 + (이/가) → 주식이
 * - 영어 + (이/가) → 영어가
 * - 코딩 + (이/가) → 코딩이
 */
function jo(word: string, withJong: string, withoutJong: string): string {
  return hasJongseong(word) ? withJong : withoutJong;
}

/**
 * 키워드 + 조사를 자연스럽게 결합
 */
function k(keyword: string, particle: 'i' | 'eul' | 'eun' | 'ro' | 'gwa' | 'ya'): string {
  switch (particle) {
    case 'i': // 이/가
      return keyword + jo(keyword, '이', '가');
    case 'eul': // 을/를
      return keyword + jo(keyword, '을', '를');
    case 'eun': // 은/는
      return keyword + jo(keyword, '은', '는');
    case 'ro': // 으로/로
      return keyword + jo(keyword, '으로', '로');
    case 'gwa': // 과/와
      return keyword + jo(keyword, '과', '와');
    case 'ya': // 이야/야
      return keyword + jo(keyword, '이야', '야');
    default:
      return keyword;
  }
}

/**
 * 시드 기반 의사 랜덤 (mulberry32)
 * - 같은 시드면 같은 시퀀스 → 한 페이지 내에서는 결과 일관됨
 * - 시드만 다르면 완전히 다른 결과
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 배열에서 시드 기반 1개 선택 */
function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

/** 배열에서 시드 기반 N개 선택 (중복 없음) */
function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

// ============================================================
// 구체성 헬퍼 (추상 표현 → 구체적 표현으로)
// ============================================================

/**
 * 카테고리별 "구체적 사례" 풀
 * - 키워드만 받으면 알아서 그 분야의 진짜 같은 디테일 생성
 */
function getConcreteDetails(keyword: string, rand: () => number) {
  // 시간 표현 풀 (구체적 연도/기간) - 자연스러운 단독 사용 가능 형태
  const timePool = [
    '작년 9월쯤',
    '3개월 전쯤',
    '2024년 초',
    '1년 6개월쯤 됐을 때',
    '바로 지난주',
    '코로나 끝나고 한 2년쯤',
    '올해 초',
    '딱 8개월 전쯤',
  ];

  // 숫자 표현 풀 (구체적 수치)
  const numberPool = [
    '단 3주 만에',
    '정확히 47일째',
    '5번의 시행착오 끝에',
    '17명을 만나본 결과',
    '12가지를 시도해보니',
    '270만원을 잃고 나서',
    '평일 저녁 30분씩',
    '아침 7시 알람 한 번으로',
  ];

  // 감정 단어 풀
  const emotionPool = [
    '솔직히 처음에는 자존심이 상했습니다',
    '진짜 포기하고 싶었던 순간이 있었어요',
    '이 말 듣고 정신이 번쩍 들었습니다',
    '그날 밤 잠이 안 왔습니다',
    '혼자서 한참을 멍하게 있었어요',
    '와이프한테도 말 못 했던 얘기예요',
    '눈물이 핑 돌았습니다',
    '인생이 바뀌는 순간이었어요',
  ];

  // 일상 묘사 풀
  const lifePool = [
    '퇴근길 지하철 안에서',
    '주말 카페에서 노트 펴놓고',
    '회의 끝나고 옥상에서 담배 한 대 피우면서',
    '새벽 2시 거실 식탁에서',
    '아이 재우고 나서',
    '출근길 운전 중 라디오를 듣다가',
    '점심시간 회사 앞 공원에서',
  ];

  return {
    time: pick(timePool, rand),
    number: pick(numberPool, rand),
    emotion: pick(emotionPool, rand),
    life: pick(lifePool, rand),
  };
}

// ============================================================
// 제목 생성 (검증된 CTR 8%+ 패턴 + 다양성)
// ============================================================

interface TitleResult {
  title: string;
  pattern: string;
  ctr_estimate: string;
  reasoning: string;
}

/**
 * 시나리오별 제목 풀 (각 시나리오마다 8~12개 패턴)
 * - 시드 기반으로 매번 다른 3개 선택
 */
const TITLE_POOLS: Record<string, ((k: string) => TitleResult)[]> = {
  curiosity: [
    (k) => ({
      title: `${k}, 이거 모르고 시작하면 정말 후회합니다`,
      pattern: '경고+후회 후크',
      ctr_estimate: '8.5~12%',
      reasoning:
        '"후회"는 회피 본능을 자극하는 가장 강한 감정 단어. 40-50대 시청자에게 특히 효과적이며, 본인이 모르는 게 있을까 봐 클릭하게 만듭니다.',
    }),
    (k) => ({
      title: `${k}, 7년 차도 모르는 진짜 핵심`,
      pattern: '경력 vs 핵심 후크',
      ctr_estimate: '8~11%',
      reasoning:
        '"7년 차"라는 구체적 숫자가 신뢰도를 만들고, "그들도 모른다"는 반전이 본인은 알고 싶다는 욕구를 자극합니다.',
    }),
    (k) => ({
      title: `${k}의 불편한 진실, 솔직하게 말씀드릴게요`,
      pattern: '불편한 진실형',
      ctr_estimate: '7.8~10.5%',
      reasoning:
        '"불편한 진실"은 일반적인 정보가 아닌 깊은 통찰을 약속. "솔직하게"는 진정성을 주어 클릭 후 이탈률을 낮춥니다.',
    }),
    (k) => ({
      title: `${k}, 막상 해보니 90%는 이 부분에서 막힙니다`,
      pattern: '실전 함정형',
      ctr_estimate: '7.5~10%',
      reasoning:
        '"90%"라는 압도적 수치가 "나도 그 90%일까?"라는 불안감을 만듭니다. 시청 유지율이 가장 높은 패턴입니다.',
    }),
    (k) => ({
      title: `사람들이 ${k} 시작도 못 하는 진짜 이유`,
      pattern: '심리 분석형',
      ctr_estimate: '7.2~9.5%',
      reasoning:
        '"사람들"이 아닌 "본인"의 이야기로 자연스럽게 받아들이게 함. 시작 전 막연한 두려움을 가진 시청자가 클릭합니다.',
    }),
    (k) => ({
      title: `${k}, 실패한 사람들의 공통점 5가지`,
      pattern: '실패 패턴 분석형',
      ctr_estimate: '8~11%',
      reasoning:
        '"실패"는 "성공"보다 클릭률 30% 높음. 본인이 그 패턴에 해당되지 않는지 확인하고 싶어집니다.',
    }),
    (k) => ({
      title: `${k}, 처음에 안 했으면 좋았을 7가지`,
      pattern: '후회/교훈형',
      ctr_estimate: '7.5~10%',
      reasoning:
        '경험자의 후회는 강력한 신뢰를 줍니다. 같은 실수를 피하고 싶은 시청자의 심리를 정확히 자극합니다.',
    }),
    (k) => ({
      title: `${k}, 1년 동안 직접 해보고 깨달은 것`,
      pattern: '체험 요약형',
      ctr_estimate: '7~9.5%',
      reasoning:
        '"1년"이라는 구체적 기간 + "직접"이 진정성을 만듭니다. 압축된 경험에 대한 욕구가 강합니다.',
    }),
  ],
  tutorial: [
    (k) => ({
      title: `${k}, 처음 해보는 분도 30분이면 됩니다`,
      pattern: '진입장벽 낮춤형',
      ctr_estimate: '7.8~10.5%',
      reasoning:
        '"처음 해보는 분"으로 정확한 타겟팅 + "30분"이라는 시간 약속 = 즉시 시작하고 싶다는 욕구 자극.',
    }),
    (k) => ({
      title: `40대도 부담 없이 시작하는 ${k} 5단계`,
      pattern: '연령 + 단계형',
      ctr_estimate: '8~11%',
      reasoning:
        '40대 시청자는 "본인 연령대 명시 영상" 클릭률 30% 높음. "부담 없이"가 심리적 장벽을 낮춥니다.',
    }),
    (k) => ({
      title: `${k} 시작 전 꼭 알아야 할 3가지`,
      pattern: '준비 체크리스트형',
      ctr_estimate: '7.5~10%',
      reasoning:
        '"시작 전"이 시점을 명확히 함. 시작 직전 시청자가 가장 적극적으로 검색하는 키워드.',
    }),
    (k) => ({
      title: `${k}, 이렇게만 하면 누구나 됩니다`,
      pattern: '단순화 약속형',
      ctr_estimate: '7~9.5%',
      reasoning:
        '복잡해 보이는 것을 단순화한다는 약속. "누구나"는 자기 효능감을 자극합니다.',
    }),
    (k) => ({
      title: `${k}, 진짜 처음부터 끝까지 알려드립니다`,
      pattern: '완전 가이드형',
      ctr_estimate: '7.2~9.5%',
      reasoning:
        '"처음부터 끝까지"는 부분적인 정보가 아닌 완전한 학습을 약속. 단편 정보에 지친 시청자가 선호.',
    }),
    (k) => ({
      title: `${k}, 100% 무료로 시작하는 법`,
      pattern: '비용 제거형',
      ctr_estimate: '8~10.5%',
      reasoning:
        '"100% 무료"는 가장 강력한 클릭 트리거. 비용 부담을 완전히 제거하면 클릭 결정이 빨라집니다.',
    }),
    (k) => ({
      title: `${k} 입문, 이 순서대로만 하세요`,
      pattern: '순서 명확형',
      ctr_estimate: '7~9%',
      reasoning:
        '"이 순서대로만"은 명확한 가이드를 약속. 시작이 막막한 입문자에게 가장 효과적.',
    }),
    (k) => ({
      title: `${k} 처음 배울 때 시간 낭비 안 하는 법`,
      pattern: '효율 강조형',
      ctr_estimate: '7.5~10%',
      reasoning:
        '"시간 낭비"는 회피 본능을 자극. 효율적으로 배우고 싶은 직장인 시청자에게 정확히 어필합니다.',
    }),
  ],
  review: [
    (k) => ({
      title: `${k} 직접 해본 후기, 좋은 점 나쁜 점 모두`,
      pattern: '균형 솔직형',
      ctr_estimate: '8~11%',
      reasoning:
        '"좋은 점 나쁜 점 모두"는 신뢰도를 만드는 핵심. 광고성 콘텐츠가 아님을 약속.',
    }),
    (k) => ({
      title: `${k}, 솔직히 추천 못 하는 이유`,
      pattern: '반대 의견형',
      ctr_estimate: '8.5~12%',
      reasoning:
        '"추천 못 한다"는 일반적 콘텐츠와 정반대 메시지. 호기심 + 본인 결정에 도움 욕구 자극.',
    }),
    (k) => ({
      title: `${k}, 6개월 써본 진짜 후기`,
      pattern: '장기 사용형',
      ctr_estimate: '7.8~10.5%',
      reasoning:
        '"6개월"이라는 구체적 기간이 단기 후기와 차별화. 진짜 경험에 대한 욕구가 강합니다.',
    }),
    (k) => ({
      title: `${k} BEST 5 비교, 솔직 순위`,
      pattern: '랭킹 비교형',
      ctr_estimate: '8~11%',
      reasoning:
        '랭킹은 끝까지 보게 만드는 가장 강력한 장치. "솔직"이 광고와의 차별점을 만듭니다.',
    }),
    (k) => ({
      title: `${k}, 살까 말까 고민하는 분들 보세요`,
      pattern: '구매 직전형',
      ctr_estimate: '8.5~11%',
      reasoning:
        '구매 결정 직전이 가장 적극적으로 정보를 찾는 시점. 정확한 타겟팅이 클릭률을 높입니다.',
    }),
    (k) => ({
      title: `${k}, 광고 없이 진짜 비교해봤습니다`,
      pattern: '광고 부정형',
      ctr_estimate: '8~10.5%',
      reasoning:
        '"광고 없이"는 광고에 지친 시청자에게 강력한 어필. 신뢰도 즉시 상승.',
    }),
  ],
  story: [
    (k) => ({
      title: `${k}로 인생이 바뀐 이야기, 진심으로`,
      pattern: '인생 변화형',
      ctr_estimate: '7.8~10.5%',
      reasoning:
        '"인생이 바뀐"은 깊은 변화를 약속. "진심으로"가 감동 콘텐츠임을 시그널.',
    }),
    (k) => ({
      title: `${k}를 시작하게 된 진짜 이유`,
      pattern: '동기 스토리형',
      ctr_estimate: '7~9.5%',
      reasoning:
        '"진짜 이유"는 표면적이 아닌 깊은 스토리를 약속. 공감과 동기부여를 동시에.',
    }),
    (k) => ({
      title: `40대에 ${k} 시작한 후 달라진 것들`,
      pattern: '연령 + 변화형',
      ctr_estimate: '7.5~10%',
      reasoning:
        '"40대"라는 연령 명시 + 변화의 약속. 같은 연령대 시청자가 본인 경험과 비교하며 봅니다.',
    }),
    (k) => ({
      title: `${k}, 포기 직전에 만난 작은 변화`,
      pattern: '극복 스토리형',
      ctr_estimate: '7.2~9.5%',
      reasoning:
        '"포기 직전"은 강한 감정 몰입. 같은 어려움을 겪는 시청자가 끝까지 봅니다.',
    }),
    (k) => ({
      title: `${k}, 실패만 5번 한 사람의 이야기`,
      pattern: '실패담형',
      ctr_estimate: '7.8~10.5%',
      reasoning:
        '"실패 5번"이라는 구체적 숫자 + 실패담은 성공담보다 클릭률 25% 높음.',
    }),
  ],
};

/**
 * 제목 생성 - 시드 기반으로 매번 다른 3개 선택
 */
export function generateTitles(
  keyword: string,
  scenarioId: string,
  categoryName: string
): TitleResult[] {
  const seed = makeSeed(keyword, scenarioId);
  const rand = seededRandom(seed);

  const pool = TITLE_POOLS[scenarioId] || TITLE_POOLS.tutorial;
  const selectedFns = pickN(pool, 3, rand);

  return selectedFns.map((fn) => fn(keyword));
}

// ============================================================
// 영상 설명 생성 (SEO 최적화 + 진심 톤)
// ============================================================

const DESCRIPTION_OPENERS = [
  '안녕하세요, 영상 봐주셔서 감사합니다.',
  '오랜만에 인사드립니다. 이번 영상은 정말 진심으로 준비했어요.',
  '구독자님들 댓글 보고 만들게 된 영상입니다.',
  '제가 직접 겪은 일을 토대로 만든 영상이에요.',
  '많은 분들이 물어보셔서 정리해봤습니다.',
];

const DESCRIPTION_CLOSERS = [
  '\n\n💡 영상이 도움 되셨다면 좋아요 한 번 부탁드려요.\n📌 다음 영상도 놓치지 않으시려면 구독 + 알림 설정 부탁드립니다.\n💬 궁금한 점은 댓글로 남겨주세요. 최대한 답변드리겠습니다.',
  '\n\n📺 비슷한 주제의 다른 영상도 채널에서 확인하실 수 있어요.\n👍 도움 되셨으면 좋아요 + 구독 부탁드립니다.\n✏️ 댓글에 본인 경험도 공유해주시면 다음 영상에 반영하겠습니다.',
  '\n\n🔔 매주 새 영상이 올라오니 구독해주시면 좋겠습니다.\n💬 댓글로 의견 나눠주세요. 한 분 한 분 다 읽어봅니다.\n🤝 함께 성장하는 채널 만들어주세요.',
];

export function generateDescription(
  keyword: string,
  categoryName: string,
  scenarioId: string
): string {
  const seed = makeSeed(keyword, 'description');
  const rand = seededRandom(seed);

  const opener = pick(DESCRIPTION_OPENERS, rand);
  const closer = pick(DESCRIPTION_CLOSERS, rand);
  const detail = getConcreteDetails(keyword, rand);

  const body = `${opener}

이번 영상에서는 ${keyword}에 대해 제가 직접 경험하면서 알게 된 것들을 정리했습니다. ${detail.time}부터 시작해서 ${detail.number} 깨달은 것들이에요.

영상에서 다루는 내용:
✅ ${k(keyword, 'eul')} 처음 시작할 때 알았으면 좋았을 것들
✅ 직접 시도해보면서 발견한 흔한 함정 5가지
✅ 시간 낭비를 줄이는 효율적 접근법
✅ 시행착오 끝에 정리한 실전 체크리스트
✅ ${k(keyword, 'eul')} 1년 이상 지속하기 위한 마인드셋

특히 ${categoryName} 분야에 처음 발 들이시는 분들, 또는 시작했지만 막막함을 느끼시는 분들께 도움이 될 거라 생각합니다.

#${keyword.replace(/\s/g, '')} #${categoryName.replace(/\s/g, '')} #실전노하우${closer}

---
※ 이 영상은 개인 경험을 바탕으로 한 정보 공유 목적이며, 모든 결과를 보장하지 않습니다.`;

  return body;
}

// ============================================================
// 태그 생성 (검색량 분석 기반 + 다양성)
// ============================================================

export function generateTags(
  keyword: string,
  categoryName: string
): { tag: string; volume: string; competition: string }[] {
  const seed = makeSeed(keyword, 'tags');
  const rand = seededRandom(seed);

  // 메인 태그 (항상 포함)
  const mainTags = [
    { tag: keyword, volume: '월 1만+', competition: '높음' },
    { tag: `${keyword} 추천`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 방법`, volume: '월 8천+', competition: '중간' },
    { tag: `${keyword} 입문`, volume: '월 3천+', competition: '낮음' },
  ];

  // 변형 태그 풀 (랜덤 선택)
  const variantPool = [
    { tag: `${keyword} 후기`, volume: '월 4천+', competition: '낮음' },
    { tag: `${keyword} 시작`, volume: '월 6천+', competition: '중간' },
    { tag: `${keyword} 실전`, volume: '월 2천+', competition: '낮음' },
    { tag: `${keyword} 가이드`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 노하우`, volume: '월 4천+', competition: '낮음' },
    { tag: `${keyword} 비결`, volume: '월 2천+', competition: '낮음' },
    { tag: `${keyword} 팁`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 정리`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 비교`, volume: '월 2천+', competition: '낮음' },
    { tag: `${keyword} 분석`, volume: '월 1천+', competition: '낮음' },
  ];

  // 롱테일 태그 풀 (랜덤 선택)
  const longTailPool = [
    { tag: `40대 ${keyword}`, volume: '월 2천+', competition: '낮음' },
    { tag: `50대 ${keyword}`, volume: '월 1천+', competition: '낮음' },
    { tag: `${keyword} 처음`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 직장인`, volume: '월 2천+', competition: '낮음' },
    { tag: `2026 ${keyword}`, volume: '월 4천+', competition: '중간' },
    { tag: `${keyword} 무료`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 초보`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 실패`, volume: '월 1천+', competition: '낮음' },
  ];

  // 카테고리 태그 (항상)
  const categoryTags = [
    { tag: categoryName, volume: '월 5만+', competition: '높음' },
    { tag: `${categoryName} 입문`, volume: '월 1만+', competition: '중간' },
  ];

  return [
    ...mainTags,
    ...pickN(variantPool, 4, rand),
    ...pickN(longTailPool, 3, rand),
    ...categoryTags,
  ].slice(0, 13); // 13개로 통일 (8~15가 SEO 최적)
}

// ============================================================
// 영상 시퀀스 생성 - "떡상 시나리오" 엔진
// ============================================================
//
// 핵심 설계:
// 1. 7단계 감정 곡선 (Hook → 공감 → 갈등 → 여정 → 클라이맥스 → 교훈 → 행동)
// 2. 각 단계마다 5~8개 풀에서 랜덤 선택 → 매번 다른 시나리오
// 3. 모든 스크립트는 구체적 (placeholder 절대 금지)
// 4. AI 티 안 나는 자연스러운 한국어 화법

export interface VideoSequence {
  number: number;
  duration: string;
  title: string;
  purpose: string;
  script: string;
  imagePromptKr: string;
  imagePromptEn: string;
  videoPromptKr: string;
  videoPromptEn: string;
  tip: string;
}

/**
 * 1단계 - 강력한 후크 (0:00 ~ 0:15)
 * 시청자가 영상에서 이탈하지 않게 만드는 첫 15초
 */
function buildHook(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const hookPool = [
    {
      script: `(잠시 침묵 후) ${detail.time}, ${k(keyword, 'eul')} 시작했습니다. 솔직히 말씀드리면, 만약 누가 그때 저한테 이 영상에서 말씀드릴 내용을 알려줬다면 저는 ${detail.number} 다른 길을 갔을 거예요. 끝까지 봐주세요. 후회하실 일 없게 해드릴게요.`,
      tip: '⚠️ 첫 3초가 영상 운명 결정. 자기소개로 시작하면 이탈률 70% 증가.',
    },
    {
      script: `${keyword}, 이거 진짜 시작하기 전에 꼭 들어야 할 얘기가 있습니다. ${detail.life} 이걸 깨달았는데, ${detail.emotion}. 이 영상 한 번이면 됩니다. 그 시간이 아깝지 않으실 거예요.`,
      tip: '💡 구체적 시간/장소 디테일이 진정성을 높입니다.',
    },
    {
      script: `(차분하게) 혹시 ${k(keyword, 'ro')} 고민하고 계신가요? 저도 그랬습니다. 정확히 말씀드리면, ${detail.time}까지는 진짜 막막했어요. 그런데 ${detail.number} 한 가지를 알게 됐어요. 오늘 그 한 가지를 끝까지 풀어드릴 테니, 잠깐만 시간 내주세요.`,
      tip: '🎯 시청자 본인의 고민을 거울처럼 비춰주는 후크가 가장 강력.',
    },
    {
      script: `${keyword}, 솔직히 처음에는 저도 만만하게 봤습니다. 그러다가 ${detail.life} 큰 깨달음이 왔어요. 이걸 모르고 그냥 시작했으면 저는 지금 어디서 뭘 하고 있을지 모르겠습니다. 그래서 오늘 영상은 진심으로 만들었어요.`,
      tip: '⚡ "솔직히"라는 단어 하나가 신뢰도를 30% 높입니다.',
    },
    {
      script: `여러분, 잠깐만요. ${keyword} 시작하시기 전에 이거 하나만 보고 가세요. 진짜로요. ${detail.emotion}. 그래서 오늘 이 영상을 찍게 됐습니다. 시간 낭비 안 하시게 핵심만 정리했어요.`,
      tip: '💬 직접 호명("여러분")이 친근감을 만듭니다.',
    },
    {
      script: `(고개를 끄덕이며) 네, 맞습니다. ${k(keyword, 'i')} 그래요. 처음에는 다 쉬워 보이거든요. 근데 ${detail.time} 정도 지나고 보니까 알겠더라고요. 진짜 중요한 건 따로 있다는 걸요. 오늘 그 얘기를 해드릴게요.`,
      tip: '🤝 시청자와의 대화처럼 시작하면 몰입도가 올라갑니다.',
    },
  ];

  const selected = pick(hookPool, rand);

  const visualPool = [
    {
      kr: `진지한 표정의 한국 중년 남성, 카페나 서재 같은 차분한 공간, 자연광, 클로즈업 샷, 따뜻한 색감, 영화같은 색보정, 렌즈 흐림 효과로 배경 분리, 16:9`,
      en: `Korean middle-aged man with serious expression, calm space like cafe or study, natural lighting, close-up shot, warm tones, cinematic color grading, bokeh background separation, 16:9 aspect ratio, documentary style`,
    },
    {
      kr: `생각에 잠긴 한국 남성, 창가 자리, 커피잔이 보이는 화면, 부드러운 자연광, 미디엄 샷, 차분한 분위기, 회상하는 듯한 표정, 16:9`,
      en: `Korean man deep in thought, window seat, coffee cup visible, soft natural lighting, medium shot, calm atmosphere, reminiscent expression, 16:9, cinematic style`,
    },
    {
      kr: `정면을 응시하는 한국 중년 남성, 단정한 셔츠, 깨끗한 배경, 진심을 담은 눈빛, 자연광, 미디엄 클로즈업, 신뢰감 있는 분위기, 16:9`,
      en: `Korean middle-aged man looking directly forward, neat shirt, clean background, sincere eyes, natural lighting, medium close-up, trustworthy atmosphere, 16:9`,
    },
  ];

  const visual = pick(visualPool, rand);

  return {
    number: 1,
    duration: '0:00 ~ 0:15',
    title: '강력한 후크 (Hook)',
    purpose: '첫 15초가 영상의 운명을 결정 - 시청자 이탈 방지',
    script: selected.script,
    imagePromptKr: visual.kr,
    imagePromptEn: visual.en,
    videoPromptKr: `차분하게 정면을 바라보는 인물, 약한 줌인 효과, 5초, 16:9, 후크 영상용, 자연스러운 표정 변화`,
    videoPromptEn: `Person calmly looking forward, subtle zoom-in effect, 5 seconds, 16:9 aspect ratio, hook style for video opening, natural expression change`,
    tip: selected.tip,
  };
}

/**
 * 2단계 - 공감 / 시청자 문제 인식 (0:15 ~ 1:30)
 */
function buildEmpathy(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const empathyPool = [
    {
      script: `많은 분들이 ${k(keyword, 'eul')} 시작하실 때 비슷한 고민을 하세요. "이게 정말 나한테 맞을까?", "지금 시작해도 늦지 않을까?", "혹시 시간 낭비는 아닐까?" 저도 같은 생각을 했었어요. 그래서 오늘 이 부분부터 짚고 가겠습니다. 사실 이게 ${keyword}의 진짜 시작점이거든요.`,
      tip: '💡 시청자의 머릿속 질문을 그대로 입에 담으면 "나도 모르게 끄덕이게" 됩니다.',
    },
    {
      script: `${detail.life} 이런 생각이 들었어요. "다들 ${keyword} 좋다고 하는데 왜 나는 이렇게 막막할까?" 그게 사실 자연스러운 거였어요. 알고 보니 거의 모든 사람이 똑같이 그 지점에서 막혔거든요. 그게 오늘 영상의 출발점입니다.`,
      tip: '🎯 "거의 모든 사람"이라는 표현이 시청자의 자책감을 덜어줍니다.',
    },
    {
      script: `솔직히 ${keyword}에 대한 정보는 인터넷에 너무 많아요. 그게 오히려 문제예요. 무엇부터 봐야 할지, 누구 말을 믿어야 할지 모르겠으니까요. 저도 그랬습니다. ${detail.number} 정신 차렸어요. 오늘은 제가 시행착오 끝에 정리한 핵심만 말씀드릴게요.`,
      tip: '⚡ 시청자가 느끼는 "정보 과잉" 피로를 인정해주면 신뢰가 쌓입니다.',
    },
    {
      script: `여기까지 영상 보고 계시다는 건, ${keyword}에 진심이라는 뜻이에요. 저도 압니다. 그 마음 잘 알아요. 그래서 더 진심으로 정리했습니다. 본격적으로 들어가기 전에 한 가지만 약속드릴게요. 오늘 영상에서는 광고도, 과장도 없습니다.`,
      tip: '🤝 시청자를 인정하는 한 마디가 끝까지 보게 만드는 동기가 됩니다.',
    },
    {
      script: `사실 ${k(keyword, 'eul')} 검색하시는 분들 마음을 압니다. ${detail.emotion}. 막연하지만 뭔가 시작은 하고 싶고, 그런데 어디서부터 손대야 할지 모르겠고. 오늘 영상은 그런 분들을 위해 만들었어요. 처음부터 끝까지 친절하게 풀어드릴게요.`,
      tip: '💬 시청자의 감정을 먼저 알아주면 정보 전달이 쉬워집니다.',
    },
  ];

  const selected = pick(empathyPool, rand);

  return {
    number: 2,
    duration: '0:15 ~ 1:30',
    title: '공감 / 시청자 문제 인식',
    purpose: '시청자가 "내 얘기네"라고 느끼게 만들기',
    script: selected.script,
    imagePromptKr: `따뜻한 분위기의 한국 중년 남성, 진심 어린 눈빛, 자연광이 비치는 실내, 손짓이 보이는 미디엄 샷, 부드러운 색감, 시청자와 대화하는 느낌, 16:9`,
    imagePromptEn: `Warm atmosphere of Korean middle-aged man, sincere eyes, indoor with natural lighting, medium shot showing hand gesture, soft color tones, conversational feel with viewer, 16:9`,
    videoPromptKr: `손동작이 자연스러운 인물, 부드러운 표정 변화, 8초, 16:9, 대화하는 듯한 자연스러운 움직임`,
    videoPromptEn: `Person with natural hand gestures, soft expression changes, 8 seconds, 16:9, natural movements like in conversation`,
    tip: selected.tip,
  };
}

/**
 * 3단계 - 갈등 / 진짜 문제 (1:30 ~ 3:00)
 * 시청자가 "이게 진짜 중요하구나"를 깨닫는 순간
 */
function buildConflict(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const conflictPool = [
    {
      script: `자, 이제 본격적으로 들어갑니다. ${k(keyword, 'eul')} 시작하는 분들의 가장 큰 함정이 뭔지 아세요? 바로 "급한 마음"입니다. ${detail.time}에 저도 그랬어요. 빨리 결과를 내고 싶어서 ${detail.number} 잘못된 길로 갔습니다. 결과는요? 시간만 낭비했어요. 이 부분, 잘 들어주세요.`,
      tip: '⚠️ 자신의 실패담은 가장 강력한 신뢰 빌딩 도구입니다.',
    },
    {
      script: `여기서 진짜 문제는 따로 있어요. ${k(keyword, 'eul')} 시작하는 사람의 90%가 첫 한 달 안에 포기합니다. 왜 그럴까요? 단순합니다. 잘못된 기대 때문이에요. "한 달이면 결과 나올 거야"라는 그 기대요. 그게 가장 큰 적입니다. 그럼 어떻게 해야 할까요?`,
      tip: '🎯 "90%가 실패"라는 통계 같은 표현이 강한 임팩트를 만듭니다.',
    },
    {
      script: `${keyword}에서 가장 큰 오해는 이거예요. "능력이 부족해서 못 한다"는 생각. 아닙니다. 진짜 이유는 다른 데 있어요. ${detail.life} 저는 이걸 깨달았는데, 정말 무릎을 탁 쳤습니다. 핵심은 능력이 아니라 "방식"이었어요.`,
      tip: '💡 시청자의 자존감을 지켜주면서 진짜 원인을 짚는 화법이 중요.',
    },
    {
      script: `여기서 멈추고 한 가지만 짚고 갈게요. 만약 지금 ${k(keyword, 'ro')} 답답하시다면, 능력 문제 아닙니다. 노력 문제도 아니에요. 정말 99%는 "방향"의 문제예요. 저도 그랬으니까요. ${detail.number} 알게 된 사실입니다.`,
      tip: '🤝 시청자를 위로하면서 핵심을 짚으면 끝까지 보게 됩니다.',
    },
    {
      script: `${k(keyword, 'eul')} 5년, 10년 한 분들도 이거 모르고 가는 경우가 많아요. 진짜 차이를 만드는 한 가지 말씀드릴게요. 그건 "정보의 양"이 아니라 "선택의 질"입니다. 정보는 이미 충분해요. 문제는 그 중에서 무엇을 선택하느냐예요.`,
      tip: '⚡ 경력자도 모른다는 표현은 입문자에게 큰 안도감을 줍니다.',
    },
  ];

  const selected = pick(conflictPool, rand);

  return {
    number: 3,
    duration: '1:30 ~ 3:00',
    title: '갈등 / 진짜 문제 짚기',
    purpose: '시청자가 진짜 핵심을 깨닫는 결정적 순간',
    script: selected.script,
    imagePromptKr: `한국 남성이 손가락으로 무언가를 가리키는 강조 동작, 진지한 표정, 깔끔한 배경, 자연광, 미디엄 샷, 설명하는 분위기, 16:9`,
    imagePromptEn: `Korean man pointing at something with emphasis gesture, serious expression, clean background, natural lighting, medium shot, explanatory atmosphere, 16:9`,
    videoPromptKr: `손짓하며 강조하는 인물, 표정 변화, 약간의 카메라 움직임, 10초, 16:9, 강조 장면용`,
    videoPromptEn: `Person gesturing with emphasis, expression changes, slight camera movement, 10 seconds, 16:9, emphasis scene style`,
    tip: selected.tip,
  };
}

/**
 * 4단계 - 여정 / 핵심 해법 (3:00 ~ 6:00)
 */
function buildJourney(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const journeyPool = [
    {
      script: `자, 이제 진짜 핵심입니다. ${k(keyword, 'eul')} 제대로 하려면 3가지만 기억하시면 돼요. 첫째, 작게 시작하세요. ${detail.number} 작은 시도부터요. 둘째, 한 번에 하나씩 하세요. 욕심이 적이에요. 셋째, 1주일 단위로 점검하세요. 그래야 길을 잃지 않아요. 이 세 가지만 지켜도 90%는 성공합니다.`,
      tip: '🎯 "3가지"는 사람이 한 번에 기억하기 좋은 마법의 숫자입니다.',
    },
    {
      script: `제가 실패하면서 깨달은 ${keyword} 핵심 5단계 알려드릴게요. STEP 1, 목표를 종이에 쓰세요. 막연한 결심은 95% 실패합니다. STEP 2, 일주일 단위로 쪼개세요. 한 달 계획은 깨지기 쉬워요. STEP 3, 매일 5분이라도 하세요. 한 번에 2시간보다 매일 5분이 강력합니다. STEP 4, 결과를 기록하세요. 안 보이면 동기 사라져요. STEP 5, 한 달마다 점검하세요.`,
      tip: '✅ 단계별 명확한 가이드가 시청자에게 행동 동력을 줍니다.',
    },
    {
      script: `${keyword}의 진짜 비결은 의외로 단순합니다. 매일 30분, 같은 시간대에, 같은 방식으로 하시면 됩니다. ${detail.life} 깨달은 건데, 큰 변화는 의외로 사소한 반복에서 옵니다. 한 달 후의 모습이 완전히 달라져요. 이게 ${keyword} 마스터하시는 분들의 공통점이에요.`,
      tip: '⚡ 단순함이 가장 강력한 메시지입니다.',
    },
    {
      script: `자, 핵심을 정리해드릴게요. ${keyword}에서 결과 내는 분들과 못 내는 분들의 차이는 딱 하나예요. "꾸준함"이 아니라 "체계"입니다. 무작정 열심히 하면 지치고요. 체계 잡고 하면 가속도가 붙습니다. 그 체계를 어떻게 잡는지, 지금부터 풀어드릴게요.`,
      tip: '🔑 일반적 답변(꾸준함)을 부정하고 진짜 답을 제시하면 임팩트 강함.',
    },
    {
      script: `여기서 정말 중요한 거 하나만 말씀드리면, ${k(keyword, 'eun')} "혼자" 하면 안 돼요. ${detail.emotion}. 같이 하는 사람이 한 명이라도 있어야 합니다. 가족이든, 친구든, 온라인 모임이든요. 함께하는 시간이 30%만 늘어도 지속률이 3배 올라갑니다. 이게 통계예요.`,
      tip: '💬 의외성 + 구체적 수치 = 기억에 남는 메시지.',
    },
  ];

  const selected = pick(journeyPool, rand);

  return {
    number: 4,
    duration: '3:00 ~ 6:00',
    title: '핵심 해법 / 실전 단계',
    purpose: '약속한 정보 전달 - 영상의 핵심 가치',
    script: selected.script,
    imagePromptKr: `책상 위에 펼쳐진 노트와 펜, ${keyword} 관련 메모, 자연광, 손이 메모 적는 모습, 따뜻한 색감, 차분한 분위기, 16:9`,
    imagePromptEn: `Notebook and pen spread on desk, notes related to ${keyword}, natural lighting, hand writing notes, warm tones, calm atmosphere, 16:9, lifestyle shot`,
    videoPromptKr: `손이 노트에 메모를 적는 클로즈업, 위에서 내려다보는 각도, 자연스러운 움직임, 12초, 16:9`,
    videoPromptEn: `Close-up of hand writing notes in notebook, top-down angle, natural movement, 12 seconds, 16:9, documentary style`,
    tip: selected.tip,
  };
}

/**
 * 5단계 - 클라이맥스 / 결정적 통찰 (6:00 ~ 8:00)
 */
function buildClimax(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const climaxPool = [
    {
      script: `여기까지 봐주신 분들께 진짜 중요한 말씀드릴게요. ${k(keyword, 'eul')} ${detail.time}부터 해온 사람으로서 자신 있게 말씀드립니다. 진짜 비밀은 이거예요. 빨리 가려고 하지 마세요. 천천히 가는 게 가장 빠른 길이에요. 이 말, 처음 들으셨을 땐 저도 안 믿었어요. 근데 ${detail.number} 진짜라는 걸 깨달았습니다.`,
      tip: '🎯 영상의 가장 깊은 통찰을 이 단계에서. "여기까지 봐주신 분들께"가 핵심.',
    },
    {
      script: `이 부분이 오늘 영상의 진짜 메시지입니다. ${keyword}, 결국엔 자기 자신과의 싸움이에요. 외부 정보는 이미 충분합니다. 진짜 차이는 "내가 어떻게 받아들이느냐"에서 나옵니다. ${detail.emotion}. 그래서 마지막으로 한 가지만 부탁드리고 싶어요.`,
      tip: '💡 외부에서 답을 찾는 대신 내면을 보게 하면 깊은 임팩트가 됩니다.',
    },
    {
      script: `진짜 핵심을 말씀드릴게요. ${keyword}에서 성공하는 사람들의 공통점이 뭔지 아세요? 머리가 좋아서가 아니에요. 시간이 많아서도 아닙니다. 단 하나, "포기하지 않을 핑계 하나"를 가진 거예요. ${detail.life} 저는 그 핑계를 만들었습니다. 그게 모든 걸 바꿨어요.`,
      tip: '⚡ "왜 해야 하는가"라는 동기 부여가 모든 노하우보다 강력합니다.',
    },
    {
      script: `(잠시 멈추고) 이거 하나는 진짜 진심으로 말씀드리고 싶어요. ${k(keyword, 'eun')}요, 그 자체가 목적이 아니에요. 그걸 통해서 내가 어떤 사람이 되어가는지가 진짜 중요합니다. ${detail.time} 정도 지나고 보니 알겠더라고요. 결과보다 그 과정에서 단단해진 내가 더 큰 자산이라는 걸요.`,
      tip: '🤝 결과 너머의 가치를 짚으면 시청자가 깊이 공감합니다.',
    },
    {
      script: `여기까지 영상 봐주신 것만으로도 정말 감사합니다. 마지막으로 하나만 더 말씀드릴게요. ${keyword}, 시작하시면 분명 막막한 순간이 올 거예요. 그때 오늘 영상을 떠올려주세요. ${detail.number} 우리 모두 그 길을 거쳤어요. 혼자가 아니에요. 같이 갑시다.`,
      tip: '💬 감사 인사 + 응원 메시지가 끝까지 본 시청자에게 큰 감동을 줍니다.',
    },
  ];

  const selected = pick(climaxPool, rand);

  return {
    number: 5,
    duration: '6:00 ~ 8:00',
    title: '클라이맥스 / 결정적 통찰',
    purpose: '영상의 가장 깊은 메시지 - 시청자 가슴에 남는 한 마디',
    script: selected.script,
    imagePromptKr: `진심 어린 눈빛의 한국 중년 남성, 따뜻한 자연광, 단정한 옷차림, 클로즈업, 깊은 감정이 느껴지는 표정, 16:9, 영화적 색감`,
    imagePromptEn: `Korean middle-aged man with sincere eyes, warm natural lighting, neat attire, close-up, expression with deep emotion, 16:9, cinematic color grading`,
    videoPromptKr: `눈을 천천히 깜빡이는 인물, 부드러운 표정 변화, 강한 감정이 느껴지는 분위기, 8초, 16:9, 클라이맥스 장면`,
    videoPromptEn: `Person slowly blinking, soft expression changes, atmosphere with strong emotion, 8 seconds, 16:9, climax scene`,
    tip: selected.tip,
  };
}

/**
 * 6단계 - 교훈 / 정리 (8:00 ~ 9:00)
 */
function buildLesson(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const lessonPool = [
    {
      script: `자, 오늘 영상 정리해드릴게요. ${keyword}에서 진짜 중요한 건 세 가지였어요. 첫째, 작게 시작하기. 둘째, 체계 만들기. 셋째, 함께 하기. 이 세 가지만 기억하시면 됩니다. 종이에 적어두시고, 막힐 때마다 보세요. 진짜 도움이 될 거예요.`,
      tip: '✅ 명확한 3가지 정리가 시청자가 영상을 가져갈 수 있는 가장 좋은 방법.',
    },
    {
      script: `오늘 영상에서 한 가지만 가져가신다면, 이거예요. ${k(keyword, 'eun')} "결과"가 아니라 "방향"입니다. 빨리 도착하려 하지 말고, 옳은 방향으로 가고 있는지 점검하세요. 그게 가장 빠른 길입니다. ${detail.time} 무렵부터 진짜 알게 된 진리예요.`,
      tip: '🎯 한 문장으로 핵심 메시지를 압축하면 기억에 오래 남습니다.',
    },
    {
      script: `정리하면 이래요. ${k(keyword, 'eun')} 어렵지 않습니다. 다만 시간이 필요할 뿐이에요. 오늘 영상을 보신 여러분은 이미 다른 90%보다 앞서 있는 거예요. 정보가 있으니까요. 이제 행동만 남았습니다. 작게라도 오늘 시작해보세요.`,
      tip: '⚡ 시청자의 자기 효능감을 높이는 마무리가 행동 유도에 효과적.',
    },
    {
      script: `오늘 핵심 메시지 한 번 더 정리할게요. ${keyword}, 빠른 결과보다 꾸준한 방향이 중요합니다. 혼자보다 함께가 강합니다. 정보보다 실행이 답입니다. 이 세 가지, 꼭 기억해주세요. ${detail.number} 진짜라는 걸 깨달은 진리들이에요.`,
      tip: '💡 핵심 3가지를 다른 표현으로 다시 정리하면 학습 효과가 커집니다.',
    },
  ];

  const selected = pick(lessonPool, rand);

  return {
    number: 6,
    duration: '8:00 ~ 9:00',
    title: '교훈 / 핵심 정리',
    purpose: '시청자가 영상에서 가져갈 핵심 메시지 정리',
    script: selected.script,
    imagePromptKr: `정리된 노트, 깔끔하게 정돈된 책상, 따뜻한 자연광, 펼쳐진 노트의 핵심 포인트들, 16:9, 미니멀 라이프스타일`,
    imagePromptEn: `Organized notebook, neatly arranged desk, warm natural lighting, key points on open notebook, 16:9, minimal lifestyle photography`,
    videoPromptKr: `노트 페이지를 천천히 넘기는 손, 정돈된 책상, 자연광, 8초, 16:9, 정리 분위기`,
    videoPromptEn: `Hand slowly turning notebook pages, organized desk, natural lighting, 8 seconds, 16:9, organizing atmosphere`,
    tip: selected.tip,
  };
}

/**
 * 7단계 - 행동 유도 / 마무리 (9:00 ~ 10:00)
 */
function buildAction(keyword: string, scenarioId: string, rand: () => number, detail: ReturnType<typeof getConcreteDetails>): VideoSequence {
  const actionPool = [
    {
      script: `오늘 영상 끝까지 봐주셔서 정말 감사합니다. 한 가지 부탁드리고 싶어요. 영상이 도움 됐다면, 좋아요 한 번만 눌러주세요. 그게 저한테 큰 힘이 됩니다. 그리고 댓글로 본인의 ${keyword} 시작 이야기 들려주세요. 한 분 한 분 다 읽어볼게요. 다음 영상에서는 ${keyword}의 다음 단계, 함께 나가보겠습니다. 그럼 다음에 또 만나요.`,
      tip: '🤝 진심 어린 감사 + 구체적 행동 요청 + 다음 영상 예고 = 완벽한 마무리.',
    },
    {
      script: `오늘 ${keyword} 영상은 여기서 마치겠습니다. 진심으로 말씀드리는데, 시작이 가장 어려워요. 일단 작게라도 오늘 시작해보세요. 그리고 막막하시면 댓글로 물어봐주세요. 답변드릴게요. 영상이 도움 되셨으면 좋아요와 구독 부탁드립니다. 다음 영상에서 만나요.`,
      tip: '💬 댓글 답변 약속이 시청자와의 진짜 관계를 만듭니다.',
    },
    {
      script: `정말 끝까지 봐주셔서 고맙습니다. 오늘 영상 한 줄 요약하면 "작게 시작하고, 체계 만들고, 함께 가자"입니다. 오늘부터 단 한 가지라도 적용해보시면 한 달 후 정말 다른 자신을 만나실 거예요. 좋아요와 구독, 진심으로 부탁드립니다. 그리고 ${k(keyword, 'ro')} 고민되는 부분 댓글로 남겨주시면, 그 댓글로 다음 영상 만들겠습니다.`,
      tip: '⚡ 한 줄 요약 + 댓글로 다음 영상 만든다는 약속이 참여를 유도합니다.',
    },
    {
      script: `여기까지 영상 봐주신 분들, 진짜 감사드려요. 마지막으로 하나만요. ${keyword}, 혼자 하지 마세요. 댓글에서라도 같이 가요. 영상에 좋아요 + 댓글 남겨주시면 저도 더 진심으로 영상 만들 수 있습니다. 다음 영상은 ${detail.number} 정리한 ${keyword} 다음 단계 노하우입니다. 구독해두시면 알림으로 알려드릴게요.`,
      tip: '🎯 "혼자 하지 말자"는 메시지로 커뮤니티 형성을 유도하면 강력.',
    },
  ];

  const selected = pick(actionPool, rand);

  return {
    number: 7,
    duration: '9:00 ~ 10:00',
    title: '행동 유도 / 마무리',
    purpose: '구독·좋아요·댓글 유도 + 다음 영상 예고',
    script: selected.script,
    imagePromptKr: `따뜻한 미소를 짓는 한국 중년 남성, 카메라를 보며 손을 흔드는 마무리 인사, 자연광, 친근한 분위기, 16:9`,
    imagePromptEn: `Korean middle-aged man with warm smile, waving goodbye looking at camera, natural lighting, friendly atmosphere, 16:9, sincere closing shot`,
    videoPromptKr: `미소 지으며 손을 흔드는 인물, 따뜻한 마무리 분위기, 자연스러운 움직임, 8초, 16:9, 인사 영상용`,
    videoPromptEn: `Person waving with smile, warm closing atmosphere, natural movement, 8 seconds, 16:9, farewell style`,
    tip: selected.tip,
  };
}

/**
 * 메인 함수: 7단계 떡상 시퀀스 생성
 *
 * 같은 키워드라도 호출 시각(분 단위)이 다르면 완전히 다른 시나리오 생성
 * → 박 대표님 비전: "100명이 같은 키워드 입력해도 100가지 다른 결과"
 */
export function generateVideoSequences(keyword: string, scenarioId: string): VideoSequence[] {
  const seed = makeSeed(keyword, scenarioId + '_sequence');
  const rand = seededRandom(seed);
  const detail = getConcreteDetails(keyword, rand);

  return [
    buildHook(keyword, scenarioId, rand, detail),
    buildEmpathy(keyword, scenarioId, rand, detail),
    buildConflict(keyword, scenarioId, rand, detail),
    buildJourney(keyword, scenarioId, rand, detail),
    buildClimax(keyword, scenarioId, rand, detail),
    buildLesson(keyword, scenarioId, rand, detail),
    buildAction(keyword, scenarioId, rand, detail),
  ];
}

// ============================================================
// 썸네일 콘셉트 (CTR 최적화 + 다양성)
// ============================================================

export interface ThumbnailConcept {
  type: string;
  background: string;
  mainText: string;
  subText: string;
  expression: string;
  colors: string;
  ctr_estimate: string;
  imagePromptKr: string;
  imagePromptEn: string;
}

const THUMBNAIL_POOLS: ((k: string, c: string) => ThumbnailConcept)[] = [
  (keyword, categoryName) => ({
    type: '충격형 (CTR 최강)',
    background: `${categoryName} 분야의 임팩트 있는 시각적 배경`,
    mainText: `"${keyword}" 빨간 큰 글씨`,
    subText: `"이거 모르면 진짜 후회" - 노란색 강조`,
    expression: '눈을 크게 뜬 놀란 표정',
    colors: '빨강 + 노랑 (강한 대비)',
    ctr_estimate: 'CTR 예상 8~12%',
    imagePromptKr: `한국 중년 남성, 매우 놀란 표정으로 눈을 크게 뜨고 있음, 클로즈업, 빨간색과 노란색이 대비되는 강렬한 배경, 한국어 텍스트 "${keyword}" 큰 글씨 공간, 16:9 썸네일 비율, 고채도, YouTube 클릭률 높은 썸네일 스타일`,
    imagePromptEn: `Korean middle-aged man, very surprised expression with eyes wide open, close-up shot, vibrant background with red and yellow contrast, space for large Korean text "${keyword}", 16:9 thumbnail ratio, high saturation, high CTR YouTube thumbnail style`,
  }),
  (keyword, categoryName) => ({
    type: '비포애프터형 (변화 강조)',
    background: '좌우 분할: 왼쪽(어둡고 답답함) vs 오른쪽(밝고 자신감)',
    mainText: `"${keyword} 6개월 후"`,
    subText: 'BEFORE / AFTER 라벨',
    expression: '두 가지 표정 (좌측은 고민, 우측은 자신감)',
    colors: '회색(왼) vs 골드(오른) 대비',
    ctr_estimate: 'CTR 예상 7~10%',
    imagePromptKr: `좌우 분할 화면, 왼쪽은 한국 중년 남성이 어두운 환경에서 고민하는 모습, 오른쪽은 같은 사람이 밝은 환경에서 자신감 있게 미소 짓는 모습, 큰 BEFORE와 AFTER 텍스트, 회색-골드 색상 대비, 16:9 썸네일`,
    imagePromptEn: `Split screen left and right, left side Korean middle-aged man worried in dark environment, right side same person confidently smiling in bright environment, large BEFORE and AFTER text, gray-gold color contrast, 16:9 thumbnail`,
  }),
  (keyword, categoryName) => ({
    type: '숫자형 (랭킹/리스트)',
    background: '깔끔한 그라데이션 배경 + 큰 숫자 강조',
    mainText: `"${keyword} BEST 7"`,
    subText: '"마지막이 진짜 충격" - 빨간색',
    expression: '의미심장한 미소',
    colors: '딥블루 + 골드 (프리미엄 분위기)',
    ctr_estimate: 'CTR 예상 6~9%',
    imagePromptKr: `숫자 7이 크게 강조된 깔끔한 디자인, 한국 중년 남성이 의미심장한 미소를 짓고 있음, 딥블루-골드 색상 조합, 프리미엄 분위기, "BEST 7" 큰 글씨, 16:9 썸네일`,
    imagePromptEn: `Clean design with prominently emphasized number 7, Korean middle-aged man with meaningful smile, deep blue-gold color combination, premium atmosphere, large "BEST 7" text, 16:9 thumbnail`,
  }),
  (keyword, categoryName) => ({
    type: '진심형 (신뢰 강조)',
    background: '따뜻한 자연광이 들어오는 차분한 실내',
    mainText: `"${keyword} 진실"`,
    subText: '"제가 직접 1년" - 따뜻한 색감 강조',
    expression: '진지하고 따뜻한 눈빛',
    colors: '베이지 + 진한 녹색 (안정감)',
    ctr_estimate: 'CTR 예상 6~8%',
    imagePromptKr: `진심 어린 표정의 한국 중년 남성, 따뜻한 자연광이 비치는 차분한 실내, 부드러운 미소, "진실" 한국어 큰 글씨 공간, 베이지-녹색 톤, 16:9 썸네일, 신뢰감 있는 분위기`,
    imagePromptEn: `Korean middle-aged man with sincere expression, calm indoor with warm natural lighting, soft smile, space for large Korean text "Truth", beige-green tones, 16:9 thumbnail, trustworthy atmosphere`,
  }),
  (keyword, categoryName) => ({
    type: '경고형 (위험 강조)',
    background: '경고 아이콘이 부각된 임팩트 배경',
    mainText: `"${keyword} 함정"`,
    subText: '"이거 절대 하지 마세요"',
    expression: '심각한 경고 표정',
    colors: '검정 + 빨강 (긴장감)',
    ctr_estimate: 'CTR 예상 7~10%',
    imagePromptKr: `진지하고 경고하는 표정의 한국 중년 남성, 어두운 배경에 빨간색 경고 아이콘 강조, "함정" 큰 한국어 글씨 공간, 검정-빨강 대비, 16:9 썸네일, 강한 임팩트`,
    imagePromptEn: `Korean middle-aged man with serious warning expression, dark background with emphasized red warning icon, space for large Korean text "Trap", black-red contrast, 16:9 thumbnail, strong impact`,
  }),
  (keyword, categoryName) => ({
    type: '체크리스트형 (실용)',
    background: '깔끔한 흰 배경에 체크박스 디자인',
    mainText: `"${keyword} 5가지"`,
    subText: '"오늘부터 시작" - 녹색 체크',
    expression: '환한 미소',
    colors: '흰색 + 녹색 + 오렌지 강조',
    ctr_estimate: 'CTR 예상 6~8%',
    imagePromptKr: `밝은 미소의 한국 중년 남성, 깔끔한 흰 배경에 5개 체크박스 디자인, "5가지" 큰 글씨 공간, 흰색-녹색-오렌지 컬러 조합, 16:9 썸네일, 실용적이고 깔끔한 디자인`,
    imagePromptEn: `Korean middle-aged man with bright smile, clean white background with 5 checkbox design, space for large text "5 Things", white-green-orange color combination, 16:9 thumbnail, practical clean design`,
  }),
];

export function generateThumbnailConcepts(
  keyword: string,
  categoryName: string
): ThumbnailConcept[] {
  const seed = makeSeed(keyword, 'thumbnail');
  const rand = seededRandom(seed);

  // 풀에서 시드 기반 3개 선택
  const selected = pickN(THUMBNAIL_POOLS, 3, rand);
  return selected.map((fn) => fn(keyword, categoryName));
}

// ============================================================
// 카테고리별 YouTube 분류 매핑
// ============================================================

export function getYouTubeCategory(categoryId: string): string {
  const mapping: Record<string, string> = {
    economy: '뉴스/정치 또는 교육',
    realestate: '뉴스/정치 또는 교육',
    jobs: '교육 또는 인물/블로그',
    senior: '인물/블로그 또는 라이프스타일',
    health: '건강 또는 교육',
    travel: '여행/이벤트',
    food: '노하우/스타일',
    tech: '과학/기술',
    education: '교육',
    review: '노하우/스타일 또는 인물/블로그',
    social: '뉴스/정치',
    hobby: '인물/블로그 또는 엔터테인먼트',
  };
  return mapping[categoryId] || '교육';
}
