'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'AI 썸네일 만드는 도구 비교 — 캔바부터 미드저니까지',
  description: 'AI로 유튜브 썸네일 만드는 도구 5개 비교. Canva, Midjourney, DALL-E, 망고보드, 미리캔버스 장단점.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: { '@type': 'Organization', name: 'AlgoMaker', url: 'https://nutube.kr' },
  inLanguage: 'ko',
};

export default function AIThumbnailGuide() {
  return (
    <V11Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <style jsx>{`
        .guide { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; font-family: 'Pretendard', -apple-system, system-ui, sans-serif; color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em; }
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
        <div className="guide-kicker">▍ AI 도구 · 썸네일</div>
        <h1 className="guide-h1">AI 썸네일 만드는 도구 5개 비교</h1>
        <p className="guide-subtitle">
          포토샵 안 쓰고 AI로 썸네일 만드는 5가지 도구 비교.
          Canva, 미리캔버스, 망고보드, Midjourney, DALL-E 장단점 정리.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span><span>·</span><span>⏱ 8분</span><span>·</span><span>🎨 도구</span>
        </div>

        <p>
          썸네일은 영상의 첫인상입니다. 클릭률이 5%를 넘느냐 1%에서 멈추느냐를
          결정합니다. 그런데 디자인을 한 번도 안 해보신 분이 포토샵을
          배워서 만들기는 어렵습니다.
        </p>

        <p>
          AI 썸네일 도구를 활용하시면 디자인 무경험자도 5분 안에 클릭률 좋은
          썸네일을 만들 수 있습니다. 5가지 도구를 비교해 드립니다.
        </p>

        <h2>1. Canva (캔바) — 초보 1순위</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>무료 템플릿 수천 개:</strong> 유튜브 썸네일 템플릿 즉시 사용</li>
          <li><strong>한국어 지원:</strong> 메뉴 한글, 한글 폰트 풍부</li>
          <li><strong>드래그 앤 드롭:</strong> 마우스로 끌어다 놓기만 하면 됨</li>
          <li><strong>모바일 앱:</strong> 핸드폰으로도 만들 수 있음</li>
          <li><strong>AI 기능 포함:</strong> 배경 제거, 이미지 생성, 텍스트 자동 생성</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>일부 템플릿/AI는 유료 (Canva Pro 월 1.6만원)</li>
          <li>비슷한 템플릿 사용자 많아서 차별화 어려움</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          처음 썸네일 만드시는 분, 빠르게 일관성 있는 디자인이 필요하신 분.
          가장 안전한 선택입니다.
        </p>

        <h2>2. 미리캔버스 — 한국 회사</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>한국 디자인 트렌드:</strong> 한국식 썸네일 템플릿 풍부</li>
          <li><strong>완전 무료:</strong> 무료로도 거의 다 사용 가능</li>
          <li><strong>워터마크 X:</strong> 무료 버전도 워터마크 없음</li>
          <li><strong>한국 폰트:</strong> 무료 한글 폰트 다수</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>AI 기능은 Canva보다 부족</li>
          <li>해외 디자인 트렌드는 약함</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          한국 시청자 대상 채널, 무료로 쓰고 싶은 분.
          요리·부동산·재테크 같은 한국 특화 분야에 잘 어울립니다.
        </p>

        <h2>3. 망고보드 — 한국 회사 2</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>한국 폰트 풍부:</strong> 미리캔버스보다 더 많음</li>
          <li><strong>일러스트 자료 많음:</strong> 한국식 일러스트 충분</li>
          <li><strong>유튜브 썸네일 전용 카테고리</strong></li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>월 결제 필요 (월 1만원대)</li>
          <li>인터페이스 살짝 복잡</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          매주 영상 올리시는 분, 한국 디자인 트렌드 추구하시는 분.
        </p>

        <h2>4. Midjourney — AI 이미지 생성</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>AI 이미지 품질 최고:</strong> 사람이 그린 듯한 이미지</li>
          <li><strong>유니크한 비주얼:</strong> 다른 채널과 차별화</li>
          <li><strong>다양한 스타일:</strong> 만화, 사진, 일러스트 등</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li><strong>유료 전용:</strong> 월 10달러 (약 1.4만원) 부터</li>
          <li><strong>영어 프롬프트:</strong> 한글 안 됨, 영어로 명령</li>
          <li><strong>학습 곡선:</strong> 좋은 이미지 뽑으려면 프롬프트 노하우 필요</li>
          <li><strong>한글 텍스트 X:</strong> 이미지 안에 한글 글자 못 넣음</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          영어 가능하시고 차별화된 비주얼 원하시는 분.
          AlgoMaker가 자동으로 Midjourney 프롬프트를 생성해드립니다.
        </p>

        <h2>5. DALL-E (ChatGPT 안) — 무료 AI</h2>

        <h3>장점</h3>

        <ul>
          <li><strong>한국어 명령 가능:</strong> "노란 고양이 그려줘" 같은 한글 명령</li>
          <li><strong>ChatGPT 안에서 사용:</strong> ChatGPT Plus 구독자는 자동 포함</li>
          <li><strong>빠른 생성:</strong> 30초 안에 4장</li>
        </ul>

        <h3>단점</h3>

        <ul>
          <li>ChatGPT Plus 구독 필요 (월 22달러)</li>
          <li>Midjourney보다 이미지 품질 살짝 낮음</li>
          <li>저작권 모호함 (상업 사용 가이드라인 확인 필요)</li>
        </ul>

        <h3>이런 분께 추천</h3>

        <p>
          이미 ChatGPT Plus 사용 중이신 분. 별도 결제 없이 추가 사용 가능.
        </p>

        <h2>한 눈에 보는 비교표</h2>

        <div className="guide-formula">
          <strong>Canva:</strong>          무료 ★★★★☆ / 초보 ★★★★★ / 한국화 ★★★★☆<br />
          <strong>미리캔버스:</strong>     무료 ★★★★★ / 초보 ★★★★★ / 한국화 ★★★★★<br />
          <strong>망고보드:</strong>       무료 ★★☆☆☆ / 초보 ★★★★☆ / 한국화 ★★★★★<br />
          <strong>Midjourney:</strong>     무료 ☆☆☆☆☆ / 초보 ★★☆☆☆ / 차별화 ★★★★★<br />
          <strong>DALL-E:</strong>         무료 ☆☆☆☆☆ / 초보 ★★★☆☆ / 한국어 ★★★★☆
        </div>

        <h2>처음 시작하시는 분께 — 미리캔버스 추천</h2>

        <p>
          한국 회사라 한국식 디자인이 풍부하고, 무료로 거의 다 됩니다.
          한국 시청자 대상이면 미리캔버스가 가장 적합합니다.
        </p>

        <h3>미리캔버스 5분 시작</h3>

        <ol>
          <li><strong>회원가입:</strong> miricanvas.com 접속, 이메일 가입</li>
          <li><strong>새 디자인:</strong> "유튜브 썸네일" 카테고리 선택</li>
          <li><strong>템플릿 고르기:</strong> 본인 분야에 맞는 템플릿 1개</li>
          <li><strong>글자/사진 교체:</strong> 클릭해서 본인 텍스트로 변경</li>
          <li><strong>다운로드:</strong> JPG 또는 PNG로 내려받기</li>
        </ol>

        <h2>썸네일 디자인 5가지 원칙</h2>

        <ul>
          <li><strong>글자 5~7개:</strong> 모바일에서 잘 보이는 길이</li>
          <li><strong>큰 폰트:</strong> 화면의 30~40% 차지</li>
          <li><strong>대비 강한 색:</strong> 노랑+검정, 빨강+흰색</li>
          <li><strong>표정 있는 인물:</strong> 놀란 표정, 의아한 표정</li>
          <li><strong>본인 채널 일관성:</strong> 같은 폰트·색상·로고 유지</li>
        </ul>

        <div className="guide-callout">
          💡 같은 영상도 썸네일에 따라 클릭률이 5배 차이납니다.
          AB 테스트를 통해 본인 채널에 맞는 썸네일 스타일 찾으세요.
        </div>


        <h2>썸네일 만들 때 마지막 점검</h2>
        <p>
          썸네일을 다 만들었다면 업로드 전에 한 번 더 점검하세요.
          핸드폰 작은 화면에서 썸네일을 봤을 때 글자가 읽히는지, 무엇을 말하는지
          한 눈에 보이는지 확인하세요. 시청자는 모바일에서 썸네일을 1초 안에 판단합니다.
        </p>
        <p>
          AI 썸네일은 강력한 도구지만 만능이 아닙니다. 본인 채널의 톤과 시청자 취향에
          맞춰서 조금씩 다듬어 가세요. 처음에는 5개 만들어 보고 가장 클릭율이 좋은
          스타일을 본인 채널의 표준으로 만드시면 됩니다.
        </p>

        <p>
          마지막으로 한 가지 더 기억하실 점은 썸네일은 <strong>한 번 만들고 끝</strong>이 아니라는 것입니다.
          채널이 성장하면서 시청자 취향이 바뀌고, 알고리즘 트렌드도 변합니다.
          매월 한 번씩 본인 채널의 썸네일들을 점검하고, 클릭율이 좋은 패턴을 분석하세요.
          그 분석 결과를 다음 영상 썸네일에 반영하시면 채널이 점점 성장합니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/thumbnail-tips" style={{ color: "#c2410c" }}>눈길을 사로잡는 썸네일 글자 디자인</Link></li>
            <li><Link href="/blog/chatgpt-script" style={{ color: "#c2410c" }}>ChatGPT로 영상 대본 빠르게 쓰는 법</Link></li>
            <li><Link href="/blog/algorithm-seo" style={{ color: "#c2410c" }}>알고리즘이 내 영상을 알아보게 하는 SEO 전략</Link></li>
          </ul>
        </div>
      </article>
    </V11Shell>
  );
}
