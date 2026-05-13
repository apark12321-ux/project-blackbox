'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { GuideMetadata } from '../../_shared/GuideMetadata';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ChatGPT로 영상 대본 쓰는 법 — 시니어도 5분 만에',
  description: 'ChatGPT를 처음 쓰는 분도 5분 만에 따라할 수 있는 영상 대본 작성법. 프롬프트 7가지 템플릿 포함.',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  author: { '@type': 'Organization', name: 'NuTube' },
  publisher: {
    '@type': 'Organization',
    name: 'NuTube',
    url: 'https://nutube.kr',
  },
  inLanguage: 'ko',
};

export default function ChatGPTScriptGuide() {
  return (
    <V18Shell>
      <GuideMetadata
        slug="chatgpt-script"
        title="ChatGPT로 영상 대본 빠르게 쓰는 법"
        subtitle="AI를 보조 도구로 활용하는 5가지 프롬프트"
        description="AI를 보조 도구로 활용하는 5가지 프롬프트"
        category="AI 도구"
        publishedAt="2026-04-30"
        readTime="7분"
      />

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
        .guide-formula { padding: 16px 18px; background: #0a0a0a; color: #ffffff; margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace; font-size: 15px; line-height: 1.7; word-break: keep-all; overflow-wrap: anywhere; }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta { margin-top: 36px; padding: 20px; background: #fafafa; border: 1px solid #e5e5e5; text-align: center; }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn { display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; }
        .guide-cta-btn:hover { background: #c2410c; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ AI 도구 · ChatGPT</div>
        <h1 className="guide-h1">ChatGPT로 영상 대본 쓰는 법</h1>
        <p className="guide-subtitle">
          ChatGPT 처음 쓰는 분들도 5분 만에 따라할 수 있는 영상 대본 작성법.
          시니어 친화 프롬프트 7가지 템플릿 포함.
        </p>
        <div className="guide-meta">
          <span>📅 2026.05.02</span>
          <span>·</span><span>·</span>
          <span>🤖 AI 도구</span>
        </div>

        <p>
          ChatGPT 라는 단어는 들어보셨는데 실제로 어떻게 쓰는지 모르시는 분들이
          많습니다. 어렵게 생각하실 필요 없습니다. "친구한테 부탁하듯 말로 적기"
          만 하시면 됩니다.
        </p>

        <p>
          영상 대본을 ChatGPT 로 쓰는 5분 가이드를 알려드립니다.
        </p>

        <h2>1. ChatGPT 시작하기 (3분)</h2>

        <h3>접속 방법</h3>

        <ol>
          <li>인터넷 브라우저 (크롬, 사파리 등) 열기</li>
          <li>주소창에 <strong>chat.openai.com</strong> 입력</li>
          <li>"Sign up" 또는 "회원가입" 누르기</li>
          <li>이메일 입력 → 인증 → 끝</li>
        </ol>

        <div className="guide-callout">
          💡 무료 버전으로도 영상 대본 충분히 쓸 수 있습니다.
          유료 (월 22달러) 는 영상 100편 이상 만드신 후 고민하셔도 됩니다.
        </div>

        <h3>한국어 사용</h3>

        <p>
          ChatGPT 는 한국어 100% 지원합니다. 영어로 안 써도 됩니다.
          한국말로 편하게 부탁하시면 됩니다.
        </p>

        <h2>2. 영상 대본 쓰는 7가지 프롬프트</h2>

        <h3>프롬프트 1: 기본 영상 대본</h3>

        <div className="guide-formula">
          <strong>"50대 재테크 ETF 입문" 주제로 7분짜리 유튜브 영상 대본 써줘.</strong><br /><br />
          - 시청자: 50대 직장인<br />
          - 톤: 친근한 멘토 어투<br />
          - 구조: 후크 30초 + 본론 5분 + 정리 1분<br />
          - 첫 30초에 시청자가 끝까지 보고 싶게 만드는 후크 포함
        </div>

        <h3>프롬프트 2: 후크 (첫 30초) 강화</h3>

        <div className="guide-formula">
          <strong>위 대본의 첫 30초 후크를 더 강력하게 다시 써줘.</strong><br /><br />
          - 시청자가 "이거 끝까지 봐야겠다" 라고 느끼게<br />
          - 충격적 사실 또는 질문 형식으로 시작<br />
          - 영상이 약속하는 가치를 명확히
        </div>

        <h3>프롬프트 3: 시청자 입장에서 개선</h3>

        <div className="guide-formula">
          <strong>이 대본을 50대가 듣기에 더 친근하게 다시 써줘.</strong><br /><br />
          - 어려운 영어/외국어 단어 줄이기<br />
          - 일상 표현으로 바꾸기<br />
          - 너무 빠르지 않게 호흡 두기
        </div>

        <h3>프롬프트 4: SEO 친화 키워드</h3>

        <div className="guide-formula">
          <strong>이 대본에 "50대 재테크" 검색에 잘 걸릴 키워드 5개 자연스럽게 넣어줘.</strong><br /><br />
          - 영상 시작 30초 안에 핵심 키워드 1번 말하기<br />
          - 나머지 키워드는 본문에 자연스럽게
        </div>

        <h3>프롬프트 5: 시청 지속률 높이기</h3>

        <div className="guide-formula">
          <strong>이 대본에 "잠시 후 ××를 알려드리겠습니다" 같은 미끼 3개 넣어줘.</strong><br /><br />
          - 1분, 3분, 5분 지점에 배치<br />
          - 시청자가 끝까지 보게 만드는 호기심 유발
        </div>

        <h3>프롬프트 6: 댓글 유도 질문</h3>

        <div className="guide-formula">
          <strong>이 영상에 어울리는 시청자 댓글 유도 질문 3가지 추천해줘.</strong><br /><br />
          - 답하기 쉬운 구체적 질문<br />
          - "여러분의 ○○ 경험 들려주세요" 형식
        </div>

        <h3>프롬프트 7: 쇼츠 60초 버전</h3>

        <div className="guide-formula">
          <strong>이 7분 대본을 60초 쇼츠 버전으로 줄여줘.</strong><br /><br />
          - 가장 핵심 내용만<br />
          - 첫 3초에 후크<br />
          - 마지막 5초에 풀버전 영상으로 유도
        </div>

        <h2>3. ChatGPT 더 잘 쓰는 5가지 팁</h2>

        <h3>팁 1: 구체적으로 부탁하기</h3>

        <ul>
          <li>❌ 나쁜 예: "재테크 영상 대본 써줘"</li>
          <li>✅ 좋은 예: "50대 직장인 대상 7분짜리 ETF 입문 영상 대본, 친근한 톤"</li>
        </ul>

        <h3>팁 2: 마음에 안 들면 다시 쓰기</h3>

        <p>
          첫 번째 답변이 마음에 안 들면 바로 "다시 써줘" 라고 하세요.
          매번 다른 결과가 나옵니다. 평균 3번 시도하면 만족스러운 결과 나옵니다.
        </p>

        <h3>팁 3: 부분적으로 수정 요청</h3>

        <ul>
          <li>"이 부분만 더 짧게"</li>
          <li>"마지막 정리 부분만 다시 써줘"</li>
          <li>"두 번째 단락에 예시 1개 추가"</li>
        </ul>

        <h3>팁 4: 본인 톤·스타일 학습시키기</h3>

        <div className="guide-formula">
          <strong>나는 50대 남성이고, 친근한 동네 형 같은 톤으로 영상 만들어.</strong><br />
          <strong>"여러분" 보다는 "여러분들이"</strong><br />
          <strong>"입니다" 보다는 "이에요"</strong><br />
          <strong>이 톤으로 다음 대본 써줘.</strong>
        </div>

        <h3>팁 5: 실수와 한계 인지</h3>

        <ul>
          <li><strong>최신 정보 X:</strong> 2024년 이후 정보는 부정확할 수 있음. 사실 확인 필수.</li>
          <li><strong>과장된 통계:</strong> "○○가 90% 효과" 같은 수치는 의심할 것.</li>
          <li><strong>특정 인명·기업명:</strong> 실명 거론은 사실 확인 필수.</li>
        </ul>

        <h2>4. 5분 만에 영상 대본 만드는 워크플로</h2>

        <ol>
          <li><strong>1분:</strong> 프롬프트 1 (기본 대본 요청)</li>
          <li><strong>1분:</strong> 프롬프트 2 (후크 강화)</li>
          <li><strong>1분:</strong> 프롬프트 4 (SEO 키워드)</li>
          <li><strong>1분:</strong> 프롬프트 5 (시청 지속률)</li>
          <li><strong>1분:</strong> 본인 톤으로 자연스럽게 다듬기</li>
        </ol>

        <div className="guide-callout">
          💡 ChatGPT 가 만든 대본 그대로 사용하지 마세요. 본인 입에 맞게 다듬는 게 중요합니다.
          본인이 직접 말해보면서 어색한 부분 수정하세요.
        </div>

        <h2>주의사항 — AI 의존 X</h2>

        <p>
          ChatGPT 는 강력한 도구지만 만능이 아닙니다.
        </p>

        <ul>
          <li><strong>본인 경험은 본인이 적기:</strong> AI 가 본인 인생 모릅니다.</li>
          <li><strong>사실 확인은 본인 책임:</strong> 통계·수치는 직접 검증.</li>
          <li><strong>완전 복붙 X:</strong> 모든 채널이 비슷한 영상 → 차별점 없어짐.</li>
        </ul>


        <h2>AI 대본 사용 시 주의할 점</h2>
        <p>
          ChatGPT가 만든 대본을 그대로 사용하면 시청자가 어색함을 느낍니다.
          본인의 말투로 다시 쓰거나 핵심 키워드만 가져오는 식으로 사용하세요.
          AI는 보조 도구입니다. 영상의 본질은 본인의 진짜 이야기여야 합니다.
        </p>
        <p>
          또한 같은 프롬프트만 계속 사용하면 비슷한 패턴의 영상이 많이 나옵니다.
          시청자가 식상해하지 않도록 주제마다 다른 프롬프트를 사용하세요.
          본인만의 프롬프트 5~10개를 정리해두시면 작업 효율이 올라갑니다.
        </p>

        <p>
          ChatGPT를 사용하실 때 가장 중요한 것은 <strong>구체적인 프롬프트</strong>입니다.
          "유튜브 대본 써줘" 보다는 "60대 시청자 대상으로 5분 분량의 추억 회상 영상 대본,
          첫 30초에 강한 후크 포함" 처럼 구체적으로 요청해야 좋은 결과가 나옵니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/ai-tools" style={{ color: "#c2410c" }}>AI 영상 만들기 도구 모음</Link></li>
            <li><Link href="/blog/ai-thumbnail" style={{ color: "#c2410c" }}>AI 썸네일 만드는 법</Link></li>
            <li><Link href="/blog/human-warmth" style={{ color: "#c2410c" }}>AI 시대 인간의 온도</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
