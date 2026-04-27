'use client';
/**
 * AlgoMaker 메인 랜딩 페이지
 * - SEO 최적화 (h1, h2, 풍부한 콘텐츠)
 * - AdSense 친화 (실제 가치 있는 콘텐츠)
 * - 김 부장 타겟 (40대 퇴직 예정자)
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from './_shared/V11Shell';
import { CATEGORIES } from './_shared/platforms';
import AdSlot from './_shared/AdSlot';

export default function HomePage() {
  const router = useRouter();

  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 1100px; margin: 0 auto; padding: 56px 24px 60px; }
        
        /* HERO */
        .hero { text-align: center; margin-bottom: 56px; }
        .heroBadge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; background: #fdf1e7;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          color: #c65f3b; margin-bottom: 20px;
        }
        .heroTitle {
          font-size: 48px; font-weight: 800;
          letter-spacing: -0.025em; color: #1a1a1a;
          line-height: 1.2; margin: 0 0 18px;
        }
        .heroTitle .accent { color: #c65f3b; }
        .heroSub {
          font-size: 17px; line-height: 1.7; color: #555;
          max-width: 580px; margin: 0 auto 28px;
        }
        .heroFeatures {
          display: flex; justify-content: center; gap: 24px;
          flex-wrap: wrap; margin-bottom: 32px;
          font-size: 13px; color: #555;
        }
        .heroFeatures span {
          display: inline-flex; align-items: center; gap: 6px;
          font-weight: 600;
        }
        .heroFeatures .check { color: #5e7e5d; font-weight: 800; }
        .heroCTA {
          display: inline-block; padding: 18px 40px;
          background: #c65f3b; color: #fff;
          border-radius: 100px; font-size: 16px; font-weight: 800;
          text-decoration: none; transition: all 0.2s;
        }
        .heroCTA:hover {
          background: #a64a2a; transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.25);
        }
        @media (max-width: 600px) {
          .heroTitle { font-size: 32px; }
          .heroSub { font-size: 15px; }
        }

        /* 섹션 공통 */
        .section { margin-bottom: 56px; }
        .sectionHeader { text-align: center; margin-bottom: 32px; }
        .sectionTitle {
          font-size: 28px; font-weight: 800;
          color: #1a1a1a; margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .sectionSub {
          font-size: 15px; color: #666;
        }

        /* 카테고리 그리드 */
        /* 12개 카테고리 그리드 (홈) */
        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .categoryGrid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .categoryGrid { grid-template-columns: repeat(2, 1fr); } }
        
        .categoryCard {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 18px 12px;
          text-align: center; cursor: pointer;
          transition: all 0.15s; text-decoration: none;
          color: inherit; display: block;
          position: relative;
        }
        .categoryCard:hover {
          border-color: #c65f3b; background: #fffbf8;
          transform: translateY(-2px);
        }
        .catEmoji { font-size: 28px; margin-bottom: 6px; }
        .catName {
          font-size: 13px; font-weight: 700;
          color: #1a1a1a; line-height: 1.3;
        }
        .catHot {
          display: inline-block; margin-top: 4px;
          padding: 1px 6px; background: #ff6b35;
          color: #fff; font-size: 9px; font-weight: 700;
          border-radius: 4px;
        }

        /* 차별화 카드 (떡상 엔진 강조) */
        .diffGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (max-width: 720px) { .diffGrid { grid-template-columns: 1fr; } }
        
        .diffCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          padding: 24px 22px;
          transition: all 0.2s;
        }
        .diffCard:hover {
          border-color: #c65f3b;
          background: #fffbf8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(198, 95, 59, 0.08);
        }
        .diffEmoji {
          font-size: 32px;
          margin-bottom: 10px;
          display: inline-block;
        }
        .diffTitle {
          font-size: 17px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        @media (max-width: 600px) {
          .diffTitle { font-size: 15.5px; }
        }
        .diffDesc {
          font-size: 13.5px;
          color: #555;
          line-height: 1.7;
        }
        @media (max-width: 600px) {
          .diffDesc { font-size: 13px; }
        }

        /* 감성 스토리 카드 (D안 차별화) */
        .storyCard {
          max-width: 720px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f3 100%);
          border: 1px solid #fde0c5;
          border-radius: 16px;
          padding: 36px 32px;
        }
        @media (max-width: 600px) {
          .storyCard { padding: 28px 22px; }
        }
        .storyQuote {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.6;
          letter-spacing: -0.02em;
          padding-bottom: 20px;
          border-bottom: 1.5px solid #fde0c5;
          margin-bottom: 22px;
          font-style: italic;
        }
        @media (max-width: 600px) {
          .storyQuote { font-size: 15.5px; }
        }
        .storyText p {
          font-size: 14.5px;
          color: #444;
          line-height: 1.85;
          margin: 0 0 14px;
        }
        .storyText p:last-of-type {
          margin-bottom: 0;
        }
        .storyText strong {
          color: #c65f3b;
          font-weight: 800;
          font-size: 15.5px;
        }
        .storySign {
          font-size: 13px !important;
          color: #777 !important;
          font-style: italic;
          text-align: right;
          margin-top: 18px !important;
        }
        .storyLink {
          display: inline-block;
          margin-top: 18px;
          padding: 10px 18px;
          background: #fff;
          color: #c65f3b;
          border: 1.5px solid #c65f3b;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
        }
        .storyLink:hover {
          background: #c65f3b;
          color: #fff;
          transform: translateY(-1px);
        }

        /* 작동 방식 */
        .howGrid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 720px) { .howGrid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .howGrid { grid-template-columns: 1fr; } }
        
        .howCard {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 24px 18px;
          text-align: center;
        }
        .howNum {
          display: inline-block; width: 32px; height: 32px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 50%; line-height: 32px;
          font-size: 13px; font-weight: 800;
          margin-bottom: 12px;
        }
        .howTitle {
          font-size: 15px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 6px;
        }
        .howDesc {
          font-size: 13px; color: #666; line-height: 1.5;
        }

        /* SNS 플랫폼 */
        .platformGrid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .platformGrid { grid-template-columns: 1fr 1fr; } }
        
        .platformItem {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 10px; padding: 16px 12px;
          text-align: center;
        }
        .platformEmoji { font-size: 28px; margin-bottom: 6px; }
        .platformName {
          font-size: 13.5px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 2px;
        }
        .platformDesc {
          font-size: 11px; color: #888;
        }

        /* FAQ */
        .faqList { max-width: 720px; margin: 0 auto; }
        .faqItem {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 10px; padding: 18px 20px;
          margin-bottom: 10px;
        }
        .faqQ {
          font-size: 14.5px; font-weight: 700;
          color: #1a1a1a; margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .faqQ::before {
          content: 'Q'; color: #c65f3b; font-weight: 800;
        }
        .faqA {
          font-size: 13.5px; color: #555;
          line-height: 1.7; padding-left: 18px;
        }

        /* 광고 */
        .adArea { margin: 40px 0; }

        /* 마지막 CTA */
        .finalCTA {
          background: linear-gradient(135deg, #fdf1e7, #f5e8df);
          border-radius: 16px; padding: 48px 32px;
          text-align: center; margin: 48px 0 0;
        }
        .finalCTATitle {
          font-size: 26px; font-weight: 800;
          color: #1a1a1a; margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .finalCTASub {
          font-size: 15px; color: #555; line-height: 1.6;
          margin-bottom: 24px;
        }
        @media (max-width: 600px) {
          .finalCTATitle { font-size: 22px; }
        }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="heroBadge">
            <span>✓</span>
            <span>AI 콘텐츠 추천 도구 · 완전 무료</span>
          </div>

          <h1 className="heroTitle">
            키워드만 입력하면<br />
            <span className="accent">AI가 모두 대신해드립니다</span>
          </h1>

          <p className="heroSub">
            영상 제목·태그·대본·썸네일 추천부터 SNS 업로드 메타데이터까지.<br />
            유튜브, 쇼츠, 틱톡, 릴스 한 번에 자동 생성.
          </p>

          <div className="heroFeatures">
            <span><span className="check">✓</span> 완전 무료</span>
            <span><span className="check">✓</span> 회원가입 불필요</span>
            <span><span className="check">✓</span> 신용카드 X</span>
            <span><span className="check">✓</span> 1분 만에 완성</span>
          </div>

          <Link href="/create" className="heroCTA">
            🚀 지금 바로 시작하기
          </Link>
        </section>

        {/* 광고 */}
        <div className="adArea">
          <AdSlot slot="home-mid" variant="horizontal" />
        </div>

        {/* 카테고리 12개 */}
        {/* 12개 분야 - 다양성 보여주기 (홈 마케팅용) */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">이런 분야들이 떡상해요</h2>
            <p className="sectionSub">40대 ~ 60대에게 인기 있는 콘텐츠 분야 12개</p>
          </div>
          <div className="categoryGrid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/create?category=${cat.id}`}
                className="categoryCard"
              >
                <div className="catEmoji">{cat.emoji}</div>
                <div className="catName">{cat.name}</div>
                {cat.hot && <div className="catHot">HOT</div>}
              </Link>
            ))}
          </div>
        </section>

        {/* 떡상 시나리오 차별화 */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">왜 AlgoMaker일까요?</h2>
            <p className="sectionSub">단순한 AI 글쓰기 도구가 아닙니다. 떡상 시나리오 엔진입니다.</p>
          </div>
          <div className="diffGrid">
            <div className="diffCard">
              <div className="diffEmoji">🎯</div>
              <div className="diffTitle">키워드별 다른 트리거</div>
              <div className="diffDesc">
                부동산은 수치 중심, 영어는 경험담 중심.<br />
                같은 도구가 아닌 분야별 맞춤 시나리오.
              </div>
            </div>
            <div className="diffCard">
              <div className="diffEmoji">🔄</div>
              <div className="diffTitle">매번 다른 결과</div>
              <div className="diffDesc">
                같은 키워드도 &quot;다시 생성&quot; 누를 때마다 새 시나리오.<br />
                100명이 같은 단어 입력해도 100가지 결과.
              </div>
            </div>
            <div className="diffCard">
              <div className="diffEmoji">💎</div>
              <div className="diffTitle">자연스러운 한국어</div>
              <div className="diffDesc">
                AI 티 안 나는 진짜 사람 화법.<br />
                조사 자동 처리로 어색함 0.
              </div>
            </div>
            <div className="diffCard">
              <div className="diffEmoji">📊</div>
              <div className="diffTitle">구체적 수치 자동</div>
              <div className="diffDesc">
                &quot;8천만원 차익&quot;, &quot;-12kg&quot;, &quot;토익 850점&quot;<br />
                AI가 분야에 맞는 진짜 같은 숫자 생성.
              </div>
            </div>
          </div>
        </section>

        {/* 감성 스토리 - 김 부장 이야기 (D안 차별화) */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">왜 만들었을까요?</h2>
            <p className="sectionSub">박 대표님의 친구, 김 부장 이야기</p>
          </div>
          <div className="storyCard">
            <div className="storyQuote">
              "회사 그만두고 영상 시작하려는데<br />
              제목은 어떻게 짓고, 태그는 뭘 넣고, 대본은 어떻게 쓰는지 모르겠어."
            </div>
            <div className="storyText">
              <p>주변에 영상 시작하고 싶다고 말씀하시는 40대, 50대 분들이 정말 많았습니다.
              그런데 막상 시작하려면 막막해서 한 발도 못 떼시는 분들이 대부분이었어요.</p>
              <p><strong>"키워드 하나만으로 영상 자료를 완성해드리면 어떨까?"</strong></p>
              <p>그게 AlgoMaker의 시작이었습니다. 비싼 강의도, 복잡한 도구도, 회원가입도 없이.
              그냥 키워드 하나만 입력하시면 AI가 알아서 영상 제목, 태그, 대본, 썸네일까지 만들어드립니다.</p>
              <p className="storySign">— 박예준, 알고파트너스 대표</p>
            </div>
            <Link href="/about" className="storyLink">자세한 이야기 보기 →</Link>
          </div>
        </section>

        {/* 작동 방식 */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">어떻게 사용하나요?</h2>
            <p className="sectionSub">단 4단계, 1분 만에 완성</p>
          </div>
          <div className="howGrid">
            <div className="howCard">
              <div className="howNum">1</div>
              <div className="howTitle">분야 선택</div>
              <div className="howDesc">12개 분야 중<br />원하는 카테고리</div>
            </div>
            <div className="howCard">
              <div className="howNum">2</div>
              <div className="howTitle">키워드 입력</div>
              <div className="howDesc">관심 있는 주제<br />키워드 입력</div>
            </div>
            <div className="howCard">
              <div className="howNum">3</div>
              <div className="howTitle">AI 분석</div>
              <div className="howDesc">AI가 알고리즘<br />자동 분석·생성</div>
            </div>
            <div className="howCard">
              <div className="howNum">4</div>
              <div className="howTitle">결과 받기</div>
              <div className="howDesc">제목·태그·대본<br />복사해서 사용</div>
            </div>
          </div>
        </section>

        {/* SNS 플랫폼 4개 */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">4개 SNS 플랫폼 지원</h2>
            <p className="sectionSub">한 번 입력으로 모든 플랫폼 메타데이터 자동 생성</p>
          </div>
          <div className="platformGrid">
            <div className="platformItem">
              <div className="platformEmoji">📺</div>
              <div className="platformName">YouTube 롱폼</div>
              <div className="platformDesc">8분 이상 / 16:9</div>
            </div>
            <div className="platformItem">
              <div className="platformEmoji">📱</div>
              <div className="platformName">YouTube Shorts</div>
              <div className="platformDesc">60초 이하 / 9:16</div>
            </div>
            <div className="platformItem">
              <div className="platformEmoji">🎵</div>
              <div className="platformName">TikTok</div>
              <div className="platformDesc">15-60초 / 9:16</div>
            </div>
            <div className="platformItem">
              <div className="platformEmoji">📸</div>
              <div className="platformName">Instagram Reels</div>
              <div className="platformDesc">90초 이하 / 9:16</div>
            </div>
          </div>
        </section>

        {/* 광고 */}
        <div className="adArea">
          <AdSlot slot="home-mid2" variant="horizontal" />
        </div>

        {/* FAQ (SEO) */}
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">자주 묻는 질문</h2>
            <p className="sectionSub">AlgoMaker에 대해 궁금한 점들</p>
          </div>
          <div className="faqList">
            <div className="faqItem">
              <div className="faqQ">정말 완전 무료인가요?</div>
              <div className="faqA">네, AlgoMaker는 완전 무료입니다. 회원가입도 필요 없고, 신용카드 등록도 없습니다. 사이트 운영은 광고 수익으로 충당합니다.</div>
            </div>
            <div className="faqItem">
              <div className="faqQ">AI는 어떤 걸 추천해주나요?</div>
              <div className="faqA">키워드를 입력하면 AI가 영상 제목 3가지, 알고리즘 최적화 태그, 영상 설명, 썸네일 콘셉트, 영상 대본 구조까지 자동 추천합니다. 4개 SNS 플랫폼별로 최적화된 메타데이터를 받을 수 있습니다.</div>
            </div>
            <div className="faqItem">
              <div className="faqQ">컴퓨터를 잘 못해도 사용할 수 있나요?</div>
              <div className="faqA">네, 4단계만 따라하면 됩니다. 분야 선택 → 키워드 입력 → AI 분석 → 결과 복사. 50대~60대 분들도 어려움 없이 사용하실 수 있도록 설계되었습니다.</div>
            </div>
            <div className="faqItem">
              <div className="faqQ">유튜브 외에 다른 플랫폼도 지원하나요?</div>
              <div className="faqA">네, YouTube 롱폼, YouTube Shorts, TikTok, Instagram Reels 4개 플랫폼을 지원합니다. 각 플랫폼별로 최적화된 제목, 설명, 해시태그를 자동 생성합니다.</div>
            </div>
            <div className="faqItem">
              <div className="faqQ">정말 조회수가 잘 나오는 제목을 추천해주나요?</div>
              <div className="faqA">AI가 알고리즘 데이터와 트렌드 키워드를 분석하여 클릭률이 높은 제목 패턴을 추천합니다. 다만 영상의 실제 성과는 콘텐츠 품질, 썸네일, 업로드 시간 등 다양한 요소에 영향을 받습니다.</div>
            </div>
          </div>
        </section>

        {/* 최종 CTA */}
        <div className="finalCTA">
          <h2 className="finalCTATitle">
            지금 바로 시작해보세요
          </h2>
          <p className="finalCTASub">
            1분이면 영상 제목·태그·대본까지 완성됩니다.<br />
            회원가입도, 신용카드도, 어려운 설정도 없어요.
          </p>
          <Link href="/create" className="heroCTA">
            🚀 무료로 시작하기
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
