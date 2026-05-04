'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '영상 편집 무료 앱 추천 — 초보도 5분만에 끝내는 편집',
  description: '핸드폰만으로 영상 편집할 수 있는 무료 앱 4개 비교. CapCut, VLLO, KineMaster, InShot 장단점.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: {
    '@type': 'Organization',
    name: 'AlgoMaker',
    url: 'https://nutube.kr',
  },
  inLanguage: 'ko',
};

export default function FreeEditingAppsGuide() {
  return (
    <V11Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #c2410c; margin-bottom: 8px; text-transform: uppercase; }
        .guide-h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.3; margin: 0 0 12px; word-break: keep-all; }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle { font-size: 17px; color: #525252; margin: 0 0 24px; line-height: 1.6; word-break: keep-all; }
        .guide-meta { display: flex; gap: 12px; font-size: 14px; color: #737373; padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px; flex-wrap: wrap; }
        .guide h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 { font-size: 19px; font-weight: 700; letter-spacing: -0.015em; margin: 24px 0 10px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout { padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24; margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all; }
        .guide-formula { padding: 16px 18px; background: #0a0a0a; color: #ffffff; margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace; font-size: 15px; line-height: 1.7; word-break: keep-all; }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta { margin-top: 36px; padding: 20px; background: #fafafa; border: 1px solid #e5e5e5; text-align: center; }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn { display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 영상 제작 · 도구</div>
        <h1 className="guide-h1">영상 편집 무료 앱 4개 비교</h1>
        <p className="guide-subtitle">
          핸드폰만으로 영상 편집할 수 있습니다. 비싼 프로그램 살 필요 없습니다.
          무료 앱 4개 (CapCut, VLLO, KineMaster, InShot) 솔직 비교.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span>
          <span>·</span>
          <span>⏱ 8분</span>
          <span>·</span>
          <span>🛠 도구</span>
        </div>

        <p>
          영상 편집 시작하실 때 가장 큰 고민이 "어떤 프로그램 써야 하지?" 입니다.
          PC용 프리미어, 파이널컷 같은 비싼 프로그램 안 사셔도 됩니다.
          핸드폰 무료 앱만으로도 충분히 좋은 영상을 만들 수 있습니다.
        </p>

        <p>
          가장 인기 있는 무료 앱 4개를 비교해 드립니다.
        </p>

        <h2>1. CapCut — 초보 1순위 추천</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>무료가 진짜 무료:</strong> 워터마크 없음, 시간 제한 없음</li>
          <li><strong>한국어 100% 지원:</strong> 메뉴 다 한글</li>
          <li><strong>직관적 인터페이스:</strong> 첫 사용에도 5분이면 익숙해짐</li>
          <li><strong>AI 자동 자막:</strong> 음성 → 자막 자동 변환</li>
          <li><strong>다양한 효과·필터:</strong> 트렌디한 효과 많음</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>일부 고급 기능은 유료 (CapCut Pro)</li>
          <li>틱톡과 같은 회사라 정치적 이슈 시 변동 가능성</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          처음 영상 편집 하시는 분, 시니어/초보, 예능·일상 브이로그 만드시는 분.
          가장 무난한 선택입니다.
        </p>

        <h2>2. VLLO — 깔끔한 편집 1순위</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>한국 회사 (블로(VLLO)):</strong> 한국 사용자 친화적</li>
          <li><strong>워터마크 없음:</strong> 무료 버전도 워터마크 X</li>
          <li><strong>심플한 디자인:</strong> 효과 적지만 깔끔함</li>
          <li><strong>BGM 무료 제공:</strong> 저작권 무료 음악 풍부</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>일부 기능 유료 (월 결제)</li>
          <li>화려한 효과는 적음 (CapCut에 비해)</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          깔끔하고 차분한 영상 만드시는 분, 정보 전달 영상, 시니어 친화 채널.
          요리/부동산/건강 채널에 잘 어울립니다.
        </p>

        <h2>3. KineMaster (키네마스터) — 한국 1세대</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>한국 회사:</strong> 가장 오래된 한국 영상 편집 앱</li>
          <li><strong>전문 기능 많음:</strong> 다중 트랙, 정밀 편집 가능</li>
          <li><strong>커뮤니티 크다:</strong> 유튜브에 강좌 많음</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li><strong>무료 버전 워터마크:</strong> 영상 우상단에 KineMaster 로고</li>
          <li><strong>월 결제 필요 (워터마크 제거):</strong> 약 5,500원/월</li>
          <li>인터페이스 복잡함 (초보 어려움)</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          영상 편집 진지하게 하실 분. 월 구독료 부담 없으면 추천.
          전문가급 편집 가능합니다.
        </p>

        <h2>4. InShot — 인스타·쇼츠 특화</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>인스타·쇼츠 비율 자동:</strong> 9:16 세로 영상 편집 최적화</li>
          <li><strong>간단한 효과:</strong> 빠르게 영상 만들기 좋음</li>
          <li><strong>가벼움:</strong> 핸드폰 부담 적음</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li><strong>무료 버전 워터마크:</strong> 영상 끝에 InShot 로고</li>
          <li>일반 16:9 유튜브 영상에는 기능 부족</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          인스타그램 릴스, 유튜브 쇼츠 위주로 만드실 분. 짧은 영상 전문.
        </p>

        <h2>한 눈에 보는 비교</h2>

        <div className="guide-formula">
          <strong>CapCut:</strong>     초보 ★★★★★ / 무료 ★★★★★ / 효과 ★★★★★<br />
          <strong>VLLO:</strong>       초보 ★★★★☆ / 무료 ★★★★☆ / 깔끔 ★★★★★<br />
          <strong>KineMaster:</strong> 초보 ★★☆☆☆ / 무료 ★★☆☆☆ / 전문 ★★★★★<br />
          <strong>InShot:</strong>     초보 ★★★★☆ / 무료 ★★★☆☆ / 쇼츠 ★★★★★
        </div>

        <h2>처음 시작하시는 분께 — CapCut 추천</h2>

        <p>
          여러 가지 다 써보시면 좋지만, 시간 아끼고 싶으시면 CapCut 으로
          시작하세요. 무료가 진짜 무료고, 한국어 완벽하고, 5분 안에 사용법 익힙니다.
        </p>

        <h3>CapCut 빠른 시작 5분 가이드</h3>

        <ol>
          <li><strong>설치:</strong> 앱스토어/플레이스토어에서 "CapCut" 검색</li>
          <li><strong>새 프로젝트:</strong> 앱 열고 "+ 새 프로젝트" 누르기</li>
          <li><strong>영상 선택:</strong> 갤러리에서 영상 클립 선택</li>
          <li><strong>편집:</strong> 자르기, 자막, 음악 추가</li>
          <li><strong>내보내기:</strong> 우측 상단 "내보내기" 누르기 (1080p 추천)</li>
        </ol>

        <h2>편집 시간 단축하는 3가지 팁</h2>

        <ul>
          <li><strong>AI 자동 자막 활용:</strong> 음성을 자동으로 자막으로 변환. 직접 타이핑 X.</li>
          <li><strong>템플릿 활용:</strong> 처음에는 템플릿 1개 골라서 그대로 따라하세요.</li>
          <li><strong>10분 영상은 30분 안에:</strong> 처음에는 영상 1분당 3분 편집이 적당.</li>
        </ul>

        <div className="guide-callout">
          💡 편집은 "빠르게 → 자주" 가 정답입니다. 1편을 3시간 편집하지 마시고,
          30분에 끝낸 영상을 매주 1편씩 올리세요.
        </div>

        <h2>처음 한 달, 편집보다 중요한 것</h2>

        <p>
          유튜브를 시작하시는 분들이 가장 많이 하는 실수가 편집에 너무 많은 시간을
          쓰는 일입니다. 화려한 효과, 정교한 자막, 멋진 인트로에 집착하다가
          한 달에 영상 1개 올리고 지쳐서 포기하시는 분이 많습니다.
        </p>

        <p>
          알고리즘은 <strong>꾸준한 업로드</strong>를 가장 중요하게 봅니다.
          편집이 어설퍼도 매주 1~2편씩 꾸준히 올리는 채널이,
          완벽한 영상을 한 달에 1편 올리는 채널보다 훨씬 빨리 성장합니다.
        </p>

        <p>
          처음 3개월은 편집 시간을 30분 안에 끝내는 것을 목표로 하세요.
          영상 1편당 30분이면 일주일에 3~4편도 만들 수 있습니다.
          그렇게 영상이 쌓이면 알고리즘이 채널을 인식하기 시작합니다.
        </p>

        <h2>편집 도구별 강점 정리</h2>

        <p>
          위 4가지 앱은 모두 무료로 시작하실 수 있고, 핸드폰에서 바로 편집 가능합니다.
          처음에는 CapCut으로 시작하시되, 채널이 어느 정도 성장하면
          본인의 편집 스타일에 맞는 도구로 옮기시면 됩니다. 영상 만들기에 익숙해지면
          어떤 도구를 써도 비슷하게 결과물이 나옵니다.
        </p>

        <h2>마치며</h2>

        <p>
          편집 도구는 무기일 뿐 본질이 아닙니다. 시청자가 보는 것은
          편집의 화려함이 아니라 <strong>영상의 내용과 진정성</strong>입니다.
          무료 도구로도 충분히 좋은 영상을 만들 수 있습니다.
          처음에는 가장 쉬운 CapCut으로 시작해서, 매주 1~2편씩 꾸준히 올려보세요.
          편집 실력은 자연스럽게 늘어납니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/phone-shooting" style={{ color: '#c2410c' }}>핸드폰만으로 영상 잘 찍는 법</Link></li>
            <li><Link href="/blog/camera-anxiety" style={{ color: '#c2410c' }}>카메라 울렁증 극복하기</Link></li>
            <li><Link href="/blog/algorithm-mindset" style={{ color: '#c2410c' }}>6개월간 떡상이 안 와도 버티는 멘탈 관리</Link></li>
          </ul>
        </div>
      </article>
    </V11Shell>
  );
}
