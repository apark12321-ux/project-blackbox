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
          <span>10만 조회수 영상의 스토리텔링 구조 분석</span>
        </nav>

        <header className="header">
          <span className="pageBadge">📖 스토리텔링</span>
          <h1 className="title">10만 조회수 영상의 스토리텔링 구조 분석</h1>
          <p className="sub">시청자가 끝까지 보는 영상에 숨겨진 4단계 이야기 공식</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 11분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>조회수 10만이 넘는 영상에는 공통점이 있습니다. 바로 &quot;이야기 구조&quot;가 잘 짜여 있다는 것입니다. 정보 전달 영상도 결국 이야기입니다. 이야기 구조가 약하면 시청자는 중간에 이탈합니다. 이 글에서는 검증된 4단계 스토리텔링 공식을 소개합니다.</p>
          <h2>1단계: 갈등 제시 (Conflict)</h2>
          <p>이야기는 갈등에서 시작됩니다. 시청자의 &quot;문제&quot;나 &quot;고민&quot;을 영상 시작 부분에서 명확히 제시하세요. 예시: &quot;40대인데 노후 자금이 5,000만원밖에 없습니다. 이대로면 60대에 빈털터리가 됩니다.&quot; 이 갈등이 시청자 자신의 문제와 일치하면, 시청자는 &quot;해결책이 궁금하다&quot;는 강한 동기로 영상을 끝까지 봅니다.</p>
          <p>갈등은 구체적이고 감정적이어야 합니다. &quot;부동산 투자가 어렵다&quot; 보다 &quot;3,000만원 모았는데 어디부터 시작해야 할지 막막합니다&quot;가 더 강력합니다.</p>
          <h2>2단계: 위험 강조 (Stakes)</h2>
          <p>갈등을 해결하지 않으면 어떤 결과가 발생하는지 강조합니다. 시청자가 &quot;이걸 안 해결하면 큰일난다&quot;고 느껴야 끝까지 봅니다. 예시: &quot;이 문제를 해결하지 않으면 60대에 자녀에게 손 벌리거나, 폐지를 줍게 될 수 있습니다.&quot;</p>
          <p>위험을 강조할 때 주의점: 너무 과장하면 시청자가 거부감을 느낍니다. 현실적인 위험을 솔직하게 말하세요. 또한 위험만 강조하고 해결책을 늦게 주면 시청자가 답답해합니다. 위험 제시 후 곧바로 해결의 힌트를 줘야 합니다.</p>
          <h2>3단계: 여정 (Journey)</h2>
          <p>이제 해결 과정을 단계별로 보여줍니다. 갑자기 &quot;이렇게 하면 됩니다&quot;가 아니라, 단계별 과정을 자세히 설명합니다. 보통 3~5단계가 적당합니다. 예시: &quot;제가 직접 1년 동안 해본 결과, 다음 5단계로 5,000만원을 1억 5천만원으로 만들었습니다.&quot;</p>
          <p>각 단계마다 여러분의 &quot;실패&quot;와 &quot;성공&quot;을 모두 보여주세요. 너무 매끄러운 성공 스토리는 거짓말처럼 느껴집니다. &quot;처음에는 이런 실수를 했지만, 다음 시도에서는 이렇게 바꿨더니 성공했습니다&quot; 같은 식이 효과적입니다.</p>
          <h2>4단계: 결말과 교훈 (Resolution)</h2>
          <p>여정의 결과와 교훈을 정리합니다. 시청자에게 &quot;이 영상을 본 가치가 있었다&quot;는 만족감을 줍니다. 예시: &quot;이 5단계로 1년 만에 자산이 3배가 되었습니다. 핵심은 첫 번째 단계, 즉 자기만의 투자 원칙을 세우는 것이었습니다.&quot;</p>
          <p>결말에서 행동을 유도하세요. &quot;여러분도 오늘부터 첫 번째 단계를 시작해보세요&quot; 같은 구체적인 행동 제안. 그 다음 댓글로 결과를 공유하라고 요청하면 댓글 수가 크게 늘어납니다.</p>
          <h2>스토리텔링 응용: 정보 전달 영상에 적용</h2>
          <p>정보 전달 영상에도 스토리텔링이 가능합니다. 예: &quot;엑셀 함수 5가지&quot; 영상이라면 - 1단계 갈등: &quot;매일 야근하는 직장인의 진짜 이유&quot;, 2단계 위험: &quot;엑셀 못하면 평생 야근입니다&quot;, 3단계 여정: &quot;이 5가지 함수를 배우면 업무 시간 50% 감소&quot;, 4단계 결말: &quot;이제 정시 퇴근하세요&quot;. 단순 정보 전달보다 훨씬 흥미진진합니다.</p>
          <h2>감정 곡선 만들기</h2>
          <p>이야기는 감정의 곡선입니다. 영상 전체를 일정한 톤으로 만들면 지루합니다. 감정의 고저를 만들어야 합니다. 예시: 시작(긴장) → 위험 강조(공포) → 첫 시도 실패(좌절) → 새 방법 발견(희망) → 성공(기쁨) → 교훈(만족). 이런 감정 곡선이 시청자를 끝까지 잡아둡니다.</p>
          <h2>공감 포인트 만들기</h2>
          <p>여러분의 이야기를 시청자가 &quot;내 이야기 같다&quot;고 느끼게 만드세요. 구체적인 디테일이 공감을 만듭니다. &quot;통장 잔고를 보고 한숨 쉬었습니다&quot; 같은 디테일이 &quot;돈이 부족했다&quot;보다 100배 강력합니다.</p>
          <h2>스토리텔링 흔한 실수</h2>
          <p>실수 1: 갈등 없이 시작 - &quot;오늘은 부동산 투자에 대해 알려드립니다&quot;는 약합니다. 실수 2: 결말이 약함 - &quot;이상으로 마치겠습니다&quot;는 강한 감정을 남기지 못합니다. 실수 3: 너무 빠른 진행 - 시청자가 감정을 느낄 시간을 줘야 합니다. 실수 4: 자기 자랑 - 여러분이 주인공이 아니라, 시청자의 문제 해결이 주인공입니다.</p>
          <h2>결론: 스토리텔링이 만드는 차이</h2>
          <p>정보만 나열한 영상은 평균 조회수 1만 정도입니다. 같은 정보를 4단계 스토리텔링으로 만들면 조회수 10만이 가능합니다. 콘텐츠는 같지만 &quot;전달 방식&quot;이 모든 것을 바꿉니다. AlgoMaker는 여러분의 영상 주제를 4단계 스토리텔링 구조에 맞춘 시퀀스로 자동 생성해드립니다.</p>
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
