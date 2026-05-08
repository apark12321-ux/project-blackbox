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

        <div className="guide-kicker">유튜브 알고리즘 · 쇼츠 전용</div>
        <h1 className="guide-h1">유튜브 쇼츠 알고리즘 완전 정복 - 100만 조회의 비밀</h1>
        <p className="guide-subtitle">긴 영상과 다른 쇼츠만의 알고리즘 5가지 핵심 원칙</p>

        <div className="guide-meta">
          <span>📅 2026.05.08 발행</span>
          <span>·</span>
          <span>📂 알고리즘</span>
        </div>

        <div className="guide-section">
          <p>
            ## 도입
          </p>
          <p>
            유튜브 쇼츠를 만들면서 "왜 어떤 영상은 100만 조회 가는데, 내 영상은 1,000명도 안 보지?" 의문 가지셨을 것입니다.
          </p>
          <p>
            사실 <strong>쇼츠 알고리즘은 일반 영상 알고리즘과 완전히 다릅니다.</strong> 같은 채널이라도 쇼츠와 긴 영상은 다른 방식으로 평가됩니다.
          </p>
          <p>
            이 가이드는 쇼츠만의 알고리즘 작동 원리와 100만 조회를 위한 5가지 핵심 원칙을 알려드립니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 쇼츠 vs 긴 영상 - 알고리즘 차이</h2>
          <h3>일반 영상 알고리즘</h3>
          <ul>
            <li><strong>시청 시간</strong> 가장 중요 (5분 영상 = 5분 시청)</li>
            <li>구독자 시청 ↑ → 알고리즘 추천 ↑</li>
            <li>채널 권한 (Authority) 영향 ↑</li>
            <li>검색 노출 + 추천 영상에서 발견</li>
          </ul>
          <h3>쇼츠 알고리즘</h3>
          <ul>
            <li><strong>시청 완료율</strong> 가장 중요 (60초 영상 = 60초 끝까지)</li>
            <li>구독자 영향 ↓ (모르는 사람도 알고리즘 추천)</li>
            <li>채널 권한 X (신규 채널도 100만 조회 가능)</li>
            <li>쇼츠 피드에서 발견 (검색 X)</li>
          </ul>
          <h3>핵심 차이</h3>
          <p>쇼츠 = <strong>실력 게임</strong> (영상 자체 품질)
긴 영상 = <strong>신뢰 게임</strong> (채널 신뢰도)</p>
          <p>→ 신규 채널은 쇼츠가 훨씬 유리</p>
        </div>

        <div className="guide-section">
          <h2>2. 쇼츠 알고리즘 5가지 핵심 원칙</h2>
          <p>100만 조회 쇼츠를 만드는 5가지 원칙입니다.</p>
          <h3>원칙 1 - 첫 3초 시청 유지</h3>
          <p>쇼츠는 첫 3초가 운명을 결정합니다.</p>
          <ul>
            <li>시청자가 3초 내 스킵 = 알고리즘 점수 ↓</li>
            <li>시청자가 3초 이상 시청 = 점수 ↑</li>
            <li>시청자가 끝까지 시청 = 점수 ↑↑</li>
          </ul>
          <p><strong>첫 3초 비결</strong>:
- 강력한 hook (충격, 호기심, 감정)
- 자막 큰 글씨 즉시 표시
- 움직임 빠르게 (정적 X)
- 결론부터 말하기</p>
          <h3>원칙 2 - 60초 끝까지 보게 하기</h3>
          <p>시청 완료율 = 쇼츠 알고리즘 1순위 지표</p>
          <ul>
            <li>50% 미만 = 알고리즘 노출 ↓</li>
            <li>70% 이상 = 알고리즘 노출 ↑</li>
            <li>90% 이상 = 100만 조회 가능성</li>
            <li>100%+ (다시 봄) = 바이럴 확정</li>
          </ul>
          <p><strong>완료율 ↑ 비결</strong>:
