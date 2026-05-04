'use client';

import Link from 'next/link';
import { V17Shell } from '../../_shared/V17Shell';

export default function SeniorPolicySafeGuide() {
  return (
    <V17Shell>
      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #c2410c; margin-bottom: 8px; text-transform: uppercase; }
        .guide-h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.3; margin: 0 0 12px; word-break: keep-all; }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle { font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6; word-break: keep-all; }
        .guide-meta { display: flex; gap: 12px; font-size: 14px; color: #737373; padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px; flex-wrap: wrap; }
        .guide h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 { font-size: 19px; font-weight: 700; letter-spacing: -0.015em; margin: 24px 0 10px; word-break: keep-all; }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout { padding: 14px 16px; background: #fef2f2; border-left: 3px solid #dc2626; margin: 16px 0; font-size: 17px; line-height: 1.6; color: #991b1b; word-break: keep-all; }
        .guide-callout strong { color: #7f1d1d; }
        .guide-section { padding: 16px 20px; background: #fff7ed; border-left: 3px solid #c2410c; margin: 20px 0; word-break: keep-all; }
        .guide-section h3 { margin-top: 0; }
        .guide-back { display: inline-block; margin-bottom: 18px; font-size: 13px; color: #737373; text-decoration: none; }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <article className="guide">
        <Link href="/blog" className="guide-back">← 전체 가이드</Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 정책</div>
        <h1 className="guide-h1">
          시니어 채널 정책 위반<br />
          피하는 6가지 규칙
        </h1>
        <p className="guide-subtitle">
          힘들게 만든 채널이 정책 위반으로 제한되면 모든 노력이 사라집니다.
          처음부터 안전하게 운영하는 6가지 핵심 규칙입니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.04 발행</span>
          <span>⏱ 7분 읽기</span>
          <span>📂 시니어</span>
        </div>

        <p>
          시니어 채널 운영자가 가장 두려워하는 일은 "정책 위반" 입니다.
          오랜 시간 노력해서 키운 채널이 한 번의 실수로 제한되거나
          광고 수익이 끊길 수 있습니다. 이 가이드는 처음부터 끝까지 안전하게 채널을
          운영하는 6가지 핵심 규칙을 정리했습니다.
        </p>

        <p>
          이 규칙들은 단순한 권장 사항이 아니라 <strong>필수 사항</strong>입니다.
          하나라도 어기면 알고리즘 추천이 제한되거나, 심한 경우 채널 자체가
          영구 정지될 수 있습니다.
        </p>

        <h2>규칙 1. "아동용 아님" 반드시 체크</h2>

        <div className="guide-callout">
          <strong>치명적 실수 1순위.</strong> 시니어 콘텐츠는 성인 시청자 대상이지만
          기본 설정이 "아동용 아님" 으로 되어있지 않으면 알고리즘이 채널을
          잘못 분류할 수 있습니다.
        </div>

        <p>
          영상 업로드 시 "이 동영상은 아동용입니다" 항목에서 반드시
          <strong>"아니요, 아동용이 아닙니다"</strong> 를 선택하세요.
          시니어 사연 쇼츠는 성인을 대상으로 하므로 이 설정이 맞습니다.
        </p>

        <p>
          이 설정을 잘못하면 댓글 기능이 비활성화되고, 광고 수익도 제한되며,
          알고리즘 추천 노출이 크게 줄어듭니다. 한 번 잘못 설정하면 영상마다
          수정해야 하므로 처음부터 정확히 설정하세요.
        </p>

        <h2>규칙 2. 자극적 소재 회피</h2>

        <div className="guide-callout">
          <strong>채널 정지 위험.</strong> 자극적 소재는 짧게 조회수가 나올 수 있지만
          장기적으로 채널을 망치는 가장 큰 원인입니다.
        </div>

        <p>
          시니어 채널은 <strong>따뜻함과 공감</strong>을 무기로 합니다.
          하지만 짧은 조회수를 얻기 위해 자극적 소재를 다루는 채널이 많습니다.
          이런 소재들은 알고리즘이 위험 신호로 인식합니다.
        </p>

        <p>피해야 할 소재:</p>
        <ul>
          <li>경찰·검찰·고소·소송 관련 사건 사고</li>
          <li>폭력적 사건 (살인, 폭행, 학대 등)</li>
          <li>음모론 (정치, 의료, 역사 관련)</li>
          <li>지나치게 슬픈 자살·자해 관련 소재</li>
          <li>혐오 발언 (인종, 종교, 정치 등)</li>
        </ul>

        <h2>규칙 3. 허위 사실·사칭 금지</h2>

        <div className="guide-callout">
          <strong>채널 영구 정지 위험.</strong> 본인 또는 가족 어르신의 진짜 이야기여야 합니다.
        </div>

        <p>
          시니어 사연 쇼츠 채널 중 일부는 가짜 사연을 만들어서 영상을 업로드합니다.
          처음에는 조회수가 잘 나올 수 있지만, 시청자가 알아채는 순간 채널 신뢰도가
          무너집니다. 또한 같은 사람이 다른 사연을 너무 많이 가지고 있으면
          알고리즘도 가짜로 인식합니다.
        </p>

        <p>
          본인의 진짜 인생, 가족 어르신의 진짜 추억만 다루세요.
          진짜 이야기 30가지로도 한 달 분량의 영상을 만들 수 있습니다.
        </p>

        <h2>규칙 4. 1일 1영상 - 다다익선 X</h2>

        <p>
          시니어 채널을 빨리 키우려고 하루에 5~10개 영상을 올리시는 분들이 있습니다.
          하지만 이는 알고리즘에게 부정적입니다. 같은 채널의 영상이 너무 많이 노출되면
          시청자가 피로감을 느끼고, 평균 시청률이 떨어집니다.
        </p>

        <p>
          가장 안전한 업로드 빈도는 <strong>하루 1개</strong>입니다.
          꾸준히 매일 1개씩 올리면 알고리즘이 채널을 신뢰합니다.
          영상이 많이 모이면 일주일에 3~4개로 줄여도 됩니다.
        </p>

        <h2>규칙 5. 업로드 후 삭제·재업로드 금지</h2>

        <div className="guide-callout">
          <strong>알고리즘 페널티.</strong> 한 번 올린 영상을 삭제하고 다시 올리는 것은
          채널 평가를 크게 떨어뜨립니다.
        </div>

        <p>
          영상에 사소한 오류가 있어도 삭제하지 마세요. 자막 수정, 제목 수정, 설명 수정은
          가능합니다. 하지만 영상 자체를 삭제하고 다시 올리면 알고리즘이
          "이 채널은 콘텐츠가 불안정하다" 라고 판단합니다.
        </p>

        <p>
          만약 정말 큰 문제가 있는 영상이라면 삭제하지 말고
          <strong>비공개</strong>로 전환하세요. 비공개는 알고리즘에 영향을 덜 줍니다.
        </p>

        <h2>규칙 6. 정각 업로드 회피</h2>

        <p>
          시니어 채널 운영자가 자주 놓치는 부분입니다.
          유튜브에는 매 정각마다 수많은 채널이 동시에 영상을 업로드합니다.
          그 시간에 같이 올리면 알고리즘 추천 경쟁이 심해져서 노출이 적어집니다.
        </p>

        <div className="guide-section">
          <h3>📋 시니어 채널 권장 업로드 시간</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><strong>시간대</strong>: 오전 9시 ~ 12시 (시니어 시청자 활동 시간)</li>
            <li><strong>분</strong>: 5분 ~ 20분 사이 (정각 회피)</li>
            <li><strong>예</strong>: 9시 12분, 10시 17분, 11시 8분 등</li>
            <li><strong>전날과 차이</strong>: 24시간 + 5~20분 차이로 매일 다른 시간에 업로드</li>
          </ul>
        </div>

        <h2>마치며: 안전한 운영이 가장 빠른 길</h2>

        <p>
          시니어 채널은 단기간에 큰 조회수를 얻기보다는 <strong>장기적으로 안정적으로 성장</strong>하는
          채널이 결국 성공합니다. 위 6가지 규칙은 단순한 안전 장치가 아니라
          채널을 오래 키우는 핵심 전략입니다.
        </p>

        <p>
          한 번 정책 위반으로 채널이 제한되면 회복까지 6개월에서 1년이 걸릴 수 있습니다.
          또는 영구 정지될 수도 있습니다. 처음부터 위 규칙을 지키시는 것이
          가장 안전하고 빠른 성장 방법입니다.
        </p>

        <p>
          시니어 시청자는 신뢰할 수 있는 채널에 오래 머무릅니다. 자극적 소재 없이도
          진정성 있는 콘텐츠로 충분히 채널을 키울 수 있습니다. 안전하게 운영하면
          시간이 지날수록 채널의 가치가 쌓입니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/algorithm-mistakes" style={{ color: '#c2410c' }}>치명적 실수 7가지 - 알고 피하면 떡상</Link></li>
            <li><Link href="/blog/senior-engagement" style={{ color: '#c2410c' }}>시니어 채널 댓글과 참여 늘리는 5가지 질문</Link></li>
          </ul>
        </div>
      </article>
    </V17Shell>
  );
}
