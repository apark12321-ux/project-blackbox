'use client';

/**
 * frontend/app/news/page.tsx
 * AlgoMaker · 2단계 · 뉴스 큐레이션
 * 좌측: 뉴스 피드 (선택한 키워드의 최신 뉴스)
 * 우측: AI 채팅 (뉴스 선택 조언)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import shared from '../_shared/shared.module.css';
import styles from './news.module.css';
import {
  FontLoader,
  StepBar,
  SeniorToggle,
  getProject,
  getAudienceMeta,
} from '../_shared/StepBar';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  credibility: '높음' | '보통';
  relevance: number;      // 0-1
  cpmTier: 'High' | 'Mid' | 'Low';
  publishedAt: string;    // "10월 12일"
  keyFacts: string[];
  selected?: boolean;
}

function buildNews(keyword: string): NewsItem[] {
  return [
    {
      id: 'n1',
      title: `"${keyword}" 관련 개인 투자자 피해액 2조 원 돌파`,
      summary: '금융감독원이 발표한 최근 2년 통계에 따르면, 조직적 시세조종 피해가 꾸준히 늘고 있다. 피해자 다수가 40~60대 개인 투자자로 확인됐다.',
      source: '연합뉴스',
      credibility: '높음',
      relevance: 0.92,
      cpmTier: 'High',
      publishedAt: '어제',
      keyFacts: [
        '2년간 143건 사례 · 누적 피해액 2조 원',
        '평균 건당 피해액 1억 7천만 원',
      ],
    },
    {
      id: 'n2',
      title: `${keyword}의 패턴, AI 분석으로 드러나다`,
      summary: '증권사 리포트에 따르면 세 가지 공통 패턴이 확인됐다. 1) 저점 매집, 2) 가짜 호재 유포, 3) 탈출. 이 패턴이 70% 이상 반복된다고 한다.',
      source: '한국경제',
      credibility: '높음',
      relevance: 0.88,
      cpmTier: 'High',
      publishedAt: '2일 전',
      keyFacts: [
        '세 단계 패턴 · 저점매집 → 호재유포 → 탈출',
        '해당 패턴 재현율 70% 이상',
      ],
    },
    {
      id: 'n3',
      title: '리딩방·단톡방을 통한 조직적 시세조종 적발',
      summary: '경찰이 비공개 단톡방 3곳을 적발, 운영자 5명을 구속했다. 피해자만 800명이 넘으며 피해액은 320억 원으로 추산된다.',
      source: 'KBS뉴스',
      credibility: '높음',
      relevance: 0.85,
      cpmTier: 'Mid',
      publishedAt: '3일 전',
      keyFacts: [
        '단톡방 3곳 적발 · 운영자 5명 구속',
        '피해자 800명 · 피해액 320억 원',
      ],
    },
    {
      id: 'n4',
      title: '"저도 당했다" — 피해자 인터뷰 모음',
      summary: '직장인 김모씨(45)는 "리딩방 추천 종목에 전 재산을 넣었다가 3일 만에 70% 손실을 봤다"고 말했다. 유사 사례가 계속 나오고 있다.',
      source: 'SBS뉴스',
      credibility: '높음',
      relevance: 0.78,
      cpmTier: 'Mid',
      publishedAt: '4일 전',
      keyFacts: [
        '3일 만에 70% 손실 사례',
        '40~50대 직장인 피해 집중',
      ],
    },
    {
      id: 'n5',
      title: '금융당국, 시세조종 단속 강화 방침 발표',
      summary: '금융위원회가 AI 기반 이상거래 탐지 시스템을 2026년 상반기 내 구축한다고 밝혔다. 적발 시 최대 징역 7년 처벌 가능.',
      source: '조선비즈',
      credibility: '높음',
      relevance: 0.71,
      cpmTier: 'Mid',
      publishedAt: '5일 전',
      keyFacts: [
        'AI 기반 이상거래 탐지 시스템 도입',
        '최대 징역 7년 처벌',
      ],
    },
    {
      id: 'n6',
      title: '투자자 보호 3대 원칙 — 전문가가 말하는 방어법',
      summary: '"거래량 급변, 정체불명 호재, 리딩방 추천 — 이 세 가지가 겹치면 무조건 피하라"고 애널리스트가 조언했다.',
      source: 'MBC뉴스',
      credibility: '높음',
      relevance: 0.74,
      cpmTier: 'High',
      publishedAt: '5일 전',
      keyFacts: [
        '3대 경고 신호 · 거래량·호재·리딩방',
        '세 조건 겹치면 무조건 회피',
      ],
    },
  ];
}

interface Msg {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [project, setProjectState] = useState(() => ({
    keyword: '주식 급등 작전',
    category: '경제',
    title: '',
    duration: '8분 30초',
    seniorMode: false,
  }));
  const [senior, setSenior] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProject();
    setProjectState(p);
    setSenior(p.seniorMode);
    setTimeout(() => {
      const items = buildNews(p.keyword);
      setNews(items);
      // 기본으로 상위 2개 자동 선택
      setSelectedIds(new Set([items[0].id, items[1].id]));
      setMessages([
        {
          id: 'm1',
          role: 'ai',
          text: `"${p.keyword}" 관련 최근 7일 뉴스 ${items.length}건을 AI가 자동 수집했어요.\n\n관련도 높은 기사 ${items.filter(n => n.relevance >= 0.8).length}건, 신뢰도 높은 출처(KBS·SBS·MBC·연합뉴스·조선비즈·한국경제)만 선별했습니다.\n\n상위 2건을 기본 선택해뒀어요. 2~4건이 대본 작성에 적당합니다.`,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const audienceMeta = getAudienceMeta(senior);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
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
        text: '말씀하신 내용 반영했어요. 왼쪽에서 관련도가 높은 기사들 2~4건 선택하시고 [대본 만들기 →] 누르시면 AI가 선택한 뉴스 기반으로 롱폼 대본을 작성해드립니다.',
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
        <StepBar current="news" />
        <div className={shared.actions}>
          <button className={shared.btnBack} onClick={() => router.push('/keyword')}>
            ← 키워드
          </button>
          <SeniorToggle onChange={setSenior} />
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => router.push('/script')}
          >
            대본 만들기 →
          </button>
        </div>
      </header>

      <div className={shared.split}>
        <div className={shared.leftPane}>
          <div className={shared.previewHead}>
            <div className={shared.previewLabel}>2단계 · 뉴스 큐레이션</div>
            {senior && (
              <div className={shared.seniorBadge}>
                👥 시니어 · 신뢰도 높은 기성 언론 우선 표시
              </div>
            )}
            <h1 className={shared.previewHeadline}>
              "{project.keyword}" 관련 뉴스 {news.length}건
            </h1>
            <p className={shared.previewDek}>
              최근 7일 기준 · {project.category} 카테고리 · AI가 관련도·신뢰도 점수화
            </p>
            <div className={shared.statsPills}>
              <div className={shared.statPill}>
                선택 <strong className={shared.statValue}>{selectedIds.size}</strong>
              </div>
              <div className={shared.statPill}>
                관련도 높음{' '}
                <strong className={shared.statValue}>
                  {news.filter((n) => n.relevance >= 0.8).length}건
                </strong>
              </div>
              <div className={shared.statPill}>
                고신뢰도{' '}
                <strong className={shared.statValue}>
                  {news.filter((n) => n.credibility === '높음').length}건
                </strong>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <div>AI가 뉴스를 수집 중...</div>
            </div>
          ) : (
            <div className={styles.newsList}>
              {news.map((n) => {
                const isSel = selectedIds.has(n.id);
                const relColor = n.relevance >= 0.85 ? '#16a34a' : n.relevance >= 0.7 ? '#d4a537' : '#9ca3af';
                const tierColor = n.cpmTier === 'High' ? '#16a34a' : n.cpmTier === 'Mid' ? '#d4a537' : '#71717a';
                return (
                  <div
                    key={n.id}
                    className={`${styles.newsCard} ${isSel ? styles.newsSelected : ''}`}
                    onClick={() => toggleSelect(n.id)}
                  >
                    <div className={styles.newsHead}>
                      <div className={`${styles.checkBox} ${isSel ? styles.checkBoxOn : ''}`}>
                        {isSel && '✓'}
                      </div>
                      <h3 className={styles.newsTitle}>{n.title}</h3>
                    </div>
                    <p className={styles.newsSummary}>{n.summary}</p>

                    {n.keyFacts.length > 0 && (
                      <div className={styles.facts}>
                        {n.keyFacts.map((f, i) => (
                          <div key={i} className={styles.fact}>
                            <span>💡</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.newsRel}>
                      <span>관련도</span>
                      <div className={styles.relBar}>
                        <div
                          className={styles.relBarFill}
                          style={{ width: `${n.relevance * 100}%`, background: relColor }}
                        />
                      </div>
                      <span style={{ color: relColor, fontWeight: 700 }}>
                        {Math.round(n.relevance * 100)}%
                      </span>
                    </div>

                    <div className={styles.newsTags}>
                      <span
                        className={styles.tag}
                        style={{ color: tierColor, background: `${tierColor}15` }}
                      >
                        {n.cpmTier === 'High' ? '💰 High CPM' : n.cpmTier === 'Mid' ? '💵 Mid CPM' : '📊 Low CPM'}
                      </span>
                      <span
                        className={styles.tag}
                        style={{
                          color: n.credibility === '높음' ? '#16a34a' : '#d4a537',
                          background: n.credibility === '높음' ? 'rgba(22,163,74,0.12)' : 'rgba(212,165,55,0.12)',
                        }}
                      >
                        📰 {n.source}
                      </span>
                      <span
                        className={styles.tag}
                        style={{
                          color: n.credibility === '높음' ? '#16a34a' : '#d4a537',
                          background: n.credibility === '높음' ? 'rgba(22,163,74,0.12)' : 'rgba(212,165,55,0.12)',
                        }}
                      >
                        {n.credibility === '높음' ? '✅ 높은 신뢰도' : '📋 보통 신뢰도'}
                      </span>
                      <span className={styles.tagDate}>{n.publishedAt}</span>
                    </div>
                  </div>
                );
              })}
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
                  <span className={shared.chatDot}></span>
                  {loading ? '수집 중...' : '대기 중'}
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
            {loading && (
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
            <div className={shared.inputRow}>
              <input
                type="text"
                placeholder="예: 신뢰도 높은 기사만 추려줘"
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
