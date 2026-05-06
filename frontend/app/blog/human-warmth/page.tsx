'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function HumanWarmthGuide() {
  return (
    <V18Shell>
      <style jsx>{`
        .guide-layout {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .guide-layout { grid-template-columns: 1fr; padding: 24px 20px 50px; gap: 20px; }
        }
        @media (max-width: 600px) {
          .guide-layout { padding: 20px 16px 50px; }
        }
        .toc-wrapper { display: block; }
        @media (max-width: 900px) {
          .toc-wrapper { display: none; }
        }
        .guide {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.75;
          letter-spacing: -0.01em;
          max-width: 720px;
        }
        .guide-kicker {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.028em;
          line-height: 1.2;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 26px; line-height: 1.25; }
        }
        .guide-subtitle {
          font-size: 16px;
          color: #525252;
          margin: 0 0 24px;
          line-height: 1.65;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-subtitle { font-size: 14px; }
        }
        .guide-meta {
          display: flex;
          gap: 14px;
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          color: #a3a3a3;
          padding-bottom: 20px;
          border-bottom: 0.5px solid #e5e5e5;
          margin-bottom: 32px;
          flex-wrap: wrap;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .guide h2 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.022em;
          line-height: 1.3;
          margin: 44px 0 16px;
          padding-top: 8px;
          word-break: keep-all;
          scroll-margin-top: 80px;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 21px; margin: 32px 0 14px; }
        }
        .guide h3 {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.018em;
          margin: 26px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 17px; }
        }
        .guide p {
          font-size: 17px;
          margin: 0 0 16px;
          word-break: keep-all;
          line-height: 1.75;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 16px; }
        }
        .guide ul, .guide ol {
          padding-left: 24px;
          margin: 10px 0 20px;
        }
        .guide li {
          font-size: 17px;
          margin-bottom: 8px;
          line-height: 1.65;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 16px; }
        }
        .guide strong { font-weight: 700; color: #0a0a0a; }
        .guide-callout {
          padding: 14px 18px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 18px 0;
          font-size: 16px;
          line-height: 1.65;
          color: #78350f;
          word-break: keep-all;
        }
        .guide-quote {
          padding: 20px 24px;
          background: #fafafa;
          border-left: 4px solid #0a0a0a;
          margin: 24px 0;
          font-size: 17px;
          line-height: 1.7;
          color: #404040;
          word-break: keep-all;
          font-style: italic;
        }
        .guide-quote strong { color: #0a0a0a; font-style: normal; }
        .guide-section {
          padding: 18px 22px;
          background: #fff7ed;
          border-left: 3px solid #c2410c;
          margin: 24px 0;
          word-break: keep-all;
        }
        .guide-section h3 { margin-top: 0; }
        .guide-back {
          display: inline-block;
          margin-bottom: 18px;
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          color: #737373;
          text-decoration: none;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <div className="post-wrapper">

        <article className="guide">
          <Link href="/blog" className="guide-back">← BACK TO GUIDES</Link>

          <div className="guide-kicker">CHANNEL · INSIGHT</div>
          <h1 className="guide-h1">AI 시대, 유튜버가 잃지 말아야 할 인간의 온도</h1>
          <p className="guide-subtitle">
            AI는 빠르고 유창하지만 흉내 낼 수 없는 것이 있습니다.
            시청자가 진짜 원하는 것은 완벽한 정보가 아닐지도 모릅니다.
          </p>

          <div className="guide-meta">
            <span>2026.05.04</span><span>·</span>
            <span>CHANNEL</span>
          </div>

          <p>
            최근 한 영상이 243만 회 이상 조회됐습니다. 제목은 '<strong>AI는 못하는 인간만이 가진 아름다운 침묵과 망설임</strong>'.
            영상은 한 뉴스 앵커가 故 노회찬 전 의원의 부고를 전하다가 약 20초간 말을 잇지 못하고 침묵했던 장면을 인용합니다.
            방송 사고처럼 보이는 그 20초가 시청자에게는 가장 깊은 위로가 되었다는 이야기입니다.
          </p>

          <p>
            이 영상이 던지는 질문은 분명합니다.
            <strong>AI가 모든 것을 더 빠르고 유창하게 처리하는 시대에, 인간 유튜버는 무엇으로 차별화될 수 있는가?</strong>
          </p>

          <h2 id="sec-1">1. AI가 절대 못 만드는 콘텐츠 3가지</h2>

          <p>
            ChatGPT는 시나리오를 5초 만에 작성합니다. Sora는 영상을 한 줄 명령으로 만듭니다.
            이 시대에 인간 유튜버가 살아남는 길은 단 하나입니다.
            <strong>AI가 절대 만들 수 없는 콘텐츠를 만드는 것.</strong>
          </p>

          <h3>① 직접 살아낸 경험담</h3>
          <p>
            AI는 학습한 데이터로 글을 씁니다. 하지만 "내가 50년 전 어머니께 마지막으로 들었던 말"은 학습할 수 없습니다.
            시니어 사연 쇼츠가 200만 조회수를 넘기는 이유, 후회담 영상이 알고리즘에 강한 이유가 여기에 있습니다.
            <strong>경험은 데이터가 아니라 삶이기 때문</strong>입니다.
          </p>

          <h3>② 망설임이 담긴 진실</h3>
          <p>
            AI는 망설이지 않습니다. 항상 자신감 있는 톤으로 답을 제시합니다.
            반면 인간은 모를 때 모른다고 말하고, 슬플 때 말을 잇지 못합니다.
            <strong>이 망설임이 시청자에게는 진실의 신호</strong>입니다.
          </p>

          <h3>③ 시청자와 같은 시간을 통과한 흔적</h3>
          <p>
            AI는 시간을 살지 않습니다. 데이터로 시대를 압니다.
            하지만 인간 유튜버는 시청자와 같은 뉴스를 보고, 같은 계절을 통과합니다.
            영상 끝에 "오늘 비 오시네요" 한 마디 — 이것이 AI는 흉내 낼 수 없는 <strong>'동시대를 함께 산다는 연대감'</strong>입니다.
          </p>

          <div className="guide-quote">
            시청자가 원하는 것은 완벽한 정보가 아닙니다.
            <strong>완벽하지 않은 사람이 진심으로 전하는 정보</strong>입니다.
            AI가 못 하는 것이 바로 여기에 있습니다.
          </div>

          <h2 id="sec-2">2. AI를 도구로 쓰되, 인간성을 잃지 않는 법</h2>

          <p>
            그렇다고 AI를 거부할 필요는 없습니다. AI는 강력한 도구입니다.
            중요한 것은 <strong>'어디까지 AI에게 맡길 것인가'</strong>를 분명히 정하는 일입니다.
          </p>

          <div className="guide-section">
            <h3>💡 AI에게 맡겨도 되는 것 vs 맡기면 안 되는 것</h3>
            <p style={{ fontSize: 14, marginTop: 8, marginBottom: 10 }}>
              <strong style={{ color: '#16a34a' }}>✅ AI에게 맡겨도 OK</strong>
            </p>
            <ul style={{ marginTop: 0 }}>
              <li>제목 후보 만들기 (8:2 법칙 적용)</li>
              <li>설명란 초안 작성</li>
              <li>해시태그 추천 / 썸네일 시안 / 대본 구조</li>
            </ul>

            <p style={{ fontSize: 14, marginTop: 12, marginBottom: 10 }}>
              <strong style={{ color: '#dc2626' }}>⚠️ AI에게 맡기면 위험</strong>
            </p>
            <ul style={{ marginBottom: 0 }}>
              <li>본인 경험담 (살지 않은 이야기)</li>
              <li>댓글 답변 (시청자가 진심을 알아챔)</li>
              <li>슬픈 소식 전달 / 리뷰 영상의 솔직한 평가</li>
            </ul>
          </div>

          <h2 id="sec-3">3. 시니어 사연 쇼츠가 강한 진짜 이유</h2>

          <p>
            시니어 채널의 사연 쇼츠가 알고리즘을 타는 이유는 단순히 감동적이라서가 아닙니다.
            <strong>AI가 절대 만들 수 없는 콘텐츠</strong>이기 때문입니다.
          </p>

          <p>
            "50년 전 어머니가 마지막으로 하신 말씀", "남편을 떠나 보낸 그날의 진실" — 이런 이야기는 데이터가 아닙니다.
            한 사람의 인생입니다. AI는 못 합니다.
          </p>

          <div className="guide-callout">
            시니어 사연 쇼츠 채널을 운영하신다면, AI로 사연을 '만들지' 마세요.
            AI는 보조 도구일 뿐입니다. 사연은 본인 또는 가족 어르신의 이야기여야 합니다.
            시청자는 진실인지 가짜인지 알아챕니다.
          </div>

          <h2 id="sec-4">4. 차가운 기술 시대, 따뜻한 채널의 가치</h2>

          <p>
            앞으로 유튜브 시장에는 AI 자동 생성 채널이 폭발적으로 늘어날 것입니다.
            그래서 역설적으로 <strong>'인간이 직접 만든 채널'의 가치가 올라갑니다.</strong>
          </p>

          <p>
            시청자는 정보의 홍수 속에서 결국 <strong>'믿을 수 있는 사람'</strong>을 찾습니다.
            AI가 아무리 정확한 정보를 줘도, 시청자는 인간 유튜버의 말 한마디를 더 신뢰합니다.
          </p>

          <h2 id="sec-5">5. 실천 방법 5가지</h2>

          <p>
            아래 체크리스트를 따라가시면서 본인 채널에 인간의 온도를 더해보세요.
            하나씩 체크하면 진행률이 표시됩니다.
          </p>

          

          <ol>
            <li>
              <strong>본인 얼굴 또는 목소리 노출하기.</strong>
              얼굴이 부담스러우면 목소리만이라도 본인 것으로. AI 음성 X.
            </li>
            <li>
              <strong>댓글에 직접 답글 달기.</strong>
              처음 100명 구독자까지는 모든 댓글에 직접 답해보세요.
            </li>
            <li>
              <strong>실수 영상도 올리기.</strong>
              완벽한 영상만 올리지 마세요. "이번에 실수했어요" 영상이 더 많은 사랑을 받습니다.
            </li>
            <li>
              <strong>시청자 이름 부르기.</strong>
              "○○님" 보다 "어제 댓글 주신 영희님 같은 분들께" 같은 표현이 강합니다.
            </li>
            <li>
              <strong>시즌·날씨·뉴스 언급하기.</strong>
              "오늘 첫눈 오셨죠?" 한 마디가 시청자와 같은 시간을 산다는 증거입니다.
            </li>
          </ol>

          <h2 id="sec-6">마치며: 망설임이 강력한 무기다</h2>

          <div className="guide-quote">
            <strong>방송 사고처럼 보이는 20초의 침묵이</strong>
            사실은 가장 강력한 위로였다.
            AI가 흉내 낼 수 없는, 인간만이 가진 망설임의 품위.
          </div>

          <p>
            AI 자동 생성 도구의 시대에, 인간 유튜버는 두 갈래 길에 서 있습니다.
            AI를 흉내 내며 효율적으로 자동 생성 채널을 만들거나,
            또는 AI가 절대 못 하는 인간 고유의 영역에서 진짜 가치를 만들거나.
          </p>

          <p>
            <strong>NuTube는 후자를 응원합니다.</strong>
            알고리즘 노하우, 시니어 사연, 채널 운영 가이드 — 모두 인간 경험을 담은 콘텐츠입니다.
            AI 도구는 보조로 쓰시되, 채널의 핵심은 본인이 살아낸 이야기로 채우세요.
          </p>

          <p>
            마지막으로 한 가지만 더 기억하세요.
            <strong>시청자가 채널을 떠나는 가장 큰 이유는 정보가 부족해서가 아닙니다.</strong>
            채널이 진정성이 없다고 느낄 때입니다.
            AI 시대일수록 진정성은 가장 비싼 자산입니다.
          </p>

          

          <div className="guide-section" style={{ marginTop: 32 }}>
            <h3>✨ 함께 보면 좋은 가이드</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/algorithm-mindset" style={{ color: '#c2410c' }}>6개월간 떡상이 안 와도 버티는 멘탈 관리</Link></li>
              <li><Link href="/blog/algorithm-seo" style={{ color: '#c2410c' }}>알고리즘이 내 영상을 알아보게 하는 SEO 전략</Link></li>
              <li><Link href="/blog/algorithm-mistakes" style={{ color: '#c2410c' }}>치명적 실수 7가지 - 알고 피하면 떡상</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </V18Shell>
  );
}
