import { CategoryKey, GuidePost } from '../types';

export const CATEGORY_SPECS: Record<CategoryKey, { start: string; end: string; label: string; motif: string }> = {
  algorithm: { start: '#4f46e5', end: '#818cf8', label: '알고리즘', motif: 'algorithm' },
  senior: { start: '#ea580c', end: '#fb923c', label: '시니어 쇼츠', motif: 'shorts-retention' },
  aitools: { start: '#0284c7', end: '#38bdf8', label: 'AI 도구', motif: 'ai' },
  monetization: { start: '#ca8a04', end: '#facc15', label: '수익화', motif: 'revenue' },
  beginner: { start: '#16a34a', end: '#4ade80', label: '왕초보', motif: 'play' },
  advanced: { start: '#db2777', end: '#f472b6', label: '중고수', motif: 'batch' }
};

// Precise, premium hand-tuned 6-10 character titles and 10-15 character subtitles
export const THUMBNAIL_TEXTS_MAP: Record<string, { title: string; subtitle: string; motif?: string }> = {
  'youtube-algorithm-2026-recommendation': {
    title: '2026 알고리즘',
    subtitle: '추천 가중치의 5가지 핵심 변화',
    motif: 'algorithm'
  },
  'senior-shorts-storytelling-basics': {
    title: '쇼츠 스토리텔링',
    subtitle: '60초 감정 지배 공식 5단계',
    motif: 'shorts-retention'
  },
  'youtube-monetization-requirements-2026': {
    title: '2026 수익화 규칙',
    subtitle: '변경된 유튜브 수익 승인 기준',
    motif: 'revenue'
  },
  'ctr-thumbnail-design-fail-pattern': {
    title: '폭망하는 썸네일',
    subtitle: '시청자가 거르는 최악의 대표 패턴 7',
    motif: 'checklist'
  },
  'ai-script-writing-tools-comparison': {
    title: 'AI 대본 도구 비교',
    subtitle: '챗GPT 클로드 제미나이 리얼 비교',
    motif: 'ai'
  },
  'beginner-channel-setup-first-step': {
    title: '채널 개설 1단계',
    subtitle: '계정부터 아트까지 30분 완성 코스',
    motif: 'play'
  },
  'senior-channel-niche-finding': {
    title: '시니어 니치 시장',
    subtitle: '포화된 사연 시장에서 빈틈 찾기',
    motif: 'network'
  },
  'average-view-duration-improvement': {
    title: '시청유지율 50%선',
    subtitle: '조회수 정체 이탈 타임 교정 비법',
    motif: 'algorithm'
  },
  'shorts-long-form-conversion': {
    title: '쇼츠에서 롱폼으로',
    subtitle: '끊김 없는 충성 구독자 유입 설계',
    motif: 'network'
  },
  'ai-voice-tts-comparison': {
    title: '시니어 맞춤형 AI',
    subtitle: '가장 편안한 최적 TTS 6종 평가',
    motif: 'ai'
  },
  'adsense-cpm-rpm-understanding': {
    title: '광고 CPM과 RPM',
    subtitle: '크리에이터 진짜 수입 비즈니스 설계',
    motif: 'revenue'
  },
  'senior-shorts-script-formula': {
    title: '60초 사연 대본',
    subtitle: '백지 공포 탈출하는 4대 블록 기법',
    motif: 'shorts-retention'
  },
  'beginner-first-video-checklist': {
    title: '첫 업로드 체크목록',
    subtitle: '올리기 전 놓치기 쉬운 7가지 점검',
    motif: 'checklist'
  },
  'channel-niche-positioning': {
    title: '채널 방향성 결정',
    subtitle: '유튜브 왕초보 흔한 기획 실수',
    motif: 'play'
  },
  'ai-thumbnail-generation': {
    title: 'AI 썸네일 도구',
    subtitle: '미드저니 캔바 파이어플라이 실전',
    motif: 'ai'
  },
  'senior-comment-engagement': {
    title: '댓글 소통 증진법',
    subtitle: '채널 성장에 기폭제가 되는 댓글 유도',
    motif: 'comment'
  },
  'channel-membership-strategy': {
    title: '멤버십 설계 전략',
    subtitle: '안정적인 고수익 월세 올리기',
    motif: 'revenue'
  },
  'session-time-strategy': {
    title: '세션 체류 시간',
    subtitle: '종료 화면 카드 재생목록 연결망',
    motif: 'network'
  },
  'advanced-analytics-deep-dive': {
    title: '분석 핵심 지표',
    subtitle: '유튜브 스튜디오 데이터 심층 분석',
    motif: 'algorithm'
  },
  'ai-video-editing-tools': {
    title: 'AI 자동 편집 도구',
    subtitle: '브루 캡컷 디스크립트 완벽 해부',
    motif: 'ai'
  },
  'beginner-equipment-budget': {
    title: '초보 가성비 장비',
    subtitle: '스마트폰 하나로 만드는 크리에이터',
    motif: 'equipment'
  },
  'senior-emotional-bgm-selection': {
    title: '시니어 감성 BGM',
    subtitle: '인생 사연 눈물 짜는 사운드 연출',
    motif: 'equipment'
  },
  'brand-deal-pricing-guide': {
    title: '협찬 광고비 책정',
    subtitle: '구독자대비 합리적인 광고 단가 협상',
    motif: 'revenue'
  },
  'title-keyword-strategy': {
    title: '검색 노출 제목',
    subtitle: '구글 최적화 검색과 클릭률 최적화',
    motif: 'algorithm'
  },
  'advanced-content-batching-system': {
    title: '일괄 배치 제작법',
    subtitle: '대본 양산으로 채널 발행량 2배 올리기',
    motif: 'batch'
  },
  'ai-research-tools-for-creators': {
    title: '소재 고갈 탈출 AI',
    subtitle: '다음 영상 기획이 쉬워지는 5대 도구',
    motif: 'ai'
  },
  'beginner-consistency-habit': {
    title: '3개월 지속 비결',
    subtitle: '중도 포기 없는 정량 예약발행 주기',
    motif: 'checklist'
  },
  'shorts-revenue-strategy': {
    title: '쇼츠 수입의 진실',
    subtitle: '조회수 폭베에도 왜 돈이 안 될까?',
    motif: 'revenue'
  },
  'senior-channel-thumbnail-tone': {
    title: '자극보다 신뢰감',
    subtitle: '시니어 클릭 유도하는 다정한 톤앤매너',
    motif: 'shorts-retention'
  },
  'ai-image-tools-thumbnail': {
    title: '무료 AI 이미지',
    subtitle: '예산 한 푼 없이 화사한 소스 확보',
    motif: 'ai'
  },
  'advanced-channel-expansion-multichannel': {
    title: '다채널 운영과 외주',
    subtitle: '2채널 아웃소싱 주기와 전환점 진단',
    motif: 'network'
  },
  'youtube-revenue-types-comparison': {
    title: '유튜브 수입 8종',
    subtitle: '애드센스 뛰어넘는 다차원 비즈니스',
    motif: 'revenue'
  },
  'beginner-common-mistakes': {
    title: '초보 흔한 실수',
    subtitle: '미리 알면 피해가는 6대 블랙홀 함정',
    motif: 'checklist'
  },
  'senior-storytelling-from-real-life': {
    title: '실제 사연 영상화',
    subtitle: '사생활 프라이버시 보호와 공감대',
    motif: 'comment'
  },
  'algorithm-reset-recovery': {
    title: '노출 정지 회복법',
    subtitle: '알고리즘 락 걸렸을 때 6단계 복구법',
    motif: 'algorithm'
  },
  'ai-script-prompt-templates': {
    title: '특급 대본 프롬프트',
    subtitle: '카테고리별 즉시 활용 7대 템플릿',
    motif: 'ai'
  },
  'shorts-vs-longform-revenue': {
    title: '쇼츠 vs 롱폼 ROI',
    subtitle: '투입 시간 대비 현실 수익성 분석',
    motif: 'revenue'
  },
  'ai-content-policy-2026-monetization': {
    title: 'AI 영상 수익 승인',
    subtitle: '2026 개정 구글 인공지능 수익화 정책',
    motif: 'ai'
  },
  'advanced-ab-testing-thumbnails': {
    title: '썸네일 A/B 테스트',
    subtitle: '감정이 아니라 정직한 통계 수치 결정',
    motif: 'batch'
  },
  'senior-narrator-voice-tone': {
    title: '내레이션 목소리',
    subtitle: '시니어가 끝까지 귀 기울이는 발성 톤',
    motif: 'shorts-retention'
  },
  'ai-voice-tools-comparison': {
    title: 'AI 구독료 가이드',
    subtitle: '진짜 요정 필수 도구와 과소비 구별법',
    motif: 'checklist'
  },
  'passive-income-from-evergreen-content': {
    title: '지속 연금 에버그린',
    subtitle: '1년 내내 누적 노출 지속되는 영상',
    motif: 'algorithm'
  },
  'advanced-revenue-diversification-strategy': {
    title: '수익 다각화 전략',
    subtitle: '단순 광고비 넘어 영속성 가치 사슬',
    motif: 'network'
  },
  'youtube-recommendation-shift-2026-q2': {
    title: '추천 가중치 패치',
    subtitle: '5월 둘째 주 추천 노출 감소 긴급대응',
    motif: 'algorithm'
  },
  'senior-shorts-comments-engagement-may': {
    title: '댓글 폭증 한 줄',
    subtitle: '5월 효과 본 활발 소통 유도 마무리문',
    motif: 'comment'
  },
  'youtube-monetization-may-checkpoint': {
    title: '5월 수익화 점검',
    subtitle: '상반기 분기 시점 크리에이터 가이드',
    motif: 'checklist'
  }
};

