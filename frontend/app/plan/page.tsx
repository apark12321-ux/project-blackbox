'use client';

/**
 * frontend/app/plan/page.tsx
 * AlgoMaker v6 · 대화형 채팅 UI · 기획 단계
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './plan.module.css';
import { StepBar, FontLoader, setProject } from '../_shared/StepBar';
import {
  STRUCTURES,
  getStructureById,
  apiInitPlan,
  apiRefinePlan,
  apiSwitchStructure,
  newMsgId,
  type Plan,
  type Structure,
  type ChatMessage,
} from './scenarios';

function _FontLoaderLocal_unused() {
  return null;
}

// 초기값
const INITIAL_CATEGORY = '경제';
const INITIAL_KEYWORD = '주식 급등 작전';
const INITIAL_STRUCTURE = 'clue-hunt';

const SUGGESTIONS = [
  '2번째 섹션을 더 강하게 해주세요',
  '전체적으로 더 긴장감 있게',
  '통계 자료를 더 넣어주세요',
  '3번 섹션을 2개로 나눠주세요',
  '마지막 섹션에 행동 유도 추가',
];

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [structureId, setStructureId] = useState(INITIAL_STRUCTURE);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = getStructureById(structureId)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 최초 진입 시 기획서 초안 자동 생성
  useEffect(() => {
    initFirstPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 메시지 스크롤 자동 하단
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  async function initFirstPlan() {
    setIsGenerating(true);
    setError(null);
    try {
      const p = await apiInitPlan(
        INITIAL_CATEGORY,
        INITIAL_KEYWORD,
        INITIAL_STRUCTURE,
      );
      setPlan(p);
      setMessages([
        {
          id: newMsgId(),
          role: 'ai',
          text: p.ai_message,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      setError(`초기 기획서 생성 실패: ${(e as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSend() {
    const text = inputText.trim();
    if (!text || !plan || isGenerating) return;

    setInputText('');
    setError(null);

    // 사용자 메시지 추가
    const userMsg: ChatMessage = {
      id: newMsgId(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const updated = await apiRefinePlan(text, plan, structureId);
      setPlan(updated);
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId(),
          role: 'ai',
          text: updated.ai_message,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      setError(`수정 실패: ${(e as Error).message}`);
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId(),
          role: 'ai',
          text: '죄송합니다. AI 응답에 문제가 있었습니다. 다시 시도해주세요.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSwitchStructure(newId: string) {
    if (newId === structureId || isGenerating) {
      setShowStylePicker(false);
      return;
    }
    setShowStylePicker(false);
    setIsGenerating(true);
    setError(null);

    const prevId = structureId;
    setStructureId(newId);
    const struct = getStructureById(newId);

    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId(),
        role: 'user',
        text: `스타일을 "${struct?.name}"으로 바꿔주세요`,
        timestamp: Date.now(),
      },
    ]);

    try {
      const updated = await apiSwitchStructure(
        INITIAL_CATEGORY,
        INITIAL_KEYWORD,
        newId,
        plan,
      );
      setPlan(updated);
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId(),
          role: 'ai',
          text: updated.ai_message,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      setError(`스타일 변경 실패: ${(e as Error).message}`);
      setStructureId(prevId);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSuggestion(text: string) {
    setInputText(text);
  }

  return (
    <div className={styles.root}>
      <FontLoader />

      {/* App Bar */}
      <header className={styles.appbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>AM</div>
          <div className={styles.brandText}>
            Algo<span className={styles.gold}>Maker</span>
          </div>
        </div>

        <StepBar current="plan" />

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              if (plan) {
                setProject({
                  keyword: INITIAL_KEYWORD,
                  category: INITIAL_CATEGORY,
                  title: plan.headline,
                  duration: '8분 30초',
                });
              }
              router.push('/script');
            }}
          >
            대본 만들기 →
          </button>
        </div>
      </header>

      {/* Style picker dropdown */}
      {showStylePicker && (
        <div className={styles.stylePickerOverlay}>
          <div className={styles.stylePicker}>
            <div className={styles.stylePickerHead}>영상 스타일 바꾸기</div>
            {STRUCTURES.map((s) => (
              <button
                key={s.id}
                className={`${styles.stylePickerItem} ${
                  s.id === structureId ? styles.stylePickerSelected : ''
                }`}
                onClick={() => handleSwitchStructure(s.id)}
              >
                <div className={styles.stylePickerName}>{s.name}</div>
                <div className={styles.stylePickerDesc}>{s.tagline}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Split layout */}
      <div className={styles.split}>
        {/* LEFT: Preview */}
        <div className={styles.preview}>
          {error && (
            <div className={styles.errorBox}>
              <strong>⚠ 오류</strong>
              <br />
              {error}
              <br />
              <button
                className={styles.retryBtn}
                onClick={initFirstPlan}
              >
                다시 시도
              </button>
            </div>
          )}

          {plan ? (
            <>
              <div className={styles.previewHead}>
                <div className={styles.previewLabel}>기획서 미리보기</div>
                <h1 className={styles.previewHeadline}>{plan.headline}</h1>
                <p className={styles.previewDek}>{plan.dek}</p>
                <div className={styles.previewStats}>
                  <div className={styles.statPill}>
                    수익 등급{' '}
                    <strong className={styles.statValue}>
                      {plan.metrics.grade}
                    </strong>
                  </div>
                  <div className={styles.statPill}>
                    시청 유지{' '}
                    <strong className={styles.statValue}>
                      {plan.metrics.avg_retention}%
                    </strong>
                  </div>
                  <div className={styles.statPill}>
                    CPM{' '}
                    <strong className={styles.statValue}>
                      {plan.metrics.cpm_range}
                    </strong>
                  </div>
                  <div className={styles.statPill}>
                    섹션{' '}
                    <strong className={styles.statValue}>
                      {plan.beats.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.sections}>
                {plan.beats.map((beat) => (
                  <BeatCard
                    key={beat.id}
                    beat={beat}
                    highlighted={plan.highlighted_beat_ids?.includes(
                      beat.id,
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.skeleton}>
              {isGenerating && (
                <div className={styles.skeletonPulse}>
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  <div className={styles.skeletonLine} style={{ width: '90%' }} />
                  <div className={styles.skeletonLine} style={{ width: '75%' }} />
                  <div style={{ height: 24 }} />
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Chat */}
        <div className={styles.chat}>
          <div className={styles.chatHead}>
            <div className={styles.chatHeadLeft}>
              <div className={styles.aiAvatar}>✦</div>
              <div>
                <div className={styles.chatHeadTitle}>AlgoMaker AI</div>
                <div className={styles.chatHeadSub}>
                  <span className={styles.chatDot}></span>
                  {isGenerating ? '생각 중…' : '대기 중'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isGenerating && (
              <div className={`${styles.msg} ${styles.msgAi}`}>
                <div className={styles.msgHead}>
                  <span className={styles.msgAuthor}>✦ AI</span>
                </div>
                <div className={styles.msgBubble}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.composer}>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className={styles.suggestChip}
                  onClick={() => handleSuggestion(s)}
                  disabled={isGenerating}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="AI에게 요청하세요. 예: 오프닝을 더 강하게"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isGenerating}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={isGenerating || !inputText.trim()}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Components
// ══════════════════════════════════════════════

function BeatCard({
  beat,
  highlighted,
}: {
  beat: {
    id: string;
    order: number;
    kind: string;
    title: string;
    time_start: string;
    time_end: string;
    retention: number;
    risk: string;
    pull_quote: string;
    notes: string[];
  };
  highlighted?: boolean;
}) {
  const retClass =
    beat.retention >= 70
      ? styles.retHigh
      : beat.retention >= 50
        ? styles.retMed
        : styles.retLow;
  return (
    <div
      className={`${styles.beatCard} ${
        highlighted ? styles.beatHighlighted : ''
      }`}
    >
      <div className={styles.beatTop}>
        <div className={styles.beatTopLeft}>
          <span className={styles.beatIdx}>
            {String(beat.order).padStart(2, '0')}
          </span>
          <span className={styles.beatKind}>{beat.kind}</span>
          <span className={styles.beatTime}>
            {beat.time_start} – {beat.time_end}
          </span>
        </div>
        <div className={styles.beatRet}>
          <span className={styles.retBar}>
            <span
              className={`${styles.retFill} ${retClass}`}
              style={{ width: `${beat.retention}%` }}
            />
          </span>
          <span className={styles.retText}>{beat.retention}%</span>
        </div>
      </div>
      <h3 className={styles.beatTitle}>{beat.title}</h3>
      {beat.pull_quote && (
        <div className={styles.beatQuote}>{beat.pull_quote}</div>
      )}
      {beat.notes && beat.notes.length > 0 && (
        <ul className={styles.beatNotes}>
          {beat.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isAi = msg.role === 'ai';
  const timeStr = new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className={`${styles.msg} ${isAi ? styles.msgAi : styles.msgUser}`}>
      <div className={styles.msgHead}>
        <span className={styles.msgAuthor}>
          {isAi ? '✦ AI' : '나'}
        </span>
        <span className={styles.msgTime}>{timeStr}</span>
      </div>
      <div className={styles.msgBubble}>
        {msg.text.split('\n').map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
      </div>
    </div>
  );
}
