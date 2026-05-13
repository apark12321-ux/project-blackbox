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
          <span>유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🤖 알고리즘</span>
          <h1 className="title">유튜브 알고리즘이 영상을 추천하는 5가지 진짜 기준</h1>
          <p className="sub">구독자 수보다 더 중요한, AI가 영상을 평가하는 핵심 지표 정리</p>
          <div className="meta">
            <span>📅 2026.04.20</span>
            <span>⏱️ 8분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 알고리즘은 단순히 인기 있는 영상을 추천하는 시스템이 아닙니다. 2024년 이후 유튜브가 공식 발표한 자료에 따르면, 알고리즘은 &quot;각 시청자가 다음에 무엇을 보고 싶어할지&quot;를 예측하는 거대한 추천 엔진입니다. 즉, 구독자 수가 많은 채널이 아니라, 시청자가 끝까지 보고 싶어하는 영상을 우선적으로 추천합니다. 이 사실을 이해하지 못하면 영상 100개를 만들어도 조회수가 늘지 않습니다.</p>
          <h2>기준 1: 클릭률(CTR)이 가장 먼저 평가됩니다</h2>
          <p>유튜브가 가장 먼저 평가하는 지표는 썸네일과 제목을 보고 클릭한 비율입니다. 이를 CTR(Click Through Rate)이라고 합니다. 평균 CTR은 4~6%이지만, 알고리즘에 강력하게 노출되려면 8% 이상이 필요합니다. CTR을 높이는 핵심은 두 가지입니다. 첫째, 썸네일에 호기심을 자극하는 표정이나 시각적 요소를 넣습니다. 둘째, 제목에는 숫자, 시간, 결과를 명시합니다. 예: &quot;3개월 만에 -10kg&quot;, &quot;하루 5분 투자로 월 100만원&quot;.</p>
          <h2>기준 2: 평균 시청 지속 시간이 노출량을 결정합니다</h2>
          <p>클릭만 잘 받아도 안 됩니다. 유튜브는 클릭한 사람이 영상을 얼마나 오래 봤는가를 측정합니다. 이것이 평균 시청 지속 시간(Average View Duration)입니다. 긴 영상(10분 이상)은 50% 이상, 쇼츠는 80% 이상을 목표로 해야 합니다. 처음 30초가 가장 중요한데, 이 구간에서 시청자가 이탈하면 알고리즘이 영상을 가치 없음으로 판단해 노출을 줄입니다. 따라서 영상 시작 부분에 가장 흥미로운 부분이나 결론의 일부를 미리 보여주는 것이 효과적입니다.</p>
          <h2>기준 3: 시청자 행동(좋아요, 댓글, 공유)</h2>
          <p>좋아요, 댓글, 공유, 저장 4가지 행동이 알고리즘에 &quot;이 영상은 시청자에게 가치가 있다&quot;는 신호를 보냅니다. 특히 댓글은 영상의 노출량을 5~10배까지 늘릴 수 있는 강력한 지표입니다. 댓글을 유도하는 방법은 영상 마지막에 &quot;여러분은 어떻게 생각하세요?&quot; 같은 직접적인 질문을 던지는 것입니다. 답변하기 쉬운 질문일수록 댓글이 많이 달립니다. 또한 첫 1시간 내 댓글이 가장 영향력이 크므로, 영상 업로드 직후 1시간 동안은 댓글에 적극 답변하는 것이 좋습니다.</p>
          <h2>기준 4: 세션 시간 - 가장 간과되는 지표</h2>
          <p>유튜브는 &quot;이 영상을 본 후 시청자가 유튜브에 얼마나 더 머물렀는가&quot;를 매우 중요하게 봅니다. 즉, 내 영상이 끝난 후 시청자가 곧바로 유튜브를 닫으면 마이너스, 다른 영상을 더 보면 플러스입니다. 세션 시간을 늘리는 가장 좋은 방법은 영상 끝에 다른 영상을 추천하는 종료 화면을 활용하는 것입니다. 또한 시리즈 영상을 만들어 자연스럽게 다음 영상을 보게 유도하는 것도 효과적입니다.</p>
          <h2>기준 5: 시청자 만족도 점수</h2>
          <p>유튜브는 일부 시청자에게 &quot;이 영상이 만족스러웠나요?&quot; 라는 설문을 보냅니다. 이 점수가 알고리즘에 직접 반영됩니다. 만족도를 높이려면 제목에서 약속한 내용을 확실히 전달해야 합니다. 예를 들어 제목이 &quot;5분 만에 배우는 엑셀 함수&quot; 라면, 영상에서 정말 5분 안에 핵심을 전달해야 합니다. 클릭베이트(낚시 제목)를 쓰면 단기적으로는 조회수가 오르지만, 만족도 점수가 떨어져 장기적으로 채널 전체 노출이 줄어듭니다.</p>
          <h2>결론: 알고리즘 최적화 영상의 5가지 공식</h2>
          <p>1) 썸네일과 제목으로 CTR 8% 이상 확보, 2) 첫 30초 후크로 시청 유지율 50% 이상 유지, 3) 영상 마지막에 댓글/구독 유도, 4) 종료 화면으로 다음 영상 추천, 5) 제목에서 약속한 내용 정확히 전달. 이 5가지 공식을 모든 영상에 적용하면, 구독자가 100명이든 10만명이든 알고리즘은 영상을 적극적으로 노출시킵니다.</p>
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
