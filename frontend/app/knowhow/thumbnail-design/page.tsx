'use client';
import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 24px; } }
        .meta {
          display: flex; justify-content: center; gap: 16px;
          font-size: 12px; color: #888; margin-top: 12px;
        }
        .meta span { display: flex; align-items: center; gap: 4px; }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.8; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 {
          font-size: 19px; font-weight: 800;
          color: #1a1a1a; margin: 28px 0 12px;
        }
        .content h2:first-child { margin-top: 0; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .adArea { margin: 32px 0; }
        .related {
          margin-top: 32px; padding: 24px;
          background: #fafafa; border-radius: 12px;
        }
        .relatedTitle {
          font-size: 14px; font-weight: 800;
          color: #1a1a1a; margin-bottom: 12px;
        }
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
          <Link href="/blog">노하우</Link>
          <span className="sep">/</span>
          <span>조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🖼️ 썸네일</span>
          <h1 className="title">조회수 10배 차이 만드는 썸네일 디자인 7가지 법칙</h1>
          <p className="sub">한글 텍스트 잘 들어간 썸네일과 그렇지 못한 썸네일의 차이</p>
          <div className="meta">
            <span>📅 2026.04.22</span>
            <span>⏱️ 9분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>썸네일은 영상의 표지입니다. 아무리 좋은 영상도 썸네일이 평범하면 클릭되지 않습니다. 같은 영상을 썸네일만 바꿔서 테스트한 결과, 조회수가 10배 이상 차이 나는 경우가 흔합니다. 이 글에서는 검증된 썸네일 디자인 7가지 법칙을 정리합니다.</p>
          <h2>법칙 1: 표정이 절반을 좌우합니다</h2>
          <p>썸네일에 사람 얼굴, 특히 강한 표정이 있으면 CTR이 평균 30~50% 상승합니다. 놀란 표정, 충격받은 표정, 환한 미소 등이 효과적입니다. 무표정한 사진은 무조건 피해야 합니다. 여러분이 직접 출연하기 어렵다면, AI로 생성한 캐릭터 얼굴이나 무료 스톡 사진의 표정 있는 이미지를 활용하세요.</p>
          <h2>법칙 2: 텍스트는 6단어 이내로</h2>
          <p>썸네일 텍스트는 길수록 안 읽힙니다. 핵심 키워드 6단어 이내로 제한하세요. 예: &quot;40대 부자의 3가지 비밀&quot;, &quot;5분 만에 끝나는 엑셀 노하우&quot;. 모바일에서도 잘 보이게 글자 크기는 최소 60px 이상으로 만드세요.</p>
          <h2>법칙 3: 색상 대비가 핵심</h2>
          <p>유튜브 추천 영상 목록에서 다른 썸네일과 차별화되려면 색상 대비가 강해야 합니다. 빨강+노랑, 검정+흰색, 파랑+오렌지 같은 보색 조합이 효과적입니다. 배경은 단순하게, 주제는 선명하게 만드세요.</p>
          <h2>법칙 4: 시선 유도 (화살표/원)</h2>
          <p>강조하고 싶은 부분에 빨간 화살표나 원을 그려 시선을 유도하면 클릭률이 올라갑니다. 단, 너무 많이 사용하면 오히려 산만해 보이니 1~2개만 사용하세요.</p>
          <h2>법칙 5: 한글 텍스트는 정확히</h2>
          <p>AI 이미지 생성기로 썸네일을 만들 때 가장 큰 문제는 한글이 깨지는 것입니다. Pollinations, Stable Diffusion 같은 도구는 한글을 정확히 만들지 못합니다. 한글 텍스트가 정확히 들어간 썸네일이 필요하면 ChatGPT의 GPT Image, Google Gemini의 Nano Banana, 또는 Canva에서 AI 이미지 위에 한글 텍스트를 직접 추가하는 방법을 사용하세요.</p>
          <h2>법칙 6: 일관된 스타일 유지</h2>
          <p>한 채널의 모든 썸네일은 비슷한 스타일이어야 합니다. 색상 톤, 폰트, 레이아웃을 통일하면 시청자가 채널을 인식하기 쉬워집니다. 이를 위해 썸네일 템플릿을 만들고 매번 같은 템플릿에 텍스트만 바꾸는 것이 효율적입니다.</p>
          <h2>법칙 7: A/B 테스트</h2>
          <p>유튜브 스튜디오의 썸네일 테스트 기능을 활용하세요. 같은 영상에 2~3개의 썸네일을 만들어 테스트하면 어떤 디자인이 가장 효과적인지 데이터로 확인할 수 있습니다. 한 달에 1~2회는 반드시 테스트하는 것이 좋습니다.</p>
          <h2>결론: 썸네일 체크리스트</h2>
          <p>썸네일을 만들 때마다 다음을 확인하세요. 1) 강한 표정 있는가, 2) 텍스트 6단어 이내인가, 3) 색상 대비 강한가, 4) 시선 유도 요소 있는가, 5) 한글이 정확히 보이는가, 6) 채널 전체와 스타일 일관성 있는가, 7) A/B 테스트 가능한가. AlgoMaker는 영상 키워드에 맞는 썸네일 콘셉트 3개를 자동으로 추천해드립니다.</p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 노하우</div>
          <Link href="/blog" className="relatedLink">
            🏠 모든 노하우 보기 →
          </Link>
          <Link href="/create" className="relatedLink">
            ✨ AI로 영상 자료 만들기 →
          </Link>
          <Link href="/workflow" className="relatedLink">
            🎬 일관된 영상 만드는 5단계 가이드 →
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
