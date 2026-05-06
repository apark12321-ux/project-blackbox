'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorThumbnailDesignGuide() {
  return (
    <V18Shell>
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
          margin-bottom: 32px; padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }
        .guide-section { margin-bottom: 36px; }
        .guide-section h2 {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          margin: 0 0 16px; padding-top: 12px;
        }
        @media (max-width: 600px) { .guide-section h2 { font-size: 19px; } }
        .guide-section h3 {
          font-size: 17px; font-weight: 700; letter-spacing: -0.018em;
          margin: 24px 0 10px;
        }
        .guide-section p {
          font-size: 16px; margin: 0 0 14px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section p { font-size: 15px; } }
        .guide-section ul, .guide-section ol {
          margin: 0 0 16px; padding-left: 24px;
        }
        .guide-section li {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section li { font-size: 15px; } }
        .guide-section strong { color: #c2410c; font-weight: 700; }
      `}</style>

      <article className="guide">
        <Link href="/blog" style={{ fontSize: 13, color: '#737373', marginBottom: 16, display: 'inline-block' }}>
          ← 가이드 목록으로
        </Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 썸네일 디자인</div>
        <h1 className="guide-h1">
          시니어 시청자가 좋아하는 썸네일 디자인 5가지
        </h1>
        <p className="guide-subtitle">
          50~70대 시청자의 클릭을 부르는 썸네일 디자인 원칙과 무료 도구 활용법입니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.06 발행</span>
          <span>·</span>
          <span>📂 시니어</span>
        </div>

        <div className="guide-section">
          <p>
            썸네일은 영상의 첫인상입니다. 시청자가 영상을 클릭할지 안 할지를 결정하는
            가장 큰 요소가 썸네일입니다. <strong>시청률 (CTR) 의 70% 이상이 썸네일</strong>에서 결정됩니다.
          </p>
          <p>
            특히 50~70대 시니어 시청자는 젊은 시청자와 다른 것을 좋아합니다.
            이 가이드는 <strong>시니어 시청자를 위한 썸네일 디자인 5가지 원칙</strong>과
            누구나 쉽게 만들 수 있는 무료 도구 활용법을 알려드립니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 큰 글씨가 핵심</h2>
          <p>
            시니어 시청자는 작은 글씨를 잘 못 읽으십니다.
            특히 스마트폰 화면에서 썸네일은 매우 작게 보입니다.
            <strong>한 줄에 6~8글자 이내</strong>로 크게 쓰셔야 합니다.
          </p>
          <h3>좋은 예 vs 나쁜 예</h3>
          <ul>
            <li>❌ 나쁜 예: "60대 부모님과 함께한 추억의 여행 이야기"</li>
            <li>✅ 좋은 예: "60대 부모님 추억 여행"</li>
            <li>❌ 나쁜 예: "내가 정말 알지 못했던 어머니의 진심"</li>
            <li>✅ 좋은 예: "어머니의 진심"</li>
          </ul>
          <h3>글자 크기 원칙</h3>
          <ul>
            <li>썸네일 가로의 <strong>1/8 이상</strong>이어야 함</li>
            <li>스마트폰에서도 한눈에 읽힐 정도로</li>
            <li>한 단어를 강조 (색깔 다르게 또는 더 크게)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>2. 진한 색깔 사용</h2>
          <p>
            시니어 시청자의 시력은 일반적으로 30~40대보다 약합니다.
            <strong>은은한 색</strong>보다 <strong>진한 색</strong>이 훨씬 잘 보입니다.
            특히 글자 색은 배경과 대비가 강해야 합니다.
          </p>
          <h3>추천 색 조합</h3>
          <ul>
            <li><strong>흰 글씨 + 검은 배경</strong>: 가장 잘 보임</li>
            <li><strong>노란 글씨 + 검은 배경</strong>: 강조 효과</li>
            <li><strong>흰 글씨 + 빨간 배경</strong>: 긴급/충격 효과</li>
            <li><strong>검은 글씨 + 노란 배경</strong>: 따뜻한 분위기</li>
          </ul>
          <h3>피해야 할 색</h3>
          <ul>
            <li>회색 글씨 + 흰 배경 (대비 약함)</li>
            <li>파스텔 톤 (시니어가 잘 못 읽음)</li>
            <li>너무 화려한 그라데이션 (글자가 묻힘)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3. 사람 얼굴을 크게</h2>
          <p>
            시청자는 무의식적으로 <strong>사람의 얼굴</strong>에 끌립니다.
            특히 표정이 강한 얼굴 (놀람, 기쁨, 슬픔) 은 클릭률을 50~100% 올립니다.
          </p>
          <h3>얼굴 크기 원칙</h3>
          <ul>
            <li>썸네일 면적의 <strong>30~50%</strong>를 얼굴이 차지</li>
            <li>얼굴은 한쪽에 배치 (보통 왼쪽)</li>
            <li>나머지 절반에 큰 글씨 배치</li>
          </ul>
          <h3>표정 선택</h3>
          <ul>
            <li><strong>놀란 표정</strong>: 호기심 유발 (가장 강력)</li>
            <li><strong>웃는 표정</strong>: 친근함 (가족/일상 채널 추천)</li>
            <li><strong>진지한 표정</strong>: 신뢰감 (정보 영상)</li>
            <li><strong>슬픈 표정</strong>: 사연 영상 (시니어 채널 강함)</li>
          </ul>
          <h3>얼굴 안 나오는 채널</h3>
          <ul>
            <li>대신 <strong>손, 음식, 풍경</strong>등 시각적 요소 활용</li>
            <li>또는 <strong>그림/일러스트</strong> 사용</li>
            <li>꼭 사람 얼굴이어야 하는 건 아님</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 한 가지 메시지만</h2>
          <p>
            썸네일에 너무 많은 정보를 넣으시면 시청자가 헷갈립니다.
            <strong>한 영상 = 한 가지 메시지</strong>가 원칙입니다.
            여러 가지를 넣을수록 클릭률이 떨어집니다.
          </p>
          <h3>좋은 썸네일 구성</h3>
          <ul>
            <li>큰 제목 한 줄 (6~8글자)</li>
            <li>얼굴 또는 핵심 시각 요소 1개</li>
            <li>색깔 2~3가지 이내</li>
          </ul>
          <h3>피해야 할 구성</h3>
          <ul>
            <li>여러 줄 글씨 (3줄 이상)</li>
            <li>여러 명의 얼굴 (3명 이상)</li>
            <li>여러 색깔 (5가지 이상)</li>
            <li>너무 많은 화살표/도형</li>
          </ul>
          <p>
            "단순할수록 강하다" — 이게 썸네일의 핵심입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>5. AI 도구 활용</h2>
          <p>
            요즘은 <strong>AI 도구</strong>로 썸네일을 쉽게 만드실 수 있습니다.
            그림 못 그리셔도, 디자인 모르셔도, 한국어로 설명만 하시면 됩니다.
          </p>
          <h3>추천 무료 AI 도구</h3>
          <ul>
            <li><strong>Canva</strong>: 한국어 지원, 시니어 친화적, 무료 템플릿 풍부</li>
            <li><strong>Midjourney</strong>: 고품질 일러스트 생성 (유료)</li>
            <li><strong>DALL-E 3</strong>: ChatGPT 안에서 사용 가능</li>
            <li><strong>망고보드</strong>: 한국 디자인 도구, 시니어 인기</li>
          </ul>
          <h3>Canva 사용법 (가장 쉬움)</h3>
          <ol>
            <li>canva.com 접속 또는 앱 설치</li>
            <li>"YouTube 썸네일" 템플릿 선택</li>
            <li>마음에 드는 디자인 클릭</li>
            <li>글자만 본인 영상 제목으로 변경</li>
            <li>다운로드 → 유튜브에 업로드</li>
          </ol>
          <h3>AI 그림 활용 (더 차별화)</h3>
          <ul>
            <li>"50대 어머니 따뜻한 미소" 같은 한국어로 설명</li>
            <li>AI가 일러스트 생성</li>
            <li>Canva로 글씨 추가</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            썸네일은 <strong>"한눈에 들어오는 첫인상"</strong>입니다.
            시청자가 0.5초 안에 클릭할지 결정합니다.
            큰 글씨, 진한 색, 명확한 메시지 — 이 세 가지만 지키시면 됩니다.
          </p>
          <p>
            처음에는 어려우시겠지만, <strong>10편 이상 만들어보시면</strong> 본인만의 스타일이 생깁니다.
            본인 채널의 색깔이 잡히면 시청자가 썸네일만 보고도 "아 이 채널이구나" 알아챕니다.
          </p>
          <p>
            오늘 한 가지 영상의 썸네일을 다시 만들어보세요.
            그리고 클릭률을 비교해보세요. 차이가 보이실 겁니다.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/thumbnail-tips" style={{ color: '#c2410c' }}>눈길을 사로잡는 썸네일 글자 디자인</Link></li>
            <li><Link href="/blog/ai-thumbnail" style={{ color: '#c2410c' }}>AI 썸네일 만드는 도구 5개 비교</Link></li>
            <li><Link href="/blog/senior-hook-patterns" style={{ color: '#c2410c' }}>시청자를 사로잡는 시니어 영상 후크 8가지</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
