'use client';

import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';

/**
 * 가이드: 알고리즘 SEO 검색 최적화 전략
 * 경로: /app/blog/algorithm-seo/page.tsx
 * AdSense 안전: 가짜 데이터 0, 외부 브랜드명은 일반 도구로만, 오리지널 콘텐츠
 */
export default function AlgorithmSEOGuide() {
  return (
    <V11Shell>
      <style jsx>{`
        .guide {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.75;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 30px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 24px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 13px; color: #737373;
          padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px;
        }
        .guide h2 {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h2 { font-size: 19px; margin: 28px 0 12px; } }
        .guide h3 {
          font-size: 18px; font-weight: 700; letter-spacing: -0.015em;
          margin: 24px 0 10px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h3 { font-size: 16.5px; } }
        .guide p {
          font-size: 17px; margin: 0 0 14px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide p { font-size: 16px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li {
          font-size: 17px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide li { font-size: 16px; } }
        .guide-callout {
          padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24;
          margin: 16px 0; font-size: 15.5px; line-height: 1.6; color: #78350f;
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
        .guide-cta-title { font-size: 17px; font-weight: 700; margin: 0 0 8px; }
        .guide-cta-desc { font-size: 14.5px; color: #525252; margin: 0 0 14px; line-height: 1.55; }
        .guide-cta-btn {
          display: inline-block; padding: 12px 24px; background: #0a0a0a;
          color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700;
          letter-spacing: -0.01em;
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
          font-size: 14px; color: #0a0a0a; text-decoration: none; letter-spacing: -0.01em;
        }
        .guide-related-item:hover { background: #fafafa; }
      `}</style>

      <article className="guide">
        <div className="guide-kicker">▍ 알고리즘 가이드 · SEO</div>
        <h1 className="guide-h1">알고리즘이 내 영상을 알아보게 하는 SEO 전략</h1>
        <p className="guide-subtitle">
          알고리즘은 영상을 시청하지 않습니다. 영상에 붙은 텍스트만 읽습니다.
          알고리즘이 내 영상을 정확히 분류하게 만드는 4가지 SEO 기술.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 5월</span>
          <span>·</span>
          <span>⏱ 읽는 시간 8분</span>
          <span>·</span>
          <span>🔍 SEO</span>
        </div>

        <p>
          영상을 열심히 만들었는데 조회수가 100회에서 멈춘 적 있으신가요?
          영상 품질이 나쁜 게 아닙니다. 알고리즘이 그 영상을
          누구에게 보여줘야 할지 모르고 있는 것입니다.
        </p>

        <p>
          유튜브는 거대한 검색 엔진입니다. 영상에 붙은 텍스트
          (제목, 설명, 자막, 태그, 해시태그)를 통해 알고리즘이
          영상의 정체성을 판단합니다. 알고리즘에게 영상의
          신분증을 정확하게 발급해주는 4가지 SEO 기술을 정리합니다.
        </p>

        <h2>1. 제목 — 황금 키워드 + 후킹 문구</h2>

        <p>
          가장 흔한 실수가 감성적인 제목입니다.
          김치찌개 레시피 영상에 "엄마가 그리워지는 오늘, 따뜻한 한 그릇"
          이렇게 짓는 식이죠. 시청자가 검색창에 그렇게 검색하지 않습니다.
          "김치찌개 맛있게 만드는 법" 으로 검색합니다.
        </p>

        <h3>황금 키워드 찾는 방법</h3>

        <ul>
          <li><strong>유튜브 검색창 활용:</strong> 검색창에 "김치찌개"만 쳐보세요. 자동완성으로 떠오르는 "김치찌개 황금레시피", "돼지고기 김치찌개" 같은 단어가 사람들이 실제로 검색하는 황금 키워드입니다.</li>
          <li><strong>구글 트렌드 확인:</strong> 두 단어 중 어떤 게 검색량 높은지 비교 가능합니다. 더 강한 단어를 제목 앞에 배치하세요.</li>
          <li><strong>관련 검색어 분석:</strong> 검색 결과 하단의 "관련 검색어"도 황금 키워드 후보입니다.</li>
        </ul>

        <h3>제목의 8:2 법칙</h3>

        <div className="guide-formula">
          <strong>제목 앞 80%</strong> = 검색용 메인 키워드<br />
          <strong>제목 뒤 20%</strong> = 클릭을 유도하는 후킹 문구<br /><br />
          예: <strong>"돼지고기 김치찌개 황금레시피"</strong> + ", 10년 차 주부도 몰랐던 비법"
        </div>

        <p>
          앞 80%로 검색에 걸리고, 뒤 20%로 클릭을 유도합니다.
          이 두 가지가 모두 충족되어야 영상이 노출되고 클릭됩니다.
        </p>

        <h2>2. 설명란 — 알고리즘의 데이터 센터</h2>

        <p>
          설명란을 비워두거나 "구독과 좋아요 부탁드려요" 한 줄만 적는 분이
          많습니다. 가장 강력한 홍보 도구를 버리는 셈입니다.
        </p>

        <p>
          유튜브 설명란은 알고리즘에게 영상의 상세 정보를 제공하는
          데이터 센터입니다. 알고리즘은 설명란의 첫 세 줄을
          가장 중요하게 읽습니다.
        </p>

        <h3>설명란 작성 전략</h3>

        <ul>
          <li><strong>첫 1~2줄:</strong> 제목의 핵심 키워드를 포함한 영상 요약</li>
          <li><strong>중간 부분:</strong> 영상에서 다루는 구체적 정보를 자연스러운 문장으로</li>
          <li><strong>중요 키워드 3~5회 반복:</strong> 단, 자연스러운 문장 안에서</li>
        </ul>

        <div className="guide-warning">
          ⚠️ 키워드 나열만 하는 건 스팸으로 분류됩니다.
          반드시 자연스러운 문장 안에 녹여야 합니다.
        </div>

        <h2>3. 음성 SEO — 영상 속 멘트도 검색 데이터</h2>

        <p>
          많은 분이 모르는 비밀이 있습니다. 유튜브는 영상 속 음성을
          모두 텍스트로 변환해서 읽습니다. 자동 자막 기능을
          생각하시면 이해가 빠릅니다.
        </p>

        <h3>전략적 스크립트 작성</h3>

        <p>
          영상 시작 1분 이내에 핵심 키워드를 직접 입 밖으로 내뱉으세요.
        </p>

        <div className="guide-formula">
          예: <strong>"안녕하세요, 오늘은 돼지고기 김치찌개 맛있게 만드는 법을 알려드릴게요."</strong>
        </div>

        <p>
          이렇게 직접 언급하는 것만으로도 검색 정확도가 비약적으로 올라갑니다.
          알고리즘은 제목(텍스트)과 멘트(음성)가 일치할 때
          이 영상의 신뢰도를 최고점으로 평가합니다.
        </p>

        <h2>4. 해시태그 — 소형 채널의 구원줄</h2>

        <p>
          소형 채널은 해시태그를 전략적으로 써야 합니다.
          대형 채널은 이미 팬덤이 있어 제목만으로 노출되지만,
          작은 채널은 "카테고리"의 힘을 빌려야 합니다.
        </p>

        <h3>해시태그 추천 세팅</h3>

        <ul>
          <li><strong>메인 키워드</strong> (1개): #김치찌개</li>
          <li><strong>세부 키워드</strong> (1~2개): #황금레시피, #자취요리</li>
          <li><strong>채널명</strong> (1개): #채널이름</li>
        </ul>

        <p>
          총 3~5개가 가장 효과적입니다.
        </p>

        <div className="guide-warning">
          ⚠️ 해시태그를 15개 이상 넣으면 유튜브가 모든 해시태그를
          무효 처리합니다. 욕심내지 마세요.
        </div>

        <h2>5. 흔한 실수 — 키워드 스터핑</h2>

        <p>
          설명란 하단에 관련 없는 키워드를 수백 개씩 적어넣는 행위는
          절대 금지입니다. 이는 유튜브 커뮤니티 가이드 위반으로,
          채널 자체가 삭제될 수도 있습니다.
        </p>

        <p>
          항상 영상 내용과 맥락에 맞는 단어만 사용하세요.
          "맥락 있는 텍스트가 좋은 텍스트"라는 원칙을 기억하시면 됩니다.
        </p>

        <h2>6. 정리 — 알고리즘 신분증 발급 5단계</h2>

        <ol>
          <li>제목: 검색 키워드 (앞 80%) + 후킹 (뒤 20%)</li>
          <li>설명란: 첫 3줄에 핵심 키워드 포함, 자연스러운 문장으로 3~5회 반복</li>
          <li>영상 시작 1분 안에 핵심 키워드를 음성으로 직접 언급</li>
          <li>해시태그 3~5개 (메인 + 세부 + 채널명)</li>
          <li>키워드 스터핑 절대 금지</li>
        </ol>

        <p>
          이 5가지만 매번 챙기시면 알고리즘이 영상의 정체성을 정확히 파악합니다.
          그러면 노출이 자연스럽게 따라옵니다.
        </p>

        <div className="guide-cta">
          <div className="guide-cta-title">🎬 SEO 최적화된 자료 자동 생성</div>
          <div className="guide-cta-desc">
            AlgoMaker가 키워드 1개로 SEO 친화적 제목, 설명문, 태그, 해시태그까지
            한 번에 만들어드립니다. 10분 일을 5초에.
          </div>
          <Link href="/" className="guide-cta-btn">
            영상 자료 만들러 가기 →
          </Link>
        </div>

        <div className="guide-related">
          <div className="guide-related-title">▍ 함께 보시면 좋은 가이드</div>
          <div className="guide-related-list">
            <Link href="/blog/algorithm-retention" className="guide-related-item">
              ⏱ 시청자를 채널에 가두는 무한 루프 세팅
            </Link>
            <Link href="/blog/algorithm-branding" className="guide-related-item">
              🎨 클릭을 부르는 브랜딩과 디테일의 힘
            </Link>
            <Link href="/blog/algorithm-mistakes" className="guide-related-item">
              ⚠️ 떡상을 가로막는 치명적 실수 방어
            </Link>
          </div>
        </div>
      </article>
    </V11Shell>
  );
}
