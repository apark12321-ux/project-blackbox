'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { V10Shell, getV10Project, setV10Project } from '../_shared/V10Shell';
import styles from './processing.module.css';

interface Stage {
  id: string;
  label: string;
  icon: string;
  duration: number; // ms
}

const STAGES: Stage[] = [
  { id: 'news',    label: '뉴스 수집 중',      icon: '📰', duration: 2500 },
  { id: 'script',  label: 'AI 대본 작성 중',   icon: '✍️', duration: 4000 },
  { id: 'tts',     label: 'TTS 음성 생성 중',  icon: '🎤', duration: 3500 },
  { id: 'infra',   label: '인포그래픽 생성 중', icon: '🎨', duration: 3000 },
  { id: 'video',   label: '영상 합성 중',      icon: '🎬', duration: 4500 },
  { id: 'seo',     label: '수익화 검증 중',    icon: '🛡️', duration: 2000 },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [preview, setPreview] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    const p = getV10Project();
    if (!p.keyword) {
      router.replace('/keyword');
      return;
    }
    setKeyword(p.keyword);

    // 순차 단계 진행
    let total = 0;
    STAGES.forEach((stage, idx) => {
      total += stage.duration;
      const t = setTimeout(() => {
        setCurrentStage(idx + 1);
        // 미리보기 텍스트 추가
        setPreview(prev => [
          ...prev,
          getPreviewText(stage.id, p.keyword!, p.categoryLabel || ''),
        ]);
      }, total);
      timeoutsRef.current.push(t);
    });

    // 완료
    const doneT = setTimeout(() => {
      setCompleted(true);
      setV10Project({ step: 4 });
    }, total + 500);
    timeoutsRef.current.push(doneT);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [router]);

  const handleComplete = () => {
    router.push('/done');
  };

  return (
    <V10Shell step={3} title="AI 자동 처리" showStepDots={true}>
      <div className={styles.container}>
        <div className={styles.stepBar}>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>카테고리</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>키워드</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>설정</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={`${styles.stepBarItem} ${styles.stepBarActive}`}>
            <span className={styles.stepBarNum}>4</span>
            <span>자동 생성</span>
          </span>
        </div>

        <div className={styles.split}>
          {/* 좌측 · 진행 상황 */}
          <div className={styles.leftPane}>
            <h2 className={styles.title}>
              <span>🤖</span>
              {completed ? 'AI 자동 처리 완료!' : 'AI 자동 처리 중'}
            </h2>
            <p className={styles.subtitle}>
              {completed ? '모든 단계가 성공적으로 완료되었습니다' : '사용자는 기다리기만 하면 됩니다 ☕'}
            </p>

            <div className={styles.keywordBadge}>
              <span>🎯</span>
              <strong>{keyword}</strong>
            </div>

            <div className={styles.stages}>
              {STAGES.map((stage, idx) => {
                const isActive = currentStage === idx && !completed;
                const isDone = currentStage > idx || completed;
                const isPending = currentStage < idx && !completed;
                return (
                  <div
                    key={stage.id}
                    className={`${styles.stage} ${isActive ? styles.stageActive : ''} ${isDone ? styles.stageDone : ''} ${isPending ? styles.stagePending : ''}`}
                  >
                    <div className={styles.stageIcon}>
                      {isDone ? '✓' : isActive ? <span className={styles.pulse}>{stage.icon}</span> : stage.icon}
                    </div>
                    <div className={styles.stageBody}>
                      <div className={styles.stageLabel}>
                        {stage.label}
                        {isDone && <span className={styles.stageDoneBadge}>완료</span>}
                        {isActive && <span className={styles.stageActiveBadge}>진행 중<span className={styles.dots}></span></span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.estimate}>
              <span>⏱️</span>
              {completed
                ? '총 소요 시간: 약 20초 (시연용) · 실서비스 5~8분'
                : '예상 소요 시간: 약 5~8분 · 페이지를 닫아도 서버에서 계속 생성됩니다'}
            </div>

            {completed && (
              <button className={styles.completeBtn} onClick={handleComplete}>
                <span>🎉</span>
                <span>완성된 영상 확인하기</span>
                <span>→</span>
              </button>
            )}
          </div>

          {/* 우측 · 실시간 미리보기 */}
          <div className={styles.rightPane}>
            <div className={styles.previewHeader}>
              <div className={styles.previewLabel}>
                <span className={styles.livePulse} />
                <span>실시간 미리보기</span>
              </div>
            </div>
            <div className={styles.previewBody}>
              {preview.length === 0 ? (
                <div className={styles.previewEmpty}>
                  <div className={styles.previewBot}>🤖</div>
                  <div>대본이 생성되면 여기에 표시됩니다</div>
                </div>
              ) : (
                <div className={styles.previewContent}>
                  {preview.map((text, idx) => (
                    <div key={idx} className={styles.previewLine}>
                      {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </V10Shell>
  );
}

function getPreviewText(stageId: string, keyword: string, category: string): string {
  const texts: Record<string, string> = {
    news: `📰 "${keyword}" 관련 최근 7일 기사 6건을 수집했습니다. 고신뢰도 언론사(연합뉴스·KBS·MBC·한국경제) 위주로 필터링했습니다.`,
    script: `✍️ 6개 블록 대본 작성 완료 (약 10분 분량)\n\n[오프닝 28초]\n"안녕하세요! 오늘은 ${keyword}에 대해 꼭 알아야 할 진실을 알려드리겠습니다. 이 영상을 끝까지 보시면..."`,
    tts: `🎤 한국어 여성 음성(ElevenLabs)으로 10분 분량 음성 생성 완료. 시니어 모드 선택 시 속도 -15%, 고음 강조.`,
    infra: `🎨 핵심 장면 4컷 인포그래픽 생성: ① 블루오션 점수 차트 ② 주요 통계 ③ 단계별 가이드 ④ 비교 표`,
    video: `🎬 영상 합성 완료 (1920×1080, 30fps). TTS 음성 + 인포그래픽 + 자막 통합. 총 길이 10분 12초.`,
    seo: `🛡️ YouTube SEO 2026 규칙 적용 완료!\n▪ 제목: "${keyword} 위험한 3가지 신호 | 모르면 당합니다"\n▪ 태그 12개 (고CPM 우선)\n▪ 수익화 안전도: 92/100 (A+)`,
  };
  return texts[stageId] || '';
}
