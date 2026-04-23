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

export const CATEGORIES = [
  {
    id: 'economy',
    name: '경제·재테크',
    emoji: '📊',
    description: '금리, 부동산, 주식, N잡 재테크 영상',
    examples: [
      '"2026년 금리 전망, 한눈에 정리"',
      '"N잡러 월 300만원 버는 방법"',
      '"부동산 폭락 시작, 지금 사야 할까?"',
    ],
    avgViews: '12,000회',
    competition: '보통',
    hot: true,
    color: '#c65f3b',
  },
  {
    id: 'health',
    name: '건강·의료',
    emoji: '💊',
    description: '건강 상식, 다이어트, 시니어 건강, 영양',
    examples: [
      '"시니어가 꼭 알아야 할 건강 상식 5가지"',
      '"하루 10분 건강 운동법"',
      '"2026 건강보험 변경사항 정리"',
    ],
    avgViews: '18,000회',
    competition: '낮음',
    hot: true,
    color: '#7d9b7c',
  },
  {
    id: 'it',
    name: 'IT·테크',
    emoji: '💻',
    description: 'AI 도구, 앱 추천, IT 트렌드, 기술 뉴스',
    examples: [
      '"2026 필수 AI 도구 TOP 5"',
      '"ChatGPT 200% 활용법"',
      '"아이폰 숨은 기능 10가지"',
    ],
    avgViews: '25,000회',
    competition: '보통',
    hot: true,
    color: '#6b8cae',
  },
  {
    id: 'education',
    name: '교육·자기계발',
    emoji: '🎓',
    description: '학습법, 독서, 습관, 자기계발 팁',
    examples: [
      '"1년에 100권 읽는 독서법"',
      '"아침 5시 기상의 비밀"',
      '"집중력 높이는 3가지 방법"',
    ],
    avgViews: '15,000회',
    competition: '보통',
    hot: false,
    color: '#d4a545',
  },
  {
    id: 'food',
    name: '요리·음식',
    emoji: '🍳',
    description: '레시피, 맛집, 홈쿡, 간편식 아이디어',
    examples: [
      '"10분 완성 저녁 레시피"',
      '"다이어트 도시락 일주일"',
      '"숨은 맛집 리뷰 모음"',
    ],
    avgViews: '20,000회',
    competition: '높음',
    hot: false,
    color: '#c65f3b',
  },
  {
    id: 'social',
    name: '사회·이슈',
    emoji: '⚖️',
    description: '시사, 정치, 사회 현상, 뉴스 분석',
    examples: [
      '"2026 최저임금 인상 뭐가 달라지나"',
      '"청년 복지 정책 총정리"',
      '"이슈 분석: 이번 주 이것만 알면 OK"',
    ],
    avgViews: '22,000회',
    competition: '높음',
    hot: false,
    color: '#6b8cae',
  },
  {
    id: 'realestate',
    name: '부동산',
    emoji: '🏠',
    description: '부동산 시장, 청약, 대출, 인테리어',
    examples: [
      '"2026 부동산 시장 전망"',
      '"청약 당첨 전략 완벽 정리"',
      '"1인 가구 자취방 꾸미기"',
    ],
    avgViews: '16,000회',
    competition: '보통',
    hot: false,
    color: '#7d9b7c',
  },
  {
    id: 'game',
    name: '게임',
    emoji: '🎮',
    description: '게임 리뷰, 공략, e스포츠, 인기 게임',
    examples: [
      '"2026 최고의 무료 게임 TOP 10"',
      '"롤 신규 챔피언 공략"',
      '"게임 추천 - 인생게임 5선"',
    ],
    avgViews: '30,000회',
    competition: '높음',
    hot: false,
    color: '#d4a545',
  },
];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
