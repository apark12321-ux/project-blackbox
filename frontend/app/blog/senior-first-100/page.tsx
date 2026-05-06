'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorFirst100Guide() {
  return (
    <V18Shell>
      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 32px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 14px; color: #737373;
          margin-bottom: 32px; padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }
        .guide-section { margin-bottom: 36px; }
        .guide-section h2 {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          margin: 0 0 16px; padding-top: 12px;
        }
        @media (max-width: 600px) { .guide-section h2 { font-size: 19px; } }
        .guide-section h3 {
          font-size: 17px; font-weight: 700; letter-spacing: -0.018em;
          margin: 24px 0 10px;
        }
        .guide-section p {
          font-size: 16px; margin: 0 0 14px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section p { font-size: 15px; } }
        .guide-section ul, .guide-section ol {
          margin: 0 0 16px; padding-left: 24px;
        }
        .guide-section li {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section li { font-size: 15px; } }
        .guide-section strong { color: #c2410c; font-weight: 700; }
      `}</style>

      <article className="guide">
        <Link href="/blog" style={{ fontSize: 13, color: '#737373', marginBottom: 16, display: 'inline-block' }}>
          ← 가이드 목록으로
        </Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 구독자 모으기</div>
        <h1 className="guide-h1">
          시니어 채널 첫 100명 구독자 모으기 단계별 가이드
        </h1>
        <p className="guide-subtitle">
          50대 이후 채널을 시작하시는 분들을 위한 구독자 100명 도달 4단계 전략입니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.06 발행</span>
          <span>·</span>
          <span>📂 시니어</span>
        </div>

        <div className="guide-section">
          <p>
            처음 채널을 만드시고 가장 막막한 순간이 <strong>구독자 0명</strong> 일 때입니다.
            영상을 올려도 조회수가 10~30회밖에 안 나오고, 구독자도 거의 안 늘어납니다.
            이 시기를 어떻게 넘기느냐가 채널의 운명을 결정합니다.
          </p>
          <p>
            이 가이드는 50~70대 시니어 분들이 첫 100명 구독자에 도달하시는 4단계 전략을 알려드립니다.
            <strong>평균 2~3개월 안에 100명 도달이 목표</strong>입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1단계: 첫 5편 만들기 (1~2주차)</h2>
          <p>
            채널이 비어있으면 시청자가 둘러볼 게 없어서 떠납니다.
            <strong>최소 5편</strong>은 올리신 후에 본격적인 운영을 시작하세요.
          </p>
          <h3>5편 주제 추천</h3>
          <ul>
            <li>1편: 자기 소개 (왜 채널을 시작했는지)</li>
            <li>2편: 본인이 가장 잘 아는 분야 이야기</li>
            <li>3편: 시청자에게 도움 되는 정보 1가지</li>
            <li>4편: 본인 경험담 (사연 또는 추억)</li>
            <li>5편: 시청자 질문 받는 영상 ("궁금한 거 댓글 주세요")</li>
          </ul>
          <h3>각 영상 길이</h3>
          <ul>
            <li>쇼츠: 30~60초</li>
            <li>일반 영상: 5~7분</li>
          </ul>
          <p>
            이 단계에서는 <strong>완벽함보다 양</strong>이 중요합니다.
            5편 안 올리고 1편을 완벽하게 만드는 것보다, 5편 그냥 올리시는 게 낫습니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>2단계: 가족·친구·지인에게 알리기 (2~4주차)</h2>
          <p>
            첫 30~50명 구독자는 거의 다 지인에게서 옵니다.
            부끄러우셔도 적극적으로 알리셔야 합니다.
          </p>
          <h3>구체적 방법</h3>
          <ol>
            <li><strong>카카오톡 단톡방 공유</strong>: 가족/동창/친구 단톡방에 채널 링크</li>
            <li><strong>네이버 밴드 공유</strong>: 동호회/지역 모임 밴드</li>
            <li><strong>자녀에게 부탁</strong>: 자녀가 있으시면 자녀 친구들에게도 공유 부탁</li>
            <li><strong>경조사 자리</strong>: "유튜브 시작했으니 한번 봐줘" 자연스럽게</li>
          </ol>
          <h3>주의사항</h3>
          <ul>
            <li>구독 강요 X (자연스럽게 부탁만)</li>
            <li>댓글이나 좋아요 부탁 (구독보다 효과)</li>
            <li>알릴 때 영상 1~2편 미리 올린 상태에서</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3단계: 알고리즘 노출 시작 (4~8주차)</h2>
          <p>
            지인 30~50명이 모이면 알고리즘이 슬슬 영상을 추천하기 시작합니다.
            이 단계에서는 <strong>꾸준한 업로드</strong>가 가장 중요합니다.
          </p>
          <h3>업로드 주기</h3>
          <ul>
            <li>쇼츠: 주 3~5편 (이상적 매일 1편)</li>
            <li>일반 영상: 주 1~2편</li>
          </ul>
          <h3>알고리즘이 좋아하는 영상</h3>
          <ul>
            <li>제목에 키워드 명확 (예: "60대 부모님께 드리는 편지")</li>
            <li>처음 3초 후크 강함</li>
            <li>시청 지속률 60% 이상</li>
            <li>댓글 활성화 (시청자에게 질문 던지기)</li>
          </ul>
          <p>
            이 단계에서 갑자기 한 영상이 <strong>"떡상"</strong>할 수 있습니다.
            평소 100회 조회수 → 갑자기 5,000회 → 50,000회.
            이때 구독자가 한꺼번에 50~100명 늘어납니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>4단계: 첫 100명 도달 후 운영 (8~12주차)</h2>
          <p>
            100명에 도달하시면 채널 분위기가 완전히 달라집니다.
            새 영상 올릴 때마다 일정한 조회수가 나오고, 댓글이 활발해집니다.
            <strong>이때부터가 진짜 시작</strong>입니다.
          </p>
          <h3>다음 단계 전략</h3>
          <ul>
            <li><strong>채널 컨셉 좁히기</strong>: 100명 중 가장 많이 본 영상 분석 → 그 주제로 집중</li>
            <li><strong>댓글 답글 매일</strong>: 댓글 100개 = 100명 팬</li>
            <li><strong>커뮤니티 탭 활용</strong>: 일상 사진/질문 공유</li>
            <li><strong>다음 목표 1,000명</strong>: 100명에서 1,000명까지 평균 4~6개월</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>주의: 구독자 0명에서 30명까지 가장 힘듭니다</h2>
          <p>
            많은 시니어 분들이 <strong>이 시기에 포기</strong>하십니다.
            "올려도 안 봐주네", "재미없네", "그만 둘까" 라는 생각이 듭니다.
          </p>
          <p>
            하지만 이 시기를 넘기면 모든 게 달라집니다.
            <strong>최소 3개월은 버티세요.</strong>
            3개월 동안 매주 2~3편 꾸준히 올리시면 100명은 자연스럽게 도달합니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            첫 100명까지가 가장 어렵습니다. 100명만 넘기시면 그다음은 비교적 수월합니다.
            가장 큰 적은 <strong>"빨리 안 늘어나서 답답함"</strong>입니다.
          </p>
          <p>
            시니어 채널의 강점은 <strong>진정성</strong>입니다.
            젊은 유튜버는 흉내 낼 수 없는 인생 경험과 따뜻함이 있습니다.
            이걸 무기로 꾸준히 올리시면 시청자가 알아봐 줍니다.
          </p>
          <p>
            오늘부터 첫 1편 만들기 시작하세요. 3개월 후 100명 도달 축하드릴 날을 기대합니다.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/first-100-subs" style={{ color: '#c2410c' }}>첫 100명 구독자 모으는 방법</Link></li>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/algorithm-mindset" style={{ color: '#c2410c' }}>6개월간 떡상이 안 와도 버티는 멘탈 관리</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
