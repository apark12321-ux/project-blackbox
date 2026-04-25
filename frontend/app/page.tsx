'use client';
/**
 * AlgoMaker 메인 페이지 (CLEAN v2)
 *
 * 박예준 대표 컨셉:
 * - 카테고리 클릭 → 트렌드 키워드 10개 자동 표시
 * - 키워드 클릭 또는 직접 입력
 * - AI 분석 시작 → 다음 페이지
 *
 * AdSense 정책 준수:
 * ❌ 거짓 정보 X
 * ❌ 사칭 정보 X (가짜 사용자 수, 크리에이터 등)
 * ❌ 자동 사운드 X
 * ✅ 실제 작동하는 도구
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { CATEGORIES, TRENDING_KEYWORDS } from './_shared/platforms';
import AdSlot from './_shared/AdSlot';

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [keyword, setKeyword] = useState('');

  // 선택된 카테고리의 트렌드 키워드
  const trendingKeywords = selectedCategory 
    ? TRENDING_KEYWORDS[selectedCategory] || []
    : [];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setKeyword(''); // 카테고리 변경 시 키워드 초기화
  };

  const handleKeywordSelect = (kw: string) => {
    setKeyword(kw);
  };

  const handleStart = () => {
    if (!selectedCategory) {
      alert('분야를 먼저 선택해주세요.');
      return;
    }
    if (!keyword.trim()) {
      alert('키워드를 선택하거나 입력해주세요.');
      return;
    }
    setProject({ 
      category: selectedCategory, 
      keyword: keyword.trim(),
      step: 1 
    });
    router.push('/keyword');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page {
          max-width: 920px;
          margin: 0 auto;
          padding: 48px 24px 40px;
        }

        /* ============ HERO ============ */
        .hero {
          text-align: center;
          margin-bottom: 40px;
        }

        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: #fdf1e7;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #c65f3b;
          margin-bottom: 16px;
        }

        .heroTitle {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #1a1a1a;
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .heroTitle .accent {
          color: #c65f3b;
        }

        .heroSub {
          font-size: 16px;
          line-height: 1.6;
          color: #555;
          margin-bottom: 20px;
        }

        .heroFeatures {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #555;
        }

        .heroFeatures span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .heroFeatures .check {
          color: #5e7e5d;
          font-weight: 800;
        }

        @media (max-width: 600px) {
          .heroTitle {
            font-size: 28px;
          }
        }

        /* ============ STEP 1: 카테고리 선택 ============ */
        .step {
          margin-bottom: 32px;
        }

        .stepHeader {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .stepNumber {
          width: 28px;
          height: 28px;
          background: #c65f3b;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }

        .stepTitle {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .stepHint {
          font-size: 13px;
          color: #888;
          margin-left: auto;
        }

        /* 카테고리 그리드 */
        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        @media (max-width: 720px) {
          .categoryGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 480px) {
          .categoryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .categoryChip {
          padding: 14px 8px;
          background: #fff;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          font-family: inherit;
        }

        .categoryChip:hover {
          border-color: #c65f3b;
          background: #fffbf8;
        }

        .categoryChip.selected {
          border-color: #c65f3b;
          background: #fdf1e7;
        }

        .chipEmoji {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .chipName {
          font-size: 12.5px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        /* ============ STEP 2: 키워드 영역 ============ */
        .keywordBox {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 24px;
        }

        .keywordEmpty {
          text-align: center;
          padding: 32px 20px;
          color: #888;
        }

        .keywordEmpty .arrow {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .keywordEmpty p {
          font-size: 14px;
          margin: 0;
        }

        /* 트렌드 키워드 */
        .trendingHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .trendingLabel {
          font-size: 13px;
          font-weight: 700;
          color: #555;
        }

        .trendingLabel .selectedCat {
          color: #c65f3b;
        }

        .trendingHint {
          font-size: 12px;
          color: #888;
        }

        .keywordList {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .keywordList {
            grid-template-columns: 1fr;
          }
        }

        .keywordItem {
          padding: 10px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13.5px;
          color: #333;
          transition: all 0.15s;
          font-family: inherit;
          text-align: left;
          font-weight: 500;
        }

        .keywordItem:hover {
          border-color: #c65f3b;
          background: #fffbf8;
          color: #c65f3b;
        }

        .keywordItem.selected {
          border-color: #c65f3b;
          background: #c65f3b;
          color: #fff;
          font-weight: 700;
        }

        /* 직접 입력 */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          font-size: 12px;
          color: #999;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e5e5;
        }

        .keywordInput {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          font-family: inherit;
          border: 2px solid #e5e5e5;
          border-radius: 10px;
          background: #fff;
          color: #1a1a1a;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .keywordInput:focus {
          outline: none;
          border-color: #c65f3b;
        }

        .keywordInput::placeholder {
          color: #b0b0b0;
        }

        /* ============ CTA 버튼 ============ */
        .ctaBtn {
          width: 100%;
          padding: 18px 24px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          margin-top: 24px;
        }

        .ctaBtn:hover {
          background: #a64a2a;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.25);
        }

        .ctaBtn:active {
          transform: translateY(0);
        }

        .ctaBtn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .ctaBtnSub {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.9;
          display: block;
          margin-top: 4px;
        }

        /* ============ 광고 영역 (AdSense 최적화) ============ */
        .adArea {
          margin: 36px 0;
        }

        /* ============ 작동 방식 ============ */
        .howSection {
          margin: 40px 0 24px;
        }

        .sectionTitle {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 8px;
        }

        .sectionSub {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 28px;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        @media (max-width: 720px) {
          .stepsGrid {
            grid-template-columns: 1fr;
          }
        }

        .stepCard {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 22px 18px;
          text-align: center;
        }

        .stepCardNum {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 50%;
          line-height: 30px;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .stepCardTitle {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 6px;
        }

        .stepCardDesc {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
      `}</style>

      <div className="page">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="heroBadge">
            <span>✓</span>
            <span>AI 콘텐츠 추천 도구</span>
          </div>

          <h1 className="heroTitle">
            키워드만 선택하면<br />
            <span className="accent">AI가 맞춤 추천해드립니다</span>
          </h1>

          <p className="heroSub">
            영상 제목·태그·대본 추천부터 알고리즘 분석까지.<br />
            유튜브, 쇼츠, 틱톡, 릴스 모두 지원합니다.
          </p>

          <div className="heroFeatures">
            <span><span className="check">✓</span> 완전 무료</span>
            <span><span className="check">✓</span> 회원가입 불필요</span>
            <span><span className="check">✓</span> 신용카드 X</span>
          </div>
        </section>

        {/* ============ STEP 1: 카테고리 ============ */}
        <div className="step">
          <div className="stepHeader">
            <div className="stepNumber">1</div>
            <div className="stepTitle">분야를 선택하세요</div>
            <div className="stepHint">총 {CATEGORIES.length}개 분야</div>
          </div>

          <div className="categoryGrid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`categoryChip ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="chipEmoji">{cat.emoji}</div>
                <div className="chipName">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ============ STEP 2: 키워드 ============ */}
        <div className="step">
          <div className="stepHeader">
            <div className="stepNumber">2</div>
            <div className="stepTitle">키워드를 고르거나 입력하세요</div>
          </div>

          <div className="keywordBox">
            {!selectedCategory ? (
              <div className="keywordEmpty">
                <div className="arrow">↑</div>
                <p>먼저 분야를 선택하면<br />추천 키워드가 나타납니다</p>
              </div>
            ) : (
              <>
                <div className="trendingHeader">
                  <div className="trendingLabel">
                    <span className="selectedCat">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.emoji}{' '}
                      {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </span>
                    {' '}추천 키워드
                  </div>
                  <div className="trendingHint">10개</div>
                </div>

                <div className="keywordList">
                  {trendingKeywords.map((kw, idx) => (
                    <button
                      key={idx}
                      className={`keywordItem ${keyword === kw ? 'selected' : ''}`}
                      onClick={() => handleKeywordSelect(kw)}
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                <div className="divider">또는 직접 입력</div>

                <input
                  type="text"
                  className="keywordInput"
                  placeholder="원하는 키워드를 입력하세요"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </>
            )}
          </div>

          <button 
            className="ctaBtn" 
            onClick={handleStart}
            disabled={!selectedCategory || !keyword.trim()}
          >
            AI 분석 시작하기
            <span className="ctaBtnSub">맞춤 제목·태그·대본 추천</span>
          </button>
        </div>

        {/* ============ 광고 ============ */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* ============ 작동 방식 ============ */}
        <section className="howSection">
          <h2 className="sectionTitle">어떻게 사용하나요?</h2>
          <p className="sectionSub">단 3단계로 영상 자료가 완성됩니다</p>

          <div className="stepsGrid">
            <div className="stepCard">
              <div className="stepCardNum">1</div>
              <div className="stepCardTitle">분야 선택</div>
              <div className="stepCardDesc">
                12개 분야 중<br />원하는 카테고리 선택
              </div>
            </div>
            <div className="stepCard">
              <div className="stepCardNum">2</div>
              <div className="stepCardTitle">키워드 선택</div>
              <div className="stepCardDesc">
                추천 키워드 클릭 또는<br />직접 입력
              </div>
            </div>
            <div className="stepCard">
              <div className="stepCardNum">3</div>
              <div className="stepCardTitle">결과 받기</div>
              <div className="stepCardDesc">
                맞춤 제목·태그·대본<br />복사해서 활용
              </div>
            </div>
          </div>
        </section>

        {/* ============ 광고 ============ */}
        <div className="adArea">
          <AdSlot slot="home-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
