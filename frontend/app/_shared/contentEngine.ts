/**
 * frontend/app/_shared/contentEngine.ts
 * AlgoMaker · 키워드 기반 동적 콘텐츠 생성 엔진
 * YouTube SEO 2026 베스트 프랙티스 반영
 */

export interface KeywordContext {
  keyword: string;
  category: string;    // '경제' | '건강' | '자기계발' | 'IT' | '라이프'
  boi?: number;
  cpm?: number;
  senior?: boolean;
}

export interface GeneratedContent {
  // 기획서
  headline: string;
  dek: string;
  hook: string;
  // 대본 6블록
  scriptBlocks: ScriptBlock[];
  // SEO
  seoTitle: string;
  seoTitleAlt: string;
  thumbnail: string;
  thumbnailAlt: string;
  description: string;
  tags: string[];
  // 뉴스
  news: NewsItem[];
  // 씬
  scenes: Scene[];
}

export interface ScriptBlock {
  id: string;
  section: 'hook' | 'body' | 'opinion' | 'cta';
  sectionLabel: string;
  text: string;
  duration: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  credibility: '높음' | '보통';
  relevance: number;
  cpmTier: 'High' | 'Mid' | 'Low';
  publishedAt: string;
  keyFacts: string[];
}

export interface Scene {
  id: string;
  time: string;
  title: string;
  state: 'pending' | 'active' | 'done';
}

// ═══════════════════════════════════════
// 카테고리별 템플릿 데이터
// ═══════════════════════════════════════

interface CategoryTemplate {
  // 뉴스 소스 풀
  sources: string[];
  // 관련 고CPM 태그
  cpmTags: string[];
  // 주제 관점 (시청자가 궁금한 포인트)
  angles: string[];
  // 일반 통계 스케일
  statsScale: {
    searchVol: [number, number];
    cases: [number, number];
    revenue: [number, number];
  };
  // 전문 용어 사전
  terms: string[];
  // 씬 템플릿
  sceneTitles: string[];
}

const TEMPLATES: Record<string, CategoryTemplate> = {
  경제: {
    sources: ['한국경제', '연합뉴스', 'KBS뉴스', '조선비즈', 'MBC뉴스', 'SBS뉴스', '매일경제'],
    cpmTags: ['주식투자', '재테크', '경제뉴스', '부동산', '금융', '자산관리', '투자전략'],
    angles: ['피해 규모', '구조적 원인', '전문가 분석', '당국 대응', '피해 사례', '예방법'],
    statsScale: { searchVol: [8000, 30000], cases: [100, 500], revenue: [2000, 10000] },
    terms: ['급등', '작전', '매집', '리딩방', '탈출', '호가조작', '시세조종'],
    sceneTitles: ['후킹 오프닝', '배경·통계 제시', '핵심 단서', '함정·반전', '진실 공개', '마무리·CTA'],
  },
  건강: {
    sources: ['헬스조선', 'KBS뉴스', 'YTN', '연합뉴스', '매경헬스', '메디컬투데이'],
    cpmTags: ['건강관리', '노인건강', '시니어', '질병예방', '의학상식', '웰빙'],
    angles: ['증상', '원인', '관리법', '최신 연구', '전문의 조언', '자가 진단'],
    statsScale: { searchVol: [5000, 20000], cases: [500, 3000], revenue: [2500, 9000] },
    terms: ['만성질환', '재활', '예방', '조기발견', '자연요법', '합병증'],
    sceneTitles: ['충격 질문', '증상 · 신호', '원인 분석', '관리 루틴', '전문가 의견', '실천 가이드'],
  },
  자기계발: {
    sources: ['한겨레', 'EO', '퍼블리', 'beSuccess', 'Ted Korea', '책바세'],
    cpmTags: ['자기계발', '습관', '생산성', '마인드셋', '성공학', '시간관리'],
    angles: ['시행착오', '과학적 근거', '실천 방법', '성공 사례', '실패 패턴', '단계별 가이드'],
    statsScale: { searchVol: [10000, 40000], cases: [50, 300], revenue: [1500, 6000] },
    terms: ['루틴', '리추얼', '몰입', '피로', '슬럼프', '회복력'],
    sceneTitles: ['문제 제기', '통찰의 순간', '단계 1', '단계 2', '핵심 깨달음', '오늘 시작하기'],
  },
  IT: {
    sources: ['디지털데일리', 'ZDNet코리아', '블로터', 'IT조선', '아이뉴스24', 'The Verge Korea'],
    cpmTags: ['AI', '인공지능', 'ChatGPT', '디지털', '자동화', '테크', '앱추천'],
    angles: ['변화의 속도', '사용법', '실전 활용', '전문가 관점', '경쟁 구도', '미래 전망'],
    statsScale: { searchVol: [6000, 25000], cases: [10, 100], revenue: [1000, 5000] },
    terms: ['에이전트', '프롬프트', '파인튜닝', 'API', '모델', '딥러닝'],
    sceneTitles: ['충격적 비교', '기술 원리', '핵심 기능', '실전 사례', '경고 · 한계', '도입 가이드'],
  },
  라이프: {
    sources: ['여성동아', '리빙센스', '한경생활', '조선일보 헬스', 'KBS생활', '리얼푸드'],
    cpmTags: ['라이프스타일', '인테리어', '요리', '여행', '홈카페', '미니멀'],
    angles: ['비포 & 애프터', '꿀팁', '의외의 사실', '지역/계절', '비용 비교', '전문가 추천'],
    statsScale: { searchVol: [15000, 50000], cases: [50, 300], revenue: [2000, 7000] },
    terms: ['테라핀', '살림 노하우', '컴팩트', '동선', '기능성', '가성비'],
    sceneTitles: ['솔직 후기', '실패 사례', '핵심 노하우', '세부 팁', '비교 표', '체크리스트'],
  },
};

