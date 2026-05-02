'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '떡상 채널 5가지 공통 패턴 — 알고리즘이 사랑하는 영상의 비밀',
  description: '구독자 1만 명 이상 채널들의 공통 패턴 5가지. 첫 30초, 썸네일, 제목, 시청 시간, 업로드 주기까지.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'AlgoMaker' },
  publisher: {
    '@type': 'Organization',
    name: 'AlgoMaker',
    url: 'https://nutube.kr',
  },
  inLanguage: 'ko',
};

export default function ViralPatternsGuide() {
  return (
    <V11Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
        <div className="guide-kicker">▍ 채널 운영 · 분석</div>
        <h1 className="guide-h1">떡상 채널 5가지 공통 패턴</h1>
        <p className="guide-subtitle">
          구독자 1만 명을 넘긴 채널들에는 공통점이 있습니다. 이 5가지 패턴을
          본인 채널에 적용하시면 알고리즘이 영상을 추천하기 시작합니다.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span>
          <span>·</span>
          <span>⏱ 8분</span>
          <span>·</span>
          <span>📊 채널 분석</span>
        </div>

        <p>
          1만 명 이상 채널을 분석해보면 신기하게도 공통 패턴이 보입니다.
          분야는 다 다른데 (요리, 부동산, 건강, 여행 등) 영상 구조가 비슷합니다.
          이건 우연이 아니라 알고리즘이 좋아하는 패턴이기 때문입니다.
        </p>

        <p>
          5가지 핵심 패턴을 정리합니다. 본인 채널에 하나씩 적용해보세요.
        </p>

        <h2>패턴 1: 첫 30초가 영상의 운명을 결정한다</h2>

        <p>
          떡상 채널 영상을 보면 첫 30초가 매우 인상적입니다. 시청자가
          "이 영상 끝까지 봐야겠다" 결심하게 만드는 30초입니다.
        </p>

        <h3>첫 30초 공식</h3>

        <div className="guide-formula">
          <strong>0~3초:</strong> 강력한 후크 (질문, 충격적 사실, 결과 미리 보기)<br />
          <strong>3~10초:</strong> 영상이 무엇을 약속하는지 명확히<br />
          <strong>10~30초:</strong> 본 내용 시작 (불필요한 인사 X)
        </div>

        <h3>피해야 할 첫 30초</h3>

        <ul>
          <li>"안녕하세요, 구독과 좋아요 부탁드립니다" 길게 말하기</li>
          <li>"오늘은 이런 주제를 다뤄보려고 합니다" 같은 메타 설명</li>
          <li>긴 인트로 영상 (5초 이상)</li>
          <li>음악만 나오는 정적인 시작</li>
        </ul>

        <h2>패턴 2: 썸네일에 글자가 5~7개</h2>

        <p>
          떡상 영상 썸네일을 100개만 모아보세요. 거의 모두 글자가
          5~7개입니다. 이는 모바일 화면에서 가장 잘 읽히는 글자 수입니다.
        </p>

        <h3>썸네일 글자 공식</h3>

        <ul>
          <li><strong>5~7글자가 황금:</strong> "월급 100만원 부족", "자취 1인분 비법"</li>
          <li><strong>큰 폰트:</strong> 화면의 30~40% 차지</li>
          <li><strong>대비 강한 색:</strong> 노랑+검정, 빨강+흰색이 효과적</li>
          <li><strong>표정 있는 인물:</strong> 놀란 표정, 의아한 표정 등</li>
        </ul>

        <div className="guide-callout">
          💡 모바일에서 70%가 시청합니다. 데스크탑 큰 화면에서 멋있어 보여도
          모바일에서 글자 안 읽히면 의미 없습니다.
        </div>

        <h2>패턴 3: 제목에 숫자 또는 질문</h2>

        <p>
          떡상 영상 제목을 보면 두 가지 패턴이 압도적입니다.
          숫자가 들어가거나, 질문 형식입니다.
        </p>

        <h3>숫자 패턴</h3>

        <ul>
          <li>"5060이 모르는 부동산 5가지"</li>
          <li>"3분만에 끝내는 자취 요리"</li>
          <li>"1년에 1,000만원 모으는 법"</li>
          <li>"100% 성공하는 면접 비법"</li>
        </ul>

        <h3>질문 패턴</h3>

        <ul>
          <li>"왜 50대 재취업이 어려울까?"</li>
          <li>"청약 가점 부족한데 어떻게?"</li>
          <li>"운동 안 하고 살 빼는 법 있을까?"</li>
        </ul>

        <h3>제목 8:2 법칙</h3>

        <div className="guide-formula">
          <strong>제목 앞 80%</strong> = 검색 키워드 (앞쪽에 배치)<br />
          <strong>제목 뒤 20%</strong> = 호기심 유발 문구<br /><br />
          예: "<strong>50대 재테크 ETF 입문</strong>, 처음엔 절대 하지 마세요"
        </div>

        <h2>패턴 4: 평균 시청 지속률 50% 이상</h2>

        <p>
          떡상 채널의 평균 시청 지속률은 50% 이상입니다. 즉,
          10분 영상이면 5분 이상 시청자가 봤다는 뜻입니다.
          이 수치를 넘기면 알고리즘이 다른 사람들에게 추천하기 시작합니다.
        </p>

        <h3>지속률 높이는 3가지 기술</h3>

        <ul>
          <li><strong>챕터 활용:</strong> 시청자가 원하는 부분 바로 이동. 이탈 방지.</li>
          <li><strong>"잠시 후" 예고:</strong> "이 다음에 ○○를 알려드릴게요" 미끼.</li>
          <li><strong>5분마다 다음 보상:</strong> 새로운 정보·재미 5분마다 주기.</li>
        </ul>

        <h2>패턴 5: 매주 같은 요일·시간 업로드</h2>

        <p>
          떡상 채널 100개를 분석해보면 99개가 정해진 업로드 주기가
          있습니다. "매주 화요일 저녁 7시" 처럼 시청자에게 약속한 시간이죠.
        </p>

        <h3>왜 정해진 시간인가</h3>

        <ul>
          <li><strong>시청자 습관 형성:</strong> 그 시간에 알아서 찾아옴</li>
          <li><strong>알고리즘 신뢰:</strong> "꾸준한 채널" 로 분류</li>
          <li><strong>초기 조회수 확보:</strong> 업로드 직후 1시간이 가장 중요</li>
        </ul>

        <h3>업로드 시간 추천</h3>

        <ul>
          <li><strong>주중:</strong> 저녁 7~9시 (퇴근 후 시청)</li>
          <li><strong>주말:</strong> 오전 9~11시, 저녁 8~10시</li>
          <li><strong>5060 시니어 대상:</strong> 일요일 아침 7시, 평일 오후 2시</li>
        </ul>

        <h2>5가지 패턴 체크리스트</h2>

        <div className="guide-formula">
          □ 1. 첫 30초 강력한 후크가 있는가?<br />
          □ 2. 썸네일 글자가 5~7개인가?<br />
          □ 3. 제목에 숫자 또는 질문이 있는가?<br />
          □ 4. 평균 시청 지속률 50% 이상인가?<br />
          □ 5. 매주 같은 요일·시간 업로드 중인가?
        </div>

        <p>
          이 5가지 중 3개 이상 충족하시면 떡상 가능성이 매우 높습니다.
          한 번에 다 맞추실 필요는 없고, 매주 1가지씩 개선하세요.
        </p>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 떡상 패턴 적용된 자료 자동 생성</div>
          <div className="guide-cta-desc">
            AlgoMaker가 5가지 패턴 모두 적용된 영상 자료를 5초 만에 만들어드립니다.
          </div>
          <Link href="/" className="guide-cta-btn">
            지금 바로 만들기 →
          </Link>
        </div>
      </article>
    </V11Shell>
  );
}
