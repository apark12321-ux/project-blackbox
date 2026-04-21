'use client';

/**
 * v11 랜딩 · 클린 화이트 디자인
 * (index_adsense.html 구조 참고)
 */

import { V11Shell } from './_shared/V11Shell';
import { useRouter } from 'next/navigation';
import styles from './landing.module.css';

export default function HomePage() {
  const router = useRouter();

  return (
    <V11Shell>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>🎬 AI YouTube 자동화 플랫폼</div>
          <h1 className={styles.heroTitle}>
            <strong>설정 한 번으로</strong><br />
            AI가 영상을 만들어드립니다
          </h1>
          <p className={styles.heroSub}>
            카테고리 고르고 키워드 선택하면 끝.<br />
            <strong>AI가 뉴스 수집부터 대본·음성·영상·SEO</strong>까지 자동으로 처리합니다.
          </p>

          <div className={styles.heroCta}>
            <button onClick={() => router.push('/create')} className={styles.btnPrimary}>
              무료로 시작하기 →
            </button>
            <a href="#process" className={styles.btnGhost}>프로세스 보기</a>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>5~8분</div>
              <div className={styles.statLabel}>영상 1편 제작</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statValue}>0원</div>
              <div className={styles.statLabel}>초기 비용</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statValue}>A+</div>
              <div className={styles.statLabel}>수익화 안전도</div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로세스 */}
      <section className={styles.sec} id="process">
        <div className={styles.container}>
          <div className={styles.eyebrow}>PROCESS</div>
          <h2 className={styles.sectionTitle}>5단계로 완성됩니다</h2>
          <p className={styles.sectionIntro}>
            사용자는 <strong>처음 설정</strong>만 하시면 돼요. 나머진 AI가 알아서 처리합니다.
          </p>

          <div className={styles.processGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.processCard}>
                <div className={styles.processNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.processIcon}>{s.icon}</div>
                <h3 className={styles.processTitle}>{s.title}</h3>
                <p className={styles.processDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 비교 */}
      <section className={styles.secSoft} id="compare">
        <div className={styles.container}>
          <div className={styles.eyebrow}>COMPARE</div>
          <h2 className={styles.sectionTitle}>왜 AlgoMaker인가</h2>

          <div className={styles.compareBox}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th></th>
                  <th className={styles.thUs}>AlgoMaker</th>
                  <th>수동 제작</th>
                  <th>외주</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i}>
                    <td className={styles.tdLabel}>{row.item}</td>
                    <td className={styles.tdUs}>{row.us}</td>
                    <td className={styles.tdThem}>{row.them}</td>
                    <td className={styles.tdThem}>{row.hire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.sec} id="faq">
        <div className={styles.container}>
          <div className={styles.eyebrow}>FAQ</div>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>

          <div className={styles.faqList}>
            {FAQS.map((f, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <div className={styles.faqA}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.secCta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>지금 시작하세요</h2>
          <p className={styles.ctaDesc}>5분 안에 첫 영상을 만들어보세요. 비용 0원.</p>
          <button onClick={() => router.push('/create')} className={styles.btnPrimary}>
            무료로 시작하기 →
          </button>
        </div>
      </section>
    </V11Shell>
  );
}

const STEPS = [
  { icon: '🎯', title: '카테고리 선택', desc: '경제·건강·자기계발·IT·라이프 중 관심 분야 하나 선택' },
  { icon: '🔍', title: '블루오션 키워드 선별', desc: 'AI가 경쟁도·CPM·트렌드 분석해 키워드 12개 추천' },
  { icon: '⚙️', title: '말투·길이 설정', desc: '격식형/친근형/반말/음슴체, 5~20분, 일반/시니어 모드' },
  { icon: '🤖', title: 'AI 자동 처리', desc: '뉴스 수집 → 대본 → TTS → 인포그래픽 → 영상 합성 → SEO' },
  { icon: '✅', title: '다운로드 & 업로드', desc: 'MP4 파일과 YouTube SEO 메타데이터 완성. 바로 업로드 가능' },
];

const COMPARE = [
  { item: '영상 1편 제작 시간', us: '5~8분', them: '5시간+', hire: '2~3일' },
  { item: '초기 비용', us: '0원', them: '100만원+', hire: '견적' },
  { item: '월 비용', us: '무료~', them: '8~13만원', hire: '100만원+' },
  { item: '뉴스 기반 팩트체크', us: '✓ 자동', them: '수동', hire: '✗' },
  { item: 'YouTube SEO 2026 적용', us: '✓ AI 자동', them: '수동', hire: '별도비용' },
  { item: '시니어 특화 모드', us: '✓ 내장', them: '✗', hire: '✗' },
];

const FAQS = [
  {
    q: 'AI가 만든 영상도 수익화되나요?',
    a: '네, YouTube의 수익화 정책(팩트 기반, 원본성, 시청자 가치)에 맞춰 콘텐츠를 생성합니다. 2025년부터는 "AI 생성 여부"보다 콘텐츠의 품질·가치가 수익화 기준이라 정상 수익화 가능합니다.',
  },
  {
    q: '실제로 얼마나 벌 수 있나요?',
    a: '카테고리와 키워드에 따라 다르지만, 블루오션 키워드로 꾸준히 업로드하면 월 10~100만원 수익 채널이 일반적입니다. AlgoMaker는 CPM이 높은 키워드를 우선 추천합니다.',
  },
  {
    q: '음성이 어색하지 않나요?',
    a: 'ElevenLabs 기반 한국어 TTS를 사용합니다. 시니어 모드에서는 속도와 톤이 자동 조정됩니다.',
  },
  {
    q: '저작권 문제 없나요?',
    a: '네이버 뉴스 API의 공개 기사를 "참고"용으로만 사용하며, 대본은 Gemini AI가 새로 작성합니다. 뉴스 원문 복사가 아니라 요지만 반영합니다.',
  },
  {
    q: 'YouTube 정책에 어긋나지 않나요?',
    a: 'AI 생성 콘텐츠는 YouTube가 명시적으로 허용합니다. 다만 "의미 있는 변경 없이 반복 게시"는 금지. AlgoMaker는 매번 다른 뉴스 기반으로 고유한 대본을 생성해 이 문제를 해결합니다.',
  },
];
