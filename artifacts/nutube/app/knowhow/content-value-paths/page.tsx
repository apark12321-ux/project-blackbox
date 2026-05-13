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
          font-size: 30px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 22px; } }
        .meta {
          display: flex; justify-content: center; gap: 16px;
          font-size: 12px; color: #888; margin-top: 12px;
        }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.85; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 {
          font-size: 19px; font-weight: 800;
          color: #1a1a1a; margin: 28px 0 12px;
        }
        .content h2:first-child { margin-top: 0; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .content strong { color: #c65f3b; font-weight: 700; }
        .content ul { padding-left: 22px; margin: 12px 0 18px; }
        .content li {
          margin-bottom: 8px; font-size: 14.5px; color: #444;
          line-height: 1.7;
        }
        .highlight {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 18px 22px;
          margin: 20px 0;
        }
        .highlightLabel {
          font-size: 11px; font-weight: 800;
          color: #92400e; letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .pathCard {
          background: #fafafa;
          border-left: 4px solid #c65f3b;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
        }
        .pathTitle {
          font-size: 15px;
          font-weight: 800;
          color: #c65f3b;
          margin-bottom: 6px;
        }
        .pathDesc {
          font-size: 13.5px;
          color: #555;
          line-height: 1.7;
        }
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
          <span>영상 콘텐츠 가치 만들기</span>
        </nav>

        <header className="header">
          <span className="pageBadge">💡 영상 콘텐츠의 가치</span>
          <h1 className="title">영상 콘텐츠로 가치를 만드는 5가지 길</h1>
          <p className="sub">내가 잘하는 것을 영상으로 풀어낼 때, 다양한 길이 열립니다</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 8분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div className="highlightLabel">💡 한 줄 요약</div>
            <div>
              영상 콘텐츠는 단순히 보여주는 것을 넘어, <strong>내 경험과 진심이 다른 사람에게 닿는
              통로</strong>입니다. 같은 키워드라도 100명이 풀어내면 100가지 다른 이야기가 됩니다.
              본인만의 색깔이 곧 콘텐츠의 가치입니다.
            </div>
          </div>

          <h2>왜 영상 콘텐츠인가요?</h2>
          <p>
            글이나 이미지로는 전하기 어려운 분위기, 표정, 목소리의 떨림 — 영상은 이 모든 것을 한 번에
            담을 수 있습니다. 정보 전달뿐 아니라 <strong>감정의 공유</strong>가 가능한 매체이기에,
            영상으로 풀어낸 이야기는 다른 어떤 형식보다 깊게 닿습니다.
          </p>
          <p>
            특히 디지털 도구가 익숙하지 않은 시니어층에게는 영상이 가장 친숙한 콘텐츠 형식입니다.
            만드는 사람도, 보는 사람도 영상이라는 공감대 위에서 만나게 됩니다.
          </p>

          <h2>같은 키워드, 100가지 다른 이야기</h2>
          <p>
            "부동산"이라는 한 단어로도 100명의 영상 제작자가 모이면 100가지 다른 이야기가 만들어집니다.
            누군가는 자녀에게 들려주고 싶은 청약 이야기, 누군가는 30년 살아온 동네의 기록, 누군가는
            처음 집을 산 날의 떨림을 담을 수 있습니다.
          </p>
          <p>
            <strong>"내가 만드는 영상이 누구에게 도움이 될까"</strong>라는 질문에서 시작하면,
            내 영상의 가치는 자연스럽게 따라옵니다. 나만 할 수 있는 이야기, 내 색깔이 묻은 표현 —
            그것이 진짜 차별화입니다.
          </p>

          <h2>영상 콘텐츠로 만드는 5가지 가치</h2>

          <div className="pathCard">
            <div className="pathTitle">📚 1. 지식과 경험의 공유</div>
            <div className="pathDesc">
              내가 살면서 쌓아온 작은 경험들이, 시작하는 누군가에게는 큰 도움이 됩니다.
              "평범하다"고 느끼는 일상의 노하우 — 자취 요리, 가전제품 고치기, 동네 맛집 정보 —
              모두 누군가가 찾고 있는 콘텐츠입니다.
            </div>
          </div>

          <div className="pathCard">
            <div className="pathTitle">💝 2. 진심 담은 사연과 공감</div>
            <div className="pathDesc">
              가족, 친구, 인생의 굽이굽이 — 누구나 한 번쯤 겪었을 이야기를 담담하게 풀어내는 것만으로도
              많은 사람의 마음을 따뜻하게 만들 수 있습니다. 비슷한 고민을 가진 사람들이 댓글로 모여
              서로 위로하는 공간이 됩니다.
            </div>
          </div>

          <div className="pathCard">
            <div className="pathTitle">🎯 3. 한 분야에 대한 꾸준한 전문성</div>
            <div className="pathDesc">
              부동산, 재테크, 건강, 요리, 육아 — 한 분야를 꾸준히 다루다 보면 그 분야에서 신뢰가
              쌓입니다. 화려하지 않아도 좋습니다. <strong>꾸준함이 곧 전문성</strong>입니다.
              5년, 10년 쌓인 콘텐츠는 그 자체로 자산이 됩니다.
            </div>
          </div>

          <div className="pathCard">
            <div className="pathTitle">🎨 4. 취미와 일상의 즐거움</div>
            <div className="pathDesc">
              여행, 손글씨, 캘리그라피, 베이킹, 식물 키우기 — 즐기는 일을 영상으로 풀어내면 그 즐거움이
              화면 너머로 전해집니다. 같은 취미를 가진 사람들과 자연스럽게 연결되는 통로가 됩니다.
            </div>
          </div>

          <div className="pathCard">
            <div className="pathTitle">🌱 5. 시니어 라이프 — 따뜻한 시선</div>
            <div className="pathDesc">
              50대, 60대, 70대만이 가질 수 있는 시선이 있습니다. 자녀와의 이야기, 은퇴 이후의 새로운
              삶, 동네에서 만난 사람들 — 다른 세대가 진심으로 듣고 싶어 하는 이야기입니다. 이 분야는
              앞으로 더 커질 시장입니다.
            </div>
          </div>

          <h2>"영상 만들기, 어렵지 않을까요?"</h2>
          <p>
            가장 큰 진입 장벽이 "기술적 어려움"입니다. 카메라 앞에 서야 한다는 부담, 편집 프로그램
            배우는 시간, 썸네일 만드는 디자인 감각 — 시작하기 전에 포기하게 만드는 것들이 많습니다.
          </p>
          <p>
            하지만 이제는 다릅니다. <strong>키워드만 입력하면 AI가 대본부터 영상 자료, 자막까지
            모두 만들어줍니다.</strong> 얼굴 노출 없이 자막과 음성, 이미지만으로도 충분한 영상을
            만들 수 있는 시대입니다. 디지털 도구가 익숙하지 않으셔도 1분 안에 영상 자료가 완성됩니다.
          </p>

          <h2>처음 시작하시는 분들을 위한 단계</h2>
          <p>
            <strong>1) 분야 정하기</strong> — 내가 1년 넘게 해온 일, 익숙한 일, 좋아하는 일 중에서
            골라보세요. 9개 분야(부동산, 영어, 다이어트, 자기계발, AI, 시니어, 가족 사연, 요리, 여행)
            중 하나로 자동 분류됩니다.
          </p>
          <p>
            <strong>2) 키워드 입력하기</strong> — 분야 안에서 가장 다루고 싶은 주제 한 단어. 떠오르는
            그 단어가 정답입니다. AI가 그 키워드에 맞는 7단계 영상 시나리오를 자동으로 만들어드립니다.
          </p>
          <p>
            <strong>3) 일주일에 한 편씩</strong> — 처음부터 매일 올리려 하면 지칩니다. 한 편을 진심을
            담아 만드는 게 더 중요합니다. 한 달에 4편이면 1년에 50편입니다.
          </p>
          <p>
            <strong>4) 댓글로 시청자와 대화하기</strong> — 영상보다 댓글이 더 중요할 수 있습니다.
            댓글에 진심으로 답하다 보면 다음 영상의 주제가 자연스럽게 떠오릅니다.
          </p>
          <p>
            <strong>5) 자기 색깔 지키기</strong> — 떡상 채널을 따라 하다가 본인 색깔을 잃지 마세요.
            오히려 본인만의 톤이 시청자에게 신뢰를 줍니다.
          </p>

          <h2>"무엇을 다뤄야 할지 모르겠어요"</h2>
          <p>
            가장 흔한 고민입니다. 답은 의외로 간단해요. <strong>"내 옆 사람이 자주 물어보는 것"</strong>
            을 떠올려보세요.
          </p>
          <ul>
            <li>친구가 자주 묻는 요리 비법 → 요리 콘텐츠</li>
            <li>자녀가 자주 묻는 인생 조언 → 시니어 라이프 콘텐츠</li>
            <li>회사 후배가 자주 묻는 업무 팁 → 자기계발 콘텐츠</li>
            <li>가족이 함께 본 드라마 이야기 → 사연/감동 콘텐츠</li>
          </ul>
          <p>
            남들이 자주 물어본다는 것 = 그만큼 많은 사람이 궁금해한다는 뜻입니다. 본인에게는 평범한
            것이 다른 사람에겐 절실한 정보일 수 있습니다.
          </p>

          <h2>마치며 — 영상은 통로입니다</h2>
          <p>
            영상 콘텐츠를 시작하는 가장 좋은 이유는 "결과"가 아니라 "과정"입니다. 영상을 만들다 보면
            내가 어떤 이야기를 가진 사람인지, 어떤 시선으로 세상을 보는 사람인지 자연스럽게 정리됩니다.
            그 과정 자체가 가치입니다.
          </p>
          <p>
            그리고 그 영상이 어떤 형태로든 누군가의 마음에 닿는다면 — 그게 가장 큰 보상입니다.
            지금 바로 키워드 하나 떠올려보세요. 거창하지 않아도 됩니다. 그 키워드 하나로 시작됩니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 노하우</div>
          <Link href="/knowhow/family-story-shorts" className="relatedLink">
            💝 가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 모델 →
          </Link>
          <Link href="/knowhow/middle-aged-channel-tips" className="relatedLink">
            👴 시니어층이 유튜브 시작할 때 꼭 알아야 할 7가지 →
          </Link>
          <Link href="/knowhow/storytelling-structure" className="relatedLink">
            🎬 스토리텔링 구조 - 시청자를 사로잡는 5단계 →
          </Link>
          <Link href="/blog" className="relatedLink">
            🏠 모든 노하우 보기 →
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
