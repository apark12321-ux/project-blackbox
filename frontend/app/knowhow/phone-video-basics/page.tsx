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
          <span>핸드폰만으로 영상 만들기 입문</span>
        </nav>

        <header className="header">
          <span className="pageBadge">📱 핸드폰 가이드</span>
          <h1 className="title">핸드폰만으로 영상 만들기 입문<br />시니어층용 step-by-step</h1>
          <p className="sub">카메라 없이도 OK, 무료 앱만으로 영상 완성하는 법</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 12분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>비싼 카메라, 컴퓨터 없이도 <strong>핸드폰 하나로 영상 만들기 충분</strong>합니다. 시니어층도 차근차근 따라하시면 첫 영상 만드실 수 있어요.</div>
          </div>

          <h2>핸드폰 영상이 충분한 이유</h2>
          <p>
            요즘 핸드폰 카메라는 10년 전 전문 카메라보다 화질이 좋습니다. 유튜브 화질도 충분하고, 시청자도 화질보다
            <strong>내용</strong>을 더 중요하게 봅니다.
          </p>
          <p>
            그리고 핸드폰만으로 만들면 비용이 0원입니다. 부담 없이 일단 시작해보고, 익숙해지면 그때 더 좋은 장비로 넘어가도 늦지 않아요.
          </p>

          <h2>STEP 1 - 영상 주제 정하기 (10분)</h2>
          <div className="stepBox">
            <div className="stepTitle">📝 해야 할 일</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              본인이 1년 넘게 해온 일, 좋아하는 일 중 하나를 정하세요. 처음부터 거창할 필요 없어요.
              "내 일상 1주일", "내가 키우는 식물 이야기", "내가 좋아하는 동네 산책" 같은 작은 주제도 좋습니다.
            </p>
          </div>

          <h2>STEP 2 - 핸드폰으로 촬영 (30분)</h2>
          <div className="stepBox">
            <div className="stepTitle">📝 촬영 5가지 팁</div>
            <ul>
              <li><strong>가로 모드</strong>로 찍기 (유튜브는 가로, 쇼츠는 세로)</li>
              <li>밝은 곳에서 - 자연광이 가장 좋아요</li>
              <li>배경 정리 - 너무 어수선하지 않게</li>
              <li>핸드폰 거치대 사용 - 손떨림 방지 (천원샵에서 5천원)</li>
              <li>한 번에 길게 X. 짧게 짧게 여러 번 찍기</li>
            </ul>
          </div>

          <h2>STEP 3 - 무료 편집 앱 설치 (5분)</h2>
          <div className="stepBox">
            <div className="stepTitle">📝 추천 앱 2가지</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              <strong>캡캠(CapCut)</strong> - 가장 인기. 무료. 한국어 지원. 사용자 많아서 도움 받기 쉬움.<br />
              <strong>블로(VLLO)</strong> - 한국 회사. 더 직관적. 시니어층에게 친숙한 인터페이스.
            </p>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>STEP 4 - 편집하기 (1~2시간)</h2>
          <div className="stepBox">
            <div className="stepTitle">📝 기본 편집 5가지</div>
            <ul>
              <li><strong>자르기</strong> - 너무 긴 부분 자르기</li>
              <li><strong>자막</strong> - 큰 글씨로 추가 (시니어 시청자 위함)</li>
              <li><strong>BGM</strong> - 무료 BGM 추가 (앱 안에 무료 음악 있음)</li>
              <li><strong>전환 효과</strong> - 부드럽게 화면 전환</li>
              <li><strong>썸네일</strong> - 첫 화면 정하기</li>
            </ul>
          </div>

          <h2>STEP 5 - 유튜브 업로드 (15분)</h2>
          <div className="stepBox">
            <div className="stepTitle">📝 업로드 순서</div>
            <ul>
              <li>유튜브 앱 → 가운데 + 버튼</li>
              <li>편집한 영상 선택</li>
              <li>제목 작성 (핵심 키워드 1개 포함)</li>
              <li>설명 작성 (3줄 이상)</li>
              <li>썸네일 선택</li>
              <li>공개로 설정 → 게시</li>
            </ul>
          </div>

          <h2>처음 1개월 주의 사항</h2>
          <ul>
            <li><strong>화질에 집착하지 마세요</strong> - 내용이 더 중요합니다</li>
            <li><strong>구독자에 집착하지 마세요</strong> - 1년은 봐야 늘어요</li>
            <li><strong>매일 올리지 마세요</strong> - 일주일 한 편이면 충분합니다</li>
            <li><strong>댓글에 정성껏 답해주세요</strong> - 시청자 한 명 한 명이 소중합니다</li>
            <li><strong>내가 좋아하는 일을 하세요</strong> - 떡상 욕심보다 꾸준함이 중요</li>
          </ul>

          <h2>마치며</h2>
          <p>
            핸드폰 영상 만들기는 어렵지 않아요. 50대, 60대, 70대 시니어 분들도 차근차근 따라하시면 충분히 만드실 수 있습니다.
            첫 영상은 완벽하지 않아도 괜찮아요. 일단 시작하는 게 가장 중요합니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/phone-app-capcut-vlo" className="relatedLink">
            ✂️ 캡캠·블로 시니어층 사용법 비교 →
          </Link>
          <Link href="/knowhow/phone-free-editing-apps" className="relatedLink">
            🆓 시니어층 무료 영상 편집 앱 5가지 비교 →
          </Link>
          <Link href="/knowhow/middle-aged-channel-tips" className="relatedLink">
            👴 시니어층 유튜브 시작할 때 꼭 알아야 할 7가지 →
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
