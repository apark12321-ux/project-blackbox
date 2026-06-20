import { CategorySpec, GuidePost } from './types';
import { POSTS_GROUP_1 } from './data/posts1';
import { POSTS_GROUP_2 } from './data/posts2';
import { POSTS_GROUP_3 } from './data/posts3';

export const SITE_OPERATOR = {
  name: '상상아트',
  registrationNum: '272-14-01256',
  mailOrderNum: '제 2023-화성동탄-1098 호',
  address: '인천광역시 서구 크리스탈로 100',
  email: 'apark12321@gmail.com',
  privacyOfficer: '박예준',
  projectTitle: 'NuTube',
  openingDate: '2021년 2월 16일',
  businessType: '정보통신업, 미디어콘텐츠 창작업',
  website: 'www.nutube.kr'
};

export const CATEGORIES: CategorySpec[] = [
  {
    key: 'algorithm',
    label: '알고리즘 분석',
    icon: '🎯',
    gradient: 'from-[#2e7d32] to-[#1b5e20]',
    accentColor: '#1b5e20',
    description: '추천 알고리즘의 동작 방식, 트래픽 유입 구조 및 CTR 분석',
    count: 13,
    persona: '깐깐한 전략가 (단호체, 짧은 문장, 핵심 중심)'
  },
  {
    key: 'senior',
    label: '시니어 사연 쇼츠',
    icon: '👴',
    gradient: 'from-[#37474f] to-[#212121]',
    accentColor: '#212121',
    description: '시니어 타겟층을 매료시키는 따뜻한 스토리텔링과 감성 전략',
    count: 13,
    persona: '친근한 멘토 (합쇼체, 스토리텔링, 다정함)'
  },
  {
    key: 'aitools',
    label: 'AI 제작 도구',
    icon: '🤖',
    gradient: 'from-[#00695c] to-[#004d40]',
    accentColor: '#004d40',
    description: 'AI 스크립트 작성, TTS, 자동 편집 도구 활용 비법과 정책 규칙',
    count: 6,
    persona: '실용적 동네 형 (구어체, ~요/~네요, 친밀한 팁)'
  },
  {
    key: 'monetization',
    label: '영상 채널 수익화',
    icon: '💰',
    gradient: 'from-[#4e342e] to-[#3e2723]',
    accentColor: '#3e2723',
    description: '구글 애드센스, 브랜드 제휴, 굿즈 판매 등 비즈니스 인벤토리 마스터',
    count: 7,
    persona: '정중한 컨설턴트 (격식체, ~습니다, 전문적인 요약)'
  },
  {
    key: 'beginner',
    label: '왕초보 입문 가이드',
    icon: '🔰',
    gradient: 'from-[#2e7d32] to-[#004d40]',
    accentColor: '#2e7d32',
    description: '이제 막 유튜브를 시작하는 왕초보를 위한 필수 단계별 로드맵',
    count: 3,
    persona: '쉽고 친절한 길잡이 (명확하고 직관적인 설명)'
  },
  {
    key: 'advanced',
    label: '성장 중고수 꿀팁',
    icon: '🚀',
    gradient: 'from-[#233a28] to-[#121c15]',
    accentColor: '#233a28',
    description: '정체된 채널을 돌파하는 CTR A/B 테스트와 고도화된 트래픽 전략',
    count: 5,
    persona: '예리한 데이터 분석가 (심층적 통계와 정밀 검증)'
  }
];

export const INITIAL_POSTS: GuidePost[] = [
  ...POSTS_GROUP_1,
  ...POSTS_GROUP_2,
  ...POSTS_GROUP_3
].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
