'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import styles from './processing.module.css';

interface Stage { id: string; label: string; icon: string; duration: number; }
const STAGES: Stage[] = [
  { id: 'news',    label: '뉴스 수집',       icon: '📰', duration: 2500 },
  { id: 'script',  label: 'AI 대본 작성',    icon: '✍️', duration: 4000 },
  { id: 'tts',     label: 'TTS 음성 생성',   icon: '🎤', duration: 3500 },
  { id: 'infra',   label: '인포그래픽 생성', icon: '🎨', duration: 3000 },
  { id: 'video',   label: '영상 합성',       icon: '🎬', duration: 4500 },
  { id: 'seo',     label: '수익화 검증',     icon: '🛡️', duration: 2000 },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [preview, setPreview] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    const p = getProject();
    if (!p.keyword) { router.replace('/keyword'); return; }
    setKeyword(p.keyword);

    let total = 0;
    STAGES.forEach((stage, idx) => {
      total += stage.duration;
      const t = setTimeout(() => {
        setCurrentStage(idx + 1);
        setPreview(prev => [...prev, getPreviewText(stage.id, p.keyword!, p.categoryLabel || '')]);
      }, total);
      timeoutsRef.current.push(t);
    });
    const doneT = setTimeout(() => {
      setCompleted(true);
      setProject({ step: 4 });
    }, total + 500);
    timeoutsRef.current.push(doneT);

    return () => { timeoutsRef.current.forEach(clearTimeout); };
  }, [router]);

  return (
    <V11Shell currentStep={4}>
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.eyebrow}>STEP 4 · AI 처리</div>
            <h1 className={styles.title}>{completed ? '✅ 처리 완료!' : '🤖 AI가 영상을 만들고 있어요'}</h1>
            <p className={styles.sub}>
              {completed ? '모든 단계가 성공적으로 완료되었습니다' : '사용자는 기다리기만 하면 돼요 ☕'}
            </p>
          </div>

          <div className={styles.kwBadge}>
            <span>🎯</span>
            <strong>{keyword}</strong>
          </div>

          <div className={styles.split}>
            <div className={styles.leftPane}>
              <div className={styles.stagesList}>
                {STAGES.map((stage, idx) => {
                  const isActive = currentStage === idx && !completed;
                  const isDone = currentStage > idx || completed;
                  const isPending = currentStage < idx && !completed;
                  return (
                    <div key={stage.id} className={`${styles.stage} ${isActive ? styles.stageActive : ''} ${isDone ? styles.stageDone : ''} ${isPending ? styles.stagePending : ''}`}>
                      <div className={styles.stageIcon}>{isDone ? '✓' : stage.icon}</div>
                      <div className={styles.stageLabel}>
                        {stage.label}
                        {isActive && <span className={styles.stageBadgeActive}>진행 중...</span>}
                        {isDone && <span className={styles.stageBadgeDone}>완료</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.estimate}>
                {completed
                  ? '총 소요 시간: 약 20초 (시연) · 실서비스 5~8분'
                  : '예상 소요: 5~8분 · 페이지를 닫아도 서버에서 계속 생성됩니다'}
              </div>

              {completed && (
                <button className={styles.btnDone} onClick={() => router.push('/done')}>
                  완성된 영상 확인하기 →
                </button>
              )}
            </div>

            <div className={styles.rightPane}>
              <div className={styles.previewHead}>
                <span className={styles.livePulse} />
                <span>실시간 미리보기</span>
              </div>
              <div className={styles.previewBody}>
                {preview.length === 0 ? (
                  <div className={styles.previewEmpty}>
                    <div className={styles.previewBot}>🤖</div>
                    <div>대본이 생성되면 여기에 표시됩니다</div>
                  </div>
                ) : (
                  preview.map((text, idx) => (
                    <div key={idx} className={styles.previewLine}>{text}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </V11Shell>
  );
}

function getPreviewText(stageId: string, keyword: string, category: string): string {
  const texts: Record<string, string> = {
    news: `📰 "${keyword}" 관련 최근 7일 기사 6건을 수집했습니다.\n고신뢰도 언론사(연합뉴스·KBS·MBC·한국경제) 위주로 필터링했습니다.`,
    script: `✍️ 6개 블록 대본 작성 완료 (약 10분 분량)\n\n[오프닝 28초]\n"안녕하세요! 오늘은 ${keyword}에 대해 꼭 알아야 할 진실을 알려드리겠습니다..."`,
    tts: `🎤 한국어 여성 음성(ElevenLabs)으로 10분 분량 음성 생성 완료.`,
    infra: `🎨 핵심 장면 4컷 인포그래픽 생성 완료.`,
    video: `🎬 영상 합성 완료 (1920×1080, 30fps). 길이 10분 12초.`,
    seo: `🛡️ YouTube SEO 2026 규칙 적용 완료\n제목/태그/설명/썸네일 자동 최적화.\n수익화 안전도: 92/100 (A+)`,
  };
  return texts[stageId] || '';
}