- 영상 길이 30~45초 권장 (60초 X 권장)
- 마지막에 반전/결론 배치
- 중간에 "잠깐, 이게 끝이 아니에요" 같은 후크
- 화면 전환 빠르게 (1.5초마다)</p>
          <h3>원칙 3 - 다시 보기 유도</h3>
          <p>쇼츠 알고리즘은 <strong>다시 보기</strong> 를 매우 좋아합니다.</p>
          <ul>
            <li>시청자가 끝나고 다시 봄 = 알고리즘 "이건 좋은 영상"</li>
            <li>Replay rate 30%+ = 노출 폭발</li>
          </ul>
          <p><strong>다시 보기 유도 비결</strong>:
- 마지막 1초에 강력한 결론
- "한 번 더 보면 알 수 있어요" 멘트
- 빠른 영상 (한 번에 다 못 봄)
- 시각적 디테일 풍부 (다시 보고 싶음)</p>
          <h3>원칙 4 - 댓글 + 좋아요 폭발</h3>
          <p>쇼츠는 짧아서 댓글/좋아요가 빠르게 쌓입니다.</p>
          <ul>
            <li>영상 길이 짧음 → 시청 후 즉시 행동</li>
            <li>댓글 1,000+ = 알고리즘 "이건 핫하다"</li>
            <li>좋아요 비율 5%+ (시청자 100명 중 5명) = 우수</li>
          </ul>
          <p><strong>댓글 유도 비결</strong>:
- 영상 끝에 질문 ("여러분은 어때요?")
- 의견이 갈리는 주제
- 시청자 사연 요청
- 정답 X 알려주기 ("답은 댓글에서")</p>
          <h3>원칙 5 - 공유율</h3>
          <p>쇼츠 공유는 알고리즘에 큰 가중치 줍니다.</p>
          <ul>
            <li>시청자 100명 중 1명이 공유 = 우수</li>
            <li>공유 ↑ = 외부 시청자 유입 ↑</li>
            <li>외부 시청자 시청 = 알고리즘 "이건 검증됐다"</li>
          </ul>
          <p><strong>공유 유도 비결</strong>:
- 친구에게 보여주고 싶은 내용
- 정보 가치 ↑ ("이거 모르면 손해")
- 감정 자극 (감동, 분노, 충격)
- 짧고 명확한 메시지</p>
        </div>

        <div className="guide-section">
          <h2>3. 쇼츠 알고리즘 점수 측정 공식</h2>
          <p>쇼츠 알고리즘이 영상을 평가하는 점수 공식 (추정):</p>
          <h3>가중치 비율</h3>
          <ul>
            <li>시청 완료율: 40%</li>
            <li>다시 보기율: 20%</li>
            <li>좋아요율: 15%</li>
            <li>댓글률: 15%</li>
            <li>공유율: 10%</li>
          </ul>
          <h3>점수 예시</h3>
          <p>좋은 쇼츠:
- 완료율 80% × 0.4 = 32
- 다시 보기율 30% × 0.2 = 6
- 좋아요율 5% × 0.15 = 0.75
- 댓글률 1% × 0.15 = 0.15
- 공유율 1% × 0.1 = 0.1
- 총점: 39점 → <strong>노출 ↑</strong></p>
          <p>나쁜 쇼츠:
