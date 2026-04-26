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
          <span>유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🏷️ SEO 태그</span>
          <h1 className="title">유튜브 SEO 태그 최적화 - 검색 노출 3배 늘리는 법</h1>
          <p className="sub">키워드 분석부터 태그 배치까지 검색 상위 노출 완벽 가이드</p>
          <div className="meta">
            <span>📅 2026.04.24</span>
            <span>⏱️ 9분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브에서 영상의 70%는 검색이 아닌 추천으로 시청됩니다. 하지만 검색 트래픽도 무시할 수 없습니다. 특히 신규 채널은 검색을 통해 첫 시청자를 모을 수 있는 중요한 통로입니다. SEO 태그를 제대로 최적화하면 같은 영상도 검색 노출량이 3배 이상 늘어납니다.</p>
          <h2>1. 메인 키워드 선정하는 법</h2>
          <p>영상 하나당 메인 키워드 1개를 정합니다. 메인 키워드는 영상의 핵심을 가장 잘 표현하는 검색어입니다. 예: &quot;40대 부동산 투자&quot;, &quot;하루 10분 영어 회화&quot;. 메인 키워드 선정 시 다음 3가지를 고려하세요. 1) 검색량(월 1만회 이상), 2) 경쟁도(낮을수록 좋음), 3) 박 대표님 채널과의 연관성.</p>
          <h2>2. 무료 키워드 분석 도구</h2>
          <p>유료 도구 없이도 키워드 분석이 가능합니다. 1) Google 검색의 자동완성 - 검색창에 키워드 입력 시 나오는 추천어가 인기 키워드, 2) Google Trends - 시간별 검색량 추이 확인, 3) 유튜브 검색창의 자동완성, 4) AnswerThePublic - 질문 형식 키워드 발굴, 5) Keyword Tool - 유튜브 전용 키워드 추천.</p>
          <h2>3. 태그 작성 7가지 원칙</h2>
          <p>원칙 1: 첫 번째 태그가 가장 중요합니다. 메인 키워드를 첫 번째 태그로 입력하세요. 원칙 2: 메인 키워드 + 변형 3~5개를 태그에 포함합니다. 예: &quot;40대 부동산&quot;, &quot;40대 부동산 투자&quot;, &quot;부동산 투자 40대&quot;.</p>
          <p>원칙 3: 롱테일 키워드를 포함합니다. &quot;40대 부동산 투자 시작하는 법&quot; 같은 긴 키워드가 경쟁이 낮아 노출되기 쉽습니다. 원칙 4: 채널 브랜드명을 태그에 추가하세요. 같은 채널의 다른 영상이 추천될 가능성이 높아집니다. 원칙 5: 트렌드 키워드를 활용합니다. 시즌별, 이슈별 키워드를 1~2개 포함하세요.</p>
          <p>원칙 6: 태그는 8~15개가 적정입니다. 너무 적어도, 너무 많아도 효과가 떨어집니다. 원칙 7: 영상과 무관한 태그는 절대 사용하지 마세요. 알고리즘이 &quot;이 영상은 신뢰할 수 없다&quot;고 판단합니다.</p>
          <h2>4. 영상 설명란 SEO 최적화</h2>
          <p>영상 설명란도 검색 노출에 영향을 줍니다. 첫 200자 안에 메인 키워드를 2~3번 자연스럽게 포함하세요. 예: &quot;이 영상은 40대 부동산 투자 시작하는 법을 알려드립니다. 40대 부동산 투자의 핵심 5가지를 정리했습니다...&quot;. 설명은 최소 250자 이상 작성하는 것이 좋습니다.</p>
          <h2>5. 챕터(타임스탬프) 활용</h2>
          <p>영상 설명에 타임스탬프를 추가하면 SEO에 매우 효과적입니다. 예: &quot;00:00 인트로 / 01:30 첫 번째 방법 / 03:00 두 번째 방법&quot;. 챕터 제목 자체가 검색 키워드로 작용합니다. 또한 시청자가 원하는 부분만 골라볼 수 있어 시청 유지율도 올라갑니다.</p>
          <h2>6. 자막 자동 생성 활용</h2>
          <p>유튜브는 영상의 자막을 분석해 검색 키워드를 추출합니다. 자동 자막은 한국어 정확도가 낮으므로, 직접 자막 파일을 업로드하거나 영상 내 자막을 깨끗이 만드세요. 자막에 메인 키워드와 관련 키워드가 자연스럽게 포함되도록 영상 대본을 작성하세요.</p>
          <h2>7. 해시태그 활용 (#태그)</h2>
          <p>영상 설명 첫 부분이나 제목에 해시태그를 3개까지 사용할 수 있습니다. 해시태그를 클릭하면 같은 해시태그를 단 영상들이 모두 표시됩니다. 메인 키워드 해시태그 + 채널 브랜드 해시태그 + 시즌 해시태그를 조합하세요.</p>
          <h2>결론: SEO 태그 체크리스트</h2>
          <p>영상 업로드 전 다음 7가지를 확인하세요. 1) 메인 키워드 정했는가, 2) 첫 태그가 메인 키워드인가, 3) 변형 키워드 3~5개 포함했는가, 4) 롱테일 키워드 추가했는가, 5) 설명란 첫 200자에 키워드 2~3번 포함했는가, 6) 타임스탬프 추가했는가, 7) 해시태그 3개 사용했는가. AlgoMaker는 키워드 분석된 태그 15개를 자동으로 추천해드립니다.</p>
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
