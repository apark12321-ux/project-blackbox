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
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">노하우</Link>
          <span className="sep">/</span>
          <span>저작권 걱정 없는 무료 BGM 사이트 10개 정리</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🎵 BGM</span>
          <h1 className="title">저작권 걱정 없는 무료 BGM 사이트 10개 정리</h1>
          <p className="sub">유튜브 수익화 가능한 무료 음악 다운로드 가이드</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 7분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 영상에 음악을 넣을 때 가장 큰 위험은 저작권입니다. 잘못된 음악을 사용하면 영상 수익이 모두 음악 저작권자에게 가거나, 영상이 차단됩니다. 다행히 무료로 사용 가능한 고퀄리티 BGM 사이트가 많습니다. 이 글에서는 검증된 10개 사이트를 소개합니다.</p>
          <h2>1. YouTube 오디오 라이브러리 (가장 추천)</h2>
          <p>유튜브 스튜디오에 내장된 무료 음악 라이브러리입니다. 모든 음악이 100% 무료이고 상업 사용 가능합니다. 약 5,000개의 음악과 음향 효과가 제공됩니다. 접속 방법: 유튜브 스튜디오 → 좌측 메뉴 &quot;오디오 보관함&quot;. 장점은 유튜브 자체 라이브러리이므로 저작권 클레임이 절대 발생하지 않는다는 것입니다.</p>
          <h2>2. Pixabay Music</h2>
          <p>pixabay.com/music에서 약 30,000개 무료 음악을 제공합니다. 회원가입 없이 다운로드 가능하며, 상업 사용도 자유롭습니다. 한국어 검색은 안 되지만 &quot;calm&quot;, &quot;upbeat&quot;, &quot;epic&quot; 같은 영문 검색어로 찾으면 됩니다. 시니어 채널에 어울리는 잔잔한 음악도 많습니다.</p>
          <h2>3. Free Music Archive (FMA)</h2>
          <p>freemusicarchive.org는 약 100,000개의 무료 음악을 제공합니다. 단, 라이선스가 곡마다 다르므로 &quot;CC0&quot; 또는 &quot;Creative Commons&quot; 표시 곡을 선택하세요. 다양한 장르의 고퀄리티 음악이 있습니다.</p>
          <h2>4. Bensound</h2>
          <p>bensound.com은 카테고리별로 잘 정리된 무료 BGM 사이트입니다. &quot;Acoustic&quot;, &quot;Cinematic&quot;, &quot;Corporate&quot; 등 카테고리로 쉽게 찾을 수 있습니다. 무료 사용 시 음악 출처를 영상 설명에 명시해야 합니다 (Music: bensound.com).</p>
          <h2>5. Incompetech</h2>
          <p>incompetech.com은 Kevin MacLeod라는 작곡가의 사이트입니다. 영화/게임 같은 시네마틱 음악이 많습니다. 무료이지만 출처 표기 필수입니다. 다큐멘터리 스타일 영상에 잘 어울립니다.</p>
          <h2>6. Mixkit</h2>
          <p>mixkit.co는 무료 음악과 영상 소스를 제공하는 사이트입니다. 출처 표기 없이도 사용 가능하며, 상업 이용도 자유롭습니다. 트렌디한 음악이 많아 쇼츠 영상에 적합합니다.</p>
          <h2>7. Uppbeat</h2>
          <p>uppbeat.io는 유튜브 크리에이터를 위한 음악 사이트입니다. 무료 플랜으로 월 10곡까지 다운로드 가능하고, 모든 곡이 유튜브 수익화에 안전합니다. 한국 사용자에게는 약간 생소하지만 음악 퀄리티가 매우 높습니다.</p>
          <h2>8. NCS (NoCopyrightSounds)</h2>
          <p>ncs.io는 일렉트로닉 음악 전문 무료 사이트입니다. 게임 영상이나 운동 영상에 잘 어울립니다. 출처 표기 필수이며, 대부분의 곡이 유튜브에서도 무료입니다.</p>
          <h2>9. Audionautix</h2>
          <p>audionautix.com는 작곡가 Jason Shaw의 무료 음악 사이트입니다. 다양한 장르를 제공하며 고품질입니다. 출처 표기만 하면 상업 이용 가능합니다.</p>
          <h2>10. Epidemic Sound (유료지만 추천)</h2>
          <p>epidemicsound.com은 유료(월 1.5만원)이지만 가장 인기 있는 음악 라이브러리입니다. 약 40,000곡의 고품질 음악이 있고, 모두 유튜브에서 안전합니다. 채널이 어느 정도 성장한 후 투자할 가치가 있습니다.</p>
          <h2>BGM 사용 시 주의사항</h2>
          <p>1) 라이선스 확인 필수 - 같은 사이트 안에서도 곡마다 라이선스가 다를 수 있습니다. 2) 출처 표기 - 무료 음악도 출처 표기가 필수인 경우가 많습니다. 3) 유튜브 시스템 확인 - 영상 업로드 후 &quot;저작권&quot; 메뉴에서 클레임 발생 여부 확인. 4) 같은 음악을 여러 번 사용 - 음악 장르를 통일하면 채널 정체성이 만들어집니다.</p>
          <h2>장르별 추천 BGM</h2>
          <p>정보 전달 영상: 잔잔한 피아노, Lofi (집중 도움). 부동산/재테크: 차분한 클래식, Corporate. 시니어 라이프: Acoustic, Folk. 운동/건강: Upbeat Pop, Energetic. 다큐멘터리/스토리: Cinematic, Epic. 쇼츠: Trending Pop, EDM.</p>
          <h2>결론: BGM 선택의 핵심</h2>
          <p>BGM은 영상의 분위기를 결정합니다. 처음에는 YouTube 오디오 라이브러리에서 시작하세요. 가장 안전하고 무료입니다. 채널이 성장하면 Epidemic Sound 같은 유료 서비스로 업그레이드해 차별화된 음악을 사용하세요. 좋은 BGM은 시청 유지율을 5~10% 올릴 수 있습니다.</p>
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
    </V11Shell>
  );
}
