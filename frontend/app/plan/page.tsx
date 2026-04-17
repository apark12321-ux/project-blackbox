'use client';

/**
 * frontend/app/plan/page.tsx
 * AlgoMaker v2 · SaaS 작업 도구 UI (v3)
 *
 * 변경 사항:
 * - 세리프 전면 제거 (Pretendard 단일)
 * - 매거진 장식 요소 전부 제거
 * - 앱 바 + 좌측 내비 + 중앙 편집기 + 우측 인스펙터 (3패널)
 * - 모든 텍스트 편집 가능 (제목, 핵심, 불릿)
 * - 섹션 추가/삭제/복제 액션 버튼
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
  type Beat,
} from './scenarios';

function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
    document.head.appendChild(link);
  }, []);
  return null;
}

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
  const [activeBeatId, setActiveBeatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectTitle, setProjectTitle] = useState('주식 급등 작전 · 8분 30초');
  const [searchQuery, setSearchQuery] = useState('');

  const selected = useMemo(() => getStructureById(selectedId)!, [selectedId]);

  useEffect(() => {
    const defaults: Record<string, string | number> = {};
    selected.subParams.forEach((p) => {
      defaults[p.key] = p.default;
    });
    setSubParams(defaults);
  }, [selectedId, selected]);

  const basePlan: Plan = useMemo(
    () => generateMockPlan(selectedId, subParams),
    [selectedId, subParams],
  );

  const [beats, setBeats] = useState<Beat[]>(basePlan.beats);
  useEffect(() => {
    setBeats(basePlan.beats);
  }, [basePlan]);

  const handleRegen = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setBeats(basePlan.beats);
    }, 600);
  };

  const updateBeat = (id: string, patch: Partial<Beat>) => {
    setBeats((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };
  const updateBeatNote = (beatId: string, noteIdx: number, text: string) => {
    setBeats((prev) =>
      prev.map((b) => {
        if (b.id !== beatId) return b;
        const newNotes = [...b.notes];
        newNotes[noteIdx] = text;
        return { ...b, notes: newNotes };
      }),
    );
  };
  const addNote = (beatId: string) => {
    setBeats((prev) =>
      prev.map((b) =>
        b.id === beatId ? { ...b, notes: [...b.notes, '새 항목'] } : b,
      ),
    );
  };
  const removeNote = (beatId: string, noteIdx: number) => {
    setBeats((prev) =>
      prev.map((b) => {
        if (b.id !== beatId) return b;
        return { ...b, notes: b.notes.filter((_, i) => i !== noteIdx) };
      }),
    );
  };
  const duplicateBeat = (id: string) => {
    setBeats((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const original = prev[idx];
      const copy: Beat = {
        ...original,
        id: `${original.id}-copy-${Date.now()}`,
        order: original.order + 1,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next.map((b, i) => ({ ...b, order: i + 1 }));
    });
  };
  const deleteBeat = (id: string) => {
    if (beats.length <= 1) return;
    setBeats((prev) =>
      prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i + 1 })),
    );
  };

  const filteredStructures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return STRUCTURES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <div className={styles.root}>
      <FontLoader />

      {/* App Bar */}
      <header className={styles.appbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>A</div>
          <div className={styles.brandText}>AlgoMaker</div>
        </div>

        <div className={styles.projectMeta}>
          <div className={styles.crumb}>
            <span>기획서</span>
            <span className={styles.sep}>/</span>
            <span>경제</span>
            <span className={styles.sep}>/</span>
          </div>
          <input
            className={styles.projectTitle}
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <span className={styles.saveStatus}>자동 저장됨</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn}>
            <span>↩</span>
            <span className="btnText">되돌리기</span>
          </button>
          <button className={styles.btn}>
            <span>👁</span>
            <span className="btnText">미리보기</span>
          </button>
          <button className={`${styles.btn} ${styles.primary}`}>
            <span>→</span>
            대본 생성
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Left Nav */}
        <aside className={styles.nav}>
          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span>AI 추천</span>
            </div>
            <span className={styles.countBadge}>1</span>
          </div>

          <div className={styles.aiCard}>
            <div className={styles.aiCardLabel}>추천 구조</div>
            <div className={styles.aiCardTitle}>
              {getStructureById(INITIAL_RECOMMENDATION.structure_id)?.name}
            </div>
            <div className={styles.aiCardTagline}>
              {getStructureById(INITIAL_RECOMMENDATION.structure_id)?.tagline}
            </div>
            <div className={styles.aiCardStats}>
              <div className={styles.aiStat}>
                <div className={styles.aiStatVal}>
                  {INITIAL_RECOMMENDATION.confidence}%
                </div>
                <div className={styles.aiStatLabel}>신뢰도</div>
              </div>
              <div className={styles.aiStat}>
                <div className={styles.aiStatVal}>
                  {INITIAL_RECOMMENDATION.grade}
                </div>
                <div className={styles.aiStatLabel}>등급</div>
              </div>
              <div className={styles.aiStat}>
                <div className={styles.aiStatVal}>
                  {INITIAL_RECOMMENDATION.retention}%
                </div>
                <div className={styles.aiStatLabel}>리텐션</div>
              </div>
            </div>
            <button
              type="button"
              className={styles.aiCardApply}
              onClick={() =>
                setSelectedId(INITIAL_RECOMMENDATION.structure_id)
              }
            >
              <span>✓</span> 이 구조 적용
            </button>
          </div>

          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span>구조 라이브러리</span>
            </div>
            <span className={styles.countBadge}>12</span>
          </div>

          <div className={styles.searchbar}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="구조 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredStructures ? (
            <div>
              {filteredStructures.map((s) => (
                <StructItem
                  key={s.id}
                  s={s}
                  selected={s.id === selectedId}
                  onClick={() => setSelectedId(s.id)}
                />
              ))}
              {filteredStructures.length === 0 && (
                <div
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: 'var(--ink-4)',
                    fontSize: 12,
                  }}
                >
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          ) : (
            (Object.keys(CATEGORY_LABELS) as StructureCategory[]).map((cat) => (
              <div key={cat}>
                <div className={styles.groupTitle}>
                  {CATEGORY_LABELS[cat]}
                </div>
                {getStructuresByCategory(cat).map((s) => (
                  <StructItem
                    key={s.id}
                    s={s}
                    selected={s.id === selectedId}
                    onClick={() => setSelectedId(s.id)}
                  />
                ))}
              </div>
            ))
          )}
        </aside>

        {/* Center Editor */}
        <main className={styles.editor}>
          <div className={styles.editorHead}>
            <div>
              <div className={styles.editorTitle}>
                <span>섹션 구성</span>
                <span className={styles.structChip}>
                  <span>{selected.emoji}</span>
                  <span>{selected.name}</span>
                </span>
              </div>
              <div className={styles.editorSub}>
                <span>{beats.length}개 섹션</span>
                <span className={styles.bullet}>·</span>
                <span>총 {basePlan.total_duration}</span>
                <span className={styles.bullet}>·</span>
                <span>
                  평균 리텐션{' '}
                  {Math.round(
                    beats.reduce((a, b) => a + b.retention, 0) / beats.length,
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className={styles.beats}>
            {beats.map((beat) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                active={activeBeatId === beat.id}
                onActivate={() => setActiveBeatId(beat.id)}
                onUpdate={(patch) => updateBeat(beat.id, patch)}
                onUpdateNote={(idx, text) =>
                  updateBeatNote(beat.id, idx, text)
                }
                onRemoveNote={(idx) => removeNote(beat.id, idx)}
                onAddNote={() => addNote(beat.id)}
                onDuplicate={() => duplicateBeat(beat.id)}
                onDelete={() => deleteBeat(beat.id)}
                canDelete={beats.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.addBeatBtn}
            onClick={() => {
              const last = beats[beats.length - 1];
              const newBeat: Beat = {
                id: `new-${Date.now()}`,
                order: beats.length + 1,
                kind: '새 섹션',
                title: '제목 입력',
                time_start: last?.time_end ?? '00:00',
                time_end: '00:00',
                retention: 50,
                risk: 'med',
                pull_quote: '',
                notes: ['새 항목'],
              };
              setBeats([...beats, newBeat]);
            }}
          >
            <span>+</span>
            섹션 추가
          </button>
        </main>

        {/* Right Inspector */}
        <aside className={styles.inspector}>
          {selected.subParams.length > 0 ? (
            <div className={styles.inspSection}>
              <div className={styles.inspTitle}>구조 옵션</div>
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
          ) : (
            <div className={styles.inspSection}>
              <div className={styles.inspTitle}>구조 옵션</div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--ink-4)',
                  lineHeight: 1.6,
                }}
              >
                이 구조에는 추가 조정 옵션이 없습니다.
              </p>
            </div>
          )}

          <div className={styles.inspSection}>
            <div className={styles.inspTitle}>수익화 예측</div>

            <div className={`${styles.metricTile} ${styles.grade}`}>
              <span className={styles.metricKey}>등급</span>
              <span className={styles.metricVal}>{basePlan.metrics.grade}</span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricKey}>평균 리텐션</span>
              <span className={styles.metricVal}>
                {basePlan.metrics.avg_retention}%
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricKey}>예상 CPM</span>
              <span className={styles.metricVal}>
                {basePlan.metrics.cpm_range}
              </span>
            </div>
            <div className={styles.metricTile}>
              <span className={styles.metricKey}>알고리즘 실드</span>
              <span className={styles.metricVal}>
                {basePlan.metrics.algo_shield}
              </span>
            </div>

            <button
              type="button"
              className={styles.regenBtn}
              onClick={handleRegen}
              disabled={isGenerating}
            >
              {isGenerating ? '생성 중…' : '↻ 기획서 재생성'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StructItem({
  s,
  selected,
  onClick,
}: {
  s: Structure;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.structItem} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <span className={styles.structEmoji}>{s.emoji}</span>
      <span className={styles.structItemName}>{s.name}</span>
      <span
        className={`${styles.affBadge} ${s.affinity >= 80 ? styles.hi : ''}`}
      >
        {s.affinity}
      </span>
    </button>
  );
}

