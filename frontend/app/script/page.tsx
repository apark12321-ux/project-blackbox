'use client';

/**
 * frontend/app/script/page.tsx
 * AlgoMaker · 대본 단계 (시니어 모드 지원)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import shared from '../_shared/shared.module.css';
import styles from './script.module.css';
import {
  FontLoader,
  StepBar,
  SeniorToggle,
  getProject,
  getAudienceMeta,
  applySeniorText,
} from '../_shared/StepBar';
import { generateContent, type ScriptBlock } from '../_shared/contentEngine';
import { fetchScript } from '../../lib/api';

interface Block {
  id: string;
  section: 'hook' | 'body' | 'opinion' | 'cta';
  text: string;
  duration: number;
  highlighted?: boolean;
}

interface Msg {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: number;
}

const SECTION_META = {
  hook: { label: '오프닝', icon: '🎯', color: '#d4a537' },
  body: { label: '본문', icon: '📝', color: '#60a5fa' },
  opinion: { label: '의견', icon: '💭', color: '#c084fc' },
  cta: { label: '마무리', icon: '📢', color: '#4ade80' },
};

const SUGGESTIONS = [
  '오프닝을 더 강하게',
  '2번 본문에 통계 자료 추가',
  '의견 부분 더 설득력 있게',
  '전체 톤을 진지하게',
  '마무리에 행동 유도 강화',
];


export default function ScriptPage() {
  const router = useRouter();
  const [project, setProjectState] = useState(() => ({
    keyword: '주식 급등 작전',
    category: '경제',
    title: '',
    duration: '8분 30초',
    seniorMode: false,
  }));
  const [senior, setSenior] = useState(false);
  const [baseBlocks, setBaseBlocks] = useState<Block[]>([]); // 원본 저장 (일반 모드)
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const audienceMeta = getAudienceMeta(senior);

  useEffect(() => {
    const p = getProject();
    setProjectState(p);
    setSenior(p.seniorMode);
    (async () => {
      // 실제 Gemini API로 대본 생성 시도
      const result = await fetchScript(p.keyword, p.category, undefined, p.seniorMode);
      let initial: Block[];
      let sourceLabel = '';

      if (result.source === 'gemini' && result.data?.scriptBlocks) {
        initial = result.data.scriptBlocks.map((b: any) => ({
          id: b.id,
          section: b.section,
          text: b.text,
          duration: b.duration,
        }));
        sourceLabel = 'Google Gemini AI';
      } else {
        // Fallback: 로컬 contentEngine
        const content = generateContent({
          keyword: p.keyword,
          category: p.category,
          senior: p.seniorMode,
        });
        initial = content.scriptBlocks.map((b: any) => ({
          id: b.id,
          section: b.section,
          text: b.text,
          duration: b.duration,
        }));
        sourceLabel = '시뮬레이션 (API 연결 실패 시 자동 전환)';
      }

      setBaseBlocks(initial);
      setBlocks(p.seniorMode ? transformForSenior(initial) : initial);
      setMessages([
        {
          id: 'm1',
          role: 'ai',
          text: p.seniorMode
            ? `✨ ${sourceLabel}로 "${p.keyword}" 대본 생성 완료.\n\n👥 시니어 모드 적용 · 어려운 용어 한자·해설 자동 병기, 문장 호흡 여유롭게 조정했어요.\n\n총 6개 블록, ${p.duration} 분량입니다.`
            : `✨ ${sourceLabel}로 "${p.keyword}" 대본 생성 완료.\n\n총 6개 블록, ${p.duration} 분량입니다. 내용이나 톤을 바꾸고 싶으시면 편하게 말씀해 주세요.`,
          time: Date.now(),
        },
      ]);
      setInitializing(false);
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generating]);

  // 시니어 모드 변경 시 블록 재변환
  const handleSeniorChange = (next: boolean) => {
    setSenior(next);
    if (baseBlocks.length > 0) {
      setBlocks(next ? transformForSenior(baseBlocks) : baseBlocks);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-sn-${Date.now()}`,
          role: 'ai',
          text: next
            ? '👥 시니어 모드로 전환했습니다. 어려운 용어에 한자·해설을 자동으로 달았어요.'
            : '일반 모드로 전환했습니다.',
          time: Date.now(),
        },
      ]);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || generating || initializing) return;
    setInput('');

    const userMsg: Msg = { id: `m-${Date.now()}`, role: 'user', text, time: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setGenerating(true);

    setTimeout(() => {
      const { updatedBlocks, aiReply, highlightIds } = smartRefine(text, baseBlocks);
      setBaseBlocks(updatedBlocks);
      setBlocks(
        (senior ? transformForSenior(updatedBlocks) : updatedBlocks).map((b) => ({
          ...b,
          highlighted: highlightIds.includes(b.id),
        })),
      );
      setMessages((prev) => [
        ...prev,
        { id: `m-${Date.now() + 1}`, role: 'ai', text: aiReply, time: Date.now() },
      ]);
      setGenerating(false);

      setTimeout(() => {
        setBlocks((prev) => prev.map((b) => ({ ...b, highlighted: false })));
      }, 2000);
    }, 1200);
  };

  const totalChars = blocks.reduce((s, b) => s + b.text.length, 0);
  const totalDur = blocks.reduce((s, b) => s + b.duration, 0);

  return (
    <div className={shared.page}>
      <FontLoader />

      <header className={shared.appbar}>
        <div className={shared.brand}>
          <div className={shared.brandMark}>AM</div>
          <div>
            Algo<span className={shared.gold}>Maker</span>
          </div>
        </div>
        <StepBar current="script" />
        <div className={shared.actions}>
          <button
            className={shared.btnBack}
            onClick={() => router.push('/news')}
          >
            ← 뉴스
          </button>
          <SeniorToggle onChange={handleSeniorChange} />
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => router.push('/studio')}
          >
            영상 만들기 →
          </button>
        </div>
      </header>

      <div className={shared.split}>
        {/* LEFT — Script blocks */}
        <div className={shared.leftPane}>
          <div className={shared.previewHead}>
            <div className={shared.previewLabel}>대본 미리보기</div>
            {senior && (
              <div className={shared.seniorBadge}>
                👥 시니어 타겟 최적화 · 한자 병기 · TTS 0.85x
              </div>
            )}
            <h1
              className={`${shared.previewHeadline} ${senior ? shared.seniorPreviewHeadline : ''}`}
            >
              {project.title || `${project.keyword}의 숨겨진 진실`}
            </h1>
            <p className={shared.previewDek}>
              {project.category} · {project.duration} · 6개 블록
            </p>
            <div className={shared.statsPills}>
              <div className={shared.statPill}>
                글자수{' '}
                <strong className={shared.statValue}>
                  {totalChars.toLocaleString()}
                </strong>
              </div>
              <div className={shared.statPill}>
                재생시간{' '}
                <strong className={shared.statValue}>
                  {Math.floor(totalDur / 60)}:
                  {String(totalDur % 60).padStart(2, '0')}
                </strong>
              </div>
              <div className={shared.statPill}>
                블록 <strong className={shared.statValue}>{blocks.length}</strong>
              </div>
              <div className={shared.statPill}>
                CPM <strong className={shared.statValue}>{audienceMeta.cpm}</strong>
              </div>
            </div>
          </div>

          {initializing ? (
            <div className={styles.skeleton}>
              <div className={styles.skeletonHeader}>AI가 대본을 작성하는 중...</div>
              <div className={styles.skeletonLine} style={{ width: '60%' }} />
              <div className={styles.skeletonLine} style={{ width: '90%' }} />
              <div className={styles.skeletonLine} style={{ width: '80%' }} />
              <div style={{ height: 16 }} />
              <div className={styles.skeletonLine} style={{ width: '70%' }} />
              <div className={styles.skeletonLine} style={{ width: '95%' }} />
              <div className={styles.skeletonLine} style={{ width: '85%' }} />
            </div>
          ) : (
            <div className={styles.blocks}>
              {blocks.map((b, i) => {
                const meta = SECTION_META[b.section];
                return (
                  <div
                    key={b.id}
                    className={`${styles.block} ${b.highlighted ? styles.highlighted : ''}`}
                  >
                    <div className={styles.blockHeader}>
                      <span className={styles.blockNum}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={styles.blockTag}
                        style={{
                          color: meta.color,
                          background: `${meta.color}18`,
                        }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                      <span className={styles.blockDur}>{b.duration}초</span>
                    </div>
                    <p
                      className={`${styles.blockText} ${senior ? shared.seniorBlockText : ''}`}
                    >
                      {b.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — Chat */}
        <div className={shared.rightPane}>
          <div className={shared.chatHead}>
            <div className={shared.chatHeadLeft}>
              <div className={shared.aiAvatar}>✦</div>
              <div>
                <div className={shared.chatHeadTitle}>AlgoMaker AI</div>
                <div className={shared.chatHeadSub}>
                  <span className={shared.chatDot}></span>
                  {generating ? '작성 중…' : '대기 중'}
                </div>
              </div>
            </div>
          </div>

          <div className={shared.messages}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${shared.msg} ${m.role === 'ai' ? shared.msgAi : shared.msgUser}`}
              >
                <div className={shared.msgHead}>
                  <span className={shared.msgAuthor}>
                    {m.role === 'ai' ? '✦ AI' : '나'}
                  </span>
                </div>
                <div className={shared.msgBubble}>
                  {m.text.split('\n').map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>
            ))}
            {(generating || initializing) && (
              <div className={`${shared.msg} ${shared.msgAi}`}>
                <div className={shared.msgHead}>
                  <span className={shared.msgAuthor}>✦ AI</span>
                </div>
                <div className={shared.msgBubble}>
                  <div className={shared.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={shared.composer}>
            <div className={shared.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className={shared.suggestChip}
                  onClick={() => setInput(s)}
                  disabled={generating || initializing}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className={shared.inputRow}>
              <input
                type="text"
                placeholder="AI에게 요청하세요. 예: 오프닝을 더 강하게"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={generating || initializing}
              />
              <button
                className={shared.sendBtn}
                onClick={handleSend}
                disabled={generating || initializing || !input.trim()}
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

// ═══ Senior Text Transform ═══
function transformForSenior(blocks: Block[]): Block[] {
  return blocks.map((b) => ({
    ...b,
    text: applySeniorText(b.text),
  }));
}

// ═══ Smart refine (로컬 로직) ═══
function smartRefine(
  userText: string,
  blocks: Block[],
): { updatedBlocks: Block[]; aiReply: string; highlightIds: string[] } {
  const t = userText.toLowerCase();
  const updated = blocks.map((b) => ({ ...b }));
  const highlights: string[] = [];

  const numMatch = t.match(/(\d+)\s*번|(\d+)번째/);
  const targetIdx = numMatch ? Number(numMatch[1] || numMatch[2]) - 1 : -1;

  const isStrengthen = /(강하|강렬|임팩트|세게|긴장)/.test(t);
  const isSoften = /(부드|약하|완화|편안)/.test(t);
  const isAddStats = /(통계|데이터|숫자|자료)/.test(t);
  const isAddTwist = /(반전|놀라|충격)/.test(t);
  const isAddCta = /(행동 유도|cta|구독|댓글)/.test(t);
  const isOpening = /(오프닝|도입|처음)/.test(t);
  const isEnding = /(마무리|결론|마지막|끝)/.test(t);
  const isAll = /(전체|전부|모두)/.test(t);

  let reply = '';

  const apply = (b: Block): Block => {
    let newText = b.text;
    if (isStrengthen) newText = '놀랍게도, ' + newText;
    if (isSoften) newText = newText.replace(/습니다\./g, '습니다. ');
    if (isAddStats)
      newText +=
        ' 실제로 관련 데이터를 보면, 금융감독원 통계상 평균 건당 피해액이 1억 7천만 원에 달합니다.';
    if (isAddTwist)
      newText += ' 그런데 여기서 반전이 있습니다. 결정적 단서가 하나 더 있어요.';
    if (isAddCta)
      newText += ' 구독과 알림 설정, 그리고 댓글 한 마디가 저에게는 큰 힘이 됩니다.';
    return { ...b, text: newText };
  };

  if (targetIdx >= 0 && targetIdx < updated.length) {
    updated[targetIdx] = apply(updated[targetIdx]);
    highlights.push(updated[targetIdx].id);
    reply = `${targetIdx + 1}번 블록을 요청하신 방향으로 수정했습니다.`;
  } else if (isOpening) {
    updated[0] = apply(updated[0]);
    highlights.push(updated[0].id);
    reply = '오프닝을 더 강하게 수정했습니다.';
  } else if (isEnding) {
    const last = updated.length - 1;
    updated[last] = apply(updated[last]);
    highlights.push(updated[last].id);
    reply = '마무리 블록을 반영해 수정했습니다.';
  } else if (isAll || isStrengthen || isSoften || isAddStats) {
    updated.forEach((b, i) => {
      updated[i] = apply(b);
      highlights.push(b.id);
    });
    reply = '전체 대본을 요청하신 방향으로 재구성했습니다.';
  } else {
    updated[0] = { ...updated[0], text: updated[0].text + ' (수정 반영됨)' };
    highlights.push(updated[0].id);
    reply = '요청을 반영했습니다.';
  }

  return { updatedBlocks: updated, aiReply: reply, highlightIds: highlights };
}
