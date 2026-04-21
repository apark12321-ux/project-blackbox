'use client';

/**
 * frontend/app/done/page.tsx
 * AlgoMaker · 완료 축하 페이지
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './done.module.css';
import { FontLoader, getProject } from '../_shared/StepBar';

export default function DonePage() {
  const router = useRouter();
  const [project, setProject] = useState(() => ({ keyword: '주식 급등 작전', category: '경제', title: '', duration: '8분 30초' }));
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    setProject(getProject());
    const t = setTimeout(() => setConfettiActive(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.root}>
      <FontLoader />

      {confettiActive && (
        <div className={styles.confetti}>
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className={styles.piece}
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#d4a537', '#4ade80', '#60a5fa', '#f87171', '#c084fc'][i % 5],
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.celebration}>🎉</div>
        <h1 className={styles.title}>영상 제작 완료!</h1>
        <p className={styles.subtitle}>
          기획부터 배포까지 모든 단계를 성공적으로 마쳤습니다.
        </p>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>주제</span>
            <span className={styles.summaryValue}>{project.keyword}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>카테고리</span>
            <span className={styles.summaryValue}>{project.category}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>길이</span>
            <span className={styles.summaryValue}>{project.duration}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>수익화 안전도</span>
            <span className={styles.summaryValue} style={{ color: '#4ade80' }}>A+ (87/100)</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>상태</span>
            <span className={styles.summaryValue} style={{ color: '#4ade80' }}>✓ YouTube 게시됨</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>4</div>
            <div className={styles.statLabel}>완료 단계</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>6</div>
            <div className={styles.statLabel}>제작 블록</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>$15-22</div>
            <div className={styles.statLabel}>예상 CPM</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>72%</div>
            <div className={styles.statLabel}>시청 유지율</div>
          </div>
        </div>

        <div className={styles.tips}>
          <div className={styles.tipsHead}>💡 다음 영상을 위한 팁</div>
          <ul className={styles.tipsList}>
            <li>업로드 후 2시간이 가장 중요한 골든 타임입니다</li>
            <li>댓글 알림을 켜두고 처음 10개 댓글에 답하세요</li>
            <li>다음 영상은 오늘 업로드한 주제의 연장선으로 기획하면 추천 알고리즘이 보상합니다</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => router.push('/plan')}
          >
            ✦ 새 영상 만들기
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => window.open('https://studio.youtube.com', '_blank')}
          >
            YouTube Studio에서 확인 →
          </button>
        </div>
      </div>
    </div>
  );
}
