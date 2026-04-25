/**
 * SNS 플랫폼 정의 + 메타데이터 항목
 *
 * 박예준 대표 요청사항:
 * - YouTube 롱폼 / Shorts 구분
 * - 베일 벗기기 (설명 풍부하게)
 * - 영문 + 한글 병기
 */

export interface PlatformMetaField {
  id: string;
  icon: string;
  label: string;
  labelEn: string;
  description: string;
  example: string;
  howItWorks: string;
  autoGenerate: boolean;
}

export interface Platform {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  durationLabel: string;
  orientation: '가로 16:9' | '세로 9:16' | '정사각 1:1';
  revenue: string;
  audience: string;
  exampleContent: string;
  advantages: string[];
  metaFields: PlatformMetaField[];
  color: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: 'youtube-long',
    name: 'YouTube 롱폼',
    nameEn: 'YouTube Long-form',
    emoji: '📺',
    durationLabel: '8분 이상',
    orientation: '가로 16:9',
    revenue: '광고 수익 가능',
    audience: '전 연령대, 깊이 있는 시청자',
    exampleContent: '"2026 금리 전망 완벽 정리" (10분)',
    advantages: [
      '긴 영상 = 광고 수익 큼',
      '검색 노출 잘 됨',
      '구독자 확보 쉬움',
      '광고 수익 가장 높음',
    ],
    color: '#c65f3b',
    metaFields: [
      {
        id: 'title',
        icon: '📝',
        label: '영상 제목',
        labelEn: 'Title',
        description: '사람들이 영상 목록에서 보는 글자',
        example: '"2026년 금리 인하, 이것만 알면 5천만원 벌어요"',
        howItWorks: 'AI가 조회수 잘 나오는 제목 3가지 추천',
        autoGenerate: true,
      },
      {
        id: 'description',
        icon: '📄',
        label: '영상 설명',
        labelEn: 'Description',
        description: "영상 아래 '더보기' 누르면 나오는 글",
        example: '"이번 영상은 2026년 금리 전망을 다룹니다..."',
        howItWorks: '5,000자 이내로 AI가 자동 작성',
        autoGenerate: true,
      },
      {
        id: 'tags',
        icon: '🏷️',
        label: '태그',
        labelEn: 'Tags',
        description: '검색 잘 되게 하는 키워드들',
        example: '#금리전망 #2026경제 #재테크',
        howItWorks: '검색량 높은 태그 자동 추천',
        autoGenerate: true,
      },
      {
        id: 'thumbnail',
        icon: '🖼️',
        label: '썸네일',
        labelEn: 'Thumbnail',
        description: '영상 클릭하기 전에 보이는 이미지',
        example: '금리 그래프 + 큰 글씨로 "5천만원!"',
        howItWorks: '클릭률 높은 스타일 3가지 추천',
        autoGenerate: true,
      },
      {
        id: 'chapters',
        icon: '⏱️',
        label: '챕터 마커',
        labelEn: 'Chapters',
        description: '영상 중간중간 섹션 표시 (0:00 도입)',
        example: '"0:00 도입 / 2:30 금리 설명 / 7:00 결론"',
        howItWorks: '대본 기반 자동 생성',
        autoGenerate: true,
      },
      {
        id: 'endscreen',
        icon: '📌',
        label: '최종 화면 CTA',
        labelEn: 'End Screen',
        description: '영상 끝에 뜨는 구독/다음 영상 유도',
        example: '"구독하고 다음 영상도 봐주세요!"',
        howItWorks: '주제별 최적 CTA 자동 생성',
        autoGenerate: true,
      },
    ],
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    nameEn: 'YouTube Shorts',
    emoji: '📱',
    durationLabel: '60초 이하',
    orientation: '세로 9:16',
    revenue: '제한적 광고',
    audience: '10~30대 모바일 시청자',
    exampleContent: '"금리 1분 요약" (45초)',
    advantages: [
      '빠른 구독자 증가',
      '바이럴 확산 잘됨',
      '채널 노출 기회',
      '알고리즘이 신규 채널에 유리',
    ],
    color: '#d4a545',
    metaFields: [
      {
        id: 'shorts-title',
        icon: '📝',
        label: '쇼츠 제목',
        labelEn: 'Shorts Title',
        description: '쇼츠에 짧게 보이는 제목 (100자 이내)',
        example: '"1분만에 정리하는 2026 금리 전망"',
        howItWorks: '짧고 강렬한 제목 3가지 추천',
        autoGenerate: true,
      },
      {
        id: 'shorts-hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: '쇼츠 검색·추천에 필수 (#Shorts 포함)',
        example: '#Shorts #금리전망 #재테크',
        howItWorks: '5~7개 핵심 해시태그 자동 추천',
        autoGenerate: true,
      },
      {
        id: 'shorts-description',
        icon: '📄',
        label: '짧은 설명',
        labelEn: 'Description',
        description: '쇼츠 하단에 표시되는 간단한 설명',
        example: '"2026 금리 핵심 3가지, 1분 요약"',
        howItWorks: '간결한 설명 자동 생성',
        autoGenerate: true,
      },
      {
        id: 'shorts-bgm',
        icon: '🎵',
        label: 'BGM 추천',
        labelEn: 'Background Music',
        description: '쇼츠에 어울리는 트렌드 음악',
        example: '"긴박한 뉴스 느낌의 BGM"',
        howItWorks: '주제·분위기 기반 음악 키워드 추천',
        autoGenerate: true,
      },
      {
        id: 'shorts-cover',
        icon: '🖼️',
        label: '커버 이미지',
        labelEn: 'Cover Image',
        description: '쇼츠 목록에서 보이는 세로 이미지',
        example: '세로형 썸네일 (1080×1920)',
        howItWorks: '세로형 클릭 유도 이미지 자동 생성',
        autoGenerate: true,
      },
    ],
  },
  {
    id: 'tiktok',
    name: '틱톡',
    nameEn: 'TikTok',
    emoji: '🎵',
    durationLabel: '3분 이하',
    orientation: '세로 9:16',
    revenue: '크리에이터 펀드',
    audience: '10~30대, 트렌드 따라가는 시청자',
    exampleContent: '"금리 올랐을 때 꿀팁" (1분)',
    advantages: [
      '10~30대 도달 잘됨',
      '트렌드 따라가기 쉬움',
      '신규 계정도 바이럴 가능',
      '짧은 영상으로 빠른 성장',
    ],
    color: '#7d9b7c',
    metaFields: [
      {
        id: 'tiktok-caption',
        icon: '📝',
        label: '틱톡 캡션',
        labelEn: 'Caption',
        description: '틱톡 영상 아래 본문 (2,200자까지)',
        example: '"2026 금리 인하 대비 3가지 꿀팁! 💰 #재테크"',
        howItWorks: '틱톡 스타일 캡션 자동 작성',
        autoGenerate: true,
      },
      {
        id: 'tiktok-hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: '틱톡 검색·추천의 핵심',
        example: '#재테크 #금리 #경제팁 #fyp',
        howItWorks: '트렌드 해시태그 + 주제 태그 조합',
        autoGenerate: true,
      },
      {
        id: 'tiktok-bgm',
        icon: '🎵',
        label: '트렌드 BGM',
        labelEn: 'Trending BGM',
        description: '틱톡에서 유행하는 음악',
        example: '"현재 유행 중인 뉴스 BGM"',
        howItWorks: '실시간 트렌드 음악 추천',
        autoGenerate: true,
      },
      {
        id: 'tiktok-challenge',
        icon: '🎯',
        label: '챌린지 태그',
        labelEn: 'Challenge',
        description: '참여 가능한 트렌드 챌린지',
        example: '#1분경제 #돈버는법챌린지',
        howItWorks: '주제 관련 진행 중인 챌린지 추천',
        autoGenerate: true,
      },
      {
        id: 'tiktok-cover',
        icon: '🖼️',
        label: '커버 이미지',
        labelEn: 'Cover',
        description: '틱톡 프로필에 뜨는 세로 이미지',
        example: '세로형 (1080×1920)',
        howItWorks: '틱톡 스타일 커버 자동 생성',
        autoGenerate: true,
      },
    ],
  },
  {
    id: 'instagram-reels',
    name: '인스타 릴스',
    nameEn: 'Instagram Reels',
    emoji: '🎬',
    durationLabel: '90초 이하',
    orientation: '세로 9:16',
    revenue: '협찬·광고',
    audience: '20~40대 여성, 시각적 감성',
    exampleContent: '"재테크 3가지 꿀팁" (45초)',
    advantages: [
      '20~40대 여성 도달',
      '브랜드 협찬 많음',
      '퀄리티 높은 콘텐츠 유리',
      '피드·스토리 동시 노출',
    ],
    color: '#6b8cae',
    metaFields: [
      {
        id: 'reels-caption',
        icon: '📝',
        label: '릴스 캡션',
        labelEn: 'Caption',
        description: '릴스 본문 (2,200자까지)',
        example: '"2026 금리 시대 재테크 3가지 💡 저장 필수!"',
        howItWorks: '인스타 감성 캡션 자동 작성',
        autoGenerate: true,
      },
      {
        id: 'reels-hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: '최대 30개까지 사용 가능',
        example: '#재테크 #금리 #돈공부 #경제 #2026전망',
        howItWorks: '검색 잘 되는 태그 15~20개 추천',
        autoGenerate: true,
      },
      {
        id: 'reels-cover',
        icon: '🖼️',
        label: '커버 이미지',
        labelEn: 'Cover',
        description: '프로필·피드에 뜨는 이미지',
        example: '세로형 감성 썸네일',
        howItWorks: '인스타 스타일 커버 자동 생성',
        autoGenerate: true,
      },
      {
        id: 'reels-music',
        icon: '🎵',
        label: '음악',
        labelEn: 'Music',
        description: '저작권 OK한 추천 음악',
        example: '"차분한 금융 뉴스 BGM"',
        howItWorks: '인스타 라이브러리 음악 추천',
        autoGenerate: true,
      },
      {
        id: 'reels-category',
        icon: '📂',
        label: '카테고리',
        labelEn: 'Category',
        description: '릴스 분류 (Finance, Education 등)',
        example: 'Finance & Education',
        howItWorks: '주제 기반 최적 카테고리 자동 선택',
        autoGenerate: true,
      },
    ],
  },
];

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}


