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
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog?cat=viral">떡상 분석</Link>
          <span className="sep">/</span>
          <span>시니어층이 사랑하는 떡상 패턴</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🌳 떡상 분석</span>
          <h1 className="title">시니어층이 사랑하는 떡상 영상 패턴 5가지</h1>
          <p className="sub">50대~70대 시청자가 끝까지 보는 영상의 공통점</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 10분 읽기</span>
          </div>
        </header>

        <article className="content">
          <div className="highlight">
            <div style={{fontSize: '11px', fontWeight: 800, color: '#92400e', marginBottom: '8px', letterSpacing: '0.05em'}}>💡 한 줄 요약</div>
            <div>시니어층이 좋아하는 영상은 <strong>"비슷한 처지의 사람이 만든 진심 어린 이야기"</strong>입니다. 화려함보다 공감, 빠름보다 느림이 통합니다.</div>
          </div>

          <h2>1. 인생 회고형 - "○○년이 지나서야 알았어요"</h2>
          <p>
            시니어층이 가장 깊이 공감하는 패턴입니다. 시간이 지나서 깨달은 이야기는 가장 진정성이 있어요.
            "젊었을 때 알았으면 좋았을 것"이라는 메시지는 시청자도 자기 인생을 돌아보게 만듭니다.
          </p>
          <div className="stepBox">
            <div className="stepTitle">📝 만드는 법</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              본인 인생에서 후회가 있던 일 1가지 → 그때는 몰랐고 지금은 아는 것 → 시청자에게 주는 조언.
              담담한 톤으로 10분 정도면 충분합니다.
            </p>
          </div>

          <h2>2. 가족 사연형 - "우리 가족 이야기인데..."</h2>
          <p>
            진심 어린 사연은 깊은 공감을 만듭니다. 시어머니, 친정 부모, 자녀 이야기 등 시니어층 누구나 겪었을
            보편적 경험이 가장 강력합니다.
          </p>
          <div className="stepBox">
            <div className="stepTitle">📝 만드는 법</div>
            <p style={{margin: '6px 0 0', fontSize: '13.5px', color: '#555'}}>
              구체적 사건 1개를 떠올리세요. 시간순으로 풀어서 이야기하면 됩니다. 댓글에 비슷한 경험 공유가 활발해집니다.
            </p>
          </div>

          <h2>3. 인생 2막형 - "은퇴 후 새로운 도전"</h2>
          <p>
            은퇴 후 새 인생 시작 이야기는 비슷한 처지의 시청자들에게 큰 동기부여가 됩니다. 등산, 텃밭, 새 취미, 봉사활동 등
            소재는 무궁무진합니다.
          </p>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>4. 디지털 입문형 - "핸드폰만 있으면 가능"</h2>
          <p>
            시니어층이 진입 장벽으로 느끼는 디지털 도구를 천천히 안내해주는 영상입니다. 큰 글씨, 화면 캡처, 단계별 설명이
            핵심입니다. 저장률이 매우 높습니다.
          </p>

          <h2>5. 나이 가능성형 - "○○세에 시작했습니다"</h2>
          <p>
            나이를 강조하면서 시작 이야기를 풀어내는 패턴입니다. 60대에 영어 시작, 70대에 유튜브 시작 같은 이야기는
            시니어 시청자의 마음을 움직입니다. 댓글에 비슷한 시작 이야기가 모입니다.
          </p>

          <h2>시니어층 영상의 공통 원칙 4가지</h2>
          <ul>
            <li><strong>천천히 말하기</strong> - 빠른 컷보다 또박또박. 시니어 시청자가 따라가기 편합니다.</li>
            <li><strong>큰 자막</strong> - 글자 크기를 평소보다 크게. 들리지 않아도 읽을 수 있게.</li>
            <li><strong>진심 담기</strong> - 정보보다 감정. 시니어 시청자는 진심을 더 잘 알아봅니다.</li>
            <li><strong>꾸준함</strong> - 빠른 떡상보다 1년 꾸준함. 시니어층 채널은 시간이 가야 빛납니다.</li>
          </ul>

          <h2>마치며</h2>
          <p>
            시니어층 시청자가 좋아하는 건 화려한 효과가 아니에요. <strong>비슷한 처지의 사람이 진심으로 풀어내는 이야기</strong>입니다.
            본인 인생에서 가장 진심이 담긴 이야기 하나면 충분합니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/viral-patterns-9-domains" className="relatedLink">
            🔥 9개 분야 떡상 영상 패턴 모음 - 27가지 검증된 공식 →
          </Link>
          <Link href="/knowhow/viral-patterns-family-story" className="relatedLink">
            💝 가족 사연 채널의 떡상 패턴 - 8가지 →
          </Link>
          <Link href="/knowhow/middle-aged-channel-tips" className="relatedLink">
            👴 시니어층 유튜브 시작할 때 꼭 알아야 할 7가지 →
          </Link>
          <Link href="/blog?cat=viral" className="relatedLink">
            🔗 모든 떡상 분석 보기 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
