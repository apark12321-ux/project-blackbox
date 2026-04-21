'use client';

/**
 * /keyword · 블루오션 키워드 선별 (v11 · 클린 화이트)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V11Shell, getProject, setProject } from '../_shared/V11Shell';
import styles from './keyword.module.css';

interface Keyword {
  id: string; keyword: string;
  boi: number; boiGrade: string;
  searchVol: number; competition: number;
  difficulty: '낮음' | '보통' | '높음';
  cpm: number; trend: '급상승' | '상승' | '유지' | '하락';
  estRev: number; why: string;
}

const KEYWORDS_BY_CAT: Record<string, Keyword[]> = {
  economy: [
    { id: 'e1', keyword: '주식 급등 작전', boi: 4.7, boiGrade: 'A+', searchVol: 12000, competition: 3200, difficulty: '낮음', cpm: 18, trend: '급상승', estRev: 6500, why: '개인투자자 피해 증가로 정보 수요 폭발' },
    { id: 'e2', keyword: '2026 기초연금 개편', boi: 4.5, boiGrade: 'A+', searchVol: 22000, competition: 5800, difficulty: '보통', cpm: 16, trend: '급상승', estRev: 9500, why: '연금 개편 앞두고 50대+ 관심 급증' },
    { id: 'e3', keyword: '부동산 양도세 계산', boi: 4.3, boiGrade: 'A', searchVol: 15000, competition: 6200, difficulty: '보통', cpm: 17, trend: '상승', estRev: 7800, why: '세법 개정으로 재계산 수요' },
    { id: 'e4', keyword: '코인 단타 심리', boi: 4.4, boiGrade: 'A', searchVol: 7800, competition: 4100, difficulty: '낮음', cpm: 16, trend: '급상승', estRev: 3700, why: '코인 변동성 확대로 관심 급증' },
    { id: 'e5', keyword: '연말정산 환급 극대화', boi: 3.9, boiGrade: 'A', searchVol: 28000, competition: 15500, difficulty: '높음', cpm: 14, trend: '유지', estRev: 11200, why: '1~2월 검색량 급증, 안정적' },
    { id: 'e6', keyword: '은퇴 자산 배분', boi: 4.1, boiGrade: 'A', searchVol: 5200, competition: 2800, difficulty: '낮음', cpm: 20, trend: '상승', estRev: 3100, why: '고CPM · 경쟁 적은 틈새' },
    { id: 'e7', keyword: '전세 대출 규제 2026', boi: 3.3, boiGrade: 'B+', searchVol: 14500, competition: 11200, difficulty: '높음', cpm: 13, trend: '하락', estRev: 5700, why: '정책 변화기 집중 수요' },
    { id: 'e8', keyword: '주식 세력 매집 패턴', boi: 4.5, boiGrade: 'A+', searchVol: 6800, competition: 2100, difficulty: '낮음', cpm: 17, trend: '급상승', estRev: 3500, why: 'AI 분석 관련 수요 폭증' },
    { id: 'e9', keyword: 'ETF 초보 가이드', boi: 3.8, boiGrade: 'A', searchVol: 19000, competition: 12000, difficulty: '보통', cpm: 15, trend: '상승', estRev: 7200, why: '2040 입문자 유입' },
    { id: 'e10', keyword: '부동산 경매 실전', boi: 4.2, boiGrade: 'A', searchVol: 11500, competition: 5400, difficulty: '보통', cpm: 18, trend: '상승', estRev: 5800, why: '금리 변화 물건 증가' },
    { id: 'e11', keyword: '퇴직금 받기 전 체크리스트', boi: 4.0, boiGrade: 'A', searchVol: 4800, competition: 1900, difficulty: '낮음', cpm: 19, trend: '상승', estRev: 2800, why: '50대 필수 · 고CPM' },
    { id: 'e12', keyword: '금 투자 2026 전망', boi: 3.7, boiGrade: 'A', searchVol: 9200, competition: 5100, difficulty: '보통', cpm: 15, trend: '상승', estRev: 3900, why: '안전자산 관심' },
  ],
  health: [
    { id: 'h1', keyword: '무릎 통증 완화 스트레칭', boi: 4.4, boiGrade: 'A', searchVol: 15000, competition: 6200, difficulty: '보통', cpm: 19, trend: '상승', estRev: 8600, why: '중장년 1순위 고통 · 수익 최상' },
    { id: 'h2', keyword: '치매 예방 7가지 습관', boi: 4.6, boiGrade: 'A+', searchVol: 9800, competition: 3400, difficulty: '낮음', cpm: 22, trend: '급상승', estRev: 6500, why: '50대+ 최대 공포 · 경쟁 적음' },
    { id: 'h3', keyword: '당뇨 수치 관리법', boi: 4.0, boiGrade: 'A', searchVol: 11200, competition: 6800, difficulty: '보통', cpm: 20, trend: '상승', estRev: 6700, why: '만성질환 1위' },
    { id: 'h4', keyword: '시니어 재취업 실전', boi: 4.4, boiGrade: 'A', searchVol: 4300, competition: 1500, difficulty: '낮음', cpm: 16, trend: '상승', estRev: 2100, why: '은퇴 후 수요 급증' },
    { id: 'h5', keyword: '혈압 관리 음식', boi: 4.2, boiGrade: 'A', searchVol: 13500, competition: 7200, difficulty: '보통', cpm: 18, trend: '상승', estRev: 6800, why: '고혈압 환자 1,200만 시장' },
    { id: 'h6', keyword: '하지정맥류 자가진단', boi: 4.3, boiGrade: 'A', searchVol: 5800, competition: 1800, difficulty: '낮음', cpm: 21, trend: '상승', estRev: 3100, why: '여성 시니어 · 높은 CPM' },
    { id: 'h7', keyword: '아침 공복 루틴', boi: 3.9, boiGrade: 'A', searchVol: 18000, competition: 10500, difficulty: '보통', cpm: 15, trend: '급상승', estRev: 6900, why: '웰빙 트렌드 · 전연령' },
    { id: 'h8', keyword: '갱년기 증상 완화', boi: 4.5, boiGrade: 'A+', searchVol: 8200, competition: 2900, difficulty: '낮음', cpm: 22, trend: '급상승', estRev: 4500, why: '4060 여성 필수' },
    { id: 'h9', keyword: '수면의 질 높이는 법', boi: 4.0, boiGrade: 'A', searchVol: 16000, competition: 8800, difficulty: '보통', cpm: 14, trend: '상승', estRev: 6400, why: '불면증 환자 급증' },
    { id: 'h10', keyword: '간 건강 검사 주기', boi: 3.8, boiGrade: 'A', searchVol: 6400, competition: 3200, difficulty: '보통', cpm: 19, trend: '상승', estRev: 3100, why: '건강검진 시즌 급증' },
    { id: 'h11', keyword: '어깨 회전근개 운동', boi: 4.1, boiGrade: 'A', searchVol: 7100, competition: 2700, difficulty: '낮음', cpm: 20, trend: '상승', estRev: 3600, why: '중장년 질환 증가' },
    { id: 'h12', keyword: '노안 늦추는 눈 운동', boi: 4.3, boiGrade: 'A', searchVol: 5500, competition: 1900, difficulty: '낮음', cpm: 18, trend: '상승', estRev: 2600, why: '40대+ 관심 급증 · 블루오션' },
  ],
  selfdev: [
    { id: 's1', keyword: '아침 루틴 5분', boi: 4.0, boiGrade: 'A', searchVol: 22000, competition: 14000, difficulty: '보통', cpm: 11, trend: '상승', estRev: 7300, why: '전연령 · 꾸준한 검색' },
    { id: 's2', keyword: '몰입 독서법 뇌과학', boi: 4.2, boiGrade: 'A', searchVol: 6800, competition: 2200, difficulty: '낮음', cpm: 12, trend: '상승', estRev: 2400, why: '저CPM이지만 안정적' },
    { id: 's3', keyword: '2분 룰 습관 만들기', boi: 4.4, boiGrade: 'A', searchVol: 4500, competition: 1200, difficulty: '낮음', cpm: 13, trend: '급상승', estRev: 1800, why: '제임스 클리어 영향' },
    { id: 's4', keyword: '시간관리 체크리스트', boi: 3.8, boiGrade: 'A', searchVol: 13500, competition: 8200, difficulty: '보통', cpm: 10, trend: '유지', estRev: 4100, why: '직장인 타겟 · 안정' },
    { id: 's5', keyword: '부자 마인드 습관', boi: 4.1, boiGrade: 'A', searchVol: 9800, competition: 4500, difficulty: '보통', cpm: 14, trend: '급상승', estRev: 4100, why: '경제+자기계발 교집합' },
    { id: 's6', keyword: '집중력 회복 테크닉', boi: 4.0, boiGrade: 'A', searchVol: 7500, competition: 3100, difficulty: '낮음', cpm: 11, trend: '상승', estRev: 2500, why: 'ADHD 트렌드' },
    { id: 's7', keyword: '새벽 기상 성공법', boi: 3.7, boiGrade: 'A', searchVol: 11000, competition: 6800, difficulty: '보통', cpm: 9, trend: '상승', estRev: 3000, why: '자기계발 클래식' },
    { id: 's8', keyword: '영어 공부 1년 로드맵', boi: 3.9, boiGrade: 'A', searchVol: 16000, competition: 9500, difficulty: '보통', cpm: 13, trend: '상승', estRev: 6200, why: '교육 광고주 선호' },
    { id: 's9', keyword: '디지털 디톡스 일주일', boi: 4.1, boiGrade: 'A', searchVol: 5200, competition: 1500, difficulty: '낮음', cpm: 14, trend: '급상승', estRev: 2200, why: '번아웃 탈출 트렌드' },
    { id: 's10', keyword: '작심삼일 극복법', boi: 4.2, boiGrade: 'A', searchVol: 8800, competition: 3800, difficulty: '낮음', cpm: 10, trend: '상승', estRev: 2800, why: '신년 시즌 폭증' },
    { id: 's11', keyword: 'N잡 부업 현실', boi: 4.3, boiGrade: 'A', searchVol: 12500, competition: 5800, difficulty: '보통', cpm: 16, trend: '급상승', estRev: 6000, why: '2030 핵심 관심사' },
    { id: 's12', keyword: '노후 준비 로드맵', boi: 4.5, boiGrade: 'A+', searchVol: 7200, competition: 2100, difficulty: '낮음', cpm: 18, trend: '상승', estRev: 3900, why: '4050 타겟 · 고CPM' },
  ],
  tech: [
    { id: 't1', keyword: 'AI 에이전트 활용법', boi: 4.6, boiGrade: 'A+', searchVol: 8200, competition: 2800, difficulty: '낮음', cpm: 15, trend: '급상승', estRev: 3700, why: 'AI 에이전트 붐 · 선점' },
    { id: 't2', keyword: '코딩 자동화 ChatGPT', boi: 4.3, boiGrade: 'A', searchVol: 5400, competition: 2100, difficulty: '낮음', cpm: 15, trend: '급상승', estRev: 2400, why: '개발자 타겟 · 경쟁 적음' },
    { id: 't3', keyword: 'AI 이미지 생성 실전', boi: 4.2, boiGrade: 'A', searchVol: 9500, competition: 4200, difficulty: '보통', cpm: 13, trend: '급상승', estRev: 3700, why: '디자인/마케팅 수요' },
    { id: 't4', keyword: '노코드 앱 만들기', boi: 4.4, boiGrade: 'A', searchVol: 6800, competition: 2300, difficulty: '낮음', cpm: 16, trend: '급상승', estRev: 3300, why: 'no-code 트렌드' },
    { id: 't5', keyword: '아이폰 숨은 기능', boi: 3.7, boiGrade: 'A', searchVol: 25000, competition: 18000, difficulty: '높음', cpm: 8, trend: '유지', estRev: 6000, why: '대중적 · 높은 검색' },
    { id: 't6', keyword: 'VS Code 확장 2026', boi: 4.0, boiGrade: 'A', searchVol: 4200, competition: 1400, difficulty: '낮음', cpm: 17, trend: '상승', estRev: 2100, why: '개발자 고CPM' },
    { id: 't7', keyword: 'MCP 서버 구축', boi: 4.5, boiGrade: 'A+', searchVol: 3100, competition: 600, difficulty: '낮음', cpm: 19, trend: '급상승', estRev: 2000, why: 'MCP 최신 기술 · 초블루오션' },
    { id: 't8', keyword: 'Claude vs GPT 비교', boi: 4.2, boiGrade: 'A', searchVol: 7800, competition: 3400, difficulty: '낮음', cpm: 14, trend: '급상승', estRev: 3300, why: 'AI 선택 고민 급증' },
    { id: 't9', keyword: '파이썬 자동화 스크립트', boi: 3.9, boiGrade: 'A', searchVol: 8500, competition: 5200, difficulty: '보통', cpm: 13, trend: '상승', estRev: 3300, why: '업무 자동화 수요' },
    { id: 't10', keyword: '챗GPT 프롬프트 템플릿', boi: 4.0, boiGrade: 'A', searchVol: 14000, competition: 8500, difficulty: '보통', cpm: 12, trend: '상승', estRev: 5000, why: '실용성 · 공유 잘됨' },
    { id: 't11', keyword: 'AI로 유튜브 자동화', boi: 4.6, boiGrade: 'A+', searchVol: 4800, competition: 1200, difficulty: '낮음', cpm: 18, trend: '급상승', estRev: 2900, why: '신흥 트렌드 · 초고CPM' },
    { id: 't12', keyword: '윈도우 11 속도 향상', boi: 3.8, boiGrade: 'A', searchVol: 11000, competition: 6800, difficulty: '보통', cpm: 9, trend: '유지', estRev: 3000, why: '대중적 수요' },
  ],
  life: [
    { id: 'l1', keyword: '1인 가구 자취 요리', boi: 3.8, boiGrade: 'A', searchVol: 28000, competition: 22000, difficulty: '높음', cpm: 8, trend: '유지', estRev: 6700, why: '대중적 · 꾸준한 수요' },
    { id: 'l2', keyword: '홈카페 인테리어 저예산', boi: 4.2, boiGrade: 'A', searchVol: 12500, competition: 5800, difficulty: '보통', cpm: 10, trend: '상승', estRev: 3800, why: 'SNS 감성 트렌드' },
    { id: 'l3', keyword: '제주도 3일 여행 코스', boi: 4.0, boiGrade: 'A', searchVol: 18000, competition: 11000, difficulty: '보통', cpm: 12, trend: '상승', estRev: 6500, why: '여행 CPM 양호' },
    { id: 'l4', keyword: '미니멀 라이프 실천', boi: 4.1, boiGrade: 'A', searchVol: 9500, competition: 4200, difficulty: '낮음', cpm: 11, trend: '상승', estRev: 3500, why: '지속가능 트렌드' },
    { id: 'l5', keyword: '에어프라이어 초간단', boi: 3.9, boiGrade: 'A', searchVol: 22000, competition: 14000, difficulty: '보통', cpm: 9, trend: '유지', estRev: 6000, why: '가전 보급 확대' },
    { id: 'l6', keyword: '원룸 수납 꿀팁', boi: 4.0, boiGrade: 'A', searchVol: 8200, competition: 3500, difficulty: '낮음', cpm: 10, trend: '상승', estRev: 2700, why: '1인 가구 필수' },
    { id: 'l7', keyword: '반려견 산책 주의사항', boi: 4.3, boiGrade: 'A', searchVol: 6500, competition: 1800, difficulty: '낮음', cpm: 13, trend: '상승', estRev: 2800, why: '반려동물 광고주 선호' },
    { id: 'l8', keyword: '캠핑 초보 체크리스트', boi: 4.1, boiGrade: 'A', searchVol: 10500, competition: 4800, difficulty: '보통', cpm: 14, trend: '상승', estRev: 4900, why: '아웃도어 성장' },
    { id: 'l9', keyword: '겨울 전기세 절약', boi: 4.2, boiGrade: 'A', searchVol: 15000, competition: 7200, difficulty: '보통', cpm: 10, trend: '급상승', estRev: 5000, why: '계절성 · 급증' },
    { id: 'l10', keyword: '요리 초보 레시피 10분', boi: 3.7, boiGrade: 'A', searchVol: 24000, competition: 16500, difficulty: '높음', cpm: 8, trend: '유지', estRev: 6400, why: '기초 수요 지속' },
    { id: 'l11', keyword: '다이소 추천템 2026', boi: 4.4, boiGrade: 'A', searchVol: 13500, competition: 5200, difficulty: '보통', cpm: 11, trend: '급상승', estRev: 4900, why: '가성비 트렌드' },
    { id: 'l12', keyword: '화분 식물 키우기', boi: 3.8, boiGrade: 'A', searchVol: 8800, competition: 4400, difficulty: '보통', cpm: 9, trend: '상승', estRev: 2600, why: '홈 가드닝 트렌드' },
  ],
};

type SortKey = 'boi' | 'cpm' | 'trend' | 'estRev';
const TREND_ORDER: Record<string, number> = { '급상승': 4, '상승': 3, '유지': 2, '하락': 1 };

export default function KeywordPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('boi');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getProject();
    if (!p.category) { router.replace('/create'); return; }
    setCategory(p.category);
    setCategoryLabel(p.categoryLabel || '');
    setTimeout(() => {
      setKeywords(KEYWORDS_BY_CAT[p.category!] || []);
      setLoading(false);
    }, 1200);
  }, [router]);

  const sorted = [...keywords].sort((a, b) => {
    if (sortKey === 'boi') return b.boi - a.boi;
    if (sortKey === 'cpm') return b.cpm - a.cpm;
    if (sortKey === 'trend') return TREND_ORDER[b.trend] - TREND_ORDER[a.trend];
    return b.estRev - a.estRev;
  });

  const handleNext = () => {
    if (!selected) return;
    const kw = keywords.find(k => k.id === selected);
    if (!kw) return;
    setProject({ keyword: kw.keyword, keywordData: kw, step: 2 });
    router.push('/configure');
  };

  const getDifficultyClass = (d: string) => d === '낮음' ? styles.diffLow : d === '보통' ? styles.diffMid : styles.diffHigh;
  const getTrendEmoji = (t: string) => t === '급상승' ? '🔥' : t === '상승' ? '📈' : t === '하락' ? '📉' : '➡️';

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
              경쟁도, CPM, 트렌드를 AI가 분석한 <strong>{keywords.length || 12}개</strong>의 추천 키워드
            </p>
          </div>

          {!loading && (
            <div className={styles.sortBar}>
              <span className={styles.sortLabel}>정렬:</span>
              <div className={styles.sortBtns}>
                {[
                  { k: 'boi' as const, label: '블루오션 점수' },
                  { k: 'cpm' as const, label: 'CPM' },
                  { k: 'trend' as const, label: '트렌드' },
                  { k: 'estRev' as const, label: '수익' },
                ].map(b => (
                  <button
                    key={b.k}
                    onClick={() => setSortKey(b.k)}
                    className={sortKey === b.k ? styles.sortBtnActive : ''}
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
              <div className={styles.loadingTitle}>AI가 시장을 분석 중</div>
              <div className={styles.loadingSub}>검색량 · 경쟁도 · CPM · 트렌드 종합 분석</div>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {sorted.map((kw, idx) => {
                  const isSelected = selected === kw.id;
                  return (
                    <button
                      key={kw.id}
                      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                      onClick={() => setSelected(kw.id)}
                    >
                      <div className={styles.cardTop}>
                        <span className={styles.cardRank}>#{idx + 1}</span>
                        <span className={styles.cardGrade}>{kw.boiGrade}</span>
                        <span className={styles.cardTrend}>{getTrendEmoji(kw.trend)} {kw.trend}</span>
                      </div>

                      <h3 className={styles.cardKeyword}>{kw.keyword}</h3>

                      <div className={styles.cardWhy}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.5-6.5l-1.5 1.5M7 17l-1.5 1.5m13 0L17 17m-10-10L5.5 5.5M12 7a5 5 0 0 1 5 5c0 2-1 3-1 5h-8c0-2-1-3-1-5a5 5 0 0 1 5-5z"/></svg>
                        <span>{kw.why}</span>
                      </div>

                      <div className={styles.boiBar}>
                        <div className={styles.boiFill} style={{ width: `${(kw.boi / 5) * 100}%` }} />
                      </div>
                      <div className={styles.boiMeta}>
                        <span>블루오션 점수</span>
                        <strong>{kw.boi.toFixed(1)}<span className={styles.boiOutOf}>/5.0</span></strong>
                      </div>

                      <div className={styles.stats}>
                        <div className={styles.stat}>
                          <div className={styles.statLabel}>월 검색</div>
                          <div className={styles.statValue}>
                            {kw.searchVol >= 10000 ? `${(kw.searchVol/1000).toFixed(0)}K` : kw.searchVol.toLocaleString()}
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

              <div className={styles.footer}>
                <button className={styles.btnBack} onClick={() => router.push('/create')}>
                  ← 카테고리 변경
                </button>
                <button
                  className={`${styles.btnNext} ${!selected ? styles.btnDisabled : ''}`}
                  onClick={handleNext}
                  disabled={!selected}
                >
                  {selected ? `"${keywords.find(k => k.id === selected)?.keyword}" 로 진행 →` : '키워드를 선택하세요'}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </V11Shell>
  );
}
