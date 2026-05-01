/**
 * AlgoMaker 알고리즘 인사이트 데이터
 *
 * 박 대표님 업로드 자료 (5장 + 부록)을 백단 데이터로 정리.
 * 출처/타 명의 제거 후 사이트에서 자유롭게 활용 가능한 형태로 변환.
 *
 * 활용처:
 * 1. publish 페이지 결과 화면에 SEO 팁/체크리스트 동적 노출
 * 2. 가이드 페이지에서 데이터 참조
 * 3. v650Adapter 의 sns 데이터에 인사이트 추가 활용
 *
 * 박 대표님이 contentEngine.ts 를 직접 받으면 이 데이터를
 * generateDescription, generateTags 등에서 import 해서
 * 더 풍부한 결과 생성 가능.
 */

// ============================================================
// 1. SEO 키워드 전략 (제목 8:2 법칙)
// ============================================================
export const SEO_TITLE_FORMULA = {
  rule: '제목 앞 80% = 검색 키워드, 뒤 20% = 후킹 문구',
  examples: [
    {
      keyword: '돼지고기 김치찌개 황금레시피',
      hook: '10년 차 주부도 몰랐던 비법',
    },
    {
      keyword: '50대 재취업 면접 질문',
      hook: '인사 담당자가 진짜 보는 답변',
    },
    {
      keyword: '60대 부동산 청약 가이드',
      hook: '이거 모르고 신청하면 후회합니다',
    },
  ],
};

// ============================================================
// 2. 설명란 작성 가이드
// ============================================================
export const DESCRIPTION_TEMPLATE = {
  structure: [
    { line: '첫 1~2줄', content: '제목 핵심 키워드 포함, 영상 요약', importance: 'CRITICAL' },
    { line: '중간', content: '구체적 정보 자연스러운 문장으로', importance: 'HIGH' },
    { line: '하단', content: '관련 영상, 외부 링크, 해시태그 (3~5개)', importance: 'MEDIUM' },
  ],
  keywordRepeat: '핵심 키워드 자연스럽게 3~5회 반복',
  warning: '키워드 나열만 하면 스팸 처리. 반드시 자연스러운 문장 안에.',
};

// ============================================================
// 3. 시청 지속률 핵심 - 챕터 설정
// ============================================================
export const CHAPTER_RULES = {
  mustStartFromZero: '챕터는 반드시 00:00부터 시작',
  benefits: [
    '신뢰도 상승 (시청자가 시간 존중받는 느낌)',
    '구글 검색에서 영상 특정 구간 노출 가능',
    '이탈 방지 (원하는 부분 바로 이동)',
  ],
  template: [
    { time: '00:00', label: '인사 + 영상 소개' },
    { time: '00:35', label: '첫 번째 핵심' },
    { time: '01:50', label: '두 번째 핵심' },
    { time: '03:20', label: '마지막 정리 + CTA' },
  ],
};

// ============================================================
// 4. 최종화면 배치 전략
// ============================================================
export const END_SCREEN_STRATEGY = {
  optimalTiming: '영상 종료 5~20초 전',
  elements: [
    '관련 있는 영상 카드 1개 (논리적 연관성 중요)',
    '구독 버튼 1개',
  ],
  goldenTip: '영상 속 본인이 직접 가리키며 "다음 영상은 이걸 보시면 됩니다" 멘트하면 클릭률 3배 상승',
  example: '"김치찌개 만드는 법" 영상 끝 → "찌개와 어울리는 계란말이" 영상 추천 (관련성 ↑)',
};

// ============================================================
// 5. 해시태그 전략
// ============================================================
export const HASHTAG_STRATEGY = {
  optimalCount: 3,
  maxCount: 5,
  maxBeforeFail: 15,
  warning: '15개 초과 시 모든 해시태그 무효 처리',
  template: [
    { type: '메인 키워드', example: '#김치찌개', count: 1 },
    { type: '세부 키워드', example: '#황금레시피', count: 1 },
    { type: '채널명', example: '#채널이름', count: 1 },
  ],
};