function getTemplate(category: string): CategoryTemplate {
  return TEMPLATES[category] || TEMPLATES['경제'];
}

// ═══════════════════════════════════════
// 키워드 해시 기반 숫자 생성 (동일 키워드엔 동일 결과)
// ═══════════════════════════════════════
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

function pickFromList<T>(keyword: string, salt: string, list: T[], offset = 0): T {
  const h = hash(keyword + salt);
  return list[(h + offset) % list.length];
}

function rangedNum(keyword: string, salt: string, min: number, max: number): number {
  const h = hash(keyword + salt);
  return min + (h % (max - min + 1));
}

// ═══════════════════════════════════════
// 제목 생성 (SEO 2026 - 키워드 앞에, 60자 이하, 괄호 패턴)
// ═══════════════════════════════════════

const TITLE_FORMULAS = [
  // 숫자 + 이유형 (숫자가 앞쪽)
  (kw: string) => `${kw} 위험한 3가지 신호 | 모르면 당합니다`,
  (kw: string) => `${kw}, 전문가가 경고한 5가지 진실 (2026 최신)`,
  (kw: string) => `${kw}에 당한 사람들의 7가지 공통점 | 꼭 확인하세요`,
  // 충격 + 전진 키워드
  (kw: string) => `${kw}, 진짜 이유는 따로 있었습니다 [충격]`,
  (kw: string) => `${kw}의 모든 것 | 아는 사람만 안다`,
  // 비교형
  (kw: string) => `${kw} vs 진짜 해결책 | 잘못 알려진 상식 3가지`,
  // 단독 + 당국발표형
  (kw: string) => `${kw} 최초 공개 | 72시간의 침묵`,
  (kw: string) => `${kw}, 금감원 공식 자료로 본 실체`,
];

const TITLE_FORMULAS_HEALTH = [
  (kw: string) => `${kw} 나도 모르게 악화되는 7가지 습관`,
  (kw: string) => `${kw}, 의사가 알려주는 3단계 관리법 (따라하기 쉬움)`,
  (kw: string) => `${kw} 완치한 사람들의 5가지 루틴 | 지금 시작`,
  (kw: string) => `${kw}의 숨겨진 원인 | 대부분이 놓치는 신호`,
  (kw: string) => `${kw} 조기 발견 체크리스트 | 하루 3분이면 OK`,
];

const TITLE_FORMULAS_SELF = [
  (kw: string) => `${kw} 5분 만에 바꾸는 법 | 과학자들이 말하는 핵심`,
  (kw: string) => `${kw}의 3가지 진실 | 시간 낭비 멈추세요`,
  (kw: string) => `${kw}로 인생 바꾼 사람들의 7가지 습관`,
  (kw: string) => `${kw}, 아무도 말해주지 않는 단 한 가지 (Step-by-Step)`,
];

const TITLE_FORMULAS_IT = [
  (kw: string) => `${kw} 이것 모르면 3년 뒤에 후회합니다`,
  (kw: string) => `${kw} 완벽 정리 | 5분 안에 이해 (2026 최신)`,
  (kw: string) => `${kw}, 개발자들이 매일 쓰는 진짜 활용법 3가지`,
  (kw: string) => `${kw} vs 사람 | 진짜 승자는?`,
];

const TITLE_FORMULAS_LIFE = [
  (kw: string) => `${kw} 비포 & 애프터 | 10만원으로 끝낸 비법`,
  (kw: string) => `${kw} 7가지 꿀팁 | 유튜버들이 숨기는 것`,
  (kw: string) => `${kw}, 이것만 알면 끝 (초보자 필독)`,
  (kw: string) => `${kw} 진짜 후기 | 돈 아끼는 체크리스트`,
];

function pickTitleFormula(category: string, kw: string): { main: string; alt: string } {
  const formulas =
    category === '건강' ? TITLE_FORMULAS_HEALTH :
    category === '자기계발' ? TITLE_FORMULAS_SELF :
    category === 'IT' ? TITLE_FORMULAS_IT :
    category === '라이프' ? TITLE_FORMULAS_LIFE :
    TITLE_FORMULAS;

  const h = hash(kw);
  const main = formulas[h % formulas.length](kw);
  const alt = formulas[(h + 1) % formulas.length](kw);
  return { main, alt };
}

// ═══════════════════════════════════════
// 썸네일 카피 (4단어 이내, 강렬한 훅)
// ═══════════════════════════════════════

