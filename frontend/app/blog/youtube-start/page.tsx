'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

/**
 * 가이드 1편: 유튜브 입문 (시니어 친화)
 * 경로: /app/blog/youtube-start/page.tsx
 * AdSense 안전: 가짜 데이터 0, 외부 브랜드명 0, 오리지널 콘텐츠
 */
export default function YouTubeStartGuide() {
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
        <div className="guide-kicker">▍ 시작 가이드 · 입문</div>
        <h1 className="guide-h1">유튜브 처음 시작하시는 분을 위한 입문 안내</h1>
        <p className="guide-subtitle">
          채널 만들기부터 첫 영상 업로드까지, 차근차근 따라하실 수 있도록 정리했습니다.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 4월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 7분</span>
          <span>·</span>
          <span>📚 입문</span>
        </div>

        <p>
          유튜브를 시작하려고 하시는데 어디서부터 손대야 할지 막막하신가요?
          50대, 60대, 70대 분들도 충분히 시작하실 수 있습니다.
          이 글에서는 채널 개설부터 첫 영상 업로드까지의 과정을
          가장 쉬운 순서대로 안내드립니다.
        </p>

        <h2>1. 유튜브 채널 만들기</h2>

        <p>
          유튜브 채널을 만들려면 먼저 구글 계정이 있어야 합니다.
          이미 지메일(Gmail)을 사용하고 계시면 그 계정 그대로 쓰시면 됩니다.
          없으시다면 youtube.com 에 접속해서 우측 상단 "로그인" 버튼을 누르시고
          "계정 만들기"를 선택하시면 됩니다.
        </p>

        <h3>채널 이름 정하기</h3>

        <p>
          채널 이름은 시청자가 가장 먼저 보게 되는 정보입니다.
          본인 이름, 별명, 또는 다루실 주제를 담은 이름을 추천드립니다.
          예를 들어 요리 영상을 만드신다면 "할머니의 손맛", "삼춘네 부엌" 같은
          친근한 이름이 좋습니다. 너무 어렵거나 영문으로만 된 이름은 피해주세요.
        </p>

        <div className="guide-callout">
          💡 채널 이름은 나중에도 바꿀 수 있으니 너무 고민하지 마시고
          마음에 드는 이름으로 일단 시작하세요.
        </div>

        <h2>2. 어떤 영상을 만들지 정하기</h2>

        <p>
          처음 시작하실 때 가장 어려운 부분이 "어떤 영상을 만들지"입니다.
          다음 세 가지를 생각해보세요.
        </p>

        <ul>
          <li>내가 잘 아는 것 (오랜 직업, 취미, 경험)</li>
          <li>내가 좋아하는 것 (관심사, 즐기는 활동)</li>
          <li>다른 사람들이 궁금해할 것 (질문 자주 받는 분야)</li>
        </ul>

        <p>
          이 세 가지가 겹치는 부분이 있다면 그게 바로 영상 주제입니다.
          예를 들어 30년 동안 한식당 운영하셨던 분이라면
          "한식당 비법", "주방장의 한 그릇 요리", "장사의 기본"
          이런 주제들이 자연스럽습니다.
        </p>

        <h2>3. 첫 영상 만들기</h2>

        <p>
          영상은 처음부터 잘 만들 수 없습니다.
          첫 영상은 "완벽한 영상"이 아니라 "완성된 영상"이 목표입니다.
          다음 순서대로 시도해보세요.
        </p>

        <ol>
          <li>주제 한 가지 정하기 (예: "내가 30년간 써온 김치 비법")</li>
          <li>3분 정도 분량으로 할 말 정리하기 (메모지에 적어두면 좋습니다)</li>
          <li>스마트폰으로 영상 찍기 (가로로 잡아주세요)</li>
          <li>유튜브 앱 켜고 "+ 영상 업로드" 누르기</li>
          <li>제목, 설명, 썸네일 입력하고 게시하기</li>
        </ol>

        <h2>4. 영상 잘 만드는 기본</h2>

        <h3>밝은 곳에서 찍기</h3>
        <p>
          어두운 영상은 시청자가 금방 끕니다. 창가에서 찍거나
          밝은 형광등 아래에서 찍으세요. 가능하면 얼굴에 직접 빛이 오도록.
        </p>

        <h3>흔들리지 않게 찍기</h3>
        <p>
          스마트폰을 손으로만 들고 찍으면 흔들립니다.
          1만원대 미니 삼각대 하나만 사두셔도 영상 품질이 크게 올라갑니다.
        </p>

        <h3>소리가 잘 들리게 찍기</h3>
        <p>
          밖에서 찍을 때는 바람 소리가 들어가지 않도록 조심하세요.
          실내라도 카메라(스마트폰)를 너무 멀리 두면 목소리가 작게 들립니다.
          1m 이내 거리가 적당합니다.
        </p>

        <h2>5. 꾸준함이 가장 중요합니다</h2>

        <p>
          처음 영상 1개로 인기 있는 채널이 되는 경우는 거의 없습니다.
          많은 시니어 크리에이터분들이 30~50개 영상을 올린 후에야
          채널이 알려지기 시작했다고 말씀하십니다.
        </p>

        <p>
          매주 1편씩, 처음 6개월만 꾸준히 올려보세요.
          영상 품질은 자연스럽게 좋아집니다.
        </p>

        <div className="guide-callout">
          💡 시청자 1,000명만 모이면 그때부터 채널이 빠르게 자랍니다.
          포기하지 마세요.
        </div>

        <h2>6. 자주 묻는 질문</h2>

        <h3>얼굴이 꼭 나와야 하나요?</h3>
        <p>
          아니요. 손만 보이는 요리 영상, 풍경 영상, 음성만 있는 영상도
          충분히 가능합니다. 다만 본인 얼굴이 나오면 시청자와 친밀감이
          더 빨리 형성됩니다.
        </p>

        <h3>편집은 어떻게 하나요?</h3>
        <p>
          처음에는 편집 없이 그냥 찍은 영상 그대로 올려도 됩니다.
          익숙해지신 후에 무료 편집 앱(VLLO, CapCut 같은 것)을 써보세요.
          시니어분들이 가장 많이 쓰시는 앱은 VLLO입니다.
        </p>

        <h3>구독자 늘리는 비법이 있나요?</h3>
        <p>
          비법은 없습니다. 좋은 영상 + 꾸준함 + 시청자와의 소통이 전부입니다.
          댓글에 답글 달아주시고, 영상 끝에 "구독 부탁드립니다" 한 마디
          하시면 됩니다.
        </p>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 영상 자료가 필요하신가요?</div>
          <div className="guide-cta-desc">
            AlgoMaker에서 키워드만 입력하시면 제목 · 시나리오 · 썸네일까지
            5초 안에 만들어드립니다. 완전 무료입니다.
          </div>
          <Link href="/" className="guide-cta-btn">
            영상 자료 만들러 가기 →
          </Link>
        </div>

        <div className="guide-related">
          <div className="guide-related-title">▍ 함께 보시면 좋은 가이드</div>
          <div className="guide-related-list">
            <Link href="/blog/youtube-algorithm" className="guide-related-item">
              📊 유튜브 알고리즘 쉽게 이해하기
            </Link>
            <Link href="/blog/youtube-monetization" className="guide-related-item">
              💰 유튜브 수익 창출 조건 (2026년 기준)
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
