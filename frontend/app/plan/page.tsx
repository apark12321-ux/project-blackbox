'use client';

/**
 * frontend/app/plan/page.tsx
 *
 * AlgoMaker 시나리오 엔진 v2 · Step 1 (프론트엔드 목업)
 * - 에디토리얼 디자인 (변종 A 확정)
 * - 12구조 라이브러리 + 세부 파라미터 + AI 추천 + 가변 섹션
 * - 목업 데이터로 동작 (Step 2에서 백엔드 API로 교체)
 */

import { useState, useMemo, useEffect } from 'react';
import styles from './plan.module.css';
import {
  STRUCTURES,
  CATEGORY_LABELS,
  getStructureById,
  getStructuresByCategory,
  generateMockPlan,
  type Structure,
  type StructureCategory,
  type SubParamDef,
  type Plan,
} from './scenarios';

// 웹폰트 (Fraunces + JetBrains Mono) 로드
function FontPreload() {
  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect);

    const gstatic = document.createElement('link');
    gstatic.rel = 'preconnect';
    gstatic.href = 'https://fonts.gstatic.com';
    gstatic.crossOrigin = 'anonymous';
    document.head.appendChild(gstatic);

    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=JetBrains+Mono:wght@400;500;700&display=swap';
    document.head.appendChild(fonts);

    const pretendard = document.createElement('link');
    pretendard.rel = 'stylesheet';
    pretendard.href =
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
    document.head.appendChild(pretendard);

    return () => {
      // cleanup은 굳이 필요 없음 (SPA 내 단일 페이지 수명)
    };
  }, []);
  return null;
}

// 초기 추천 (목업)
const INITIAL_RECOMMENDATION = {
  structure_id: 'clue-hunt',
  confidence: 92,
  grade: 'A+',
  retention: 58,
  reason:
    '"주식 급등 작전"은 의혹 요소가 강한 키워드. 평균 2.3배 높은 시청 지속률을 보이는 구조입니다.',
};

