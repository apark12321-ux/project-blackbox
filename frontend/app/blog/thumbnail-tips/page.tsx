'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

/**
 * 가이드 4편: 썸네일 잘 만드는 5가지 비법
 * 경로: /app/blog/thumbnail-tips/page.tsx
 * AdSense 안전: 가짜 데이터 0, 외부 브랜드명 0, 오리지널 콘텐츠
 */
export default function ThumbnailTipsGuide() {
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
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0 0 12px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 26px; }
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
          font-size: 14px;
          color: #737373;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin: 36px 0 14px;
          padding-top: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 21px; margin: 28px 0 12px; }
        }
        .guide h3 {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.015em;
          margin: 24px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 17.5px; }
        }
        .guide p {
          font-size: 18px;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 17px; }
        }
        .guide ul, .guide ol {
          padding-left: 22px;
          margin: 8px 0 18px;
        }
        .guide li {
          font-size: 18px;
          margin-bottom: 8px;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 17px; }
        }
        .guide-callout {
          padding: 14px 16px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 16px 0;
          font-size: 17px;
          line-height: 1.6;
          color: #78350f;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-callout { font-size: 13.5px; padding: 12px 14px; }
        }
        .guide-tip-card {
          padding: 16px 18px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          margin: 18px 0;
        }
        .guide-tip-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .guide-tip-title {
          font-size: 17px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .guide-cta {
          margin-top: 36px;
          padding: 20px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          text-align: center;
        }
        .guide-cta-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0a0a0a;
        }
        .guide-cta-desc {
          font-size: 15.5px;
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
          font-size: 15px;
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
        <div className="guide-kicker">▍ 디자인 가이드 · 썸네일</div>
        <h1 className="guide-h1">썸네일 잘 만드는 5가지 비법</h1>
        <p className="guide-subtitle">
          썸네일이 클릭률의 90%를 결정합니다. 디자인 안 배워도 되는
          실용적인 5가지 비법을 정리했습니다.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 4월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 7분</span>
          <span>·</span>
          <span>🎨 디자인</span>
        </div>

        <p>
          유튜브에서 클릭률(CTR)을 결정하는 가장 큰 요소가 썸네일입니다.
          제목보다 더 중요합니다. 시청자는 썸네일 → 제목 순서로 보고
          0.5초 안에 클릭할지 말지 결정합니다.
        </p>

        <p>
          그런데 디자인 전공이 아니라 부담스러우신 분이 많습니다.
          걱정 마세요. 디자인 못 해도 클릭률 높은 썸네일을 만들 수 있는
          5가지 비법을 알려드립니다.
        </p>

        <div className="guide-tip-card">
          <div className="guide-tip-num">▍ 비법 1</div>
          <h2 className="guide-tip-title" style={{ marginTop: 0 }}>큰 글자 1줄, 작은 글자 X</h2>
          <p>
            가장 많이 하는 실수가 썸네일에 작은 글자 여러 줄 넣는 것입니다.
            모바일에서 보면 글자가 안 보입니다. 시청자의 80%가 모바일로 봅니다.
          </p>
          <p>
            큰 글자 1줄, 핵심 단어 5~7글자 이내가 가장 좋습니다.
          </p>
          <p>
            <strong>나쁜 예:</strong> "이 영상에서 공개되는 부동산 투자 비법 7가지"
          </p>
          <p>
            <strong>좋은 예:</strong> "1억 만든 비법" 또는 "이거 하나면 끝"
          </p>
        </div>

        <div className="guide-tip-card">
          <div className="guide-tip-num">▍ 비법 2</div>
          <h2 className="guide-tip-title" style={{ marginTop: 0 }}>표정이 보이게</h2>
          <p>
            얼굴이 들어가는 썸네일이 평균적으로 클릭률이 높습니다.
            그런데 그냥 얼굴이 아니라 "표정이 명확한" 얼굴이어야 합니다.
          </p>
          <p>효과 좋은 표정:</p>
          <ul>
            <li>놀란 표정 (눈 크게 뜨고 입 벌리기)</li>
            <li>웃는 표정 (이가 보일 정도로)</li>
            <li>당황한 표정</li>
            <li>슬픈 표정 (감동 영상에 효과적)</li>
          </ul>
          <p>
            평범한 표정, 무표정은 클릭률이 낮습니다.
            셀카 찍을 때 평소보다 2배 과장된 표정으로 찍어보세요.
          </p>
        </div>

        <div className="guide-tip-card">
          <div className="guide-tip-num">▍ 비법 3</div>
          <h2 className="guide-tip-title" style={{ marginTop: 0 }}>강한 색상 대비</h2>
          <p>
            썸네일은 작은 화면에서 다른 영상들과 경쟁합니다.
            연한 색, 비슷한 색만 쓰면 묻혀버립니다.
          </p>
          <p>가장 강한 색상 조합:</p>
          <ul>
            <li>빨강 + 노랑 (강한 자극, 부동산·경제 분야 추천)</li>
            <li>검정 + 흰색 (가장 깔끔, 모든 분야 무난)</li>
            <li>파랑 + 빨강 (대비 강조, 토론·논쟁 분야)</li>
            <li>노랑 + 검정 (경고 느낌, 위기·주의 콘텐츠)</li>
          </ul>
          <p>
            글자 색은 보통 흰색이나 노란색이 가장 잘 읽힙니다.
            글자 뒤에 검은 테두리(외곽선)를 넣으면 어떤 배경에서도 잘 보입니다.
          </p>
        </div>

        <div className="guide-tip-card">
          <div className="guide-tip-num">▍ 비법 4</div>
          <h2 className="guide-tip-title" style={{ marginTop: 0 }}>제목과 다른 정보</h2>
          <p>
            썸네일과 제목이 같은 정보를 담으면 정보량이 1개입니다.
            서로 다른 정보를 담으면 정보량이 2개가 됩니다.
            클릭률이 더 올라갑니다.
          </p>
          <p>
            <strong>잘못된 예:</strong>
          </p>
          <ul>
            <li>제목: "재개발 유망 지역 3곳"</li>
            <li>썸네일 글자: "재개발 유망 지역 3곳"</li>
          </ul>
          <p>
            (둘 다 같은 말 → 정보량 1개)
          </p>
          <p>
            <strong>잘된 예:</strong>
          </p>
          <ul>
            <li>제목: "재개발 유망 지역 3곳"</li>
            <li>썸네일 글자: "1년에 2배 올랐다"</li>
          </ul>
          <p>
            (제목 = 무엇 / 썸네일 = 효과 → 정보량 2개)
          </p>
        </div>

        <div className="guide-tip-card">
          <div className="guide-tip-num">▍ 비법 5</div>
          <h2 className="guide-tip-title" style={{ marginTop: 0 }}>화살표·동그라미 활용</h2>
          <p>
            시선을 어디로 향하게 할지 직접 알려주는 방법입니다.
            화살표(↓ ← →)나 빨간 동그라미를 사용하면 시청자의 눈이 그쪽으로 갑니다.
          </p>
          <p>활용 예:</p>
          <ul>
            <li>"이거 ↓" + 손가락 가리키는 화살표</li>
            <li>중요한 부분에 빨간 동그라미</li>
            <li>"X" 표시로 잘못된 것 지적</li>
            <li>"V" 표시로 정답 강조</li>
          </ul>
        </div>

        <h2>썸네일 만드는 도구</h2>

        <p>
          전문 디자인 프로그램을 안 써도 됩니다. 무료 도구로 충분합니다.
        </p>

        <ul>
          <li><strong>캔바</strong> — 가장 쉬운 무료 디자인 도구. 유튜브 썸네일 템플릿 많음</li>
          <li><strong>미리캔버스</strong> — 한국형 디자인 도구. 한글 폰트 많음</li>
          <li><strong>이미지 편집 앱</strong> — 스마트폰으로 만들 때 추천</li>
        </ul>

        <p>
          AlgoMaker에서 키워드를 입력하시면 3가지 썸네일 컨셉을
          자동으로 추천해드립니다. 거기서 영감 얻어서 만드시면 됩니다.
        </p>

        <h2>썸네일 사이즈와 형식</h2>

        <ul>
          <li>가로 1280px × 세로 720px (16:9 비율)</li>
          <li>JPG 또는 PNG 형식</li>
          <li>2MB 이하 용량</li>
        </ul>

        <div className="guide-callout">
          💡 1280×720 사이즈로 만들지 않으면 모바일에서 잘려 보일 수 있습니다.
          반드시 이 사이즈를 지키세요.
        </div>

        <h2>나쁜 썸네일의 5가지 특징</h2>

        <p>이런 썸네일은 피하세요.</p>

        <ol>
          <li>글자가 너무 많음 (모바일에서 안 보임)</li>
          <li>색이 흐리고 비슷함 (눈에 안 띔)</li>
          <li>얼굴 표정이 무표정 (감정 전달 X)</li>
          <li>제목과 똑같은 글자 반복 (정보량 부족)</li>
          <li>너무 어두운 사진 (썸네일에서 가장 큰 적)</li>
        </ol>

        <h2>썸네일 A/B 테스트하기</h2>

        <p>
          유튜브 스튜디오에서 썸네일 A/B 테스트 기능을 제공합니다.
          썸네일 2~3개를 등록하면 유튜브가 자동으로 어느 게 더 클릭이 많은지
          비교해줍니다. 어느 정도 데이터 쌓이면 적극 활용해보세요.
        </p>

        <div className="guide-cta">
          <div className="guide-cta-title">🎨 썸네일 컨셉 5초 만에</div>
          <div className="guide-cta-desc">
            AlgoMaker가 키워드만 받아서 클릭률 높은 썸네일 컨셉 3가지 + 한글/영문 프롬프트까지
            만들어드립니다. AI 이미지 생성 도구에 그대로 넣으시면 끝.
          </div>
          <Link href="/" className="guide-cta-btn">
            썸네일 만들러 가기 →
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
            <Link href="/blog/ai-tools" className="guide-related-item">
              🤖 영상 제작 AI 도구 정리
            </Link>
          </div>
        </div>
      </article>
    </V11Shell>
  );
}