// ============================================================
// 6. 채널 톤앤매너 (60-30-10 컬러 법칙)
// ============================================================
export const CHANNEL_BRANDING = {
  colorRule: '60-30-10 법칙',
  colorRoles: [
    { percentage: '60%', role: '메인 컬러', purpose: '채널 전반 분위기', examples: ['차분한 네이비', '따뜻한 베이지', '신뢰의 다크그린'] },
    { percentage: '30%', role: '포인트 컬러', purpose: '강조 부분', examples: ['신뢰의 화이트', '깔끔한 그레이'] },
    { percentage: '10%', role: '강조 컬러', purpose: '클릭 유도', examples: ['주목도 높은 옐로우', '강렬한 레드', '힘 있는 오렌지'] },
  ],
  channelArt3Elements: [
    { element: '핵심 가치', question: '이 채널은 무엇을 도와주는가?' },
    { element: '타겟', question: '누구를 위한 채널인가?' },
    { element: '업로드 주기', question: '언제 영상을 볼 수 있는가?' },
  ],
};

// ============================================================
// 7. 워터마크 전략
// ============================================================
export const WATERMARK_STRATEGY = {
  size: '150x150 픽셀',
  position: '영상 우측 하단',
  bestDesign: '"구독" 글자 또는 구독 아이콘 모양',
  effect: '구독 전환율 최소 15% 상승',
  warning: '복잡한 로고는 작아서 안 보임. 심플한 단어 1개가 효과적.',
};

// ============================================================
// 8. 치명적 실수 5가지
// ============================================================
export const CRITICAL_MISTAKES = [
  {
    mistake: '아동용 설정 잘못 체크',
    consequence: '댓글 폐쇄 + 맞춤 광고 금지 + 알림 미전송 + 저장 제한',
    fix: '[설정] → [채널] → [고급] → "아동용 아니요" 채널 단위 일괄 설정',
    severity: 'CRITICAL',
  },
  {
    mistake: '업로드 즉시 공개',
    consequence: 'SD 화질로 노출 → 시청자 이탈 + 광고 적합성 미검토 → 수익 손실',
    fix: '"일부 공개"로 1시간 대기 → HD/4K 처리 + 광고 검토 완료 → 정식 공개',
    severity: 'HIGH',
  },
  {
    mistake: '카테고리 잘못 설정',
    consequence: '알고리즘이 영상 분류 헷갈림 → 노출 감소',
    fix: '영상 내용에 정확히 맞는 카테고리 선택',
    severity: 'MEDIUM',
  },
  {
    mistake: '거주 국가 미설정',
    consequence: '한국 시청자 노출 감소',
    fix: '[설정] → [채널] → [기본 정보] → 거주 국가 "대한민국"',
    severity: 'MEDIUM',
  },
  {
    mistake: '시청 지속 시간 그래프 무시',
    consequence: '같은 실수 반복',
    fix: '유튜브 스튜디오 → 분석 → 시청 지속 시간 매번 확인',
    severity: 'HIGH',
  },
];

// ============================================================
// 9. 멘탈 서바이벌 (성장 마인드셋)
// ============================================================
export const MINDSET_PRINCIPLES = [
  {
    principle: '성과와 자아 분리',
    rule: '조회수 = 나의 가치 X. 알고리즘의 분류일 뿐',
    practice: '모든 영상을 "데이터 실험"으로 접근. 감정 빼고 수치로 분석.',
  },
  {
    principle: 'VIP 댓글 대접',
    rule: '댓글 1개의 가치 = 조회수 100회',
    practice: '초기 댓글 모두 하트 + 정성스러운 답글. 그 한 명이 찐팬이 됨.',
  },
  {
    principle: '복리 성장',
    rule: '오늘의 작은 세팅이 내일의 큰 변화',
    practice: '매일 1가지씩만 개선. 1년 후 360개의 개선 누적.',
  },
  {
    principle: '비교는 독',
    rule: '같은 출발선의 채널과만 비교',
    practice: '대형 채널 대신 비슷한 규모의 떡상 채널 분석',
  },
];

