// ============================================================
// AlgoMaker v6.5.0 - Cinematic Prompt Display
// Midjourney v7 / Sora 2 / VEO 3 / Flow / NotebookLM 통합
// ============================================================

import React, { useState } from 'react';
import type { CinematicPromptPackage } from './promptEngine_v6_5_0';

interface PromptDisplayProps {
  prompts: CinematicPromptPackage;
}

export function CinematicPromptDisplay({ prompts }: PromptDisplayProps) {
  const [activeTab, setActiveTab] = useState<'midjourney' | 'sora' | 'veo' | 'flow' | 'notebookLM'>('midjourney');
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 왜 이 조합인지 (Rationale) */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4">
        <div className="flex items-start gap-2">
          <span className="text-xl shrink-0">🎨</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-indigo-700 mb-1">전문가가 이 조합을 추천하는 이유</div>
            <div className="text-sm text-gray-800 leading-relaxed break-keep whitespace-pre-line">
              {prompts.rationale}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI 도구 탭 */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <PromptTab 
          active={activeTab === 'midjourney'} 
          onClick={() => setActiveTab('midjourney')}
          icon="🎨"
          label="Midjourney v7"
          subtitle="썸네일/스틸"
        />
        <PromptTab 
          active={activeTab === 'sora'} 
          onClick={() => setActiveTab('sora')}
          icon="🎬"
          label="Sora 2"
          subtitle="동영상"
        />
        <PromptTab 
          active={activeTab === 'veo'} 
          onClick={() => setActiveTab('veo')}
          icon="✨"
          label="VEO 3"
          subtitle="구글 동영상"
        />
        <PromptTab 
          active={activeTab === 'flow'} 
          onClick={() => setActiveTab('flow')}
          icon="🌊"
          label="Flow"
          subtitle="시퀀스"
        />
        <PromptTab 
          active={activeTab === 'notebookLM'} 
          onClick={() => setActiveTab('notebookLM')}
          icon="📓"
          label="NotebookLM"
          subtitle="분석"
        />
      </div>
      
      {/* 콘텐츠 */}
      <div className="p-4 sm:p-6">
        {activeTab === 'midjourney' && <MidjourneyDisplay data={prompts.midjourney} />}
        {activeTab === 'sora' && <SoraDisplay data={prompts.sora} />}
        {activeTab === 'veo' && <VeoDisplay data={prompts.veo} />}
        {activeTab === 'flow' && <FlowDisplay data={prompts.flow} />}
        {activeTab === 'notebookLM' && <NotebookLMDisplay data={prompts.notebookLM} />}
      </div>
    </div>
  );
}

// ============================================================
// Midjourney v7
// ============================================================
function MidjourneyDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {/* 풀 프롬프트 (그대로 복붙용) */}
      <PromptBlock
        label="📋 그대로 복붙 가능한 풀 프롬프트"
        content={data.fullPrompt}
        bgColor="bg-gradient-to-br from-violet-50 to-fuchsia-50"
        borderColor="border-violet-200"
        copyLabel="Midjourney 프롬프트 복사"
      />
      
      {/* 분해된 디테일 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailCard label="피사체" content={data.subject} icon="🎯" />
        <DetailCard label="구도" content={data.composition} icon="📐" />
        <DetailCard label="조명" content={data.lighting} icon="💡" />
        <DetailCard label="색감" content={data.colorPalette} icon="🎨" />
        <DetailCard label="카메라" content={data.cameraSpec} icon="📷" />
        <DetailCard label="분위기" content={data.mood} icon="🌫️" />
        <DetailCard label="스타일 레퍼런스" content={data.styleReference} icon="📚" />
        <DetailCard label="파라미터" content={data.parameters} icon="⚙️" mono />
      </div>
      
      {/* 시드 + 네거티브 */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">시드 (Seed)</span>
          <span className="font-mono text-sm text-gray-900">{data.seed}</span>
        </div>
        <div>
          <div className="text-xs font-bold text-red-700 mb-1">네거티브 프롬프트</div>
          <div className="text-xs text-gray-700 break-keep">{data.negativePrompt}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sora 2
// ============================================================
function SoraDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <PromptBlock
        label="📋 Sora 2 풀 프롬프트"
        content={data.fullPrompt}
        bgColor="bg-gradient-to-br from-cyan-50 to-blue-50"
        borderColor="border-cyan-200"
        copyLabel="Sora 프롬프트 복사"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailCard label="샷 타입" content={data.shotType} icon="🎬" />
        <DetailCard label="피사체" content={data.subject} icon="🎯" />
        <DetailCard label="액션" content={data.action} icon="🎭" />
        <DetailCard label="카메라 무브" content={data.cameraMovement} icon="📹" />
        <DetailCard label="렌즈 스펙" content={data.lensSpec} icon="🔍" />
        <DetailCard label="조명" content={data.lighting} icon="💡" />
        <DetailCard label="컬러 그레이딩" content={data.colorGrading} icon="🎨" />
        <DetailCard label="페이싱" content={data.pacing} icon="⏱️" />
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-xs font-bold text-blue-700 mb-1">🔊 사운드 디렉션</div>
        <div className="text-sm text-gray-800 break-keep">{data.audioDirection}</div>
      </div>
    </div>
  );
}

