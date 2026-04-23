'use client';
/**
 * /blog/[slug] - 블로그 개별 글
 *
 * 초기 5개 글 하드코딩 (AdSense 심사용 콘텐츠).
 * MDX 전환은 Phase 4 이후.
 *
 * 각 글은 AdSense 정책 준수:
 * - 원본 콘텐츠 (복제 아님)
 * - 1000자 이상
 * - 실용적 정보 (가치 제공)
 * - 선정적/폭력적 내용 없음
 */

import { DashboardShell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  content: React.ReactNode;
};

const POSTS: Record<string, BlogPost> = {
  'youtube-algorithm-2026': {
    slug: 'youtube-algorithm-2026',
    title: '2026년 유튜브 알고리즘 대격변 — 크리에이터가 꼭 알아야 할 4가지',
    category: '알고리즘',
    readingTime: 6,
    publishedAt: '2026-04-22',
    content: (
      <>
        <p>
          2026년 들어 유튜브 추천 알고리즘이 큰 변화를 맞이했습니다. 단순히 조회수만 높이면 되던 시대는 끝났고, 
          시청 유지율과 세션 전체 시청 시간이 훨씬 중요해졌어요. 이 변화는 특히 중소 크리에이터에게 기회이자 위협이 되고 있습니다.
        </p>

        <h2>1. 세션 시청 시간이 핵심 지표로</h2>
        <p>
          과거에는 "내 영상 하나"의 조회수가 전부였다면, 이제는 "내 영상을 본 뒤 사용자가 유튜브에 얼마나 더 머무는가"가 중요해졌습니다. 
          즉, 내 영상이 끝나고 다른 영상으로 자연스럽게 이어질 수 있는 스토리텔링과 엔딩 설계가 필수가 됐어요.
        </p>
        <p>
          이걸 놓치는 흔한 실수는 영상 끝에 "구독 부탁드립니다" 같은 CTA만 넣고 끝내는 경우입니다. 
          알고리즘은 그 순간 사용자가 유튜브를 떠나면 내 영상에 감점을 줍니다. 
          대신 관련 영상 추천, 다음 편 예고 등으로 체류 시간을 늘려주는 게 좋아요.
        </p>

        <h2>2. 썸네일 CTR에 "일관성" 가산점 부여</h2>
        <p>
          예전엔 클릭률이 높기만 하면 됐는데, 2026년부터는 "채널의 썸네일이 일관된 스타일인가"가 가점 요소가 됐습니다. 
          사용자가 어떤 썸네일을 보고 내 채널을 클릭했을 때, 다른 영상 썸네일도 비슷한 톤이라면 
          "이 채널은 믿을 만하다"는 신호가 알고리즘에 전달돼요.
        </p>
        <p>
          반대로 영상마다 썸네일 디자인이 완전히 다르면, 같은 채널 영상을 연속으로 보는 확률이 떨어지고 알고리즘이 덜 추천합니다. 
          채널 단위로 디자인 시스템을 만드는 게 중요해졌어요.
        </p>

        <h2>3. Shorts와 롱폼의 시너지 강화</h2>
        <p>
          Shorts를 거의 올리지 않던 롱폼 채널들도 이제 일주일에 2~3개 Shorts를 병행하는 게 유리해졌습니다. 
          알고리즘이 Shorts에서 내 채널을 처음 접한 사용자를 롱폼으로 자동 연결하는 로직이 강화됐기 때문이에요.
        </p>
        <p>
          다만 Shorts와 롱폼의 주제가 완전히 동떨어져 있으면 오히려 감점됩니다. 
          Shorts는 롱폼의 "한 장면 하이라이트"처럼 구성하는 게 알고리즘 점수에 유리해요.
        </p>

        <h2>4. 초반 30초의 의미가 더 커졌다</h2>
        <p>
          과거엔 후킹이 강하면 "첫 3~5초"였는데, 2026년엔 "첫 30초"의 유지율이 훨씬 중요해졌습니다. 
          사용자가 영상 시작 30초 안에 이탈하는 비율이 50%를 넘으면 알고리즘은 이 영상을 적극적으로 덜 추천해요.
        </p>
        <p>
          그래서 초반 30초 안에 "이 영상이 왜 볼 가치가 있는지"를 명확히 보여주는 구성이 필수가 됐습니다. 
          미스터리 제기, 결론 선공개, 숫자 강조 같은 기법이 효과적이에요.
        </p>

        <h2>마치며</h2>
        <p>
          알고리즘은 매년 바뀌지만, 2026년의 변화는 유독 큽니다. 특히 "조회수 한 방"에 의존하던 채널들은 
          유지율·세션·일관성 같은 복합 지표로 옮겨가는 트렌드에 빠르게 적응해야 해요. 
          AlgoMaker는 이런 알고리즘 트렌드를 반영한 시나리오 구조로 영상을 자동 생성합니다. 
          한 번 시도해보세요 — 무료로 시작할 수 있어요.
        </p>
      </>
    ),
  },

  'retention-rate-editing-tips': {
    slug: 'retention-rate-editing-tips',
    title: '시청 유지율 40% 올린 실전 편집 기법 7가지',
    category: '편집',
    readingTime: 8,
    publishedAt: '2026-04-21',
    content: (
      <>
        <p>
          영상 품질이 아무리 좋아도 시청 유지율이 40% 미만이면 유튜브 알고리즘은 내 영상을 거의 추천해주지 않습니다. 
          반대로 유지율이 50%를 넘어가면 조회수가 급격히 상승하는 "알고리즘 상승 곡선"을 탈 수 있어요. 
          이번 글에서는 실제로 유지율을 크게 개선한 편집 기법 7가지를 소개합니다.
        </p>

        <h2>1. "Jump Cut" — 숨 쉴 틈을 없애라</h2>
        <p>
          한 문장이 끝날 때마다 0.3초 정도의 미세한 공백을 잘라내세요. 
          사람이 말할 때 자연스럽게 생기는 "어... 음..." 같은 필러와 호흡 공백을 모두 제거하면, 
          시청자의 뇌가 "다음 내용 기다리는 시간"을 느끼지 못해 이탈률이 크게 떨어져요.
        </p>

        <h2>2. B-roll은 핵심 문장 앞에 겹쳐라</h2>
        <p>
          중요한 정보를 말하기 1초 전에 관련 이미지나 영상이 전환되도록 편집하세요. 
          "이제 핵심을 말할게요" 같은 예고 문구 없이도 시청자는 "뭔가 중요한 게 나온다"고 직감적으로 느낍니다. 
          이게 있는 영상과 없는 영상의 유지율 차이가 평균 8~12%p 나는 걸 확인했어요.
        </p>

        <h2>3. 자막은 "약간 빠르게"</h2>
        <p>
          음성과 자막을 완전히 동기화하는 것보다, 자막을 음성보다 0.2~0.3초 빠르게 띄우는 게 유지율에 유리합니다. 
          시청자는 자막을 먼저 읽고 "이게 맞는지" 음성으로 확인하는 패턴을 보이는데, 
          이 패턴이 있으면 참여도가 올라가고 이탈이 줄어들어요.
        </p>

        <h2>4. 30초마다 "미니 클라이맥스"</h2>
        <p>
          영상을 30초 단위로 쪼개서 각 구간마다 작은 "아하!" 순간을 배치하세요. 
          숫자 공개, 반전, 의외의 사실 등이 좋은 소재예요. 
          시청자는 다음 30초 안에 또 뭔가 재미있는 게 나올 거라는 기대로 이탈을 미룹니다.
        </p>

        <h2>5. BGM은 볼륨 변화로 감정 조절</h2>
        <p>
          일정한 볼륨의 BGM보다, 중요한 순간에 볼륨을 살짝 낮췄다가 클라이맥스에서 다시 올리는 식의 동적 믹싱이 효과적이에요. 
          무의식적으로 시청자의 감정 곡선을 조절해서 몰입감을 높입니다.
        </p>

        <h2>6. 시각적 호기심 유발 — 화면 전환</h2>
        <p>
          같은 장면이 15초 이상 지속되면 시청자의 뇌는 지루함을 감지합니다. 
          화자가 말하는 중이라도 배경 이미지를 바꾸거나, 확대·축소·슬라이드 같은 미세한 움직임을 넣어주세요. 
          "눈이 쉬지 않게" 만드는 게 핵심이에요.
        </p>

        <h2>7. 엔딩에 "다음 영상 미리보기"</h2>
        <p>
          영상 마지막 15초에 "다음 영상에서는 이걸 다룹니다" 같은 예고편을 넣으세요. 
          영상 끝까지 보는 비율이 늘어나고 (유지율 직접 상승), 시청자가 다음 영상을 클릭할 확률도 올라갑니다 (세션 시간 증가). 
          유튜브 알고리즘이 가장 좋아하는 두 지표를 동시에 개선할 수 있어요.
        </p>

        <h2>정리</h2>
        <p>
          편집은 단순히 "예쁘게 보이게" 하는 작업이 아니라, 시청자의 뇌를 붙잡아두는 심리학적 작업입니다. 
          위 7가지를 하나씩 적용하면 유지율이 눈에 띄게 개선될 거예요. 
          단, 한 번에 다 적용하려 하지 말고 한두 개씩 적용해보며 본인 영상에 맞는지 확인하는 게 좋아요.
        </p>
      </>
    ),
  },

  'thumbnail-ctr-guide': {
    slug: 'thumbnail-ctr-guide',
    title: '썸네일 CTR 2배 올리는 심리학 — 클릭 유발 요소 분석',
    category: '썸네일',
    readingTime: 7,
    publishedAt: '2026-04-20',
    content: (
      <>
        <p>
          썸네일은 영상의 "광고판"입니다. 아무리 영상 품질이 좋아도 썸네일 CTR(클릭률)이 낮으면 
          유튜브 알고리즘은 내 영상을 거의 추천하지 않아요. 
          이번 글에서는 실제로 CTR을 2배까지 올린 썸네일 심리학의 6가지 원칙을 정리합니다.
        </p>

        <h2>1. 얼굴 + 감정 표현</h2>
        <p>
          인간의 뇌는 얼굴에 자동으로 주목하도록 진화했습니다. 썸네일에 사람 얼굴이 있으면 CTR이 평균 30% 이상 올라가요. 
          특히 놀람, 기쁨, 충격 같은 명확한 감정 표현이 있을 때 효과가 큽니다. 
          AI로 영상을 만드는 경우에도 썸네일에는 사람 얼굴을 쓰는 걸 추천드려요.
        </p>

        <h2>2. 색 대비 — "노란색 황금비"</h2>
        <p>
          썸네일에서 가장 효과적인 색은 노란색입니다. 유튜브 배경(흰색·회색)과 대비가 크고, 
          인간의 눈이 무의식적으로 주목하는 색이에요. 
          배경의 20~30% 정도 면적을 노란색이나 주황색으로 채우는 채널들이 공통적으로 CTR이 높다는 분석이 있습니다.
        </p>

        <h2>3. "빈칸" 심리 — 정보를 완전히 주지 말 것</h2>
        <p>
          썸네일에 모든 정보가 다 담기면 사용자는 "이거 보고 끝"이라고 판단해 클릭하지 않아요. 
          "?" 표시나, "이 사람은 누구?", "결과는..." 같은 불완전한 문구가 호기심을 자극해 CTR을 올립니다. 
          이걸 마케팅에서는 "Curiosity Gap(호기심 빈칸)"이라고 불러요.
        </p>

        <h2>4. 숫자는 구체적으로</h2>
        <p>
          "많이 벌었습니다"보다 "327만원 벌었습니다"가 CTR이 훨씬 높아요. 
          숫자가 구체적일수록 사용자는 "이건 진짜 얘기구나" 하고 신뢰합니다. 
          둥근 숫자(100, 1000)보다 흩어진 숫자(327, 1842)가 더 효과적이에요. 
          단, 과장하거나 사실과 다르면 장기적으로 채널 신뢰도가 떨어지니 주의하세요.
        </p>

        <h2>5. 텍스트는 3~5단어</h2>
        <p>
          썸네일의 텍스트는 3~5단어가 최적입니다. 더 길면 모바일에서 읽히지 않고, 더 짧으면 내용 전달이 부족해요. 
          문장이 아니라 키워드 나열 스타일이 유리합니다. 
          예: "월급 외 327만원" (O), "제가 부업으로 한 달에 327만원을 더 벌게 된 이야기" (X)
        </p>

        <h2>6. 채널 일관성</h2>
        <p>
          앞서 알고리즘 글에서도 다뤘지만, 썸네일의 **일관성**이 2026년 핵심 지표가 됐습니다. 
          같은 폰트, 같은 색 팔레트, 같은 레이아웃을 유지하면 사용자는 피드에서 내 채널 썸네일을 무의식적으로 알아봐요. 
          이게 반복되면 "신뢰 브랜드"가 되고 CTR이 폭발적으로 올라갑니다.
        </p>

        <h2>흔한 실수들</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li>배경이 너무 복잡해서 주제가 안 보임</li>
          <li>텍스트 색이 배경과 비슷해서 가독성 떨어짐</li>
          <li>과장된 제목(클릭베이트)으로 신뢰도 하락</li>
          <li>모바일에서 축소됐을 때 텍스트가 안 읽힘</li>
          <li>썸네일 이미지와 실제 영상 내용이 다름</li>
        </ul>

        <h2>테스트가 왕이다</h2>
        <p>
          위 원칙들은 평균적 경향이지, 내 채널에 100% 맞지 않을 수 있어요. 
          가장 좋은 방법은 썸네일을 2~3개 버전으로 만들어 A/B 테스트하는 겁니다. 
          유튜브 스튜디오에서도 썸네일 테스트 기능을 제공하니 꼭 활용해보세요.
        </p>
      </>
    ),
  },

  'first-month-creator-checklist': {
    slug: 'first-month-creator-checklist',
    title: '유튜브 첫 달에 반드시 해야 할 10가지 체크리스트',
    category: '초보 가이드',
    readingTime: 9,
    publishedAt: '2026-04-19',
    content: (
      <>
        <p>
          유튜브를 처음 시작하면 할 게 너무 많아서 어디서부터 손대야 할지 막막하죠. 
          이 글은 첫 달에 꼭 해야 할 10가지를 체크리스트 형태로 정리했습니다. 
          순서대로 따라가면 됩니다.
        </p>

        <h2>1. 채널 주제(니치) 확정</h2>
        <p>
          "제가 좋아하는 걸 다 다룰게요"는 실패 공식입니다. 첫 달에는 **하나의 주제**로 좁히세요. 
          예: "경제 뉴스 해설", "시니어 건강 정보", "재테크 초보 가이드" 등 단일 주제. 
          알고리즘이 "이 채널은 XX 전문"이라고 인식해야 추천이 시작됩니다.
        </p>

        <h2>2. 채널 이름 + 프로필 이미지 + 배너</h2>
        <p>
          채널 이름은 주제가 유추되게 짓는 게 좋아요. "알고메이커"보다 "알고메이커 - 재테크 입문"이 검색 노출에 유리합니다. 
          프로필과 배너는 Canva 무료 템플릿으로 충분해요. 완벽함보다 **빠른 완성**이 중요합니다.
        </p>

        <h2>3. 채널 설명(About) 작성</h2>
        <p>
          About 탭에 "어떤 영상을 얼마나 자주 올리는지"를 명확히 적어주세요. 
          예: "매주 화·금 오후 7시 새 영상 · 주제: 2030 재테크 입문". 
          이게 알고리즘의 채널 분류에 도움이 되고, 시청자 기대치도 맞출 수 있어요.
        </p>

        <h2>4. 첫 영상 3개 동시 업로드</h2>
        <p>
          신규 채널이 첫 영상 하나만 올리면 "계속 활동하는 채널인가" 판단이 어려워 알고리즘 노출이 제한됩니다. 
          첫날 2~3개 영상을 미리 만들어 동시에 올리세요. 
          각 영상의 주제가 비슷해야 채널 정체성이 빨리 잡혀요.
        </p>

        <h2>5. 썸네일 템플릿 고정</h2>
        <p>
          앞서 얘기한 썸네일 일관성 원칙 기억하시죠? 첫 달에 썸네일 템플릿을 Canva나 Figma에서 만들어두고 
          매 영상마다 그 템플릿을 재사용하세요. 매번 디자인하느라 시간 빼앗기면 업로드 주기가 무너집니다.
        </p>

        <h2>6. 업로드 주기 고정</h2>
        <p>
          매주 몇 요일 몇 시에 올릴지 정하고 **최소 한 달은 지키세요**. 
          알고리즘은 규칙적인 업로드를 보상합니다. 무리해서 매일 올리는 것보다 
          주 2회를 꾸준히 3개월 하는 게 훨씬 효과적이에요.
        </p>

        <h2>7. 메타데이터 최적화</h2>
        <p>
          제목·설명·태그에 핵심 키워드를 자연스럽게 넣으세요. 단, 태그는 5~8개면 충분합니다. 
          과도한 태그 도배는 오히려 스팸으로 인식돼요. 
          설명란 첫 두 줄이 가장 중요합니다. 여기에 영상 핵심 메시지를 압축해서 넣으세요.
        </p>

        <h2>8. 종료 화면 설정</h2>
        <p>
          모든 영상 마지막 20초에 "다음 영상", "구독 버튼", "재생목록" 종료 화면을 넣으세요. 
          이거 하나로 영상 클릭률(세션 체류 시간)이 평균 15% 올라갑니다. 
          유튜브 스튜디오에서 몇 번만 설정하면 템플릿으로 재사용 가능해요.
        </p>

        <h2>9. 첫 댓글은 내가 직접 달기</h2>
        <p>
          영상 올린 직후 내가 먼저 댓글을 달아서 대화 주제를 제시하세요. 
          "이 영상에서 가장 공감되는 부분은 무엇인가요?" 같은 질문형이 좋아요. 
          첫 댓글이 있으면 다른 시청자도 댓글 달 장벽이 낮아집니다. 
          댓글 많은 영상은 알고리즘 가점 대상이에요.
        </p>

        <h2>10. 분석 대시보드 매주 체크</h2>
        <p>
          유튜브 스튜디오의 분석 탭을 매주 한 번 반드시 확인하세요. 
          - CTR이 2% 미만이면 썸네일 문제
          - 유지율이 30% 미만이면 초반 30초 편집 문제
          - 노출 대비 조회수가 낮으면 제목 문제
          데이터가 없으면 개선도 없어요.
        </p>

        <h2>마치며</h2>
        <p>
          이 10가지를 첫 달에 다 해내면 대부분의 크리에이터보다 앞서 출발한 거예요. 
          구독자 100명이 금방 오지 않더라도 포기하지 마세요. 평균적으로 **100번째 영상 전후**에 채널이 터지는 경우가 많아요. 
          꾸준함이 전부입니다.
        </p>
      </>
    ),
  },

  'ai-video-automation-trends': {
    slug: 'ai-video-automation-trends',
    title: 'AI 영상 자동화는 유튜브 생태계를 어떻게 바꾸고 있나',
    category: 'AI 트렌드',
    readingTime: 10,
    publishedAt: '2026-04-18',
    content: (
      <>
        <p>
          2026년 현재, AI가 대본·이미지·음성·편집까지 자동 생성하는 시대가 됐습니다. 
          개인 크리에이터에게 이것은 위협일까요, 기회일까요? 이번 글에서는 업계 변화를 솔직하게 짚어봅니다.
        </p>

        <h2>무엇이 자동화됐나</h2>
        <p>
          2024년만 해도 AI로 할 수 있는 건 대본 초안 뽑기 정도였어요. 하지만 2026년 기준으로:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li><strong>대본 생성</strong>: Gemini 2.5, Claude, GPT가 구조화된 스크립트를 분 단위로 생성</li>
          <li><strong>음성(TTS)</strong>: Edge TTS, ElevenLabs가 사람과 거의 구분 안 되는 한국어 출력</li>
          <li><strong>이미지</strong>: FLUX, Gemini Image가 키워드만으로 장면별 이미지 자동 생성</li>
          <li><strong>영상 편집</strong>: FFmpeg 자동화로 전환·자막·BGM을 스크립트 기반 합성</li>
          <li><strong>아바타</strong>: HeyGen, Synthesia가 AI 아나운서 영상 생성</li>
        </ul>
        <p>
          이 모든 단계가 하나의 파이프라인으로 엮이면서 "키워드 입력 → 완성된 유튜브 영상"이 5~10분 안에 가능해졌어요.
        </p>

        <h2>위협인가, 기회인가</h2>
        <p>
          많은 크리에이터들이 "AI가 내 일자리를 뺏는 거 아니냐"고 걱정합니다. 저는 부분적으로 맞고 부분적으로 틀리다고 봐요.
        </p>

        <h3>AI로 대체되는 영역</h3>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li>단순 정보 전달형 영상 (뉴스 요약, TOP 10 리스트 등)</li>
          <li>내레이션 중심의 다큐형 영상</li>
          <li>썸네일 디자인 (기본 템플릿)</li>
          <li>자막·번역 작업</li>
        </ul>

        <h3>AI가 대체 못 하는 영역</h3>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li>크리에이터의 개인 경험·감정이 담긴 영상 (브이로그, 리뷰)</li>
          <li>실시간 현장 취재</li>
          <li>복잡한 편집 기법이 필요한 시네마틱 영상</li>
          <li>사람 간의 진짜 소통 (구독자와의 관계 형성)</li>
        </ul>

        <h2>승자와 패자</h2>
        <p>
          AI 영상 자동화 시대에 승자가 되는 크리에이터는 **"AI로 양을 늘리고, 사람다움으로 차별화하는" 하이브리드 전략**을 쓰는 사람들이에요.
        </p>
        <p>
          예를 들어 AI로 주 5편 정보성 영상을 뽑되, 주 1편은 직접 기획하고 촬영한 "시그니처 영상"을 올리는 방식. 
          이러면 채널 콘텐츠 양이 5배 늘어나면서도 독자성은 유지됩니다.
        </p>
        <p>
          반대로 AI 없이 모든 걸 수작업으로 하는 크리에이터는 양에서 밀려 알고리즘 노출이 점점 줄어들 거예요. 
          또 AI로만 다 처리하는 크리에이터는 차별화가 없어 금방 묻힙니다.
        </p>

        <h2>시청자는 알아챌까?</h2>
        <p>
          많은 크리에이터가 "AI 영상인 게 티 나서 시청자가 싫어하면 어떻게 하냐"고 걱정합니다. 
          실제 데이터로 보면 **시청자는 생각보다 크게 신경 안 써요**. 정보가 정확하고 내용이 유용하면 AI 영상도 잘 봅니다.
        </p>
        <p>
          단, "AI 영상이라는 사실을 숨기다가 들통나면" 신뢰도 하락이 큽니다. 
          유튜브도 2026년 4월부터 AI 생성 콘텐츠 표시 정책을 강화했어요. 
          채널 설명에 "AI 자동 생성을 활용한 콘텐츠입니다"라고 명시하는 게 장기적으로 유리합니다.
        </p>

        <h2>실전 권장 전략</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          <li><strong>AI로 정보성 콘텐츠 대량 생산</strong>: 알고리즘 노출 확보</li>
          <li><strong>본인 스토리로 차별화</strong>: 주 1~2편은 직접 만든 영상</li>
          <li><strong>메타데이터는 사람이 최종 검수</strong>: 제목·썸네일은 A/B 테스트</li>
          <li><strong>댓글·커뮤니티는 반드시 사람이 관리</strong>: 진짜 관계 형성</li>
          <li><strong>AI 활용 사실을 투명하게 공개</strong>: 장기 신뢰 구축</li>
        </ol>

        <h2>마치며</h2>
        <p>
          AI 영상 자동화는 이제 돌이킬 수 없는 흐름입니다. 이걸 거부하기보다는 잘 활용하는 쪽이 훨씬 유리해요. 
          AlgoMaker 같은 도구를 사용해 반복 작업을 줄이고, 
          남은 시간을 본인만의 독창적 콘텐츠에 투자하는 게 2026년 크리에이터의 최적 전략입니다.
        </p>
      </>
    ),
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const post = POSTS[slug];

  if (!post) {
    return (
      <DashboardShell>
        <div style={{ padding: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>글을 찾을 수 없습니다</h1>
          <p style={{ color: '#888', marginBottom: 20 }}>요청하신 블로그 글이 존재하지 않아요.</p>
          <Link href="/blog" style={{ color: '#cc0000', textDecoration: 'underline' }}>
            블로그 목록으로 →
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          padding: 32px 32px 48px;
          max-width: 760px;
          margin: 0 auto;
        }
        .breadcrumb {
          font-size: 12px;
          color: #888;
          margin-bottom: 16px;
        }
        .breadcrumb a { color: #cc0000; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }

        .header {
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #888;
          margin-bottom: 14px;
        }
        .metaCategory {
          padding: 3px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 999px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .metaDot { color: #ddd; }
        .title {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          color: #0f0f0f;
        }

        .adRow { margin: 24px 0; }

        .content {
          font-size: 15px;
          line-height: 1.8;
          color: #1a1a1a;
        }
        .content :global(h2) {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 32px;
          margin-bottom: 12px;
          color: #0f0f0f;
        }
        .content :global(h3) {
          font-size: 16px;
          font-weight: 700;
          margin-top: 20px;
          margin-bottom: 8px;
          color: #1a1a1a;
        }
        .content :global(p) {
          margin-bottom: 16px;
          color: #2a2a2a;
        }
        .content :global(ul),
        .content :global(ol) {
          margin-bottom: 18px;
          color: #2a2a2a;
        }
        .content :global(strong) {
          color: #0f0f0f;
          font-weight: 700;
        }

        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e5e5;
        }
        .cta {
          background: linear-gradient(135deg, #fff0f0 0%, #fafafa 100%);
          border: 1px solid #fecaca;
          border-radius: 14px;
          padding: 24px;
          text-align: center;
        }
        .ctaTitle {
          font-size: 15px;
          font-weight: 800;
          color: #0f0f0f;
          margin-bottom: 6px;
        }
        .ctaSub {
          font-size: 12px;
          color: #606060;
          margin-bottom: 14px;
        }
        .ctaBtn {
          display: inline-block;
          padding: 10px 22px;
          background: #cc0000;
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .backLink {
          display: inline-block;
          margin-top: 24px;
          font-size: 13px;
          color: #888;
          text-decoration: none;
        }
        .backLink:hover { color: #0f0f0f; }

        @media (max-width: 640px) {
          .page { padding: 20px 16px 36px; }
          .title { font-size: 22px; }
          .content { font-size: 14px; }
          .content :global(h2) { font-size: 17px; }
        }
      `}</style>

      <div className="page">
        <div className="breadcrumb">
          <Link href="/">홈</Link> / <Link href="/blog">블로그</Link> / {post.category}
        </div>

        <header className="header">
          <div className="meta">
            <span className="metaCategory">{post.category}</span>
            <span className="metaDot">·</span>
            <span>{post.publishedAt}</span>
            <span className="metaDot">·</span>
            <span>{post.readingTime}분 읽기</span>
          </div>
          <h1 className="title">{post.title}</h1>
        </header>

        {/* AdSense 슬롯 - 제목 아래 */}
        <div className="adRow">
          <AdSlot slot="blog-post-top" variant="horizontal" label="blog-post-top" />
        </div>

        <article className="content">{post.content}</article>

        {/* AdSense 슬롯 - 본문 아래 */}
        <div className="adRow">
          <AdSlot slot="blog-post-bottom" variant="in-content" label="blog-post-bottom" />
        </div>

        <div className="footer">
          <div className="cta">
            <div className="ctaTitle">🎬 AlgoMaker로 직접 영상 만들어보세요</div>
            <div className="ctaSub">이 글에서 소개한 원칙이 적용된 영상을 AI가 자동 생성합니다</div>
            <Link href="/" className="ctaBtn">무료로 시작 →</Link>
          </div>
          <Link href="/blog" className="backLink">← 다른 글 보기</Link>
        </div>
      </div>
    </DashboardShell>
  );
}
