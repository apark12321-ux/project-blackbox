'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

/**
 * 가이드 2편: 유튜브 알고리즘 쉽게 이해하기
 * 경로: /app/blog/youtube-algorithm/page.tsx
 * AdSense 안전: 가짜 데이터 0, 외부 브랜드명 0, 오리지널 콘텐츠
 */
export default function YouTubeAlgorithmGuide() {
  return (
    <V11Shell>
      <style jsx>{`
        .guide {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.65;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .guide { padding: 18px 16px 50px; }
        }
        .guide-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 22px; }
        }
        .guide-subtitle {
          font-size: 15px;
          color: #525252;
          margin: 0 0 24px;
          line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #737373;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 36px 0 14px;
          padding-top: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 17px; margin: 28px 0 12px; }
        }
        .guide h3 {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.015em;
          margin: 24px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 15.5px; }
        }
        .guide p {
          font-size: 15.5px;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 14.5px; }
        }
        .guide ul, .guide ol {
          padding-left: 22px;
          margin: 8px 0 18px;
        }
        .guide li {
          font-size: 15.5px;
          margin-bottom: 8px;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 14.5px; }
        }
        .guide-callout {
          padding: 14px 16px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 16px 0;
          font-size: 14.5px;
          line-height: 1.6;
          color: #78350f;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-callout { font-size: 13.5px; padding: 12px 14px; }
        }
        .guide-quote {
          padding: 14px 18px;
          background: #f5f5f5;
          border-left: 3px solid #0a0a0a;
          margin: 16px 0;
          font-size: 14.5px;
          line-height: 1.65;
          font-style: italic;
          color: #404040;
          word-break: keep-all;
        }
        .guide-cta {
          margin-top: 36px;
          padding: 20px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          text-align: center;
        }
        .guide-cta-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0a0a0a;
        }
        .guide-cta-desc {
          font-size: 13.5px;
          color: #525252;
          margin: 0 0 14px;
          line-height: 1.55;
        }
        .guide-cta-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #0a0a0a;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .guide-cta-btn:hover {
          background: #c2410c;
        }
        .guide-related {
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid #e5e5e5;
        }
        .guide-related-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .guide-related-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guide-related-item {
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          font-size: 14px;
          color: #0a0a0a;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: background 0.15s;
        }
        .guide-related-item:hover {
          background: #fafafa;
        }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 성장 가이드 · 알고리즘</div>
        <h1 className="guide-h1">유튜브 알고리즘 쉽게 이해하기</h1>
        <p className="guide-subtitle">
          알고리즘이 뭔지 모르겠다는 분들을 위한 쉬운 설명.
          어떻게 하면 영상이 더 많이 노출되는지 정리했습니다.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 4월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 8분</span>
          <span>·</span>
          <span>📊 성장</span>
        </div>

        <p>
          "내 영상 왜 노출이 안 될까?" "구독자가 안 늘어요."
          이런 고민의 90%는 알고리즘에 대한 오해에서 시작됩니다.
          유튜브 알고리즘은 신비한 것이 아닙니다.
          아주 단순한 원리로 작동합니다.
        </p>

        <h2>알고리즘이 정말로 보는 것</h2>

        <p>
          유튜브가 영상을 시청자에게 추천할 때 보는 가장 중요한 신호 두 가지가 있습니다.
        </p>

        <ol>
          <li><strong>클릭률 (CTR)</strong> — 썸네일을 본 사람 중 몇 명이 클릭했나</li>
          <li><strong>시청 지속율</strong> — 클릭한 사람들이 얼마나 오래 봤나</li>
        </ol>

        <p>
          이 두 가지만 잘 챙겨도 채널이 자랍니다.
          나머지는 부가적인 신호입니다.
        </p>

        <h2>1. 클릭률 (CTR) 이해하기</h2>

        <p>
          썸네일이 노출됐을 때 시청자가 클릭하지 않으면 유튜브는
          "이 영상은 사람들이 관심 없구나" 판단하고 노출을 줄입니다.
        </p>

        <h3>CTR은 어디서 보나요?</h3>

        <p>
          유튜브 스튜디오 → 분석 → "노출수 클릭률" 항목에서 보실 수 있습니다.
          업로드 후 24~48시간 데이터가 가장 의미 있습니다.
        </p>

        <h3>CTR을 올리는 방법</h3>

        <ul>
          <li>썸네일에 큰 글자 1줄 (작은 글자 여러 개 X)</li>
          <li>표정이 보이는 얼굴 (정면, 큰 표정)</li>
          <li>강한 색상 대비 (빨강+노랑, 검정+흰색)</li>
          <li>제목과 썸네일이 서로 다른 정보 (둘 다 같은 말 X)</li>
        </ul>

        <div className="guide-callout">
          💡 평균 CTR은 4~6% 정도입니다. 이걸 넘기면 노출이 자동으로 늘어납니다.
        </div>

        <h2>2. 시청 지속율 이해하기</h2>

        <p>
          클릭률만 높고 시청 시간이 짧으면 알고리즘이 의심합니다.
          "썸네일은 눈에 띄는데 영상은 별로구나" 판단합니다.
          그러면 노출이 줄어듭니다.
        </p>

        <h3>시청 지속율 올리는 핵심 — 첫 30초</h3>

        <p>
          시청자는 영상을 시작하고 30초 안에 "계속 볼지 말지"
          결정합니다. 이 30초에서 90%의 영상이 결정됩니다.
        </p>

        <p>처음 30초에 꼭 들어가야 할 것:</p>

        <ul>
          <li>이 영상에서 무엇을 얻을 수 있는지 (가치 약속)</li>
          <li>왜 이 영상을 끝까지 봐야 하는지 (호기심 자극)</li>
          <li>지금부터 진행될 흐름 (예고)</li>
        </ul>

        <h3>중간에 이탈 안 시키기</h3>

        <ul>
          <li>30초마다 새로운 정보 추가</li>
          <li>같은 화면 오래 X (지루함의 가장 큰 적)</li>
          <li>다음 부분 예고 ("그런데 가장 중요한 건 뒤에 나옵니다")</li>
        </ul>

        <h2>3. 알고리즘 잘못된 통념</h2>

        <h3>"태그 많이 달면 노출이 늘어난다"</h3>
        <p>
          실제로 영상 태그는 노출에 미치는 영향이 매우 작습니다.
          태그보다는 제목, 설명문, 썸네일이 훨씬 중요합니다.
        </p>

        <h3>"영상 길이가 길어야 한다"</h3>
        <p>
          영상 길이 자체는 중요하지 않습니다.
          중요한 건 "그 길이 동안 시청자가 보는가"입니다.
          5분 영상에서 3분 봤으면 60% 시청, 20분 영상에서 5분 봤으면 25% 시청입니다.
          짧은 영상이 더 유리할 수도 있습니다.
        </p>

        <h3>"하루에 여러 번 올리면 좋다"</h3>
        <p>
          반대입니다. 하루에 여러 영상을 올리면 채널 내에서 영상끼리
          노출 경쟁을 합니다. 일주일에 1편이 가장 안전합니다.
        </p>

        <h3>"AI로 만든 영상은 노출이 안 된다"</h3>
        <p>
          유튜브 공식 발표에 따르면 AI 사용 자체는 문제가 아닙니다.
          중요한 건 "비진정성"입니다. 즉 시청자를 속이려는 의도가 있는지.
          AI를 도구로 쓰면서 진정성 있게 만들면 정상 노출됩니다.
        </p>

        <h2>4. 알고리즘 친화적 영상의 5가지 특징</h2>

        <ol>
          <li><strong>제목과 썸네일이 일치</strong> — 클릭한 후 "속았다" 느낌 X</li>
          <li><strong>처음 30초가 강력</strong> — 시청자가 끝까지 보고 싶게 만들기</li>
          <li><strong>명확한 한 가지 주제</strong> — 너무 여러 내용 X</li>
          <li><strong>호흡이 있는 흐름</strong> — 30초마다 변화</li>
          <li><strong>시청자에게 가치</strong> — 정보, 재미, 감동 중 하나</li>
        </ol>

        <h2>5. 알고리즘이 신경 쓰지 않는 것</h2>

        <p>
          많은 분들이 신경 쓰시지만 사실 알고리즘은 거의 안 보는 것들:
        </p>

        <ul>
          <li>구독자 수 (저구독자 채널도 영상 좋으면 떡상 가능)</li>
          <li>채널 개설 시기 (오래된 채널이 유리하지 않음)</li>
          <li>영상 개수 (개수가 많다고 더 잘 노출되지 않음)</li>
          <li>업로드 시간대 (영상 좋으면 언제 올려도 노출됨)</li>
        </ul>

        <div className="guide-quote">
          "알고리즘에 노출되려고 하지 마시고, 시청자가 끝까지 보고 싶은
          영상을 만드세요. 알고리즘은 그걸 따라옵니다."
        </div>

        <h2>6. 정리</h2>

        <p>
          유튜브 알고리즘은 결국 시청자를 위한 시스템입니다.
          시청자가 좋아하는 영상이 노출되는 게 자연스러운 흐름입니다.
        </p>

        <p>
          요약하면:
        </p>

        <ul>
          <li>썸네일 + 제목 = 클릭률 ↑</li>
          <li>처음 30초 + 흐름 = 시청 지속율 ↑</li>
          <li>한 가지 주제 + 명확한 가치 = 추천 ↑</li>
        </ul>

        <p>이 세 가지만 챙기시면 알고리즘은 자연스럽게 따라옵니다.</p>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 알고리즘 친화적 영상 자료 만들기</div>
          <div className="guide-cta-desc">
            AlgoMaker가 클릭률 높은 제목과 시청 지속율을 잡아주는 시나리오 구조까지
            한 번에 만들어드립니다.
          </div>
          <Link href="/" className="guide-cta-btn">
            영상 자료 만들러 가기 →
          </Link>
        </div>

        <div className="guide-related">
          <div className="guide-related-title">▍ 함께 보시면 좋은 가이드</div>
          <div className="guide-related-list">
            <Link href="/blog/youtube-start" className="guide-related-item">
              🎬 유튜브 처음 시작하기
            </Link>
            <Link href="/blog/youtube-monetization" className="guide-related-item">
              💰 유튜브 수익 창출 조건
            </Link>
            <Link href="/blog/thumbnail-tips" className="guide-related-item">
              🎨 썸네일 잘 만드는 5가지 비법
            </Link>
          </div>
        </div>
      </article>
    </V11Shell>
  );
}
