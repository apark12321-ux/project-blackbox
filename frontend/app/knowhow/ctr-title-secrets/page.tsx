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
          <span>클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지</span>
        </nav>

        <header className="header">
          <span className="pageBadge">✏️ 제목 노하우</span>
          <h1 className="title">클릭률(CTR) 8% 이상 만드는 제목 작성법 18가지</h1>
          <p className="sub">유튜브 알고리즘이 좋아하는 제목 패턴과 실제 성공 사례 분석</p>
          <div className="meta">
            <span>📅 2026.04.21</span>
            <span>⏱️ 10분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 영상의 운명은 90%가 제목에서 결정됩니다. 아무리 좋은 콘텐츠도 클릭되지 않으면 알고리즘에 노출되지 않습니다. 평균 CTR은 4~6%이지만, 8% 이상을 만들면 알고리즘이 적극 노출시켜 조회수가 폭발적으로 증가합니다. 이 글에서는 검증된 제목 작성 패턴 18가지를 카테고리별로 정리합니다.</p>
          <h2>패턴 1-6: 호기심을 자극하는 제목</h2>
          <p>첫 번째는 의외성 강조 패턴입니다. 예: &quot;40대가 50대보다 가난한 진짜 이유&quot;. 일반적인 상식과 반대되는 내용으로 호기심을 자극합니다. 두 번째는 비밀 공개 패턴입니다. 예: &quot;강남 부동산 부자들만 아는 절세 비밀 3가지&quot;. &quot;비밀&quot;, &quot;공개&quot;, &quot;숨겨진&quot; 등의 단어가 강력합니다. 세 번째는 충격적 결과를 보여주는 것입니다. 예: &quot;6개월 만에 통장 잔고 -3,000만원에서 +1억으로&quot;. 구체적 숫자와 극적 변화를 보여줍니다.</p>
          <p>네 번째는 질문형 제목입니다. 예: &quot;왜 한국인은 50대에 돈이 없을까?&quot;. 질문은 자동으로 답을 찾고 싶게 만듭니다. 다섯 번째는 역설적 표현입니다. 예: &quot;적게 일하고 많이 버는 사람들의 7가지 습관&quot;. 모순처럼 보이는 조합이 호기심을 자극합니다. 여섯 번째는 금기어 활용입니다. 예: &quot;부자들이 절대 말하지 않는 투자 비밀&quot;.</p>
          <h2>패턴 7-12: 숫자를 활용하는 제목</h2>
          <p>일곱 번째는 시간 명시입니다. 예: &quot;하루 10분으로 영어 회화 마스터하는 법&quot;. 짧은 시간을 강조하면 진입 장벽이 낮아집니다. 여덟 번째는 단계 명시입니다. 예: &quot;부동산 투자 5단계 절차 완벽 정리&quot;. 3단계, 5단계, 7단계가 가장 효과적입니다. 아홉 번째는 결과 수치입니다. 예: &quot;체중 -15kg 감량한 직장인의 3가지 비결&quot;. 구체적 결과가 신뢰를 줍니다.</p>
          <p>열 번째는 가격/비용 명시입니다. 예: &quot;월 50만원으로 시작하는 자산 1억 만들기&quot;. 시작 비용이 낮을수록 매력적입니다. 열한 번째는 나이 그룹 타겟팅입니다. 예: &quot;40대가 반드시 알아야 할 노후 준비 7가지&quot;. 시청자가 자신을 대입할 수 있게 합니다. 열두 번째는 TOP 리스트 형식입니다. 예: &quot;한국에서 가장 돈 잘 버는 N잡 TOP 10&quot;. 순위는 자동으로 끝까지 보고 싶게 만듭니다.</p>
          <h2>패턴 13-18: 감정을 자극하는 제목</h2>
          <p>열세 번째는 후회/실수 강조입니다. 예: &quot;50대 되어 후회하는 30대의 5가지 실수&quot;. 부정적 감정이 강력한 동기를 만듭니다. 열네 번째는 두려움/경고입니다. 예: &quot;이거 모르고 투자하면 평생 후회합니다&quot;. 위험 회피 본능을 자극합니다. 열다섯 번째는 권위 활용입니다. 예: &quot;30년 차 부동산 전문가가 알려주는 매수 타이밍&quot;. 전문성을 강조하면 신뢰가 올라갑니다.</p>
          <p>열여섯 번째는 개인 경험 강조입니다. 예: &quot;제가 직접 1년간 해본 결과&quot;. 경험담은 진정성을 줍니다. 열일곱 번째는 비교형입니다. 예: &quot;부자 vs 가난한 사람의 사고방식 차이&quot;. 비교는 명확한 통찰을 줍니다. 마지막 열여덟 번째는 시리즈 제목입니다. 예: &quot;부동산 투자 마스터 시리즈 - 1편: 입지 분석&quot;. 시리즈는 다음 영상을 보게 만듭니다.</p>
          <h2>제목 작성 5가지 체크리스트</h2>
          <p>좋은 제목은 다음 5가지를 충족합니다. 1) 60자 이내(모바일에서 잘리지 않게), 2) 숫자 1개 이상 포함, 3) 감정 자극 단어 1개 이상, 4) 타겟 시청자 명시(40대, 직장인 등), 5) 영상에서 정확히 전달할 수 있는 약속만 담기. 제목을 만들 때마다 이 5가지를 체크하세요. AlgoMaker는 키워드를 입력하면 18가지 패턴에 맞춰 최적의 제목 3개를 자동으로 생성해드립니다.</p>
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
