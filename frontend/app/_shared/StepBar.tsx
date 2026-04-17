'use client';

/**
 * frontend/app/_shared/StepBar.tsx
 * 4단계 진행 인디케이터 + 공통 컴포넌트
 */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './shared.module.css';

export type StageId = 'plan' | 'script' | 'studio' | 'publish' | 'done';
export type AudienceMode = 'normal' | 'senior';

const STAGES: { id: StageId; label: string; path: string }[] = [
  { id: 'plan', label: '기획', path: '/plan' },
  { id: 'script', label: '대본', path: '/script' },
  { id: 'studio', label: '영상', path: '/studio' },
  { id: 'publish', label: '배포', path: '/publish' },
];

// ═══════════════════════════════════════
// Font Loader
// ═══════════════════════════════════════
export function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
    document.head.appendChild(link);
  }, []);
  return null;
}

// ═══════════════════════════════════════
// Step Bar
// ═══════════════════════════════════════
export function StepBar({ current }: { current: StageId }) {
  const router = useRouter();
  const currentIdx = STAGES.findIndex((s) => s.id === current);

  return (
    <div className={styles.stepBar}>
      {STAGES.map((s, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const canNavigate = !isActive; // 현재 단계 빼고는 언제든 이동 가능
        const cls = [
          styles.stepItem,
          isDone ? styles.done : '',
          isActive ? styles.active : '',
          !isActive && !isDone ? styles.future : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className={cls}
              onClick={() => {
                if (canNavigate) router.push(s.path);
              }}
              disabled={isActive}
              style={{ cursor: canNavigate ? 'pointer' : 'default' }}
            >
              <span className={styles.stepIdx}>{isDone ? '✓' : i + 1}</span>
              <span>{s.label}</span>
            </button>
            {i < STAGES.length - 1 && <span className={styles.stepArrow}>→</span>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// Project State
// ═══════════════════════════════════════
export interface ProjectState {
  keyword: string;
  category: string;
  duration: string;
  title: string;
  seniorMode: boolean;
}

const DEFAULT_PROJECT: ProjectState = {
  keyword: '주식 급등 작전',
  category: '경제',
  duration: '8분 30초',
  title: '개미들이 3일 만에 전액을 잃은 이유',
  seniorMode: false,
};

export function getProject(): ProjectState {
  if (typeof window === 'undefined') return DEFAULT_PROJECT;
  const w = window as unknown as { __algomakerProject?: ProjectState };
  return { ...DEFAULT_PROJECT, ...(w.__algomakerProject || {}) };
}

export function setProject(p: Partial<ProjectState>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { __algomakerProject?: ProjectState };
  w.__algomakerProject = { ...getProject(), ...p };
}

// ═══════════════════════════════════════
// Senior Toggle
// ═══════════════════════════════════════
export function SeniorToggle({
  onChange,
}: {
  onChange?: (senior: boolean) => void;
}) {
  const [senior, setSenior] = useState(false);

  useEffect(() => {
    setSenior(getProject().seniorMode);
  }, []);

  const toggle = () => {
    const next = !senior;
    setSenior(next);
    setProject({ seniorMode: next });
    onChange?.(next);
  };

  return (
    <button
      className={`${styles.seniorToggle} ${senior ? styles.seniorOn : ''}`}
      onClick={toggle}
      title={senior ? '시니어 모드 — 50+ 타겟 최적화' : '일반 모드'}
    >
      <span
        className={`${styles.seniorSwitch} ${senior ? styles.seniorSwitchOn : ''}`}
      >
        <span className={styles.seniorKnob} />
      </span>
      <span className={styles.seniorLabel}>
        {senior ? '👥 시니어' : '일반'}
      </span>
    </button>
  );
}

// ═══════════════════════════════════════
// Audience Meta (시니어/일반 차이)
// ═══════════════════════════════════════
export interface AudienceMeta {
  grade: string;
  cpm: string;
  retention: number;
  algoShield: number;
  bestTime: string;
  bestTimeReason: string;
  subtitlePx: number;
  ttsSpeed: string;
  badge: string;
}

export function getAudienceMeta(senior: boolean): AudienceMeta {
  if (senior) {
    return {
      grade: 'A+',
      cpm: '$15-22',
      retention: 82,
      algoShield: 93,
      bestTime: '내일 오전 7:00 ~ 8:30',
      bestTimeReason: '시니어 시청자 · 출근/산책 전 피크 시간대 · 예상 노출 +45%',
      subtitlePx: 72,
      ttsSpeed: '0.85x',
      badge: '👥 시니어 타겟 최적화',
    };
  }
  return {
    grade: 'A',
    cpm: '$12-18',
    retention: 70,
    algoShield: 87,
    bestTime: '내일 오후 8:00 ~ 9:30',
    bestTimeReason: '경제 카테고리 · 40-50대 시청자 피크 시간대 · 예상 노출 +31%',
    subtitlePx: 48,
    ttsSpeed: '1.0x',
    badge: '일반 타겟',
  };
}

// ═══════════════════════════════════════
// Senior Text Helpers
// ═══════════════════════════════════════

/**
 * 어려운 용어에 한자/영어 병기 자동 변환 (시니어 모드용)
 */
export function applySeniorText(text: string): string {
  const replacements: [RegExp, string][] = [
    [/급등(?!\()/g, '급등(急騰 · 갑자기 크게 오름)'],
    [/급락(?!\()/g, '급락(急落 · 갑자기 크게 내림)'],
    [/작전(?!\()/g, '작전(作戰)'],
    [/CPM(?!\()/g, 'CPM(시청 1,000회당 광고 수익)'],
    [/CTR(?!\()/g, 'CTR(클릭률)'],
    [/SEO(?!\()/g, 'SEO(검색 최적화)'],
    [/알고리즘(?!\()/g, '알고리즘(推薦 시스템)'],
    [/리딩방(?!\()/g, '리딩방(주식 정보 단체방)'],
    [/바이럴(?!\()/g, '바이럴(입소문으로 퍼짐)'],
    [/매집(?!\()/g, '매집(買集 · 몰래 사 모음)'],
    [/탈출(?!\()/g, '탈출(脫出 · 주가 정점에서 팔고 빠짐)'],
    [/단톡방(?!\()/g, '단톡방(단체 카톡방)'],
  ];
  let result = text;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * 시니어 모드용 썸네일 카피 (짧고 강렬하게)
 */
export function getSeniorThumbnail(normal: string): string {
  // 일반 모드: "400%의 환상 · 72시간의 침묵"
  // 시니어: 큰 글씨용으로 짧게
  return '72시간의\n침묵';
}