function generateThumbnail(kw: string, category: string): { main: string; alt: string } {
  const h = hash(kw);
  const patterns: Array<[string, string]> = [
    [`${kw}\n3가지 진실`, `${kw}\n숨겨진 진실`],
    [`72시간의\n침묵`, `${kw}\n충격 전모`],
    [`당했습니다\n400%의 환상`, `${kw}\n모두 당했다`],
    [`전문가 경고\n${kw}`, `놓치면\n후회합니다`],
    [`${kw}\n완벽 정리`, `아무도\n말 안했다`],
  ];
  const pick = patterns[h % patterns.length];
  return { main: pick[0], alt: pick[1] };
}

function generateThumbnailSenior(kw: string): { main: string; alt: string } {
  // 시니어는 더 짧고 큰 글씨
  const h = hash(kw);
  const patterns: Array<[string, string]> = [
    [`꼭\n보세요`, `${kw.split(' ')[0]}\n주의`],
    [`위험\n신호`, `피해\n예방`],
    [`3가지\n진실`, `전문가\n경고`],
  ];
  const pick = patterns[h % patterns.length];
  return { main: pick[0], alt: pick[1] };
}

// ═══════════════════════════════════════
// 태그 생성 (10-15개, 키워드 + 연관 + 고CPM)
// ═══════════════════════════════════════

function generateTags(kw: string, category: string): string[] {
  const t = getTemplate(category);
  const base = [kw, kw.split(' ').join(''), kw.replace(/\s/g, '')];
  const related = t.cpmTags.slice(0, 7);
  const variants = [
    `${kw.split(' ')[0]} 추천`,
    `${kw.split(' ')[0]} 방법`,
    `${category} 팁`,
    `${category} 완벽정리`,
  ];
  // 중복 제거
  const all = Array.from(new Set([...base, ...related, ...variants]));
  return all.slice(0, 12);
}

// ═══════════════════════════════════════
// 설명란 생성 (200+ 자, 키워드 앞줄, 장 구조)
// ═══════════════════════════════════════

function generateDescription(kw: string, category: string, hook: string): string {
  const t = getTemplate(category);
  const angles = [t.angles[0], t.angles[1], t.angles[2], t.angles[3]];

  return `${hook}

이 영상에서 다룬 내용:
• ${kw}의 핵심 원리
• ${angles[0]}
• ${angles[1]}
• ${angles[2]}
• 실전 적용 가이드

✓ 팩트체크 완료 · 공식 자료 기반
✓ ${category} 전문가 감수

📌 이 영상이 도움되셨다면 구독 · 알림 · 좋아요 부탁드립니다.
💬 궁금한 점은 댓글로 남겨주시면 다음 영상에서 다뤄드릴게요.

#${kw.replace(/\s/g, '')} #${category} #${t.cpmTags[0]} #${t.cpmTags[1]}`;
}

// ═══════════════════════════════════════
// 뉴스 생성 (키워드별 동적)
// ═══════════════════════════════════════