// ============================================================
// 카테고리 (12개) - 40대 퇴직 예정자 타겟
// ============================================================
export const CATEGORIES = [
  {
    id: 'economy',
    name: '경제·재테크',
    emoji: '📊',
    description: '금리, 부동산, 주식, 재테크',
    examples: [
      '"2026년 금리 전망, 한눈에 정리"',
      '"퇴직금 굴리는 방법 BEST 5"',
      '"50대 자산 배분 가이드"',
    ],
    avgViews: '12,000회',
    competition: '보통',
    hot: true,
    color: '#c65f3b',
  },
  {
    id: 'realestate',
    name: '부동산',
    emoji: '🏠',
    description: '청약, 분양, 부동산 시장 분석',
    examples: [
      '"2026년 부동산 전망 정리"',
      '"청약 가점 계산법"',
      '"재개발 유망 지역 분석"',
    ],
    avgViews: '15,000회',
    competition: '보통',
    hot: true,
    color: '#7d9b7c',
  },
  {
    id: 'jobs',
    name: 'N잡·창업',
    emoji: '💼',
    description: '부업, 창업, 사이드 프로젝트',
    examples: [
      '"40대 N잡 추천 BEST 5"',
      '"퇴직 후 창업 아이템"',
      '"재택 부업으로 월 100만원"',
    ],
    avgViews: '20,000회',
    competition: '낮음',
    hot: true,
    color: '#d4a545',
  },
  {
    id: 'senior',
    name: '시니어 라이프',
    emoji: '🌱',
    description: '50+ 라이프스타일, 건강한 노후',
    examples: [
      '"50대 운동 루틴"',
      '"은퇴 후 행복한 일상"',
      '"시니어 모임 추천"',
    ],
    avgViews: '8,000회',
    competition: '낮음',
    hot: false,
    color: '#5a7a99',
  },
  {
    id: 'health',
    name: '건강·의료',
    emoji: '💊',
    description: '건강 상식, 다이어트, 운동',
    examples: [
      '"하루 10분 건강 운동"',
      '"40대 다이어트 방법"',
      '"혈압 낮추는 식단"',
    ],
    avgViews: '18,000회',
    competition: '낮음',
    hot: false,
    color: '#5e7e5d',
  },
  {
    id: 'travel',
    name: '여행·맛집',
    emoji: '✈️',
    description: '여행지, 맛집, 가성비 추천',
    examples: [
      '"국내 가성비 여행지"',
      '"부부 여행 추천 코스"',
      '"50대 해외 여행지"',
    ],
    avgViews: '14,000회',
    competition: '보통',
    hot: false,
    color: '#6b8cae',
  },
  {
    id: 'food',
    name: '요리·음식',
    emoji: '🍳',
    description: '레시피, 홈쿡, 간단 요리',
    examples: [
      '"간단한 점심 메뉴"',
      '"에어프라이어 요리"',
      '"1인 가구 레시피"',
    ],
    avgViews: '16,000회',
    competition: '보통',
    hot: false,
    color: '#a67e1e',
  },
  {
    id: 'tech',
    name: 'IT·테크',
    emoji: '💻',
    description: 'AI 도구, 앱 추천, 디지털',
    examples: [
      '"50대도 쉬운 AI 사용법"',
      '"ChatGPT 활용법"',
      '"스마트폰 200% 활용"',
    ],
    avgViews: '25,000회',
    competition: '보통',
    hot: true,
    color: '#5a7a99',
  },
  {
    id: 'education',
    name: '교육·자기계발',
    emoji: '📚',
    description: '학습법, 독서, 습관, 성장',
    examples: [
      '"50대 영어 공부법"',
      '"독서 습관 만들기"',
      '"하루 10분 자기계발"',
    ],
    avgViews: '15,000회',
    competition: '보통',
    hot: false,
    color: '#a67e1e',
  },
  {
    id: 'review',
    name: '리뷰·언박싱',
    emoji: '📺',
    description: '제품 리뷰, 생활용품 추천',
    examples: [
      '"주방용품 BEST 추천"',
      '"안마기 비교 리뷰"',
      '"시니어 신발 추천"',
    ],
    avgViews: '11,000회',
    competition: '보통',
    hot: false,
    color: '#c65f3b',
  },
  {
    id: 'social',
    name: '사회·이슈',
    emoji: '🌐',
    description: '시사, 사회 현상, 트렌드',
    examples: [
      '"2026년 달라지는 정책"',
      '"연금 개편 정리"',
      '"의료보험 변경사항"',
    ],
    avgViews: '13,000회',
    competition: '보통',
    hot: false,
    color: '#6b8cae',
  },
  {
    id: 'hobby',
    name: '취미·여가',
    emoji: '🎨',
    description: '취미 생활, 여가 활동, DIY',
    examples: [
      '"50대 취미 추천"',
      '"집에서 하는 운동"',
      '"캠핑 입문 가이드"',
    ],
    avgViews: '9,000회',
    competition: '낮음',
    hot: false,
    color: '#d4a545',
  },
];

