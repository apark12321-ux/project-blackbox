'use client';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

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
          <span>문의하기</span>
        </nav>

        <header className="header">
          <div className="pageBadge">Contact</div>
          <h1 className="title">문의하기</h1>
          <p className="sub">궁금한 점이나 제안 사항이 있으시면 언제든 연락주세요</p>
        </header>

        <div className="content">
          <h2>📧 이메일 문의</h2>
          <p>
            서비스 이용 중 문제가 있거나, 개선 제안이 있으시면 언제든 연락주세요.<br />
            영업일 기준 1~3일 내에 답변드립니다.
          </p>
          <p>
            <strong>이메일:</strong> contact@nutube.kr<br />
            <strong>운영시간:</strong> 평일 09:00 ~ 18:00 (주말·공휴일 제외)
          </p>

          <h2>💬 자주 묻는 질문</h2>
          
          <h3>1. 정말 무료인가요?</h3>
          <p>네, 완전 무료입니다. 회원가입도 결제도 필요 없습니다.</p>

          <h3>2. 어떤 분야의 콘텐츠를 만들 수 있나요?</h3>
          <p>경제·재테크, 부동산, N잡·창업, 건강, 여행, 요리 등 12개 분야를 지원합니다.</p>

          <h3>3. 정말 조회수가 잘 나오는 제목을 추천해주나요?</h3>
          <p>AI가 알고리즘 데이터와 트렌드 키워드를 기반으로 클릭률 높은 제목을 추천합니다. 다만 실제 성과는 콘텐츠 품질, 썸네일, 업로드 시간 등 다양한 요소에 영향을 받습니다.</p>

          <h3>4. 비즈니스·광고 문의는 어디로 보내나요?</h3>
          <p>광고 게재나 비즈니스 제휴 문의는 위 이메일로 보내주세요.</p>

          <h2>🏢 회사 정보</h2>
          <p>
            <strong>운영:</strong> 알고파트너스<br />
            <strong>서비스:</strong> AlgoMaker - AI 콘텐츠 추천 도구
          </p>
        </div>

        <div className="adArea">
          <AdSlot slot="page-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
