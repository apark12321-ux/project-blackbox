'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function AlgorithmBrandingGuide() {
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
          margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all;
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
        <div className="guide-kicker">▍ 알고리즘 가이드 · 브랜딩</div>
        <h1 className="guide-h1">클릭을 부르는 브랜딩과 디테일의 힘</h1>
        <p className="guide-subtitle">
          시청자는 0.5초 안에 채널을 신뢰할지 말지 결정합니다.
          그 0.5초를 결정하는 4가지 시각적·비즈니스적 디테일.
        </p>
        <div className="guide-meta">
          <span>📅 2026년 5월</span>
          <span>·</span><span>·</span>
          <span>🎨 브랜딩</span>
        </div>

        <p>
          아무리 좋은 그물(채널 구조)과 영업사원(SEO)이 있어도,
          가게의 간판이 지저분하면 손님은 지갑(구독 버튼)을 열지 않습니다.
        </p>

        <p>
          시청자의 시선이 머무는 0.5초의 찰나에 "이 채널은 전문적이다"라는
          확신을 주는 4가지 디테일을 정리합니다.
        </p>

        <h2>1. 채널 아트 — 신뢰의 신분증</h2>

        <p>
          시청자가 영상을 본 뒤 채널 홈에 들어왔을 때 가장 먼저 마주하는 것이
          프로필 사진과 채널 아트입니다. 이 1~2초 안에 구독 여부가 결정됩니다.
        </p>

        <h3>흔한 실수 — 예쁘기만 한 이미지</h3>

        <p>
          많은 분이 단순히 예쁜 풍경이나 좋아하는 캐릭터를 프로필로 씁니다.
          하지만 정체성이 모호한 이미지는 "여기는 아마추어 채널이구나"
          인상을 남깁니다.
        </p>

        <h3>채널 아트 3요소 공식</h3>

        <p>
          채널 아트는 채널의 신분증이어야 합니다. 다음 세 가지를 반드시 포함하세요.
        </p>

        <div className="guide-formula">
          ▍ 핵심 가치: <strong>이 채널은 무엇을 도와주는가?</strong><br />
          예: "가장 쉬운 김치찌개 레시피"<br /><br />
          ▍ 타겟: <strong>누구를 위한 채널인가?</strong><br />
          예: "자취생을 위한"<br /><br />
          ▍ 업로드 주기: <strong>언제 영상을 볼 수 있는가?</strong><br />
          예: "매주 목요일 저녁 7시"
        </div>

        <h3>프로필 사진 — 사람 vs 로고</h3>

        <p>
          기업형 채널이 아니라면 가급적 본인의 얼굴 사진을 추천합니다.
          유튜브는 결국 사람 대 사람의 소통 공간이기 때문입니다.
        </p>

        <p>
          얼굴 노출이 어렵다면 채널 캐릭터나 로고를 쓰되,
          배경색을 눈에 띄는 원색으로 설정해 시인성을 높이세요.
        </p>

        <h2>2. 톤앤매너 — 일관성의 법칙</h2>

        <p>
          채널에 들어왔을 때 썸네일들의 색깔이 제각각이고 폰트가
          중구난방이면 시청자는 본능적으로 피로감을 느낍니다.
        </p>

        <h3>시그니처 컬러 3가지</h3>

        <p>
          채널만의 시그니처 컬러 2~3가지를 정하세요. 사람은 반복되는
          시각적 신호에 안정감과 신뢰를 느낍니다.
        </p>

        <div className="guide-formula">
          ▍ 메인 컬러 (60%): <strong>채널의 전반적 분위기</strong><br />
          예: 차분한 네이비<br /><br />
          ▍ 포인트 컬러 (30%): <strong>강조하고 싶은 부분</strong><br />
          예: 신뢰의 화이트<br /><br />
          ▍ 강조 컬러 (10%): <strong>클릭을 유도하는 색</strong><br />
          예: 주목도 높은 옐로우
        </div>

        <p>
          모든 썸네일에 동일한 폰트와 컬러를 사용하면, 시청자는 나중에
          유튜브 홈에서 채널 영상만 봐도 "아, 이건 그 채널이네!"
          즉시 인지하게 됩니다.
        </p>

        <h2>3. 비즈니스 정보 — 기회를 부르는 링크</h2>

        <p>
          조회수가 조금씩 나오기 시작하면 반드시 찾아오는 것이 광고와
          협업 제안입니다. 그런데 의외로 많은 유튜버가 이 기회를
          스스로 걷어차고 있습니다.
        </p>

        <h3>비즈니스 정보 3종 세트</h3>

        <ul>
          <li><strong>비즈니스 이메일:</strong> [채널 맞춤설정] → [기본 정보]에서 협업용 이메일 등록 (필수)</li>
          <li><strong>맞춤 링크:</strong> 인스타그램, 블로그, 판매하는 상품 페이지 등을 채널 상단에 클릭 가능한 링크로 노출</li>
          <li><strong>이메일 형식:</strong> yourname@gmail.com 처럼 전문적인 느낌의 형식 유지</li>
        </ul>

        <div className="guide-callout">
          💡 광고주는 댓글로 굳이 물어보지 않습니다. 연락처가 안 보이면
          그냥 다른 유튜버를 찾아 떠납니다.
        </div>

        <h2>4. 워터마크 — 마법의 구독 버튼</h2>

        <p>
          영상 오른쪽 하단에 조그맣게 떠 있는 로고가 워터마크입니다.
          단순히 저작권 표시용이 아닙니다. 마우스를 올리면 바로
          구독 버튼이 튀어나오는 마법의 장치입니다.
        </p>

        <h3>고수의 워터마크 디자인</h3>

        <p>
          대부분 본인 로고를 그대로 넣지만, 고수는 다릅니다.
        </p>

        <ul>
          <li>워터마크 이미지에 "구독"이라는 글자 직접 써넣기</li>
          <li>유튜브 구독 버튼 모양의 아이콘 넣기</li>
          <li>심플하고 알아보기 쉬운 디자인</li>
        </ul>

        <p>
          이렇게 하면 시청자가 무의식중에 클릭하게 되고,
          구독 전환율이 최소 15% 이상 올라갑니다.
        </p>

        <h3>워터마크 디자인 주의사항</h3>

        <p>
          워터마크는 아주 작은 사이즈(150×150 픽셀)로 표시됩니다.
          복잡한 로고보다는 "구독"이라는 단어 하나만 크게 넣거나
          심플한 아이콘이 훨씬 효과적입니다.
        </p>

        <h2>5. 채널 트레일러 — 비구독자를 위한 30초</h2>

        <p>
          채널 홈에 처음 방문한 비구독자에게 가장 먼저 보여주는 영상이
          채널 트레일러입니다. 이건 30초 안에 "이 채널을 구독해야 하는
          이유"를 보여주는 영상입니다.
        </p>

        <h3>채널 트레일러 구성</h3>

        <ol>
          <li><strong>처음 5초:</strong> 채널의 핵심 가치 (예: "5060 시니어 영상 시작 가이드")</li>
          <li><strong>5~20초:</strong> 어떤 영상을 만드는지 (예시 클립 모음)</li>
          <li><strong>20~30초:</strong> 구독 유도 (예: "매주 목요일 새 영상 올라옵니다")</li>
        </ol>

        <h2>6. 정리 — 신뢰의 5단계</h2>

        <ol>
          <li>채널 아트에 핵심가치 + 타겟 + 업로드 주기 명시</li>
          <li>시그니처 컬러 2~3개 정해서 모든 썸네일에 일관 적용</li>
          <li>비즈니스 이메일 + 맞춤 링크 등록</li>
          <li>워터마크에 "구독" 또는 구독 아이콘 넣기</li>
          <li>30초 채널 트레일러 만들어 채널 홈에 배치</li>
        </ol>

        <p>
          브랜딩은 거창한 게 아닙니다. 시청자가 채널에서 길을 잃지 않게
          표지판을 잘 세워두는 것입니다.
        </p>


        <div className="guide-section" style={{ marginTop: 32, padding: '16px 20px', background: '#fff7ed', borderLeft: '3px solid #c2410c' }}>
          <h3 style={{ marginTop: 0 }}>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/thumbnail-tips" style={{ color: "#c2410c" }}>눈길을 사로잡는 썸네일 글자 디자인</Link></li>
            <li><Link href="/blog/channel-concept" style={{ color: "#c2410c" }}>채널 컨셉 5가지 카테고리 정리</Link></li>
            <li><Link href="/blog/algorithm-seo" style={{ color: "#c2410c" }}>알고리즘이 내 영상을 알아보게 하는 SEO 전략</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
