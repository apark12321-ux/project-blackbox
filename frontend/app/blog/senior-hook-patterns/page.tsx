'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorHookPatternsGuide() {
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
        .guide-quote { padding: 18px 20px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 20px 0; font-size: 17px; line-height: 1.7; color: #78350f; word-break: keep-all; font-style: italic; }
        .guide-quote strong { color: #92400e; font-style: normal; }
        .guide-section { padding: 16px 20px; background: #fff7ed; border-left: 3px solid #c2410c; margin: 20px 0; word-break: keep-all; }
        .guide-section h3 { margin-top: 0; }
        .guide-back { display: inline-block; margin-bottom: 18px; font-size: 13px; color: #737373; text-decoration: none; }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <article className="guide">
        <Link href="/blog" className="guide-back">← 전체 가이드</Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 후크</div>
        <h1 className="guide-h1">
          시청자를 사로잡는<br />
          시니어 영상 후크 8가지
        </h1>
        <p className="guide-subtitle">
          영상의 첫 5초는 시청 완료율을 결정합니다.
          시니어 시청자가 끝까지 보게 만드는 강력한 후크 패턴을 소개합니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.04 발행</span><span>📂 시니어</span>
        </div>

        <p>
          유튜브 알고리즘은 시청 완료율을 가장 중요하게 봅니다.
          영상이 100명에게 노출됐을 때 몇 명이 끝까지 봤는지에 따라
          그 다음 노출량이 결정됩니다. 그래서 영상 첫 5초가 결정적입니다.
        </p>

        <p>
          시니어 시청자는 영상 첫 5초에 호기심을 못 느끼면 바로 다음 영상으로 넘깁니다.
          이 가이드는 시니어 채널에서 검증된 8가지 후크 패턴을 소개합니다.
          본인의 콘텐츠에 맞춰 변형해서 사용하시면 됩니다.
        </p>

        <h2>후크 1. 시간 거리 후크</h2>

        <div className="guide-quote">
          <strong>"50년 전 이맘때, 저는…"</strong>
        </div>

        <p>
          가장 강력한 시니어 후크입니다. 시청자에게 "그 시절 나는 무엇을 했나"
          하는 자기 회상을 즉시 일으킵니다. 같은 세대 시청자라면
          본인의 50년 전 모습을 함께 떠올리며 영상에 몰입합니다.
        </p>

        <p>변형 패턴:</p>
        <ul>
          <li>"40년 전 그날, 저는…"</li>
          <li>"30년 전 가을, 어머니께서…"</li>
          <li>"20년 전 그 사람을 다시 만났습니다"</li>
        </ul>

        <h2>후크 2. 마지막 말씀 후크</h2>

        <div className="guide-quote">
          <strong>"그날 어머니가 마지막으로 하신 말씀은…"</strong>
        </div>

        <p>
          돌아가신 분의 마지막 말씀은 누구에게나 무거운 무게가 있습니다.
          시청자는 "그 말씀이 무엇이었을까" 라는 궁금증과 함께
          본인 부모님의 마지막 말씀도 떠올립니다.
        </p>

        <p>주의: 진실되게 사용하세요. 가짜 사연은 시청자가 알아챕니다.</p>

        <h2>후크 3. 평생 잊지 못할 후크</h2>

        <div className="guide-quote">
          <strong>"평생 잊지 못할 그 한 마디"</strong>
        </div>

        <p>
          짧고 강력합니다. "그 한 마디" 가 무엇인지 알기 위해 시청자는 끝까지 봅니다.
          영상 본문에서는 그 한 마디가 어떤 상황에서 나왔는지,
          왜 평생 기억에 남는지 풀어내시면 됩니다.
        </p>

        <h2>후크 4. 후회 고백 후크</h2>

        <div className="guide-quote">
          <strong>"인생 60년, 가장 후회하는 한 가지"</strong>
        </div>

        <p>
          시니어뿐만 아니라 30~50대 시청자도 끌어들이는 후크입니다.
          누구나 후회를 안고 살기 때문에 "그 사람의 후회는 무엇일까" 라는
          관심이 즉시 생깁니다.
        </p>

        <h2>후크 5. 부모님께 후회 후크</h2>

        <div className="guide-quote">
          <strong>"부모님 돌아가시기 전 꼭 들어야 했던 말"</strong>
        </div>

        <p>
          이 후크는 시청자에게 강력한 감정 반응을 일으킵니다.
          본인의 부모님을 떠올리며 영상을 시청하게 됩니다.
          댓글로 본인의 이야기를 풀어놓는 시청자가 매우 많습니다.
        </p>

        <h2>후크 6. 인연 재회 후크</h2>

        <div className="guide-quote">
          <strong>"40년 전 그 사람을 다시 만났습니다"</strong>
        </div>

        <p>
          오래된 인연의 재회는 모든 사람의 호기심을 자극합니다.
          "어떻게 만났을까" "그 사람은 어떻게 변했을까" 라는 궁금증으로
          시청자가 끝까지 영상을 봅니다.
        </p>

        <h2>후크 7. 손주 첫 말 후크</h2>

        <div className="guide-quote">
          <strong>"손주에게 처음 듣게 된 말"</strong>
        </div>

        <p>
          따뜻하고 감동적인 후크입니다. 같은 세대 조부모님 시청자는
          본인 손주의 첫 말을 떠올리며 공감합니다. 댓글에 본인 손주 이야기가
          줄지어 달리며 채널 참여도가 폭발합니다.
        </p>

        <h2>후크 8. 가족 진실 후크</h2>

        <div className="guide-quote">
          <strong>"가족 모두가 울었던 그날의 진실"</strong>
        </div>

        <p>
          미스터리와 감동을 동시에 자극하는 후크입니다.
          "그날 무슨 일이 있었길래 가족 모두가 울었나" 라는 호기심으로
          시청자가 끝까지 영상을 봅니다.
        </p>

        <h2>후크 활용 시 주의 사항</h2>

        <div className="guide-section">
          <h3>📋 후크 잘 쓰는 3가지 원칙</h3>
          <ol>
            <li><strong>진실해야 함</strong>: 실제 본인 또는 가족 어르신의 진짜 이야기</li>
            <li><strong>구체적이어야 함</strong>: "30년 전 그날" 처럼 구체적 시간과 장소</li>
            <li><strong>본문이 따라야 함</strong>: 후크가 강해도 본문이 약하면 시청 중단</li>
          </ol>
        </div>

        <p>
          후크에 거짓이나 과장이 들어가면 시청자가 본문에서 알아챕니다.
          "낚시 영상" 이라는 평을 받기 시작하면 채널 신뢰도가 무너집니다.
          후크는 본문에서 충실히 답할 수 있는 진짜 이야기여야 합니다.
        </p>

        <p>
          또한 같은 후크를 매 영상마다 그대로 사용하시면 시청자가 식상해합니다.
          위 8가지 패턴을 돌려가며 사용하시되, 본인의 표현으로 조금씩 다듬어 보세요.
          예를 들어 "50년 전 이맘때, 저는…" 대신 "정확히 50년 전 봄, 그날 저는…"
          처럼 구체화하면 더 생생한 느낌을 줄 수 있습니다.
        </p>

        <h2>후크와 본문의 연결</h2>

        <p>
          강력한 후크로 시청자를 잡아도, 본문이 약하면 중간에 이탈합니다.
          본문은 다음 3단계로 구성하시면 됩니다.
        </p>

        <ol>
          <li>
            <strong>상황 묘사</strong>: 그날의 분위기, 장소, 사람을 생생하게
          </li>
          <li>
            <strong>핵심 사건</strong>: 후크에서 약속한 이야기의 본질
          </li>
          <li>
            <strong>의미와 교훈</strong>: 이 이야기가 왜 중요한지, 시청자에게 전하는 메시지
          </li>
        </ol>

        <h2>마치며</h2>

        <p>
          후크는 영상의 첫 인상입니다. 첫 5초에 시청자의 마음을 잡지 못하면
          그 다음 50초의 노력은 무용지물이 됩니다. 위 8가지 후크를
          본인의 콘텐츠에 맞게 변형해서 매번 다른 패턴을 사용해 보세요.
        </p>

        <p>
          시간이 지나면 본인만의 후크 스타일이 생깁니다.
          그것이 채널의 정체성이 되고, 시청자가 채널을 기억하게 만드는 무기가 됩니다.
          처음에는 위 패턴을 그대로 쓰시되, 점점 본인의 색깔로 다듬어 가세요.
        </p>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/senior-content-ideas" style={{ color: '#c2410c' }}>시니어 채널 콘텐츠 아이디어 30가지</Link></li>
            <li><Link href="/blog/senior-engagement" style={{ color: '#c2410c' }}>시니어 채널 댓글과 참여 늘리는 5가지 질문</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
