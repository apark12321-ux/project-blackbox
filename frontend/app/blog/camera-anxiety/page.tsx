'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '카메라 울렁증 극복하는 5가지 방법 — 처음 영상 찍으시는 분들께',
  description: '카메라만 켜면 얼어붙는 분들을 위한 실전 5가지 방법. 시선 처리, 첫마디, 호흡 조절까지.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'NuTube' },
  publisher: { '@type': 'Organization', name: 'NuTube', url: 'https://nutube.kr' },
  inLanguage: 'ko',
};

export default function CameraAnxietyGuide() {
  return (
    <V18Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <style jsx>{`
        .guide { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; font-family: 'Pretendard', -apple-system, system-ui, sans-serif; color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em; }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #c2410c; margin-bottom: 8px; text-transform: uppercase; }
        .guide-h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.3; margin: 0 0 12px; word-break: keep-all; }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle { font-size: 17px; color: #525252; margin: 0 0 24px; line-height: 1.6; word-break: keep-all; }
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
        .guide-callout { padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24; margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all; }
        .guide-formula { padding: 16px 18px; background: #0a0a0a; color: #ffffff; margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace; font-size: 15px; line-height: 1.7; word-break: keep-all; }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta { margin-top: 36px; padding: 20px; background: #fafafa; border: 1px solid #e5e5e5; text-align: center; }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn { display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 영상 제작 · 멘탈</div>
        <h1 className="guide-h1">카메라 울렁증 극복 5가지 방법</h1>
        <p className="guide-subtitle">
          카메라만 켜면 머리가 새하얘지는 분들께. 처음엔 모두 그랬습니다.
          1주일 안에 자연스럽게 말할 수 있는 실전 5가지 방법.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span><span>·</span><span>·</span><span>🎤 영상 제작</span>
        </div>

        <p>
          처음 카메라 앞에 서면 누구나 얼어붙습니다. 평소에는 잘 말하다가도
          빨간 녹화 버튼만 누르면 갑자기 단어가 떠오르지 않고, 입이 마르고,
          말이 빨라집니다. 이게 카메라 울렁증입니다.
        </p>

        <p>
          1만 명 이상 구독자를 가진 유튜버들도 처음엔 모두 그랬습니다.
          극복 방법은 의외로 간단합니다.
        </p>

        <h2>1. 카메라 렌즈를 사람이라 생각하지 마세요</h2>

        <p>
          가장 흔한 실수가 "카메라 렌즈를 똑바로 봐야 한다" 는 강박입니다.
          렌즈를 사람 눈처럼 노려보면 더 긴장됩니다.
        </p>

        <h3>대신 이렇게</h3>

        <ul>
          <li><strong>친한 친구한테 설명하듯:</strong> 렌즈 옆 빈 공간을 보면서 친구한테 말하듯</li>
          <li><strong>화면 보지 마세요:</strong> 본인 모습 보면 더 부자연스러워짐</li>
          <li><strong>대본 읽지 마세요:</strong> 외운 대로 말하면 어색함. 키워드만 적기</li>
        </ul>

        <h2>2. 첫 30초만 외워두세요</h2>

        <p>
          전체 대본을 외우려고 하면 안 됩니다. 가장 긴장되는 첫 30초만
          외워두면 됩니다. 첫 30초가 자연스럽게 흘러가면 그 다음은
          저절로 됩니다.
        </p>

        <h3>첫 30초 공식</h3>

        <div className="guide-formula">
          <strong>인사 (5초):</strong> "안녕하세요, ○○입니다"<br />
          <strong>주제 (10초):</strong> "오늘은 ○○에 대해 이야기하려고 해요"<br />
          <strong>약속 (15초):</strong> "이 영상 끝까지 보시면 ○○를 얻어가실 수 있어요"
        </div>

        <h3>이 30초만 100번 연습</h3>

        <p>
          출근 전, 산책할 때, 잠들기 전 같은 짜투리 시간에 이 30초만
          반복해서 연습하세요. 1주일이면 입에 붙습니다.
        </p>

        <h2>3. NG 컷도 그냥 두세요</h2>

        <p>
          처음에는 한 영상에 100번 NG가 납니다. 매번 다시 시작하면 더 긴장됩니다.
          말 더듬은 부분도 그냥 둔 채로 끝까지 찍으세요.
        </p>

        <h3>편집에서 해결</h3>

        <ul>
          <li>NG 컷은 편집할 때 잘라내면 됩니다</li>
          <li>완벽한 한 번 찍기 X. 30번 찍어서 좋은 부분만 모으기 ✓</li>
          <li>"3초 멈춤" 신호 만들기: 말 막히면 3초 정지 → 편집에서 잘라내기</li>
        </ul>

        <div className="guide-callout">
          💡 처음 100편은 NG가 90%입니다. 정상입니다. 편집의 마법으로 매끄러워집니다.
        </div>

        <h2>4. 첫 영상은 5분이 아니라 30초</h2>

        <p>
          처음부터 5~10분짜리 영상 만들려고 하지 마세요. 첫 1주일은
          30초짜리 짧은 영상만 찍으세요. 카메라에 익숙해지는 게 목적입니다.
        </p>

        <h3>1주일 워밍업 플랜</h3>

        <ul>
          <li><strong>월:</strong> 30초 자기소개</li>
          <li><strong>화:</strong> 30초 본인 직업 설명</li>
          <li><strong>수:</strong> 1분 오늘 있었던 일</li>
          <li><strong>목:</strong> 1분 본인이 좋아하는 것</li>
          <li><strong>금:</strong> 2분 본인 전문 분야 한 가지 팁</li>
          <li><strong>토~일:</strong> 3분짜리 영상 1편</li>
        </ul>

        <p>
          이 1주일이 지나면 카메라가 더 이상 무섭지 않습니다.
          그 후에 본격적으로 채널 영상을 만드세요.
        </p>

        <h2>5. 본인 영상 절대 다시 보지 마세요</h2>

        <p>
          처음 시작하시는 분들이 가장 많이 하는 실수가 "본인 영상 보고 좌절" 입니다.
          본인 목소리는 평소 들리는 것과 다르게 들립니다. 외모도 더 안 좋아 보입니다.
          이건 모두가 그렇습니다.
        </p>

        <h3>건강한 거리두기</h3>

        <ul>
          <li><strong>편집할 때만 보기:</strong> 자르고 자막 다는 용도로만</li>
          <li><strong>업로드 후 1주일 보지 마세요:</strong> 객관적으로 봐야 개선점 보임</li>
          <li><strong>다른 사람 의견:</strong> 본인 평가는 가혹함. 가족·친구에게 보여주기</li>
        </ul>

        <h2>6. 보너스 — 시니어 친화 톤 만들기</h2>

        <p>
          50대 이상 시니어가 카메라 앞에서 가장 잘하는 것이 "차분한 톤" 입니다.
          억지로 20대처럼 빠르게 말하지 마세요.
        </p>

        <h3>시니어 톤의 강점</h3>

        <ul>
          <li><strong>느린 속도가 신뢰감:</strong> 1분에 130~150 단어 정도</li>
          <li><strong>또박또박 발음:</strong> 시청자가 알아듣기 쉬움</li>
          <li><strong>2~3초 정지 OK:</strong> 생각하는 모습이 자연스러움</li>
          <li><strong>경어 사용:</strong> 시청자에게 존중감</li>
        </ul>

        <h2>7. 1개월 후 비교해보세요</h2>

        <p>
          첫 영상 찍은 날과 1개월 후 영상을 나란히 보면 본인도 놀랍니다.
          말투가 자연스러워지고, 표정이 부드러워지고, 눈빛이 살아납니다.
        </p>

        <h3>꾸준함이 답</h3>

        <p>
          카메라 울렁증은 노출의 양에 비례해서 사라집니다.
          매일 30초씩 1주일이면 70% 사라지고, 1달이면 90% 사라집니다.
        </p>

        <h2>흔한 오해 3가지</h2>

        <ol>
          <li>
            <strong>"외향적인 사람만 유튜브 한다" — X</strong><br />
            내향적인 사람들이 오히려 차분하고 깊이 있는 영상을 만듭니다.
          </li>
          <li>
            <strong>"외모가 좋아야 한다" — X</strong><br />
            시청자는 외모보다 콘텐츠와 신뢰감을 봅니다.
          </li>
          <li>
            <strong>"발음이 정확해야 한다" — X</strong><br />
            사투리가 오히려 매력입니다. 자막으로 보완하면 됩니다.
          </li>
        </ol>


        <h2>얼굴 안 나오는 채널의 강점</h2>
        <p>
          얼굴이 안 나와도 충분히 성공하는 채널이 많습니다. 오히려 익명성 덕분에
          시청자가 본인 이야기처럼 받아들이는 경우도 많습니다. 손, 풍경, 자료 화면만으로도
          멋진 영상을 만들 수 있으니 부담 갖지 마세요.
        </p>

        <p>
          카메라 울렁증은 시간이 해결해줍니다. 처음 5번은 정말 어색하지만,
          10번째 영상부터는 자연스러워지고, 30번째 영상이 되면 카메라 앞에서
          편안해지십니다. 처음 어색함을 두려워하지 마시고 일단 시작하세요.
          시청자도 처음 시작하시는 분의 어색함을 따뜻하게 받아줍니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/phone-shooting" style={{ color: "#c2410c" }}>핸드폰만으로 영상 잘 찍는 법</Link></li>
            <li><Link href="/blog/channel-concept" style={{ color: "#c2410c" }}>채널 컨셉 5가지</Link></li>
            <li><Link href="/blog/algorithm-mindset" style={{ color: "#c2410c" }}>멘탈 관리</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
