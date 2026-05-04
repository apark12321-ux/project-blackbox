'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '첫 100명 구독자 모으는 실전 전략 — 처음 시작하시는 분들께',
  description: '첫 100명 구독자가 가장 어렵습니다. 30일 안에 100명 모으는 실전 5단계 전략과 흔한 실수.',
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

export default function First100SubsGuide() {
  return (
    <V18Shell>
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
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 32px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 14px; color: #737373;
          padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .guide h2 {
          font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 {
          font-size: 19px; font-weight: 700; letter-spacing: -0.015em;
          margin: 24px 0 10px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout {
          padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24;
          margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all;
        }
        .guide-formula {
          padding: 16px 18px; background: #0a0a0a; color: #ffffff;
          margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 15px; line-height: 1.7; word-break: keep-all;
        }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta {
          margin-top: 36px; padding: 20px; background: #fafafa;
          border: 1px solid #e5e5e5; text-align: center;
        }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn {
          display: inline-block; padding: 12px 24px; background: #0a0a0a;
          color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700;
        }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 채널 운영 · 입문</div>
        <h1 className="guide-h1">첫 100명 구독자 모으는 실전 전략</h1>
        <p className="guide-subtitle">
          처음 100명이 가장 어렵습니다. 100명을 넘기시면 채널 성장이
          급격히 빨라집니다. 30일 안에 첫 100명 모으는 5단계 전략과 흔한 실수.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span>
          <span>·</span>
          <span>⏱ 9분</span>
          <span>·</span>
          <span>📊 채널 운영</span>
        </div>

        <p>
          유튜브를 처음 시작하시는 분들이 가장 많이 좌절하는 순간이
          "구독자 10명, 30명에서 멈춤" 입니다. 정성을 다해 영상을 만들었는데
          반응이 없으면 그만두고 싶어집니다.
        </p>

        <p>
          그런데 신기하게도 100명을 넘기시면 그 후로는 알고리즘이
          채널을 알아보기 시작합니다. 100명이 가장 어렵고, 그 다음은 비교적 쉽습니다.
          30일 안에 첫 100명을 모으는 실전 5단계를 정리합니다.
        </p>

        <h2>1단계: 채널 정체성 정하기 (1일 차)</h2>

        <p>
          가장 흔한 실수가 "이것저것 다 올리기" 입니다. 요리 영상도 올리고,
          여행 영상도 올리고, 일상 브이로그도 올리는 방식이죠. 알고리즘이
          채널의 정체성을 파악하지 못하면 누구에게 추천해야 할지 모릅니다.
        </p>

        <h3>한 가지 주제 선택</h3>

        <p>
          처음 30일은 한 가지 주제만 다루세요. 100명이 모일 때까지
          다른 주제는 미루시는 게 좋습니다.
        </p>

        <div className="guide-formula">
          ▍ 채널 정체성 3요소<br /><br />
          <strong>분야:</strong> 무엇을 다룰까? (요리, 부동산, 건강 등)<br />
          <strong>타겟:</strong> 누구를 위한 채널? (50대 자취인, 신혼부부 등)<br />
          <strong>차별점:</strong> 다른 채널과 무엇이 다를까? (실패담 공유, 가격 공개 등)
        </div>

        <h2>2단계: 첫 5편 한 번에 기획 (2~3일 차)</h2>

        <p>
          영상 1편 만들고 반응을 본 다음에 다음 영상 만드는 방식은
          오래 못 갑니다. 첫 5편을 한 번에 기획하시는 게 좋습니다.
        </p>

        <h3>5편 기획 공식</h3>

        <ul>
          <li><strong>1편: 입문자를 위한 기초:</strong> 채널 분야의 가장 기본적인 내용. 검색량이 많은 키워드.</li>
          <li><strong>2편: 흔한 실수 정리:</strong> "○○ 안 하면 후회하는 5가지" 형식. 클릭률이 높습니다.</li>
          <li><strong>3편: 본인 경험담:</strong> 본인이 겪은 실패나 성공 이야기. 신뢰도 구축.</li>
          <li><strong>4편: 비교/리뷰:</strong> "A vs B 비교" 형식. 시청 시간이 깁니다.</li>
          <li><strong>5편: 실전 활용:</strong> 시청자가 바로 따라할 수 있는 실전 가이드.</li>
        </ul>

        <div className="guide-callout">
          💡 첫 5편을 한 번에 기획하면 일관성이 생기고, 시청자가
          "이 채널은 ○○ 분야 전문이구나" 인식하기 쉽습니다.
        </div>

        <h2>3단계: 매주 같은 요일·시간 업로드 (4~28일 차)</h2>

        <p>
          유튜브 알고리즘은 "꾸준한 채널" 을 좋아합니다.
          매주 1편씩 같은 요일·시간에 올리는 게 핵심입니다.
        </p>

        <h3>요일 선택</h3>

        <p>
          시청자의 라이프스타일에 맞춰 요일을 정하세요.
        </p>

        <ul>
          <li><strong>직장인 대상:</strong> 금요일 저녁 7시 또는 토요일 오전 (퇴근/주말)</li>
          <li><strong>주부 대상:</strong> 화/수/목 오전 10시 (가사 끝낸 후)</li>
          <li><strong>5060 시니어 대상:</strong> 일요일 아침 7시 또는 평일 오후 2시</li>
        </ul>

        <h3>꾸준함의 힘</h3>

        <p>
          "매주 ○요일 ○시 업로드" 라는 약속을 지키면 시청자가
          그 시간에 알아서 찾아옵니다. 이것이 첫 100명을 모으는
          가장 강력한 무기입니다.
        </p>

        <h2>4단계: 첫 댓글 1개를 VIP처럼 (5일 차~)</h2>

        <p>
          첫 댓글이 달리면 그 사람을 절대 놓치지 마세요.
          그 한 명이 다음 영상의 첫 시청자가 되고, 댓글을 달아주고,
          주변에 영상을 공유해주는 진정한 팬이 됩니다.
        </p>

        <h3>첫 댓글 응대법</h3>

        <ol>
          <li><strong>10분 안에 답글:</strong> 빠르게 답글 달면 시청자가 감동합니다.</li>
          <li><strong>이름 부르기:</strong> "○○님" 처럼 이름을 불러주세요.</li>
          <li><strong>구체적 답변:</strong> "감사합니다" 만 X. 댓글 내용에 맞춰 구체적으로.</li>
          <li><strong>다음 영상에서 언급:</strong> "지난 영상에 ○○님이 ××에 대해 물어보셨는데..."</li>
        </ol>

        <div className="guide-callout">
          💡 댓글 1개의 가치는 조회수 100회와 맞먹습니다.
          알고리즘이 "참여도 높은 영상" 으로 분류합니다.
        </div>

        <h2>5단계: 30일째 분석 + 전환 (29~30일 차)</h2>

        <p>
          30일이 지나도 100명이 안 되면 분석이 필요합니다.
          유튜브 스튜디오 → 분석 메뉴에서 다음을 확인하세요.
        </p>

        <h3>핵심 지표 3가지</h3>

        <ul>
          <li><strong>노출 클릭률 (CTR):</strong> 5% 미만이면 썸네일과 제목이 매력 부족. 개선 필요.</li>
          <li><strong>평균 시청 지속 시간:</strong> 50% 미만이면 영상 초반이 지루함. 첫 30초 개선.</li>
          <li><strong>구독자 전환율:</strong> 영상 본 사람 중 구독한 비율. 1% 미만이면 채널 정체성이 모호함.</li>
        </ul>

        <h2>흔한 실수 5가지</h2>

        <ol>
          <li><strong>완벽 추구:</strong> 영상 1편을 한 달 만들기 X. "70점 영상 매주" 가 "100점 영상 한 달" 보다 효과적.</li>
          <li><strong>비싼 장비 사기:</strong> 핸드폰 1대로 충분. 100명 모은 후 장비 업그레이드.</li>
          <li><strong>인기 주제 따라하기:</strong> 본인 잘 아는 분야 X 인기 분야 → 영상 품질 떨어짐.</li>
          <li><strong>썸네일 한 글자 폰트:</strong> 모바일에서 안 보임. 5~7글자 큰 글씨가 효과적.</li>
          <li><strong>구독·좋아요 강요:</strong> "구독 안 하면 손해!" 같은 말은 시청자 반감. 자연스럽게.</li>
        </ol>

        <h2>정리 — 30일 100명 로드맵</h2>

        <div className="guide-formula">
          1일 차: 채널 정체성 3요소 정하기<br />
          2~3일: 첫 5편 한 번에 기획<br />
          4~28일: 매주 같은 요일·시간 업로드 (총 4편)<br />
          5일 차~: 댓글 VIP 응대<br />
          29~30일: 분석 + 다음 30일 계획
        </div>

        <p>
          꾸준함과 분석이 핵심입니다. 100명만 넘기시면 그 후는
          비교적 쉽습니다. 알고리즘이 채널을 추천하기 시작하기 때문입니다.
        </p>


        <h2>첫 100명까지의 진짜 의미</h2>
        <p>
          첫 100명 구독자는 단순한 숫자가 아닙니다. 그 100명이 본인 채널의 핵심 팬이 됩니다.
          댓글, 좋아요, 공유로 채널을 알고리즘에게 알려주는 사람들입니다.
          그래서 처음 100명까지는 모든 댓글에 답글 달고 진심으로 소통하세요.
        </p>
        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/algorithm-mindset" style={{ color: "#c2410c" }}>멘탈 관리</Link></li>
            <li><Link href="/blog/algorithm-seo" style={{ color: "#c2410c" }}>SEO 전략</Link></li>
            <li><Link href="/blog/youtube-start" style={{ color: "#c2410c" }}>유튜브 시작 가이드</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
