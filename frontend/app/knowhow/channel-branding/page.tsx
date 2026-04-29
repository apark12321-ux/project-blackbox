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
          <span>기억에 남는 채널 브랜딩 만드는 7가지 요소</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🎨 채널 브랜딩</span>
          <h1 className="title">기억에 남는 채널 브랜딩 만드는 7가지 요소</h1>
          <p className="sub">구독자가 다른 영상에서도 한눈에 알아보는 채널 만들기</p>
          <div className="meta">
            <span>📅 2026.04.25</span>
            <span>⏱️ 10분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브에는 매분 500시간의 영상이 업로드됩니다. 이 무한한 콘텐츠 사이에서 시청자가 내 채널을 기억하게 만드는 것은 &quot;브랜딩&quot;입니다. 브랜딩이 잘 된 채널은 같은 콘텐츠도 더 많이 시청되고, 더 많이 구독됩니다.</p>
          <h2>1. 채널명 - 짧고 기억하기 쉽게</h2>
          <p>좋은 채널명의 조건: 1) 5글자 이내(한국어) 또는 12자 이내(영어), 2) 발음하기 쉬움, 3) 한 번 듣고 기억할 수 있음, 4) 검색하기 쉬움. 좋은 예시 패턴은 인물 이름 한 단어, 짧은 슬로건형, 캐릭터 이름 등입니다. 나쁜 예: 너무 길거나(&quot;40대 직장인의 부동산 투자 일기&quot;), 발음하기 어렵거나, 다른 채널과 헷갈리는 이름.</p>
          <h2>2. 채널 로고 - 시각적 정체성</h2>
          <p>채널 로고는 800x800px 정사각형 이미지입니다. 작은 크기에서도 알아보기 쉬워야 합니다. 좋은 로고의 조건: 1) 단순함, 2) 색상 2~3개 이내, 3) 글자보다 도형 + 짧은 글자, 4) 채널 컨셉을 시각적으로 표현. 무료 디자인 도구: Canva(추천), Figma.</p>
          <h2>3. 채널 아트 - 첫인상의 90%</h2>
          <p>채널 아트는 시청자가 채널 페이지에 들어왔을 때 처음 보는 이미지입니다. 사이즈: 2560x1440px (모바일/데스크톱 모두 보이는 안전 영역: 1546x423px). 좋은 채널 아트의 요소: 1) 채널명 또는 슬로건, 2) 여러분 사진 또는 캐릭터, 3) 업로드 일정 표시 (예: 매주 수요일 20시), 4) SNS 정보.</p>
          <h2>4. 색상 - 일관된 컬러 팔레트</h2>
          <p>채널의 모든 콘텐츠(썸네일, 자막, 효과 등)에 일관된 색상 팔레트를 사용하세요. 메인 색상 1개 + 보조 색상 2~3개로 구성합니다. 예를 들어 노랑+검정 같은 강한 대비 조합은 시각적 인식을 빠르게 만듭니다. 일관된 색상이 반복되면 시청자가 다른 영상에서도 한눈에 채널을 알아봅니다. 여러분도 채널 컨셉에 맞는 색상 2~3개를 정해 모든 영상에 적용하세요.</p>
          <h2>5. 폰트 - 일관된 타이포그래피</h2>
          <p>썸네일, 자막, 채널 아트에 같은 폰트 또는 비슷한 스타일의 폰트를 사용하세요. 한글 추천 폰트: 나눔스퀘어 EB(굵음), 프리텐다드(가독성), G마켓 산스(트렌디). 폰트가 일관되면 시청자가 &quot;아, 이 채널 영상이구나&quot; 하고 한눈에 알아봅니다.</p>
          <h2>6. 인트로/아웃트로 - 시그니처 패턴</h2>
          <p>영상 시작 부분(0~5초)과 끝 부분(마지막 30초)에 같은 패턴을 적용합니다. 인트로 예: &quot;안녕하세요, [채널명]의 [본인 이름]입니다. 오늘은 [주제]를 알려드릴게요.&quot; 아웃트로 예: &quot;오늘 영상 도움이 되셨다면 좋아요와 구독 부탁드립니다. 다음 영상에서 만나요.&quot;</p>
          <p>다만 너무 길거나 화려한 인트로는 시청자를 쫓아냅니다. 5초 이내, 단순하게 만드세요.</p>
          <h2>7. 채널 슬로건 - 한 문장으로 표현</h2>
          <p>내 채널을 한 문장으로 표현해보세요. 이 문장이 시청자가 &quot;이 채널을 왜 봐야 하는지&quot; 알려주는 강력한 도구입니다. 예시: &quot;40대를 위한 가장 현실적인 재테크&quot;, &quot;하루 5분으로 인생을 바꾸는 습관 강의&quot;, &quot;대화로 풀어가는 부동산 이야기&quot;. 채널 아트와 영상 설명에 슬로건을 자주 노출하세요.</p>
          <h2>브랜딩의 4가지 일관성</h2>
          <p>1) 시각적 일관성 - 색상, 폰트, 로고가 모든 콘텐츠에 동일. 2) 톤앤매너 일관성 - 말투, 표현 방식이 항상 동일(친근/전문 등). 3) 콘텐츠 일관성 - 비슷한 주제와 형식의 영상. 4) 업로드 일관성 - 정해진 요일/시간에 정기 업로드. 이 4가지가 모두 일관되면 강력한 브랜드가 만들어집니다.</p>
          <h2>브랜딩 점진적 강화 전략</h2>
          <p>처음부터 완벽한 브랜딩을 만들 필요는 없습니다. 단계별로 강화하세요. 1단계 (영상 1~10개): 채널명, 로고, 기본 채널 아트. 2단계 (영상 10~30개): 일관된 썸네일 스타일, 폰트 통일. 3단계 (영상 30개 이상): 슬로건, 인트로/아웃트로, 시그니처 BGM. 4단계 (구독자 1만 이상): 전문 디자이너 협업, 시리즈 콘텐츠 브랜드화.</p>
          <h2>브랜딩 흔한 실수</h2>
          <p>실수 1: 너무 자주 변경. 한번 정한 브랜딩은 최소 6개월 유지하세요. 실수 2: 트렌드만 따라가기. 본인 채널의 정체성이 더 중요합니다. 실수 3: 너무 복잡한 디자인. 단순할수록 기억하기 쉽습니다. 실수 4: 채널명에 너무 많은 정보. &quot;40대 직장인 김부장의 부동산 투자 채널&quot;보다 &quot;김부장의 부동산&quot;이 좋습니다.</p>
          <h2>결론: 브랜딩의 본질</h2>
          <p>브랜딩의 본질은 &quot;시청자의 기억에 남는 것&quot;입니다. 7가지 요소를 모두 갖추지 못해도 괜찮습니다. 단 한 가지(채널명, 색상, 슬로건 중 하나)라도 강력하면 충분합니다. 처음에는 채널명과 로고부터 잘 정하고, 시간이 지나면서 점진적으로 강화하세요. AlgoMaker는 내 채널 컨셉에 맞는 콘텐츠 자료를 일관되게 생성해 브랜딩 강화에 도움이 됩니다.</p>
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
