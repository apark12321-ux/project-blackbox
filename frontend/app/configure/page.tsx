'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V10Shell, getV10Project, setV10Project } from '../_shared/V10Shell';
import styles from './configure.module.css';

type Tone = 'formal' | 'friendly' | 'casual' | 'slang';

const TONES: { key: Tone; label: string; example: string }[] = [
  { key: 'formal',   label: '격식형',   example: '오늘은 ~에 대해 알아보겠습니다.' },
  { key: 'friendly', label: '친근형',   example: '안녕하세요~ 오늘은 ~을 알아볼게요!' },
  { key: 'casual',   label: '반말',     example: '오늘 ~ 얘기해볼게, 끝까지 봐!' },
  { key: 'slang',    label: '음슴체',   example: '오늘 주제는 ~임. 핵심만 정리함.' },
];

export default function ConfigurePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [duration, setDuration] = useState(10);
  const [mode, setMode] = useState<'normal' | 'senior'>('normal');

  useEffect(() => {
    const p = getV10Project();
    if (!p.keyword) {
      router.replace('/keyword');
      return;
    }
    setKeyword(p.keyword);
    if (p.tone) setTone(p.tone);
    if (p.duration) setDuration(p.duration);
    if (p.mode) setMode(p.mode);
    if (p.customTopic) setCustomTopic(p.customTopic);
  }, [router]);

  const handleStart = () => {
    setV10Project({
      customTopic,
      tone,
      duration,
      mode,
      step: 3,
    });
    router.push('/processing');
  };

  return (
    <V10Shell step={2} title="상세 설정" showStepDots={true}>
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
          <span className={`${styles.stepBarItem} ${styles.stepBarActive}`}>
            <span className={styles.stepBarNum}>3</span>
            <span>상세 설정</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={styles.stepBarNum}>4</span>
            <span>자동 생성</span>
          </span>
        </div>

        <div className={styles.selectedBox}>
          <div className={styles.selectedLabel}>선택한 키워드</div>
          <div className={styles.selectedKeyword}>
            <span>🎯</span>
            <strong>{keyword}</strong>
          </div>
        </div>

        <h2 className={styles.title}>영상 상세 설정</h2>
        <p className={styles.subtitle}>말투, 길이, 타겟을 조정하면 최적 콘텐츠가 생성됩니다</p>

        {/* 직접 입력 */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            📝 추가 주제 (선택사항)
            <span className={styles.optional}>Optional</span>
          </div>
          <input
            type="text"
            className={styles.input}
            placeholder={`예: ${keyword} 관련 최신 이슈`}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
          />
          <div className={styles.hint}>비워두면 AI가 키워드 기반으로 자동 구성합니다</div>
        </div>

        {/* 말투 */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>🗣️ 말투</div>
          <div className={styles.toneGrid}>
            {TONES.map((t) => (
              <button
                key={t.key}
                className={`${styles.toneBtn} ${tone === t.key ? styles.toneBtnActive : ''}`}
                onClick={() => setTone(t.key)}
              >
                <div className={styles.toneLabel}>{t.label}</div>
                <div className={styles.toneExample}>{t.example}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 영상 길이 */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            ⏱️ 영상 길이:&nbsp;
            <strong className={styles.durationValue}>약 {duration}분</strong>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderLabels}>
            <span>5분</span>
            <span>10분</span>
            <span>15분</span>
            <span>20분</span>
          </div>
        </div>

        {/* 모드 */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>👥 타겟 모드</div>
          <div className={styles.modeGrid}>
            <button
              className={`${styles.modeBtn} ${mode === 'normal' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('normal')}
            >
              <div className={styles.modeIcon}>👤</div>
              <div className={styles.modeTitle}>일반</div>
              <div className={styles.modeDesc}>전연령 대상 표준 톤</div>
            </button>
            <button
              className={`${styles.modeBtn} ${mode === 'senior' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('senior')}
            >
              <div className={styles.modeIcon}>👴</div>
              <div className={styles.modeTitle}>시니어</div>
              <div className={styles.modeDesc}>50-70대 · 큰 글씨, 느린 TTS, 고CPM</div>
            </button>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <button className={styles.backBtn} onClick={() => router.push('/keyword')}>
            ← 키워드 변경
          </button>
          <button className={styles.startBtn} onClick={handleStart}>
            <span>🎬</span>
            <span>영상 자동 생성 시작</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </V10Shell>
  );
}
