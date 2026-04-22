'use client';
/**
 * AlgoMaker v11 - /keyword 페이지
 * ✨ 실제 API 연결 버전 (Mock 데이터 제거)
 * 
 * 백엔드: https://project-blackbox-production.up.railway.app
 * API: POST /api/v1/curation/keywords/search
 *      (실패 시 POST /api/keyword-analyze 로 자동 전환)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import styles from './keyword.module.css';

// 백엔드 주소 (환경변수 우선, 없으면 하드코딩 fallback)
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://project-blackbox-production.up.railway.app';

// 카테고리 라벨 ↔ 영문 키 매핑
const CATEGORY_MAP: Record<string, string> = {
  economy: '경제',
  health: '건강',
  selfdev: '자기계발',
  tech: 'IT',
  life: '라이프',
};

const CATEGORY_SLUGS = Object.keys(CATEGORY_MAP);

interface Keyword {
  id: string;
  keyword: string;
  boi: number;
  boiGrade: string;
  searchVol: number;
  competition: number;
  difficulty: '낮음' | '보통' | '높음';
  cpm: number;
  trend: '급상승' | '상승' | '유지' | '하락';
  estRev: number;
}

type SortKey = 'boi' | 'cpm' | 'trend' | 'estRev';
const TREND_ORDER: Record<string, number> = {
  급상승: 4,
  상승: 3,
  유지: 2,
  하락: 1,
};

export default function KeywordPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('');
  const [categoryLabel, setCategoryLabel] = useState<string>('');
  const [selected, setSelected] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('boi');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 프로젝트에서 선택된 카테고리 불러오기
  useEffect(() => {
    const p = getProject();
    if (!p.category) {
      router.replace('/create');
      return;
    }
    setCategory(p.category);
    setCategoryLabel(CATEGORY_MAP[p.category] || p.category);
    fetchKeywords(p.category);
     
  }, [router]);

  // ✨ 실제 API 호출 (백엔드에서 진짜 키워드 데이터 받아옴)
  const fetchKeywords = async (cat: string) => {
    setLoading(true);
    setError('');
    
    const categoryKorean = CATEGORY_MAP[cat] || cat;
    
    // ① 먼저 Module A curation API 시도
    try {
      const res = await fetch(`${API_BASE}/api/v1/curation/keywords/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          category_slug: cat,
          category_label: categoryKorean,
          limit: 8,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const parsed = parseKeywords(data);
        if (parsed.length > 0) {
          setKeywords(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('curation API 실패, beta API로 재시도', e);
    }

    // ② 실패하면 beta keyword-analyze API 시도
    try {
      const res = await fetch(`${API_BASE}/api/keyword-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          category_label: categoryKorean,
          limit: 8,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const parsed = parseKeywords(data);
        if (parsed.length > 0) {
          setKeywords(parsed);
          setLoading(false);
          return;
        }
      }
      
      throw new Error(`API 응답 실패 (${res.status})`);
    } catch (e: any) {
      console.error('키워드 API 호출 실패:', e);
      setError(`AI 분석 중 문제가 발생했어요. 잠시 후 다시 시도해주세요. (${e.message || '네트워크 오류'})`);
      setKeywords([]);
      setLoading(false);
    }
  };

  // 백엔드 응답을 프론트 형식으로 파싱
  const parseKeywords = (data: any): Keyword[] => {
    // 응답 형식이 다양할 수 있어서 유연하게 파싱
    let list: any[] = [];
    
    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data.keywords)) {
      list = data.keywords;
    } else if (Array.isArray(data.results)) {
      list = data.results;
    } else if (Array.isArray(data.data)) {
      list = data.data;
    } else if (Array.isArray(data.items)) {
      list = data.items;
    }
    
    if (list.length === 0) return [];
    
    return list.slice(0, 8).map((item: any, idx: number) => {
      const keyword = item.keyword || item.name || item.title || item.query || `키워드${idx + 1}`;
      const boi = typeof item.boi === 'number' ? item.boi : (item.blueocean_score || item.score || 4.0);
      const searchVol = item.searchVol || item.search_volume || item.volume || item.monthly_volume || 10000;
      const competition = item.competition || item.comp || 5000;
      const cpm = item.cpm || item.cost_per_mille || 15;
      const trendRaw = item.trend || item.trend_label || '상승';
      const difficultyRaw = item.difficulty || item.diff || '보통';
      const estRev = item.estRev || item.estimated_revenue || item.rev || Math.round(cpm * searchVol / 1000);
      
      return {
        id: item.id || `kw-${idx}`,
        keyword,
        boi: Number(boi),
        boiGrade: item.boiGrade || item.grade || gradeFromBoi(Number(boi)),
        searchVol: Number(searchVol),
        competition: Number(competition),
        difficulty: normalizeDifficulty(difficultyRaw),
        cpm: Number(cpm),
        trend: normalizeTrend(trendRaw),
        estRev: Number(estRev),
      };
    });
  };

  const gradeFromBoi = (b: number): string => {
    if (b >= 4.5) return 'A+';
    if (b >= 4.0) return 'A';
    if (b >= 3.5) return 'B+';
    if (b >= 3.0) return 'B';
    return 'C';
  };

  const normalizeTrend = (t: string): Keyword['trend'] => {
    const s = String(t);
    if (s.includes('급상승') || s.includes('급등')) return '급상승';
    if (s.includes('상승') || s.includes('up')) return '상승';
    if (s.includes('하락') || s.includes('down')) return '하락';
    return '유지';
  };

  const normalizeDifficulty = (d: string): Keyword['difficulty'] => {
    const s = String(d);
    if (s.includes('낮') || s.includes('low')) return '낮음';
    if (s.includes('높') || s.includes('high')) return '높음';
    return '보통';
  };

  const sorted = [...keywords].sort((a, b) => {
    if (sortKey === 'boi') return b.boi - a.boi;
    if (sortKey === 'cpm') return b.cpm - a.cpm;
    if (sortKey === 'trend') return TREND_ORDER[b.trend] - TREND_ORDER[a.trend];
    return b.estRev - a.estRev;
  });

  const handleNext = () => {
    if (!selected) return;
    const kw = keywords.find((k) => k.id === selected);
    if (!kw) return;
    setProject({ keyword: kw.keyword, keywordData: kw, step: 2 });
    router.push('/configure');
  };

  const getDifficultyClass = (d: string) =>
    d === '낮음' ? styles.diffLow : d === '보통' ? styles.diffMid : styles.diffHigh;
  
  const getTrendEmoji = (t: string) =>
    t === '급상승' ? '🔥' : t === '상승' ? '📈' : t === '유지' ? '➡️' : '📉';

  return (
    <V11Shell currentStep={2}>
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.eyebrow}>STEP 2 · 키워드 선별</div>
            <h1 className={styles.title}>
              <span className={styles.titleCat}>{categoryLabel}</span> 블루오션 키워드
            </h1>
            <p className={styles.sub}>
              AI가 실시간으로 분석한 <strong>블루오션 점수 상위 키워드</strong>입니다.
            </p>
          </div>

          {!loading && !error && keywords.length > 0 && (
            <div className={styles.sortBar}>
              <span className={styles.sortLabel}>정렬 →</span>
              <div className={styles.sortBtns}>
                {([
                  { k: 'boi' as const, label: '블루오션 점수↓' },
                  { k: 'cpm' as const, label: 'CPM↓' },
                  { k: 'trend' as const, label: '트렌드↓' },
                  { k: 'estRev' as const, label: '수익↓' },
                ]).map((b) => (
                  <button
                    key={b.k}
                    onClick={() => setSortKey(b.k)}
                    className={`${styles.sortBtn} ${sortKey === b.k ? styles.sortBtnActive : ''}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <div className={styles.loadingTitle}>AI가 실시간 분석 중...</div>
              <div className={styles.loadingSub}>
                {categoryLabel} 카테고리 · 검색량 · CPM · 트렌드 데이터 수집
              </div>
            </div>
          ) : error ? (
            <div className={styles.errorBox}>
              <div className={styles.errorIcon}>⚠️</div>
              <div className={styles.errorTitle}>분석 실패</div>
              <div className={styles.errorMsg}>{error}</div>
              <button
                onClick={() => fetchKeywords(category)}
                className={styles.retryBtn}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {sorted.map((kw) => {
                const isSelected = selected === kw.id;
                return (
                  <button
                    key={kw.id}
                    className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                    onClick={() => setSelected(kw.id)}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.cardNo}>#{sorted.indexOf(kw) + 1}</span>
                      <span className={styles.cardGrade}>{kw.boiGrade}</span>
                      <span className={styles.cardTrend}>{getTrendEmoji(kw.trend)} {kw.trend}</span>
                    </div>

                    <h3 className={styles.cardKeyword}>{kw.keyword}</h3>

                    <div className={styles.boiBar}>
                      <div
                        className={styles.boiFill}
                        style={{ width: `${(kw.boi / 5) * 100}%` }}
                      />
                    </div>
                    <div className={styles.boiMeta}>
                      <span>블루오션 점수</span>
                      <strong>{kw.boi.toFixed(1)}/5.0</strong>
                    </div>

                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <div className={styles.statLabel}>월 검색량</div>
                        <div className={styles.statValue}>
                          {kw.searchVol >= 10000
                            ? `${(kw.searchVol / 10000).toFixed(1)}만`
                            : kw.searchVol.toLocaleString()}
                        </div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statLabel}>CPM</div>
                        <div className={styles.statValueBlue}>${kw.cpm}</div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statLabel}>경쟁</div>
                        <div className={`${styles.statBadge} ${getDifficultyClass(kw.difficulty)}`}>
                          {kw.difficulty}
                        </div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statLabel}>예상 월수익</div>
                        <div className={styles.statValueGreen}>${kw.estRev.toLocaleString()}</div>
                      </div>
                    </div>

                    {isSelected && <div className={styles.cardCheck}>✓</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnBack}
            onClick={() => router.push('/create')}
          >
            ← 카테고리 변경
          </button>
          <button
            className={`${styles.btnNext} ${selected ? '' : styles.btnDisabled}`}
            onClick={handleNext}
            disabled={!selected}
          >
            {selected
              ? `"${keywords.find((k) => k.id === selected)?.keyword}"로 진행 →`
              : '키워드를 선택하세요'}
          </button>
        </div>
      </section>
    </V11Shell>
  );
}