export function getThumbnailTexts(post: Partial<GuidePost> & { slug: string; title: string; subtitle: string; category: CategoryKey }): { title: string; subtitle: string; motif: string } {
  const mapped = THUMBNAIL_TEXTS_MAP[post.slug];
  const spec = CATEGORY_SPECS[post.category] || { motif: 'play' };
  
  if (mapped) {
    return {
      title: mapped.title,
      subtitle: mapped.subtitle,
      motif: mapped.motif || spec.motif
    };
  }

  // Fallback smart shortening
  let t = post.title.split(',')[0].split('?')[0].split('!')[0].trim();
  if (t.length > 8) {
    t = t.substring(0, 8);
  }
  let s = post.subtitle.split(',')[0].trim();
  if (s.length > 15) {
    s = s.substring(0, 15);
  }

  return {
    title: t || '유튜브 성장',
    subtitle: s || '실전 크리에이터 가이드북',
    motif: spec.motif
  };
}

export const MOTIFS_PATH: Record<string, string> = {
  algorithm: `
    <g transform="translate(600, 220)" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M -150,80 L -50,60 L 50,-20 L 150,-80" opacity="0.4" stroke-dasharray="10 10"/>
      <path d="M -150,80 L -70,30 L 10,-30 L 90,-40 L 170,-100" />
      <circle cx="-150" cy="80" r="10" fill="#ffffff" stroke="none" />
      <circle cx="-70" cy="30" r="10" fill="#ffffff" stroke="none" />
      <circle cx="10" cy="-30" r="10" fill="#ffffff" stroke="none" />
      <circle cx="90" cy="-40" r="10" fill="#ffffff" stroke="none" />
      <circle cx="170" cy="-100" r="12" fill="#ffffff" stroke="none" />
      <circle cx="170" cy="-100" r="22" stroke="#ffffff" stroke-width="2" opacity="0.5" />
    </g>
  `,
  'shorts-retention': `
    <g transform="translate(600, 220)">
      <rect x="-60" y="-100" width="120" height="200" rx="20" ry="20" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.8" />
      <line x1="-20" y1="-85" x2="20" y2="-85" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.6" />
      <polygon points="-10,-20 -10,20 20,0" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
      <path d="M -95,-30 A 100 100 0 0 1 -20,-95" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 8" opacity="0.5" />
      <path d="M 20,95 A 100 100 0 0 1 95,30" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 8" opacity="0.5" />
      <polygon points="-20,-100 -20,-90 -10,-95" fill="#ffffff" />
      <polygon points="95,35 95,25 105,30" fill="#ffffff" />
    </g>
  `,
  comment: `
    <g transform="translate(600, 220)">
      <path d="M -90,-80 h 140 a 20 20 0 0 1 20 20 v 60 a 20 20 0 0 1 -20 20 h -80 l -40 30 v -30 a 20 20 0 0 1 -20 -20 v -60 a 20 20 0 0 1 20 -20 z" fill="#ffffff" opacity="0.3" />
      <path d="M 30,-20 h 80 a 12 12 0 0 1 12 12 v 40 a 12 12 0 0 1 -12 12 h -50 l -25 20 v -20 a 12 12 0 0 1 -12 -12 v -40 a 12 12 0 0 1 12 -12 z" fill="#ffffff" opacity="0.6" />
      <path d="M -20,-15 C -30,-30 -50,-30 -50,-10 C -50,10 -20,25 -20,25 C -20,25 10,10 10,-10 C 10,-30 -10,-30 -20,-15 Z" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
    </g>
  `,
  revenue: `
    <g transform="translate(600, 215)">
      <rect x="-130" y="30" width="40" height="60" rx="6" fill="#ffffff" opacity="0.4" />
      <rect x="-70" y="-10" width="40" height="100" rx="6" fill="#ffffff" opacity="0.6" />
      <rect x="-10" y="-50" width="40" height="140" rx="6" fill="#ffffff" opacity="0.8" />
      <rect x="50" y="-90" width="40" height="180" rx="6" fill="#ffffff" />
      <polyline points="-110,40 -50,0 10,-40 70,-80" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <circle cx="70" cy="-80" r="12" fill="#ffffff" stroke="#ffffff" stroke-width="2" />
      <g transform="translate(110, -50) scale(1.5)">
        <circle cx="0" cy="0" r="22" fill="#ffffff" opacity="0.8" />
        <text x="0" y="8" font-size="26" font-weight="900" text-anchor="middle" fill="#ea580c" font-family="sans-serif">$</text>
      </g>
    </g>
  `,
  ai: `
    <g transform="translate(600, 220)">
      <rect x="-60" y="-60" width="120" height="120" rx="16" fill="none" stroke="#ffffff" stroke-width="6" />
      <line x1="-90" y1="-30" x2="-60" y2="-30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="-90" y1="30" x2="-60" y2="30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="60" y1="-30" x2="90" y2="-30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="60" y1="30" x2="90" y2="30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="-30" y1="-90" x2="-30" y2="-60" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="30" y1="-90" x2="30" y2="-60" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="-30" y1="60" x2="-30" y2="90" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="30" y1="60" x2="30" y2="90" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.5" />
      <circle cx="0" cy="0" r="14" fill="#ffffff" />
      <circle cx="-90" cy="-30" r="6" fill="#ffffff" />
      <circle cx="-90" cy="30" r="6" fill="#ffffff" />
      <circle cx="90" cy="-30" r="6" fill="#ffffff" />
      <circle cx="90" cy="30" r="6" fill="#ffffff" />
      <circle cx="-30" cy="-90" r="6" fill="#ffffff" />
      <circle cx="30" cy="-90" r="6" fill="#ffffff" />
      <circle cx="-30" cy="90" r="6" fill="#ffffff" />
      <circle cx="30" cy="90" r="6" fill="#ffffff" />
    </g>
  `,
  play: `
    <g transform="translate(600, 220)">
      <rect x="-120" y="-80" width="240" height="160" rx="16" fill="none" stroke="#ffffff" stroke-width="6" />
      <line x1="-120" y1="40" x2="120" y2="40" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <circle cx="0" cy="-10" r="36" fill="#ffffff" opacity="0.25" />
      <polygon points="-12,-28 -12,8 18,-10" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
      <circle cx="-90" cy="55" r="5" fill="#ffffff" opacity="0.8" />
      <circle cx="-60" cy="55" r="5" fill="#ffffff" opacity="0.8" />
      <circle cx="-30" cy="55" r="5" fill="#ffffff" opacity="0.8" />
    </g>
  `,
  checklist: `
    <g transform="translate(600, 220)">
      <path d="M -70,-90 h 140 a 16 16 0 0 1 16 16 v 140 a 16 16 0 0 1 -16 16 h -140 a 16 16 0 0 1 -16 -16 v -140 a 16 16 0 0 1 16 -16 z" fill="none" stroke="#ffffff" stroke-width="6" />
      <path d="M -30,-90 v -10 a 6 6 0 0 1 6 -6 h 48 a 6 6 0 0 1 6 6 v 10 Z" fill="#ffffff" opacity="0.6" />
      <rect x="-45" y="-50" width="24" height="24" rx="4" fill="none" stroke="#ffffff" stroke-width="4" />
      <polyline points="-42,-38 -37,-33 -27,-45" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="-10" y1="-38" x2="45" y2="-38" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.9" />
      <rect x="-45" y="-10" width="24" height="24" rx="4" fill="none" stroke="#ffffff" stroke-width="4" />
      <polyline points="-42,2 -37,7 -27,-5" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="-10" y1="2" x2="30" y2="2" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.9" />
      <rect x="-45" y="30" width="24" height="24" rx="4" fill="none" stroke="#ffffff" stroke-width="4" />
      <polyline points="-42,42 -37,47 -27,35" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" />
      <line x1="-10" y1="42" x2="20" y2="42" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.9" />
    </g>
  `,
  equipment: `
    <g transform="translate(600, 220)">
      <circle cx="0" cy="-30" r="50" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.4" />
      <circle cx="0" cy="-30" r="65" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 6" opacity="0.3" />
      <rect x="-24" y="-70" width="48" height="85" rx="24" fill="none" stroke="#ffffff" stroke-width="6" />
      <line x1="-24" y1="-30" x2="24" y2="-30" stroke="#ffffff" stroke-width="4" />
      <path d="M -16,-62 L -16, -30 M -8,-67 L -8, -30 M 0,-68 L 0, -30 M 8,-67 L 8, -30 M 16,-62 L 16, -30" stroke="#ffffff" stroke-width="2" opacity="0.5" />
      <path d="M -36, -10 A 36 36 0 0 0 36, -10" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
      <line x1="0" y1="26" x2="0" y2="70" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <line x1="-35" y1="70" x2="35" y2="70" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
    </g>
  `,
  batch: `
    <g transform="translate(600, 215)">
      <rect x="-105" y="-75" width="130" height="90" rx="10" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.4" transform="rotate(-12)" />
      <rect x="-45" y="-85" width="130" height="90" rx="10" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.6" transform="rotate(6)" />
      <rect x="-65" y="-35" width="130" height="90" rx="10" fill="none" stroke="#ffffff" stroke-width="6" />
      <polygon points="-15,0 -15,20 5,10" fill="#ffffff" />
      <line x1="-45" y1="-15" x2="15" y2="-15" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8" />
    </g>
  `,
  network: `
    <g transform="translate(600, 220)">
      <line x1="-100" y1="-50" x2="0" y2="40" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <line x1="100" y1="-50" x2="0" y2="40" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <line x1="-100" y1="-50" x2="100" y2="-50" stroke="#ffffff" stroke-width="4" opacity="0.3" />
      <line x1="0" y1="40" x2="0" y2="-110" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <line x1="-100" y1="-50" x2="0" y2="-110" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <line x1="100" y1="-50" x2="0" y2="-110" stroke="#ffffff" stroke-width="4" opacity="0.6" />
      <circle cx="0" cy="40" r="32" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.5" />
      <circle cx="-100" cy="-50" r="16" fill="#ffffff" stroke="#ffffff" stroke-width="4" />
      <circle cx="100" cy="-50" r="16" fill="#ffffff" stroke="#ffffff" stroke-width="4" />
      <circle cx="0" cy="40" r="22" fill="#ffffff" stroke="#ffffff" stroke-width="4" />
      <circle cx="0" cy="-110" r="14" fill="#ffffff" stroke="#ffffff" stroke-width="4" />
      <text x="0" y="47" font-size="18" font-weight="900" text-anchor="middle" fill="#ea580c" font-family="sans-serif">N</text>
    </g>
  `
};

export function renderThumbnailSvg(slug: string, titleStr: string, subtitleStr: string, category: CategoryKey): string {
  const spec = CATEGORY_SPECS[category] || { start: '#4f46e5', end: '#818cf8', label: '알고리즘', motif: 'algorithm' };
  const texts = getThumbnailTexts({ slug, title: titleStr, subtitle: subtitleStr, category });
  const motifSvg = MOTIFS_PATH[texts.motif] || MOTIFS_PATH[spec.motif] || '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${spec.start}"/>
      <stop offset="100%" stop-color="${spec.end}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- ② 일러스트: 주제별 도형 (중앙 상단) -->
  ${motifSvg.trim()}

  <!-- ③ 텍스트 -->
  <text x="600" y="490" font-size="56" font-weight="900" fill="#ffffff" text-anchor="middle"
        font-family="Pretendard,system-ui,-apple-system,sans-serif" letter-spacing="-0.02em">${texts.title}</text>
  <text x="600" y="555" font-size="28" font-weight="400" fill="#ffffff" opacity="0.8" text-anchor="middle"
        font-family="Pretendard,system-ui,-apple-system,sans-serif">${texts.subtitle}</text>
</svg>`;
}
