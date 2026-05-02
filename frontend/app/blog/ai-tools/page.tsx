'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

/**
 * 가이드 5편: 영상 제작 AI 도구 정리
 * 경로: /app/blog/ai-tools/page.tsx
 * AdSense 안전: 가짜 데이터 0, 제3자 브랜드는 일반적인 도구 카테고리만 언급, 오리지널 콘텐츠
 */
export default function AIToolsGuide() {
  return (
    <V11Shell>
      <style jsx>{`
        .guide {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.75;
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
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 24px; }
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
          font-size: 13px;
          color: #737373;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 36px 0 14px;
          padding-top: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 19px; margin: 28px 0 12px; }
        }
        .guide h3 {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.015em;
          margin: 24px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 16.5px; }
        }
        .guide p {
          font-size: 17px;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 16px; }
        }
        .guide ul, .guide ol {
          padding-left: 22px;
          margin: 8px 0 18px;
        }
        .guide li {
          font-size: 17px;
          margin-bottom: 8px;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 16px; }
        }
        .guide-callout {
          padding: 14px 16px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 16px 0;
          font-size: 15.5px;
          line-height: 1.6;
          color: #78350f;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-callout { font-size: 13.5px; padding: 12px 14px; }
        }
        .guide-tool-card {
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          margin: 14px 0;
        }
        .guide-tool-name {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        .guide-tool-tag {
          display: inline-block;
          padding: 2px 8px;
          background: #f5f5f5;
          color: #525252;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .guide-tool-tag.free { background: #dcfce7; color: #166534; }
        .guide-tool-tag.paid { background: #fef3c7; color: #78350f; }
        .guide-tool-desc {
          font-size: 14px;
          color: #404040;
          line-height: 1.6;
          margin: 0;
          word-break: keep-all;
        }
        .guide-warning {
          padding: 14px 16px;
          background: #fef2f2;
          border-left: 3px solid #dc2626;
          margin: 18px 0;
          font-size: 14.5px;
          line-height: 1.6;
          color: #7f1d1d;
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
          font-size: 17px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0a0a0a;
        }
        .guide-cta-desc {
          font-size: 14.5px;
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
        <div className="guide-kicker">▍ AI 가이드 · 도구</div>
        <h1 className="guide-h1">영상 제작 AI 도구 정리</h1>
        <p className="guide-subtitle">
          영상 시나리오, 이미지, 음성, 편집까지 도와주는 AI 도구들의
          용도별 정리. 무료부터 유료까지.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 4월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 8분</span>
          <span>·</span>
          <span>🤖 AI 도구</span>
        </div>

        <p>
          영상 만드시는 분들 사이에서 AI 도구가 빠르게 자리잡고 있습니다.
          시나리오 기획부터 음성 더빙, 이미지 생성, 편집까지 모든 단계에
          AI 도구가 있습니다.
        </p>

        <p>
          이 글에서는 분야별로 어떤 AI 도구가 있고 어떻게 활용하는지
          정리해드립니다. 처음 쓰시는 분도 이해하실 수 있도록 쉽게 설명합니다.
        </p>

        <h2>1. 시나리오·대본 작성 AI</h2>

        <p>
          영상 시나리오, 대본, 자막을 작성해주는 AI입니다.
          가장 많이 쓰이는 분야입니다.
        </p>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">대화형 AI 챗봇</h3>
          <span className="guide-tool-tag free">기본 무료</span>
          <p className="guide-tool-desc">
            ChatGPT, Claude, Gemini 같은 대화형 AI에 "5060 시청자 대상으로
            재개발 영상 시나리오 만들어줘" 같이 입력하면 됩니다.
            구체적으로 입력할수록 좋은 결과가 나옵니다.
          </p>
        </div>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">키워드 기반 자동 생성</h3>
          <span className="guide-tool-tag free">완전 무료</span>
          <p className="guide-tool-desc">
            AlgoMaker 같은 도구는 키워드만 입력하면 제목, 시나리오,
            메타데이터까지 자동 생성합니다. 챗봇처럼 매번 프롬프트 짜지 않아도 됩니다.
          </p>
        </div>

        <h2>2. 이미지 생성 AI</h2>

        <p>
          썸네일, 영상 안에 들어가는 그림을 만드는 AI입니다.
          저작권 걱정 없이 본인만의 이미지를 만들 수 있습니다.
        </p>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">생성형 이미지 AI</h3>
          <span className="guide-tool-tag paid">대부분 유료</span>
          <p className="guide-tool-desc">
            Midjourney, DALL-E, Stable Diffusion 등이 있습니다.
            "안락한 거실에 앉아 있는 60대 여성" 같이 자연어로 설명하면
            그대로 그려줍니다. 영문 프롬프트가 가장 좋은 결과를 냅니다.
          </p>
        </div>

        <div className="guide-callout">
          💡 영문 프롬프트가 어려우시면 AlgoMaker에서 한글로 입력하시면
          영문 프롬프트로 자동 번역해드립니다.
        </div>

        <h2>3. 영상 생성 AI</h2>

        <p>
          정지 이미지가 아니라 움직이는 영상을 만들어주는 AI입니다.
          최근 가장 빠르게 발전하고 있습니다.
        </p>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">텍스트 → 영상</h3>
          <span className="guide-tool-tag paid">유료</span>
          <p className="guide-tool-desc">
            Sora, VEO, Runway 같은 도구입니다. 텍스트 설명만으로
            5~10초 짜리 영상을 만들어줍니다. 아직 비용이 비싼 편이라
            쇼츠나 광고용 영상에 주로 사용됩니다.
          </p>
        </div>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">이미지 → 영상</h3>
          <span className="guide-tool-tag paid">유료</span>
          <p className="guide-tool-desc">
            기존 이미지를 받아서 자연스럽게 움직이는 영상으로 바꿔주는 도구입니다.
            정적인 풍경 사진을 살짝 움직이는 효과 등에 자주 쓰입니다.
          </p>
        </div>

        <h2>4. 음성 더빙·내레이션 AI</h2>

        <p>
          본인 목소리 대신 자연스러운 AI 목소리로 영상을 만들고 싶으신 분께
          유용합니다.
        </p>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">텍스트 → 음성 (TTS)</h3>
          <span className="guide-tool-tag free">기본 무료 / 유료</span>
          <p className="guide-tool-desc">
            텍스트를 입력하면 자연스러운 한국어 음성으로 읽어줍니다.
            여성·남성·어린이·어르신 다양한 목소리 선택 가능합니다.
            5060 시청자 대상이면 따뜻하고 차분한 중년 여성 목소리가 효과적입니다.
          </p>
        </div>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">목소리 복제 (음성 클론)</h3>
          <span className="guide-tool-tag paid">유료</span>
          <p className="guide-tool-desc">
            본인 목소리를 1~2분만 녹음하면 그 목소리 그대로 AI가
            텍스트를 읽어주는 기술입니다. 매번 녹음하기 어려우신 분께 편리합니다.
          </p>
        </div>

        <div className="guide-warning">
          ⚠️ 다른 사람 목소리를 복제하는 건 법적·윤리적 문제가 있습니다.
          반드시 본인 목소리만 사용하세요.
        </div>

        <h2>5. 영상 편집 AI</h2>

        <p>
          편집 시간을 크게 줄여주는 AI입니다.
        </p>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">자동 자막 생성</h3>
          <span className="guide-tool-tag free">기본 무료</span>
          <p className="guide-tool-desc">
            영상 오디오를 자동으로 글로 변환해 자막을 만들어줍니다.
            한국어 인식률이 90% 이상으로 정확합니다. 일부만 손보시면 됩니다.
          </p>
        </div>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">자동 컷 편집</h3>
          <span className="guide-tool-tag paid">유료</span>
          <p className="guide-tool-desc">
            긴 영상에서 침묵 구간이나 실수 구간을 자동으로 잘라주는 기능입니다.
            인터뷰 영상, 강의 영상 편집할 때 1시간을 10분으로 줄일 수 있습니다.
          </p>
        </div>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">자동 하이라이트 추출</h3>
          <span className="guide-tool-tag paid">유료</span>
          <p className="guide-tool-desc">
            긴 영상에서 가장 흥미로운 부분만 자동으로 골라 쇼츠로 만들어주는 기능입니다.
            한 영상으로 쇼츠 5~10개를 한 번에 뽑을 수 있습니다.
          </p>
        </div>

        <h2>6. 음악·효과음 AI</h2>

        <div className="guide-tool-card">
          <h3 className="guide-tool-name">배경음악 생성</h3>
          <span className="guide-tool-tag free">기본 무료</span>
          <p className="guide-tool-desc">
            "잔잔한 피아노 곡 60초" 같이 입력하면 그에 맞는 음악을 만들어줍니다.
            저작권 걱정 없이 본인 영상에 사용할 수 있습니다.
          </p>
        </div>

        <h2>AI 도구 사용 시 주의사항</h2>

        <h3>1. 시청자 속이지 않기</h3>
        <p>
          AI를 도구로 쓰는 건 괜찮지만 시청자를 속이려는 의도가 있으면 안 됩니다.
          유튜브 알고리즘은 "비진정성"을 매우 싫어합니다.
          진짜 정보를 더 잘 전달하려고 AI를 쓰는 건 환영하지만,
          가짜 정보를 만들기 위해 쓰는 건 채널 폐쇄까지 갈 수 있습니다.
        </p>

        <h3>2. 같은 영상 반복 X</h3>
        <p>
          AI로 비슷한 영상을 매일 찍어내면 유튜브가 "스팸"으로 분류합니다.
          AI는 만들기 빠른 도구일 뿐, 매번 다르고 새로운 가치를 제공해야 합니다.
        </p>

        <h3>3. 한국어 결과 검토 필수</h3>
        <p>
          AI가 만든 한국어는 종종 어색합니다. "~입니다", "~이죠" 같은 말투가
          섞이거나, 사실과 다른 정보가 들어가기도 합니다.
          반드시 본인이 검토한 후 사용하세요.
        </p>

        <h3>4. 저작권 확인</h3>
        <p>
          AI 도구마다 상업적 이용 가능 여부가 다릅니다.
          "수익 창출 영상에 사용 가능"한지 약관 확인하고 쓰세요.
        </p>

        <div className="guide-callout">
          💡 가장 안전한 사용법: AI는 초안 만드는 데만 쓰고,
          최종은 본인이 다듬어서 본인 색깔을 입히는 방식.
          이게 알고리즘에도 좋고 시청자에게도 신뢰감을 줍니다.
        </div>

        <h2>비용 절약하는 팁</h2>

        <ul>
          <li>처음에는 무료 AI 도구만 사용 (ChatGPT 무료, Gemini 등)</li>
          <li>영상 1편 만드는 데 AI 도구 비용 5,000원 이하 목표</li>
          <li>여러 도구 구독 X, 본인에게 맞는 1~2개만</li>
          <li>월 사용량 적으면 정기 구독 X, 사용량 기반 결제로</li>
        </ul>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 AI 도구 통합 활용하기</div>
          <div className="guide-cta-desc">
            AlgoMaker가 시나리오 + 썸네일 + 이미지 프롬프트 + 메타데이터까지
            한 번에 만들어드립니다. 다른 AI 도구에 그대로 넣어 쓰시면 끝.
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
            <Link href="/blog/youtube-algorithm" className="guide-related-item">
              📊 유튜브 알고리즘 쉽게 이해하기
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
