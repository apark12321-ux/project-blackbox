'use client';
import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 24px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 30px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.025em; margin: 0 0 12px; }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 22px; } }
        .meta { display: flex; justify-content: center; gap: 16px; font-size: 12px; color: #888; margin-top: 12px; }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.85; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 { font-size: 19px; font-weight: 800; color: #1a1a1a; margin: 28px 0 12px; }
        .content h2:first-child { margin-top: 0; }
        .content h3 { font-size: 16px; font-weight: 700; color: #c65f3b; margin: 20px 0 10px; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .content strong { color: #c65f3b; font-weight: 700; }
        .domain {
          background: #fafafa; border-left: 4px solid #c65f3b;
          padding: 18px 22px; border-radius: 0 10px 10px 0;
          margin: 20px 0;
        }
        .domain h3 { color: #c65f3b; margin-top: 0; }
        .pattern {
          background: #fff; padding: 12px 14px; border-radius: 8px;
          margin: 10px 0; border: 1px solid #f0f0f0;
        }
        .patternName { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
        .hookText {
          font-size: 13.5px; color: #c65f3b; font-style: italic;
          margin-bottom: 6px; padding: 6px 10px;
          background: #fdf1e7; border-radius: 6px;
        }
        .why { font-size: 13px; color: #555; line-height: 1.7; }
        .adArea { margin: 32px 0; }
        .related { margin-top: 32px; padding: 24px; background: #fafafa; border-radius: 12px; }
        .relatedTitle { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px; }
        .relatedLink {
          display: block; padding: 10px 14px;
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 8px; text-decoration: none;
          color: #1a1a1a; font-size: 13px; font-weight: 600;
          margin-bottom: 6px; transition: all 0.15s;
        }
        .relatedLink:hover { border-color: #c65f3b; background: #fff8f3; }


        /* 🎯 시니어 모바일 최적화 */
        @media (max-width: 600px) {
          .page { padding: 22px 14px 50px !important; }
          .title { font-size: 22px !important; line-height: 1.4 !important; }
          .sub { font-size: 14.5px !important; line-height: 1.7 !important; }
          .pageBadge { font-size: 12px !important; padding: 6px 14px !important; }
          .content { padding: 18px 16px !important; line-height: 1.85 !important; }
          .content h2 { font-size: 18px !important; line-height: 1.4 !important; margin: 24px 0 12px !important; }
          .content h3 { font-size: 16px !important; }
          .content p { font-size: 15px !important; line-height: 1.85 !important; margin: 0 0 14px !important; }
          .content ul { padding-left: 20px !important; }
          .content li { font-size: 14.5px !important; line-height: 1.8 !important; }
          .stepBox { padding: 14px 16px !important; }
          .stepTitle { font-size: 14.5px !important; }
          .highlight { padding: 16px 18px !important; }
          .relatedLink { 
            font-size: 13.5px !important; 
            padding: 12px 14px !important; 
            min-height: 44px;
          }
          .relatedTitle { font-size: 14px !important; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog?cat=viral">떡상 분석</Link>
          <span className="sep">/</span>
          <span>9개 분야 떡상 패턴 모음</span>
        </nav>

        <header className="header">
          <span className="pageBadge">🔥 떡상 분석</span>
          <h1 className="title">9개 분야 떡상 영상 패턴 모음<br />27가지 검증된 공식</h1>
          <p className="sub">부동산부터 가족 사연까지, 실제로 잘된 영상의 공통 패턴 정리</p>
          <div className="meta">
            <span>📅 2026.04.28</span>
            <span>⏱️ 15분 읽기</span>
          </div>
        </header>

        <article className="content">
          <h2>왜 패턴 분석이 필요한가요?</h2>
          <p>
            영상을 처음 만드시는 분들이 가장 어려워하는 게 <strong>"뭘 만들어야 할지 모르겠다"</strong>입니다.
            그런데 떡상한 영상들을 모아보면 신기한 게 보여요. 분야는 달라도 <strong>똑같은 패턴</strong>이 반복됩니다.
          </p>
          <p>
            이 글에서는 9개 분야에서 실제로 떡상한 영상들의 공통 패턴 27개를 정리했습니다. 본인이 만들고 싶은 분야의
            패턴을 보고, 그대로 따라 만들면 시작이 훨씬 쉽습니다.
          </p>

          <div className="adArea">
            <AdSlot slot="knowhow-mid" variant="horizontal" />
          </div>

          <h2>1. 부동산 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">🏘️ 시간 압축형</div>
              <div className="hookText">"○년 전 이 동네는..."</div>
              <div className="why">
                과거 사진과 현재를 빠르게 교차하면서 변화를 보여줍니다. 시청자가 "내 동네는 어떨까?"라는 호기심으로
                끝까지 시청하게 됩니다. 영상 길이는 1분 ~ 1분 30초가 적당합니다.
              </div>
            </div>
            <div className="pattern">
              <div className="patternName">⚠️ 실수 회피형</div>
              <div className="hookText">"이거 모르고 계약하면 후회합니다"</div>
              <div className="why">
                경험자의 후회담은 입문자에게 가장 강력한 신호입니다. "나도 이 실수 할 뻔" 공감 댓글이 폭발합니다.
                5분~8분 영상이 좋아요.
              </div>
            </div>
            <div className="pattern">
              <div className="patternName">📊 데이터 시각화형</div>
              <div className="hookText">"실거래가 데이터로 본 진실"</div>
              <div className="why">
                주관적 느낌이 아닌 데이터 기반이라 신뢰가 쌓입니다. 검색 의도가 있는 시청자는 끝까지 보고 저장도 합니다.
                8분 이상의 긴 영상에 적합합니다.
              </div>
            </div>
          </div>

          <h2>2. 재테크 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">📈 평범인 기록형</div>
              <div className="hookText">"평범한 직장인이 ○년 동안..."</div>
              <div className="why">
                비슷한 처지의 사람이 만든 변화는 가장 강력한 동기부여입니다. 시청자가 "나도 가능하다" 느낍니다.
              </div>
            </div>
            <div className="pattern">
              <div className="patternName">📋 단계별 가이드형</div>
              <div className="hookText">"5단계만 따라하면 됩니다"</div>
              <div className="why">
                복잡한 정보를 단순한 단계로 정리하면 저장/공유 욕구가 폭발합니다.
              </div>
            </div>
            <div className="pattern">
              <div className="patternName">💭 실수 공개형</div>
              <div className="hookText">"투자 시작 1년, 솔직한 실수담"</div>
              <div className="why">
                성공담보다 실수담이 진심으로 받아들여집니다. 댓글에서 비슷한 경험 공유가 활발해집니다.
              </div>
            </div>
          </div>

          <h2>3. 외국어 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">⏰ 시간 한정 챌린지형</div>
              <div className="hookText">"하루 30분, ○개월 만에"</div>
              <div className="why">시간 제약이 있어야 시청자가 "나도 시작해볼까" 생각합니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🌱 평범인 변화형</div>
              <div className="hookText">"영어 0점부터 시작한 직장인"</div>
              <div className="why">바닥부터 시작한 사람의 진심 어린 기록은 입문자의 두려움을 해소해줍니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🛠️ 도구 추천형</div>
              <div className="hookText">"무료 앱 ○개로 충분합니다"</div>
              <div className="why">무료 도구 정보는 저장/공유율이 매우 높습니다.</div>
            </div>
          </div>

          <h2>4. 건강·운동 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">💪 비포애프터 시각형</div>
              <div className="hookText">"○개월 변화 기록"</div>
              <div className="why">시각적 변화는 가장 강력한 후크입니다. 첫 3초에 결과 보여주면 이탈률 최저.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🌅 하루 일과형</div>
              <div className="hookText">"식단 + 운동 하루 루틴"</div>
              <div className="why">V-log 형식이라 친근하고 시청자가 따라하기 쉽습니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🚫 실수 공개형</div>
              <div className="hookText">"이 운동, 이렇게 하면 안 됩니다"</div>
              <div className="why">잘못된 정보 정정 콘텐츠는 신뢰와 저장을 동시에 유도합니다.</div>
            </div>
          </div>

          <div className="adArea">
            <AdSlot slot="knowhow-mid2" variant="horizontal" />
          </div>

          <h2>5. 자기계발 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">⏱️ 습관 변화형</div>
              <div className="hookText">"하루 ○분 루틴, ○년 변화"</div>
              <div className="why">작은 시작이 큰 변화로 이어진다는 메시지는 시청자의 부담을 줄여줍니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">📚 책 추천 큐레이션형</div>
              <div className="hookText">"○○를 위한 책 5권"</div>
              <div className="why">큐레이션 콘텐츠는 저장률이 최상입니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🔄 실패 공유형</div>
              <div className="hookText">"자기계발 5년, 깨달은 것"</div>
              <div className="why">실패 후 깨달음은 가장 진정성 있는 콘텐츠로 받아들여집니다.</div>
            </div>
          </div>

          <h2>6. AI·디지털 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">🆓 무료 도구 비교형</div>
              <div className="hookText">"유료 안 써도 됩니다"</div>
              <div className="why">무료 대안 정보는 검색량이 최상입니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🤖 결과물 시연형</div>
              <div className="hookText">"이거 AI로 만든 거예요"</div>
              <div className="why">결과물부터 먼저 보여주면 호기심이 폭발합니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">📝 Step-by-step형</div>
              <div className="hookText">"0부터 따라하시면 됩니다"</div>
              <div className="why">입문자 친화 콘텐츠는 저장/북마크 매우 높습니다.</div>
            </div>
          </div>

          <h2>7. 시니어 라이프 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">🌳 나이 가능성형</div>
              <div className="hookText">"○○세에 시작했습니다"</div>
              <div className="why">나이 강조와 시작 이야기는 시니어층의 공감을 폭발시킵니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🌅 인생 2막형</div>
              <div className="hookText">"은퇴 후 새로운 도전"</div>
              <div className="why">비슷한 처지 시청자가 깊이 공감합니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">📱 디지털 입문형</div>
              <div className="hookText">"핸드폰만 있으면 가능"</div>
              <div className="why">시니어층 진입 장벽 해소가 핵심입니다.</div>
            </div>
          </div>

          <h2>8. 요리·맛집 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">🍳 간단 레시피형</div>
              <div className="hookText">"3가지 재료로 끝"</div>
              <div className="why">재료가 적어 진입 장벽이 낮으니 즉시 따라하기 가능합니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">✅ 실패 없는 레시피형</div>
              <div className="hookText">"이대로만 하면 무조건 성공"</div>
              <div className="why">"실패할까봐" 두려움이 가장 큰 진입 장벽인데, 보장 멘트가 강력한 후크가 됩니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">⚖️ 비교 시연형</div>
              <div className="hookText">"○○ vs ○○ 어느 쪽이 맛있을까"</div>
              <div className="why">시청자가 끝까지 결과를 보고 싶어합니다.</div>
            </div>
          </div>

          <h2>9. 가족 사연 분야 - 3가지 패턴</h2>

          <div className="domain">
            <div className="pattern">
              <div className="patternName">💝 사연 공유형</div>
              <div className="hookText">"우리 가족 이야기인데..."</div>
              <div className="why">진심 어린 사연은 깊은 공감을 만듭니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">🍂 인생 회고형</div>
              <div className="hookText">"○○년이 지나서야 알았습니다"</div>
              <div className="why">시간이 지나서 깨달은 이야기는 가장 진정성이 있습니다.</div>
            </div>
            <div className="pattern">
              <div className="patternName">📖 에피소드형</div>
              <div className="hookText">"○○하다 일어난 일"</div>
              <div className="why">구체적 사건은 시청자가 빠져들게 만듭니다.</div>
            </div>
          </div>

          <h2>본인 분야의 패턴 적용하는 법</h2>
          <p>
            <strong>1단계 - 본인 분야 패턴 3개 보기.</strong> 본인이 만들고 싶은 분야의 3가지 패턴을 비교해보세요.
            가장 본인 색깔과 맞는 패턴을 고르면 됩니다.
          </p>
          <p>
            <strong>2단계 - 후크 따라 쓰기.</strong> 패턴별 핵심 후크를 본인 키워드로 바꿔서 적어보세요.
            예) "○년 전 이 동네는..." → "5년 전 우리 동네는..."
          </p>
          <p>
            <strong>3단계 - 영상 길이 맞추기.</strong> 각 패턴마다 권장 영상 길이가 있어요. 그 길이에 맞춰서 만드세요.
          </p>
          <p>
            <strong>4단계 - 핵심 요소 챙기기.</strong> 각 패턴의 핵심 요소(데이터, Before/After, 솔직함 등)를
            영상에 꼭 넣어주세요.
          </p>

          <h2>마치며</h2>
          <p>
            이 27가지 패턴은 모두 실제로 검증된 공식입니다. 처음 시작하실 때는 본인 색깔보다 패턴을 먼저 익히는 게 좋아요.
            패턴에 익숙해지면 자연스럽게 본인만의 색깔이 나옵니다.
          </p>
          <p>
            그리고 같은 패턴이라도 100명이 만들면 100가지 다른 영상이 나옵니다. 본인의 진심을 담아서 만들면 그게 차별화입니다.
          </p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 가이드</div>
          <Link href="/knowhow/viral-patterns-senior" className="relatedLink">
            🌳 시니어층이 사랑하는 떡상 영상 패턴 5가지 →
          </Link>
          <Link href="/knowhow/viral-patterns-family-story" className="relatedLink">
            💝 가족 사연 채널의 떡상 패턴 - 8가지 →
          </Link>
          <Link href="/knowhow/first-30-seconds-hook" className="relatedLink">
            🎬 첫 30초가 90%를 결정합니다 - 후크 작성법 →
          </Link>
          <Link href="/blog?cat=viral" className="relatedLink">
            🔥 모든 떡상 분석 보기 →
          </Link>
        </div>
      </div>
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%)',
          borderRadius: '14px',
          border: '1.5px solid #fdebd9',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', color: '#92400e', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
            📌 더 많은 가이드
          </div>
          <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            시니어층 영상 만들기 26편 가이드 모음
          </div>
          <Link href="/blog" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#c65f3b',
            color: '#fff',
            borderRadius: '100px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 800,
            minHeight: '44px',
            lineHeight: '1.4'
          }}>
            📚 전체 가이드 보러가기 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
