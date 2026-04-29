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
          <span>구독자 1,000명 안 되어도 가능한 수익화 5가지</span>
        </nav>

        <header className="header">
          <span className="pageBadge">💰 수익화</span>
          <h1 className="title">구독자 1,000명 안 되어도 가능한 수익화 5가지</h1>
          <p className="sub">유튜브 광고 외에도 수익을 만드는 다양한 방법 정리</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 9분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 수익화의 기본 조건은 구독자 1,000명 + 시청 시간 4,000시간입니다. 이 조건을 채우는 데 보통 6개월~1년이 걸립니다. 하지만 1,000명이 안 되어도 수익을 만들 수 있는 방법이 5가지나 있습니다. 오히려 광고보다 수익률이 더 높을 수도 있습니다.</p>
          <h2>1. 제휴 마케팅 (Affiliate Marketing)</h2>
          <p>여러분이 추천하는 제품 링크를 영상 설명에 넣고, 시청자가 그 링크로 구매하면 수수료를 받는 방식입니다. 국내외 주요 쇼핑몰들이 어필리에이트 프로그램을 운영하고 있으며 가입은 무료입니다. 수수료는 보통 1~10%이며, 일부 카테고리는 20% 이상도 가능합니다.</p>
          <p>제휴 마케팅의 장점은 구독자 수와 무관하다는 것입니다. 1,000명 구독자도 적극적인 시청자라면 충분히 수익을 만들 수 있습니다. 핵심은 &quot;내가 직접 사용해본 제품&quot;만 추천하는 것입니다. 진정성이 떨어지면 구독자가 이탈합니다.</p>
          <h2>2. 디지털 상품 판매</h2>
          <p>전자책, 강의, 템플릿, 체크리스트 등 디지털 상품을 만들어 판매하는 방식입니다. 한 번 만들어두면 무한 판매가 가능합니다. 시니어가 만들기 좋은 상품 예: 1) 부동산 투자 체크리스트, 2) 50대 자산 관리 가이드 PDF, 3) 직장 생활 30년 노하우 전자책.</p>
          <p>판매 플랫폼은 다양합니다. 1) 국내 디지털 상품 마켓플레이스, 2) 온라인 강의 플랫폼, 3) IT/전문 강의 플랫폼, 4) 자체 사이트나 스마트스토어. 처음에는 5,000~10,000원짜리 작은 상품으로 시작하세요.</p>
          <h2>3. 협찬/광고 영상</h2>
          <p>구독자 1,000명만 넘어도 협찬이 들어옵니다. 내 채널의 주제와 관련된 회사들이 영상에 자사 제품을 넣어달라고 의뢰합니다. 협찬료는 보통 30~300만원 수준입니다.</p>
          <p>주의사항: 협찬 영상은 반드시 &quot;유료 광고 포함&quot;이라고 표시해야 합니다(법적 의무). 또한 채널 주제와 안 맞는 협찬은 거절하세요. 시청자 신뢰가 깨지면 장기적으로 손해입니다.</p>
          <h2>4. 멤버십/후원</h2>
          <p>유튜브 채널 멤버십 또는 외부 후원 플랫폼을 활용합니다. 1) 유튜브 채널 멤버십 - 구독자 1,000명 이상 시 가능, 월 990원~5,000원, 2) 국내외 후원 플랫폼들 (라이브 스트리밍 후원, 크리에이터 후원 사이트 등). 충성 시청자가 100명만 있어도 월 30~50만원 수익이 가능합니다.</p>
          <h2>5. 컨설팅/강의</h2>
          <p>여러분 분야의 전문성을 활용한 1:1 컨설팅이나 강의입니다. 영상이 신뢰도를 만들고, 컨설팅으로 본격 수익을 냅니다. 시니어가 잘 활용할 수 있는 분야: 1) 부동산 투자 컨설팅, 2) 자산 관리 1:1 상담, 3) 직장 멘토링, 4) 유튜브 운영 코칭.</p>
          <p>시간당 5~30만원이 보통이며, 여러분의 경험과 전문성에 따라 더 높게 받을 수도 있습니다. 영상으로 신뢰를 쌓고, 컨설팅으로 큰 수익을 만드는 구조가 가장 이상적입니다.</p>
          <h2>수익 다각화 전략</h2>
          <p>한 가지 수익원에만 의존하면 위험합니다. 5가지 방법을 동시에 활용하세요. 예시 시나리오: 채널 구독자 5,000명일 때 - 1) 광고 수익 월 30만원 + 2) 제휴 마케팅 월 50만원 + 3) 디지털 상품 월 20만원 + 4) 협찬 월 100만원 + 5) 컨설팅 월 200만원 = 월 400만원. 광고만 의존하면 월 30만원이지만, 다각화하면 월 400만원이 가능합니다.</p>
          <h2>결론: 수익화의 핵심</h2>
          <p>수익화의 핵심은 &quot;시청자에게 가치를 주는 것&quot;입니다. 단순히 광고를 노출시키는 것이 아니라, 시청자가 진짜 도움받는 콘텐츠를 만들면 수익은 자연스럽게 따라옵니다. AlgoMaker는 여러분의 분야에 맞는 콘텐츠 자료를 자동 생성해 빠르게 채널을 성장시킬 수 있게 도와드립니다.</p>
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
