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


        /* 🎯 시니어 모바일 최적화 */
        @media (max-width: 600px) {
          .page { padding: 22px 14px 50px !important; }
          .title { font-size: 22px !important; line-height: 1.4 !important; }
          .sub { font-size: 14.5px !important; line-height: 1.7 !important; }
          .pageBadge { font-size: 12px !important; padding: 6px 14px !important; }
          .content { padding: 18px 16px !important; line-height: 1.85 !important; }
          .content h2 { font-size: 18px !important; line-height: 1.4 !important; margin: 24px 0 12px !important; }
          .content h3 { font-size: 16px !important; }
          .content p { font-size: 15px !important; line-height: 1.85 !important; margin: 0 0 14px !important; }
          .content ul { padding-left: 20px !important; }
          .content li { font-size: 14.5px !important; line-height: 1.8 !important; }
          .stepBox { padding: 14px 16px !important; }
          .stepTitle { font-size: 14.5px !important; }
          .highlight { padding: 16px 18px !important; }
          .relatedLink { 
            font-size: 13.5px !important; 
            padding: 12px 14px !important; 
            min-height: 44px;
          }
          .relatedTitle { font-size: 14px !important; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog?cat=phone">핸드폰 가이드</Link>
          <span className="sep">/</span>
          <span>무료 영상 편집 앱 5가지 비교</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🆓 핸드폰 가이드</span>
          <h1 className="title">시니어층 무료 영상 편집 앱 5가지 비교</h1>
          <p className="sub">돈 안 내고 충분히 만드는 영상, 본인에게 맞는 앱 고르기</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 11분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>유료 결제 안 해도 됩니다. <strong>무료 앱만으로도 시니어층 영상 만들기 충분</strong>해요. 5개 앱 비교해서 본인에게 맞는 거 고르세요.</div>
          </div>

          <h2>1. 캡캠(CapCut)</h2>
          <div className="stepBox">
            <div className="stepTitle">⭐ 가장 추천</div>
            <ul>
              <li>장점: 무료 기능 풍부, 사용자 매우 많음, 강의 풍부</li>
              <li>단점: 메뉴 복잡, 영어 일부 섞임</li>
              <li>추천: 영상 깊이 배우고 싶은 분</li>
              <li>난이도: 중간</li>
            </ul>
          </div>

          <h2>2. 블로(VLLO)</h2>
          <div className="stepBox">
            <div className="stepTitle">⭐ 시니어층 추천</div>
            <ul>
              <li>장점: 한국 회사, 직관적, 한국어 완벽</li>
              <li>단점: 일부 고급 기능 유료</li>
              <li>추천: 디지털 어려운 분, 60대 이상</li>
              <li>난이도: 쉬움</li>
            </ul>
          </div>

          <h2>3. 키네마스터(KineMaster)</h2>
          <div className="stepBox">
            <div className="stepTitle">전문가 지향</div>
            <ul>
              <li>장점: 전문 기능 많음, 한국어 완벽</li>
              <li>단점: 무료 버전에 워터마크, 인터페이스 복잡</li>
              <li>추천: 깊이 배우고 싶은 분</li>
              <li>난이도: 어려움</li>
            </ul>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>4. 캠바(Canva)</h2>
          <div className="stepBox">
            <div className="stepTitle">디자인 위주</div>
            <ul>
              <li>장점: 템플릿 풍부, 디자인 예쁨</li>
              <li>단점: 영상 편집은 약함, 영어 위주</li>
              <li>추천: 썸네일 만들고 싶은 분</li>
              <li>난이도: 중간</li>
            </ul>
          </div>

          <h2>5. 인샷(InShot)</h2>
          <div className="stepBox">
            <div className="stepTitle">간단한 편집용</div>
            <ul>
              <li>장점: 매우 쉬움, 빠르게 만들기</li>
              <li>단점: 무료 버전 워터마크, 기능 적음</li>
              <li>추천: SNS용 짧은 영상만 만드는 분</li>
              <li>난이도: 쉬움</li>
            </ul>
          </div>

          <h2>본인에게 맞는 앱 추천 - 3가지 경우</h2>
          <ul>
            <li><strong>처음이고 시니어층</strong> → 블로(VLLO)</li>
            <li><strong>본격적으로 영상 배우고 싶음</strong> → 캡캠(CapCut)</li>
            <li><strong>SNS 짧은 영상만 만들 거임</strong> → 인샷(InShot)</li>
          </ul>

          <h2>유료 앱은 언제 필요할까?</h2>
          <p>
            처음에는 무료로 충분합니다. 채널 시작 1년 후 영상 만들기에 자신감이 생기고, 더 전문적인 효과가 필요해지면
            그때 유료로 넘어가도 늦지 않아요.
          </p>
          <p>
            <strong>처음 1년은 무료 앱으로 꾸준함을 만드는 게 가장 중요</strong>합니다. 비싼 도구가 좋은 영상을 만들지 않아요.
            진심과 꾸준함이 만듭니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/phone-video-basics" className="relatedLink">
            📱 핸드폰만으로 영상 만들기 입문 →
          </Link>
          <Link href="/knowhow/phone-app-capcut-vlo" className="relatedLink">
            ✂️ 캡캠·블로 시니어층 사용법 비교 →
          </Link>
          <Link href="/knowhow/bgm-copyright-free" className="relatedLink">
            🎵 무료 BGM 사이트 정리 →
          </Link>
          <Link href="/blog?cat=phone" className="relatedLink">
            🔗 모든 핸드폰 가이드 보기 →
          </Link>
        </div>
      </div>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%)',
          borderRadius: '14px',
          border: '1.5px solid #fdebd9',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', color: '#92400e', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
            📌 더 많은 가이드
          </div>
          <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            시니어층 영상 만들기 26편 가이드 모음
          </div>
          <Link href="/blog" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#c65f3b',
            color: '#fff',
            borderRadius: '100px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 800,
            minHeight: '44px',
            lineHeight: '1.4'
          }}>
            📚 전체 가이드 보러가기 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
