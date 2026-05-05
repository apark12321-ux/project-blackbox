'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorContentIdeasGuide() {
  return (
    <V18Shell>
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
        .guide-section { padding: 16px 20px; background: #fef3c7; border-left: 3px solid #f59e0b; margin: 20px 0; word-break: keep-all; }
        .guide-section h3 { margin-top: 0; }
        .guide-back { display: inline-block; margin-bottom: 18px; font-size: 13px; color: #737373; text-decoration: none; }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <article className="guide">
        <Link href="/blog" className="guide-back">← 전체 가이드</Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 콘텐츠</div>
        <h1 className="guide-h1">시니어 채널 콘텐츠 아이디어 30가지</h1>
        <p className="guide-subtitle">
          매일 어떤 영상을 만들지 고민이세요?
          시니어 시청자의 공감을 부르는 검증된 주제 30가지를 정리했습니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.04 발행</span><span>📂 시니어</span>
        </div>

        <p>
          시니어 채널을 시작하셨다면 가장 큰 고민이 "오늘 무슨 영상을 만들지" 입니다.
          매일 새로운 주제를 떠올리는 것은 쉽지 않습니다. 하지만 시니어 시청자가
          좋아하는 콘텐츠 패턴은 정해져 있습니다. 그 패턴 안에서 본인의 경험을 풀어내면 됩니다.
        </p>

        <p>
          이 가이드는 시니어 시청자가 가장 공감하는 30가지 주제를 6개 카테고리로 정리했습니다.
          매일 하나씩 다뤄도 한 달 분량입니다.
        </p>

        <h2>카테고리 1. 부모님 추억 (5가지)</h2>

        <ol>
          <li>돌아가신 어머니/아버지가 마지막으로 하신 말씀</li>
          <li>부모님께서 평생 가르쳐 주신 한 가지 교훈</li>
          <li>부모님께 못다 한 말, 못 드린 마음</li>
          <li>어릴 적 부모님이 만들어 주시던 음식 추억</li>
          <li>부모님이 화내신 그날의 기억과 그 이유</li>
        </ol>

        <p>
          이 카테고리는 시니어 시청자에게 가장 강력한 공감을 부릅니다.
          누구나 부모님에 대한 추억과 후회를 갖고 있기 때문입니다.
          댓글로 본인의 이야기를 풀어놓는 시청자가 많아 참여도가 매우 높습니다.
        </p>

        <h2>카테고리 2. 인생 후회담 (5가지)</h2>

        <ol>
          <li>인생 60년, 가장 후회되는 한 가지 결정</li>
          <li>젊었을 때 더 했어야 했던 일 5가지</li>
          <li>지금 와서야 깨달은 진실 한 가지</li>
          <li>그 사람에게 미안하다는 말을 못 한 후회</li>
          <li>건강을 잃고 나서야 알게 된 것</li>
        </ol>

        <p>
          후회담은 시니어뿐 아니라 중년 시청자도 많이 보는 주제입니다.
          "나도 비슷한 후회가 있다" 하는 공감대가 형성되면서
          영상이 외부 추천으로 빠르게 퍼집니다.
        </p>

        <h2>카테고리 3. 가족 이야기 (5가지)</h2>

        <ol>
          <li>형제자매와의 잊지 못할 추억</li>
          <li>자녀가 처음 했던 말, 첫 걸음</li>
          <li>며느리/사위와의 첫 만남 일화</li>
          <li>손주가 처음 "할머니/할아버지" 라고 부른 날</li>
          <li>가족 전체가 함께 울었던 그날의 진실</li>
        </ol>

        <h2>카테고리 4. 시대 회상 (5가지)</h2>

        <ol>
          <li>60~80년대 한국의 삶 - 그 시절 풍경</li>
          <li>처음 도시로 올라왔을 때의 충격과 적응기</li>
          <li>군대 시절 잊지 못할 동료 한 사람</li>
          <li>결혼 첫날의 기억 - 그 시대의 결혼 풍경</li>
          <li>처음 받은 월급으로 산 그것 - 첫 월급의 추억</li>
        </ol>

        <p>
          시대 회상 콘텐츠는 같은 세대 시청자에게 강력한 향수를 불러일으킵니다.
          "맞아, 그 시절 그랬지" 라는 댓글이 줄지어 달리며 채널이 빠르게 성장합니다.
        </p>

        <h2>카테고리 5. 인생 교훈 (5가지)</h2>

        <ol>
          <li>인생 50년 살면서 배운 가장 중요한 한 가지</li>
          <li>젊은 사람들에게 꼭 해주고 싶은 조언</li>
          <li>돈보다 더 중요한 것이 있다는 것을 깨달은 순간</li>
          <li>사람을 보는 안목 - 시간이 가르쳐 준 진실</li>
          <li>건강보다 소중한 것은 없다는 것을 알게 된 계기</li>
        </ol>

        <h2>카테고리 6. 일상 회상 (5가지)</h2>

        <ol>
          <li>이맘때면 떠오르는 그 시절 그 풍경</li>
          <li>옛날 동네에서 있었던 신기한 사건</li>
          <li>학창 시절 가장 친했던 친구의 근황</li>
          <li>처음 사랑했던 사람의 이야기</li>
          <li>인생에서 가장 행복했던 그 하루</li>
        </ol>

        <h2>주제 활용 팁 - 한 주제 = 한 영상이 아닙니다</h2>

        <p>
          위 30가지 주제는 단순한 목록이 아닙니다.
          한 주제를 가지고 여러 각도로 영상을 만드실 수 있습니다.
        </p>

        <div className="guide-section">
          <h3>📋 한 주제 = 5가지 영상 만들기</h3>
          <ol>
            <li><strong>도입형</strong>: "어머니가 마지막으로 하신 말씀, 그 한 마디"</li>
            <li><strong>회상형</strong>: "그날 어머니의 표정과 분위기를 다시 떠올려 보면"</li>
            <li><strong>교훈형</strong>: "어머니의 그 말씀이 30년이 지나서야 이해됐습니다"</li>
            <li><strong>후회형</strong>: "그때 더 자주 찾아뵐 걸 그랬다는 후회"</li>
            <li><strong>전달형</strong>: "이 글을 보시는 분들도 부모님께 미루지 마세요"</li>
          </ol>
        </div>

        <p>
          이렇게 하면 30가지 주제로 150개의 영상을 만들 수 있습니다.
          매일 하나씩 올려도 5개월 분량입니다.
        </p>

        <h2>주제 선정 시 피할 것</h2>

        <ul>
          <li>
            <strong>특정 인물 비방</strong>: 가족이나 지인의 실명 거론은 위험합니다
          </li>
          <li>
            <strong>정치·종교 논쟁</strong>: 알고리즘 추천이 제한될 수 있습니다
          </li>
          <li>
            <strong>지나치게 슬픈 소재</strong>: 일부 우울증 위험으로 제한될 수 있습니다
          </li>
          <li>
            <strong>의료 조언</strong>: 본인 경험 외 의료 조언은 정책 위반 위험
          </li>
          <li>
            <strong>지나친 개인 정보</strong>: 주소, 가족 신상 등은 노출 금지
          </li>
        </ul>

        <h2>마치며</h2>

        <p>
          시니어 채널 콘텐츠는 멀리 있지 않습니다. 본인의 인생이 곧 콘텐츠입니다.
          50~80년 살아오면서 쌓인 추억과 교훈, 그것이 누군가에게는 큰 위로가 됩니다.
        </p>

        <p>
          매일 하나씩 위 30가지 주제 중 마음이 가는 것을 고르세요.
          그리고 그 주제를 본인의 진짜 경험으로 풀어내세요.
          그것이 시니어 시청자가 가장 좋아하는 콘텐츠입니다.
        </p>

        <p>
          처음에는 같은 주제를 다른 사람도 다루지 않을까 걱정될 수 있습니다.
          하지만 같은 주제라도 사람마다 경험이 다르기 때문에 각각의 영상이
          전혀 다른 이야기가 됩니다. 30가지 주제 안에서 본인만의 이야기를 풀어내시면
          됩니다. 본인의 경험은 세상에 단 하나뿐인 콘텐츠입니다.
        </p>

        <p>
          그리고 한 가지 더 기억하실 것이 있습니다.
          시니어 시청자는 화려한 영상보다 <strong>진실된 이야기</strong>를 좋아합니다.
          편집이 어설퍼도, 자막이 약간 틀려도, 본인의 진짜 추억이라면 충분합니다.
          시청자가 원하는 것은 완벽한 영상이 아니라 같은 시대를 산 사람의 진심입니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/senior-hook-patterns" style={{ color: '#c2410c' }}>시청자를 사로잡는 시니어 영상 후크 8가지</Link></li>
            <li><Link href="/blog/human-warmth" style={{ color: '#c2410c' }}>AI 시대, 유튜버가 잃지 말아야 할 인간의 온도</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
