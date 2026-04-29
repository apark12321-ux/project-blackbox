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
          <span>트렌드 키워드 발굴하는 무료 도구 7가지</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🔍 키워드 분석</span>
          <h1 className="title">트렌드 키워드 발굴하는 무료 도구 7가지</h1>
          <p className="sub">유료 도구 없이 검색량 높은 키워드를 찾는 실전 방법</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 8분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>영상 주제를 정할 때 가장 중요한 것은 &quot;사람들이 실제로 검색하는 키워드&quot;를 찾는 것입니다. 막연하게 &quot;부동산 투자&quot;라는 키워드보다, &quot;40대 부동산 투자 시작하는 법&quot;이 더 검색이 많을 수 있습니다. 키워드 분석 유료 도구는 월 5~30만원이 들지만, 무료로도 충분히 가능합니다.</p>
          <h2>1. 검색 트렌드 분석 도구 활용</h2>
          <p>검색 트렌드 분석 도구를 사용하면 키워드를 입력했을 때 시간에 따른 검색량 변화를 볼 수 있습니다. 활용법: 1) 두 키워드 비교 - &quot;부동산 투자&quot; vs &quot;부동산 투자 입문&quot;, 2) 지역별 검색량 - 어느 지역에서 인기인가, 3) 관련 검색어 - 함께 검색되는 키워드. 대부분 무료이고 한국어 지원이 잘 되어 있습니다.</p>
          <h2>2. 유튜브 자동완성 검색</h2>
          <p>유튜브 검색창에 키워드 일부만 입력하면 자동완성이 나옵니다. 이 자동완성이 바로 인기 검색어입니다. 예: &quot;부동산&quot;만 입력하면 &quot;부동산 투자&quot;, &quot;부동산 시세&quot;, &quot;부동산 매매&quot; 등이 나옵니다. 자동완성에 나오는 키워드는 무조건 검색량이 있는 키워드입니다.</p>
          <h2>3. 검색 엔진 자동완성 + 관련 검색어</h2>
          <p>검색 엔진의 자동완성과 페이지 하단의 관련 검색어가 모두 키워드 발굴에 도움됩니다. 검색 결과 페이지 하단에 &quot;~를 검색한 사람들이 함께 검색한 검색어&quot;가 표시됩니다. 이게 모두 인기 키워드입니다.</p>
          <h2>4. 질문형 키워드 분석 도구</h2>
          <p>질문 형식 키워드를 보여주는 도구들이 있습니다. 예: &quot;부동산 투자&quot; 입력 시 &quot;부동산 투자 어디서 시작&quot;, &quot;부동산 투자 얼마부터&quot;, &quot;부동산 투자 위험성&quot; 등. 이런 질문 키워드는 영상 주제로 그대로 활용할 수 있습니다.</p>
          <h2>5. 국내 검색 트렌드 도구</h2>
          <p>한국 시청자를 타겟으로 한다면 국내 포털의 검색어 트렌드 도구도 활용하세요. 한국 사용자의 검색 패턴은 글로벌 검색 엔진과 다를 수 있습니다. 특히 시니어 시청자는 국내 포털 검색을 더 많이 사용합니다.</p>
          <h2>6. 커뮤니티 사이트 활용</h2>
          <p>사람들이 실제로 고민하는 주제를 찾으려면 커뮤니티를 활용하세요. 관심 분야의 인기 커뮤니티 게시판에서 자주 올라오는 질문이 좋은 영상 주제가 됩니다. 영상으로 답변을 만들면 &quot;내가 궁금했던 거였어!&quot;라는 반응을 얻을 수 있습니다.</p>
          <h2>7. 경쟁 채널 분석</h2>
          <p>여러분 분야의 인기 채널 5~10개를 정해놓고, 그 채널들의 인기 영상을 분석하세요. &quot;인기순&quot; 정렬로 보면 어떤 주제가 가장 많은 조회수를 받았는지 알 수 있습니다. 같은 주제를 여러분만의 관점으로 만들면 됩니다(콘텐츠를 그대로 베끼는 것은 금지).</p>
          <h2>키워드 선정 5단계 프로세스</h2>
          <p>1단계: 검색 트렌드 도구에서 큰 카테고리(부동산, 건강 등) 트렌드 확인. 2단계: 유튜브 자동완성으로 인기 세부 키워드 5~10개 발굴. 3단계: 질문형 키워드 도구로 추가 발굴. 4단계: 경쟁 채널 인기 영상에서 검증된 주제 확인. 5단계: 여러분 경험과 가장 잘 맞는 키워드 1개 선정.</p>
          <h2>롱테일 키워드 활용 전략</h2>
          <p>신규 채널은 짧은 키워드(&quot;부동산 투자&quot;)로는 경쟁이 너무 치열합니다. 롱테일 키워드(&quot;40대 직장인 부동산 투자 시작&quot;)로 시작하세요. 검색량은 적지만 경쟁이 낮아 검색 1페이지에 노출되기 쉽습니다. 롱테일 키워드 영상으로 검색 노출이 시작되면, 알고리즘이 채널을 인식해 짧은 키워드 영상도 노출이 늘어납니다.</p>
          <h2>결론: 무료 키워드 분석의 핵심</h2>
          <p>유료 도구 없이도 위 7가지 무료 도구만 잘 활용하면 충분합니다. 핵심은 &quot;꾸준히 키워드를 분석하는 것&quot;입니다. 매주 1~2시간씩 키워드 분석에 투자하면 영상 주제 선정의 적중률이 크게 올라갑니다. AlgoMaker는 여러분 분야의 트렌드 키워드를 자동으로 분석해 추천해드립니다.</p>
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