const NEWS_PATTERNS_BY_CATEGORY: Record<string, Array<(kw: string, t: CategoryTemplate, num: number, src: string) => { title: string; summary: string; keyFacts: string[] }>> = {
  경제: [
    (kw, t, n, src) => ({
      title: `"${kw}" 관련 피해 급증 … 2조 원 돌파`,
      summary: `금융감독원이 발표한 최근 자료에 따르면, "${kw}" 관련 사례가 꾸준히 늘고 있다. 피해자 다수가 40~60대 개인 투자자로 확인됐다.`,
      keyFacts: [`2년간 ${n}건 사례`, `평균 건당 피해 1억 7천만 원`],
    }),
    (kw, t, n, src) => ({
      title: `${kw}의 새로운 패턴, AI 분석으로 확인`,
      summary: `증권사 리포트에 따르면 3가지 공통 패턴이 드러났다. 이 패턴이 70% 이상 반복된다고 전문가들은 지적한다.`,
      keyFacts: [`세 단계 패턴 반복`, `재현율 70% 이상`],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 관련 단속 강화 … 처벌 대폭 상향`,
      summary: `당국이 이상거래 탐지 시스템을 도입하고 적발 시 최대 징역 7년 처벌 방침을 발표했다.`,
      keyFacts: ['AI 이상거래 탐지 시스템 도입', '최대 징역 7년'],
    }),
    (kw, t, n, src) => ({
      title: `"저도 당했다" — ${kw} 피해자 인터뷰`,
      summary: `직장인 김모씨(45)는 "주변 추천 종목에 전 재산을 넣었다가 3일 만에 큰 손실을 봤다"고 증언했다.`,
      keyFacts: ['3일 만에 70% 손실 사례', '40~50대 피해 집중'],
    }),
    (kw, t, n, src) => ({
      title: `금융당국, ${kw} 예방 3대 원칙 발표`,
      summary: `거래량 급변, 정체불명 호재, 그리고 리딩방 추천 — 이 세 가지가 겹치면 무조건 피하라고 당국은 권고했다.`,
      keyFacts: ['3대 경고 신호', '세 조건 겹치면 회피'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 관련 조직 적발 … 피해자 800명`,
      summary: `경찰이 조직 3곳을 적발, 운영자 5명을 구속했다. 피해자만 800명이 넘는다.`,
      keyFacts: ['조직 3곳 적발', '피해자 800명 · 피해액 320억 원'],
    }),
  ],
  건강: [
    (kw, t, n, src) => ({
      title: `"${kw}" 환자, 5년 새 ${n}% 증가`,
      summary: `국민건강보험공단 자료에 따르면 관련 진료 환자가 급증하고 있다. 조기 발견이 관건이라고 전문의들은 조언한다.`,
      keyFacts: [`5년간 ${n}% 증가`, `조기 발견이 관건`],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 악화시키는 의외의 습관 3가지`,
      summary: `서울대 의대 연구팀이 최근 공개한 논문에서 세 가지 습관이 주요 악화 요인이라고 밝혔다.`,
      keyFacts: ['3대 악화 습관', '서울대 의대 연구 결과'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 완화, 최신 연구 결과 공개`,
      summary: `2026년 대한의학회 학술대회에서 새로운 관리법이 발표됐다. 기존 방식 대비 효과가 2배로 확인됐다.`,
      keyFacts: ['학술대회 발표', '효과 2배 확인'],
    }),
    (kw, t, n, src) => ({
      title: `"${kw} 관리, 이렇게 해라" 전문의 조언`,
      summary: `30년 경력 내과 전문의가 핵심 관리법 5가지를 공개했다. 하루 3분 습관이 큰 차이를 만든다고 한다.`,
      keyFacts: ['5가지 핵심 관리법', '하루 3분 실천법'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 자가 진단 체크리스트 배포`,
      summary: `식약처가 조기 발견을 위한 공식 체크리스트를 배포했다. 증상 3개 이상 해당되면 병원 방문 권고.`,
      keyFacts: ['식약처 공식 체크리스트', '증상 3개 이상 진료 필요'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 예방 식단, 세계보건기구(WHO) 권장`,
      summary: `WHO가 발표한 2026 가이드라인에서 하루 2번의 식습관 개선이 핵심이라고 강조했다.`,
      keyFacts: ['WHO 2026 가이드라인', '하루 2번 식단 개선'],
    }),
  ],
  자기계발: [
    (kw, t, n, src) => ({
      title: `"${kw}" 적용한 사람들의 공통점 5가지`,
      summary: `스탠포드 연구팀이 성공한 사람들을 ${n}명 인터뷰한 결과, 5가지 공통 패턴이 도출됐다.`,
      keyFacts: [`${n}명 인터뷰 결과`, '5대 공통 패턴'],
    }),
    (kw, t, n, src) => ({
      title: `${kw}의 과학 | 뇌과학자가 설명하다`,
      summary: `신경과학 저널에 실린 논문에 따르면 ${kw}은 뇌의 특정 회로를 활성화시킨다. 꾸준한 실천이 핵심이다.`,
      keyFacts: ['신경과학 저널 논문', '뇌 회로 활성화'],
    }),
    (kw, t, n, src) => ({
      title: `${kw}, 이렇게 시작하면 실패합니다`,
      summary: `많은 초보자가 빠지는 3가지 함정을 전문가가 공개했다. 시작 방식을 바꾸는 것만으로 성공률이 크게 올라간다.`,
      keyFacts: ['3대 초보자 함정', '시작 방식이 결정'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 100일 도전 결과 공개`,
      summary: `1,000명이 참여한 100일 프로젝트 결과가 공개됐다. 끝까지 완주한 사람들의 비율과 비법을 분석했다.`,
      keyFacts: ['1,000명 대규모 실험', '완주자 공통 비법'],
    }),
  ],
  IT: [
    (kw, t, n, src) => ({
      title: `${kw}, 실제 업무에 적용한 사례 공개`,
      summary: `국내 대기업 ${n}곳이 실제로 도입한 방법과 효과가 공개됐다. 업무 시간 40% 단축 사례도 등장했다.`,
      keyFacts: [`대기업 ${n}곳 도입`, '업무 40% 단축 사례'],
    }),
    (kw, t, n, src) => ({
      title: `${kw}가 바꾸는 5대 산업 | 전문가 분석`,
      summary: `삼성경제연구소가 발표한 보고서에 따르면 향후 2년 내 5대 산업의 일하는 방식이 완전히 달라진다고 한다.`,
      keyFacts: ['5대 산업 변화 예측', '2년 내 적용'],
    }),
    (kw, t, n, src) => ({
      title: `"${kw} 이것만 알면 됩니다" 핵심 3가지`,
      summary: `개발자 커뮤니티에서 가장 많이 공유된 실전 팁 3가지가 정리됐다. 초보자도 바로 활용 가능하다.`,
      keyFacts: ['실전 팁 3가지', '초보자 활용 가능'],
    }),
    (kw, t, n, src) => ({
      title: `${kw}, 앞으로 3년이 결정적`,
      summary: `세계경제포럼 2026 리포트에서 핵심 기술로 지목됐다. 2029년까지 관련 시장이 3배 성장할 전망이다.`,
      keyFacts: ['WEF 2026 핵심 기술', '시장 3배 성장 전망'],
    }),
  ],
  라이프: [
    (kw, t, n, src) => ({
      title: `"${kw}" 비포 & 애프터 | 10만원의 기적`,
      summary: `SNS에서 ${n}만 조회수를 돌파한 실사용 후기. 적은 비용으로 공간을 완전히 바꾼 비법이 공개됐다.`,
      keyFacts: [`${n}만 조회 돌파`, '10만원 예산'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 전문가의 꿀팁 7가지`,
      summary: `30년 경력 전문가가 공개한 실전 노하우. 일반인들이 몰랐던 세심한 팁들이 화제를 모으고 있다.`,
      keyFacts: ['30년 경력 전문가', '실전 노하우 7가지'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 잘못된 상식 TOP 5`,
      summary: `인터넷에서 떠도는 정보 중 의외로 틀린 것들이 많다고 한다. 전문가가 직접 팩트체크한 결과를 공개했다.`,
      keyFacts: ['잘못된 상식 5개', '전문가 팩트체크'],
    }),
    (kw, t, n, src) => ({
      title: `${kw} 계절 특화 가이드 | 지금 해야 할 일`,
      summary: `계절이 바뀌는 이 시기에 놓치기 쉬운 3가지를 공개했다. 체크리스트 형태로 바로 실천 가능.`,
      keyFacts: ['계절별 핵심 3가지', '체크리스트 제공'],
    }),
  ],
};

function generateNews(keyword: string, category: string): NewsItem[] {
  const t = getTemplate(category);
  const patterns = NEWS_PATTERNS_BY_CATEGORY[category] || NEWS_PATTERNS_BY_CATEGORY['경제'];
  const h = hash(keyword);

  const dates = ['어제', '2일 전', '3일 전', '4일 전', '5일 전', '6일 전'];
  const tiers: ('High' | 'Mid' | 'Low')[] = ['High', 'High', 'Mid', 'Mid', 'High', 'Mid'];
  const relevances = [0.92, 0.88, 0.82, 0.76, 0.74, 0.71];

  return patterns.slice(0, 6).map((fn, i) => {
    const src = t.sources[(h + i) % t.sources.length];
    const n = rangedNum(keyword, `num${i}`, 20, 180);
    const g = fn(keyword, t, n, src);
    return {
      id: `n${i + 1}`,
      title: g.title,
      summary: g.summary,
      source: src,
      credibility: i < 5 ? '높음' : '보통',
      relevance: relevances[i],
      cpmTier: tiers[i],
      publishedAt: dates[i],
      keyFacts: g.keyFacts,
    };
  });
}

// ═══════════════════════════════════════
// 기획서 헤드라인/데크/훅
// ═══════════════════════════════════════

const HOOK_PATTERNS: Record<string, (kw: string) => { headline: string; dek: string; hook: string }> = {
  경제: (kw) => ({
    headline: `"${kw}"의 숨겨진 진실`,
    dek: `개인 투자자들이 3일 만에 손실을 본 이유. ${kw}의 전체 메커니즘을 최초 공개합니다.`,
    hook: `하루 만에 급등한 종목, 72시간 뒤엔 손실만 남았습니다. ${kw}은 그렇게 시작됩니다.`,
  }),
  건강: (kw) => ({
    headline: `${kw}, 모르면 당하는 증상 5가지`,
    dek: `30년 경력 내과 전문의가 밝히는 ${kw}의 조기 신호와 효과적 관리법.`,
    hook: `아무도 안 가르쳐 주는 ${kw}의 진짜 경고 신호, 오늘 전부 공개합니다.`,
  }),
  자기계발: (kw) => ({
    headline: `${kw}, 5분 만에 바꾸는 법`,
    dek: `스탠포드 연구팀이 검증한 ${kw}의 핵심 원리. 과학적 근거와 실전 가이드를 담았습니다.`,
    hook: `${kw}, 10년을 낭비한 제가 발견한 단 하나의 진실. 지금 시작하세요.`,
  }),
  IT: (kw) => ({
    headline: `${kw} 완벽 정리 (2026 최신)`,
    dek: `${kw}의 원리부터 실전 활용까지. 5분이면 누구나 이해할 수 있게 정리했습니다.`,
    hook: `${kw}, 이것 모르면 3년 뒤에 진짜 후회합니다.`,
  }),
  라이프: (kw) => ({
    headline: `${kw}의 모든 것 | 진짜 꿀팁 7가지`,
    dek: `${kw} 전문가가 30년 경력으로 정리한 실전 노하우. 비용과 시간 아끼는 법.`,
    hook: `${kw}, 제대로 하면 절반 비용으로 두 배 효과. 전부 공개합니다.`,
  }),
};

// ═══════════════════════════════════════
// 대본 6블록 생성 (카테고리별 완전히 다른 내용)
// ═══════════════════════════════════════

function generateScript(keyword: string, category: string): ScriptBlock[] {
  const t = getTemplate(category);
  const hook = HOOK_PATTERNS[category] ? HOOK_PATTERNS[category](keyword) : HOOK_PATTERNS['경제'](keyword);
  const scale = t.statsScale;
  const cases = rangedNum(keyword, 'cases', scale.cases[0], scale.cases[1]);
  const rev = rangedNum(keyword, 'rev', scale.revenue[0], scale.revenue[1]);

  // 카테고리별로 완전히 다른 본문 생성
  const blocks: Record<string, () => ScriptBlock[]> = {
    경제: () => [
      { id: 'b1', section: 'hook', sectionLabel: '오프닝', duration: 28,
        text: `여러분, ${hook.hook} 수많은 피해자가 나왔습니다. 72시간 뒤에 계좌에 남은 건 손실뿐. 오늘 영상에서는 이 사건의 전모를 파헤쳐 보려 합니다.` },
      { id: 'b2', section: 'body', sectionLabel: '본문 · 배경', duration: 95,
        text: `먼저 배경부터 짚어보겠습니다. 금융감독원 자료에 따르면, 지난 2년간 "${keyword}"과 유사한 사례는 무려 ${cases}건이 보고됐습니다. 피해액만 2조 원이 넘습니다. 개인 투자자 비중이 급격히 늘어난 2020년 이후, 이런 조작 사례는 매년 30%씩 증가하는 상황. 단순한 우연이 아니라 구조적 문제라는 뜻입니다.` },
      { id: 'b3', section: 'body', sectionLabel: '본문 · 단서', duration: 120,
        text: `이제 첫 번째 단서를 보겠습니다. 사건 3일 전, 해당 종목의 거래량은 거의 없었습니다. 그런데 주가는 조금씩 오르고 있었죠. 이게 바로 '저점 매집' 단계입니다. 세력이 시장에 눈에 띄지 않을 정도로 소량씩 매수하면서 주가를 서서히 끌어올리는 기법. 증권사 두 곳의 리포트를 교차 확인한 결과, 이 시점에 특정 계좌들의 집중 매수 패턴이 포착됐습니다.` },
      { id: 'b4', section: 'body', sectionLabel: '본문 · 함정', duration: 110,
        text: `많은 분들이 SNS 바이럴 때문이라고 생각하실 겁니다. 사실 저도 처음엔 그렇게 의심했어요. 그런데 조사해보니 진짜 트리거는 훨씬 조용한 곳에 있었습니다. 리딩방과 비공개 단톡방입니다. 이곳에서 먼저 '매수 신호'가 울리고, 2~3일 뒤에야 일반 커뮤니티로 퍼져 나갑니다. 그러니까 SNS에서 볼 때쯤이면 이미 늦은 겁니다.` },
      { id: 'b5', section: 'opinion', sectionLabel: '의견', duration: 90,
        text: `제가 이 사건을 파고들면서 느낀 점은 하나입니다. 돈을 버는 사람과 잃는 사람의 차이는 정보의 속도가 아니라 '원칙'의 유무라는 겁니다. 아무리 정보가 빨라도 검증되지 않은 종목에 뛰어들면 결국 당합니다. 반대로 원칙을 지키는 사람은 기회가 지나가도 손실은 피할 수 있습니다.` },
      { id: 'b6', section: 'cta', sectionLabel: '마무리', duration: 35,
        text: `세 가지 경고 신호 기억해두세요. 거래량 급변, 정체불명 호재, 리딩방 추천. 이 세 가지가 겹치면 무조건 피하세요. 이 영상이 도움되셨다면 구독과 알림 부탁드립니다. 다음 영상에서 또 만나요.` },
    ],
    건강: () => [
      { id: 'b1', section: 'hook', sectionLabel: '오프닝', duration: 28,
        text: `"${keyword}, 진짜로 이거 몰랐습니다." 제가 3년 전 병원에서 들은 말입니다. 만약 여러분이 이 증상을 한 번이라도 느껴봤다면, 오늘 영상 끝까지 꼭 봐주세요. 당신의 건강이 달려 있을지도 모릅니다.` },
      { id: 'b2', section: 'body', sectionLabel: '본문 · 증상', duration: 105,
        text: `먼저 ${keyword}의 주요 증상부터 짚어봅시다. 국민건강보험공단 자료에 따르면, 최근 5년간 관련 환자가 ${cases}% 증가했습니다. 특히 40~60대에서 급증하고 있어요. 증상은 크게 세 가지입니다. 첫째, 아침에 일어났을 때 느끼는 묵직함. 둘째, 식사 후 반복되는 불편감. 셋째, 장시간 앉아있을 때의 이상 감각. 이 세 가지가 2주 이상 지속된다면 반드시 병원을 찾아야 합니다.` },
      { id: 'b3', section: 'body', sectionLabel: '본문 · 원인', duration: 110,
        text: `그럼 왜 이런 증상이 생길까요? 서울대 의대 연구팀이 최근 공개한 논문에서는 세 가지 주요 원인을 지목합니다. 하나는 만성적인 운동 부족, 둘은 잘못된 식습관, 그리고 세 번째는 의외로 많이 간과되는 '스트레스 누적'입니다. 특히 중장년층에서는 직장 스트레스가 신체 증상으로 드러나는 경우가 많다고 합니다.` },
      { id: 'b4', section: 'body', sectionLabel: '본문 · 관리법', duration: 115,
        text: `이제 가장 중요한 관리법을 말씀드리겠습니다. 30년 경력 내과 전문의가 공개한 3단계 루틴입니다. 첫째, 아침 기상 후 10분간 가벼운 스트레칭. 둘째, 하루 두 번 8잔의 물 섭취. 셋째, 자기 전 30분 스마트폰 금지. 이 세 가지만 2주 지켜도 증상의 60%가 완화됐다는 임상 결과가 있습니다.` },
      { id: 'b5', section: 'opinion', sectionLabel: '의견', duration: 85,
        text: `제가 느끼는 건 이겁니다. 건강은 큰 결심이 아니라 작은 습관의 누적입니다. 하루 3분의 실천이 10년 뒤의 당신을 만듭니다. ${keyword} 관리는 약보다 루틴이 먼저라고, 많은 의사들이 강조합니다.` },
      { id: 'b6', section: 'cta', sectionLabel: '마무리', duration: 35,
        text: `오늘 영상 참고하셔서 꼭 건강 챙기세요. 증상이 3개 이상이면 미루지 마시고 병원 방문 권장드립니다. 채널 구독 누르시면 다음에 더 좋은 건강 정보로 찾아뵙겠습니다. 감사합니다.` },
    ],
    자기계발: () => [
      { id: 'b1', section: 'hook', sectionLabel: '오프닝', duration: 28,
        text: `"${keyword}, 10년을 낭비했습니다." 저도 그중 한 명이었어요. 그러다 우연히 발견한 단 하나의 원칙이 모든 걸 바꿨습니다. 오늘 이 이야기를 5분 안에 완벽히 정리해드릴게요.` },
      { id: 'b2', section: 'body', sectionLabel: '본문 · 통찰', duration: 90,
        text: `먼저 수치부터 보여드릴게요. 스탠포드 연구팀이 성공한 사람 ${cases}명을 인터뷰한 결과, 다섯 가지 공통 패턴이 도출됐습니다. 흥미로운 건, 그들은 특별한 재능이 있는 게 아니었어요. 단지 한 가지를 꾸준히 했다는 점이 달랐습니다. 바로 '작게 시작하기'입니다.` },
      { id: 'b3', section: 'body', sectionLabel: '본문 · 단계 1', duration: 105,
        text: `자, 이제 실전으로 들어가 볼게요. 첫 번째 단계는 '환경 설계'입니다. 의지력에 기대지 마세요. 대부분이 여기서 실패합니다. 대신 환경을 바꾸세요. 예를 들어 ${keyword}을 실천하려면, 일어나자마자 보이는 곳에 관련 도구를 놓으세요. 뇌과학적으로 행동 시작까지의 저항이 80% 줄어든다는 연구 결과가 있습니다.` },
      { id: 'b4', section: 'body', sectionLabel: '본문 · 단계 2', duration: 105,
        text: `두 번째는 '2분 룰'입니다. 어떤 일이든 2분 이내로 쪼개세요. 운동이라면 2분 스트레칭부터, 독서라면 2페이지부터. 신경과학 저널에 따르면 이런 미니 성공이 도파민 회로를 활성화시켜 지속성을 크게 높여줍니다. 100일 프로젝트에 참여한 1,000명 중 완주자의 89%가 이 방식을 사용했습니다.` },
      { id: 'b5', section: 'opinion', sectionLabel: '의견', duration: 85,
        text: `제가 진짜 중요하다고 생각하는 건 이겁니다. 인생은 의지로 바꾸는 게 아니라 시스템으로 바꾸는 겁니다. 큰 결심을 아무리 해도 작은 환경과 습관이 이기니까요. ${keyword}도 마찬가지입니다.` },
      { id: 'b6', section: 'cta', sectionLabel: '마무리', duration: 35,
        text: `오늘부터 한 가지만 해보세요. 2분이면 충분해요. 한 달 뒤에 당신이 얼마나 달라졌는지 확인해보시길. 구독과 알림 설정해두시면 다음 편에서 더 깊이 다뤄드릴게요. 시작하세요. 지금.` },
    ],
    IT: () => [
      { id: 'b1', section: 'hook', sectionLabel: '오프닝', duration: 28,
        text: `"${keyword}, 이거 아는 사람 vs 모르는 사람 — 3년 뒤에 완전히 다른 삶을 살게 됩니다." 오늘 영상은 그 정도로 중요합니다. 5분만 집중해주세요.` },
      { id: 'b2', section: 'body', sectionLabel: '본문 · 원리', duration: 100,
        text: `먼저 ${keyword}의 핵심 원리부터 짚고 갈게요. 세계경제포럼 2026 리포트에서 핵심 기술로 지목됐고, 삼성경제연구소 분석에 따르면 2029년까지 시장 규모가 3배로 커진다고 합니다. 이미 국내 대기업 ${cases}곳이 실제 업무에 도입했습니다. 업무 시간 40% 단축 사례도 나왔고요.` },
      { id: 'b3', section: 'body', sectionLabel: '본문 · 기능', duration: 115,
        text: `두 번째, 실제로 뭘 할 수 있는지 보여드릴게요. 첫째, 반복 업무 자동화. 이메일 분류, 일정 관리, 문서 정리 같은 것들이죠. 둘째, 창의적 초안 생성. 보고서 초안, 기획안, 마케팅 카피 등이 몇 초 만에 나옵니다. 셋째, 복잡한 데이터 요약. 긴 회의록이나 PDF도 5분 만에 핵심만 추출할 수 있어요.` },
      { id: 'b4', section: 'body', sectionLabel: '본문 · 실전', duration: 105,
        text: `그런데 여기서 경고 하나. ${keyword}을 맹신하면 안 됩니다. 아직 정확도에 한계가 있고, 중요한 판단은 사람이 해야 합니다. 국내 기업 사례 중 AI 결과를 검증 없이 사용하다가 큰 실수를 저지른 경우가 ${rev}건 이상 보고됐습니다. 도구로 활용하되, 판단은 여러분이.` },
      { id: 'b5', section: 'opinion', sectionLabel: '의견', duration: 85,
        text: `제 의견은 이렇습니다. ${keyword}는 대체가 아니라 증강 도구입니다. 이걸 잘 쓰는 사람은 업무 효율이 3배가 되지만, 기피하는 사람은 경쟁에서 밀릴 수밖에 없어요. 지금 시작하는 게 3년 뒤의 당신을 결정합니다.` },
      { id: 'b6', section: 'cta', sectionLabel: '마무리', duration: 35,
        text: `오늘 영상이 도움되셨다면 구독, 그리고 궁금한 점 댓글로 남겨주세요. 다음 영상에서 실전 활용 가이드 자세히 다뤄드릴게요. 감사합니다.` },
    ],
    라이프: () => [
      { id: 'b1', section: 'hook', sectionLabel: '오프닝', duration: 28,
        text: `"${keyword}, 10만원으로 끝냈습니다." 비포 & 애프터 사진부터 보여드릴게요. 이게 정말 10만원짜리냐는 소리 여러 번 들었어요. 오늘 그 비법 전부 공개합니다.` },
      { id: 'b2', section: 'body', sectionLabel: '본문 · 실패담', duration: 100,
        text: `먼저 솔직한 실패담부터. 처음엔 저도 비싼 제품만 찾았어요. 결과는 그저 그랬습니다. 그러다 SNS에서 ${cases}만 조회수 돌파한 후기를 발견했죠. 전문가들이 말 안 해주는 진짜 핵심 3가지가 담겨 있었어요. 그걸 적용하고 난 뒤 완전히 달라졌습니다.` },
      { id: 'b3', section: 'body', sectionLabel: '본문 · 노하우', duration: 115,
        text: `자, 이제 핵심 노하우 7가지 공개할게요. 1번, 일단 규모를 줄여요. 전부 다 하려다 망합니다. 2번, 중고 활용. 중요 아이템은 새 것, 나머지는 80% 할인된 중고로. 3번, 컬러 통일. 세 가지 색 이내로만. 4번, 조명이 핵심. 전등 하나만 바꿔도 느낌이 완전히 달라져요. 5번, 수납은 숨기기. 6번, 그린 포인트. 식물 하나가 공간을 살려줍니다. 7번, 조금씩 완성. 한 번에 다 하려고 하지 마세요.` },
      { id: 'b4', section: 'body', sectionLabel: '본문 · 꿀팁', duration: 100,
        text: `그리고 많은 분들이 잘 모르는 의외의 팁 하나. ${keyword}에서 진짜 비용을 아끼는 방법은 '시간'입니다. 급하게 하면 뭐든 비싸져요. 3개월 계획 세우고 천천히 하세요. 절반 비용으로 두 배 효과 가능합니다. 실제로 제가 그렇게 했고, 총 ${rev * 1000}원 아꼈어요.` },
      { id: 'b5', section: 'opinion', sectionLabel: '의견', duration: 80,
        text: `제 생각은 이렇습니다. ${keyword}는 돈의 문제가 아니라 센스의 문제예요. 그리고 센스는 공부하면 생깁니다. 오늘 영상이 그 시작이 되길 바라요.` },
      { id: 'b6', section: 'cta', sectionLabel: '마무리', duration: 35,
        text: `오늘 영상 도움되셨다면 구독 눌러주세요. 다음 편에서 체크리스트 PDF로도 공유해드릴게요. 여러분의 공간이 예뻐지길 응원합니다. 감사합니다.` },
    ],
  };

  return (blocks[category] || blocks['경제'])();
}

// ═══════════════════════════════════════
// 씬 생성
// ═══════════════════════════════════════

function generateScenes(keyword: string, category: string): Scene[] {
  const t = getTemplate(category);
  const starts = [0, 28, 123, 243, 353, 443];
  const ends = [28, 123, 243, 353, 443, 510];

  return t.sceneTitles.map((title, i) => {
    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    return {
      id: `s${i + 1}`,
      time: `${fmt(starts[i])}-${fmt(ends[i])}`,
      title,
      state: 'pending',
    };
  });
}

// ═══════════════════════════════════════
// 메인 생성 함수
// ═══════════════════════════════════════

export function generateContent(ctx: KeywordContext): GeneratedContent {
  const { keyword, category, senior } = ctx;
  const h = HOOK_PATTERNS[category] ? HOOK_PATTERNS[category](keyword) : HOOK_PATTERNS['경제'](keyword);
  const titleFormulas = pickTitleFormula(category, keyword);
  const thumb = senior ? generateThumbnailSenior(keyword) : generateThumbnail(keyword, category);

  return {
    headline: h.headline,
    dek: h.dek,
    hook: h.hook,
    scriptBlocks: generateScript(keyword, category),
    seoTitle: titleFormulas.main,
    seoTitleAlt: titleFormulas.alt,
    thumbnail: thumb.main,
    thumbnailAlt: thumb.alt,
    description: generateDescription(keyword, category, h.hook),
    tags: generateTags(keyword, category),
    news: generateNews(keyword, category),
    scenes: generateScenes(keyword, category),
  };
}
