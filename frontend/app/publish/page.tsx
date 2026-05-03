'use client';

/**
 * AlgoMaker 자료 만들기 v13.0 - 영상 구조 시각화 + 노하우 스며든 디자인
 *
 * 박 대표님 v13.0 큰 그림:
 *   "단계별 다 없애고 다시 리모델링"
 *   "영상 구조를 시각화 잘해서 다양한 구성으로"
 *   "알고메이커의 특별한 부분, 알고리즘 반영, 노하우가 스며들어있구나"
 *   "반할 정도로"
 *
 * 핵심 변화 (v12 → v13):
 *   ✅ 1️⃣2️⃣3️⃣4️⃣ 단계 번호 모두 제거
 *   ✅ 영상 타임라인 시각화 (00:00 → 8:00 까지 비트 흐름)
 *   ✅ 각 비트에 노하우가 자연스럽게 스며듦 (별도 박스 X)
 *   ✅ 시나리오 패턴별 다른 구성 (호기심형 4구간 / 단계별 5구간 등)
 *   ✅ 시각적 영상 미리보기 느낌 (썸네일 영역, 타임코드, 비트 카드)
 *   ✅ 노하우 적용 인디케이터 (각 비트 옆에 스티커형)
 *
 * 박 대표님 자산 100% 활용:
 *   - contentEngine.ts 그대로 호출
 *   - v650Adapter.ts → generateV650Data 호출
 *   - CinematicScenarioDisplay, CinematicPromptDisplay 그대로
 *   - V11Shell, algorithmInsights 그대로
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import {
  generateTitles,
  generateVideoSequences,
  bumpSeed,
} from '../_shared/contentEngine';
import { generateV650Data, type V650DataPackage } from '../_shared/v650Adapter';
import { CinematicScenarioDisplay } from '../_shared/CinematicScenarioDisplay_v6_5_0';
import { CinematicPromptDisplay } from '../_shared/CinematicPromptDisplay_v6_5_0';
import { getAlgorithmInsights } from '../_shared/algorithmInsights';

// ============================================================
// 시나리오 패턴 8가지
// ============================================================
const SCENARIO_PATTERNS: Record<string, {
  emoji: string;
  name: string;
  desc: string;
  flow: string;
  // 시나리오 패턴별 영상 구간 (시각화용)
  structure: Array<{ time: string; label: string; algoTags: string[] }>;
}> = {
  curiosity: {
    emoji: '🤔', name: '호기심 자극형',
    desc: '시청자의 궁금증을 유발하는 구조',
    flow: '문제 제기 → 단서 제공 → 핵심 공개',
    structure: [
      { time: '0:00', label: '문제 제기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '단서 제공', algoTags: ['몰입 강화'] },
      { time: '2:00', label: '추가 단서', algoTags: ['긴장 유지'] },
      { time: '5:00', label: '핵심 공개', algoTags: ['만족도', '댓글유도'] },
      { time: '7:00', label: '마무리·CTA', algoTags: ['최종화면', '재생목록'] },
    ],
  },
  tutorial: {
    emoji: '📋', name: '단계별 가이드',
    desc: '따라하기 쉬운 단계별 설명',
    flow: '도입 → 1단계 → 2단계 → 마무리',
    structure: [
      { time: '0:00', label: '도입·결과 미리보기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '1단계: 준비', algoTags: ['시각화'] },
      { time: '2:00', label: '2단계: 실행', algoTags: ['디테일'] },
      { time: '4:30', label: '3단계: 마무리', algoTags: ['검증'] },
      { time: '7:00', label: '요약·CTA', algoTags: ['댓글유도', '최종화면'] },
    ],
  },
  review: {
    emoji: '⚖️', name: '리뷰·비교',
    desc: '제품·서비스 비교 분석',
    flow: '소개 → 장점 → 단점 → 결론',
    structure: [
      { time: '0:00', label: '대상 소개', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '장점 분석', algoTags: ['데이터'] },
      { time: '3:30', label: '단점·아쉬움', algoTags: ['솔직함'] },
      { time: '5:30', label: '비교 정리', algoTags: ['시각화'] },
      { time: '7:30', label: '결론·추천', algoTags: ['댓글유도'] },
    ],
  },
  storytelling: {
    emoji: '📖', name: '스토리텔링',
    desc: '경험담 기반 자연스러운 흐름',
    flow: '시작 → 갈등 → 해결 → 교훈',
    structure: [
      { time: '0:00', label: '시작·배경', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '갈등·문제', algoTags: ['공감'] },
      { time: '3:30', label: '시도·실패', algoTags: ['솔직함'] },
      { time: '5:30', label: '해결·전환점', algoTags: ['감동'] },
      { time: '7:00', label: '교훈·CTA', algoTags: ['댓글유도'] },
    ],
  },
  list: {
    emoji: '🔢', name: '리스트형',
    desc: 'BEST/TOP 형식 모음',
    flow: '인트로 → 1위 → 2위 → 3위 → 정리',
    structure: [
      { time: '0:00', label: '인트로·미리보기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '5위 → 4위', algoTags: ['긴장'] },
      { time: '2:30', label: '3위 → 2위', algoTags: ['몰입'] },
      { time: '5:00', label: '1위 공개', algoTags: ['클라이맥스', '저장유도'] },
      { time: '7:00', label: '정리·CTA', algoTags: ['댓글유도'] },
    ],
  },
  qna: {
    emoji: '💬', name: 'Q&A형',
    desc: '질문-답변 형식',
    flow: '질문 → 답변 → 부연 설명',
    structure: [
      { time: '0:00', label: '질문 1 + 답변', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:30', label: '질문 2 + 답변', algoTags: ['검색최적화'] },
      { time: '3:30', label: '질문 3 + 답변', algoTags: ['디테일'] },
      { time: '5:30', label: '심화 질문', algoTags: ['전문성'] },
      { time: '7:30', label: '추가 질문 받기·CTA', algoTags: ['댓글유도'] },
    ],
  },
  mistake: {
    emoji: '⚠️', name: '실수·후회형',
    desc: '경험자의 후회담은 가장 강력한 신호',
    flow: '실수 공개 → 원인 → 해결책 → 교훈',
    structure: [
      { time: '0:00', label: '실수 공개·후회', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '실수의 원인', algoTags: ['공감'] },
      { time: '3:00', label: '잘못된 정보 정정', algoTags: ['신뢰'] },
      { time: '5:00', label: '올바른 방법', algoTags: ['해결책', '저장유도'] },
      { time: '7:00', label: '교훈·CTA', algoTags: ['댓글유도'] },
    ],
  },
  data: {
    emoji: '📊', name: '데이터·분석형',
    desc: '데이터 기반 신뢰감 + 검색 강함',
    flow: '주제 → 데이터 → 인사이트 → 결론',
    structure: [
      { time: '0:00', label: '주제·문제 제기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '데이터 1', algoTags: ['시각화'] },
      { time: '3:00', label: '데이터 2', algoTags: ['검증'] },
      { time: '5:00', label: '인사이트 도출', algoTags: ['분석'] },
      { time: '7:00', label: '결론·예측·CTA', algoTags: ['댓글유도'] },
    ],
  },
};

// ============================================================
// 분야 라벨
// ============================================================
const CATEGORY_LABELS: Record<string, { name: string; emoji: string }> = {
  food:        { name: '음식·요리',     emoji: '🍳' },
  realestate:  { name: '부동산',        emoji: '🏠' },
  economy:     { name: '경제·재테크',   emoji: '💰' },
  health:      { name: '건강',          emoji: '💪' },
  fitness:     { name: '운동·다이어트', emoji: '🏃' },
  language:    { name: '외국어 학습',   emoji: '🌐' },
  selfdev:     { name: '자기계발',      emoji: '📚' },
  aitech:      { name: 'AI·기술',       emoji: '🤖' },
  senior:      { name: '시니어',        emoji: '👔' },
  travel:      { name: '여행',          emoji: '✈️' },
  family:      { name: '가족·관계',     emoji: '👨‍👩‍👧' },
  general:     { name: '일반',          emoji: '📌' },
};

// 노하우 태그 → 색상/툴팁
const ALGO_TAG_INFO: Record<string, { color: string; bg: string; tooltip: string }> = {
  '후크':        { color: '#c2410c', bg: '#fff7ed', tooltip: '첫 30초 후크 패턴' },
  '음성SEO':     { color: '#0369a1', bg: '#f0f9ff', tooltip: '키워드 직접 발음 (음성 검색 데이터)' },
  '챕터':        { color: '#15803d', bg: '#f0fdf4', tooltip: '00:00 시작 + 5~7개 챕터' },
  '댓글유도':    { color: '#9f1239', bg: '#fff1f2', tooltip: '참여 지표 ↑ 알고리즘 추천 ↑' },
  '저장유도':    { color: '#7c3aed', bg: '#faf5ff', tooltip: '저장률 = 가치 신호' },
  '최종화면':    { color: '#0d9488', bg: '#f0fdfa', tooltip: '관련 영상 + 구독 버튼' },
  '재생목록':    { color: '#0891b2', bg: '#ecfeff', tooltip: '연쇄 시청 유도' },
  '시각화':      { color: '#ca8a04', bg: '#fefce8', tooltip: '이미지·그래프로 이해 ↑' },
  '몰입 강화':   { color: '#7e22ce', bg: '#faf5ff', tooltip: '시청 지속률 ↑' },
  '긴장 유지':   { color: '#a21caf', bg: '#fdf4ff', tooltip: '이탈률 ↓' },
  '클라이맥스':  { color: '#dc2626', bg: '#fef2f2', tooltip: '최고 시청 구간' },
  '만족도':      { color: '#16a34a', bg: '#f0fdf4', tooltip: '시청 후 만족도 = 추천 ↑' },
  '솔직함':      { color: '#65a30d', bg: '#f7fee7', tooltip: '경험담 = 신뢰' },
  '데이터':      { color: '#0891b2', bg: '#ecfeff', tooltip: '데이터 기반 = 신뢰' },
  '검증':        { color: '#0d9488', bg: '#f0fdfa', tooltip: '출처·근거 명시' },
  '디테일':      { color: '#a16207', bg: '#fefce8', tooltip: '구체성 = 가치' },
  '공감':        { color: '#be185d', bg: '#fdf2f8', tooltip: '시청자 공감 → 댓글 ↑' },
  '감동':        { color: '#be123c', bg: '#fff1f2', tooltip: '감정 자극 = 공유 ↑' },
  '검색최적화':  { color: '#1d4ed8', bg: '#eff6ff', tooltip: 'SEO 키워드 배치' },
  '전문성':      { color: '#4338ca', bg: '#eef2ff', tooltip: '권위·신뢰' },
  '신뢰':        { color: '#0e7490', bg: '#ecfeff', tooltip: '진정성 = 구독 ↑' },
  '해결책':      { color: '#15803d', bg: '#f0fdf4', tooltip: '실행 가능한 답' },
  '분석':        { color: '#1d4ed8', bg: '#eff6ff', tooltip: '논리적 흐름' },
};

function getInsightsSafe(keyword: string, categoryId: string) {
  try {
    return (getAlgorithmInsights as any)(keyword, categoryId) || null;
  } catch { return null; }
}

// ============================================================
// 메인 페이지 컴포넌트
// ============================================================
export default function PublishPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PublishContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <V11Shell>
      <div style={{ padding: 60, textAlign: 'center', color: '#737373' }}>
        영상 자료 만드는 중...
      </div>
    </V11Shell>
  );
}

function PublishContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'general';
  const scenarioId = searchParams.get('scenario') || 'tutorial';
  const seedParam = searchParams.get('seed');

  const [seed, setSeed] = useState<number>(() => {
    if (seedParam) return parseInt(seedParam, 10);
    return Math.floor(Math.random() * 1000000);
  });

  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [section, setSection] = useState<'structure' | 'titles' | 'prompts'>('structure');

  useEffect(() => {
    if (!keyword.trim()) router.replace('/');
  }, [keyword, router]);

  const scenario = SCENARIO_PATTERNS[scenarioId] || SCENARIO_PATTERNS.tutorial;
  const category = CATEGORY_LABELS[categoryId] || CATEGORY_LABELS.general;

  const data = useMemo(() => {
    if (!keyword.trim()) return null;
    try {
      const titles = generateTitles(keyword, scenarioId, categoryId);
      const sequences = generateVideoSequences(keyword, scenarioId);
      return { titles, sequences };
    } catch (e) {
      console.error(e);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryId, scenarioId, seed]);

  const v650Data: V650DataPackage | null = useMemo(() => {
    if (!keyword.trim()) return null;
    try {
      return generateV650Data(keyword, scenarioId, categoryId);
    } catch (e) {
      console.error(e);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryId, scenarioId, seed]);

  const insights = useMemo(() => getInsightsSafe(keyword, categoryId), [keyword, categoryId]);

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      });
    }
  };

  const regenerateAll = () => setSeed(bumpSeed(seed));

  if (!keyword.trim()) return null;

  // 활성 비트 정보
  const activeBeatInfo = scenario.structure[activeBeat] || scenario.structure[0];
  const activeSequence = data?.sequences?.[activeBeat] || null;

  return (
    <V11Shell>
      <div className="v13-page">
        {/* ============================================ */}
        {/* 헤더: 영상 메타 정보 */}
        {/* ============================================ */}
        <header className="v13-header">
          <Link href="/" className="v13-back">← 메인으로</Link>

          <div className="v13-kicker">
            <span className="v13-kicker-arrow">▍</span>
            알고리즘 노하우 자동 적용 영상 자료
          </div>

          <h1 className="v13-title">
            <span className="v13-title-emoji">{scenario.emoji}</span>
            <span className="v13-title-text">{scenario.name}</span>
          </h1>

          <div className="v13-meta">
            <div className="v13-meta-row">
              <div className="v13-meta-item">
                <div className="v13-meta-label">키워드</div>
                <div className="v13-meta-value">{keyword}</div>
              </div>
              <div className="v13-meta-item">
                <div className="v13-meta-label">분야</div>
                <div className="v13-meta-value">{category.emoji} {category.name}</div>
              </div>
              <div className="v13-meta-item">
                <div className="v13-meta-label">영상 흐름</div>
                <div className="v13-meta-value">{scenario.flow}</div>
              </div>
            </div>
          </div>

          <button type="button" className="v13-regen-btn" onClick={regenerateAll}>
            ↻ 다른 버전 만들기
          </button>
        </header>

        {/* ============================================ */}
        {/* 영상 타임라인 시각화 (HERO) */}
        {/* ============================================ */}
        <section className="v13-timeline-section">
          <div className="v13-timeline-head">
            <div className="v13-timeline-title">
              <span className="v13-tl-icon">🎬</span>
              <span>영상 구조</span>
              <span className="v13-tl-sub">— 클릭하여 각 구간의 시나리오와 적용된 노하우 확인</span>
            </div>
          </div>

          {/* 타임라인 비트 */}
          <div className="v13-timeline">
            <div className="v13-timeline-bar">
              <div
                className="v13-timeline-bar-fill"
                style={{ width: `${((activeBeat + 1) / scenario.structure.length) * 100}%` }}
              />
            </div>

            <div className="v13-beats">
              {scenario.structure.map((beat, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`v13-beat ${activeBeat === idx ? 'active' : ''}`}
                  onClick={() => setActiveBeat(idx)}
                >
                  <div className="v13-beat-time">{beat.time}</div>
                  <div className="v13-beat-dot">
                    <div className="v13-beat-dot-inner" />
                  </div>
                  <div className="v13-beat-label">{beat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 활성 비트 상세 */}
          <div className="v13-beat-detail">
            <div className="v13-beat-detail-head">
              <div className="v13-beat-detail-time">{activeBeatInfo.time}</div>
              <div className="v13-beat-detail-label">{activeBeatInfo.label}</div>
            </div>

            {/* 적용된 노하우 태그 (스며드는 형태) */}
            <div className="v13-algo-tags">
              {activeBeatInfo.algoTags.map((tag, i) => {
                const info = ALGO_TAG_INFO[tag] || { color: '#525252', bg: '#fafafa', tooltip: '' };
                return (
                  <div
                    key={i}
                    className="v13-algo-tag"
                    style={{ color: info.color, background: info.bg, borderColor: info.color }}
                    title={info.tooltip}
                  >
                    <span className="v13-algo-tag-check">✓</span>
                    {tag}
                  </div>
                );
              })}
            </div>

            {/* 비트 시나리오 (contentEngine 결과) */}
            {activeSequence && (
              <div className="v13-beat-script">
                <div className="v13-beat-script-label">시나리오 멘트</div>
                <p className="v13-beat-script-text">{activeSequence.script || ''}</p>

                {activeSequence.purpose && (
                  <div className="v13-beat-purpose">
                    <span className="v13-beat-purpose-label">목적</span>
                    {activeSequence.purpose}
                  </div>
                )}

                {activeSequence.tip && (
                  <div className="v13-beat-tip">
                    {activeSequence.tip}
                  </div>
                )}

                <button
                  type="button"
                  className={`v13-copy-btn ${copied === `seq-${activeBeat}` ? 'copied' : ''}`}
                  onClick={() => copy(activeSequence.script || '', `seq-${activeBeat}`)}
                >
                  {copied === `seq-${activeBeat}` ? '✓ 복사됨' : '📋 이 구간 멘트 복사'}
                </button>
              </div>
            )}

            {/* 첫 번째 비트일 경우 음성 SEO 가이드 자연스럽게 */}
            {activeBeat === 0 && (
              <div className="v13-beat-hint">
                <div className="v13-beat-hint-icon">💡</div>
                <div>
                  <strong>음성 SEO 적용 중:</strong>
                  이 구간 30초 안에 "{keyword}" 키워드를 직접 발음하시면
                  유튜브 자동 자막이 검색 데이터로 인식해 노출이 ↑ 됩니다.
                </div>
              </div>
            )}

            {/* 마지막 비트일 경우 댓글 유도 가이드 */}
            {activeBeat === scenario.structure.length - 1 && insights?.questions && (
              <div className="v13-beat-hint">
                <div className="v13-beat-hint-icon">💬</div>
                <div>
                  <strong>댓글 유도 질문 추천:</strong>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                    {insights.questions.slice(0, 2).map((q: string, i: number) => (
                      <li key={i} style={{ fontSize: 12.5, lineHeight: 1.55 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================ */}
        {/* 섹션 전환 탭 */}
        {/* ============================================ */}
        <div className="v13-tabs">
          <button
            type="button"
            className={`v13-tab ${section === 'structure' ? 'active' : ''}`}
            onClick={() => setSection('structure')}
          >
            <span className="v13-tab-emoji">🎬</span>
            <span className="v13-tab-label">전체 시나리오</span>
          </button>
          <button
            type="button"
            className={`v13-tab ${section === 'titles' ? 'active' : ''}`}
            onClick={() => setSection('titles')}
          >
            <span className="v13-tab-emoji">📝</span>
            <span className="v13-tab-label">제목 후보</span>
          </button>
          <button
            type="button"
            className={`v13-tab ${section === 'prompts' ? 'active' : ''}`}
            onClick={() => setSection('prompts')}
          >
            <span className="v13-tab-emoji">🎨</span>
            <span className="v13-tab-label">AI 영상 프롬프트</span>
          </button>
        </div>

        {/* ============================================ */}
        {/* 섹션별 콘텐츠 */}
        {/* ============================================ */}
        {section === 'structure' && v650Data && (
          <div className="v13-section">
            <CinematicScenarioDisplay scenario={v650Data.scenario} />
          </div>
        )}

        {section === 'titles' && data?.titles && (
          <div className="v13-section">
            <div className="v13-titles-head">
              <div className="v13-titles-title">제목 후보 3개</div>
              <div className="v13-titles-tip">
                ✓ 8:2 법칙 적용 · 검색 키워드 80% + 후킹 문구 20%
              </div>
            </div>
            <div className="v13-titles">
              {data.titles.map((t: any, i: number) => {
                const titleText = typeof t === 'string' ? t : (t?.title || '');
                return (
                  <div key={i} className="v13-title-card">
                    <div className="v13-title-head">
                      <div className="v13-title-num">제목 {i + 1}</div>
                      {t?.pattern && (
                        <div className="v13-title-pattern">{t.pattern}</div>
                      )}
                      {t?.ctr_estimate && (
                        <div className="v13-title-ctr">📈 CTR {t.ctr_estimate}</div>
                      )}
                    </div>
                    <div className="v13-title-text">{titleText}</div>
                    {t?.reasoning && (
                      <div className="v13-title-reason">{t.reasoning}</div>
                    )}
                    <button
                      type="button"
                      className={`v13-copy-btn ${copied === `t-${i}` ? 'copied' : ''}`}
                      onClick={() => copy(titleText, `t-${i}`)}
                    >
                      {copied === `t-${i}` ? '✓ 복사됨' : '📋 복사'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {section === 'prompts' && v650Data && (
          <div className="v13-section">
            <CinematicPromptDisplay prompts={v650Data.prompts} />
          </div>
        )}

        {/* ============================================ */}
        {/* 영상 제작 배너 */}
        {/* ============================================ */}
        <div className="v13-prod-banner">
          <div className="v13-prod-icon">🚀</div>
          <div className="v13-prod-text">
            <div className="v13-prod-title">영상 자동 제작 기능 — 곧 출시</div>
            <div className="v13-prod-sub">
              지금 만든 프롬프트를 바로 영상으로 변환하는 기능 개발 중 ·
              현재는 Sora, VEO, Midjourney 등에서 직접 사용
            </div>
          </div>
          <a
            href="mailto:apark12321@gmail.com?subject=AlgoMaker 영상 제작 베타 알림 신청"
            className="v13-prod-btn"
          >
            알림 받기
          </a>
        </div>

        {/* ============================================ */}
        {/* 다른 시나리오 패턴 전환 */}
        {/* ============================================ */}
        <div className="v13-other">
          <div className="v13-other-title">💡 같은 키워드 · 다른 시나리오 패턴으로 만들기</div>
          <div className="v13-other-grid">
            {Object.entries(SCENARIO_PATTERNS)
              .filter(([id]) => id !== scenarioId)
              .map(([id, s]) => (
                <Link
                  key={id}
                  href={`/publish?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(categoryId)}&scenario=${encodeURIComponent(id)}`}
                  className="v13-other-card"
                >
                  <span className="v13-other-emoji">{s.emoji}</span>
                  <div>
                    <div className="v13-other-name">{s.name}</div>
                    <div className="v13-other-desc">{s.flow}</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ============================================ */
        /* v13.0 - 영상 구조 시각화 */
        /* ============================================ */
        .v13-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 24px 60px;
        }
        @media (max-width: 600px) {
          .v13-page { padding: 14px 12px 40px; }
        }

        /* ============================================ */
        /* 헤더 */
        /* ============================================ */
        .v13-header {
          padding: 24px 24px;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          border: 1px solid #e5e5e5;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .v13-header { padding: 18px 16px; margin-bottom: 14px; }
        }

        .v13-back {
          display: inline-block;
          font-size: 12px;
          color: #737373;
          text-decoration: none;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .v13-back:hover { color: #0a0a0a; }

        .v13-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          background: rgba(194, 65, 12, 0.08);
          color: #c2410c;
          font-family: 'SF Mono', monospace;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .v13-kicker { font-size: 10.5px; padding: 4px 9px; }
        }
        .v13-kicker-arrow { color: #c2410c; font-weight: 800; }

        .v13-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 16px;
          font-size: 32px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.15;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .v13-title { font-size: 24px; gap: 8px; }
        }
        .v13-title-emoji { font-size: 1.1em; line-height: 1; }
        .v13-title-text {
          background: linear-gradient(135deg, #0a0a0a 0%, #525252 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* 메타 그리드 */
        .v13-meta { margin-bottom: 16px; }
        .v13-meta-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 600px) {
          .v13-meta-row { grid-template-columns: 1fr; gap: 8px; }
        }
        .v13-meta-item {
          padding: 10px 12px;
          background: #ffffff;
          border-left: 3px solid #c2410c;
        }
        .v13-meta-label {
          font-size: 10.5px;
          color: #a3a3a3;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .v13-meta-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.012em;
          line-height: 1.4;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v13-meta-value { font-size: 12.5px; } }

        .v13-regen-btn {
          width: 100%;
          padding: 11px 18px;
          background: #ffffff;
          border: 1.5px solid #c2410c;
          color: #c2410c;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.015em;
          cursor: pointer;
          transition: all 0.15s;
        }
        .v13-regen-btn:hover { background: #c2410c; color: #ffffff; }

        /* ============================================ */
        /* 타임라인 (HERO 시각화) */
        /* ============================================ */
        .v13-timeline-section {
          padding: 24px 24px 28px;
          background: #0a0a0a;
          color: #ffffff;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .v13-timeline-section { padding: 18px 14px 22px; margin-bottom: 12px; }
        }

        .v13-timeline-head { margin-bottom: 18px; }
        .v13-timeline-title {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .v13-timeline-title { font-size: 14.5px; } }
        .v13-tl-icon { font-size: 18px; line-height: 1; }
        .v13-tl-sub {
          font-size: 11.5px;
          color: #a3a3a3;
          font-weight: 600;
          letter-spacing: -0.005em;
          flex-basis: 100%;
        }
        @media (max-width: 600px) { .v13-tl-sub { font-size: 11px; } }

        /* 타임라인 바 + 비트 */
        .v13-timeline { position: relative; margin-bottom: 18px; }
        .v13-timeline-bar {
          position: absolute;
          top: 36px;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.12);
        }
        .v13-timeline-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #c2410c, #fbbf24);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .v13-beats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
          gap: 4px;
        }
        @media (max-width: 600px) {
          .v13-beats { grid-template-columns: repeat(5, 1fr); gap: 2px; }
        }

        .v13-beat {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.2s;
        }
        .v13-beat:hover, .v13-beat.active {
          color: #ffffff;
        }
        .v13-beat-time {
          font-family: 'SF Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          height: 20px;
        }
        @media (max-width: 600px) {
          .v13-beat-time { font-size: 10.5px; }
        }

        .v13-beat-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0a0a0a;
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .v13-beat:hover .v13-beat-dot {
          border-color: rgba(255, 255, 255, 0.8);
        }
        .v13-beat.active .v13-beat-dot {
          border-color: #c2410c;
          background: #c2410c;
          box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.25);
        }
        .v13-beat-dot-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0);
          transition: background 0.2s;
        }
        .v13-beat.active .v13-beat-dot-inner { background: #ffffff; }

        .v13-beat-label {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: -0.012em;
          text-align: center;
          line-height: 1.3;
          word-break: keep-all;
          padding: 0 2px;
        }
        @media (max-width: 600px) {
          .v13-beat-label { font-size: 9.5px; }
        }

        /* 활성 비트 상세 */
        .v13-beat-detail {
          padding: 18px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 600px) {
          .v13-beat-detail { padding: 14px 14px; }
        }

        .v13-beat-detail-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .v13-beat-detail-time {
          font-family: 'SF Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: -0.015em;
        }
        .v13-beat-detail-label {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) {
          .v13-beat-detail-label { font-size: 14.5px; }
          .v13-beat-detail-time { font-size: 12.5px; }
        }

        /* 노하우 태그 (스며드는 형태) */
        .v13-algo-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .v13-algo-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border: 1px solid;
          border-radius: 100px;
        }
        @media (max-width: 600px) {
          .v13-algo-tag { font-size: 10.5px; padding: 3px 8px; }
        }
        .v13-algo-tag-check { font-weight: 800; }

        /* 비트 시나리오 */
        .v13-beat-script {
          padding: 14px 14px;
          background: rgba(255, 255, 255, 0.06);
          border-left: 3px solid #fbbf24;
          margin-bottom: 12px;
        }
        .v13-beat-script-label {
          font-size: 10.5px;
          color: #fbbf24;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .v13-beat-script-text {
          font-size: 13.5px;
          line-height: 1.65;
          color: #f5f5f5;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .v13-beat-script-text { font-size: 12.5px; }
        }

        .v13-beat-purpose {
          font-size: 12px;
          color: #a3a3a3;
          margin-bottom: 8px;
          line-height: 1.55;
        }
        .v13-beat-purpose-label {
          color: #fbbf24;
          font-weight: 700;
          margin-right: 5px;
        }

        .v13-beat-tip {
          padding: 8px 10px;
          background: rgba(251, 191, 36, 0.08);
          border-left: 2px solid #fbbf24;
          font-size: 11.5px;
          line-height: 1.55;
          color: #fbbf24;
          margin-bottom: 10px;
          word-break: keep-all;
        }

        /* 힌트 박스 */
        .v13-beat-hint {
          margin-top: 12px;
          padding: 12px 12px;
          background: rgba(96, 165, 250, 0.08);
          border-left: 2px solid #60a5fa;
          font-size: 12px;
          line-height: 1.6;
          color: #cbd5e1;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          word-break: keep-all;
        }
        .v13-beat-hint-icon { font-size: 16px; flex-shrink: 0; line-height: 1; }
        .v13-beat-hint strong {
          color: #93c5fd;
          font-weight: 700;
          display: block;
          margin-bottom: 3px;
        }

        /* 복사 버튼 */
        .v13-copy-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .v13-copy-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }
        .v13-copy-btn.copied {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        /* ============================================ */
        /* 탭 */
        /* ============================================ */
        .v13-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) {
          .v13-tabs { gap: 4px; }
        }
        .v13-tab {
          padding: 12px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          font-family: inherit;
          font-weight: 700;
          color: #525252;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          letter-spacing: -0.012em;
        }
        @media (max-width: 600px) {
          .v13-tab { padding: 10px 6px; gap: 3px; }
        }
        .v13-tab:hover {
          background: #fafafa;
          border-color: #0a0a0a;
        }
        .v13-tab.active {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .v13-tab-emoji { font-size: 18px; line-height: 1; }
        @media (max-width: 600px) { .v13-tab-emoji { font-size: 16px; } }
        .v13-tab-label { font-size: 12.5px; }
        @media (max-width: 600px) { .v13-tab-label { font-size: 11px; } }

        /* ============================================ */
        /* 섹션 */
        /* ============================================ */
        .v13-section { margin-bottom: 18px; }

        /* 제목 섹션 */
        .v13-titles-head {
          padding: 14px 16px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
        }
        .v13-titles-title {
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.018em;
          margin-bottom: 3px;
        }
        .v13-titles-tip {
          font-size: 11.5px;
          color: #c2410c;
          font-weight: 700;
        }

        .v13-titles {
          display: flex;
          flex-direction: column;
        }
        .v13-title-card {
          padding: 16px 16px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-top: none;
        }
        .v13-title-card:first-child { border-top: 1px solid #e5e5e5; }
        @media (max-width: 600px) {
          .v13-title-card { padding: 14px 14px; }
        }

        .v13-title-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .v13-title-num {
          font-size: 11px;
          color: #737373;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .v13-title-pattern {
          font-size: 11px;
          padding: 2px 7px;
          background: #fafafa;
          color: #525252;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .v13-title-ctr {
          margin-left: auto;
          font-size: 11px;
          color: #c2410c;
          font-weight: 700;
        }

        .v13-title-text {
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 6px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v13-title-text { font-size: 14.5px; } }

        .v13-title-reason {
          font-size: 12px;
          color: #737373;
          line-height: 1.55;
          margin-bottom: 10px;
          word-break: keep-all;
        }

        /* ============================================ */
        /* 영상 제작 배너 */
        /* ============================================ */
        .v13-prod-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3e7 100%);
          border: 1px solid rgba(194, 65, 12, 0.15);
          border-left: 4px solid #c2410c;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .v13-prod-banner { padding: 14px 16px; gap: 10px; flex-wrap: wrap; }
        }
        .v13-prod-icon { font-size: 28px; line-height: 1; flex-shrink: 0; }
        .v13-prod-text { flex: 1; min-width: 0; }
        .v13-prod-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: -0.018em;
          margin-bottom: 3px;
        }
        .v13-prod-sub {
          font-size: 12px;
          color: #78350f;
          line-height: 1.5;
          word-break: keep-all;
        }
        .v13-prod-btn {
          flex-shrink: 0;
          padding: 9px 16px;
          background: #c2410c;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.015em;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .v13-prod-btn:hover { background: #9a3208; }
        @media (max-width: 600px) {
          .v13-prod-btn { width: 100%; text-align: center; }
        }

        /* ============================================ */
        /* 다른 시나리오 */
        /* ============================================ */
        .v13-other {
          padding: 20px 20px;
          background: #fafafa;
          border: 1px dashed #d4d4d4;
        }
        @media (max-width: 600px) {
          .v13-other { padding: 14px 14px; }
        }
        .v13-other-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #525252;
          margin-bottom: 14px;
          letter-spacing: -0.015em;
        }
        .v13-other-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }
        @media (max-width: 600px) {
          .v13-other-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
        }
        .v13-other-card {
          padding: 12px 12px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          text-decoration: none;
          color: #404040;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          transition: all 0.15s;
        }
        .v13-other-card:hover {
          border-color: #c2410c;
          color: #c2410c;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
        }
        .v13-other-emoji { font-size: 20px; line-height: 1; flex-shrink: 0; }
        .v13-other-name {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin-bottom: 2px;
        }
        .v13-other-desc {
          font-size: 11px;
          color: #737373;
          line-height: 1.4;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .v13-other-card { padding: 10px 10px; gap: 6px; }
          .v13-other-emoji { font-size: 18px; }
          .v13-other-name { font-size: 12px; }
          .v13-other-desc { font-size: 10px; }
        }
      `}</style>
    </V11Shell>
  );
}