function BeatCard({
  beat,
  active,
  onActivate,
  onUpdate,
  onUpdateNote,
  onRemoveNote,
  onAddNote,
  onDuplicate,
  onDelete,
  canDelete,
}: {
  beat: Beat;
  active: boolean;
  onActivate: () => void;
  onUpdate: (patch: Partial<Beat>) => void;
  onUpdateNote: (idx: number, text: string) => void;
  onRemoveNote: (idx: number) => void;
  onAddNote: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const retClass =
    beat.retention >= 70 ? '' : beat.retention >= 50 ? styles.med : styles.low;

  return (
    <div
      className={`${styles.beatCard} ${active ? styles.active : ''}`}
      onClick={onActivate}
    >
      <div className={styles.beatTop}>
        <div className={styles.beatNum}>
          {String(beat.order).padStart(2, '0')}
        </div>
        <div className={styles.beatMeta}>
          <span className={styles.beatKind}>{beat.kind}</span>
          <span className={styles.beatTime}>
            {beat.time_start} — {beat.time_end}
          </span>
        </div>
        <span className={styles.retentionPill}>
          <span className={styles.retBar}>
            <span
              className={`${styles.retFill} ${retClass}`}
              style={{ width: `${beat.retention}%` }}
            />
          </span>
          <span className={styles.retText}>{beat.retention}%</span>
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button
            type="button"
            className={styles.iconBtn}
            title="복제"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            ⎘
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="삭제"
            disabled={!canDelete}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        </div>
      </div>

      <input
        className={styles.beatTitleInput}
        value={beat.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      />

      <div className={styles.beatCoreLabel}>핵심 메시지</div>
      <textarea
        className={styles.beatCoreInput}
        value={beat.pull_quote}
        onChange={(e) => onUpdate({ pull_quote: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        rows={2}
      />

      <ul className={styles.beatNotes}>
        {beat.notes.map((note, idx) => (
          <li key={idx} className={styles.beatNoteItem}>
            <span className={styles.beatNoteBullet} />
            <input
              className={styles.beatNoteText}
              value={note}
              onChange={(e) => onUpdateNote(idx, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className={styles.iconBtn}
              style={{ width: 22, height: 22 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveNote(idx);
              }}
              title="항목 삭제"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.addNoteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onAddNote();
        }}
      >
        <span>+</span> 항목 추가
      </button>
    </div>
  );
}

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
    <div className={styles.formRow}>
      <div className={styles.formLabel}>
        <span>{def.label}</span>
        {def.hint && <span className={styles.formHint}>{def.hint}</span>}
      </div>

      {def.kind === 'segments' && def.options && (
        <div className={styles.segments}>
          {def.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.segment} ${
                value === opt.value ? styles.active : ''
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {def.kind === 'stepper' && (
        <div className={styles.stepperWrap}>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={() => {
              const n = Number(value);
              if (n > (def.min ?? 0)) onChange(n - 1);
            }}
            disabled={Number(value) <= (def.min ?? 0)}
          >
            −
          </button>
          <div className={styles.stepperVal}>{value}</div>
          <button
            type="button"
            className={styles.stepperBtn}
            onClick={() => {
              const n = Number(value);
              if (n < (def.max ?? 99)) onChange(n + 1);
            }}
            disabled={Number(value) >= (def.max ?? 99)}
          >
            +
          </button>
        </div>
      )}

      {def.kind === 'dropdown' && def.options && (
        <select
          className={styles.dropdownSelect}
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