export default function PlanPage() {
  const [selectedId, setSelectedId] = useState<string>(
    INITIAL_RECOMMENDATION.structure_id,
  );
  const [subParams, setSubParams] = useState<Record<string, string | number>>(
    {},
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const selected = useMemo(() => getStructureById(selectedId)!, [selectedId]);

  // 구조가 바뀌면 해당 구조의 기본값으로 subParams 리셋
  useEffect(() => {
    const defaults: Record<string, string | number> = {};
    selected.subParams.forEach((p) => {
      defaults[p.key] = p.default;
    });
    setSubParams(defaults);
  }, [selectedId, selected]);

  const plan: Plan = useMemo(
    () => generateMockPlan(selectedId, subParams),
    [selectedId, subParams],
  );

  const handleRegen = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 700); // 목업 딜레이
  };

  return (
    <div className={styles.root}>
      <FontPreload />

      {/* ============ Masthead ============ */}
      <header className={styles.masthead}>
        <div className={styles.mastLeft}>Vol. II · No. 04 · 2026</div>
        <div className={styles.mastCenter}>
          <div className={styles.mastTitle}>AlgoMaker</div>
          <div className={styles.mastSub}>The Longform Script Review</div>
        </div>
        <div className={styles.mastRight}>Editorial Workbench</div>
      </header>

      {/* ============ Main Layout ============ */}
      <div className={styles.editorial}>
        {/* ---- Sidebar ---- */}
        <aside className={styles.sidebar}>
          {/* 에디터 추천 */}
          <div className={styles.sideHead}>
            <span>에디터 추천</span>
            <span className={styles.sideNum}>01</span>
          </div>
          <div className={styles.editorPick}>
            <div className={styles.epLabel}>This Week's Pick</div>
            <div className={styles.epTitle}>
              {getStructureById(INITIAL_RECOMMENDATION.structure_id)?.name}
            </div>
            <div className={styles.epStats}>
              <div>
                <div className={styles.epStatVal}>
                  {INITIAL_RECOMMENDATION.confidence}
                  <span style={{ fontSize: '12px' }}>%</span>
                </div>
                <div className={styles.epStatLabel}>신뢰</div>
              </div>
              <div>
                <div className={styles.epStatVal}>
                  {INITIAL_RECOMMENDATION.grade}
                </div>
                <div className={styles.epStatLabel}>등급</div>
              </div>
              <div>
                <div className={styles.epStatVal}>
                  {INITIAL_RECOMMENDATION.retention}
                  <span style={{ fontSize: '12px' }}>%</span>
                </div>
                <div className={styles.epStatLabel}>리텐션</div>
              </div>
            </div>
            <div className={styles.epReason}>
              {INITIAL_RECOMMENDATION.reason}
            </div>
          </div>

          {/* 구조 라이브러리 */}
          <div className={styles.sideHead}>
            <span>구조 라이브러리</span>
            <span className={styles.sideNum}>02</span>
          </div>
          <div className={styles.structList}>
            {(Object.keys(CATEGORY_LABELS) as StructureCategory[]).map(
              (cat) => (
                <div key={cat}>
                  <div className={styles.structCategory}>
                    — {CATEGORY_LABELS[cat]} —
                  </div>
                  {getStructuresByCategory(cat).map((s) => {
                    const isSelected = s.id === selectedId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`${styles.structRow} ${isSelected ? styles.selected : ''}`}
                        onClick={() => setSelectedId(s.id)}
                      >
                        <span className={styles.structNum}>
                          {String(STRUCTURES.indexOf(s) + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.structName}>
                          {s.emoji} {s.name}
                        </span>
                        <span
                          className={`${styles.structScore} ${s.affinity >= 80 ? styles.structScoreHi : ''}`}
                        >
                          {s.affinity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ),
            )}
          </div>

          {/* 세밀 조정 */}
          {selected.subParams.length > 0 && (
            <div className={styles.controls}>
              <div className={styles.sideHead}>
                <span>세밀 조정</span>
                <span className={styles.sideNum}>03</span>
              </div>
              {selected.subParams.map((p) => (
                <SubParamControl
                  key={p.key}
                  def={p}
                  value={subParams[p.key] ?? p.default}
                  onChange={(v) =>
                    setSubParams((prev) => ({ ...prev, [p.key]: v }))
                  }
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className={styles.regen}
            onClick={handleRegen}
            disabled={isGenerating}
          >
            {isGenerating ? '생성 중...' : '기획서 다시 짜기 →'}
          </button>
        </aside>

        {/* ---- Article ---- */}
        <main>
          <ArticleBody plan={plan} />
        </main>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Sub-param control: segments / stepper / dropdown
// ──────────────────────────────────────────────────────
function SubParamControl({
  def,
  value,
  onChange,
}: {
  def: SubParamDef;
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  return (
    <div className={styles.controlRow}>
      <div className={styles.controlLabel}>
        <span>{def.label}</span>
        {def.hint && <span className={styles.controlHint}>{def.hint}</span>}
      </div>

      {def.kind === 'segments' && def.options && (
        <div className={styles.pills}>
          {def.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pill} ${value === opt.value ? styles.active : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {def.kind === 'stepper' && (
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => {
              const n = Number(value);
              if (n > (def.min ?? 0)) onChange(n - 1);
            }}
          >
            −
          </button>
          <span className={styles.stepVal}>{value}</span>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => {
              const n = Number(value);
              if (n < (def.max ?? 99)) onChange(n + 1);
            }}
          >
            +
          </button>
        </div>
      )}

      {def.kind === 'dropdown' && def.options && (
        <select
          className={styles.dropdown}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {def.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Article body
// ──────────────────────────────────────────────────────
function ArticleBody({ plan }: { plan: Plan }) {
  const struct = getStructureById(plan.structure_id)!;
  return (
    <>
      <div className={styles.articleHead}>
        <div className={styles.kicker}>
          경제 · 주식 급등 작전 · {plan.total_duration}
        </div>
        <h1 className={styles.headline}>{plan.headline}</h1>
        <p className={styles.dek}>{plan.dek}</p>
        <div className={styles.byline}>
          <span>
            구조 <span className={styles.mono}>{struct.name}</span>
          </span>
          <span className={styles.sep}>·</span>
          <span>{plan.beats.length} beats</span>
          <span className={styles.sep}>·</span>
          <span className={styles.mono}>
            00:00 – {plan.total_duration.padStart(5, '0')}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timelineWrap}>
        <div className={styles.timelineSpine} />
        {plan.beats.map((beat) => (
          <div key={beat.id} className={styles.beat}>
            <div className={styles.beatTime}>
              <div className={styles.timeStart}>{beat.time_start}</div>
              <div className={styles.timeEnd}>{beat.time_end}</div>
              <div
                className={`${styles.beatDot} ${
                  beat.risk === 'low'
                    ? styles.riskLow
                    : beat.risk === 'med'
                      ? styles.riskMed
                      : styles.riskHi
                }`}
              />
            </div>
            <div className={styles.beatBody}>
              <div className={styles.beatMeta}>
                <span className={styles.beatIdx}>
                  Beat {String(beat.order).padStart(2, '0')}
                </span>
                <span>{beat.kind}</span>
                <span className={styles.beatRet}>
                  <span className={styles.retBar}>
                    <span
                      className={styles.retFill}
                      style={{ width: `${beat.retention}%` }}
                    />
                  </span>
                  <span className={styles.retText}>{beat.retention}%</span>
                </span>
              </div>
              <h2 className={styles.beatTitle}>{beat.title}</h2>
              <p className={styles.pullQuote}>{beat.pull_quote}</p>
              <ul className={styles.beatNotes}>
                {beat.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.gradeBox}>
          <div className={styles.gradeLetter}>{plan.metrics.grade}</div>
          <div className={styles.gradeCaption}>Monetization</div>
        </div>
        <div className={styles.gradeDesc}>{plan.metrics.grade_reason}</div>
        <div className={styles.metricCell}>
          <div className={styles.mVal}>
            {plan.metrics.avg_retention}
            <span style={{ fontSize: '18px' }}>%</span>
          </div>
          <div className={styles.mLabel}>Retention</div>
        </div>
        <div className={styles.metricCell}>
          <div className={styles.mVal}>{plan.metrics.cpm_range}</div>
          <div className={styles.mLabel}>CPM</div>
        </div>
        <div className={styles.metricCell}>
          <div className={styles.mVal}>{plan.metrics.algo_shield}</div>
          <div className={styles.mLabel}>Shield</div>
        </div>
      </div>
    </>
  );
}
