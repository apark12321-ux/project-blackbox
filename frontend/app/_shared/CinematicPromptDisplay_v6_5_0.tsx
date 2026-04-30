// ============================================================
// AlgoMaker v8.3 - Cinematic Prompt Display
// v8.2 피드백 반영:
// - 가독성 향상 (폰트 크기/굵기 일관성)
// - 카드별 명확한 구분
// - 정렬 통일
// - 부적절한 멘트 제거
// ============================================================

import React, { useState } from 'react';
import type { CinematicPromptPackage } from './promptEngine_v6_5_0';

interface PromptDisplayProps {
  prompts: CinematicPromptPackage;
}

export function CinematicPromptDisplay({ prompts }: PromptDisplayProps) {
  const [activeTab, setActiveTab] = useState<'midjourney' | 'sora' | 'veo' | 'flow' | 'notebookLM'>('midjourney');

  return (
    <div className="promptWrap">
      <style jsx>{`
        .promptWrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        /* ============================================ */
        /* 추천 이유 카드 */
        /* ============================================ */
        .rationaleCard {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1.5px solid #c4b5fd;
          border-radius: 14px;
          padding: 18px 20px;
        }
        @media (max-width: 600px) {
          .rationaleCard { padding: 16px; border-radius: 12px; }
        }
        .rationaleHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed rgba(124, 58, 237, 0.25);
        }
        .rationaleIcon {
          font-size: 18px;
          flex-shrink: 0;
        }
        .rationaleLabel {
          font-size: 12.5px;
          font-weight: 800;
          color: #5b21b6;
          letter-spacing: -0.015em;
        }
        .rationaleContent {
          font-size: 13px;
          color: #4c1d95;
          line-height: 1.75;
          white-space: pre-line;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .rationaleContent { font-size: 12.5px; line-height: 1.7; }
        }
        /* 마크다운 스타일 ** ** 처리 */
        .rationaleContent :global(strong) {
          color: #6d28d9;
          font-weight: 800;
        }

        /* ============================================ */
        /* 탭 영역 */
        /* ============================================ */
        .tabWrap {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .tabWrap { border-radius: 12px; }
        }
        .tabRow {
          display: flex;
          gap: 0;
          background: #fafafa;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .tabBtn {
          flex: 1;
          min-width: 78px;
          padding: 12px 8px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
        }
        .tabBtn:hover {
          background: rgba(0, 0, 0, 0.03);
        }
        .tabBtn.active {
          background: #fff;
          border-bottom-color: #c65f3b;
        }
        .tabIcon {
          font-size: 20px;
          margin-bottom: 4px;
          display: block;
        }
        @media (max-width: 600px) {
          .tabIcon { font-size: 18px; }
        }
        .tabName {
          font-size: 12px;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .tabBtn.active .tabName {
          color: #c65f3b;
        }
        .tabSubtitle {
          font-size: 10.5px;
          color: #9ca3af;
          margin-top: 2px;
          line-height: 1.3;
        }
        @media (max-width: 600px) {
          .tabName { font-size: 11px; }
          .tabSubtitle { font-size: 9.5px; }
        }
        .tabBody {
          padding: 20px;
        }
        @media (max-width: 600px) {
          .tabBody { padding: 16px; }
        }

        /* ============================================ */
        /* 풀 프롬프트 박스 */
        /* ============================================ */
        .fullPromptCard {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) {
          .fullPromptCard { padding: 14px; border-radius: 10px; }
        }
        .fullPromptHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .fullPromptLabel {
          font-size: 11px;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .fullPromptText {
          font-size: 12.5px;
          color: #f5f5f5;
          line-height: 1.75;
          font-family: 'SF Mono', 'Consolas', Monaco, monospace;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 240px;
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .fullPromptText { font-size: 11.5px; line-height: 1.7; max-height: 200px; }
        }

        /* ============================================ */
        /* 스펙 그리드 (디테일 카드들) */
        /* ============================================ */
        .specsTitle {
          font-size: 13px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 10px;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .specsTitle { font-size: 12.5px; }
        }
        .specsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (max-width: 600px) {
          .specsGrid { grid-template-columns: 1fr; gap: 6px; }
        }
        .specCard {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 14px;
        }
        @media (max-width: 600px) {
          .specCard { padding: 10px 12px; border-radius: 8px; }
        }
        .specLabel {
          font-size: 10.5px;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (max-width: 600px) {
          .specLabel { font-size: 10px; }
        }
        .specValue {
          font-size: 12.5px;
          color: #1a1a1a;
          line-height: 1.55;
          font-weight: 600;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .specValue { font-size: 12px; line-height: 1.5; }
        }
        .specValue.mono {
          font-family: 'SF Mono', 'Consolas', Monaco, monospace;
          font-size: 11.5px;
          color: #c65f3b;
        }

        /* ============================================ */
        /* 추가 영역 (파라미터/시드/네거티브) */
        /* ============================================ */
        .extraCard {
          margin-top: 12px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 12px 14px;
        }
        @media (max-width: 600px) {
          .extraCard { padding: 10px 12px; }
        }
        .extraRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .extraRow:last-child { margin-bottom: 0; }
        .extraLabel {
          font-weight: 700;
          color: #78350f;
          font-size: 11px;
        }
        .extraVal {
          font-family: 'SF Mono', monospace;
          font-size: 11.5px;
          color: #92400e;
        }
        .negativeBox {
          margin-top: 10px;
          padding: 10px;
          background: #fef2f2;
          border-radius: 8px;
          font-size: 11px;
          color: #991b1b;
          line-height: 1.6;
          word-break: keep-all;
        }
        .negativeBox strong {
          font-weight: 800;
          font-size: 10.5px;
          letter-spacing: 0.04em;
        }

        /* ============================================ */
        /* Flow 시퀀스 */
        /* ============================================ */
        .flowList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .flowItem {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 10px;
          padding: 12px 14px;
        }
        @media (max-width: 600px) {
          .flowItem { padding: 10px 12px; gap: 10px; }
        }
        .flowNum {
          width: 28px;
          height: 28px;
          background: #0284c7;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12.5px;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 1px;
        }
        @media (max-width: 600px) {
          .flowNum { width: 24px; height: 24px; font-size: 11.5px; }
        }
        .flowContent {
          flex: 1;
          min-width: 0;
        }
        .flowDesc {
          font-size: 12.5px;
          color: #075985;
          line-height: 1.55;
          font-weight: 600;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .flowDesc { font-size: 12px; }
        }
        .flowTime {
          font-size: 10.5px;
          color: #0284c7;
          font-family: 'SF Mono', monospace;
          margin-top: 3px;
        }

        /* ============================================ */
        /* 복사 버튼 */
        /* ============================================ */
        .copyBtn {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copyBtn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .copyBtn.copied {
          background: #16a34a;
          border-color: #16a34a;
        }
        @media (max-width: 600px) {
          .copyBtn { font-size: 11px; padding: 5px 12px; }
        }

        /* ============================================ */
        /* NotebookLM 안내 */
        /* ============================================ */
        .notebookGuide {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 12px;
          font-size: 12px;
          color: #78350f;
          line-height: 1.6;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .notebookGuide { font-size: 11.5px; }
        }
      `}</style>

      {/* ============================================ */}
      {/* 추천 이유 카드 */}
      {/* ============================================ */}
      <div className="rationaleCard">
        <div className="rationaleHead">
          <span className="rationaleIcon">🎨</span>
          <span className="rationaleLabel">왜 이 조합을 추천하는지</span>
        </div>
        <div
          className="rationaleContent"
          dangerouslySetInnerHTML={{
            __html: prompts.rationale.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
          }}
        />
      </div>

      {/* ============================================ */}
      {/* 탭 영역 */}
      {/* ============================================ */}
      <div className="tabWrap">
        <div className="tabRow">
          <TabBtn 
            active={activeTab === 'midjourney'} 
            onClick={() => setActiveTab('midjourney')}
            icon="🎨"
            name="Midjourney v7"
            subtitle="썸네일/스틸"
          />
          <TabBtn 
            active={activeTab === 'sora'} 
            onClick={() => setActiveTab('sora')}
            icon="🎬"
            name="Sora 2"
            subtitle="동영상"
          />
          <TabBtn 
            active={activeTab === 'veo'} 
            onClick={() => setActiveTab('veo')}
            icon="✨"
            name="VEO 3"
            subtitle="구글 동영상"
          />
          <TabBtn 
            active={activeTab === 'flow'} 
            onClick={() => setActiveTab('flow')}
            icon="🌊"
            name="Flow"
            subtitle="씬 시퀀스"
          />
          <TabBtn 
            active={activeTab === 'notebookLM'} 
            onClick={() => setActiveTab('notebookLM')}
            icon="📓"
            name="NotebookLM"
            subtitle="분석"
          />
        </div>
        
        <div className="tabBody">
          {activeTab === 'midjourney' && <MidjourneyPanel data={prompts.midjourney} />}
          {activeTab === 'sora' && <SoraPanel data={prompts.sora} />}
          {activeTab === 'veo' && <VeoPanel data={prompts.veo} />}
          {activeTab === 'flow' && <FlowPanel data={prompts.flow} />}
          {activeTab === 'notebookLM' && <NotebookPanel data={prompts.notebookLM} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 탭 버튼
// ============================================================
function TabBtn({ active, onClick, icon, name, subtitle }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  name: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      className={`tabBtn ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="tabIcon">{icon}</span>
      <div className="tabName">{name}</div>
      <div className="tabSubtitle">{subtitle}</div>
    </button>
  );
}

// ============================================================
// Midjourney 패널
// ============================================================
function MidjourneyPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="🎨 MIDJOURNEY v7 풀 프롬프트" content={data.fullPrompt} />
      
      <div className="specsTitle">📋 프롬프트 구성 요소</div>
      <div className="specsGrid">
        <SpecCard icon="🎯" label="피사체" value={data.subject} />
        <SpecCard icon="📐" label="구도" value={data.composition} />
        <SpecCard icon="💡" label="조명" value={data.lighting} />
        <SpecCard icon="🎨" label="색감" value={data.colorPalette} />
        <SpecCard icon="📷" label="카메라/렌즈" value={data.cameraSpec} />
        <SpecCard icon="🌫️" label="분위기" value={data.mood} />
        <SpecCard icon="📚" label="스타일 레퍼런스" value={data.styleReference} />
        <SpecCard icon="⚙️" label="파라미터" value={data.parameters} mono />
      </div>
      
      <div className="extraCard">
        <div className="extraRow">
          <span className="extraLabel">시드 (Seed)</span>
          <span className="extraVal">{data.seed}</span>
        </div>
        <div className="negativeBox">
          <strong>NEGATIVE PROMPT</strong><br />
          {data.negativePrompt}
        </div>
      </div>
    </>
  );
}

// ============================================================
// Sora 패널
// ============================================================
function SoraPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="🎬 SORA 2 풀 프롬프트" content={data.fullPrompt} />
      
      <div className="specsTitle">📋 영상 디렉션</div>
      <div className="specsGrid">
        <SpecCard icon="🎬" label="샷 타입" value={data.shotType} />
        <SpecCard icon="🎯" label="피사체" value={data.subject} />
        <SpecCard icon="🎭" label="액션" value={data.action} />
        <SpecCard icon="📹" label="카메라 무브" value={data.cameraMovement} />
        <SpecCard icon="🔍" label="렌즈 스펙" value={data.lensSpec} />
        <SpecCard icon="💡" label="조명" value={data.lighting} />
        <SpecCard icon="🎨" label="컬러 그레이딩" value={data.colorGrading} />
        <SpecCard icon="⏱️" label="페이싱" value={data.pacing} />
      </div>

      <div className="extraCard" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <div className="extraRow">
          <span className="extraLabel" style={{ color: '#1e40af' }}>🔊 사운드 디렉션</span>
        </div>
        <div style={{ fontSize: 12, color: '#1e3a8a', lineHeight: 1.6, marginTop: 4, wordBreak: 'keep-all' }}>
          {data.audioDirection}
        </div>
      </div>
    </>
  );
}

// ============================================================
// VEO 패널
// ============================================================
function VeoPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="✨ GOOGLE VEO 3 풀 프롬프트" content={data.fullPrompt} />
      
      <div className="specsTitle">📋 영상 사양</div>
      <div className="specsGrid">
        <SpecCard icon="🎬" label="씬 묘사" value={data.scene} />
        <SpecCard icon="🎨" label="비주얼 스타일" value={data.visualStyle} />
        <SpecCard icon="📹" label="카메라 디렉션" value={data.cameraDirection} />
        <SpecCard icon="🌊" label="모션 레벨" value={data.motionLevel} />
      </div>

      <div className="extraCard" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
        <div className="extraRow">
          <span className="extraLabel" style={{ color: '#15803d' }}>📐 출력 사양</span>
        </div>
        <div className="extraRow">
          <span style={{ color: '#166534', fontSize: 11.5 }}>길이</span>
          <span className="extraVal" style={{ color: '#15803d' }}>{data.duration}</span>
        </div>
        <div className="extraRow">
          <span style={{ color: '#166534', fontSize: 11.5 }}>해상도</span>
          <span className="extraVal" style={{ color: '#15803d' }}>{data.resolution}</span>
        </div>
        <div className="extraRow">
          <span style={{ color: '#166534', fontSize: 11.5 }}>비율</span>
          <span className="extraVal" style={{ color: '#15803d' }}>{data.aspectRatio}</span>
        </div>
      </div>
    </>
  );
}

// ============================================================
// Flow 패널
// ============================================================
function FlowPanel({ data }: { data: any }) {
  return (
    <>
      <div className="specsTitle">🌊 5씬 시퀀스 구성</div>
      <div className="flowList">
        {data.sceneSequence.map((scene: any, i: number) => (
          <div key={i} className="flowItem">
            <div className="flowNum">{scene.scene}</div>
            <div className="flowContent">
              <div className="flowDesc">{scene.description}</div>
              <div className="flowTime">⏱ {scene.duration}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="specsTitle">📋 시퀀스 디렉션</div>
        <div className="specsGrid">
          <SpecCard icon="🔄" label="전환 스타일" value={data.transitionStyle} />
          <SpecCard icon="🎭" label="전체 톤" value={data.overallTone} />
        </div>
      </div>
    </>
  );
}

// ============================================================
// NotebookLM 패널
// ============================================================
function NotebookPanel({ data }: { data: string }) {
  return (
    <>
      <div className="notebookGuide">
        💡 <strong>사용법:</strong> NotebookLM에 영상 키워드와 함께 이 프롬프트를 붙여넣으면, 떡상 패턴 분석과 차별화 전략을 자동으로 정리해줍니다.
      </div>
      <FullPromptBox label="📓 NOTEBOOKLM 분석 프롬프트" content={data} />
    </>
  );
}

// ============================================================
// 풀 프롬프트 박스 (다크 카드 + 복사 버튼)
// ============================================================
function FullPromptBox({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fullPromptCard">
      <div className="fullPromptHead">
        <span className="fullPromptLabel">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`copyBtn ${copied ? 'copied' : ''}`}
        >
          {copied ? '✓ 복사됨' : '📋 복사'}
        </button>
      </div>
      <pre className="fullPromptText">{content}</pre>
    </div>
  );
}

// ============================================================
// 스펙 카드 (라벨 + 값)
// ============================================================
function SpecCard({ icon, label, value, mono }: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="specCard">
      <div className="specLabel">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`specValue ${mono ? 'mono' : ''}`}>{value}</div>
    </div>
  );
}
