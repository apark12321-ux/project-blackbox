'use client';

/**
 * frontend/app/studio/page.tsx
 * AlgoMaker · 영상 제작 단계 (데모 모드)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import shared from '../_shared/shared.module.css';
import styles from './studio.module.css';
import { FontLoader, StepBar, SeniorToggle, getProject, getAudienceMeta } from '../_shared/StepBar';

interface Phase {
  id: string;
  label: string;
  icon: string;
  duration: number; // seconds
  description: string;
}

const PHASES: Phase[] = [
  { id: 'tts', label: 'TTS 음성 생성', icon: '🎙️', duration: 12, description: 'ElevenLabs로 한국어 음성 변환 중' },
  { id: 'visual', label: '자료 화면 생성', icon: '🎨', duration: 20, description: 'Gemini가 인포그래픽 슬라이드 제작 중' },
  { id: 'avatar', label: '아바타 합성', icon: '👤', duration: 10, description: '말하는 아바타 프레임 생성 중' },
  { id: 'subtitle', label: '자막 싱크', icon: '💬', duration: 8, description: '타임코드 맞춰 자막 삽입 중' },
  { id: 'merge', label: '최종 합성', icon: '🎬', duration: 15, description: 'FFmpeg로 영상·음성·자막 합성 중' },
];

interface Scene {
  id: string;
  time: string;
  title: string;
  state: 'pending' | 'active' | 'done';
}

function buildScenes(): Scene[] {
  return [
    { id: 's1', time: '00:00-00:28', title: '후킹 오프닝', state: 'pending' },
    { id: 's2', time: '00:28-02:03', title: '배경 · 통계 제시', state: 'pending' },
    { id: 's3', time: '02:03-04:03', title: '첫 번째 단서', state: 'pending' },
    { id: 's4', time: '04:03-05:53', title: '함정 · 가짜 가설', state: 'pending' },
    { id: 's5', time: '05:53-07:23', title: '진실 공개', state: 'pending' },
    { id: 's6', time: '07:23-08:00', title: '마무리 · CTA', state: 'pending' },
  ];
}

interface Msg {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

export default function StudioPage() {
  const router = useRouter();
  const [project, setProjectState] = useState(() => ({ keyword: '주식 급등 작전', category: '경제', title: '', duration: '8분 30초', seniorMode: false }));
  const [senior, setSenior] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>(buildScenes());
  const [messages, setMessages] = useState<Msg[]>([]);
  const audienceMeta = getAudienceMeta(senior);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const p = getProject();
    setProjectState(p);
    setSenior(p.seniorMode);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 영상 제작 시뮬레이션
  const startProduction = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    setMessages([
      {
        id: 'm1',
        role: 'ai',
        text: `영상 제작을 시작합니다. 총 5단계로 진행되며, 약 1~2분 정도 소요됩니다.`,
      },
    ]);

    const totalDuration = PHASES.reduce((s, p) => s + p.duration, 0);
    let globalElapsed = 0;
    let currentPhase = 0;
    let phaseStart = 0;

    const timer = setInterval(() => {
      globalElapsed += 0.5;
      setElapsed(Math.floor(globalElapsed));

      // 현재 단계 진행률
      const phaseDur = PHASES[currentPhase].duration;
      const phaseProgress = Math.min(1, (globalElapsed - phaseStart) / phaseDur);

      // 전체 진행률
      const totalProgress = Math.min(99, (globalElapsed / totalDuration) * 100);
      setProgress(Math.floor(totalProgress));

      // 씬 상태 업데이트 (merge 단계에서 순차적으로 완료)
      if (currentPhase === 4) {
        const sceneProgress = phaseProgress;
        setScenes((prev) =>
          prev.map((s, i) => {
            const threshold = (i + 1) / prev.length;
            if (sceneProgress >= threshold) return { ...s, state: 'done' };
            if (sceneProgress >= threshold - 1 / prev.length / 2) return { ...s, state: 'active' };
            return { ...s, state: 'pending' };
          }),
        );
      }

      // 단계 전환
      if (globalElapsed - phaseStart >= phaseDur) {
        if (currentPhase < PHASES.length - 1) {
          const finishedPhase = PHASES[currentPhase];
          setMessages((prev) => [
            ...prev,
            {
              id: `m-done-${currentPhase}`,
              role: 'ai',
              text: `✓ ${finishedPhase.label} 완료`,
            },
          ]);
          currentPhase += 1;
          phaseStart = globalElapsed;
          setPhaseIdx(currentPhase);

          const newPhase = PHASES[currentPhase];
          setMessages((prev) => [
            ...prev,
            {
              id: `m-start-${currentPhase}`,
              role: 'ai',
              text: `${newPhase.icon} ${newPhase.description}...`,
            },
          ]);
        } else {
          // 완료
          clearInterval(timer);
          setProgress(100);
          setScenes((prev) => prev.map((s) => ({ ...s, state: 'done' })));
          setCompleted(true);
          setMessages((prev) => [
            ...prev,
            {
              id: 'm-final',
              role: 'ai',
              text: `🎉 영상 제작이 완료됐습니다! 총 ${Math.floor(globalElapsed)}초 소요.\n\n최종 파일: final_video.mp4 (약 84MB, 1920×1080, 30fps)\n\n이제 배포 단계로 넘어가서 YouTube에 업로드할 수 있어요.`,
            },
          ]);
        }
      }
    }, 500);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    const cleanup = startProduction();
    return cleanup;
  }, []);

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
        <StepBar current="studio" />
        <div className={shared.actions}>
          <SeniorToggle onChange={setSenior} />
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => router.push('/publish')}
            disabled={!completed}
          >
            배포하기 →
          </button>
        </div>
      </header>

      <div className={shared.split}>
        {/* LEFT — Preview (Video placeholder + Scenes) */}
        <div className={shared.leftPane}>
          <div className={shared.previewHead}>
            <div className={shared.previewLabel}>영상 제작</div>
            {senior && (
              <div className={shared.seniorBadge}>
                👥 시니어 최적화 · TTS {audienceMeta.ttsSpeed} · 자막 {audienceMeta.subtitlePx}px
              </div>
            )}
            <h1
              className={`${shared.previewHeadline} ${senior ? shared.seniorPreviewHeadline : ''}`}
            >
              {project.title || `${project.keyword}의 숨겨진 진실`}
            </h1>
            <p className={shared.previewDek}>
              {project.category} · {project.duration} · 1920×1080 · 30fps
              {senior && ' · 시니어 자막'}
            </p>
          </div>

          {/* Video Player Placeholder */}
          <div className={styles.videoPlayer}>
            {completed ? (
              <>
                <div className={styles.playerContent}>
                  <div className={styles.playButton}>▶</div>
                  <div className={styles.playerTitle}>
                    {project.title || project.keyword}
                  </div>
                  <div className={styles.playerSub}>클릭하여 재생 · {project.duration}</div>
                </div>
                <div className={styles.playerControls}>
                  <span>0:00</span>
                  <div className={styles.playerProgress}>
                    <div className={styles.playerProgressBar} style={{ width: '0%' }} />
                  </div>
                  <span>{project.duration}</span>
                </div>
              </>
            ) : (
              <div className={styles.playerBuilding}>
                <div className={styles.shimmer} />
                <div className={styles.playerBuildingText}>
                  <div className={styles.spinner} />
                  <span>{PHASES[phaseIdx]?.icon} {PHASES[phaseIdx]?.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Phase Progress */}
          <div className={styles.phaseBox}>
            <div className={styles.phaseHead}>
              <span>제작 진행</span>
              <span className={styles.phaseProgress}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.phases}>
              {PHASES.map((p, i) => {
                const state = i < phaseIdx ? 'done' : i === phaseIdx ? 'active' : 'pending';
                return (
                  <div
                    key={p.id}
                    className={`${styles.phaseRow} ${state === 'done' ? styles.phaseDone : ''} ${state === 'active' ? styles.phaseActive : ''}`}
                  >
                    <div className={styles.phaseIcon}>
                      {state === 'done' ? '✓' : state === 'active' ? <span className={styles.miniSpinner} /> : i + 1}
                    </div>
                    <div className={styles.phaseLabel}>{p.label}</div>
                    {state === 'done' && <div className={styles.phaseStatus}>완료</div>}
                    {state === 'active' && <div className={styles.phaseDots}><span /><span /><span /></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenes */}
          <div className={styles.scenesBox}>
            <div className={styles.scenesHead}>씬 {scenes.length}개</div>
            <div className={styles.scenesGrid}>
              {scenes.map((s, i) => (
                <div
                  key={s.id}
                  className={`${styles.scene} ${s.state === 'done' ? styles.sceneDone : ''} ${s.state === 'active' ? styles.sceneActive : ''}`}
                >
                  <div className={styles.sceneThumb}>
                    {s.state === 'done' ? '🎬' : s.state === 'active' ? '⚙️' : `0${i + 1}`}
                  </div>
                  <div className={styles.sceneInfo}>
                    <div className={styles.sceneTitle}>{s.title}</div>
                    <div className={styles.sceneTime}>{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {completed && (
            <div className={styles.downloadBox}>
              <button className={styles.downloadBtn}>
                ⬇ 영상 파일 다운로드 (84MB)
              </button>
              <div className={styles.fileStats}>
                <span>📁 final_video.mp4</span>
                <span>🎞 1920×1080 · 30fps</span>
                <span>⏱ {project.duration}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Chat / Log */}
        <div className={shared.rightPane}>
          <div className={shared.chatHead}>
            <div className={shared.chatHeadLeft}>
              <div className={shared.aiAvatar}>✦</div>
              <div>
                <div className={shared.chatHeadTitle}>제작 로그</div>
                <div className={shared.chatHeadSub}>
                  <span className={shared.chatDot}></span>
                  {completed ? '완료' : `${elapsed}초 경과`}
                </div>
              </div>
            </div>
          </div>

          <div className={shared.messages}>
            {messages.map((m) => (
              <div key={m.id} className={`${shared.msg} ${shared.msgAi}`}>
                <div className={shared.msgHead}>
                  <span className={shared.msgAuthor}>✦ AI</span>
                </div>
                <div className={shared.msgBubble}>
                  {m.text.split('\n').map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>
            ))}
            {!completed && (
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

          {completed && (
            <div className={shared.composer}>
              <div className={shared.inputRow} style={{ opacity: 0.5 }}>
                <input type="text" placeholder="영상 제작 완료 — 배포 단계로 진행하세요" disabled />
              </div>
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <button
                  className={`${shared.btn} ${shared.btnPrimary}`}
                  style={{ width: '100%', height: 42, fontSize: 15 }}
                  onClick={() => router.push('/publish')}
                >
                  배포 단계로 넘어가기 →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