// ============================================================
// VEO 3 (Google)
// ============================================================
function VeoDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <PromptBlock
        label="📋 Google VEO 3 풀 프롬프트"
        content={data.fullPrompt}
        bgColor="bg-gradient-to-br from-emerald-50 to-green-50"
        borderColor="border-emerald-200"
        copyLabel="VEO 프롬프트 복사"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailCard label="씬" content={data.scene} icon="🎬" />
        <DetailCard label="비주얼 스타일" content={data.visualStyle} icon="🎨" />
        <DetailCard label="카메라 디렉션" content={data.cameraDirection} icon="📹" />
        <DetailCard label="모션 레벨" content={data.motionLevel} icon="🌊" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <SpecBox label="길이" value={data.duration} />
        <SpecBox label="해상도" value={data.resolution} />
        <SpecBox label="비율" value={data.aspectRatio} />
      </div>
    </div>
  );
}

// ============================================================
// Flow (시퀀스)
// ============================================================
function FlowDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
        <div className="text-sm font-bold text-teal-900 mb-3">📋 5씬 시퀀스 구성</div>
        <div className="space-y-2">
          {data.sceneSequence.map((scene: any, i: number) => (
            <div key={i} className="bg-white rounded-md p-3 border border-teal-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {scene.scene}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 break-keep">{scene.description}</div>
                <div className="text-xs text-teal-600 mt-1 font-mono">{scene.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <DetailCard label="전환 스타일" content={data.transitionStyle} icon="🔄" />
      <DetailCard label="전체 톤" content={data.overallTone} icon="🎭" />
    </div>
  );
}

// ============================================================
// NotebookLM
// ============================================================
function NotebookLMDisplay({ data }: { data: string }) {
  return (
    <div className="space-y-3">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="text-xs font-bold text-yellow-800 mb-1">💡 사용법</div>
        <div className="text-xs text-gray-700 break-keep">
          NotebookLM에 영상 키워드와 함께 이 프롬프트를 붙여넣으면, 떡상 패턴 분석과 차별화 전략을 자동으로 정리해줍니다.
        </div>
      </div>
      
      <PromptBlock
        label="📋 NotebookLM 분석 프롬프트"
        content={data}
        bgColor="bg-gradient-to-br from-amber-50 to-yellow-50"
        borderColor="border-amber-200"
        copyLabel="분석 프롬프트 복사"
      />
    </div>
  );
}

// ============================================================
// 공통: 탭 버튼
// ============================================================
function PromptTab({ active, onClick, icon, label, subtitle }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[80px] py-3 px-2 transition-all border-b-2 ${
        active 
          ? 'border-indigo-500 bg-white' 
          : 'border-transparent hover:bg-gray-100'
      }`}
    >
      <div className="text-xl mb-0.5">{icon}</div>
      <div className={`font-bold text-xs ${active ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </div>
      <div className="text-[10px] text-gray-500">{subtitle}</div>
    </button>
  );
}

// ============================================================
// 공통: 프롬프트 블록 (큰 코드 블록 + 복사)
// ============================================================
function PromptBlock({ label, content, bgColor, borderColor, copyLabel }: {
  label: string;
  content: string;
  bgColor: string;
  borderColor: string;
  copyLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold text-gray-900">{label}</div>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          {copied ? '✅ 복사됨' : `📋 ${copyLabel}`}
        </button>
      </div>
      <div className="bg-white/80 rounded-md p-3 border border-white max-h-72 overflow-y-auto">
        <pre className="text-xs sm:text-sm text-gray-900 whitespace-pre-wrap font-mono leading-relaxed break-keep">
          {content}
        </pre>
      </div>
    </div>
  );
}

// ============================================================
// 공통: 디테일 카드
// ============================================================
function DetailCard({ label, content, icon, mono }: {
  label: string;
  content: string;
  icon?: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={`text-sm text-gray-900 break-keep ${mono ? 'font-mono' : ''}`}>
        {content}
      </div>
    </div>
  );
}

// ============================================================
// 공통: 스펙 박스
// ============================================================
function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
      <div className="text-xs text-emerald-700 font-bold">{label}</div>
      <div className="text-sm text-gray-900 mt-0.5 font-medium">{value}</div>
    </div>
  );
}
