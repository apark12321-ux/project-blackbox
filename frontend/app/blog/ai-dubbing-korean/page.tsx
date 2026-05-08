'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function GuidePage() {
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

        <div className="guide-kicker">AI 도구 활용 · 자동 더빙</div>
        <h1 className="guide-h1">AI 자동 더빙으로 한국어 영상 자연스럽게 만들기</h1>
        <p className="guide-subtitle">외국어 자막 영상 → 자연스러운 한국어 더빙 자동화</p>

        <div className="guide-meta">
          <span>📅 2026.05.08 발행</span>
          <span>·</span>
          <span>📂 AI 도구</span>
        </div>

        <div className="guide-section">
          <p>
            ## 도입
          </p>
          <p>
            해외 영상이나 외국어 자막 영상을 한국어로 만들고 싶으신 적이 있으셨을 것입니다. 예전에는 성우를 고용하거나 직접 녹음해야 했지만, 이제는 AI 자동 더빙으로 자연스러운 한국어 영상을 만들 수 있습니다.
          </p>
          <p>
            이 가이드는 <strong>AI 자동 더빙</strong> 의 모든 것을 알려드립니다. 무료/유료 도구 비교, 자연스러운 더빙을 만드는 5가지 원칙, 흔한 실수 등을 정리했습니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. AI 더빙이 무엇인가</h2>
          <p>AI 더빙은 인공지능이 자동으로 음성을 합성해 영상에 입히는 기술입니다. 텍스트만 입력하면 자연스러운 한국어 음성이 생성됩니다.</p>
          <h3>기존 더빙 vs AI 더빙</h3>
          <ul>
            <li><strong>기존 더빙</strong>: 성우 섭외 + 녹음 + 편집 (시간 + 비용 ↑)</li>
            <li><strong>AI 더빙</strong>: 텍스트 입력 → 즉시 음성 생성 (시간 1/10, 비용 1/100)</li>
          </ul>
          <h3>AI 더빙 가능한 것</h3>
          <ul>
            <li>외국어 영상 → 한국어 더빙</li>
            <li>텍스트 → 음성 합성</li>
            <li>자막 → 음성 자동 변환</li>
            <li>다국어 더빙 (한 영상 → 여러 언어)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>2. 추천 AI 더빙 도구 4가지</h2>
          <p>무료부터 유료까지 한국어 자연스러운 도구들입니다.</p>
          <h3>무료 도구</h3>
          <ul>
            <li><strong>Naver Clova Voice</strong>: 한국어 자연스러움 95%, 월 1만 자 무료</li>
            <li><strong>Google Cloud TTS</strong>: 다국어 지원, 월 100만 자 무료</li>
          </ul>
          <h3>유료 도구</h3>
          <ul>
            <li><strong>TypeCast</strong>: 한국어 특화, 월 1만 5천원, 정확도 98%</li>
            <li><strong>ElevenLabs</strong>: 영어 + 한국어, 감정 표현 가능, 월 5천원~</li>
          </ul>
          <h3>추천 조합</h3>
          <p>시작은 <strong>Naver Clova Voice</strong> 무료로 시작하시고, 본격 채널 운영 시 <strong>TypeCast</strong> 유료 전환을 권장드립니다.</p>
        </div>

        <div className="guide-section">
          <h2>3. 자연스러운 한국어 더빙 5가지 원칙</h2>
          <p>AI 더빙도 원칙을 지키면 사람이 한 것처럼 자연스럽게 만들 수 있습니다.</p>
          <h3>핵심 원칙</h3>
          <ul>
            <li><strong>문장 짧게 쓰기</strong>: 1문장 20자 이내가 자연스러움</li>
            <li><strong>쉼표 활용</strong>: AI 가 호흡 위치 인식 (1초 휴식)</li>
            <li><strong>숫자 한글로 변환</strong>: "1,000" → "천" (AI 가 더 자연스럽게 읽음)</li>
            <li><strong>외래어 한글 표기</strong>: "YouTube" → "유튜브" 권장</li>
            <li><strong>감탄사 추가</strong>: "아", "음" 등 자연스러운 분위기</li>
          </ul>
          <h3>잘못된 예시</h3>
          <p>"YouTube에서 1,234,567명이 시청한 영상이 있습니다."
→ AI 가 어색하게 읽음</p>
          <h3>좋은 예시</h3>
          <p>"유튜브에서, 무려 백이십삼만 명이 시청한 영상이 있어요."
