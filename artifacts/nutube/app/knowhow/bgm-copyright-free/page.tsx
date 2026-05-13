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
          <span>저작권 안전한 BGM 가이드</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🎵 BGM</span>
          <h1 className="title">저작권 안전한 무료 BGM 활용 가이드</h1>
          <p className="sub">유튜브 수익화 가능한 무료 음악 찾는 법과 사용 시 주의사항</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 7분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 영상에 음악을 넣을 때 가장 큰 위험은 저작권입니다. 잘못된 음악을 사용하면 영상 수익이 모두 음악 저작권자에게 가거나, 영상이 차단됩니다. 다행히 무료로 사용 가능한 고퀄리티 BGM 사이트가 많이 있습니다. 이 글에서는 어떤 종류의 BGM 사이트들이 있는지, 그리고 각각의 특성을 활용하는 방법을 정리합니다.</p>

          <h2>1. 유튜브 자체 오디오 라이브러리 활용</h2>
          <p>가장 안전한 방법은 유튜브 스튜디오에 내장된 무료 음악 라이브러리를 사용하는 것입니다. 모든 음악이 100% 무료이고 상업 사용 가능합니다. 약 5,000개의 음악과 음향 효과가 제공됩니다. 접속 방법은 유튜브 스튜디오 → 좌측 메뉴 &quot;오디오 보관함&quot;입니다. 가장 큰 장점은 유튜브 자체 라이브러리이므로 저작권 클레임이 절대 발생하지 않는다는 것입니다.</p>

          <h2>2. 무료 음악 아카이브 사이트들</h2>
          <p>인터넷에는 수만 곡의 무료 음악을 제공하는 아카이브 사이트들이 많이 있습니다. 검색할 때 &quot;Royalty Free Music&quot;, &quot;Creative Commons Music&quot;, &quot;무료 BGM&quot; 같은 키워드로 찾으면 됩니다. 단, 라이선스가 곡마다 다르므로 반드시 &quot;CC0&quot; 또는 &quot;Public Domain&quot; 표시 곡을 선택해야 안전합니다. 일부 사이트는 출처 표기를 요구하므로 영상 설명에 출처를 명시하는 것이 좋습니다.</p>

          <h2>3. 카테고리별 무료 BGM 사이트</h2>
          <p>장르별로 특화된 무료 BGM 사이트들이 있습니다. 잔잔한 음악, 시네마틱 음악, 일렉트로닉, Lofi 등 카테고리별로 정리된 사이트를 활용하면 영상 분위기에 맞는 음악을 빠르게 찾을 수 있습니다. 검색 시 &quot;무료 [장르] BGM&quot; 형식으로 찾으세요. 예를 들어 &quot;무료 시네마틱 BGM&quot;, &quot;무료 Lofi BGM&quot; 같은 식입니다.</p>

          <h2>4. 유료 음악 라이브러리 (선택사항)</h2>
          <p>채널이 어느 정도 성장한 후에는 유료 음악 라이브러리에 투자할 가치가 있습니다. 월 구독료 1만원 ~ 3만원 정도로 수만 곡의 고품질 음악을 무제한 사용할 수 있습니다. 모든 곡이 유튜브에서 안전하고, 음악 퀄리티가 매우 높아 영상의 완성도를 한 단계 끌어올릴 수 있습니다. 차별화된 사운드로 채널 정체성을 만들고 싶은 분께 추천합니다.</p>

          <h2>5. BGM 사용 시 반드시 확인할 4가지</h2>
          <p>첫째, 라이선스 확인은 필수입니다. 같은 사이트 안에서도 곡마다 라이선스가 다를 수 있습니다. 둘째, 출처 표기 의무를 확인하세요. 무료 음악도 출처 표기가 필수인 경우가 많습니다. 셋째, 영상 업로드 후 유튜브 스튜디오의 &quot;저작권&quot; 메뉴에서 클레임 발생 여부를 반드시 확인하세요. 넷째, 같은 음악을 여러 번 사용해도 좋습니다. 음악 장르를 통일하면 채널 정체성이 자연스럽게 만들어집니다.</p>

          <h2>6. 영상 분위기별 추천 BGM 장르</h2>
          <p>정보 전달 영상에는 잔잔한 피아노나 Lofi 같은 집중을 도와주는 음악이 좋습니다. 부동산이나 재테크 영상에는 차분한 클래식이나 Corporate 스타일의 음악이 신뢰감을 줍니다. 시니어 라이프나 일상 콘텐츠에는 Acoustic이나 Folk 장르가 따뜻함을 전달합니다. 운동이나 건강 콘텐츠에는 Upbeat Pop이나 Energetic한 음악이 활기를 더합니다. 다큐멘터리나 스토리 영상에는 Cinematic이나 Epic 장르가 몰입감을 만듭니다. 쇼츠 영상에는 Trending Pop이나 EDM이 짧은 시간 안에 강한 임팩트를 줍니다.</p>

          <h2>7. 음악 볼륨 설정 (놓치기 쉬운 핵심)</h2>
          <p>BGM 볼륨이 너무 크면 시청자가 영상을 끄게 됩니다. 음성이 있는 영상에서는 BGM 볼륨을 음성보다 -15dB 정도 낮게 설정하는 것이 표준입니다. 편집 프로그램에서 볼륨 미터를 보면서 조절하면 됩니다. 음성이 없는 영상에서는 BGM이 메인이 되므로 일반 볼륨으로 두되, 너무 자극적이지 않은 음악을 선택하세요.</p>

          <h2>8. 시작 단계 추천 전략</h2>
          <p>처음에는 유튜브 자체 오디오 라이브러리에서 시작하는 것이 가장 안전하고 빠릅니다. 모든 음악이 무료이고 저작권 클레임이 없습니다. 영상 100개 정도 만들어 본 후 채널 정체성을 잡아가면서 점진적으로 다른 무료 사이트나 유료 라이브러리로 확장하는 것이 좋습니다.</p>

          <h2>결론: BGM 선택의 핵심</h2>
          <p>BGM은 영상의 분위기를 결정합니다. 가장 안전한 시작점은 유튜브 자체 오디오 라이브러리입니다. 채널이 성장하면 유료 서비스로 업그레이드해 차별화된 사운드를 만들 수 있습니다. 좋은 BGM 선택은 시청 유지율을 5~10% 올릴 수 있는 강력한 도구입니다. 단, 어떤 음악을 사용하든 라이선스 확인과 출처 표기는 반드시 챙기세요.</p>
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
