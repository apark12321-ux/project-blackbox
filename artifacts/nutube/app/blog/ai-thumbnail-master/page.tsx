'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { GuideMetadata } from '../../_shared/GuideMetadata';

export default function GuidePage() {
  return (
    <V18Shell>
      <GuideMetadata
        slug="ai-thumbnail-master"
        title="AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결"
        subtitle="Midjourney + Canva + ChatGPT 조합으로 프로 썸네일 5분 완성"
        description="Midjourney + Canva + ChatGPT 조합으로 프로 썸네일 5분 완성"
        category="AI 도구"
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

        <div className="guide-kicker">AI 도구 활용 · 썸네일 디자인</div>
        <h1 className="guide-h1">AI 썸네일 디자인 완전 정복 - 클릭률 5배 올리는 비결</h1>
        <p className="guide-subtitle">Midjourney + Canva + ChatGPT 조합으로 프로 썸네일 5분 완성</p>

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
            유튜브 썸네일은 영상 클릭률을 결정하는 가장 중요한 요소입니다. 좋은 썸네일 = 클릭률 10%, 나쁜 썸네일 = 클릭률 2%.
          </p>
          <p>
            그런데 디자인 못하시는 분들은 "좋은 썸네일" 만들기가 어렵습니다. 이제 <strong>AI 도구로 5분 만에 프로급 썸네일</strong> 가능합니다.
          </p>
          <p>
            이 가이드는 Midjourney + Canva + ChatGPT 조합으로 클릭률 5배 올리는 썸네일 만드는 비결입니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1. 좋은 썸네일이 무엇인가</h2>
          <h3>클릭률 ↑ 썸네일 5가지 요소</h3>
          <ul>
            <li><strong>얼굴 큰 표정</strong>: 시청자 눈길</li>
            <li><strong>큰 텍스트 (3~5단어)</strong>: 한 눈에 읽힘</li>
            <li><strong>대비 강한 색상</strong>: 빨강 + 노랑 + 검정</li>
            <li><strong>호기심 유발</strong>: 결론 X 보여주기</li>
            <li><strong>감정 자극</strong>: 놀람, 충격, 감동</li>
          </ul>
          <h3>클릭률 ↓ 썸네일 5가지 실수</h3>
          <ul>
            <li>작은 글씨</li>
            <li>평범한 이미지</li>
            <li>색상 조합 안 맞음</li>
            <li>너무 많은 정보</li>
            <li>영상 내용 X 일치</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>2. AI 도구 3가지 조합</h2>
          <p>각각 다른 역할로 사용합니다.</p>
          <h3>Midjourney - 이미지 생성</h3>
          <ul>
            <li>용도: 배경 이미지, 일러스트</li>
            <li>가격: 월 10달러부터</li>
            <li>특징: 사진처럼 자연스러움</li>
          </ul>
          <h3>ChatGPT - 텍스트 아이디어</h3>
          <ul>
            <li>용도: 썸네일 문구 생성</li>
            <li>가격: 무료 (Plus 월 20달러)</li>
            <li>특징: 다양한 문구 옵션</li>
          </ul>
          <h3>Canva - 합성 + 편집</h3>
          <ul>
            <li>용도: 이미지 + 텍스트 결합</li>
            <li>가격: 무료 (Pro 월 1만 5천원)</li>
            <li>특징: 한국어 폰트 풍부</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>3. AI 썸네일 5단계 작업</h2>
          <h3>1단계 - 영상 핵심 메시지 정리</h3>
          <ul>
            <li>영상 한 문장 요약</li>
            <li>시청자가 클릭할 이유</li>
            <li>감정 (놀람/감동/궁금)</li>
            <li>타겟 시청자</li>
          </ul>
          <p>예시:
- 영상: 70대 할머니 첫사랑 만남
- 핵심: 50년 만의 재회
- 감정: 감동
- 타겟: 시니어, 30~50대</p>
          <h3>2단계 - ChatGPT 로 문구 생성</h3>
          <p>ChatGPT에 입력:
```
시니어 사연 쇼츠 썸네일 문구 5개 추천:
주제: 70대 할머니 첫사랑 50년 만의 재회
조건: 5단어 이내, 호기심 자극
```</p>
          <p>결과 예시:
- "50년 만의 첫사랑"
- "70세 할머니의 비밀"
- "50년 후 충격 재회"
- "끝나지 않은 사랑"
- "잊을 수 없는 그 사람"</p>
          <h3>3단계 - Midjourney 로 배경</h3>
          <p>Midjourney에 입력:
```
A 70 year old Korean grandmother smiling, 
looking at old photo, soft warm lighting, 
photorealistic, emotional moment
```</p>
          <p>결과: 자연스러운 시니어 사진</p>
          <h3>4단계 - Canva 합성</h3>
          <ul>
            <li>Canva 에서 "YouTube 썸네일" 템플릿 선택</li>
            <li>Midjourney 이미지 업로드</li>
            <li>ChatGPT 문구 추가</li>
            <li>폰트: 굵은 고딕 (검은색 + 빨간색)</li>
            <li>그림자 효과</li>
            <li>미리보기 후 다운로드</li>
          </ul>
          <h3>5단계 - A/B 테스트</h3>
          <ul>
            <li>2~3개 썸네일 만들기</li>
            <li>유튜브 스튜디오에서 A/B 테스트</li>
            <li>7일 후 클릭률 비교</li>
            <li>우승 썸네일 적용</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. 시니어 채널 썸네일 특별 전략</h2>
          <p>시니어 사연 쇼츠 채널은 일반 채널과 다른 접근이 필요합니다.</p>
          <h3>시니어 시청자 끌어들이는 비결</h3>
          <ul>
            <li><strong>시니어 얼굴 사용</strong>: 시청자가 동질감</li>
            <li><strong>따뜻한 톤</strong>: 빨강/노랑 X, 노란/주황/베이지</li>
            <li><strong>큰 글씨</strong>: 60대 시청자가 읽기 쉬움</li>
            <li><strong>사연 핵심</strong>: "감동/놀라움" 강조</li>
            <li><strong>가족 등장</strong>: 손주/자녀 함께</li>
          </ul>
          <h3>추천 색상 조합</h3>
          <ul>
            <li>따뜻한 베이지 + 진한 갈색 글씨</li>
            <li>노란 배경 + 검은 글씨</li>
            <li>흰 배경 + 빨간 강조 단어</li>
            <li>절대 X: 보라색, 형광색</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. ChatGPT 썸네일 문구 프롬프트 템플릿</h2>
          <h3>시니어 사연 쇼츠</h3>
          <p>```
시니어 사연 쇼츠 영상 썸네일 문구 추천:
사연: [영상 내용 1줄 요약]
조건:
- 5단어 이내
- 호기심 자극
- 감동/놀라움 표현
- 시니어 친화 (어려운 단어 X)
5개 추천해주세요.
```</p>
          <h3>알고리즘 가이드</h3>
          <p>```
유튜브 알고리즘 가이드 영상 썸네일:
주제: [구체 주제]
조건:
- 6단어 이내
- 숫자 포함 (5가지, 10초, 100% 등)
- 결과 강조 ("이렇게 했더니")
5개 추천해주세요.
```</p>
        </div>

        <div className="guide-section">
          <h2>6. Canva 무료 vs Pro</h2>
          <h3>무료로도 충분</h3>
          <ul>
            <li>기본 템플릿 25만+</li>
            <li>한국어 폰트 100+</li>
            <li>무료 이미지 100만+</li>
            <li>다운로드 PNG/JPG</li>
          </ul>
          <h3>Pro 추가 기능</h3>
          <ul>
            <li>배경 제거 (자동)</li>
            <li>프리미엄 템플릿</li>
            <li>브랜드 키트</li>
            <li>100만+ 추가 이미지</li>
          </ul>
          <h3>추천</h3>
          <ul>
            <li>시작: 무료 (충분)</li>
            <li>채널 안정: Pro (월 1만 5천원, 시간 절약 ↑)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>7. 썸네일 흔한 실수 5가지</h2>
          <h3>피해야 할 실수</h3>
          <ul>
            <li><strong>작은 글씨</strong>: 모바일에서 안 보임</li>
            <li><strong>너무 많은 정보</strong>: 한 눈에 X 들어옴</li>
            <li><strong>영상 내용 X 일치</strong>: 사기 썸네일 → 시청자 이탈</li>
            <li><strong>AI 이미지 그대로</strong>: 합성 X 자연스러움 ↓</li>
            <li><strong>모든 영상 같은 썸네일</strong>: 알고리즘 "이건 같은 영상" 판단</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>8. 클릭률 측정 + 개선</h2>
          <h3>좋은 클릭률 기준</h3>
          <ul>
            <li>4% 이하: 평균 미만 (개선 필요)</li>
            <li>4~8%: 평균 (보통)</li>
            <li>8~12%: 우수</li>
            <li>12% 이상: 최상위</li>
          </ul>
          <h3>개선 방법</h3>
          <ul>
            <li>클릭률 4% 이하: 썸네일 완전 교체</li>
            <li>클릭률 4~8%: A/B 테스트</li>
            <li>클릭률 8%+: 동일 패턴 유지</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>AI 도구를 활용하면 썸네일 작업 시간이 30분에서 5분으로 줄어듭니다. 그 결과 클릭률이 5배 ↑ 됩니다.</p>
          <p>Midjourney + ChatGPT + Canva 조합 = 프로급 썸네일</p>
          <p>특히 시니어 사연 쇼츠 채널은 따뜻한 톤 + 큰 글씨 + 시니어 얼굴 조합이 클릭률 폭발의 비결입니다.</p>
          <p>오늘 영상부터 위 5단계로 썸네일 만들어 보세요. 한 달 후 채널 클릭률이 5배 ↑ 변화하실 것입니다.</p>
        </div>
        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/ai-thumbnail" style={{ color: '#c2410c' }}>ai-thumbnail</Link></li>
              <li><Link href="/blog/thumbnail-tips" style={{ color: '#c2410c' }}>thumbnail-tips</Link></li>
              <li><Link href="/blog/ai-tools" style={{ color: '#c2410c' }}>ai-tools</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
