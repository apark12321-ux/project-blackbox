'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorShootingMistakesGuide() {
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

        <div className="guide-kicker">시니어 사연 쇼츠 · 촬영 노하우</div>
        <h1 className="guide-h1">
          시니어가 처음 영상 찍을 때 흔한 실수 7가지
        </h1>
        <p className="guide-subtitle">
          50대 이후 처음 영상을 찍으실 때 자주 하시는 실수와 해결 방법을 정리해드립니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.06 발행</span>
          <span>·</span>
          <span>📂 시니어</span>
        </div>

        <div className="guide-section">
          <p>
            처음 영상을 찍으실 때는 누구나 실수합니다. 50대 이후 시작하시는 분들은
            특히 디지털 환경에 익숙하지 않아 비슷한 실수를 반복하시는 경우가 많습니다.
            이 가이드에서는 시니어 분들이 자주 하시는 7가지 실수와 그 해결 방법을
            구체적으로 알려드립니다.
          </p>
          <p>
            아래 내용을 먼저 보시고 영상을 찍으시면, 처음부터 깔끔한 결과를 얻으실 수 있습니다.
            <strong>완벽한 영상이 아니어도 괜찮습니다.</strong> 기본 실수만 피하셔도
            시청자가 보기 편한 영상을 만드실 수 있습니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 가로 촬영을 세로로 찍기</h2>
          <p>
            가장 흔한 실수입니다. 일반 영상은 가로 (16:9), 쇼츠는 세로 (9:16) 입니다.
            유튜브 일반 영상을 만드시는데 세로로 찍으시면 화면 양옆에 검은 띠가 생깁니다.
            반대로 쇼츠를 가로로 찍으시면 화면이 작아집니다.
          </p>
          <h3>해결법</h3>
          <p>
            촬영 전에 <strong>"내 영상이 일반 영상인가, 쇼츠인가"</strong>를 먼저 정하세요.
          </p>
          <ul>
            <li>일반 영상: 가로로 들고 촬영 (스마트폰 옆으로 눕히기)</li>
            <li>쇼츠/릴스: 세로로 들고 촬영 (스마트폰 그대로)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>2. 음성이 너무 작게 녹음</h2>
          <p>
            영상은 잘 보이는데 목소리가 안 들리는 경우가 많습니다.
            스마트폰 마이크는 1미터 정도까지만 잘 잡습니다.
            거리가 멀거나 주변이 시끄러우면 시청자가 못 알아듣습니다.
          </p>
          <h3>해결법</h3>
          <ul>
            <li>스마트폰을 입에서 30~50cm 거리에 두기</li>
            <li>조용한 실내에서 촬영 (선풍기, 에어컨 끄기)</li>
            <li>창문 닫고 촬영 (외부 소음 차단)</li>
            <li>예산이 되시면 5~10만원대 핀 마이크 추천</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3. 흔들림이 심함</h2>
          <p>
            손으로 들고 찍으면 미세하게 흔들립니다. 처음에는 못 느끼지만 영상을 보시면
            어지러움을 느끼게 됩니다. 시청자가 끝까지 보지 않는 가장 큰 이유 중 하나입니다.
          </p>
          <h3>해결법</h3>
          <ul>
            <li><strong>삼각대 사용 (3~5만원)</strong>: 가장 효과적. 시니어 분들께 강추</li>
            <li>책상이나 테이블에 스마트폰 거치</li>
            <li>벽에 기대어 두 손으로 잡기</li>
            <li>스마트폰 자체 흔들림 보정 기능 켜기</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 역광 촬영</h2>
          <p>
            창문을 등지고 찍으시면 얼굴이 새까맣게 나옵니다.
            시청자는 얼굴이 안 보이면 채널을 떠납니다.
            특히 낮 시간 실내 촬영에서 자주 발생합니다.
          </p>
          <h3>해결법</h3>
          <ul>
            <li><strong>창문을 마주 보고 촬영</strong> (자연광이 얼굴에)</li>
            <li>창문이 옆에 있으면 측면광으로 활용</li>
            <li>밤 촬영은 천장 형광등 켜기</li>
            <li>예산이 되시면 LED 조명 (3~7만원) 추천</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. 자기 모습이 너무 작게 나옴</h2>
          <p>
            전신이 다 보이게 찍으시면 시청자에게 표정이 안 보입니다.
            유튜브에서 가장 중요한 것은 <strong>표정</strong>입니다.
            특히 시니어 채널은 진정성 있는 표정이 핵심입니다.
          </p>
          <h3>해결법</h3>
          <ul>
            <li>가슴에서 머리까지 보이게 촬영 (반신)</li>
            <li>쇼츠는 얼굴 클로즈업 (눈썹부터 입까지)</li>
            <li>스마트폰을 너무 가까이 두지는 않기 (왜곡 방지)</li>
            <li>적정 거리: 50cm ~ 1m</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>6. 한 번에 너무 길게 촬영</h2>
          <p>
            "10분짜리 영상이니까 10분 동안 한 번에 찍어야지" 라고 생각하시면 안 됩니다.
            중간에 실수하면 처음부터 다시 찍어야 합니다. 편집도 어렵습니다.
          </p>
          <h3>해결법</h3>
          <ul>
            <li>1~2분 단위로 끊어서 촬영</li>
            <li>실수하면 그 부분만 다시 찍기</li>
            <li>편집 단계에서 자연스럽게 이어 붙이기</li>
            <li>처음에는 1분 영상부터 시작 (부담 적음)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>7. 편집 없이 그대로 업로드</h2>
          <p>
            촬영한 영상을 그대로 올리시면 시청자가 답답해합니다.
            중간에 멍한 부분, 실수한 부분, 너무 긴 부분은 편집해야 합니다.
            편집 = 시청자 시간 존중 = 시청 지속률 ↑
          </p>
          <h3>해결법</h3>
          <ul>
            <li><strong>CapCut 무료 앱</strong> 으로 기본 편집 (자르기, 자막)</li>
            <li>처음에는 어려우니 자르기만 해도 OK</li>
            <li>자막은 음성 자동 인식 기능 활용</li>
            <li>BGM은 유튜브 오디오 라이브러리 무료 활용</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            처음에는 실수해도 괜찮습니다. 한 영상씩 만들 때마다 조금씩 좋아집니다.
            <strong>위 7가지만 피하셔도 시청자가 보기 편한 영상을 만드실 수 있습니다.</strong>
          </p>
          <p>
            촬영 → 편집 → 업로드 까지 처음에는 한 영상에 3~4시간 걸리실 수 있습니다.
            괜찮습니다. 5편째쯤 되면 1~2시간으로 줄어듭니다.
            10편째쯤 되면 자동화됩니다.
          </p>
          <p>
            가장 중요한 것은 <strong>꾸준함</strong>입니다.
            완벽하지 않아도 매주 1~2편 꾸준히 올리시면 시청자가 모입니다.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-channel-start" style={{ color: '#c2410c' }}>50대부터 시작하는 시니어 사연 쇼츠 채널</Link></li>
            <li><Link href="/blog/phone-shooting" style={{ color: '#c2410c' }}>핸드폰만으로 영상 잘 찍는 법</Link></li>
            <li><Link href="/blog/free-editing-apps" style={{ color: '#c2410c' }}>무료 영상 편집 앱 추천</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
