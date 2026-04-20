'use client';

/**
 * frontend/app/publish/page.tsx
 * AlgoMaker · 배포 단계 (YouTube 업로드 시연)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import shared from '../_shared/shared.module.css';
import styles from './publish.module.css';
import {
  FontLoader,
  StepBar,
  SeniorToggle,
  getProject,
  getAudienceMeta,
  getSeniorThumbnail,
} from '../_shared/StepBar';
import { generateContent } from '../_shared/contentEngine';
import { fetchSeo } from '../../lib/api';

interface SeoData {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
}

interface Msg {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

const SUGGESTIONS = [
  '제목을 더 자극적으로',
  '태그 3개 더 추천',
  '설명란 길이 줄여줘',
  '썸네일 시안 추천',
  '업로드 시간 알려줘',
];

const PRESET_SEO: SeoData = {
  title: '개미들이 3일 만에 전액을 잃은 이유 | 주식 급등 작전의 진실',
  description:
    '하루 만에 400% 오른 종목, 72시간 뒤엔 모두 손실로 끝났습니다.\n\n이 영상에서 다룬 내용:\n• 작전 3단계 메커니즘 (매집 → 띄우기 → 탈출)\n• 금감원 2조 원 피해 통계의 배경\n• 리딩방 · 단톡방의 역할\n• 개인 투자자가 피해야 할 3대 경고 신호\n\n✓ 공식 통계와 증권사 리포트 기반\n✓ 팩트체크 완료\n\n#주식 #투자 #금융사기',
  tags: ['주식', '주식투자', '급등주', '작전주', '불공정거래', '개미투자자', '금융사기', '주식초보', '주식공부', '경제뉴스'],
  thumbnail: '400%의 환상 · 72시간의 침묵',
};

type UploadStage = 'idle' | 'uploading' | 'processing' | 'published';

export default function PublishPage() {
  const router = useRouter();
  const [project, setProjectState] = useState(() => ({ keyword: '주식 급등 작전', category: '경제', title: '', duration: '8분 30초', seniorMode: false }));
  const [senior, setSenior] = useState(false);
  const [seo, setSeo] = useState<SeoData>(PRESET_SEO);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [highlight, setHighlight] = useState<'title' | 'description' | 'tags' | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoId, setVideoId] = useState('');

  const audienceMeta = getAudienceMeta(senior);
  const safetyScore = audienceMeta.algoShield;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProject();
    setProjectState(p);
    setSenior(p.seniorMode);
    const meta = getAudienceMeta(p.seniorMode);

    (async () => {
      // 1순위: Gemini SEO 최적화 실제 호출
      const result = await fetchSeo(p.keyword, p.category, p.seniorMode);
      let seoData: any;
      let sourceLabel = '';

      if (result.source === 'gemini' && result.data?.seoTitle) {
        seoData = result.data;
        sourceLabel = 'Google Gemini AI';
      } else {
        // Fallback: 로컬 엔진
        const content = generateContent({
          keyword: p.keyword,
          category: p.category,
          senior: p.seniorMode,
        });
        seoData = {
          seoTitle: content.seoTitle,
          description: content.description,
          tags: content.tags,
          thumbnail: content.thumbnail,
        };
        sourceLabel = '시뮬레이션 (API 실패 시 자동 전환)';
      }

      setSeo({
        title: seoData.seoTitle,
        description: seoData.description,
        tags: seoData.tags,
        thumbnail: seoData.thumbnail,
      });

      setMessages([
        {
          id: 'm1',
          role: 'ai',
          text: p.seniorMode
            ? `✨ ${sourceLabel}로 SEO 최적화 완료.\n\n👥 시니어 타겟 · 수익화 안전도: ${meta.algoShield}/100 (${meta.grade})\n예상 CPM: ${meta.cpm} (광고주 친화도 높음)\n\n▪ 제목: "${seoData.seoTitle}"\n▪ 태그 ${seoData.tags.length}개 · 50+ 시청자 맞춤\n▪ 썸네일: 시니어 큰글씨\n\n준비되면 [YouTube 업로드] 버튼을 눌러주시면 됩니다.`
            : `✨ ${sourceLabel}로 SEO 최적화 완료.\n\n수익화 안전도: ${meta.algoShield}/100 (${meta.grade}) · 예상 CPM: ${meta.cpm}\n\n▪ 제목: "${seoData.seoTitle}"\n  (YouTube SEO 2026 규칙 적용: 키워드 전진배치 + 숫자 + 괄호)\n▪ 태그 ${seoData.tags.length}개 (주 키워드 + 고CPM)\n▪ 썸네일 카피: 4단어 이내 (CTR 최적화)\n\n필요하면 수정 요청 주세요.`,
        },
      ]);
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || generating) return;
    setInput('');
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setGenerating(true);

    setTimeout(() => {
      const { updated, reply, field } = refineSeo(text, seo);
      setSeo(updated);
      setHighlight(field);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'ai', text: reply }]);
      setGenerating(false);
      setTimeout(() => setHighlight(null), 2000);
    }, 1000);
  };

  const handleUpload = () => {
    if (uploadStage !== 'idle') return;
    setUploadStage('uploading');
    setUploadProgress(0);

    // Stage 1: 업로드 (8초)
    const uploadTimer = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          clearInterval(uploadTimer);
          setUploadStage('processing');
          setTimeout(() => {
            // Stage 2: 처리 (5초 후 완료)
            setUploadStage('published');
            setVideoId(
              Math.random().toString(36).slice(2, 13),
            );
          }, 5000);
          return 100;
        }
        return next;
      });
    }, 160);
  };

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
        <StepBar current="publish" />
        <div className={shared.actions}>
          <button
            className={shared.btnBack}
            onClick={() => router.push('/studio')}
          >
            ← 영상
          </button>
          <SeniorToggle onChange={setSenior} />
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => router.push('/done')}
          >
            완료 →
          </button>
        </div>
      </header>

      <div className={shared.split}>
        {/* LEFT — SEO Preview + YouTube Upload */}
        <div className={shared.leftPane}>
          <div className={shared.previewHead}>
            <div className={shared.previewLabel}>YouTube 업로드 준비</div>
            {senior && (
              <div className={shared.seniorBadge}>
                👥 시니어 타겟 · CPM {audienceMeta.cpm} · 안전도 {audienceMeta.algoShield}
              </div>
            )}
            <h1 className={shared.previewHeadline}>배포 최적화</h1>
            <p className={shared.previewDek}>
              {senior
                ? '시니어 시청자 · 고CPM · 안전도 ·  SEO'
                : 'SEO · 수익화 안전도 · 업로드 스케줄'}
            </p>
          </div>

          {/* Safety Score */}
          <div className={styles.scoreBox}>
            <div className={styles.scoreLeft}>
              <div className={styles.scoreLabel}>수익화 안전도</div>
              <div className={styles.scoreValue}>{safetyScore}</div>
              <div className={styles.scoreGrade}>Grade {audienceMeta.grade}</div>
            </div>
            <div className={styles.scoreRight}>
              <div className={styles.scoreBar}>
                <div className={styles.scoreFill} style={{ width: `${safetyScore}%` }} />
              </div>
              <div className={styles.scoreChecks}>
                <div className={styles.scoreCheck}>✓ 저작권 · 라이선스 통과</div>
                <div className={styles.scoreCheck}>✓ 허위정보 · 음모론 필터 통과</div>
                <div className={styles.scoreCheck}>✓ 광고주 친화 콘텐츠</div>
                <div className={styles.scoreCheck}>✓ 유튜브 커뮤니티 가이드라인 준수</div>
              </div>
            </div>
          </div>

          {/* YouTube Upload Card */}
          <div className={styles.ytCard}>
            <div className={styles.ytHead}>
              <div className={styles.ytLogo}>
                <span>▶</span>
              </div>
              <div>
                <div className={styles.ytTitle}>YouTube Studio</div>
                <div className={styles.ytSub}>한줄컴퍼니 · 자동 업로드</div>
              </div>
              <div className={styles.ytStatus}>
                {uploadStage === 'idle' && <span className={styles.ytReady}>준비됨</span>}
                {uploadStage === 'uploading' && <span className={styles.ytUploading}>업로드 중</span>}
                {uploadStage === 'processing' && <span className={styles.ytProcessing}>처리 중</span>}
                {uploadStage === 'published' && <span className={styles.ytPublished}>게시됨</span>}
              </div>
            </div>

            <div className={styles.ytBody}>
              {/* Thumbnail */}
              <div className={styles.thumbnail}>
                <div className={styles.thumbOverlay}>
                  <span
                    className={`${styles.thumbTitle} ${senior ? styles.thumbTitleSenior : ''}`}
                  >
                    {seo.thumbnail}
                  </span>
                </div>
                <div className={styles.thumbBadge}>{project.duration}</div>
              </div>

              {/* Metadata */}
              <div className={styles.metadata}>
                <div className={`${styles.metaField} ${highlight === 'title' ? styles.fieldHighlight : ''}`}>
                  <div className={styles.metaLabel}>제목</div>
                  <div className={styles.metaValue}>{seo.title}</div>
                </div>
                <div className={`${styles.metaField} ${highlight === 'description' ? styles.fieldHighlight : ''}`}>
                  <div className={styles.metaLabel}>설명</div>
                  <div className={styles.metaValueMulti}>
                    {seo.description.split('\n').slice(0, 4).map((line, i) => (
                      <div key={i}>{line || <br />}</div>
                    ))}
                    {seo.description.split('\n').length > 4 && (
                      <div className={styles.metaMore}>+ 더 보기</div>
                    )}
                  </div>
                </div>
                <div className={`${styles.metaField} ${highlight === 'tags' ? styles.fieldHighlight : ''}`}>
                  <div className={styles.metaLabel}>태그</div>
                  <div className={styles.tagList}>
                    {seo.tags.map((t, i) => (
                      <span key={i} className={styles.tag}>#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadStage === 'uploading' && (
                <div className={styles.uploadProgress}>
                  <div className={styles.uploadHead}>
                    <span>파일 업로드 중...</span>
                    <span className={styles.uploadPercent}>{uploadProgress}%</span>
                  </div>
                  <div className={styles.uploadBar}>
                    <div className={styles.uploadFill} style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <div className={styles.uploadSub}>
                    📤 final_video.mp4 (84MB) · {Math.floor((uploadProgress * 0.84) / 10)}MB / 84MB
                  </div>
                </div>
              )}

              {uploadStage === 'processing' && (
                <div className={styles.processingBox}>
                  <div className={styles.processSpinner} />
                  <div>
                    <div className={styles.processTitle}>YouTube에서 영상 처리 중...</div>
                    <div className={styles.processSub}>
                      HD 인코딩 · 썸네일 생성 · 자막 동기화
                    </div>
                  </div>
                </div>
              )}

              {uploadStage === 'published' && (
                <div className={styles.publishedBox}>
                  <div className={styles.publishedIcon}>✓</div>
                  <div>
                    <div className={styles.publishedTitle}>게시 완료!</div>
                    <div className={styles.publishedLink}>
                      youtube.com/watch?v={videoId}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {uploadStage === 'idle' && (
                <button className={styles.uploadBtn} onClick={handleUpload}>
                  <span className={styles.uploadBtnIcon}>⬆</span>
                  YouTube에 업로드
                </button>
              )}
              {uploadStage === 'published' && (
                <div className={styles.publishedActions}>
                  <button className={styles.publishedBtn}>
                    📊 YouTube Studio에서 보기
                  </button>
                  <button
                    className={styles.publishedBtn2}
                    onClick={() => router.push('/done')}
                  >
                    완료 →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Recommendation */}
          <div className={styles.scheduleBox}>
            <div className={styles.scheduleHead}>
              <span>📅 추천 업로드 시간</span>
            </div>
            <div className={styles.scheduleBody}>
              <div className={styles.scheduleTime}>{audienceMeta.bestTime}</div>
              <div className={styles.scheduleReason}>
                {audienceMeta.bestTimeReason}
              </div>
            </div>
          </div>
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
                  {generating ? '최적화 중…' : '대기 중'}
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
                  <span className={shared.msgAuthor}>{m.role === 'ai' ? '✦ AI' : '나'}</span>
                </div>
                <div className={shared.msgBubble}>
                  {m.text.split('\n').map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>
            ))}
            {generating && (
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
                  disabled={generating || uploadStage !== 'idle'}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className={shared.inputRow}>
              <input
                type="text"
                placeholder="AI에게 요청하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={generating || uploadStage !== 'idle'}
              />
              <button
                className={shared.sendBtn}
                onClick={handleSend}
                disabled={generating || !input.trim() || uploadStage !== 'idle'}
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

function refineSeo(
  userText: string,
  seo: SeoData,
): { updated: SeoData; reply: string; field: 'title' | 'description' | 'tags' | null } {
  const t = userText.toLowerCase();
  const updated = { ...seo };
  let field: 'title' | 'description' | 'tags' | null = null;
  let reply = '';

  if (/(제목|타이틀|title)/.test(t)) {
    field = 'title';
    if (/자극|강하|클릭/.test(t)) {
      updated.title = '[충격] 개미들이 3일 만에 전액 잃은 이유 | 주식 급등 작전 최초 공개';
      reply = '제목을 클릭 유도형으로 바꿨습니다. "[충격]" 대괄호 태그로 CTR 평균 +22%, "최초 공개"로 호기심 유발했어요.';
    } else {
      updated.title = '주식 급등 작전의 진실, 지금 공개합니다 | 개미 투자자 필수 시청';
      reply = '제목을 좀 더 정보성 있게 다듬었습니다.';
    }
  } else if (/(설명|description|디스크립션)/.test(t)) {
    field = 'description';
    if (/짧|줄|간단/.test(t)) {
      updated.description = `하루 만에 400% 오른 종목, 72시간 뒤엔 모두 손실로 끝났습니다.\n\n작전 3단계의 진실과 개인 투자자가 피해야 할 3대 경고 신호를 공개합니다.\n\n✓ 팩트체크 완료 · 공식 통계 기반\n\n#주식 #투자 #금융사기`;
      reply = '설명란을 핵심만 남기고 짧게 다듬었습니다. 모바일에서 "더 보기" 없이 한 번에 보이도록요.';
    } else {
      updated.description = seo.description + '\n\n[추가 정보]\n금감원 공시자료 · 한국거래소 통계 · 2020~2024 누적 피해 현황 분석';
      reply = '설명에 추가 정보 섹션을 넣었습니다. 신뢰도와 SEO에 모두 도움 될 거예요.';
    }
  } else if (/(태그|tag|해시태그)/.test(t)) {
    field = 'tags';
    updated.tags = [...seo.tags, '주식사기', '투자사기', '급등주의', '작전세력'];
    reply = '태그 4개를 추가했습니다 (주식사기, 투자사기, 급등주의, 작전세력). 고CPM 키워드와 검색 트렌드 기반입니다.';
  } else if (/(썸네일|thumb)/.test(t)) {
    updated.thumbnail = '작전 3단계 · 그 끝은 감옥';
    reply = '썸네일 카피를 더 강렬하게 바꿨습니다. "그 끝은 감옥" 같은 엔딩 스포일러가 CTR을 크게 올립니다.';
  } else if (/(업로드|시간|스케줄)/.test(t)) {
    reply =
      '경제 카테고리 기준 최적 업로드 시간은:\n\n1) 평일 오후 8:00-9:30 (퇴근 후 피크)\n2) 일요일 오전 9:00-10:30 (주말 정보 탐색)\n\n내일 화요일 오후 8:00 업로드를 가장 추천드려요.';
  } else {
    reply = '요청을 반영했습니다. 제목, 설명, 태그 중 어떤 부분을 주로 바꿀까요?';
  }

  return { updated, reply, field };
}
