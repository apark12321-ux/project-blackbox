// ============================================================
// AlgoMaker v6.5.0 - Cinematic Scenario Display
// 작가급 스토리 흐름을 시각적으로 표현
// 각 비트의 연결성 + 알고리즘 후킹 장치를 명확히 보여줌
// ============================================================

import React, { useState } from 'react';
import type { CinematicScenario } from './scenarioEngine_v6_5_0';

interface ScenarioDisplayProps {
  scenario: CinematicScenario;
}

export function CinematicScenarioDisplay({ scenario }: ScenarioDisplayProps) {
  const [expandedBeat, setExpandedBeat] = useState<number | null>(1);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  
  return (
    <div className="space-y-4">
      {/* ============== 핵심 메시지 (Logline) ============== */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-700 mb-1">영상 전체를 관통하는 핵심 1줄</div>
            <div className="text-base font-bold text-gray-900 leading-relaxed break-keep">
              {scenario.logline}
            </div>
          </div>
        </div>
      </div>
      
      {/* ============== 감정 곡선 ============== */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📈</span>
          <div className="text-sm font-bold text-purple-900">감정 곡선 (다큐 작가급 구조)</div>
        </div>
        <div className="text-sm text-gray-800 break-keep pl-7 font-medium">
          {scenario.emotionalArc}
        </div>
      </div>
      
      {/* ============== 알고리즘 작동 원리 (접힘) ============== */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAlgorithm(!showAlgorithm)}
          className="w-full flex items-center justify-between p-4 hover:bg-blue-100/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div className="text-sm font-bold text-blue-900">숨겨진 알고리즘 작동 원리</div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              뒷단 노림수
            </span>
          </div>
          <span className="text-blue-600">{showAlgorithm ? '▲' : '▼'}</span>
        </button>
        {showAlgorithm && (
          <div className="px-4 pb-4">
            <div className="text-sm text-gray-800 leading-relaxed break-keep bg-white/60 rounded-md p-3">
              {scenario.hiddenAlgorithm}
            </div>
            <div className="text-xs text-blue-700 mt-2 break-keep">
              💡 이 구조는 시청자가 의식하지 못한 채 끝까지 보게 만드는 "보이지 않는 설계"입니다.
            </div>
          </div>
        )}
      </div>
      
      {/* ============== 예상 시청 유지율 ============== */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-gray-900">📊 예상 시청 유지율</div>
          <div className="text-2xl font-bold text-green-600">{scenario.estimatedRetention}%</div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
            style={{ width: `${scenario.estimatedRetention}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1.5 break-keep">
          유튜브 알고리즘은 40% 이상에서 추천 박스 진입을 시작합니다. 이 시나리오는 떡상 임계점을 넘는 구조입니다.
        </div>
      </div>
      
      {/* ============== 6개 비트 (스토리 연결됨) ============== */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div className="text-sm font-bold text-gray-900">시나리오 6장 — 하나의 스토리로 연결됨</div>
          </div>
          <div className="text-xs text-gray-500 mt-1 break-keep">
            각 장은 독립적이지 않습니다. 브리지 문장으로 자연스럽게 다음 장으로 이어집니다.
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {scenario.beats.map((beat, idx) => (
            <BeatBlock
              key={beat.id}
              beat={beat}
              isExpanded={expandedBeat === beat.id}
              onToggle={() => setExpandedBeat(expandedBeat === beat.id ? null : beat.id)}
              isLast={idx === scenario.beats.length - 1}
            />
          ))}
        </div>
      </div>
      
      {/* ============== 60초 쇼츠 버전 ============== */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚡</span>
          <div className="text-sm font-bold text-purple-900">1분 쇼츠 버전 (자체 완결)</div>
        </div>
        <div className="bg-white rounded-md p-3 border border-purple-100">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans break-keep leading-relaxed">
            {scenario.shortVersion}
          </pre>
        </div>
        <CopyButton text={scenario.shortVersion} label="쇼츠 대본 복사" />
      </div>
    </div>
  );
}

// ============================================================
// 개별 비트 블록 (확장 가능)
// ============================================================
function BeatBlock({ beat, isExpanded, onToggle, isLast }: {
  beat: any;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const beatColors = [
    { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500' },     // Hook
    { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', dot: 'bg-orange-500' }, // 미끼
    { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', dot: 'bg-yellow-500' }, // 갈등
    { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', dot: 'bg-green-500' },     // 반전
    { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', dot: 'bg-blue-500' },         // 실전
    { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', dot: 'bg-purple-500' }, // CTA
  ];
  const color = beatColors[beat.id - 1] || beatColors[0];
  
  return (
    <div className={`${color.bg} border-l-4 ${color.border}`}>
      {/* 헤더 (항상 보임) */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/40 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-full ${color.dot} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
          {beat.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{beat.beatName}</span>
            <span className={`text-xs ${color.text} font-mono bg-white/60 px-2 py-0.5 rounded`}>
              {beat.timeRange}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1 break-keep">
            {beat.purpose}
          </div>
        </div>
        <span className={`${color.text} text-xs shrink-0 mt-1`}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      
      {/* 펼쳐진 디테일 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* 실제 대사/내레이션 */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs font-bold text-gray-500 mb-1.5">📝 내레이션 (실제 대사)</div>
            <div className="text-sm text-gray-900 leading-relaxed break-keep">
              "{beat.narration}"
            </div>
            <CopyButton text={beat.narration} small />
          </div>
          
          {/* 화면 연출 */}
          <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
            <div className="text-xs font-bold text-gray-500 mb-1.5">🎬 화면 연출 지시</div>
            <div className="text-sm text-gray-800 leading-relaxed break-keep">
              {beat.visualDirection}
            </div>
          </div>
          
          {/* 알고리즘 후킹 (보이지 않는 노림수) */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1.5">⚙️ 알고리즘 후킹 (뒷단 노림수)</div>
            <div className="text-sm text-gray-800 leading-relaxed break-keep">
              {beat.algorithmHook}
            </div>
          </div>
          
          {/* 시청 유지 목표 */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1.5">📊 이 구간 시청 유지 목표</div>
            <div className="text-sm text-gray-800 break-keep">
              {beat.retentionTarget}
            </div>
          </div>
          
          {/* 다음 장으로 넘어가는 브리지 */}
          {!isLast && (
            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400 border border-amber-200">
              <div className="text-xs font-bold text-amber-700 mb-1.5">
                🔗 다음 장으로 연결되는 브리지 문장
              </div>
              <div className="text-sm text-gray-900 leading-relaxed break-keep italic">
                "{beat.bridgeToNext}"
              </div>
              <div className="text-xs text-amber-600 mt-1.5 break-keep">
                ↓ 이 한 줄이 다음 비트의 첫 문장과 자연스럽게 이어집니다.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 복사 버튼
// ============================================================
function CopyButton({ text, label = '복사', small = false }: {
  text: string;
  label?: string;
  small?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className={`mt-2 ${small ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} rounded-md font-medium transition-all ${
        copied 
          ? 'bg-green-100 text-green-700' 
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
      }`}
    >
      {copied ? '✅ 복사됨' : `📋 ${label}`}
    </button>
  );
}
