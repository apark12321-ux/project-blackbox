'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorFamilyChannelGuide() {
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

        <div className="guide-kicker">시니어 사연 쇼츠 · 채널 컨셉</div>
        <h1 className="guide-h1">
          50대 이후 시작하는 가족 일상 채널 가이드
        </h1>
        <p className="guide-subtitle">
          가족과 함께 추억을 영상으로 남기면서 채널을 키우는 방법을 안내해드립니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.06 발행</span>
          <span>·</span>
          <span>📂 시니어</span>
        </div>

        <div className="guide-section">
          <p>
            가족 일상 채널은 시니어 분들께 가장 추천드리는 컨셉 중 하나입니다.
            매일 일어나는 일상이 영상 소재가 되고, 가족과의 시간이 채널이 됩니다.
            아이들과 함께한 시간, 손주들과의 추억, 부부의 일상이 모두 콘텐츠가 됩니다.
          </p>
          <p>
            이 가이드에서는 <strong>50대 이후 가족 일상 채널을 시작하시는 분들을 위한 5가지 핵심</strong>을 알려드립니다.
            가족 동의받기, 사생활 보호, 컨셉 잡기, 수익화 가능성까지 모두 다룹니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 가족 일상 채널이 강한 이유</h2>
          <p>
            요즘 유튜브 시장은 AI 자동 생성 영상이 폭발적으로 늘고 있습니다.
            그래서 역설적으로 <strong>"진짜 사람의 진짜 일상"</strong> 영상이 더 강해졌습니다.
            시청자는 정형화된 영상보다 진짜 가족의 모습을 그리워합니다.
          </p>
          <h3>시니어 가족 채널의 강점</h3>
          <ul>
            <li><strong>진정성</strong>: 살아있는 추억과 경험</li>
            <li><strong>꾸준함</strong>: 매일 일상 = 매일 콘텐츠</li>
            <li><strong>공감대</strong>: 시청자도 비슷한 가족이 있음</li>
            <li><strong>경쟁 적음</strong>: 50대 이상 가족 채널은 드물어서 블루오션</li>
          </ul>
          <p>
            특히 <strong>3대가 함께 사는 가족</strong> (부부 + 자녀 + 손주) 의 일상은
            지금 가장 인기 있는 컨셉 중 하나입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>2. 가족 동의 받기 (가장 중요)</h2>
          <p>
            가족 채널을 시작하시기 전에 <strong>반드시 가족 모두의 동의</strong>를 받으셔야 합니다.
            동의 없이 가족이 영상에 나오면 나중에 큰 문제가 됩니다.
          </p>
          <h3>가족 동의 받는 방법</h3>
          <ol>
            <li>가족 모임 자리에서 솔직하게 채널 시작 의사 밝히기</li>
            <li>"왜 채널을 만들고 싶은지" 진솔하게 설명</li>
            <li>"누가 얼마나 나올지" 구체적으로 말하기</li>
            <li>거부하는 가족은 절대 등장 X (얼굴, 목소리)</li>
            <li>나오시는 분도 "특정 부분만" 가능하면 약속</li>
          </ol>
          <h3>특별 주의 - 미성년 자녀/손주</h3>
          <p>
            미성년 자녀나 손주가 나오는 경우 <strong>부모의 명확한 서면 동의</strong>를 받으세요.
            나중에 자녀가 성인이 되어 영상을 내려달라고 하면 즉시 비공개해야 합니다.
            소셜 미디어 흔적은 평생 남기 때문에 미리 신중하게 결정하셔야 합니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>3. 사생활 보호 5가지 규칙</h2>
          <p>
            가족 일상이라고 해서 모든 것을 보여주실 필요는 없습니다.
            <strong>지킬 선을 미리 정해두시면</strong> 안전하게 채널을 운영하실 수 있습니다.
          </p>
          <h3>꼭 지켜야 할 5가지</h3>
          <ul>
            <li><strong>집 외관 노출 X</strong>: 동, 호수, 아파트 단지 정보 X</li>
            <li><strong>학교명 노출 X</strong>: 자녀/손주 학교 이름 X</li>
            <li><strong>실명 노출 신중</strong>: 별명 사용 권장</li>
            <li><strong>자동차 번호판</strong>: 영상 편집으로 가리기</li>
            <li><strong>위치 정보</strong>: 자주 가는 마트, 학원 X</li>
          </ul>
          <h3>안전한 소재</h3>
          <ul>
            <li>요리 (식탁만 보이게)</li>
            <li>가족 대화 (얼굴 부분만)</li>
            <li>여행 (특정 위치 X, 풍경만)</li>
            <li>일상 활동 (취미, 운동)</li>
            <li>가족 추억 사진 (오래된 것)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 가족 채널 컨셉 5가지 추천</h2>
          <p>
            "그냥 일상" 보다는 <strong>한 가지 컨셉</strong>으로 좁히시는 게 좋습니다.
            컨셉이 명확해야 시청자가 "이 채널이 뭐 하는 채널인지" 알아챕니다.
          </p>
          <h3>추천 컨셉</h3>
          <ol>
            <li><strong>가족 식탁 채널</strong>: 매일 먹는 음식 + 가족 대화</li>
            <li><strong>3대 일상 브이로그</strong>: 부모 + 자녀 + 손주 일상</li>
            <li><strong>부부 추억 채널</strong>: 50대 부부 일상, 여행, 취미</li>
            <li><strong>시골 살이 채널</strong>: 도시에서 시골로 이주한 가족</li>
            <li><strong>가족 요리 채널</strong>: 어머니 손맛 전수</li>
          </ol>
          <p>
            처음에는 한 가지로 시작하시고, 50명 정도 모이시면 데이터를 보고 컨셉을 좁히세요.
          </p>
        </div>

        <div className="guide-section">
          <h2>5. 수익화 가능성</h2>
          <p>
            가족 일상 채널의 수익은 채널 크기에 따라 다릅니다.
            <strong>구독자 1만 명 이상</strong>이 되시면 광고 수익이 본격적으로 나옵니다.
          </p>
          <h3>수익 단계별 예상</h3>
          <ul>
            <li><strong>0~1,000명</strong>: 수익 거의 없음 (월 0~5만원)</li>
            <li><strong>1,000~10,000명</strong>: 광고 수익 시작 (월 10~50만원)</li>
            <li><strong>10,000~50,000명</strong>: 안정 수익 (월 50~200만원)</li>
            <li><strong>50,000명 이상</strong>: 협찬, 굿즈 등 다각화 (월 200만원~)</li>
          </ul>
          <h3>가족 채널 수익화 팁</h3>
          <ul>
            <li><strong>꾸준함이 핵심</strong>: 1년 이상 운영 시 안정화</li>
            <li><strong>광고 수익 외</strong>: 협찬, 강의, 상품 출시 등 다양화</li>
            <li><strong>가족 단위 수익</strong>: 가족 모두에게 수익 공유 권장</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            가족 일상 채널은 <strong>채널이 곧 추억 기록</strong>이 됩니다.
            10년 후 영상을 다시 보시면 "그때 그 시간"이 생생하게 떠오를 것입니다.
            수익도 좋지만, 가족과의 시간을 영상으로 남기는 것 자체가 큰 가치입니다.
          </p>
          <p>
            중요한 것은 <strong>가족 우선</strong>입니다.
            영상 찍느라 가족과의 진짜 시간을 잃지 마세요.
            채널은 가족과의 시간을 더 풍부하게 하는 도구일 뿐입니다.
          </p>
          <p>
            오늘부터 가족과 함께 첫 영상 한 편 찍어보세요.
            완벽하지 않아도 괜찮습니다. 진짜 가족의 일상이면 충분합니다.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/senior-policy-safe" style={{ color: '#c2410c' }}>시니어 채널 정책 위반 피하는 6가지 규칙</Link></li>
            <li><Link href="/blog/channel-concept" style={{ color: '#c2410c' }}>채널 컨셉 5가지 카테고리 정리</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
