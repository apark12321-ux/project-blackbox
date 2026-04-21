'use client';

/**
 * /create · 1단계 카테고리 선택
 * 스크린샷 참고: 5개 카테고리 카드 (CPM 뱃지)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V10Shell, setV10Project } from '../_shared/V10Shell';
import styles from './create.module.css';

interface Category {
  slug: string;
  label: string;
  icon: string;
  cpm: string;
  desc: string;
  gradient: string;
}

const CATEGORIES: Category[] = [
  {
    slug: 'economy',
    label: '경제',
    icon: '💰',
    cpm: '$12-18',
    desc: '주식·부동산·연금·절세',
    gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  },
  {
    slug: 'health',
    label: '건강',
    icon: '🏥',
    cpm: '$15-22',
    desc: '시니어·질병예방·의학상식',
    gradient: 'linear-gradient(135deg, #fecaca, #fca5a5)',
  },
  {
    slug: 'selfdev',
    label: '자기계발',
    icon: '🧠',
    cpm: '$8-14',
    desc: '습관·독서·마인드셋',
    gradient: 'linear-gradient(135deg, #e9d5ff, #c4b5fd)',
  },
  {
    slug: 'tech',
    label: 'IT',
    icon: '💻',
    cpm: '$10-16',
    desc: 'AI·앱·디지털 트렌드',
    gradient: 'linear-gradient(135deg, #bfdbfe, #93c5fd)',
  },
  {
    slug: 'life',
    label: '라이프',
    icon: '🌿',
    cpm: '$8-12',
    desc: '요리·여행·인테리어',
    gradient: 'linear-gradient(135deg, #bbf7d0, #86efac)',
  },
];

export default function CreatePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const cat = CATEGORIES.find(c => c.slug === selected);
    if (!cat) return;
    setV10Project({
      category: selected,
      categoryLabel: cat.label,
      step: 1,
    });
    router.push('/keyword');
  };

  return (
    <V10Shell step={0} title="뉴스 큐레이션" showStepDots={true}>
      <div className={styles.container}>
        {/* 단계 인디케이터 */}
        <div className={styles.stepBar}>
          <span className={`${styles.stepBarItem} ${styles.stepBarActive}`}>
            <span className={styles.stepBarNum}>1</span>
            <span>주제 설정</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={styles.stepBarNum}>2</span>
            <span>AI 처리 중</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={styles.stepBarNum}>3</span>
            <span>완성 & 다운로드</span>
          </span>
        </div>

        <h2 className={styles.title}>카테고리 선택</h2>
        <p className={styles.subtitle}>관심 분야를 선택하면 최적 키워드를 자동 추천합니다</p>

        <div className={styles.grid}>
          {CATEGORIES.map(cat => {
            const isSelected = selected === cat.slug;
            return (
              <button
                key={cat.slug}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                onClick={() => setSelected(cat.slug)}
              >
                <div className={styles.cardIcon} style={{ background: cat.gradient }}>
                  <span className={styles.cardEmoji}>{cat.icon}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{cat.label}</div>
                  <div className={styles.cardCpm}>{cat.cpm}</div>
                </div>
                <div className={styles.cardDesc}>{cat.desc}</div>
                {isSelected && <div className={styles.cardCheck}>✓</div>}
              </button>
            );
          })}
        </div>

        <button
          className={`${styles.nextBtn} ${!selected ? styles.nextBtnDisabled : ''}`}
          onClick={handleNext}
          disabled={!selected}
        >
          <span>🎬</span>
          <span>{selected ? '키워드 추천 받기' : '카테고리를 선택하세요'}</span>
          <span>→</span>
        </button>
      </div>
    </V10Shell>
  );
}