// ============================================================
// 카테고리별 트렌드 키워드 (10개씩) - 40대 퇴직자 위주
// ============================================================
export const TRENDING_KEYWORDS: Record<string, string[]> = {
  economy: [
    '2026년 금리 전망', '퇴직금 굴리는 법', '50대 자산 배분',
    '월 300만원 만드는 재테크', '안정적인 배당주 추천', '예금 vs 적금 비교',
    '연금 활용법', '중위험 투자 상품', '인플레이션 대비 자산', '은퇴 준비 체크리스트',
  ],
  realestate: [
    '2026년 부동산 전망', '청약 가점 계산법', '재개발 유망 지역',
    '월세 vs 전세 비교', '소형 아파트 투자', '부동산 세금 정리',
    '경매 입문 가이드', '상가 투자 주의점', '주거용 부동산 트렌드', '지방 아파트 투자',
  ],
  jobs: [
    '40대 N잡 추천', '퇴직 후 창업 아이템', '재택 부업 BEST 10',
    '월 100만원 부업', '초보 블로그 수익화', '스마트스토어 시작',
    '디지털 노마드 직업', '온라인 강의 만들기', '프리랜서 시작 방법', '50대 재취업 전략',
  ],
  senior: [
    '50대 운동 루틴', '시니어 모임 추천', '은퇴 후 행복 조건',
    '50대 패션 스타일', '관절 건강 관리법', '시니어 여행 코스',
    '노후 자금 계산', '실버 라이프 트렌드', '50+ 취미 추천', '시니어 재능 기부',
  ],
  health: [
    '하루 10분 건강 운동', '40대 다이어트 방법', '혈압 낮추는 식단',
    '관절염 예방 운동', '간 건강 관리법', '수면의 질 높이기',
    '건강 검진 항목', '비타민 영양제 추천', '저염식 레시피', '건강한 간식 추천',
  ],
  travel: [
    '국내 가성비 여행지', '부부 여행 추천 코스', '50대 해외 여행',
    '서울 근교 당일치기', '제주도 숨은 명소', '한적한 국내 여행지',
    '온천 여행지 추천', '맛집 여행 코스', '저렴한 펜션 추천', '계절별 여행지 BEST',
  ],
  food: [
    '간단한 점심 메뉴', '에어프라이어 요리', '1인 가구 레시피',
    '저칼로리 다이어트 식단', '건강한 아침 식사', '주말 홈파티 메뉴',
    '집밥 반찬 만들기', '간단한 안주 레시피', '계절 별미 추천', '건강 도시락 메뉴',
  ],
  tech: [
    '50대도 쉬운 AI 사용법', 'ChatGPT 활용법', '스마트폰 200% 활용',
    '유튜브 시작 방법', '카카오톡 숨은 기능', '쉬운 동영상 편집',
    '온라인 쇼핑 꿀팁', '디지털 사기 예방', '클라우드 사진 정리', '무료 유용한 앱 BEST',
  ],
  education: [
    '50대 영어 공부법', '독서 습관 만들기', '하루 10분 자기계발',
    '책 빨리 읽는 법', '인생 명저 추천', '시간 관리 노하우',
    '집중력 높이는 법', '메모 정리 시스템', '자기계발 루틴', '평생 학습 가이드',
  ],
  review: [
    '주방용품 BEST 추천', '안마기 비교 리뷰', '시니어 신발 추천',
    '스마트워치 비교', '가성비 가전제품', '건강식품 솔직 리뷰',
    '여행용품 필수템', '홈트레이닝 도구', '독서대 추천', '실버 친화 제품',
  ],
  social: [
    '2026년 달라지는 정책', '연금 개편 정리', '의료보험 변경사항',
    '50+ 세금 절약법', '복지 제도 활용', '시니어 일자리 정책',
    '노후 보장 제도', '주택 정책 변화', '생활 물가 분석', '사회 트렌드 정리',
  ],
  hobby: [
    '50대 취미 추천', '집에서 하는 운동', '캠핑 입문 가이드',
    '등산 코스 추천', '낚시 시작하기', '골프 입문 팁',
    '가드닝 시작', '서예·캘리그라피', '사진 찍는 법', '악기 배우기',
  ],
};

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getTrendingKeywords(categoryId: string): string[] {
  return TRENDING_KEYWORDS[categoryId] || [];
}