- 완료율 30% × 0.4 = 12
- 다시 보기율 5% × 0.2 = 1
- 좋아요율 1% × 0.15 = 0.15
- 댓글률 0.1% × 0.15 = 0.015
- 공유율 0% × 0.1 = 0
- 총점: 13점 → <strong>노출 ↓</strong></p>
        </div>

        <div className="guide-section">
          <h2>4. 시니어 사연 쇼츠 특별 전략</h2>
          <p>시니어 사연 쇼츠는 알고리즘 점수가 매우 높게 나옵니다.</p>
          <h3>강점</h3>
          <ul>
            <li><strong>감정 자극 ↑</strong>: 시청자 감동 → 끝까지 시청</li>
            <li><strong>다시 보기 ↑</strong>: 진정성 있는 사연 → 한 번 더</li>
            <li><strong>댓글 폭발</strong>: 시청자 자기 사연 공유</li>
            <li><strong>공유 ↑</strong>: 가족에게 보여주고 싶음</li>
            <li><strong>시청 완료율 ↑↑</strong>: 결말이 궁금함</li>
          </ul>
          <h3>추천 구조</h3>
          <ul>
            <li>0~3초: 강력한 hook ("OO 할머니의 마지막 부탁")</li>
            <li>3~30초: 사연 전개</li>
            <li>30~50초: 클라이맥스</li>
            <li>50~60초: 결론 + 감동 또는 반전</li>
            <li>마지막 1초: 댓글 유도 ("여러분 사연도 알려주세요")</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. 쇼츠 만들기 흔한 실수 5가지</h2>
          <p>많은 분들이 쇼츠 알고리즘을 모르고 다음 실수를 합니다.</p>
          <h3>피해야 할 실수</h3>
          <ul>
            <li><strong>첫 3초 약함</strong>: 평범한 시작 → 시청자 스킵</li>
            <li><strong>너무 긴 길이</strong>: 60초 영상 X 권장 (45초가 최적)</li>
            <li><strong>결론 늦게</strong>: 시청자가 끝까지 안 봄</li>
            <li><strong>시청자 행동 X 유도</strong>: 댓글/좋아요/공유 멘트 없음</li>
            <li><strong>긴 영상 알고리즘 적용</strong>: 쇼츠는 다른 룰</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>6. 쇼츠 도구 추천</h2>
          <p>쇼츠 만들기 좋은 무료 도구들입니다.</p>
          <h3>영상 편집</h3>
          <ul>
            <li><strong>CapCut</strong> (PC + 모바일): 무료, 한국어 자막 자동</li>
            <li><strong>VLLO</strong>: 모바일 친화, 시니어 사용 많음</li>
            <li><strong>InShot</strong>: 모바일 빠른 편집</li>
          </ul>
          <h3>자막 + 효과</h3>
          <ul>
            <li><strong>CapCut 자동 자막</strong>: 한국어 80% 정확</li>
            <li><strong>Premiere Pro Auto Caption</strong>: 한국어 95% (유료)</li>
            <li><strong>VLLO 효과</strong>: 시니어 친화 디자인</li>
          </ul>
          <h3>분석 도구</h3>
          <ul>
            <li><strong>유튜브 스튜디오</strong>: 쇼츠 시청 완료율 확인</li>
            <li><strong>vidIQ Shorts</strong>: 쇼츠 전용 분석</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>쇼츠 알고리즘은 긴 영상과 완전히 다른 게임입니다. <strong>첫 3초 + 시청 완료율 + 다시 보기</strong> 가 핵심입니다.</p>
          <p>특히 시니어 사연 쇼츠는 알고리즘 점수가 자연스럽게 높게 나옵니다. 진정성 + 감동 = 시청자가 끝까지 보고, 다시 보고, 공유하기 때문입니다.</p>
          <p>오늘부터 만드시는 쇼츠는:
1. 첫 3초에 강력한 hook
2. 30~45초 길이 권장
3. 결말이 궁금한 구조
4. 댓글 유도 멘트
5. 분석 후 다음 쇼츠 개선</p>
          <p>이 5가지만 지키시면 알고리즘이 박 대표님 영상을 1만, 10만, 100만 시청자에게 자동 노출합니다.</p>
        </div>
        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/youtube-algorithm" style={{ color: '#c2410c' }}>youtube-algorithm</Link></li>
              <li><Link href="/blog/viral-patterns" style={{ color: '#c2410c' }}>viral-patterns</Link></li>
              <li><Link href="/blog/algorithm-retention" style={{ color: '#c2410c' }}>algorithm-retention</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
