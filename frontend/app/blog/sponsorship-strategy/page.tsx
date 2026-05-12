'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { GuideMetadata } from '../../_shared/GuideMetadata';

export default function GuidePage() {
  return (
    <V18Shell>
      <GuideMetadata
        slug="sponsorship-strategy"
        title="유튜브 스폰서십 받는 채널 만드는 5단계 전략"
        subtitle="구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결"
        description="구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결"
        category="수익화"
        publishedAt="2026-05-08"
        readTime="8분"
      />

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

        <div className="guide-kicker">영상 채널 수익화 · 스폰서십</div>
        <h1 className="guide-h1">유튜브 스폰서십 받는 채널 만드는 5단계 전략</h1>
        <p className="guide-subtitle">구독자 5,000명 채널도 가능 - 스폰서 받는 진짜 비결</p>

        <div className="guide-meta">
          <span>📅 2026.05.08 발행</span>
          <span>·</span>
          <span>📂 수익화</span>
        </div>

        <div className="guide-section">
          <p>
            ## 도입
          </p>
          <p>
            유튜브 스폰서십(Sponsorship)은 광고 수익보다 단가가 5~10배 높습니다. 1만 구독자 채널도 영상 1편당 50~200만원의 스폰서십을 받을 수 있습니다.
          </p>
          <p>
            그런데 많은 분들이 "스폰서는 큰 채널만 받는다" 생각하시지요. 그렇지 않습니다. <strong>잘 만든 5,000명 채널</strong> 도 충분히 가능합니다.
          </p>
          <p>
            이 가이드는 스폰서십 받는 진짜 비결을 알려드립니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 스폰서십이 무엇인가</h2>
          <p>스폰서십은 브랜드(기업)가 채널에 돈을 주고 영상에 자사 제품/서비스를 노출하는 협찬 방식입니다.</p>
          <h3>광고 vs 스폰서십</h3>
          <ul>
            <li><strong>광고</strong>: 유튜브가 자동 노출 (수익 ↓, 단가 낮음)</li>
            <li><strong>스폰서십</strong>: 채널 운영자가 직접 협찬 (수익 ↑, 단가 5~10배)</li>
          </ul>
          <h3>스폰서십 종류</h3>
          <ul>
            <li><strong>제품 협찬</strong>: 제품 무료 제공 (소규모 채널)</li>
            <li><strong>유료 스폰서</strong>: 영상 1편당 비용 받기 (중간)</li>
            <li><strong>장기 계약</strong>: 월 단위 협업 (대형 채널)</li>
            <li><strong>제휴 마케팅</strong>: 판매 시 수수료 (모든 규모)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>2. 스폰서십 받기 위한 5가지 조건</h2>
          <p>구독자 수가 전부가 아닙니다. 다음 5가지가 더 중요합니다.</p>
          <h3>핵심 조건</h3>
          <ul>
            <li><strong>명확한 타겟 시청자</strong>: 50대 시니어, 30대 직장인 등</li>
            <li><strong>꾸준한 발행</strong>: 주 2~3편 이상</li>
            <li><strong>시청 지속률 50%+</strong>: 시청자가 영상 끝까지 봄</li>
            <li><strong>댓글 활성화</strong>: 영상 1편당 30+ 댓글</li>
            <li><strong>브랜드 안전성</strong>: 정책 위반 0건, 욕설 X</li>
          </ul>
          <h3>시니어 채널 특별 강점</h3>
          <p>시니어 사연 쇼츠 채널은 다음 이유로 스폰서십이 유리합니다.</p>
          <ul>
            <li>50~60대 타겟 (구매력 ↑)</li>
            <li>진정성 있는 콘텐츠 (브랜드 신뢰 ↑)</li>
            <li>댓글 참여 활발 (관심도 ↑)</li>
            <li>시니어 대상 브랜드 ↑ (건강식품, 보험, 부동산 등)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3. 스폰서십 받는 5단계 전략</h2>
          <h3>1단계 - 미디어 키트(Media Kit) 만들기</h3>
          <p>미디어 키트는 채널 소개 자료입니다. 브랜드 영업 시 필수입니다.</p>
          <p>포함 내용:
- 채널 한 줄 소개
- 구독자/시청자 통계 (스크린샷)
- 시청자 데모그래픽 (나이/성별/지역)
- 인기 영상 5편 + 조회수
- 영상 단가표 (1편당 가격)
- 연락처</p>
          <p>형식: PDF 1~2페이지 (단순하게)</p>
          <h3>2단계 - 적합한 브랜드 선정</h3>
          <ul>
            <li>채널 주제와 일치하는 브랜드만</li>
            <li>시청자가 실제로 살 수 있는 가격대</li>
            <li>브랜드 이미지가 좋은 곳</li>
            <li>시니어 채널 추천 분야:</li>
          </ul>
          <h3>3단계 - 직접 영업하기</h3>
          <ul>
            <li>브랜드 공식 이메일에 정중한 메시지</li>
            <li>미디어 키트 첨부</li>
            <li>협업 아이디어 제안</li>
            <li>답장 X 시 1주일 후 재발송 (1번만)</li>
          </ul>
          <h3>4단계 - 협상</h3>
          <ul>
            <li>영상 1편당 가격 협의</li>
            <li>노출 방식 합의 (제품 사용, 후기, 추천 등)</li>
            <li>결과 측정 방법 (구매 코드, 링크 클릭 등)</li>
            <li>계약서 작성 (간단해도 OK)</li>
          </ul>
          <h3>5단계 - 영상 제작 + 결과 보고</h3>
          <ul>
            <li>약속한 노출 정확히 지키기</li>
            <li>진정성 있는 추천 (구매 ↑)</li>
            <li>영상 발행 후 통계 공유</li>
            <li>다음 협업 제안</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 영상 1편당 적정 단가</h2>
          <h3>시청자 기준 단가표</h3>
          <ul>
            <li>1,000 시청자 채널: 5~20만원</li>
            <li>5,000 시청자 채널: 20~50만원</li>
            <li>1만 시청자 채널: 50~150만원</li>
            <li>5만 시청자 채널: 200~500만원</li>
            <li>10만 시청자 채널: 500~1,500만원</li>
          </ul>
          <h3>시니어 채널 프리미엄</h3>
          <p>시니어 채널은 일반 채널 대비 1.5~2배 높은 단가 가능:</p>
          <ul>
            <li>시청자 구매력 ↑</li>
            <li>시청 지속률 ↑</li>
            <li>신뢰도 ↑</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. 스폰서십 받는 채널의 5가지 특징</h2>
          <p>실제 스폰서십을 잘 받는 채널들의 공통점입니다.</p>
          <h3>핵심 특징</h3>
          <ul>
            <li><strong>명확한 콘셉트</strong>: "50대 부업" "시니어 건강" 등</li>
            <li><strong>타겟 시청자 명확</strong>: 데모그래픽 명확</li>
            <li><strong>진정성</strong>: 광고 외에도 진짜 좋은 정보</li>
            <li><strong>꾸준함</strong>: 6개월 이상 정기 발행</li>
            <li><strong>댓글 응대</strong>: 시청자와 적극 소통</li>
          </ul>
          <h3>박 대표님 사이트 시니어 채널</h3>
          <p>위 5가지 특징 모두 만족 → 스폰서십 가능성 매우 높음</p>
        </div>

        <div className="guide-section">
          <h2>6. 흔한 실수 4가지</h2>
          <h3>피해야 할 실수</h3>
          <ul>
            <li><strong>너무 일찍 영업</strong>: 1,000 구독자 전 영업 X</li>
            <li><strong>부적합 브랜드</strong>: 채널 주제와 무관한 협찬 (시청자 이탈)</li>
            <li><strong>단가 낮춰주기</strong>: 한 번 낮추면 회복 X</li>
            <li><strong>약속 X 지키기</strong>: 노출 약속 깨면 다음 X</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>7. 첫 스폰서십 받는 팁</h2>
          <h3>시작 단계 전략</h3>
          <ul>
            <li>첫 협업: 무료 제품 협찬으로 시작</li>
            <li>결과 좋으면 → 유료 스폰서 제안</li>
            <li>첫 유료: 적정 단가의 70%로 협상</li>
            <li>결과 좋으면 → 다음 100% + 추가 캠페인</li>
          </ul>
          <h3>추천 브랜드 매니저 도구</h3>
          <ul>
            <li><strong>Media Kit</strong>: Canva 무료 템플릿</li>
            <li><strong>이메일 추적</strong>: 답장 받았는지 확인</li>
            <li><strong>계약 관리</strong>: 구글 시트 또는 노션</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>스폰서십은 <strong>유튜브 채널 수익의 진짜 게임 체인저</strong> 입니다. 광고 수익이 하락하는 시대에 채널 운영의 안정성을 보장합니다.</p>
          <p>시작은 작게: 무료 제품 협찬부터. 결과가 좋으면 유료로 전환됩니다. 한 번 좋은 협업 경험이 다음 5~10건 협업으로 연결됩니다.</p>
          <p>특히 시니어 사연 쇼츠 채널은 스폰서십 황금 카테고리입니다. 진정성 + 구매력 있는 시청자 = 브랜드가 가장 원하는 조건입니다.</p>
          <p>오늘 미디어 키트 1장만 만들어보세요. 그게 첫 스폰서십의 시작입니다.</p>
        </div>
        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/youtube-monetization" style={{ color: '#c2410c' }}>youtube-monetization</Link></li>
              <li><Link href="/blog/youtube-superthanks" style={{ color: '#c2410c' }}>youtube-superthanks</Link></li>
              <li><Link href="/blog/side-job-50" style={{ color: '#c2410c' }}>side-job-50</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