→ AI 가 자연스럽게 읽음</p>
        </div>

        <div className="guide-section">
          <h2>4. AI 더빙 작업 5단계</h2>
          <h3>1단계 - 대본 작성</h3>
          <ul>
            <li>한국어로 자연스러운 문장</li>
            <li>1문장 20자 이내</li>
            <li>쉼표 적극 사용</li>
            <li>숫자/외래어 한글로 변환</li>
          </ul>
          <h3>2단계 - AI 도구 선택</h3>
          <ul>
            <li>짧은 영상 (1분 이내): Naver Clova Voice 무료</li>
            <li>본격 채널: TypeCast 유료</li>
            <li>영어 더빙: ElevenLabs</li>
          </ul>
          <h3>3단계 - 음성 생성</h3>
          <ul>
            <li>도구에 대본 입력</li>
            <li>목소리 선택 (남/여, 나이, 톤)</li>
            <li>속도 조절 (시니어 채널은 느리게 0.9배)</li>
            <li>음성 파일 다운로드 (MP3 또는 WAV)</li>
          </ul>
          <h3>4단계 - 영상 편집</h3>
          <ul>
            <li>비디오 편집 도구 (CapCut, VLLO 등)</li>
            <li>음성 파일 영상에 맞추기</li>
            <li>배경음악 추가 (음성보다 작게)</li>
            <li>자막 추가 (가독성 ↑)</li>
          </ul>
          <h3>5단계 - 마지막 점검</h3>
          <ul>
            <li>발음 정확성 확인</li>
            <li>음성-영상 동기화 확인</li>
            <li>음량 균형 (음성 70%, 배경 30%)</li>
            <li>최종 미리보기 후 업로드</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. AI 더빙 흔한 실수 5가지</h2>
          <p>많은 분들이 AI 더빙 시작 시 다음 5가지 실수를 하십니다.</p>
          <h3>피해야 할 실수</h3>
          <ul>
            <li><strong>너무 긴 문장</strong>: AI 가 호흡 못 잡음 → 어색해짐</li>
            <li><strong>숫자 그대로</strong>: "1,234" 읽으면 어색 → 한글 변환</li>
            <li><strong>빠른 속도</strong>: 1.2배 이상 → 시니어 시청자 이탈</li>
            <li><strong>무료 도구만 의존</strong>: 본격 채널은 유료 전환 권장</li>
            <li><strong>AI 음성 그대로</strong>: 약간의 후처리 (이퀄라이저) 필요</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>6. 시니어 채널에 특별히 좋은 이유</h2>
          <p>시니어 사연 쇼츠 채널 운영 시 AI 더빙이 특히 유리합니다.</p>
          <h3>장점</h3>
          <ul>
            <li><strong>얼굴 노출 X</strong>: 시니어 분들 카메라 부담 ↓</li>
            <li><strong>편집 시간 ↓</strong>: 녹음 X 필요 → 편집 빨라짐</li>
            <li><strong>목소리 일관성</strong>: 매 영상 같은 AI 목소리</li>
            <li><strong>다양한 톤</strong>: 사연마다 다른 목소리 가능 (할머니/할아버지/손자 등)</li>
            <li><strong>외국어 영상 활용</strong>: 해외 사연도 한국어로</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>7. 비용 절감 팁</h2>
          <h3>무료 활용 최대화</h3>
          <ul>
            <li>Naver Clova Voice: 매달 1만 자 무료 (영상 50편 가능)</li>
            <li>Google Cloud TTS: 100만 자/월 무료 (대량 가능)</li>
            <li>두 도구 번갈아 사용 = 사실상 무제한</li>
          </ul>
          <h3>유료 도구 효율 사용</h3>
          <ul>
            <li>짧은 영상 = 무료 도구</li>
            <li>긴 영상 (10분+) = 유료 도구 (자연스러움)</li>
            <li>채널 안정 후 유료 전환</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>AI 자동 더빙은 <strong>새로운 시대의 영상 제작 도구</strong> 입니다. 성우를 고용할 비용도, 녹음할 시간도 없는 1인 채널 운영자에게 특히 유리합니다.</p>
          <p>무료로 시작하시고, 채널이 성장하면 유료 도구로 전환하세요. 한 영상 더빙 시간이 30분에서 5분으로 줄어듭니다.</p>
          <p>시니어 채널 운영자분들께는 <strong>TypeCast</strong> 또는 <strong>Naver Clova Voice</strong> 를 추천드립니다. 한국어 자연스러움이 가장 뛰어납니다.</p>
        </div>
        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/voice-seo" style={{ color: '#c2410c' }}>voice-seo</Link></li>
              <li><Link href="/blog/ai-tools" style={{ color: '#c2410c' }}>ai-tools</Link></li>
              <li><Link href="/blog/free-editing-apps" style={{ color: '#c2410c' }}>free-editing-apps</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
