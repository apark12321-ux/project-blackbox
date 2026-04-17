'use client';

/**
 * frontend/app/keyword/page.tsx
 * AlgoMaker · 1단계 · 키워드 발굴
 * 좌측: 카테고리 + 키워드 목록 (블루오션 분석)
 * 우측: AI 채팅 (카테고리 추천, 키워드 설명)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import shared from '../_shared/shared.module.css';
import styles from './keyword.module.css';
import {
  FontLoader,
  StepBar,
  SeniorToggle,
  getProject,
  setProject,
  getAudienceMeta,
} from '../_shared/StepBar';

interface Category {
  slug: string;
  label: string;
  icon: string;
  cpm: string;
  desc: string;
}

interface Keyword {
  keyword: string;
  boi: number;           // Blue Ocean Index 0-5
  boiGrade: string;      // A+, A, B+, B, C
  boiColor: string;
  searchVol: number;     // monthly searches
  competition: number;   // competing videos
  difficulty: '낮음' | '보통' | '높음';
  cpm: number;
  momentum: number;      // 0-1
  trend: '급상승' | '상승' | '유지' | '하락';
  estRev: number;        // estimated monthly revenue USD
}

const CATEGORIES: Category[] = [
  { slug: 'economy', label: '경제', icon: '📊', cpm: '$12~18', desc: '주식·부동산·연금·절세' },
  { slug: 'senior', label: '건강', icon: '🏥', cpm: '$15~22', desc: '건강관리·연금·복지' },
  { slug: 'selfdev', label: '자기계발', icon: '🧠', cpm: '$8~14', desc: '습관·독서·마인드셋' },
  { slug: 'tech', label: 'IT', icon: '💻', cpm: '$10~16', desc: 'AI·앱·디지털 트렌드' },
  { slug: 'life', label: '라이프', icon: '🌿', cpm: '$6~12', desc: '요리·여행·인테리어' },
];

const KEYWORDS_BY_CAT: Record<string, Keyword[]> = {
  economy: [
    { keyword: '주식 급등 작전', boi: 4.7, boiGrade: 'A+', boiColor: '#16a34a', searchVol: 12000, competition: 3200, difficulty: '낮음', cpm: 18, momentum: 0.28, trend: '급상승', estRev: 6500 },
    { keyword: '기초연금 인상', boi: 4.2, boiGrade: 'A', boiColor: '#22c55e', searchVol: 18000, competition: 8500, difficulty: '보통', cpm: 15, momentum: 0.18, trend: '상승', estRev: 8100 },
    { keyword: '부동산 세금 폭탄', boi: 3.9, boiGrade: 'A', boiColor: '#22c55e', searchVol: 9500, competition: 5800, difficulty: '보통', cpm: 17, momentum: 0.12, trend: '상승', estRev: 4800 },
    { keyword: '연말정산 환급', boi: 3.5, boiGrade: 'B+', boiColor: '#d4a537', searchVol: 22000, competition: 18500, difficulty: '높음', cpm: 14, momentum: 0.05, trend: '유지', estRev: 9200 },
    { keyword: '코인 단타 심리', boi: 4.4, boiGrade: 'A', boiColor: '#22c55e', searchVol: 7800, competition: 4100, difficulty: '낮음', cpm: 16, momentum: 0.22, trend: '급상승', estRev: 3700 },
    { keyword: '은퇴 자산 배분', boi: 4.1, boiGrade: 'A', boiColor: '#22c55e', searchVol: 5200, competition: 2800, difficulty: '낮음', cpm: 20, momentum: 0.16, trend: '상승', estRev: 3100 },
    { keyword: '전세 대출 규제', boi: 3.3, boiGrade: 'B+', boiColor: '#d4a537', searchVol: 14500, competition: 11200, difficulty: '높음', cpm: 13, momentum: -0.08, trend: '하락', estRev: 5700 },
    { keyword: '주식 세력 매집', boi: 4.5, boiGrade: 'A+', boiColor: '#16a34a', searchVol: 6800, competition: 2100, difficulty: '낮음', cpm: 17, momentum: 0.25, trend: '급상승', estRev: 3500 },
  ],
  senior: [
    { keyword: '무릎 통증 완화', boi: 4.3, boiGrade: 'A', boiColor: '#22c55e', searchVol: 15000, competition: 6200, difficulty: '보통', cpm: 19, momentum: 0.14, trend: '상승', estRev: 8600 },
    { keyword: '치매 예방 습관', boi: 4.6, boiGrade: 'A+', boiColor: '#16a34a', searchVol: 9800, competition: 3400, difficulty: '낮음', cpm: 22, momentum: 0.21, trend: '급상승', estRev: 6500 },
    { keyword: '당뇨 수치 관리', boi: 4.0, boiGrade: 'A', boiColor: '#22c55e', searchVol: 11200, competition: 6800, difficulty: '보통', cpm: 20, momentum: 0.1, trend: '상승', estRev: 6700 },
    { keyword: '시니어 재취업', boi: 4.4, boiGrade: 'A', boiColor: '#22c55e', searchVol: 4300, competition: 1500, difficulty: '낮음', cpm: 16, momentum: 0.19, trend: '상승', estRev: 2100 },
  ],
  selfdev: [
    { keyword: '아침 루틴 5분', boi: 3.8, boiGrade: 'A', boiColor: '#22c55e', searchVol: 19500, competition: 12000, difficulty: '보통', cpm: 10, momentum: 0.08, trend: '상승', estRev: 5900 },
    { keyword: '몰입 독서법', boi: 4.2, boiGrade: 'A', boiColor: '#22c55e', searchVol: 6800, competition: 2200, difficulty: '낮음', cpm: 12, momentum: 0.18, trend: '상승', estRev: 2400 },
  ],
  tech: [
    { keyword: 'AI 에이전트 활용', boi: 4.5, boiGrade: 'A+', boiColor: '#16a34a', searchVol: 8200, competition: 2800, difficulty: '낮음', cpm: 14, momentum: 0.35, trend: '급상승', estRev: 3400 },
    { keyword: '코딩 자동화', boi: 4.1, boiGrade: 'A', boiColor: '#22c55e', searchVol: 5400, competition: 2100, difficulty: '낮음', cpm: 15, momentum: 0.22, trend: '급상승', estRev: 2400 },
  ],
  life: [
    { keyword: '1인 가구 요리', boi: 3.6, boiGrade: 'B+', boiColor: '#d4a537', searchVol: 28000, competition: 22000, difficulty: '높음', cpm: 8, momentum: 0.05, trend: '유지', estRev: 6700 },
    { keyword: '홈카페 인테리어', boi: 4.0, boiGrade: 'A', boiColor: '#22c55e', searchVol: 12500, competition: 5800, difficulty: '보통', cpm: 10, momentum: 0.13, trend: '상승', estRev: 3800 },
  ],
};

interface Msg {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function KeywordPage() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedKw, setSelectedKw] = useState<string | null>(null);
  const [senior, setSenior] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'm1',
      role: 'ai',
      text: '안녕하세요! 어떤 주제의 영상을 만드실까요?\n\n카테고리를 선택하시거나 관심 키워드를 직접 말씀해 주세요. 제가 블루오션 분석으로 수익 가능성이 높은 키워드를 추천해드릴게요.',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSenior(getProject().seniorMode);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const keywords = selectedCat ? KEYWORDS_BY_CAT[selectedCat] || [] : [];
  const audienceMeta = getAudienceMeta(senior);

  const pickCat = (slug: string) => {
    setSelectedCat(slug);
    setSelectedKw(null);
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', text: `${cat.label} 카테고리로 할래요` },
        {
          id: `a-${Date.now()}`,
          role: 'ai',
          text: `${cat.icon} ${cat.label} 카테고리 선택됐습니다. 예상 CPM ${cat.cpm}대 · ${cat.desc}.\n\n블루오션 점수 높은 키워드 ${KEYWORDS_BY_CAT[slug]?.length || 0}개를 왼쪽에 정렬해 뒀어요. A+ 등급이 수익 기회가 가장 큰 키워드입니다.`,
        },
      ]);
    }
  };

  const pickKw = (kw: string) => {
    setSelectedKw(kw);
    const k = keywords.find((x) => x.keyword === kw);
    if (k) {
      setProject({
        keyword: kw,
        category: CATEGORIES.find((c) => c.slug === selectedCat)?.label || '',
      });
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', text: `"${kw}" 선택` },
        {
          id: `a-${Date.now()}`,
          role: 'ai',
          text: `"${kw}" 좋은 선택이에요!\n\n▪ 블루오션 점수: ${k.boi}/5 (${k.boiGrade})\n▪ 월 검색량: ${k.searchVol.toLocaleString()}회\n▪ 경쟁 영상: ${k.competition.toLocaleString()}개 (${k.difficulty})\n▪ 예상 월 수익: $${k.estRev.toLocaleString()}\n▪ 트렌드: ${k.trend}\n\n다음 단계에서 이 키워드 관련 최신 뉴스를 모아드릴게요. 오른쪽 상단 [뉴스 수집 →] 버튼 누르시면 됩니다.`,
        },
      ]);
    }
  };

  const handleSend = () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: t },
      {
        id: `a-${Date.now() + 1}`,
        role: 'ai',
        text: '좋은 의견이에요. 왼쪽 목록에서 하나를 선택하시거나 카테고리를 먼저 고르시는 게 좋겠어요. A+ 등급은 경쟁이 적고 CPM이 높아서 추천해요.',
      },
    ]);
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
        <StepBar current="keyword" />
        <div className={shared.actions}>
          <SeniorToggle onChange={setSenior} />
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => router.push('/news')}
          >
            뉴스 수집 →
          </button>
        </div>
      </header>

      <div className={shared.split}>
        <div className={shared.leftPane}>
          <div className={shared.previewHead}>
            <div className={shared.previewLabel}>1단계 · 키워드 발굴</div>
            {senior && (
              <div className={shared.seniorBadge}>
                👥 시니어 · CPM {audienceMeta.cpm} · 고단가 키워드 우선 표시
              </div>
            )}
            <h1 className={shared.previewHeadline}>블루오션 키워드를 찾아드려요</h1>
            <p className={shared.previewDek}>
              AI가 검색량 대비 경쟁도를 분석해 수익 가능성이 높은 키워드를 추천합니다.
            </p>
          </div>

          {/* Categories */}
          <div className={styles.sectionHead}>
            <span>카테고리</span>
            <span className={styles.hint}>CPM은 광고 단가입니다</span>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                className={`${styles.catBtn} ${selectedCat === c.slug ? styles.catSelected : ''}`}
                onClick={() => pickCat(c.slug)}
              >
                <div className={styles.catIcon}>{c.icon}</div>
                <div className={styles.catLabel}>{c.label}</div>
                <div className={styles.catCpm}>{c.cpm}</div>
              </button>
            ))}
          </div>

          {/* Keywords */}
          {selectedCat && keywords.length > 0 && (
            <>
              <div className={styles.sectionHead} style={{ marginTop: 20 }}>
                <span>황금 키워드 ({keywords.length}개)</span>
                <span className={styles.hint}>블루오션 점수 순</span>
              </div>
              <div className={styles.kwList}>
                {keywords.map((k, i) => (
                  <div
                    key={k.keyword}
                    className={`${styles.kwCard} ${selectedKw === k.keyword ? styles.kwSelected : ''}`}
                    onClick={() => pickKw(k.keyword)}
                  >
                    <div className={styles.kwTop}>
                      <span className={styles.kwIdx}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.kwName}>{k.keyword}</span>
                      <span
                        className={styles.kwGrade}
                        style={{ color: k.boiColor, background: `${k.boiColor}18` }}
                      >
                        {k.boiGrade}
                      </span>
                      <span
                        className={styles.kwTrend}
                        style={{ color: k.momentum > 0.15 ? '#16a34a' : k.momentum > 0 ? '#d4a537' : '#f87171' }}
                      >
                        {k.momentum > 0.15 ? '▲' : k.momentum > 0 ? '→' : '▼'}
                      </span>
                    </div>

                    <div className={styles.kwBoi}>
                      <span>블루오션</span>
                      <span className={styles.kwBoiVal} style={{ color: k.boiColor }}>
                        {k.boi.toFixed(1)}/5.0
                      </span>
                      <span className={styles.kwRev}>💰 월 ${k.estRev.toLocaleString()}</span>
                    </div>
                    <div className={styles.kwBar}>
                      <div
                        className={styles.kwBarFill}
                        style={{
                          width: `${(k.boi / 5) * 100}%`,
                          background: `linear-gradient(90deg, ${k.boiColor}88, ${k.boiColor})`,
                        }}
                      />
                    </div>

                    <div className={styles.kwStats}>
                      <div>
                        <div className={styles.kwStatLabel}>월 검색</div>
                        <div className={styles.kwStatVal}>{k.searchVol >= 1000 ? `${(k.searchVol / 1000).toFixed(0)}K` : k.searchVol}</div>
                      </div>
                      <div>
                        <div className={styles.kwStatLabel}>CPM</div>
                        <div className={styles.kwStatVal} style={{ color: '#d4a537' }}>${k.cpm}</div>
                      </div>
                      <div>
                        <div className={styles.kwStatLabel}>경쟁</div>
                        <div
                          className={styles.kwStatVal}
                          style={{
                            color: k.difficulty === '높음' ? '#f87171' : k.difficulty === '보통' ? '#d4a537' : '#16a34a',
                          }}
                        >
                          {k.difficulty}
                        </div>
                      </div>
                      <div>
                        <div className={styles.kwStatLabel}>성장세</div>
                        <div className={styles.kwStatVal}>{k.trend}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!selectedCat && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <div>카테고리를 선택하세요</div>
            </div>
          )}
        </div>

        <div className={shared.rightPane}>
          <div className={shared.chatHead}>
            <div className={shared.chatHeadLeft}>
              <div className={shared.aiAvatar}>✦</div>
              <div>
                <div className={shared.chatHeadTitle}>AlgoMaker AI</div>
                <div className={shared.chatHeadSub}>
                  <span className={shared.chatDot}></span>대기 중
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
            <div ref={messagesEndRef} />
          </div>

          <div className={shared.composer}>
            <div className={shared.inputRow}>
              <input
                type="text"
                placeholder="예: 경제 카테고리 추천해줘"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className={shared.sendBtn} onClick={handleSend} disabled={!input.trim()}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
