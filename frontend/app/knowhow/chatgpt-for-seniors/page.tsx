'use client';
import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 24px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 30px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.025em; margin: 0 0 12px; }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 22px; } }
        .meta { display: flex; justify-content: center; gap: 16px; font-size: 12px; color: #888; margin-top: 12px; }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.85; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 { font-size: 19px; font-weight: 800; color: #1a1a1a; margin: 28px 0 12px; }
        .content h2:first-child { margin-top: 0; }
        .content h3 { font-size: 16px; font-weight: 700; color: #c65f3b; margin: 20px 0 10px; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .content strong { color: #c65f3b; font-weight: 700; }
        .content ul { padding-left: 22px; margin: 12px 0 18px; }
        .content li { margin-bottom: 8px; font-size: 14.5px; color: #444; line-height: 1.7; }
        .highlight {
          background: linear-gradient(135deg, #fff7ed 0%%, #fef3c7 100%%);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 18px 22px;
          margin: 20px 0;
        }
        .stepBox {
          background: #fafafa;
          border-left: 4px solid #c65f3b;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
        }
        .stepTitle { font-size: 15px; font-weight: 800; color: #c65f3b; margin-bottom: 6px; }
        .adArea { margin: 32px 0; }
        .related { margin-top: 32px; padding: 24px; background: #fafafa; border-radius: 12px; }
        .relatedTitle { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px; }
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
          .stepBox { padding: 14px 16px !important; }
          .stepTitle { font-size: 14.5px !important; }
          .highlight { padding: 16px 18px !important; }
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
          <Link href="/blog?cat=ai">AI 도구</Link>
          <span className="sep">/</span>
          <span>ChatGPT 시니어층 활용법</span>
        </nav>

        <header className="header">
          <span className="pageBadge">💬 AI 도구</span>
          <h1 className="title">ChatGPT 시니어층 활용법<br />영상 대본 만들기</h1>
          <p className="sub">복잡한 명령 없이 간단하게 대본 받는 5가지 질문 패턴</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 9분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>ChatGPT는 어렵지 않아요. <strong>5가지 질문 패턴만 알면</strong> 시니어층도 영상 대본 받을 수 있습니다.</div>
          </div>

          <h2>ChatGPT 시작하기 (10분)</h2>
          <p><strong>1단계</strong> - 핸드폰 또는 컴퓨터에서 chat.openai.com 접속</p>
          <p><strong>2단계</strong> - 회원가입 (구글/카카오 연동 가능)</p>
          <p><strong>3단계</strong> - 가운데 입력창에 질문 입력</p>
          <p><strong>4단계</strong> - 답변 받기</p>

          <h2>질문 패턴 1 - 영상 대본 받기</h2>
          <div className="stepBox">
            <div className="stepTitle">예시 질문</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555', fontStyle: 'italic'}}>
              "60대 시니어층을 위한 핸드폰 사진 찍는 법, 5분 영상 대본 써줘. 친근한 톤으로."
            </p>
          </div>
          <p style={{fontSize: '13.5px', color: '#555'}}>
            <strong>핵심 요소 4가지</strong>: 타겟(누구를 위한), 주제, 영상 길이, 톤(친근/전문/감동)
          </p>

          <h2>질문 패턴 2 - 영상 제목 만들기</h2>
          <div className="stepBox">
            <div className="stepTitle">예시 질문</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555', fontStyle: 'italic'}}>
              "○○ 주제 영상 제목 5개 추천해줘. 시니어층이 클릭하고 싶은 톤으로."
            </p>
          </div>
          <p style={{fontSize: '13.5px', color: '#555'}}>
            여러 개 받아서 본인 마음에 드는 거 고르면 됩니다.
          </p>

          <h2>질문 패턴 3 - 후크(시작 30초) 만들기</h2>
          <div className="stepBox">
            <div className="stepTitle">예시 질문</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555', fontStyle: 'italic'}}>
              "○○ 영상의 시작 30초 후크 3가지 써줘. 시청자가 끝까지 보고 싶게."
            </p>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>질문 패턴 4 - 영상 설명 만들기</h2>
          <div className="stepBox">
            <div className="stepTitle">예시 질문</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555', fontStyle: 'italic'}}>
              "○○ 영상의 유튜브 설명문 써줘. 첫 줄에 핵심, 검색 잘 되는 키워드 포함."
            </p>
          </div>

          <h2>질문 패턴 5 - 태그 추천</h2>
          <div className="stepBox">
            <div className="stepTitle">예시 질문</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555', fontStyle: 'italic'}}>
              "○○ 영상에 어울리는 유튜브 태그 13개 추천해줘. 검색 잘 되는 걸로."
            </p>
          </div>

          <h2>ChatGPT 잘 활용하는 5가지 팁</h2>
          <ul>
            <li><strong>구체적으로 질문</strong> - "영상 대본" 보다 "60대용 5분 핸드폰 영상 대본"</li>
            <li><strong>톤 명시</strong> - 친근/전문/감동 등 원하는 톤 명시</li>
            <li><strong>여러 번 묻기</strong> - 한 번에 만족 안 되면 "다른 스타일로" 요청</li>
            <li><strong>본인 색깔로 수정</strong> - 그대로 쓰지 말고 본인 톤으로 다듬기</li>
            <li><strong>사실 확인</strong> - 중요 정보는 별도 검증</li>
          </ul>

          <h2>주의 - ChatGPT가 잘못하는 것 3가지</h2>
          <ul>
            <li>최신 정보 - 작년 데이터까지만 알 수 있어요</li>
            <li>사실 거짓말 - 자신감 있게 틀린 답을 줄 때 있음</li>
            <li>한국 문화 디테일 - 일반적이지만 디테일 부족</li>
          </ul>

          <h2>마치며</h2>
          <p>
            ChatGPT는 영상 만들기 시간을 크게 줄여줍니다. 하지만 <strong>본인 색깔과 진심은 본인이 채워야 해요</strong>.
            ChatGPT는 좋은 보조 도구일 뿐, 본인을 대체하지는 않습니다.
          </p>
          <p>
            처음에는 어색하게 느껴질 수 있지만, 5번만 사용해보시면 익숙해집니다. 50대~70대 시니어 분들도 충분히 사용하실 수 있어요.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/ai-tools-for-seniors" className="relatedLink">
            🤖 시니어층이 영상 만들 때 쓸 만한 무료 AI 도구 5가지 →
          </Link>
          <Link href="/knowhow/storytelling-structure" className="relatedLink">
            📖 오래 보는 영상의 스토리텔링 구조 분석 →
          </Link>
          <Link href="/knowhow/ctr-title-secrets" className="relatedLink">
            ✏️ 클릭률 8% 이상 만드는 제목 작성법 →
          </Link>
          <Link href="/blog?cat=ai" className="relatedLink">
            🔗 모든 AI 도구 보기 →
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
