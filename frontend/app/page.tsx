'use client';
/**
 * AlgoMaker v11 - 홈(랜딩) 페이지 · 전면 재설계
 * - 헤더/푸터/섹션 레이아웃 완전 재구성
 * - CSS Module 이름 불일치 회피 → 모든 스타일을 이 파일 내부에서 직접 정의
 * - 흰 배경 + 파란 포인트(#2563eb) + Pretendard
 */

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #0f172a;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ─────────────  HEADER  ───────────── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link href="/" style={s.logo}>
            <span style={s.logoAM}>AM</span>
            <span>AlgoMaker</span>
          </Link>

          <nav style={s.nav}>
            <a href="#process" style={s.navLink}>프로세스</a>
            <a href="#compare" style={s.navLink}>비교</a>
            <a href="#faq" style={s.navLink}>FAQ</a>
          </nav>

          <Link href="/create" style={s.ctaBtn}>
            무료로 시작하기 →
          </Link>
        </div>
      </header>

      {/* ─────────────  HERO  ───────────── */}
      <section style={s.hero}>
        <div style={s.heroBadge}>🎬 AI YouTube 자동화 플랫폼</div>
        <h1 style={s.heroTitle}>
          설정 한 번으로<br />
          <span style={s.heroTitleAccent}>AI가 영상을 만들어드립니다</span>
        </h1>
        <p style={s.heroSub}>
          카테고리 고르고 키워드 선택하면 끝.<br />
          AI가 뉴스 수집부터 대본·음성·영상·SEO까지 자동으로 처리합니다.
        </p>

        <div style={s.heroCtas}>
          <Link href="/create" style={s.primaryBtn}>
            무료로 시작하기 →
          </Link>
          <a href="#process" style={s.secondaryBtn}>
            프로세스 보기
          </a>
        </div>

        <div style={s.heroStats}>
          <div style={s.statBox}>
            <div style={s.statNum}>5~8분</div>
            <div style={s.statLabel}>영상 1편 제작</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>0원</div>
            <div style={s.statLabel}>초기 비용</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>A+</div>
            <div style={s.statLabel}>수익화 안전도</div>
          </div>
        </div>
      </section>

      {/* ─────────────  PROCESS  ───────────── */}
      <section id="process" style={s.section}>
        <div style={s.sectionLabel}>PROCESS</div>
        <h2 style={s.sectionTitle}>5단계로 완성됩니다</h2>
        <p style={s.sectionSub}>
          사용자는 <strong>처음 설정</strong>만 하시면 돼요. 나머진 AI가 알아서 처리합니다.
        </p>

        <div style={s.steps}>
          {[
            { n: '01', icon: '🎯', title: '카테고리 선택', desc: '경제·건강·자기계발·IT·라이프 중 관심 분야 하나 선택' },
            { n: '02', icon: '🔍', title: '블루오션 키워드 선별', desc: 'AI가 경쟁도·CPM·트렌드 분석해 키워드 12개 추천' },
            { n: '03', icon: '⚙️', title: '말투·길이 설정', desc: '격식체/친근체/반말/음슴체, 5~20분, 일반/시니어 모드' },
            { n: '04', icon: '🤖', title: 'AI 자동 처리', desc: '뉴스 수집 → 대본 → TTS → 인포그래픽 → 영상 합성 → SEO' },
            { n: '05', icon: '✅', title: '다운로드 & 업로드', desc: 'MP4 파일과 YouTube SEO 메타데이터 완성. 바로 업로드 가능' },
          ].map((step) => (
            <div key={step.n} style={s.step}>
              <div style={s.stepNum}>{step.n}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepText}>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────  COMPARE  ───────────── */}
      <section id="compare" style={{ ...s.section, background: '#f8fafc' }}>
        <div style={s.sectionLabel}>COMPARE</div>
        <h2 style={s.sectionTitle}>왜 AlgoMaker인가</h2>

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}></th>
                <th style={{ ...s.th, ...s.thAccent }}>ALGOMAKER</th>
                <th style={s.th}>수동 제작</th>
                <th style={s.th}>외주</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['영상 1편 제작 시간', '5~8분', '5시간+', '2~3일'],
                ['초기 비용', '0원', '100만원+', '견적'],
                ['월 비용', '무료~', '8~13만원', '100만원+'],
                ['뉴스 기반 팩트체크', '✓ 자동', '수동', '×'],
                ['YouTube SEO 2026 적용', '✓ AI 자동', '수동', '별도비용'],
                ['시니어 특화 모드', '✓ 내장', '×', '×'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={s.td}>{row[0]}</td>
                  <td style={{ ...s.td, ...s.tdAccent }}>{row[1]}</td>
                  <td style={s.td}>{row[2]}</td>
                  <td style={s.td}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────  FAQ  ───────────── */}
      <section id="faq" style={s.section}>
        <div style={s.sectionLabel}>FAQ</div>
        <h2 style={s.sectionTitle}>자주 묻는 질문</h2>

        <div style={s.faqList}>
          {[
            {
              q: 'AI가 만든 영상도 수익화되나요?',
              a: '네. 2026년 YouTube 정책 기준, AI로 제작했어도 "실질적 변형·사실 기반·교육적 가치"가 있으면 수익화 가능합니다. AlgoMaker는 뉴스 기반 팩트체크와 SEO 최적화로 YPP(YouTube Partner Program) 승인률을 높이도록 설계됐어요.',
            },
            {
              q: '실제로 얼마나 벌 수 있나요?',
              a: '카테고리에 따라 다릅니다. AlgoMaker 사용자들은 경제 CPM $12~22, 건강 $15~22, IT $10~16 범위에서 월 조회수 10만~50만 시 월 $300~$2,000 수익이 관찰됩니다. 채널 구독자 수·영상 품질·업로드 빈도가 핵심 변수예요.',
            },
            {
              q: '음성이 어색하지 않나요?',
              a: 'ElevenLabs 기반 한국어 TTS를 사용합니다. 2026년 기준 TTS는 사람 목소리와 구분이 어려운 수준이에요. 격식체/친근체/반말/음슴체 4종 말투와 남녀 음성을 선택할 수 있습니다.',
            },
            {
              q: '저작권 문제 없나요?',
              a: '뉴스 원문을 인용하지 않고 AI가 사실만 재구성합니다. 영상 소스는 저작권 무료 라이브러리만 사용하고, BGM도 Creative Commons 또는 YouTube 오디오 보관함 음원만 씁니다.',
            },
            {
              q: 'YouTube 정책에 어긋나지 않나요?',
              a: 'YouTube의 2026년 "합성·조작 콘텐츠 표시 의무"에 따라, AI 생성 영상은 업로드 시 자동으로 표시 태그가 추가됩니다. AlgoMaker는 이 태그를 메타데이터에 자동 포함시켜 정책 위반을 예방합니다.',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                ...s.faqItem,
                ...(openFaq === i ? s.faqItemOpen : {}),
              }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={s.faqQRow}>
                <span style={s.faqQ}>{item.q}</span>
                <span style={s.faqPlus}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && <div style={s.faqA}>{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────  FINAL CTA  ───────────── */}
      <section style={s.finalCta}>
        <h2 style={s.finalTitle}>지금 시작하세요</h2>
        <p style={s.finalSub}>5분 안에 첫 영상을 만들어보세요. 비용 0원.</p>
        <Link href="/create" style={s.finalBtn}>
          무료로 시작하기 →
        </Link>
      </section>

      {/* ─────────────  FOOTER  ───────────── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerTop}>
            <div style={s.footerBrand}>
              <div style={s.footerLogo}>
                <span style={s.logoAM}>AM</span>
                <span>AlgoMaker</span>
              </div>
              <p style={s.footerDesc}>
                AI가 키워드 발굴부터 영상 제작, SEO까지 자동으로 처리하는<br />
                YouTube 콘텐츠 자동화 플랫폼.
              </p>
            </div>

            <div style={s.footerCols}>
              <div style={s.footerCol}>
                <div style={s.footerColTitle}>제품</div>
                <Link href="/create" style={s.footerLink}>시작하기</Link>
                <a href="#process" style={s.footerLink}>프로세스</a>
                <a href="#faq" style={s.footerLink}>FAQ</a>
              </div>

              <div style={s.footerCol}>
                <div style={s.footerColTitle}>회사</div>
                <a href="#" style={s.footerLink}>소개</a>
                <a href="#" style={s.footerLink}>문의</a>
              </div>
            </div>
          </div>

          <div style={s.footerBottom}>
            <div style={s.footerBiz}>
              상호: 한줄컴퍼니 · 대표: 박예준 · 사업자등록번호: 450-07-03104<br />
              통신판매업신고: 제 2025-인천서구-3321호<br />
              주소: 인천광역시 서구 청라커낼로 270, 커넬힐스빌 2층 2496호
            </div>
            <div style={s.footerCopy}>
              © 2026 AlgoMaker · 한줄컴퍼니 · <a href="#" style={s.footerPolicyLink}>이용약관</a> · <a href="#" style={s.footerPolicyLink}>개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─────────────  STYLES (객체)  ───────────── */
const BLUE = '#2563eb';
const BLUE_DARK = '#1d4ed8';
const BLUE_LIGHT = '#eff6ff';
const TEXT = '#0f172a';
const MUTED = '#64748b';
const BORDER = '#e5e7eb';
const BG_SOFT = '#f8fafc';

const s: { [key: string]: React.CSSProperties } = {
  /* HEADER */
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: '#ffffff',
    borderBottom: `1px solid ${BORDER}`,
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 800,
    color: TEXT,
    textDecoration: 'none',
    letterSpacing: '-0.02em',
  },
  logoAM: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    background: BLUE,
    color: '#fff',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    gap: 28,
    alignItems: 'center',
  },
  navLink: {
    color: MUTED,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  ctaBtn: {
    padding: '10px 20px',
    background: BLUE,
    color: '#fff',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },

  /* HERO */
  hero: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '80px 24px 64px',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: BLUE_LIGHT,
    color: BLUE,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: 800,
    color: TEXT,
    letterSpacing: '-0.03em',
    lineHeight: 1.2,
    margin: '0 0 20px',
  },
  heroTitleAccent: {
    color: BLUE,
  },
  heroSub: {
    fontSize: 18,
    color: MUTED,
    lineHeight: 1.7,
    maxWidth: 640,
    margin: '0 auto 40px',
  },
  heroCtas: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 56,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '14px 28px',
    background: BLUE,
    color: '#fff',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: 'none',
  },
  secondaryBtn: {
    padding: '14px 28px',
    background: '#fff',
    color: TEXT,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: 'none',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    flexWrap: 'wrap',
  },
  statBox: {
    textAlign: 'center',
  },
  statNum: {
    fontSize: 32,
    fontWeight: 800,
    color: BLUE,
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
  },

  /* SECTION */
  section: {
    padding: '80px 24px',
    maxWidth: 1200,
    margin: '0 auto',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: BLUE,
    letterSpacing: '0.15em',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: TEXT,
    letterSpacing: '-0.02em',
    margin: '0 0 16px',
  },
  sectionSub: {
    fontSize: 16,
    color: MUTED,
    lineHeight: 1.7,
    margin: '0 auto 48px',
    maxWidth: 600,
  },

  /* STEPS */
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 800,
    margin: '0 auto',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '24px 28px',
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    textAlign: 'left',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: 700,
    color: BLUE,
    minWidth: 30,
  },
  stepIcon: {
    fontSize: 28,
    minWidth: 36,
  },
  stepText: { flex: 1 },
  stepTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: TEXT,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 1.6,
  },

  /* TABLE */
  tableWrap: {
    maxWidth: 900,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    padding: '16px 20px',
    textAlign: 'center',
    fontWeight: 700,
    color: TEXT,
    background: BG_SOFT,
    borderBottom: `1px solid ${BORDER}`,
  },
  thAccent: {
    color: BLUE,
    background: BLUE_LIGHT,
  },
  td: {
    padding: '14px 20px',
    textAlign: 'center',
    color: MUTED,
    borderBottom: `1px solid ${BORDER}`,
  },
  tdAccent: {
    color: BLUE,
    fontWeight: 700,
    background: '#fafbff',
  },

  /* FAQ */
  faqList: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  faqItem: {
    padding: '20px 24px',
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  faqItemOpen: {
    borderColor: BLUE,
    background: '#fafbff',
  },
  faqQRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  faqQ: {
    fontSize: 15,
    fontWeight: 600,
    color: TEXT,
  },
  faqPlus: {
    fontSize: 22,
    color: BLUE,
    fontWeight: 400,
    lineHeight: 1,
  },
  faqA: {
    marginTop: 14,
    fontSize: 14,
    color: MUTED,
    lineHeight: 1.7,
  },

  /* FINAL CTA */
  finalCta: {
    background: '#0f172a',
    padding: '80px 24px',
    textAlign: 'center',
    color: '#fff',
  },
  finalTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 12px',
    letterSpacing: '-0.02em',
  },
  finalSub: {
    fontSize: 16,
    color: '#94a3b8',
    margin: '0 0 32px',
  },
  finalBtn: {
    display: 'inline-block',
    padding: '14px 32px',
    background: BLUE,
    color: '#fff',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: 'none',
  },

  /* FOOTER */
  footer: {
    background: '#ffffff',
    borderTop: `1px solid ${BORDER}`,
  },
  footerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '56px 24px 32px',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 48,
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  footerBrand: {
    maxWidth: 380,
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 800,
    color: TEXT,
    marginBottom: 12,
  },
  footerDesc: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 1.7,
    margin: 0,
  },
  footerCols: {
    display: 'flex',
    gap: 56,
    flexWrap: 'wrap',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  footerColTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: TEXT,
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 13,
    color: MUTED,
    textDecoration: 'none',
  },
  footerBottom: {
    paddingTop: 24,
    borderTop: `1px solid ${BORDER}`,
  },
  footerBiz: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 1.8,
    marginBottom: 12,
  },
  footerCopy: {
    fontSize: 12,
    color: '#94a3b8',
  },
  footerPolicyLink: {
    color: MUTED,
    textDecoration: 'none',
  },
};
