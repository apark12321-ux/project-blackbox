'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

export default function AlgorithmMistakesGuide() {
  return (
    <V11Shell>
      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.65; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 28px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 22px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 12px; color: #737373;
          padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h2 { font-size: 17px; margin: 28px 0 12px; } }
        .guide h3 {
          font-size: 17px; font-weight: 700; letter-spacing: -0.015em;
          margin: 24px 0 10px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h3 { font-size: 15.5px; } }
        .guide p { font-size: 15.5px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 14.5px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 15.5px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 14.5px; } }
        .guide-callout {
          padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24;
          margin: 16px 0; font-size: 14.5px; line-height: 1.6; color: #78350f; word-break: keep-all;
        }
        .guide-warning {
          padding: 14px 16px; background: #fef2f2; border-left: 3px solid #dc2626;
          margin: 16px 0; font-size: 14.5px; line-height: 1.6; color: #7f1d1d; word-break: keep-all;
        }
        .guide-formula {
          padding: 16px 18px; background: #0a0a0a; color: #ffffff;
          margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 14px; line-height: 1.7; word-break: keep-all;
        }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta {
          margin-top: 36px; padding: 20px; background: #fafafa;
          border: 1px solid #e5e5e5; text-align: center;
        }
        .guide-cta-title { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 13.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn {
          display: inline-block; padding: 12px 24px; background: #0a0a0a;
          color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700;
        }
        .guide-cta-btn:hover { background: #c2410c; }
        .guide-related { margin-top: 40px; padding-top: 28px; border-top: 1px solid #e5e5e5; }
        .guide-related-title {
          font-size: 13px; font-weight: 700; letter-spacing: 0.1em;
          color: #737373; margin-bottom: 12px; text-transform: uppercase;
        }
        .guide-related-list { display: flex; flex-direction: column; gap: 8px; }
        .guide-related-item {
          padding: 10px 12px; background: #ffffff; border: 1px solid #e5e5e5;
          font-size: 14px; color: #0a0a0a; text-decoration: none;
        }
        .guide-related-item:hover { background: #fafafa; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 알고리즘 가이드 · 실수 방어</div>
        <h1 className="guide-h1">떡상을 가로막는 치명적 실수 방어하기</h1>
        <p className="guide-subtitle">
          밤새워 만든 영상이 사소한 설정 실수로 알고리즘에게 외면받는 경우가
          많습니다. 채널 성장의 발목을 잡는 3가지 실수와 방어법.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 5월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 6분</span>
          <span>·</span>
          <span>⚠️ 실수 방어</span>
        </div>

        <p>
          공들여 만든 영상이 알고리즘의 버림을 받거나 수익 기회를
          날려버리는 경우가 많습니다. "운이 없다"고 말하기 전에
          내가 영상의 발목을 잡고 있는 건 아닌지 확인하세요.
        </p>

        <p>
          가장 흔하면서도 치명적인 3가지 실수와 방어법을 정리합니다.
        </p>

        <h2>1. 아동용 설정의 함정</h2>

        <p>
          유튜브 스튜디오에서 업로드할 때 반드시 마주치는 질문이 있습니다.
          "이 영상은 아동용인가요?"
        </p>

        <h3>흔한 오해 — 아동이 봐도 무해 = 아동용?</h3>

        <p>
          많은 분이 "우리 애도 볼 수 있는 건데, 아동용 아닌가요?"
          하면서 아동용으로 설정합니다. 이게 큰 실수입니다.
        </p>

        <p>
          유튜브에서 정의하는 "아동용(Made for Kids)"은
          <strong> 만 13세 미만 어린이를 주 타겟으로 한 콘텐츠</strong>
          (인형극, 동요, 어린이 교육)만 의미합니다. 일반 시청자 대상
          영상이라면 절대 아동용으로 설정하면 안 됩니다.
        </p>

        <h3>아동용으로 잘못 설정하면 벌어지는 일</h3>

        <ul>
          <li><strong>댓글창 폐쇄:</strong> 시청자와의 소통이 차단되어 알고리즘 점수가 깎입니다.</li>
          <li><strong>맞춤 광고 금지:</strong> 수익이 평소의 1/10 토막이 날 수 있습니다.</li>
          <li><strong>알림 미전송:</strong> 구독자에게 새 영상 알림이 가지 않아 초기 조회수가 폭락합니다.</li>
          <li><strong>저장/공유 제한:</strong> 시청자가 영상을 저장하거나 재생목록에 추가할 수 없습니다.</li>
        </ul>

        <h3>방어법 — 채널 단위 일괄 설정</h3>

        <div className="guide-formula">
          [설정] → [채널] → [고급 설정]<br /><br />
          <strong>"아니요, 이 채널을 아동용으로 설정하지 않겠습니다"</strong><br />
          체크하고 저장
        </div>

        <p>
          매번 업로드할 때 고민하지 마시고 채널 전체 설정을 한 번에 해두세요.
          이렇게 하면 개별 업로드 시 발생할 수 있는 실수를 원천 차단할 수 있습니다.
        </p>

        <h2>2. 업로드 즉시 공개의 함정</h2>

        <p>
          편집을 마치면 흥분해서 바로 "공개" 버튼을 누르고 싶어집니다.
          하지만 이게 영상의 화질과 수익을 망치는 급한 성미입니다.
        </p>

        <h3>왜 즉시 공개하면 안 되나</h3>

        <ul>
          <li><strong>저화질 이슈:</strong> 업로드 직후에는 SD(저화질) 버전만 우선 공개됩니다. 이 시점에 들어온 시청자는 "화질이 왜 이래?"하며 3초 만에 나가버립니다. 이탈률 상승 = 떡상 기회 날림.</li>
          <li><strong>수익 검토 미완료:</strong> 광고 적합성 검토가 안 끝난 상태에서 공개하면, 가장 조회수가 많이 나오는 초반에 광고가 안 붙습니다. 수익 손실.</li>
        </ul>

        <h3>방어법 — 1시간의 기다림</h3>

        <p>
          영상을 올릴 때 바로 공개하지 마시고 다음 순서로 하세요.
        </p>

        <div className="guide-formula">
          1. <strong>"일부 공개(Unlisted)"</strong> 또는 <strong>"예약"</strong>으로 업로드<br /><br />
          2. 1시간 정도 대기<br /><br />
          3. 화질 처리 HD/4K 완료 확인<br /><br />
          4. 저작권 + 광고 적합성 체크 완료 확인<br /><br />
          5. 정식 공개
        </div>

        <h3>노란 달러(수익 창출 제한) 방어</h3>

        <p>
          일부 공개 상태에서 "수익 창출" 탭에 노란색 달러 아이콘이 뜬다면,
          제목이나 썸네일 혹은 영상 내용 중에 자극적인 단어가 포함되어 있을 가능성이 큽니다.
        </p>

        <p>
          정식 공개 전이라면 수정해서 "초록색 달러"로 바꾼 뒤 공개할 수 있어
          소중한 수익을 지킬 수 있습니다.
        </p>

        <h2>3. 빈 댓글창의 함정 (고정 댓글 활용)</h2>

        <p>
          조회수가 0이거나 100회 미만인 영상은 시청자에게 신뢰를 주기 어렵습니다.
          이때 시청자의 시선을 붙잡고 참여를 유도하는 강력한 도구가 고정 댓글입니다.
        </p>

        <h3>고정 댓글 = 제2의 제목</h3>

        <p>
          고정 댓글은 영상 제목이 미처 못한 말을 전하는 두 번째 제목입니다.
          시청자가 댓글창을 열게 만드는 강력한 장치입니다.
        </p>

        <div className="guide-formula">
          <strong>예시 1 - 정보 보충형:</strong><br />
          "오늘 영상에서 썼던 양념장 비율, 많은 분이 물어보셔서 여기 정리해 둡니다!"<br /><br />
          <strong>예시 2 - 질문 던지기:</strong><br />
          "여러분은 김치찌개에 설탕 넣으시나요? 댓글로 알려주세요!"<br /><br />
          <strong>예시 3 - 보너스 자료:</strong><br />
          "영상에서 못 다룬 응용 레시피는 다음 영상에서 공개합니다."
        </div>

        <h3>고정 댓글 활용 팁</h3>

        <ul>
          <li><strong>업로드 직후 작성:</strong> 영상 공개와 동시에 고정 댓글도 달아두세요.</li>
          <li><strong>하트 표시:</strong> 본인 댓글에 하트를 누르면 빨간 하트 표시가 떠서 더 눈에 띕니다.</li>
          <li><strong>업데이트:</strong> 영상이 자라면 "이 영상에 1만 명이 다녀가셨어요!" 같은 내용으로 업데이트하면 신뢰도가 올라갑니다.</li>
        </ul>

        <h2>4. 추가 흔한 실수들</h2>

        <h3>❌ 카테고리 잘못 설정</h3>
        <p>
          영상 업로드할 때 카테고리를 정확히 선택해야 합니다.
          요리 영상을 "엔터테인먼트"로 설정하면 알고리즘이 헷갈립니다.
        </p>

        <h3>❌ 거주 국가 미설정</h3>
        <p>
          [설정] → [채널] → [기본 정보]에서 거주 국가를 "대한민국"으로
          반드시 설정하세요. 설정 안 되어 있으면 한국 시청자에게 노출이 줄어듭니다.
        </p>

        <h3>❌ 연속 시청 시간 안 보고 다음 영상 만들기</h3>
        <p>
          이전 영상에서 어디서 시청자가 빠져나갔는지 확인하지 않으면
          같은 실수를 반복합니다. 유튜브 스튜디오 → 분석 → 시청 지속 시간
          그래프를 매번 확인하세요.
        </p>

        <h2>5. 정리 — 업로드 전 체크리스트 5가지</h2>

        <div className="guide-formula">
          □ 1. 아동용 설정 → "아니요"<br />
          □ 2. 카테고리 → 영상 내용에 맞게 정확히<br />
          □ 3. 일부 공개로 업로드 → 1시간 대기 → 정식 공개<br />
          □ 4. 수익 창출 → 초록 달러 확인<br />
          □ 5. 공개 직후 고정 댓글 작성
        </div>

        <p>
          이 5가지만 매번 챙기시면 사소한 실수로 영상 발목 잡히는 일은 없습니다.
        </p>

        <div className="guide-callout">
          💡 업로드 전 체크리스트 15가지 (전체 버전)는
          가이드 페이지에서 다운로드 받으실 수 있습니다.
        </div>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 실수 방어된 자료 자동 생성</div>
          <div className="guide-cta-desc">
            AlgoMaker가 알고리즘 친화적인 제목, 카테고리, 메타데이터를
            자동으로 만들어 실수 방어까지 해드립니다.
          </div>
          <Link href="/" className="guide-cta-btn">
            영상 자료 만들러 가기 →
          </Link>
        </div>

        <div className="guide-related">
          <div className="guide-related-title">▍ 함께 보시면 좋은 가이드</div>
          <div className="guide-related-list">
            <Link href="/blog/algorithm-seo" className="guide-related-item">
              🔍 알고리즘 SEO 검색 최적화 전략
            </Link>
            <Link href="/blog/algorithm-retention" className="guide-related-item">
              ⏱ 무한 루프 세팅
            </Link>
            <Link href="/blog/algorithm-mindset" className="guide-related-item">
              💪 유튜버 멘탈 서바이벌 + 복리 성장
            </Link>
          </div>
        </div>
      </article>
    </V11Shell>
  );
}
