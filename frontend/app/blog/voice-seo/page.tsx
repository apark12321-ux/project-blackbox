'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function VoiceSEOGuide() {
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

        <div className="guide-kicker">AI 도구 활용 · 음성 SEO</div>
        <h1 className="guide-h1">
          음성 SEO 완전 정복 - 검색 노출 200%
        </h1>
        <p className="guide-subtitle">
          AI 자막이 검색 엔진을 잡는 새로운 SEO 방식을 알려드립니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.01 발행</span>
          <span>·</span>
          <span>📂 AI 도구</span>
        </div>

        <div className="guide-section">
          <p>
            요즘 유튜브 알고리즘은 <strong>영상의 음성 내용</strong>까지 분석합니다.
            제목과 설명만 잘 쓴다고 검색에 잘 노출되는 시대가 끝났습니다.
            영상 안에서 어떤 말을 하는지, 어떤 키워드가 자주 나오는지를 AI 가 자동으로 인식합니다.
          </p>
          <p>
            이 가이드는 <strong>음성 SEO</strong> 라는 새로운 검색 노출 전략을 알려드립니다.
            AI 자막을 활용하면 같은 영상이라도 검색 노출이 200% 까지 늘어나는 사례가 많습니다.
            특히 시니어 채널처럼 진정성 있는 이야기를 하는 분들께 유리한 전략입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 음성 SEO 가 무엇인가</h2>
          <p>
            기존 SEO 는 글자 기반이었습니다. 제목, 설명, 태그에 키워드를 넣으면 검색에 노출되었습니다.
            그런데 유튜브는 이제 <strong>음성 내용</strong>도 키워드로 인식합니다.
          </p>
          <h3>유튜브의 변화</h3>
          <ul>
            <li>영상 음성 자동 분석 (한국어 + 영어 모두)</li>
            <li>키워드 빈도 자동 측정</li>
            <li>주제 자동 분류</li>
            <li>관련 영상 추천에 활용</li>
          </ul>
          <h3>왜 200% 효과인가</h3>
          <p>
            제목 + 설명 + 태그 = 보통 50~100 키워드만 인식.
            영상 안 음성 = 5~10분 영상 기준 1,000~2,000 단어 인식.
            결과적으로 검색 가능한 키워드가 <strong>20배 늘어납니다</strong>.
            이것이 검색 노출 200% 효과의 진짜 이유입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>2. AI 자막 자동 생성 방법</h2>
          <p>
            유튜브 자체에서 AI 자막을 자동으로 만들어줍니다.
            하지만 정확도가 80~85% 정도라 그냥 두면 검색에 약합니다.
            <strong>자막을 직접 검토하고 수정</strong>하는 것이 핵심입니다.
          </p>
          <h3>자막 만드는 방법 3가지</h3>
          <ol>
            <li><strong>유튜브 자동 자막</strong> (무료, 정확도 80%)</li>
            <li><strong>AI 도구 활용</strong> (Whisper, Clova 등 정확도 95%)</li>
            <li><strong>수동 작성</strong> (정확도 100%, 시간 많이 걸림)</li>
          </ol>
          <h3>추천 - 2번 + 3번 조합</h3>
          <ul>
            <li>먼저 AI 도구로 자동 변환</li>
            <li>중요 키워드 부분만 수동 수정</li>
            <li>맞춤법, 띄어쓰기 점검</li>
            <li>유튜브 스튜디오에 SRT 파일 업로드</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3. 음성 SEO 7가지 원칙</h2>
          <p>
            영상을 찍을 때 다음 7가지 원칙을 지키시면 음성 SEO 효과가 극대화됩니다.
          </p>
          <h3>핵심 원칙</h3>
          <ul>
            <li><strong>핵심 키워드 5번 이상 반복</strong>: 영상 시작/중간/끝</li>
            <li><strong>관련 단어 다양하게</strong>: 같은 주제 여러 표현 사용</li>
            <li><strong>처음 30초에 키워드 집중</strong>: 알고리즘이 가장 주목</li>
            <li><strong>또박또박 발음</strong>: AI 인식률 ↑</li>
            <li><strong>구체적인 숫자 언급</strong>: "5가지", "10분 안에"</li>
            <li><strong>지역 + 분야 조합</strong>: "서울 50대 부업"</li>
            <li><strong>질문형 키워드 사용</strong>: "어떻게", "왜", "방법"</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 자막 SEO 최적화 단계</h2>
          <p>
            자막을 그냥 올리는 것과 SEO 최적화한 자막은 결과가 완전히 다릅니다.
            5단계만 따라하시면 됩니다.
          </p>
          <h3>1단계 - 키워드 강조</h3>
          <ul>
            <li>핵심 키워드를 자막에서 명확히 표기</li>
            <li>예: "유튜브 알고리즘" → 그대로 자막에</li>
            <li>줄임말, 은어 사용 X</li>
          </ul>
          <h3>2단계 - 시간 정확히 맞추기</h3>
          <ul>
            <li>영상 음성과 자막 동기화</li>
            <li>30초 이상 자막 X (분리 권장)</li>
            <li>자막 사이 1~2초 간격</li>
          </ul>
          <h3>3단계 - 다국어 자막 추가</h3>
          <ul>
            <li>한국어 자막 필수</li>
            <li>영어 자막 추가 시 노출 ↑ (해외 시청자)</li>
            <li>AI 번역 도구 활용</li>
          </ul>
          <h3>4단계 - 챕터 마커 활용</h3>
          <ul>
            <li>영상 설명에 타임스탬프 추가</li>
            <li>각 챕터에 키워드 포함</li>
            <li>예: "00:00 도입", "01:30 SEO 핵심"</li>
          </ul>
          <h3>5단계 - 자막 파일 업로드</h3>
          <ul>
            <li>SRT 또는 VTT 형식</li>
            <li>유튜브 스튜디오 → 자막 → 추가</li>
            <li>수동 검토 후 게시</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. AI 도구 추천</h2>
          <p>
            음성 SEO 작업에 추천드리는 무료/유료 AI 도구들입니다.
          </p>
          <h3>한국어 음성 인식 (정확도 순)</h3>
          <ul>
            <li><strong>Naver Clova Note</strong>: 한국어 95%, 무료</li>
            <li><strong>OpenAI Whisper</strong>: 한국어 90%, 무료 (개발자 친화)</li>
            <li><strong>유튜브 자동 자막</strong>: 80%, 무료</li>
          </ul>
          <h3>자막 편집 도구</h3>
          <ul>
            <li><strong>VLLO</strong>: 모바일 친화, 한국어</li>
            <li><strong>키네마스터</strong>: 시니어 사용 많음</li>
            <li><strong>Subtitle Edit</strong>: 데스크톱 무료</li>
          </ul>
          <h3>키워드 분석 도구</h3>
          <ul>
            <li><strong>Google Trends</strong>: 인기 검색어 무료</li>
            <li><strong>Naver DataLab</strong>: 한국어 트렌드</li>
            <li><strong>vidIQ</strong>: 유튜브 전용 (무료/유료)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>6. 음성 SEO 흔한 실수 5가지</h2>
          <p>
            많은 분들이 음성 SEO 를 시작하실 때 다음 5가지 실수를 하십니다.
          </p>
          <h3>피해야 할 실수</h3>
          <ul>
            <li><strong>키워드 과도 반복</strong>: 5번이 적정, 20번은 스팸</li>
            <li><strong>자연스럽지 않은 말투</strong>: 시청자가 거부감</li>
            <li><strong>자막 오타 방치</strong>: 알고리즘이 잘못 인식</li>
            <li><strong>너무 빠른 발음</strong>: AI 인식률 ↓</li>
            <li><strong>영어 무리 사용</strong>: 한국 시청자 이탈</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            음성 SEO 는 <strong>새로운 시대의 검색 전략</strong>입니다.
            글자만 잘 쓰는 시대가 끝나고 영상 안 음성까지 검색 대상이 되었습니다.
          </p>
          <p>
            처음에는 자막 작업이 번거로우시겠지만, 한 영상에 30분만 투자하시면 됩니다.
            그 결과로 검색 노출이 2배 늘어난다면 충분히 가치 있는 투자입니다.
          </p>
          <p>
            오늘부터 다음 영상 만드실 때 자막 작업도 함께 하세요.
            한 달 후 분석에서 차이가 보이실 것입니다.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/algorithm-seo" style={{ color: '#c2410c' }}>알고리즘이 내 영상을 알아보게 하는 SEO 전략</Link></li>
            <li><Link href="/blog/ai-tools" style={{ color: '#c2410c' }}>AI 영상 만들기 도구 모음</Link></li>
            <li><Link href="/blog/chatgpt-script" style={{ color: '#c2410c' }}>ChatGPT로 영상 대본 빠르게 쓰는 법</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
