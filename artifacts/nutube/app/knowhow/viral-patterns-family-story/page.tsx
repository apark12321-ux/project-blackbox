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
          <Link href="/blog?cat=viral">떡상 분석</Link>
          <span className="sep">/</span>
          <span>가족 사연 채널의 떡상 패턴</span>
        </nav>

        <header className="header">
          <span className="pageBadge">💝 떡상 분석</span>
          <h1 className="title">가족 사연 채널의 떡상 패턴 - 8가지 검증된 공식</h1>
          <p className="sub">진심 담은 사연이 떡상하는 이유와 만드는 법</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 12분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>가족 사연 채널이 떡상하는 이유는 <strong>"누구나 겪었을 보편적 감정"</strong>을 건드리기 때문입니다. 화려한 사연이 아니라 평범한 일상이 더 강합니다.</div>
          </div>

          <h2>왜 가족 사연이 떡상하는가?</h2>
          <p>
            가족 이야기는 한국인 누구나 공감할 수 있는 보편적 주제입니다. 시어머니와의 갈등, 부모님께 못한 말,
            자녀 키운 이야기, 명절 에피소드 — 한 번씩 다 겪어본 일이에요.
          </p>
          <p>
            그래서 사연 채널은 <strong>구독자 수보다 댓글 수</strong>가 더 중요합니다. 비슷한 경험을 가진 사람들이
            모여서 서로 위로하는 공간이 됩니다.
          </p>

          <h2>1. 시어머니 이야기형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              시어머니와의 갈등 → 화해 → 깨달음의 구조. 정확한 시간대(결혼 직후, 출산 후 등) 명시가 중요합니다.
              담담한 톤으로 풀어내는 게 핵심.
            </p>
          </div>

          <h2>2. 부모님 회고형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              부모님께 못한 말, 부모님 보내드린 후 깨달은 것. 시청자도 자기 부모님을 떠올리며 공감.
              긴 침묵, 서두르지 않는 호흡이 중요합니다.
            </p>
          </div>

          <h2>3. 명절 에피소드형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              명절에 일어난 작은 일, 친정/시댁 풍경, 음식 이야기 등. 디테일이 살아있을수록 공감 폭발.
            </p>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>4. 자녀 키운 이야기형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              자녀 어렸을 때 사건, 사춘기 갈등, 결혼 시키는 과정. 솔직한 후회와 보람이 섞일수록 좋습니다.
            </p>
          </div>

          <h2>5. 형제·자매 관계형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              형제 간 갈등, 화해, 부모님 모시는 문제 등. 한국 가정의 보편적 갈등이라 공감대 폭발.
            </p>
          </div>

          <h2>6. 결혼 이야기형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              결혼 준비 과정, 신혼 시절, 결혼 ○년 차의 깨달음. 솔직한 후회와 행복이 섞일수록 좋습니다.
            </p>
          </div>

          <h2>7. 인생 회고형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              "○○년이 지나서야 알았다" — 시간 거리에서 오는 깨달음. 가장 진정성 있는 콘텐츠 중 하나.
            </p>
          </div>

          <h2>8. 일상 작은 사건형</h2>
          <div className="stepBox">
            <div className="stepTitle">패턴 분석</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              평범한 일상에서 일어난 작은 사건 — 이웃과의 일, 동네 가게 사장님 이야기 등. 디테일이 살아있는 게 핵심.
            </p>
          </div>

          <h2>가족 사연 영상 만드는 5가지 원칙</h2>
          <ul>
            <li><strong>구체성</strong> - "엄마가 그러시더라구요" 보다 "그날 5월 5일 오후, 엄마가 부엌에서..."</li>
            <li><strong>담담함</strong> - 울먹이거나 과장하지 않습니다. 담담할수록 진심이 전해집니다.</li>
            <li><strong>침묵</strong> - 모든 것을 말로 채우지 마세요. 시청자가 느낄 시간이 필요합니다.</li>
            <li><strong>솔직함</strong> - 본인의 잘못도 인정. 완벽한 사람의 이야기는 공감 안 됩니다.</li>
            <li><strong>보편성</strong> - 본인만의 특별한 이야기보다 "다들 한 번씩 겪는" 보편적 사건.</li>
          </ul>

          <h2>주의 사항 - 가족 사연 만들 때 조심할 점</h2>
          <ul>
            <li>가족 실명, 얼굴 노출 X - 본인이라도 가족 동의 필수</li>
            <li>특정 인물 비방 X - 갈등 이야기라도 한쪽 일방적 비난은 시청자도 불편</li>
            <li>광고/제휴 명확히 표시 - 사연 콘텐츠는 신뢰가 생명</li>
            <li>사실 왜곡 X - 각색은 OK, 거짓 X. 거짓이 드러나면 채널 사망</li>
          </ul>

          <h2>마치며</h2>
          <p>
            가족 사연 채널의 핵심은 <strong>진심</strong>입니다. 화려한 편집, 빠른 컷, 자극적 사건 다 필요 없어요.
            본인이 직접 겪은 보편적 일상을 담담하게 풀어내면 됩니다.
          </p>
          <p>
            그리고 댓글이 영상보다 중요합니다. 시청자들의 비슷한 경험 공유에 정성껏 답해주세요. 그게 다음 영상의 주제가 됩니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/viral-patterns-9-domains" className="relatedLink">
            🔥 9개 분야 떡상 영상 패턴 모음 - 27가지 →
          </Link>
          <Link href="/knowhow/viral-patterns-senior" className="relatedLink">
            🌳 시니어층이 사랑하는 떡상 패턴 5가지 →
          </Link>
          <Link href="/knowhow/family-story-shorts" className="relatedLink">
            💝 가족 사연 쇼츠로 시작하기 - 가장 쉬운 영상 수익화 →
          </Link>
          <Link href="/blog?cat=viral" className="relatedLink">
            🔗 모든 떡상 분석 보기 →
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
