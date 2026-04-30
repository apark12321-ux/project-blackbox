// ============================================================
// AlgoMaker v8.1 - Cinematic Scenario Display
// 박 대표님 v8.0 피드백 반영:
// - 카드별 명확한 시각 구분
// - 라벨 + 내용 한 카드에 통합
// - 알고리즘 토글 깔끔한 디자인
// - 시니어 친화 큰 글씨 + 충분한 여백
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
    <div className="cinematicWrap">
      <style jsx>{`
        .cinematicWrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ============================================ */
        /* 카드 공통 스타일 */
        /* ============================================ */
        .card {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px 20px;
          transition: border-color 0.15s;
        }
        .card:hover {
          border-color: #c65f3b;
        }
        @media (max-width: 600px) {
          .card { padding: 16px; border-radius: 12px; }
        }

        .cardHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #e5e7eb;
        }
        .cardIcon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .cardLabel {
          font-size: 13px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.015em;
          flex: 1;
        }
        @media (max-width: 600px) {
          .cardLabel { font-size: 12.5px; }
          .cardIcon { font-size: 18px; }
        }

        /* ============================================ */
        /* 1. Logline - 핵심 메시지 (강조 카드) */
        /* ============================================ */
        .loglineCard {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 1.5px solid #fbbf24;
          border-radius: 14px;
          padding: 20px 22px;
        }
        @media (max-width: 600px) {
          .loglineCard { padding: 16px 18px; border-radius: 12px; }
        }
        .loglineHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .loglineLabel {
          display: inline-block;
          padding: 3px 10px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .loglineText {
          font-size: 15px;
          font-weight: 700;
          color: #78350f;
          line-height: 1.65;
          letter-spacing: -0.02em;
          margin: 0;
        }
        @media (max-width: 600px) {
          .loglineText { font-size: 13.5px; line-height: 1.6; }
        }

        /* ============================================ */
        /* 2. 감정 곡선 카드 */
        /* ============================================ */
        .arcText {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.7;
          font-weight: 600;
          padding: 4px 0;
        }
        @media (max-width: 600px) {
          .arcText { font-size: 13px; }
        }

        /* ============================================ */
        /* 3. 알고리즘 작동 원리 토글 */
        /* ============================================ */
        .algoCard {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1.5px solid #93c5fd;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s;
        }
        @media (max-width: 600px) {
          .algoCard { border-radius: 12px; }
        }
        .algoHead {
          padding: 16px 20px;
          cursor: pointer;
          user-select: none;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.15s;
        }
        .algoHead:hover {
          background: rgba(59, 130, 246, 0.05);
        }
        @media (max-width: 600px) {
          .algoHead { padding: 14px 16px; }
        }
        .algoIcon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .algoTitle {
          flex: 1;
          font-size: 13.5px;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .algoTitle { font-size: 12.5px; }
        }
        .algoBadge {
          padding: 2px 9px;
          background: rgba(59, 130, 246, 0.15);
          color: #1e40af;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.03em;
        }
        @media (max-width: 600px) {
          .algoBadge { font-size: 10px; padding: 2px 7px; }
        }
        .algoArrow {
          color: #1e40af;
          font-size: 11px;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .algoArrow.open {
          transform: rotate(180deg);
        }
        .algoBody {
          padding: 0 20px 18px;
        }
        @media (max-width: 600px) {
          .algoBody { padding: 0 16px 14px; }
        }
        .algoContent {
          background: #fff;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 13.5px;
          color: #1e3a8a;
          line-height: 1.7;
          font-weight: 500;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .algoContent { font-size: 12.5px; padding: 12px 14px; line-height: 1.65; }
        }
        .algoNote {
          font-size: 11.5px;
          color: #1e40af;
          line-height: 1.5;
          padding: 6px 4px 0;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .algoNote { font-size: 11px; }
        }

        /* ============================================ */
        /* 4. 예상 시청 유지율 게이지 */
        /* ============================================ */
        .retentionCard {
          background: #fff;
          border: 1.5px solid #86efac;
          border-radius: 14px;
          padding: 18px 20px;
        }
        @media (max-width: 600px) {
          .retentionCard { padding: 16px; border-radius: 12px; }
        }
        .retentionTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .retentionLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 800;
          color: #1a1a1a;
        }
        @media (max-width: 600px) {
          .retentionLabel { font-size: 12.5px; }
        }
        .retentionNum {
          font-size: 26px;
          font-weight: 900;
          color: #16a34a;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) {
          .retentionNum { font-size: 22px; }
        }
        .retentionBar {
          height: 10px;
          background: #f3f4f6;
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .retentionFill {
          height: 100%;
          background: linear-gradient(90deg, #4ade80 0%, #16a34a 100%);
          border-radius: 100px;
          transition: width 0.6s ease-out;
        }
        .retentionDesc {
          font-size: 12.5px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 600px) {
          .retentionDesc { font-size: 11.5px; }
        }

        /* ============================================ */
        /* 5. 6장 비트 컨테이너 */
        /* ============================================ */
        .beatsCard {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .beatsCard { border-radius: 12px; }
        }
        .beatsHead {
          padding: 16px 20px;
          background: #fafafa;
          border-bottom: 1px solid #e5e7eb;
        }
        @media (max-width: 600px) {
          .beatsHead { padding: 14px 16px; }
        }
        .beatsHeadTop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .beatsTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .beatsTitle { font-size: 13px; }
        }
        .beatsSub {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 600px) {
          .beatsSub { font-size: 11.5px; }
        }
        .beatsList {
          display: flex;
          flex-direction: column;
        }

        /* 개별 비트 */
        .beat {
          border-left: 4px solid;
          border-bottom: 1px solid #f3f4f6;
        }
        .beat:last-child {
          border-bottom: none;
        }
        .beatHead {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 18px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: background 0.15s;
        }
        .beatHead:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        @media (max-width: 600px) {
          .beatHead { padding: 12px 14px; gap: 10px; }
        }
        .beatNum {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: #fff;
          font-size: 12.5px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        @media (max-width: 600px) {
          .beatNum { width: 24px; height: 24px; font-size: 11.5px; }
        }
        .beatHeadInfo {
          flex: 1;
          min-width: 0;
        }
        .beatTitleRow {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }
        .beatTitleText {
          font-size: 13.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .beatTitleText { font-size: 12.5px; }
        }
        .beatTime {
          font-size: 10.5px;
          font-weight: 700;
          color: #6b7280;
          background: #f3f4f6;
          padding: 1px 7px;
          border-radius: 100px;
          font-family: 'SF Mono', Monaco, monospace;
        }
        @media (max-width: 600px) {
          .beatTime { font-size: 10px; }
        }
        .beatPurpose {
          font-size: 11.5px;
          color: #6b7280;
          line-height: 1.55;
          margin: 0;
        }
        @media (max-width: 600px) {
          .beatPurpose { font-size: 11px; }
        }
        .beatArrow {
          color: #6b7280;
          font-size: 11px;
          flex-shrink: 0;
          margin-top: 6px;
          transition: transform 0.2s;
        }
        .beatArrow.open {
          transform: rotate(180deg);
        }

        /* 비트 펼친 본문 */
        .beatBody {
          padding: 0 18px 16px 56px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .beatBody { padding: 0 14px 14px 46px; gap: 8px; }
        }
        .beatSection {
          background: #fafafa;
          border-radius: 10px;
          padding: 12px 14px;
        }
        .beatSection.narration {
          background: #fff7ed;
          border-left: 3px solid #c65f3b;
        }
        .beatSection.algo {
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
        }
        .beatSection.target {
          background: #f0fdf4;
          border-left: 3px solid #22c55e;
        }
        .beatSection.bridge {
          background: #fefce8;
          border-left: 3px solid #fbbf24;
        }
        .beatSectionLabel {
          font-size: 10.5px;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          display: block;
        }
        @media (max-width: 600px) {
          .beatSectionLabel { font-size: 10px; }
        }
        .beatSection.narration .beatSectionLabel { color: #c65f3b; }
        .beatSection.algo .beatSectionLabel { color: #1e40af; }
        .beatSection.target .beatSectionLabel { color: #15803d; }
        .beatSection.bridge .beatSectionLabel { color: #92400e; }
        
        .beatSectionContent {
          font-size: 13px;
          color: #1a1a1a;
          line-height: 1.7;
          margin: 0;
        }
        @media (max-width: 600px) {
          .beatSectionContent { font-size: 12.5px; line-height: 1.65; }
        }
        .beatBridgeNote {
          font-size: 11px;
          color: #92400e;
          margin-top: 6px;
          font-style: italic;
        }

        /* ============================================ */
        /* 6. 60초 쇼츠 버전 카드 */
        /* ============================================ */
        .shortsCard {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border: 1.5px solid #c084fc;
          border-radius: 14px;
          padding: 18px 20px;
        }
        @media (max-width: 600px) {
          .shortsCard { padding: 16px; border-radius: 12px; }
        }
        .shortsTop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .shortsBadge {
          display: inline-block;
          padding: 3px 10px;
          background: #a855f7;
          color: #fff;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .shortsLabel {
          font-size: 13.5px;
          font-weight: 800;
          color: #6b21a8;
          flex: 1;
        }
        @media (max-width: 600px) {
          .shortsLabel { font-size: 12.5px; }
        }
        .shortsContent {
          background: #fff;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 13px;
          color: #1a1a1a;
          line-height: 1.85;
          white-space: pre-line;
        }
        @media (max-width: 600px) {
          .shortsContent { font-size: 12.5px; padding: 12px 14px; line-height: 1.75; }
        }

        /* ============================================ */
        /* 복사 버튼 공통 */
        /* ============================================ */
        .copyBtn {
          padding: 6px 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 700;
          color: #6b7280;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          margin-top: 8px;
        }
        .copyBtn:hover {
          border-color: #c65f3b;
          color: #c65f3b;
        }
        .copyBtn.copied {
          background: #16a34a;
          border-color: #16a34a;
          color: #fff;
        }
        @media (max-width: 600px) {
          .copyBtn { font-size: 11px; padding: 6px 11px; }
        }
      `}</style>

      {/* ============================================ */}
      {/* 1. Logline (핵심 메시지) */}
      {/* ============================================ */}
      <div className="loglineCard">
        <div className="loglineHead">
          <span className="loglineLabel">🎯 영상의 핵심 메시지</span>
        </div>
        <p className="loglineText">{scenario.logline}</p>
      </div>

      {/* ============================================ */}
      {/* 2. 감정 곡선 */}
      {/* ============================================ */}
      <div className="card">
        <div className="cardHead">
          <span className="cardIcon">📈</span>
          <span className="cardLabel">감정 곡선 (작가급 스토리 구조)</span>
        </div>
        <p className="arcText">{scenario.emotionalArc}</p>
      </div>

      {/* ============================================ */}
      {/* 3. 알고리즘 작동 원리 (토글) */}
      {/* ============================================ */}
      <div className="algoCard">
        <button
          type="button"
          className="algoHead"
          onClick={() => setShowAlgorithm(!showAlgorithm)}
          aria-expanded={showAlgorithm}
        >
          <span className="algoIcon">⚙️</span>
          <span className="algoTitle">숨겨진 알고리즘 작동 원리</span>
          <span className="algoBadge">뒷단 노림수</span>
          <span className={`algoArrow ${showAlgorithm ? 'open' : ''}`}>▼</span>
        </button>
        {showAlgorithm && (
          <div className="algoBody">
            <div className="algoContent">{scenario.hiddenAlgorithm}</div>
            <div className="algoNote">
              💡 시청자가 의식하지 못한 채 끝까지 보게 만드는 "보이지 않는 설계"입니다.
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 4. 예상 시청 유지율 게이지 */}
      {/* ============================================ */}
      <div className="retentionCard">
        <div className="retentionTop">
          <span className="retentionLabel">
            <span style={{ fontSize: 18 }}>📊</span>
            <span>예상 시청 유지율</span>
          </span>
          <span className="retentionNum">{scenario.estimatedRetention}%</span>
        </div>
        <div className="retentionBar">
          <div
            className="retentionFill"
            style={{ width: `${scenario.estimatedRetention}%` }}
          />
        </div>
        <p className="retentionDesc">
          유튜브 알고리즘은 40% 이상에서 추천 박스 진입을 시작합니다.
          이 시나리오는 떡상 임계점을 넘는 구조입니다.
        </p>
      </div>

      {/* ============================================ */}
      {/* 5. 시나리오 6장 (브리지로 연결됨) */}
      {/* ============================================ */}
      <div className="beatsCard">
        <div className="beatsHead">
          <div className="beatsHeadTop">
            <span style={{ fontSize: 18 }}>📖</span>
            <span className="beatsTitle">시나리오 6장 — 하나의 스토리로 연결됨</span>
          </div>
          <p className="beatsSub">
            각 장은 독립적이지 않습니다. 브리지 문장으로 자연스럽게 다음 장으로 이어집니다.
          </p>
        </div>
        <div className="beatsList">
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

      {/* ============================================ */}
      {/* 6. 60초 쇼츠 버전 */}
      {/* ============================================ */}
      <div className="shortsCard">
        <div className="shortsTop">
          <span className="shortsBadge">⚡ 1분 쇼츠</span>
          <span className="shortsLabel">자체 완결 60초 버전</span>
        </div>
        <div className="shortsContent">{scenario.shortVersion}</div>
        <CopyButton text={scenario.shortVersion} label="쇼츠 대본 복사" />
      </div>
    </div>
  );
}