// ============================================================
// 10. 업로드 전 체크리스트 15가지 (전체)
// ============================================================
export const UPLOAD_CHECKLIST_15 = [
  // 기초 브랜딩 (4개)
  { category: '기초 브랜딩', item: '채널 설명(SEO)', detail: '메인 키워드 포함, 채널 정체성 명시' },
  { category: '기초 브랜딩', item: '비즈니스 이메일', detail: '[정보] 탭에 협업용 연락처 등록' },
  { category: '기초 브랜딩', item: '채널 트레일러', detail: '비구독자 대상 30초 채널 소개 영상' },
  { category: '기초 브랜딩', item: '구독 워터마크', detail: '영상 우측 하단 "구독" 아이콘' },
  // 검색 최적화 (4개)
  { category: '검색 최적화', item: '업로드 기본 설정', detail: '설명란 하단 고정 템플릿 (SNS 등)' },
  { category: '검색 최적화', item: '제목 키워드 배치', detail: '검색 키워드(앞) + 후킹 문구(뒤)' },
  { category: '검색 최적화', item: '설명란 첫 3줄', detail: '핵심 내용 문장형 키워드로 요약' },
  { category: '검색 최적화', item: '해시태그 전략', detail: '메인 + 세부 + 채널명 (3~5개)' },
  // 노출 및 유입 (3개)
  { category: '노출 및 유입', item: '썸네일 A/B 테스트', detail: '"테스트 및 비교" 기능으로 클릭률 최적화' },
  { category: '노출 및 유입', item: '카테고리 설정', detail: '채널 성격에 맞는 정확한 카테고리' },
  { category: '노출 및 유입', item: '거주 국가 설정', detail: '대한민국 등 타겟 국가 확인' },
  // 체류 시간 (3개)
  { category: '체류 시간', item: '재생목록 큐레이션', detail: '주제별 폴더화 + 키워드 포함 네이밍' },
  { category: '체류 시간', item: '영상 챕터(00:00)', detail: '타임스탬프 활용, 반드시 00:00 시작' },
  { category: '체류 시간', item: '최종 화면 설정', detail: '영상 종료 5~20초 전 관련 영상' },
  // 운영 및 수익 (1개)
  { category: '운영 및 수익', item: '고정 댓글 마케팅', detail: '질문 또는 링크로 소통 창구 활성화' },
];

// ============================================================
// 11. publish 결과 화면에서 활용할 동적 인사이트 매핑
// ============================================================

/**
 * 키워드별 권장 SEO 팁 자동 매칭
 */
export function getSeoTipForKeyword(keyword: string, categoryId: string): {
  titleTip: string;
  descriptionTip: string;
  hashtagTip: string;
  chapterSuggestion: string;
} {
  const k = keyword.toLowerCase();

  return {
    titleTip: `제목 앞 80%에 "${keyword}" 또는 관련 키워드를 배치하고, 뒤 20%에 호기심 유발 문구 추가`,
    descriptionTip: `설명란 첫 3줄에 "${keyword}" 포함. 자연스러운 문장으로 3~5회 반복`,
    hashtagTip: `해시태그 3~5개 권장: #${keyword.replace(/\s+/g, '')} + 세부 키워드 + 채널명`,
    chapterSuggestion: `챕터 4~5개 추천. 반드시 00:00부터 시작. 시청자가 원하는 부분 바로 이동 가능하게.`,
  };
}

/**
 * 카테고리별 추천 후킹 패턴
 */
