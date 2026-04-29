'use client';
import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 24px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 30px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.025em; margin: 0 0 12px; }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 22px; } }
        .meta { display: flex; justify-content: center; gap: 16px; font-size: 12px; color: #888; margin-top: 12px; }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.85; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 { font-size: 19px; font-weight: 800; color: #1a1a1a; margin: 28px 0 12px; }
        .content h2:first-child { margin-top: 0; }
        .content h3 { font-size: 16px; font-weight: 700; color: #c65f3b; margin: 20px 0 10px; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .content strong { color: #c65f3b; font-weight: 700; }
        .content ul { padding-left: 22px; margin: 12px 0 18px; }
        .content li { margin-bottom: 8px; font-size: 14.5px; color: #444; line-height: 1.7; }
        .highlight {
          background: linear-gradient(135deg, #fff7ed 0%%, #fef3c7 100%%);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 18px 22px;
          margin: 20px 0;
        }
        .stepBox {
          background: #fafafa;
          border-left: 4px solid #c65f3b;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
        }
        .stepTitle { font-size: 15px; font-weight: 800; color: #c65f3b; margin-bottom: 6px; }
        .adArea { margin: 32px 0; }
        .related { margin-top: 32px; padding: 24px; background: #fafafa; border-radius: 12px; }
        .relatedTitle { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px; }
        .relatedLink {
          display: block; padding: 10px 14px;
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 8px; text-decoration: none;
          color: #1a1a1a; font-size: 13px; font-weight: 600;
          margin-bottom: 6px; transition: all 0.15s;
        }
        .relatedLink:hover { border-color: #c65f3b; background: #fff8f3; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog?cat=ai">AI 도구</Link>
          <span className="sep">/</span>
          <span>시니어층 무료 AI 도구 5가지</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🤖 AI 도구</span>
          <h1 className="title">시니어층이 영상 만들 때 쓸 만한<br />무료 AI 도구 5가지</h1>
          <p className="sub">ChatGPT부터 미드저니까지, 진짜 도움되는 도구만 정리</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 13분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>AI 도구는 어렵지 않아요. <strong>시니어층도 30분만 익히면 영상 만들기 시간 절반</strong>으로 줄일 수 있습니다.</div>
          </div>

          <h2>왜 AI 도구가 필요한가요?</h2>
          <p>
            영상 한 편을 처음 만들면 보통 4~6시간 걸립니다. 주제 정하기, 대본 쓰기, 이미지 찾기, 자막 만들기, 편집 등.
            AI 도구를 잘 쓰면 이 시간을 <strong>2~3시간으로 줄일 수 있어요</strong>.
          </p>

          <h2>1. ChatGPT (대본 쓰기)</h2>
          <div className="stepBox">
            <div className="stepTitle">⭐ 가장 추천</div>
            <ul>
              <li>가격: 무료 (GPT-3.5)</li>
              <li>용도: 영상 대본, 제목, 설명, 태그 만들기</li>
              <li>난이도: 쉬움</li>
              <li>한국어: 완벽</li>
            </ul>
            <p style={{margin: '8px 0 0', fontSize: '13.5px', color: '#555'}}>
              사용법: <strong>"○○ 주제로 5분 영상 대본 써줘"</strong> 라고 입력하면 끝. 더 자세한 사용법은 별도 글에서 다룹니다.
            </p>
          </div>

          <h2>2. 네이버 클로바 (한국어 음성)</h2>
          <div className="stepBox">
            <div className="stepTitle">한국어 강점</div>
            <ul>
              <li>가격: 무료</li>
              <li>용도: 텍스트를 자연스러운 한국어 음성으로 변환</li>
              <li>난이도: 쉬움</li>
              <li>한국어: 완벽</li>
            </ul>
            <p style={{margin: '8px 0 0', fontSize: '13.5px', color: '#555'}}>
              얼굴 노출 안 하고 영상 만드실 때 매우 유용합니다.
            </p>
          </div>

          <h2>3. 미드저니(Midjourney) (이미지 만들기)</h2>
          <div className="stepBox">
            <div className="stepTitle">고품질 이미지</div>
            <ul>
              <li>가격: 월 $10부터 (무료 평가판 있음)</li>
              <li>용도: 영상에 들어갈 이미지 만들기</li>
              <li>난이도: 중간</li>
              <li>한국어: 영어 명령어 추천</li>
            </ul>
            <p style={{margin: '8px 0 0', fontSize: '13.5px', color: '#555'}}>
              처음에는 무료 대안 사용하고, 익숙해지면 결제 고려하세요.
            </p>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>4. 캡캠 자동 자막 기능</h2>
          <div className="stepBox">
            <div className="stepTitle">시간 절약 최강</div>
            <ul>
              <li>가격: 무료</li>
              <li>용도: 영상 음성을 자동으로 자막으로 변환</li>
              <li>난이도: 쉬움</li>
              <li>한국어: 완벽</li>
            </ul>
            <p style={{margin: '8px 0 0', fontSize: '13.5px', color: '#555'}}>
              자막 만드는 시간을 1시간에서 5분으로 줄여줍니다. 시니어층 영상은 자막이 필수이므로 매우 유용.
            </p>
          </div>

          <h2>5. 캠바(Canva) AI 썸네일</h2>
          <div className="stepBox">
            <div className="stepTitle">썸네일 디자인</div>
            <ul>
              <li>가격: 무료 (일부 유료)</li>
              <li>용도: 썸네일 자동 디자인</li>
              <li>난이도: 쉬움</li>
              <li>한국어: 한글 폰트 풍부</li>
            </ul>
            <p style={{margin: '8px 0 0', fontSize: '13.5px', color: '#555'}}>
              템플릿이 풍부해서 디자인 못해도 예쁜 썸네일 만들기 가능합니다.
            </p>
          </div>

          <h2>시니어층 AI 도구 사용 4단계</h2>
          <p><strong>1단계 - ChatGPT부터.</strong> 대본 쓰기가 가장 시간 많이 걸립니다. ChatGPT가 가장 큰 도움.</p>
          <p><strong>2단계 - 캡캠 자동 자막.</strong> 자막 만드는 시간 90% 절약.</p>
          <p><strong>3단계 - 클로바 음성.</strong> 얼굴 노출 안 할 때.</p>
          <p><strong>4단계 - 캠바.</strong> 썸네일 만들 때.</p>

          <h2>주의 사항 - AI 도구 사용 시 5가지</h2>
          <ul>
            <li><strong>본인 색깔 유지</strong> - AI 결과물 그대로 안 쓰고 본인 톤으로 수정</li>
            <li><strong>사실 확인</strong> - AI는 가끔 거짓말. 중요한 사실은 별도 검증</li>
            <li><strong>저작권 주의</strong> - AI 이미지도 상업 사용 가능한지 확인</li>
            <li><strong>AI 사용 명시</strong> - 영상 설명에 "AI 도구 사용" 명시 권장</li>
            <li><strong>의존하지 않기</strong> - 본인 능력도 함께 키우기</li>
          </ul>

          <h2>마치며</h2>
          <p>
            AI 도구는 시니어층에게 영상 만들기 진입 장벽을 크게 낮춰줍니다. 처음에는 어렵게 느끼실 수 있지만,
            한 번 익히면 영상 만들기가 훨씬 쉬워져요.
          </p>
          <p>
            중요한 건 <strong>본인 진심을 담는 것</strong>입니다. AI는 도구일 뿐이고, 영상의 핵심은 본인 이야기입니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/chatgpt-for-seniors" className="relatedLink">
            💬 ChatGPT 시니어층 활용법 - 영상 대본 만들기 →
          </Link>
          <Link href="/knowhow/phone-video-basics" className="relatedLink">
            📱 핸드폰만으로 영상 만들기 입문 →
          </Link>
          <Link href="/knowhow/middle-aged-channel-tips" className="relatedLink">
            👴 시니어층 유튜브 시작할 때 꼭 알아야 할 7가지 →
          </Link>
          <Link href="/blog?cat=ai" className="relatedLink">
            🔗 모든 AI 도구 보기 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