// ============================================================
// 개별 비트 블록
// ============================================================
function BeatBlock({ beat, isExpanded, onToggle, isLast }: {
  beat: any;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const beatColors = [
    '#ef4444', // 1. Hook (빨강)
    '#f97316', // 2. 미끼 (주황)
    '#eab308', // 3. 갈등 (노랑)
    '#22c55e', // 4. 핵심 (초록)
    '#3b82f6', // 5. 실전 (파랑)
    '#a855f7', // 6. CTA (보라)
  ];
  const color = beatColors[beat.id - 1] || beatColors[0];

  return (
    <div className="beat" style={{ borderLeftColor: color }}>
      <button
        type="button"
        className="beatHead"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="beatNum" style={{ background: color }}>
          {beat.id}
        </span>
        <div className="beatHeadInfo">
          <div className="beatTitleRow">
            <span className="beatTitleText">{beat.beatName}</span>
            <span className="beatTime">{beat.timeRange}</span>
          </div>
          <p className="beatPurpose">{beat.purpose}</p>
        </div>
        <span className={`beatArrow ${isExpanded ? 'open' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="beatBody">
          {/* 내레이션 */}
          <div className="beatSection narration">
            <span className="beatSectionLabel">📝 내레이션 (실제 대사)</span>
            <p className="beatSectionContent">"{beat.narration}"</p>
            <CopyButton text={beat.narration} label="대사 복사" small />
          </div>

          {/* 화면 연출 */}
          <div className="beatSection">
            <span className="beatSectionLabel">🎬 화면 연출 지시</span>
            <p className="beatSectionContent">{beat.visualDirection}</p>
          </div>

          {/* 알고리즘 후킹 */}
          <div className="beatSection algo">
            <span className="beatSectionLabel">⚙️ 알고리즘 후킹 (뒷단 노림수)</span>
            <p className="beatSectionContent">{beat.algorithmHook}</p>
          </div>

          {/* 시청 유지 목표 */}
          <div className="beatSection target">
            <span className="beatSectionLabel">🎯 이 구간 시청 유지 목표</span>
            <p className="beatSectionContent">{beat.retentionTarget}</p>
          </div>

          {/* 다음 장으로 연결 */}
          {!isLast && (
            <div className="beatSection bridge">
              <span className="beatSectionLabel">🔗 다음 장으로 연결되는 브리지</span>
              <p className="beatSectionContent" style={{ fontStyle: 'italic' }}>
                "{beat.bridgeToNext}"
              </p>
              <p className="beatBridgeNote">
                ↓ 이 한 줄이 다음 비트의 첫 문장과 자연스럽게 이어집니다.
              </p>
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
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copyBtn ${copied ? 'copied' : ''}`}
      style={small ? { fontSize: 11, padding: '5px 10px' } : {}}
    >
      {copied ? '✓ 복사됨' : `📋 ${label}`}
    </button>
  );
}
