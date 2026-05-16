import type { Metadata } from 'next';

const SITE_URL = 'https://nutube.kr';

// 정적 가이드 메타데이터 — generateMetadata에서 slug 조회용
const STATIC_POST_META: Record<string, { title: string; description: string; category: string; publishedAt: string }> = {
  'algorithm-seo': { title: '알고리즘이 내 영상을 알아보게 하는 SEO 전략', description: '제목 8:2 법칙과 음성 SEO로 검색 노출 200% 올리는 실전 방법', category: '알고리즘', publishedAt: '2026-05-02' },
  'algorithm-retention': { title: '시청자를 채널에 가두는 무한 루프 세팅', description: '챕터 + 최종화면 + 재생목록으로 체류시간 2배 늘리는 방법', category: '알고리즘', publishedAt: '2026-05-02' },
  'algorithm-branding': { title: '클릭을 부르는 브랜딩과 디테일의 힘', description: '60-30-10 컬러 법칙과 채널 아트 3요소 공식으로 CTR 높이기', category: '알고리즘', publishedAt: '2026-05-02' },
  'algorithm-mistakes': { title: '치명적 실수 7가지 - 알고 피하면 떡상', description: '99% 채널이 모르는 유튜브 알고리즘 위반 행동 7가지 완전 정리', category: '알고리즘', publishedAt: '2026-05-02' },
  'viral-patterns': { title: '떡상 채널 패턴 분석', description: '조회수 100만+ 채널들의 공통점 7가지 데이터 분석', category: '알고리즘', publishedAt: '2026-05-02' },
  'youtube-algorithm': { title: '유튜브 알고리즘 작동 원리 완벽 분석', description: '추천 영상에 노출되는 진짜 기준 6가지 완전 정복', category: '알고리즘', publishedAt: '2026-05-01' },
  'channel-concept': { title: '채널 컨셉 5가지 카테고리 정리', description: '나에게 맞는 유튜브 채널 방향 찾기 - 5가지 카테고리 완전 분석', category: '알고리즘', publishedAt: '2026-05-01' },
  'youtube-start': { title: '유튜브 시작 가이드 - 첫 한 달 핵심', description: '0명에서 100명 구독자까지 단계별 안내 - 첫 달 필수 체크리스트', category: '알고리즘', publishedAt: '2026-05-01' },
  'youtube-monetization': { title: '유튜브 채널 수익화 완전 정복', description: '광고 수익부터 협찬·멤버십까지 다양한 수익 모델 한번에 정리', category: '알고리즘', publishedAt: '2026-04-28' },
  'human-warmth': { title: 'AI 시대, 유튜버가 잃지 말아야 할 인간의 온도', description: 'AI가 절대 못 만드는 콘텐츠 3가지와 실천법 5가지', category: '알고리즘', publishedAt: '2026-05-04' },
  'senior-channel-start': { title: '50대부터 시작하는 시니어 사연 쇼츠 채널', description: '처음 시작하시는 분들을 위한 단계별 안내 - 50·60·70대 완전 초보 가이드', category: '시니어', publishedAt: '2026-05-04' },
  'senior-content-ideas': { title: '시니어 채널 콘텐츠 아이디어 30가지', description: '시청자 공감을 부르는 검증된 주제 30가지 - 시니어 유튜브 콘텐츠 완전판', category: '시니어', publishedAt: '2026-05-04' },
  'senior-hook-patterns': { title: '시청자를 사로잡는 시니어 영상 후크 8가지', description: '영상 첫 5초로 시청 완료율 60% 올리는 후크 패턴 완전 분석', category: '시니어', publishedAt: '2026-05-04' },
  'senior-engagement': { title: '시니어 채널 댓글과 참여 늘리는 5가지 질문', description: '알고리즘이 좋아하는 참여형 질문 패턴 - 댓글 100개 채널 만들기', category: '시니어', publishedAt: '2026-05-04' },
  'senior-policy-safe': { title: '시니어 채널 정책 위반 피하는 6가지 규칙', description: '안전하게 채널 키우는 핵심 운영 규칙 - 경고 없이 채널 성장하기', category: '시니어', publishedAt: '2026-05-04' },
  'senior-shooting-mistakes': { title: '시니어가 처음 영상 찍을 때 흔한 실수 7가지', description: '50대 이후 처음 촬영 시 자주 하는 실수와 해결법 완전 정리', category: '시니어', publishedAt: '2026-05-06' },
  'senior-first-100': { title: '시니어 채널 첫 100명 구독자 모으기 단계별 가이드', description: '50~70대 채널의 100명 도달 4단계 전략 - 검증된 실전 방법', category: '시니어', publishedAt: '2026-05-06' },
  'senior-capcut-basic': { title: '시니어 영상 편집 - 무료 앱 기본 사용법', description: '처음 시작하는 시니어를 위한 영상 편집 5단계 완전 초보 가이드', category: '시니어', publishedAt: '2026-05-06' },
  'senior-family-channel': { title: '50대 이후 시작하는 가족 일상 채널 가이드', description: '가족과 함께 추억을 영상으로 남기는 채널 운영법', category: '시니어', publishedAt: '2026-05-06' },
  'senior-thumbnail-design': { title: '시니어 시청자가 좋아하는 썸네일 디자인 5가지', description: '50~70대 시청자의 클릭을 부르는 썸네일 원칙 5가지 완전 정리', category: '시니어', publishedAt: '2026-05-06' },
  'ai-tools': { title: 'AI 영상 만들기 도구 모음', description: '초보도 쓸 수 있는 AI 도구 추천 가이드 - 무료·유료 완전 비교', category: 'AI 도구', publishedAt: '2026-04-28' },
  'ai-thumbnail': { title: 'AI 썸네일 만드는 도구 5개 비교', description: 'AI 이미지 생성 도구 완전 비교 - 초보자도 5분 만에 썸네일 완성', category: 'AI 도구', publishedAt: '2026-04-29' },
  'chatgpt-script': { title: 'ChatGPT로 영상 대본 빠르게 쓰는 법', description: 'AI를 보조 도구로 활용하는 5가지 프롬프트 - 대본 작성 시간 90% 단축', category: 'AI 도구', publishedAt: '2026-04-30' },
  'voice-seo': { title: '음성 SEO 완전 정복 - 검색 노출 200%', description: 'AI 자막이 검색 엔진을 잡는 새로운 SEO 방식 - 음성 검색 최적화 완전판', category: 'AI 도구', publishedAt: '2026-05-01' },
  'thumbnail-tips': { title: '눈길을 사로잡는 썸네일 글자 디자인', description: '클릭율 2배 늘리는 썸네일 폰트 활용법 - CTR 높이는 디자인 원칙', category: 'AI 도구', publishedAt: '2026-05-01' },
  'camera-anxiety': { title: '카메라 울렁증 극복하기', description: '얼굴 안 나와도 채널 운영 가능한 방법 - 카메라 공포 완전 극복 가이드', category: 'AI 도구', publishedAt: '2026-05-01' },
  'free-editing-apps': { title: '무료 영상 편집 앱 추천', description: '초보가 바로 쓸 수 있는 편집 도구 5선 - 완전 무료 영상 편집 완전판', category: 'AI 도구', publishedAt: '2026-05-01' },
  'phone-shooting': { title: '핸드폰만으로 영상 잘 찍는 법', description: '카메라 없이도 가능한 촬영 노하우 - 스마트폰 영상 퀄리티 올리기', category: 'AI 도구', publishedAt: '2026-05-01' },
  'claude-youtube-workflow': { title: '클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스', description: '기획부터 업로드 패키지까지 클로드 한 곳에서 완성하는 방법', category: 'AI 도구', publishedAt: '2026-05-04' },
  'ai-dubbing-korean': { title: 'AI 자동 더빙으로 한국어 영상 자연스럽게 만들기', description: '외국어 자막 영상을 자연스러운 한국어 더빙으로 자동화하는 방법', category: 'AI 도구', publishedAt: '2026-05-08' },
  'ai-thumbnail-master': { title: 'AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결', description: 'AI 조합으로 프로 썸네일 5분 완성 - 클릭률 5배 올리는 실전 방법', category: 'AI 도구', publishedAt: '2026-05-08' },
  'algorithm-mindset': { title: '6개월간 떡상이 안 와도 버티는 멘탈 관리', description: '실패해도 다시 도전하는 5가지 마인드셋 - 유튜버 멘탈 관리 완전판', category: '수익화', publishedAt: '2026-05-02' },
  'first-100-subs': { title: '첫 100명 구독자 모으는 방법', description: '0명에서 100명까지 4단계 전략 - 검증된 구독자 성장 로드맵', category: '수익화', publishedAt: '2026-05-02' },
  'side-job-50': { title: '50대 부업 유튜브 시작 가이드', description: '늦은 나이가 오히려 무기가 되는 채널 운영 - 50대 유튜브 부업 완전판', category: '수익화', publishedAt: '2026-05-02' },
  'revenue-calc': { title: '유튜브 광고 수익 계산법', description: '조회수당 수익과 RPM 이해하기 - 유튜브 광고 수익 완전 정복', category: '수익화', publishedAt: '2026-04-30' },
  'sponsorship-strategy': { title: '유튜브 스폰서십 받는 채널 만드는 5단계 전략', description: '구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결 5단계 완전판', category: '수익화', publishedAt: '2026-05-08' },
  'shorts-algorithm-mastery': { title: '유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀', description: '긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙 완전 분석', category: '알고리즘', publishedAt: '2026-05-08' },
  'senior-comment-reply': { title: '시니어 채널 댓글 답변 5가지 - 진짜 팬을 만드는 비결', description: '구독자를 진짜 팬으로, 후원자로 키우는 댓글 답변 전략 완전판', category: '시니어', publishedAt: '2026-05-08' },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = STATIC_POST_META[slug];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      keywords: ['유튜브', meta.category, meta.title, '유튜브 가이드', '유튜브 채널 운영', '알고파트너스'],
      authors: [{ name: '알고파트너스', url: `${SITE_URL}/about` }],
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: `${meta.title} | NuTube`,
        description: meta.description,
        type: 'article',
        locale: 'ko_KR',
        url: `${SITE_URL}/blog/${slug}`,
        siteName: 'NuTube',
        publishedTime: meta.publishedAt,
        authors: ['알고파트너스'],
        tags: ['유튜브', meta.category, '유튜브 가이드'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${meta.title} | NuTube`,
        description: meta.description,
      },
    };
  }

  // 동적 포스트 (Redis에서 불러오는 경우) - 기본 메타데이터
  return {
    title: '유튜브 채널 운영 가이드',
    description: 'NuTube 유튜브 채널 운영 가이드 - 알고리즘, 시니어, AI 도구, 수익화 실전 노하우',
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: '유튜브 채널 운영 가이드 | NuTube',
      description: 'NuTube 유튜브 채널 운영 가이드 - 알고리즘, 시니어, AI 도구, 수익화 실전 노하우',
      type: 'article',
      locale: 'ko_KR',
      url: `${SITE_URL}/blog/${slug}`,
      siteName: 'NuTube',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
