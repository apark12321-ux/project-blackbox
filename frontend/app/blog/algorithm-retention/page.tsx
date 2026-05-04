'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

export default function AlgorithmRetentionGuide() {
  return (
    <V11Shell>
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
          padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 {
          font-size: 19px; font-weight: 700; letter-spacing: -0.015em;
          margin: 24px 0 10px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout {
          padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24;
          margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f;
          word-break: keep-all;
        }
        .guide-warning {
          padding: 14px 16px; background: #fef2f2; border-left: 3px solid #dc2626;
          margin: 16px 0; font-size: 14.5px; line-height: 1.6; color: #7f1d1d;
          word-break: keep-all;
        }
        .guide-formula {
          padding: 16px 18px; background: #0a0a0a; color: #ffffff;
          margin: 18px 0; font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 15px; line-height: 1.7; word-break: keep-all;
        }
        .guide-formula strong { color: #fbbf24; font-weight: 700; }
        .guide-cta {
          margin-top: 36px; padding: 20px; background: #fafafa;
          border: 1px solid #e5e5e5; text-align: center;
        }
        .guide-cta-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 15.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn {
          display: inline-block; padding: 12px 24px; background: #0a0a0a;
          color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700;
        }
        .guide-cta-btn:hover { background: #c2410c; }
        .guide-related { margin-top: 40px; padding-top: 28px; border-top: 1px solid #e5e5e5; }
        .guide-related-title {
          font-size: 13px; font-weight: 700; letter-spacing: 0.1em;
          color: #737373; margin-bottom: 12px; text-transform: uppercase;
        }
        .guide-related-list { display: flex; flex-direction: column; gap: 8px; }
        .guide-related-item {
          padding: 10px 12px; background: #ffffff; border: 1px solid #e5e5e5;
          font-size: 14px; color: #0a0a0a; text-decoration: none;
        }
        .guide-related-item:hover { background: #fafafa; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 알고리즘 가이드 · 시청 지속</div>
        <h1 className="guide-h1">시청자를 채널에 가두는 무한 루프 세팅</h1>
        <p className="guide-subtitle">
          알고리즘은 시청 지속 시간이 긴 채널을 더 멀리 퍼 나릅니다.
          한 번 들어온 시청자가 나갈 문을 찾지 못하게 만드는 4가지 기술.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 5월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 7분</span>
          <span>·</span>
          <span>⏱ 시청 지속</span>
        </div>

        <p>
          공들여 시청자를 불러왔는데 1분 만에 나가버린다면?
          알고리즘은 즉시 판단합니다. "낚시 영상이구나, 재미없네."
          그리고 노출을 멈춥니다.
        </p>

        <p>
          한 번 들어온 시청자가 나갈 문을 찾지 못하게 만드는
          채널 구조 세팅 4가지를 정리합니다. 시청 지속 시간을 늘리고
          시청자가 영상 1개가 아닌 2개, 3개를 연속으로 보게 만드는 전략입니다.
        </p>

        <h2>1. 챕터 설정 — 시청 시간을 2배로</h2>

        <p>
          요즘 시청자는 성격이 급합니다. 원하는 정보가 바로 안 나오면
          뒤로 가기 버튼을 누릅니다.
        </p>

        <h3>타임스탬프 설정 방법</h3>

        <p>
          영상 설명란에 시간 + 챕터 이름을 적어주면 자동으로 챕터가 만들어집니다.
        </p>

        <div className="guide-formula">
          <strong>00:00</strong> 인사 + 영상 소개<br />
          <strong>00:35</strong> 첫 번째 비법<br />
          <strong>01:50</strong> 두 번째 비법<br />
          <strong>03:20</strong> 마지막 정리
        </div>

        <h3>챕터의 효과</h3>

        <ul>
          <li><strong>신뢰도 상승:</strong> 시청자는 "이 유튜버는 내 시간을 존중해주는구나" 느낍니다.</li>
          <li><strong>구글 검색 노출:</strong> 구글이 영상의 특정 구간을 정답으로 노출시켜 줍니다.</li>
          <li><strong>이탈 방지:</strong> 원하는 부분으로 바로 이동 가능해 끝까지 시청 가능성이 올라갑니다.</li>
        </ul>

        <div className="guide-warning">
          ⚠️ 챕터는 반드시 00:00부터 시작해야 합니다.
          00:30부터 시작하면 챕터가 작동하지 않습니다.
        </div>

        <h2>2. 최종화면 — 다음 영상으로 자연스럽게</h2>

        <p>
          영상이 끝나갈 때 시청자는 무의식적으로 "다음은 뭐 보지?"
          생각합니다. 이때 아무 장치가 없으면 다른 채널로 떠나버립니다.
        </p>

        <h3>최종화면 배치 전략</h3>

        <ul>
          <li><strong>관련 있는 영상 선택:</strong> "김치찌개 만드는 법" 영상이라면 "찌개와 어울리는 계란말이" 영상을 띄웁니다. 단순히 인기 영상이 아니라 논리적 연관성이 핵심입니다.</li>
          <li><strong>구독 버튼 동시 배치:</strong> 영상 1개 + 구독 버튼 1개 조합이 가장 효과적입니다.</li>
          <li><strong>영상 카드 추천:</strong> 영상 종료 5~20초 사이에 띄우는 게 효과적입니다.</li>
        </ul>

        <h3>고수의 비법 — 직접 가리키기</h3>

        <p>
          영상 속 본인이 화면을 가리키며 "다음 영상은 이걸 보시면 됩니다!"
          말하면 클릭률이 3배 이상 올라갑니다. 시청자는 결정 장애를 겪고
          있는데, 본인이 직접 안내해주면 그대로 따라갑니다.
        </p>

        <h2>3. 재생목록 — 자동 연속 시청 유도</h2>

        <p>
          채널 홈에 영상이 무작위로 나열되어 있으면 시청자는 혼란을 느낍니다.
          정돈된 카테고리(재생목록)를 원합니다.
        </p>

        <h3>재생목록의 강력한 효과</h3>

        <ul>
          <li><strong>자동 연속 재생:</strong> 시청자가 가만히 있어도 다음 영상이 자동 재생됩니다. 채널 평균 시청 시간이 3~4배 늘어납니다.</li>
          <li><strong>커리큘럼 효과:</strong> 시청자가 "이 채널에서 공부할 수 있구나" 인식합니다.</li>
          <li><strong>SEO 노출:</strong> 재생목록 자체도 검색 결과에 노출됩니다.</li>
        </ul>

        <h3>재생목록 분류 기준</h3>

        <ul>
          <li><strong>주제별 분류:</strong> "한식 레시피", "양식 레시피", "디저트 레시피"</li>
          <li><strong>난이도별:</strong> "5분 요리", "30분 요리", "온종일 요리"</li>
          <li><strong>형식별:</strong> 쇼츠와 일반 영상은 반드시 분리하세요.</li>
        </ul>

        <h2>4. 재생목록 이름도 SEO다</h2>

        <p>
          많은 분이 재생목록 이름을 "일상 1", "정보 2"처럼 대충 짓습니다.
          하지만 재생목록 이름도 검색 결과에 노출됩니다.
        </p>

        <h3>전략적 네이밍</h3>

        <p>
          재생목록 이름에 황금 키워드를 넣으세요.
        </p>

        <div className="guide-formula">
          ❌ <strong>"요리 모음"</strong> (X)<br /><br />
          ✅ <strong>"실패 없는 자취생 요리 황금레시피 모음"</strong> (O)
        </div>

        <p>
          시청자가 "자취생 요리"라고 검색하면 영상 1개가 아닌
          내 영상 20개가 담긴 재생목록 전체가 검색 결과에 뜹니다.
          한 번의 클릭으로 20번의 조회수 기회를 얻을 수 있습니다.
        </p>

        <div className="guide-warning">
          ⚠️ 영상이 1~2개뿐인 재생목록을 너무 많이 만들지 마세요.
          최소 5개 이상 쌓였을 때 묶는 게 좋습니다.
        </div>

        <h2>5. 시청 지속률 측정하는 방법</h2>

        <p>
          유튜브 스튜디오 → 분석 → 시청 지속 시간에서 확인하실 수 있습니다.
          평균 시청 지속률이 50%를 넘으면 알고리즘이 영상을 더 멀리 퍼 나릅니다.
        </p>

        <h3>지속률 떨어지는 구간 확인하기</h3>

        <p>
          그래프에서 시청자가 갑자기 빠져나가는 구간이 있으면
          그 부분에 문제가 있는 것입니다. 다음 영상에서는 그 구간을
          개선하시면 됩니다.
        </p>

        <h2>6. 정리 — 무한 루프 5단계</h2>

        <ol>
          <li>모든 영상에 챕터 설정 (00:00 부터)</li>
          <li>최종화면에 관련 영상 + 구독 버튼 배치</li>
          <li>주제별 재생목록 만들기 (쇼츠와 일반 영상 분리)</li>
          <li>재생목록 이름에 황금 키워드 포함</li>
          <li>시청 지속률 그래프 분석 → 다음 영상에 반영</li>
        </ol>

        <p>
          이 5단계만 챙기시면 알고리즘이 채널을
          "사람들이 오래 머무는 우량 채널"로 인식하기 시작합니다.
        </p>


        <h2>시청 지속률 높이는 작은 습관</h2>
        <p>
          매 영상마다 시청 지속률 그래프를 확인하는 습관을 들이세요.
          유튜브 스튜디오에서 어느 구간에서 시청자가 이탈하는지 한 눈에 보입니다.
          그 구간을 짧게 줄이거나 다른 방식으로 바꾸면 다음 영상의 지속률이 올라갑니다.
        </p>
        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/algorithm-seo" style={{ color: "#c2410c" }}>SEO 전략</Link></li>
            <li><Link href="/blog/algorithm-mistakes" style={{ color: "#c2410c" }}>치명적 실수 7가지</Link></li>
            <li><Link href="/blog/viral-patterns" style={{ color: "#c2410c" }}>떡상 채널 패턴 분석</Link></li>
          </ul>
        </div>
      </article>
    </V11Shell>
  );
}
