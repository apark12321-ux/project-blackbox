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
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.8; color: #333;
        }
        .content h2 {
          font-size: 19px; font-weight: 800;
          color: #1a1a1a; margin: 28px 0 12px;
        }
        .content h2:first-child { margin-top: 0; }
        .content h3 {
          font-size: 15px; font-weight: 700;
          color: #1a1a1a; margin: 20px 0 8px;
        }
        .content p { margin: 0 0 14px; font-size: 14.5px; }
        .content ul { padding-left: 24px; margin: 12px 0; }
        .content li {
          margin-bottom: 8px; font-size: 14px; color: #555;
          line-height: 1.7;
        }
        .content strong { color: #c65f3b; font-weight: 700; }
        .ctaBtn {
          display: inline-block; padding: 14px 28px;
          background: #c65f3b; color: #fff;
          border-radius: 100px; font-size: 14px; font-weight: 700;
          text-decoration: none; transition: all 0.2s;
          margin-top: 20px;
        }
        .ctaBtn:hover { background: #a64a2a; }
        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>첫 30초가 영상의 운명을 결정한다</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Knowhow</div>
          <h1 className="title">첫 30초가 영상의 운명을 결정한다</h1>
          <p className="sub">시청자가 끝까지 보게 만드는 후크 만들기</p>
        </header>

        <div className="content">
          <h2>📊 왜 첫 30초인가?</h2>
          <p>
            유튜브 알고리즘은 <strong>시청 유지율</strong>을 가장 중요한 지표 중 하나로 봅니다.
            특히 첫 30초 동안 시청자가 이탈하면 영상이 추천되기 어려워집니다.
          </p>

          <h2>🎯 효과적인 후크 4가지 패턴</h2>

          <h3>1. 호기심 자극형</h3>
          <p>
            "오늘 제가 알려드릴 이 방법, 99%의 사람들이 모릅니다"<br />
            <strong>핵심:</strong> 영상을 끝까지 봐야 답을 알 수 있게 만들기
          </p>

          <h3>2. 충격적 사실 공개</h3>
          <p>
            "이걸 모르고 5천만원을 날렸습니다"<br />
            <strong>핵심:</strong> 본인의 경험담으로 신뢰감 형성
          </p>

          <h3>3. 결과 미리 보기</h3>
          <p>
            "이 영상을 끝까지 보시면 월 100만원 부업 아이템 3개를 알게 됩니다"<br />
            <strong>핵심:</strong> 시청 후 얻을 가치를 명확히 제시
          </p>

          <h3>4. 질문형 도입</h3>
          <p>
            "혹시 퇴직금을 어떻게 굴려야 할지 고민이신가요?"<br />
            <strong>핵심:</strong> 시청자의 고민을 정확히 짚어내기
          </p>

          <h2>❌ 피해야 할 도입부</h2>
          <ul>
            <li>긴 자기소개 ("안녕하세요, 제가 누구냐면...")</li>
            <li>채널 광고 ("구독 좋아요 부탁드려요" - 시작부터)</li>
            <li>지루한 배경 설명 ("오늘 영상은 사실...")</li>
            <li>음악만 길게 나오는 인트로 (5초 이상)</li>
          </ul>

          <h2>💡 실전 적용 팁</h2>
          <ul>
            <li><strong>대본 작성 시</strong> 첫 3문장에 가장 강한 후크 배치</li>
            <li><strong>썸네일과 제목</strong>이 약속한 내용을 빠르게 보여주기</li>
            <li><strong>시각적 변화</strong>를 첫 10초 안에 만들기 (자막, 효과음, 컷)</li>
            <li><strong>시청자 시점</strong>에서 "이 영상 끝까지 봐야 할 이유"가 명확해야 함</li>
          </ul>

          <Link href="/create" className="ctaBtn">🚀 후크 만들기 시작</Link>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
