'use client';
/**
 * AlgoMaker 메인 페이지 v3 (CLEAN)
 *
 * 박예준 대표 컨셉 확정:
 * - 타겟: 40대 퇴직 예정자 (김 부장)
 * - 메시지: "키워드만 입력하면 AI가 다 해드립니다"
 * - 수익: 완전 무료 + AdSense
 * - 핵심: 조회수 잘 나올 제목/태그 AI 추천
 *
 * 디자인 원칙:
 * ✅ 깔끔함 (구슬볼/오라클/매트릭스 X)
 * ✅ 명확함 (5초 안에 이해)
 * ✅ 안심감 (퇴직자도 부담 없이)
 * ✅ 도구 느낌 (점술 X)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell, setProject } from './_shared/V11Shell';
import { CATEGORIES } from './_shared/platforms';
import AdSlot from './_shared/AdSlot';

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleStart = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요.');
      return;
    }
    if (!selectedCategory) {
      alert('분야를 선택해주세요.');
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
          max-width: 880px;
          margin: 0 auto;
          padding: 60px 24px 40px;
        }

        /* ============ HERO ============ */
        .hero {
          text-align: center;
          margin-bottom: 56px;
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
          margin-bottom: 20px;
        }

        .heroTitle {
          font-size: 44px;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #2a2419;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .heroTitle .accent {
          color: #c65f3b;
        }

        .heroSub {
          font-size: 17px;
          line-height: 1.6;
          color: #6b6557;
          max-width: 560px;
          margin: 0 auto 32px;
        }

        .heroFeatures {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #6b6557;
          margin-bottom: 24px;
        }

        .heroFeatures span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .heroFeatures .check {
          color: #5e7e5d;
          font-weight: 700;
        }

        /* ============ INPUT BOX ============ */
        .inputBox {
          background: #fff;
          border: 1px solid #e8e2d3;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 40px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
        }

        .inputLabel {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #2a2419;
          margin-bottom: 8px;
        }

        .keywordInput {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          font-family: inherit;
          border: 2px solid #e8e2d3;
          border-radius: 12px;
          background: #faf8f4;
          color: #2a2419;
          transition: all 0.2s;
          margin-bottom: 24px;
          box-sizing: border-box;
        }

        .keywordInput:focus {
          outline: none;
          border-color: #c65f3b;
          background: #fff;
        }

        .keywordInput::placeholder {
          color: #b8ad9b;
        }

        /* 분야 선택 */
        .categoryLabel {
          font-size: 14px;
          font-weight: 700;
          color: #2a2419;
          margin-bottom: 12px;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .categoryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .categoryChip {
          padding: 12px 10px;
          background: #faf8f4;
          border: 2px solid #e8e2d3;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          font-family: inherit;
        }

        .categoryChip:hover {
          border-color: #d4a87b;
          background: #fff;
        }

        .categoryChip.selected {
          border-color: #c65f3b;
          background: #fdf1e7;
        }

        .chipEmoji {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .chipName {
          font-size: 12px;
          font-weight: 700;
          color: #2a2419;
        }

        /* CTA 버튼 */
        .ctaBtn {
          width: 100%;
          padding: 18px 24px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .ctaBtn:hover {
          background: #a64a2a;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.3);
        }

        .ctaBtn:active {
          transform: translateY(0);
        }

        .ctaBtnSub {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.85;
          display: block;
          margin-top: 4px;
        }

        /* ============ HOW IT WORKS ============ */
        .howSection {
          margin: 48px 0;
        }

        .sectionTitle {
          font-size: 22px;
          font-weight: 800;
          color: #2a2419;
          text-align: center;
          margin-bottom: 8px;
        }

        .sectionSub {
          font-size: 14px;
          color: #6b6557;
          text-align: center;
          margin-bottom: 32px;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 720px) {
          .stepsGrid {
            grid-template-columns: 1fr;
          }
        }

        .stepCard {
          background: #fff;
          border: 1px solid #e8e2d3;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
        }

        .stepNum {
          display: inline-block;
          width: 32px;
          height: 32px;
          background: #fdf1e7;
          color: #c65f3b;
          border-radius: 50%;
          line-height: 32px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .stepTitle {
          font-size: 16px;
          font-weight: 700;
          color: #2a2419;
          margin-bottom: 6px;
        }

        .stepDesc {
          font-size: 13px;
          color: #6b6557;
          line-height: 1.5;
        }

        /* ============ FEATURES ============ */
        .featuresSection {
          background: #faf8f4;
          border-radius: 16px;
          padding: 36px 28px;
          margin: 48px 0;
        }

        .featuresList {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 600px) {
          .featuresList {
            grid-template-columns: 1fr;
          }
        }

        .featureItem {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .featureIcon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: #fff;
          border: 1px solid #e8e2d3;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .featureContent h3 {
          font-size: 14px;
          font-weight: 700;
          color: #2a2419;
          margin: 0 0 4px;
        }

        .featureContent p {
          font-size: 12.5px;
          color: #6b6557;
          line-height: 1.5;
          margin: 0;
        }

        /* ============ AD AREA ============ */
        .adArea {
          margin: 32px 0;
        }
      `}</style>

      <div className="page">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="heroBadge">
            <span>✓</span>
            <span>AI 영상 자동 생성 도구</span>
          </div>

          <h1 className="heroTitle">
            키워드만 입력하면<br />
            AI가 <span className="accent">모든 걸 대신해드립니다</span>
          </h1>

          <p className="heroSub">
            영상 제목·태그·대본까지 자동 생성.<br />
            유튜브, 쇼츠, 틱톡, 릴스 모두 한 번에.
          </p>

          <div className="heroFeatures">
            <span><span className="check">✓</span> 완전 무료</span>
            <span><span className="check">✓</span> 회원가입 불필요</span>
            <span><span className="check">✓</span> 신용카드 X</span>
          </div>
        </section>

        {/* ============ 입력 박스 ============ */}
        <div className="inputBox">
          <label className="inputLabel" htmlFor="keyword-input">
            🎯 영상 키워드를 입력하세요
          </label>
          <input
            id="keyword-input"
            type="text"
            className="keywordInput"
            placeholder="예: 50대 부동산 투자 전략, 퇴직 후 N잡 추천..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />

          <div className="categoryLabel">
            📂 어떤 분야의 영상인가요?
          </div>
          <div className="categoryGrid">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                className={`categoryChip ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="chipEmoji">{cat.emoji}</div>
                <div className="chipName">{cat.name}</div>
              </button>
            ))}
          </div>

          <button className="ctaBtn" onClick={handleStart}>
            AI 분석 시작하기
            <span className="ctaBtnSub">조회수 잘 나오는 제목·태그 자동 추천</span>
          </button>
        </div>

        {/* ============ 광고 영역 ============ */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* ============ 어떻게 작동하나요? ============ */}
        <section className="howSection">
          <h2 className="sectionTitle">어떻게 작동하나요?</h2>
          <p className="sectionSub">단 3단계로 영상 자료가 완성됩니다</p>

          <div className="stepsGrid">
            <div className="stepCard">
              <div className="stepNum">1</div>
              <h3 className="stepTitle">키워드 입력</h3>
              <p className="stepDesc">
                만들고 싶은 영상의<br />키워드와 분야 선택
              </p>
            </div>
            <div className="stepCard">
              <div className="stepNum">2</div>
              <h3 className="stepTitle">AI 분석</h3>
              <p className="stepDesc">
                조회수 잘 나오는<br />제목·태그·대본 자동 추천
              </p>
            </div>
            <div className="stepCard">
              <div className="stepNum">3</div>
              <h3 className="stepTitle">바로 사용</h3>
              <p className="stepDesc">
                완성된 자료를<br />복사해서 업로드
              </p>
            </div>
          </div>
        </section>

        {/* ============ 주요 기능 ============ */}
        <section className="featuresSection">
          <h2 className="sectionTitle">제공되는 자료</h2>
          <p className="sectionSub">키워드 하나로 모두 자동 생성</p>

          <div className="featuresList">
            <div className="featureItem">
              <div className="featureIcon">📝</div>
              <div className="featureContent">
                <h3>영상 제목 추천</h3>
                <p>유튜브 알고리즘 분석으로 클릭률 높은 제목 3개 추천</p>
              </div>
            </div>
            <div className="featureItem">
              <div className="featureIcon">🏷️</div>
              <div className="featureContent">
                <h3>태그 자동 생성</h3>
                <p>플랫폼별 최적화된 태그 자동 생성·복사 가능</p>
              </div>
            </div>
            <div className="featureItem">
              <div className="featureIcon">📄</div>
              <div className="featureContent">
                <h3>영상 대본</h3>
                <p>30초~10분 길이 시나리오 구조 제공</p>
              </div>
            </div>
            <div className="featureItem">
              <div className="featureIcon">📱</div>
              <div className="featureContent">
                <h3>다중 플랫폼</h3>
                <p>유튜브·쇼츠·틱톡·릴스 한 번에 자료 생성</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 광고 영역 ============ */}
        <div className="adArea">
          <AdSlot slot="home-bottom" variant="horizontal" />
        </div>
      </div>
    </DashboardShell>
  );
}
