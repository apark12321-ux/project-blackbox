'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, setProject } from '../_shared/V11Shell';
import styles from './create.module.css';

interface Category {
  slug: string;
  label: string;
  icon: string;
  cpm: string;
  desc: string;
}

const CATEGORIES: Category[] = [
  { slug: 'economy',  label: '경제',     icon: '💰', cpm: '$12-18', desc: '주식·부동산·연금·절세' },
  { slug: 'health',   label: '건강',     icon: '🏥', cpm: '$15-22', desc: '시니어·질병예방·의학상식' },
  { slug: 'selfdev',  label: '자기계발', icon: '🧠', cpm: '$8-14',  desc: '습관·독서·마인드셋' },
  { slug: 'tech',     label: 'IT',       icon: '💻', cpm: '$10-16', desc: 'AI·앱·디지털 트렌드' },
  { slug: 'life',     label: '라이프',   icon: '🌿', cpm: '$8-12',  desc: '요리·여행·인테리어' },
];

export default function CreatePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const cat = CATEGORIES.find(c => c.slug === selected);
    if (!cat) return;
    setProject({
      category: selected,
      categoryLabel: cat.label,
      step: 1,
    });
    router.push('/keyword');
  };

  return (
    <V11Shell currentStep={1}>
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.eyebrow}>STEP 1 · 카테고리</div>
            <h1 className={styles.title}>관심 분야를 선택하세요</h1>
            <p className={styles.sub}>선택한 카테고리의 <strong>블루오션 키워드 12개</strong>를 AI가 추천합니다</p>
          </div>

          <div className={styles.grid}>
            {CATEGORIES.map(cat => {
              const isSelected = selected === cat.slug;
              return (
                <button
                  key={cat.slug}
                  className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                  onClick={() => setSelected(cat.slug)}
                >
                  <div className={styles.cardIcon}>{cat.icon}</div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardLabel}>{cat.label}</div>
                    <div className={styles.cardDesc}>{cat.desc}</div>
                  </div>
                  <div className={styles.cardCpm}>
                    <span className={styles.cardCpmLabel}>예상 CPM</span>
                    <span className={styles.cardCpmValue}>{cat.cpm}</span>
                  </div>
                  {isSelected && <div className={styles.cardCheck}>✓</div>}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button
              className={`${styles.btnNext} ${!selected ? styles.btnDisabled : ''}`}
              onClick={handleNext}
              disabled={!selected}
            >
              {selected ? '키워드 추천 받기 →' : '카테고리를 선택하세요'}
            </button>
          </div>
        </div>
      </section>
    </V11Shell>
  );
}