export const HOOK_PATTERNS_BY_CATEGORY: Record<string, string[]> = {
  realestate: [
    '○년 차 부동산 전문가도 몰랐던',
    '99%가 놓치는 청약 비밀',
    '실거래가 데이터로 본 진짜 흐름',
    '계약 전 반드시 알아야 할',
  ],
  economy: [
    '월 100만원 더 만드는',
    '50대도 늦지 않은',
    '연금만 믿으면 안 되는 이유',
    '국세청도 모르는 절세 방법',
  ],
  health: [
    '5분만 따라하시면 됩니다',
    '70대 어머니가 직접 효과 본',
    '의사도 추천하는',
    '하루 3분이면 충분한',
  ],
  food: [
    '20년 차 주부의 진짜 비법',
    '맛집 주인장도 인정한',
    '실패 없는 황금레시피',
    '재료 단 3가지면 됩니다',
  ],
  travel: [
    '현지인만 아는',
    '비싸지 않게 즐기는',
    '○박 ○일 완벽 코스',
    '시니어 여행 추천',
  ],
  aitech: [
    '60대도 5분만에 따라하는',
    '복잡한 설정 없이 바로',
    '시니어 친화 사용법',
    '꼭 알아야 할 기본기',
  ],
  family: [
    '○○년 만의 진심',
    '가족도 몰랐던 사연',
    '읽으면서 눈물이',
    '평범한 일상의 특별함',
  ],
  language: [
    '50대도 시작 가능한',
    '문법 몰라도 말할 수 있는',
    '하루 5문장이면 충분',
    '실전 회화 즉시 활용',
  ],
  senior: [
    '50대 인생 2막을 위한',
    '60대 ○○ 도전기',
    '70대도 시작할 수 있는',
    '시니어가 직접 검증한',
  ],
  general: [
    '99%가 놓치는',
    '아무도 알려주지 않은',
    '진짜는 따로 있다',
    '○○년만의 진실',
  ],
};

/**
 * 카테고리별 추천 시청자 질문 (댓글 유도)
 */
export const ENGAGEMENT_QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
  realestate: [
    '여러분 동네 시세는 어떤가요? 댓글로 공유해주세요',
    '청약 도전해보신 분 계신가요? 경험담 들려주세요',
  ],
  economy: [
    '여러분의 노후 자금 계획은 어떠신가요?',
    '재테크 첫 걸음, 어떤 것부터 시작하셨나요?',
  ],
  health: [
    '여러분은 몇 시간 운동하시나요?',
    '효과 본 운동법 댓글로 공유해주세요',
  ],
  food: [
    '여러분의 비법 양념 비율 알려주세요',
    '실패 없는 본인만의 레시피 공유 부탁드립니다',
  ],
  travel: [
    '여러분의 인생 여행지는 어디인가요?',
    '추천하실 만한 시니어 친화 여행지 있으신가요?',
  ],
  aitech: [
    '디지털 도구 처음 써보신 분, 어려운 점 있으신가요?',
    '꼭 배우고 싶은 디지털 기능 댓글로 알려주세요',
  ],
  family: [
    '여러분의 비슷한 경험 들려주세요',
    '가족과의 추억 댓글로 공유해주세요',
  ],
  language: [
    '외국어 공부할 때 가장 어려운 점은?',
    '효과 본 학습 방법 알려주세요',
  ],
  senior: [
    '인생 2막, 어떤 도전 하고 계신가요?',
    '5060 분들의 일상 이야기 들려주세요',
  ],
  general: [
    '여러분의 의견 댓글로 알려주세요',
    '비슷한 경험 있으시면 공유 부탁드립니다',
  ],
};

/**
 * AlgoMaker가 결과 페이지에서 활용할 알고리즘 인사이트 종합
 */
export function getAlgorithmInsights(keyword: string, categoryId: string) {
  const seoTip = getSeoTipForKeyword(keyword, categoryId);
  const hooks = HOOK_PATTERNS_BY_CATEGORY[categoryId] || HOOK_PATTERNS_BY_CATEGORY.general;
  const questions = ENGAGEMENT_QUESTIONS_BY_CATEGORY[categoryId] || ENGAGEMENT_QUESTIONS_BY_CATEGORY.general;

  return {
    seo: seoTip,
    hookPatterns: hooks,
    engagementQuestions: questions,
    chapterTemplate: CHAPTER_RULES.template,
    endScreenTip: END_SCREEN_STRATEGY.goldenTip,
    hashtagStrategy: HASHTAG_STRATEGY,
    checklist: UPLOAD_CHECKLIST_15,
    criticalMistakes: CRITICAL_MISTAKES,
    mindsetPrinciples: MINDSET_PRINCIPLES,
  };
}
