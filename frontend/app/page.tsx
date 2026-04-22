'use client';
/**
 * AlgoMaker v13 - 대시보드 홈 (중복 제거)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, setProject } from './_shared/V11Shell';

type Category = 'all' | 'shorts' | 'longform' | 'news' | 'religion' | 'finance' | 'health' | 'tech';

interface Template {
  id: string;
  title: string;
  desc: string;
  category: Exclude<Category, 'all'>;
  categoryLabel: string;
  duration: string;
  cpm: string;
  thumb: string;
  icon: string;
  badge?: 'NEW' | 'HOT' | 'BETA';
  categorySlug: string;
  defaultTone: 'formal' | 'friendly' | 'casual' | 'slang';
}

const TEMPLATES: Template[] = [
  { id: 't1', title: '오늘의 경제 브리핑', desc: '실시간 뉴스 기반 5~10분 요약 영상', category: 'news', categoryLabel: '뉴스', duration: '5~10분', cpm: '$15~22', thumb: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', icon: '📰', badge: 'HOT', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't2', title: '1분 재테크 상식', desc: '짧고 강렬한 쇼츠용 팁 영상', category: 'shorts', categoryLabel: '쇼츠', duration: '1분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%)', icon: '⚡', badge: 'NEW', categorySlug: 'economy', defaultTone: 'friendly' },
  { id: 't3', title: '블루오션 재테크 가이드', desc: '경쟁 낮고 수익 높은 주제 자동 발굴', category: 'finance', categoryLabel: '재테크', duration: '10~15분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)', icon: '💰', categorySlug: 'economy', defaultTone: 'formal' },
  { id: 't4', title: '시니어 건강 상식', desc: '50~70대 타겟, 큰 글씨 + 느린 TTS', category: 'health', categoryLabel: '건강', duration: '10~15분', cpm: '$15~22', thumb: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '🏥', categorySlug: 'health', defaultTone: 'formal' },
  { id: 't5', title: '오늘의 말씀', desc: '성경 구절 기반 묵상 영상', category: 'religion', categoryLabel: '종교', duration: '5~10분', cpm: '$8~14', thumb: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)', icon: '🕊️', badge: 'BETA', categorySlug: 'selfdev', defaultTone: 'formal' },
  { id: 't6', title: 'AI 트렌드 위클리', desc: '최신 AI 도구 & 뉴스 큐레이션', category: 'tech', categoryLabel: 'IT', duration: '10~15분', cpm: '$10~16', thumb: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', icon: '💻', badge: 'NEW', categorySlug: 'tech', defaultTone: 'friendly' },
  { id: 't7', title: '자기계발 심층 분석', desc: '15~20분 롱폼, 깊이 있는 콘텐츠', category: 'longform', categoryLabel: '롱폼', duration: '15~20분', cpm: '$8~14', thumb: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', icon: '📚', categorySlug: 'selfdev', defaultTone: 'formal' },
  { id: 't8', title: '주간 헤드라인', desc: '일주일간 주요 뉴스 큐레이션', category: 'news', categoryLabel: '뉴스', duration: '10분', cpm: '$12~18', thumb: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)', icon: '📡', categorySlug: 'economy', defaultTone: 'formal' },
];

const TABS: { key: Category; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'shorts', label: '쇼츠' },
  { key: 'longform', label: '롱폼' },
  { key: 'news', label: '뉴스' },
  { key: 'religion', label: '종교' },
  { key: 'finance', label: '재테크' },
  { key: 'health', label: '건강' },
  { key: 'tech', label: 'IT' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [topic, setTopic] = useState('');

  const filteredTemplates = activeTab === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeTab);

  const handleStart = () => {
    if (!selectedTemplate) return;
    setProject({
      category: selectedTemplate.categorySlug,
      categoryLabel: selectedTemplate.categoryLabel,
      templateId: selectedTemplate.id,
      customTopic: topic,
      tone: selectedTemplate.defaultTone,
      step: 1,
    });
    router.push('/keyword');
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page { padding: 32px; max-width: 1400px; margin: 0 auto; }
        .hero {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          border-radius: 16px;
          padding: 36px;
          color: #fff;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .hero::after {
          content: '';
          position: absolute;
          right: -50px;
          top: -50px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(204, 0, 0, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .heroInner { position: relative; z-index: 1; max-width: 640px; }
        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(204, 0, 0, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(204, 0, 0, 0.4);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .heroTitle {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .heroSub { font-size: 14px; color: #aaa; margin-bottom: 18px; line-height: 1.6; }
        .heroCta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: #cc0000;
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }
        .heroCta:hover { background: #a80000; }

        .pageTitle { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
        .pageSub { font-size: 13px; color: #606060; margin-bottom: 20px; }

        .tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .tabs::-webkit-scrollbar { display: none; }
        .tab {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: #606060;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .tab:hover { border-color: #0f0f0f; color: #0f0f0f; }
        .tabActive { background: #0f0f0f; color: #fff; border-color: #0f0f0f; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .card {
          cursor: pointer;
          transition: transform 0.2s;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
        }
        .card:hover { transform: translateY(-4px); }
        .thumb {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          color: #fff;
          overflow: hidden;
        }
        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 3px 7px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .badgeNEW { background: #22c55e; color: #fff; }
        .badgeHOT { background: #cc0000; color: #fff; }
        .badgeBETA { background: #fff; color: #0f0f0f; border: 1px solid #e5e5e5; }

        .meta { padding: 12px 12px 14px; }
        .metaTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .cat {
          font-size: 11px;
          font-weight: 700;
          color: #cc0000;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cpm { font-size: 11px; color: #888; font-weight: 600; }
        .title {
          font-size: 14px;
          font-weight: 700;
          color: #0f0f0f;
          margin-bottom: 3px;
          letter-spacing: -0.01em;
          line-height: 1.35;
        }
        .desc { font-size: 12px; color: #606060; line-height: 1.5; }

        .modalBack {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 16px;
        }
        .modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modalHead { display: flex; gap: 14px; margin-bottom: 20px; align-items: center; }
        .modalThumb {
          width: 72px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #fff;
          flex-shrink: 0;
        }
        .modalTitle { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 2px; }
        .modalSub { font-size: 12px; color: #888; }
        .modalLabel { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
        .modalHelp { font-size: 12px; color: #888; margin-bottom: 10px; }
        .modalInput {
          width: 100%;
          padding: 12px 14px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          margin-bottom: 16px;
          transition: border-color 0.15s;
        }
        .modalInput:focus { outline: none; border-color: #cc0000; background: #fff; }
        .modalDetail { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .modalDetailItem { padding: 10px; background: #fafafa; border-radius: 8px; text-align: center; }
        .modalDetailLabel { font-size: 10px; color: #888; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
        .modalDetailValue { font-size: 13px; font-weight: 700; color: #0f0f0f; }
        .modalActions { display: flex; gap: 8px; }
        .modalCancel {
          padding: 12px 18px;
          background: #f5f5f5;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: #606060;
          cursor: pointer;
          flex-shrink: 0;
        }
        .modalCancel:hover { background: #e5e5e5; }
        .modalStart {
          flex: 1;
          padding: 12px;
          background: #cc0000;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .modalStart:hover { background: #a80000; }

        @media (max-width: 768px) {
          .page { padding: 18px 16px; }
          .hero { padding: 24px; border-radius: 14px; }
          .heroTitle { font-size: 22px; }
          .grid { grid-template-columns: 1fr; gap: 14px; }
          .modal { padding: 20px; }
          .modalDetail { grid-template-columns: 1fr; gap: 6px; }
        }
      `}</style>

      <div className="page">
        <div className="hero">
          <div className="heroInner">
            <div className="heroBadge">🔥 NEW · 블루오션 AI 분석</div>
            <h1 className="heroTitle">
              AI가 수익 잘 나는 키워드부터<br />
              찾아드립니다
            </h1>
            <p className="heroSub">
              카테고리 고르고 템플릿 선택하면 끝. 5분 안에 YouTube 업로드 가능한 MP4 완성.
            </p>
            <button className="heroCta" onClick={() => router.push('/create')}>
              ▶ 지금 시작하기
            </button>
          </div>
        </div>

        <h2 className="pageTitle">템플릿 라이브러리</h2>
        <p className="pageSub">원하는 영상 스타일을 선택하세요. AI가 자동으로 제작합니다.</p>

        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'tabActive' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {filteredTemplates.map((t) => (
            <div key={t.id} className="card" onClick={() => setSelectedTemplate(t)}>
              <div className="thumb" style={{ background: t.thumb }}>
                {t.badge && <span className={`badge badge${t.badge}`}>{t.badge}</span>}
                <span>{t.icon}</span>
                <div className="duration">{t.duration}</div>
              </div>
              <div className="meta">
                <div className="metaTop">
                  <span className="cat">{t.categoryLabel}</span>
                  <span className="cpm">CPM {t.cpm}</span>
                </div>
                <h3 className="title">{t.title}</h3>
                <p className="desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="modalBack" onClick={() => setSelectedTemplate(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHead">
                <div className="modalThumb" style={{ background: selectedTemplate.thumb }}>
                  {selectedTemplate.icon}
                </div>
                <div>
                  <div className="modalTitle">{selectedTemplate.title}</div>
                  <div className="modalSub">{selectedTemplate.categoryLabel} · {selectedTemplate.duration}</div>
                </div>
              </div>

              <div className="modalLabel">주제 (선택)</div>
              <div className="modalHelp">비워두면 AI가 블루오션 키워드를 자동 추천합니다</div>
              <input
                type="text"
                className="modalInput"
                placeholder="예: 2026년 금리 전망"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
                autoFocus
              />

              <div className="modalDetail">
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">길이</div>
                  <div className="modalDetailValue">{selectedTemplate.duration}</div>
                </div>
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">예상 CPM</div>
                  <div className="modalDetailValue">{selectedTemplate.cpm}</div>
                </div>
                <div className="modalDetailItem">
                  <div className="modalDetailLabel">소요</div>
                  <div className="modalDetailValue">5~8분</div>
                </div>
              </div>

              <div className="modalActions">
                <button className="modalCancel" onClick={() => setSelectedTemplate(null)}>취소</button>
                <button className="modalStart" onClick={handleStart}>
                  ▶ 다음 (키워드 선택)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
