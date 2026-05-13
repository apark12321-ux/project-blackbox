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
          <span>캡캠·블로 사용법 비교</span>
        </nav>

        <header className="header">
          <span className="pageBadge">✂️ 핸드폰 가이드</span>
          <h1 className="title">캡캠(CapCut)·블로(VLLO) 시니어층 사용법 비교</h1>
          <p className="sub">두 앱의 장단점과 본인에게 맞는 앱 고르는 기준</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 10분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>두 앱 모두 <strong>무료 버전 + 한국어 지원</strong>입니다. 캡캠은 사용자 많아서 도움받기 쉽고, 블로는 한국 회사라 직관적이에요. 둘 다 유료 Pro 옵션이 있지만, 무료 버전만으로도 시니어층 영상 만들기 충분합니다.</div>
          </div>

          <h2>두 앱 한눈에 비교</h2>
          <div className="stepBox">
            <div className="stepTitle">캡캠(CapCut)</div>
            <ul>
              <li>장점: 사용자 매우 많음, 유튜브 강의 풍부, 무료 기능 풍부</li>
              <li>단점: 영어 표현이 일부 섞여있음, 메뉴가 복잡, 4K·일부 AI 기능은 Pro($9.99~$19.99/월) 필요</li>
              <li>추천: 영상 만들기 익히고 싶은 분</li>
            </ul>
          </div>
          <div className="stepBox">
            <div className="stepTitle">블로(VLLO)</div>
            <ul>
              <li>장점: 한국 회사, 한국어 완벽, 직관적 인터페이스</li>
              <li>단점: 사용자 캡캠보다 적음, 일부 기능 유료</li>
              <li>추천: 시니어층, 디지털 어려운 분</li>
            </ul>
          </div>

          <h2>캡캠 기본 사용법 5단계</h2>
          <p><strong>1단계</strong> - 앱 열고 "새 프로젝트" 누르기</p>
          <p><strong>2단계</strong> - 영상/사진 고르기</p>
          <p><strong>3단계</strong> - 하단 메뉴: 편집 / 텍스트 / 음악 / 효과</p>
          <p><strong>4단계</strong> - 자막 추가: "텍스트" → "추가" → 글자 입력</p>
          <p><strong>5단계</strong> - 우측 상단 "내보내기" → 갤러리에 저장</p>

          <h2>블로 기본 사용법 5단계</h2>
          <p><strong>1단계</strong> - 앱 열고 화면 비율 선택 (가로 16:9)</p>
          <p><strong>2단계</strong> - 영상/사진 추가</p>
          <p><strong>3단계</strong> - 하단 메뉴: 편집 / 자막 / 음악 / 스티커</p>
          <p><strong>4단계</strong> - 자막 추가: "자막" → 원하는 스타일 선택</p>
          <p><strong>5단계</strong> - 상단 "내보내기" → 화질 선택 → 저장</p>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>본인에게 맞는 앱 고르는 기준</h2>
          <ul>
            <li><strong>처음이고 어렵게 느낌</strong> → 블로 추천</li>
            <li><strong>모르겠을 때 검색해서 배우고 싶음</strong> → 캡캠 추천 (강의 풍부)</li>
            <li><strong>전문적으로 깊게 배우고 싶음</strong> → 캡캠 추천</li>
            <li><strong>간단한 가족 영상만 만들면 됨</strong> → 블로 추천</li>
          </ul>

          <h2>두 앱 모두 공통 - 자막 만드는 핵심</h2>
          <p>
            시니어 시청자가 보는 영상의 가장 큰 차이는 <strong>자막</strong>입니다. 작게 쓰면 안 보이고, 빨리 사라지면 못 읽어요.
          </p>
          <ul>
            <li>글자 크기 - 화면의 1/15 정도로 크게</li>
            <li>색깔 - 흰색 + 검은 외곽선 (어떤 배경에서도 잘 보임)</li>
            <li>지속 시간 - 천천히 읽을 수 있게 충분히</li>
            <li>한 줄에 10자 이내 - 너무 긴 자막은 가독성 저하</li>
          </ul>

          <h2>마치며</h2>
          <p>
            두 앱 모두 무료 버전이 있습니다. 한 번씩 사용해보시고 본인에게 맞는 앱을 고르시면 돼요. 두 앱 모두 유료 Pro 옵션(월 정기결제)이 있지만, 시니어층 영상 만들기에는 무료 버전만으로 충분합니다.
            중요한 건 <strong>한 앱을 정해서 꾸준히 쓰는 것</strong>입니다. 자꾸 바꾸면 익숙해지지 않아요.
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
          <Link href="/knowhow/phone-free-editing-apps" className="relatedLink">
            🆓 시니어층 무료 영상 편집 앱 5가지 비교 →
          </Link>
          <Link href="/knowhow/thumbnail-design" className="relatedLink">
            🖼️ 조회수 차이 만드는 썸네일 디자인 7가지 법칙 →
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
