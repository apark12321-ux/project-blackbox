'use client';
/**
 * 🎯 최종 /done 페이지
 *
 * 박예준 대표 최종 요청:
 * ✅ AlgoOracle (베가스 카지노 드라마) 적용
 * ✅ 각 SNS의 실제 업로드 화면 그대로 재현
 * ✅ 빈칸에 들어갈 내용 모두 채워서 복붙만 하면 되게
 * ✅ 한글+영문 이미지/영상 프롬프트
 * ✅ 추천 AI 툴 링크
 */

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DashboardShell, getProject } from '../_shared/V11Shell';
import { getPlatformById, getCategoryById, PLATFORMS } from '../_shared/platforms';
import { generatePromptPackages, type PromptPackage } from '../_shared/promptGenerator';
import AlgoBooster, { BoosterData } from '../_shared/AlgoBooster';
import CrystalBallOracle from '../_shared/CrystalBallOracle';
import AdSlot from '../_shared/AdSlot';

type TabKey = 'sns' | 'prompts';
type PromptMediaType = 'image' | 'video';

export default function DonePage() {
  const [keyword, setKeyword] = useState('영상');
  const [category, setCategory] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>('sns');
  const [activePlatform, setActivePlatform] = useState<string>('');
  const [promptMediaType, setPromptMediaType] = useState<PromptMediaType>('image');
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string>('');

  useEffect(() => {
    const project = getProject();
    if (project.keyword) setKeyword(project.keyword);
    if (project.category) setCategory(project.category);
    if (project.scenarioStyleId) setScenarioId(project.scenarioStyleId);

    if (typeof window !== 'undefined') {
      try {
        const platforms = localStorage.getItem('v11_platforms');
        if (platforms) {
          const arr = JSON.parse(platforms);
          setSelectedPlatforms(arr);
          if (arr[0]) setActivePlatform(arr[0]);
        }
      } catch {}
    }
  }, []);

  const currentCategory = getCategoryById(category);
  const platforms = selectedPlatforms.map((id) => getPlatformById(id)).filter(Boolean);
  const currentPlatform = platforms.find((p) => p?.id === activePlatform) || platforms[0];

  const initialData: BoosterData = {
    title: `${keyword} 2026년 달라지는 점`,
    grade: 'B+', retention: 42, ctr: 4.2,
  };
  const optimizedData: BoosterData = {
    title: `⚠️ 2026 ${keyword}, 이 3가지 모르면 매달 30만원 손해봅니다`,
    grade: 'A++', retention: 78, ctr: 8.7,
  };

  const displayTitle = applied ? optimizedData.title : initialData.title;

  // 프롬프트 패키지 생성
  const { images: imagePackages, videos: videoPackages } = generatePromptPackages(
    keyword,
    category || 'economy',
    scenarioId || 'default',
    selectedPlatforms.length ? selectedPlatforms : ['youtube-long']
  );

  const activePackages = promptMediaType === 'image' ? imagePackages : videoPackages;

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1500);
    }
  };

  const getDescription = (platformId: string) => {
    const base = `${displayTitle}\n\n📌 이번 영상에서 다루는 내용\n\n${keyword}에 대한 2026년 최신 정보를 깊이 있게 정리했습니다.\n\n✅ 꼭 알아야 할 핵심 포인트 3가지\n✅ 전문가들이 말하는 실전 전략\n✅ 2026년 달라지는 제도와 대응법\n\n💬 영상이 도움되셨다면 구독과 좋아요 부탁드려요!\n더 많은 유익한 정보를 전해드리겠습니다.\n\n⏰ 영상 타임라인\n0:00 인트로\n0:30 문제 제기\n2:30 핵심 포인트 1\n5:00 핵심 포인트 2\n7:30 결론 및 요약\n\n📩 문의: contact@nutube.kr\n\n#${keyword.replace(/\s+/g, '')} #2026 #${currentCategory?.name.split('·')[0] || '경제'}`;
    return base;
  };

  const getHashtags = (platformId: string) => {
    const base = `#${keyword.replace(/\s+/g, '')} #2026 #${currentCategory?.name.split('·')[0] || '경제'}`;
    const specific: { [key: string]: string } = {
      'youtube-long': `${base} #꿀팁 #정보 #완벽정리`,
      'youtube-shorts': `#Shorts ${base} #꿀팁 #1분정리`,
      'tiktok': `#fyp #추천 ${base} #꿀팁 #틱톡`,
      'instagram-reels': `${base} #릴스 #인스타그램 #저장필수 #일상정보 #팔로우`,
    };
    return specific[platformId] || base;
  };

  const getTags = () => {
    return `${keyword}, 2026년 ${keyword}, ${currentCategory?.name || '경제'}, ${keyword} 전망, ${keyword} 분석, ${keyword} 팁, ${keyword} 꿀팁, ${keyword} 완벽정리, ${keyword} 초보, ${keyword} 2026`;
  };

  return (
    <DashboardShell>
      <style jsx>{`
        .page { max-width: 1200px; margin: 0 auto; padding: 32px 24px 64px; }

        .pageHead {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(90, 74, 58, 0.08);
        }
        .stepBadge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px;
          background: #eaf2ea; color: #5e7e5d;
          border-radius: 999px;
          font-size: 11px; font-weight: 800;
          margin-bottom: 14px; letter-spacing: -0.01em;
        }
        .stepDot { width: 6px; height: 6px; background: #5e7e5d; border-radius: 50%; }
        .pageTitle {
          font-size: 32px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.035em; line-height: 1.2; margin-bottom: 10px;
        }
        .pageTitle .accent { color: #c65f3b; }
        .pageSub {
          font-size: 14px; color: #564a3a; line-height: 1.6;
          font-weight: 500; max-width: 580px; margin: 0 auto;
        }

        .sectionHeader {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px;
        }
        .sectionEmoji { font-size: 22px; }
        .sectionTitle {
          font-size: 18px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.025em;
        }
        .sectionDivider {
          height: 1px;
          background: linear-gradient(to right, rgba(90, 74, 58, 0.15), transparent);
          flex: 1; margin-left: 10px;
        }

        /* ============================================================
           🔐 AlgoMaker 독자 알고리즘 박스 (미스터리 + 보호)
           ============================================================ */
        .algoBox {
          position: relative;
          background: linear-gradient(135deg, #2a2419 0%, #3a332a 100%);
          border-radius: 16px;
          padding: 28px 24px;
          margin-bottom: 28px;
          overflow: hidden;
          color: #f5f1ea;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .no-select {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        .no-copy {
          -webkit-touch-callout: none;
          -webkit-user-drag: none;
          pointer-events: auto;
        }
        .algoPattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(198, 95, 59, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(125, 155, 124, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .algoHeader {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          z-index: 1;
        }
        .algoPulse {
          width: 10px; height: 10px;
          background: #5e7e5d;
          border-radius: 50%;
          position: relative;
        }
        .algoPulse::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(94, 126, 93, 0.4);
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .algoStatus {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(245, 241, 234, 0.65);
        }
        .algoTitle {
          position: relative;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin-bottom: 8px;
          z-index: 1;
        }
        .algoSubtitle {
          position: relative;
          font-size: 12.5px;
          color: rgba(245, 241, 234, 0.55);
          line-height: 1.6;
          margin-bottom: 22px;
          z-index: 1;
        }
        .algoProcess {
          position: relative;
          margin-bottom: 22px;
          z-index: 1;
        }
        .algoStep {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          background: rgba(245, 241, 234, 0.04);
          border: 1px solid rgba(245, 241, 234, 0.08);
          border-radius: 10px;
          margin-bottom: 6px;
          transition: all 0.3s;
        }
        .algoStep.completed {
          background: rgba(94, 126, 93, 0.08);
          border-color: rgba(94, 126, 93, 0.2);
        }
        .algoStep.active {
          background: rgba(198, 95, 59, 0.1);
          border-color: rgba(198, 95, 59, 0.25);
        }
        .algoStepDot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(245, 241, 234, 0.2);
        }
        .algoStep.completed .algoStepDot {
          background: #5e7e5d;
        }
        .algoStep.active .algoStepDot {
          background: #c65f3b;
        }
        .algoStepDot.pulse {
          animation: dotPulse 1.5s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(198, 95, 59, 0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(198, 95, 59, 0); }
        }
        .algoStepText {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .algoStepLabel {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(245, 241, 234, 0.45);
        }
        .algoStepName {
          font-size: 13px;
          font-weight: 700;
          color: #f5f1ea;
        }
        .algoStepCheck {
          font-size: 14px;
          color: #5e7e5d;
          font-weight: 800;
        }
        .algoStepLoading {
          font-size: 18px;
          color: #f5a26b;
          animation: loadingDots 1.5s ease-in-out infinite;
        }
        @keyframes loadingDots {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .algoResult {
          position: relative;
          background: rgba(198, 95, 59, 0.12);
          border: 1px solid rgba(198, 95, 59, 0.3);
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 22px;
          text-align: center;
          z-index: 1;
        }
        .algoResultLabel {
          font-size: 11px;
          font-weight: 700;
          color: rgba(245, 241, 234, 0.7);
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .algoResultValue {
          font-size: 44px;
          font-weight: 800;
          color: #f5a26b;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .algoResultNote {
          font-size: 11.5px;
          color: rgba(245, 241, 234, 0.55);
          line-height: 1.5;
        }
        .algoLockNote {
          position: relative;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(245, 241, 234, 0.1);
          font-size: 11px;
          color: rgba(245, 241, 234, 0.5);
          text-align: center;
          line-height: 1.6;
          z-index: 1;
        }

        /* 확장 섹션 */
        .extSection {
          background: linear-gradient(135deg, #eaf2ea 0%, #faf8f4 100%);
          border: 1px solid rgba(125, 155, 124, 0.2);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .extEmoji { font-size: 28px; }
        .extText { flex: 1; }
        .extTitle {
          font-size: 15px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.02em; margin-bottom: 3px;
        }
        .extSub {
          font-size: 12px; color: #564a3a; line-height: 1.55; font-weight: 500;
        }
        .extSub strong { color: #5e7e5d; font-weight: 700; }

        /* 탭 */
        .tabBar {
          display: flex; gap: 5px; margin-bottom: 18px;
          padding: 5px; background: #faf8f4; border-radius: 10px;
        }
        .tabBtn {
          flex: 1; padding: 10px 14px;
          background: transparent; border: none; border-radius: 7px;
          font-size: 12.5px; font-weight: 700; color: #8a7d6a;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.18s;
        }
        .tabBtn:hover { color: #2a2419; background: #fff; }
        .tabBtn.active {
          background: #fff; color: #c65f3b;
          box-shadow: 0 2px 6px rgba(90, 74, 58, 0.08);
        }

        /* 플랫폼 스위처 */
        .platformSwitcher {
          display: flex; gap: 6px; margin-bottom: 16px;
          flex-wrap: wrap; padding: 4px;
          background: #faf8f4; border-radius: 10px;
        }
        .platformTab {
          padding: 8px 14px;
          background: transparent; border: none; border-radius: 7px;
          font-size: 12px; font-weight: 700; color: #564a3a;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.15s;
        }
        .platformTab:hover { background: #fff; }
        .platformTab.active { background: #c65f3b; color: #fff; }

        /* ========== YouTube Studio 스타일 ========== */
        .ytStudio {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }
        .ytStudioHeader {
          padding: 14px 20px;
          background: #fff;
          border-bottom: 1px solid #e5e5e5;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ytLogo {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; color: #0f0f0f;
        }
        .ytLogoIcon {
          width: 28px; height: 20px;
          background: #ff0000; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .ytLogoIcon::after {
          content: ''; width: 0; height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid #fff;
          margin-left: 2px;
        }
        .ytStudioTitle {
          font-size: 13px; color: #606060; font-weight: 500;
        }

        .ytBody { padding: 24px; }
        .ytSectionTitle {
          font-size: 16px; font-weight: 500; color: #0f0f0f;
          margin-bottom: 4px;
        }
        .ytSectionSub {
          font-size: 12px; color: #606060; margin-bottom: 20px;
        }

        .ytField { margin-bottom: 18px; }
        .ytFieldHead {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 6px;
        }
        .ytFieldLabel {
          font-size: 13px; color: #0f0f0f; font-weight: 400;
        }
        .ytFieldLabel.required::after {
          content: ' *'; color: #cc0000;
        }
        .ytFieldCount {
          font-size: 11px; color: #606060; font-weight: 400;
        }
        .ytInput {
          width: 100%; padding: 10px 14px;
          background: #fff;
          border: 1px solid #cccccc; border-radius: 4px;
          font-size: 14px; color: #0f0f0f;
          font-family: 'Roboto', -apple-system, sans-serif;
          min-height: 44px; resize: vertical;
          line-height: 1.5;
        }
        .ytInput.filled {
          background: #f9f9f9;
          border-color: #065fd4;
        }
        .ytInput.textarea {
          min-height: 120px; white-space: pre-wrap;
        }
        .ytCopyBtn {
          margin-top: 6px;
          padding: 5px 12px;
          background: #065fd4; color: #fff;
          border: none; border-radius: 4px;
          font-size: 11px; font-weight: 500; cursor: pointer;
          font-family: inherit;
        }
        .ytCopyBtn.copied {
          background: #0d7834;
        }

        .ytThumbnail {
          aspect-ratio: 16 / 9;
          max-width: 320px;
          background: linear-gradient(135deg, #3a332a, #2a2419);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px;
          position: relative; overflow: hidden;
        }
        .ytThumbnail::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(198, 95, 59, 0.2), transparent);
        }
        .ytThumbnailText { position: relative; z-index: 1; text-align: center; padding: 0 20px; }
        .ytThumbnailText strong { display: block; color: #f5a26b; font-size: 15px; margin-top: 4px; }

        .ytRadio {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ytRadioItem {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px;
          border: 1px solid #e5e5e5; border-radius: 4px;
        }
        .ytRadioItem.selected {
          border-color: #065fd4;
          background: rgba(6, 95, 212, 0.05);
        }
        .ytRadioDot {
          width: 18px; height: 18px;
          border: 2px solid #606060; border-radius: 50%;
          flex-shrink: 0; margin-top: 2px;
          display: flex; align-items: center; justify-content: center;
        }
        .ytRadioItem.selected .ytRadioDot {
          border-color: #065fd4;
        }
        .ytRadioItem.selected .ytRadioDot::after {
          content: ''; width: 10px; height: 10px;
          background: #065fd4; border-radius: 50%;
        }
        .ytRadioText { flex: 1; }
        .ytRadioLabel { font-size: 13px; color: #0f0f0f; font-weight: 500; }
        .ytRadioDesc { font-size: 11px; color: #606060; margin-top: 2px; line-height: 1.4; }

        .ytSelect {
          padding: 10px 14px; background: #f9f9f9;
          border: 1px solid #065fd4; border-radius: 4px;
          font-size: 13px; color: #0f0f0f; font-weight: 500;
        }

        /* ========== TikTok 스타일 ========== */
        .tiktokStudio {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }
        .tiktokHeader {
          padding: 14px 20px;
          background: #000;
          display: flex; align-items: center; gap: 8px;
        }
        .tiktokLogo {
          color: #fff; font-size: 16px; font-weight: 800;
          letter-spacing: -0.02em;
        }
        .tiktokLogo::before { content: '♪ '; }
        .tiktokTitle {
          margin-left: auto;
          color: rgba(255,255,255,0.7); font-size: 12px;
        }

        .tiktokBody {
          padding: 20px; display: grid;
          grid-template-columns: 1fr 200px; gap: 24px;
        }
        .tiktokFields { display: flex; flex-direction: column; gap: 16px; }
        .tiktokField { }
        .tiktokFieldLabel {
          font-size: 13px; color: #161823; font-weight: 600;
          margin-bottom: 6px;
        }
        .tiktokCount { font-size: 11px; color: #8a8b91; font-weight: 400; margin-left: 6px; }
        .tiktokInput {
          width: 100%; padding: 12px;
          background: #f8f8f8;
          border: 1px solid transparent; border-radius: 4px;
          font-size: 14px; color: #161823;
          font-family: inherit; min-height: 80px;
          white-space: pre-wrap;
        }
        .tiktokInput.filled {
          background: #f0f9ff; border-color: #00f2ea;
        }
        .tiktokCopyBtn {
          margin-top: 6px; padding: 5px 12px;
          background: #fe2c55; color: #fff;
          border: none; border-radius: 2px;
          font-size: 11px; font-weight: 700; cursor: pointer;
          font-family: inherit;
        }
        .tiktokCopyBtn.copied { background: #00c853; }

        .tiktokCover {
          aspect-ratio: 9 / 16;
          background: linear-gradient(135deg, #fe2c55, #25f4ee);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; text-align: center; padding: 20px;
          position: relative;
        }
        .tiktokCover strong { display: block; font-size: 14px; margin-top: 4px; }

        .tiktokToggle {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .tiktokToggle:last-child { border-bottom: none; }
        .tiktokToggleLabel {
          font-size: 13px; color: #161823; font-weight: 500;
        }
        .tiktokToggleOn {
          padding: 3px 10px; background: #00f2ea; color: #000;
          border-radius: 999px; font-size: 11px; font-weight: 700;
        }

        /* ========== Instagram 스타일 ========== */
        .igStudio {
          background: #fff;
          border: 1px solid #dbdbdb;
          border-radius: 12px;
          overflow: hidden;
        }
        .igHeader {
          padding: 14px 20px;
          background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d, #f56040, #f77737, #fcaf45, #ffdc80);
          display: flex; align-items: center; gap: 10px;
        }
        .igLogo { color: #fff; font-weight: 700; font-size: 16px; }
        .igTitle { margin-left: auto; color: rgba(255,255,255,0.9); font-size: 12px; }

        .igBody { padding: 20px; display: grid; grid-template-columns: 200px 1fr; gap: 24px; }
        .igCover {
          aspect-ratio: 9 / 16;
          background: linear-gradient(135deg, #833ab4, #fd1d1d);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; text-align: center; padding: 20px;
        }
        .igCover strong { display: block; font-size: 14px; margin-top: 4px; }

        .igFields { display: flex; flex-direction: column; gap: 14px; }
        .igField { }
        .igFieldLabel { font-size: 13px; color: #262626; font-weight: 600; margin-bottom: 6px; }
        .igInput {
          width: 100%; padding: 10px 12px;
          border: 1px solid #dbdbdb; border-radius: 4px;
          font-size: 13px; color: #262626; font-family: inherit;
          min-height: 70px; white-space: pre-wrap;
        }
        .igInput.filled { background: #fafafa; border-color: #0095f6; }
        .igCopyBtn {
          margin-top: 6px; padding: 5px 12px;
          background: #0095f6; color: #fff;
          border: none; border-radius: 4px;
          font-size: 11px; font-weight: 600; cursor: pointer;
          font-family: inherit;
        }
        .igCopyBtn.copied { background: #4CAF50; }

        /* Shorts 스타일 */
        .shortsStudio {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
        }
        .shortsHeader {
          padding: 14px 20px;
          background: linear-gradient(to right, #ff0050, #ff0000);
          display: flex; align-items: center; gap: 10px;
        }
        .shortsLogo { color: #fff; font-weight: 800; font-size: 16px; }

        /* 프롬프트 섹션 */
        .mediaTypeToggle {
          display: flex; gap: 6px; margin-bottom: 16px;
          padding: 4px; background: #faf8f4; border-radius: 10px;
          max-width: 300px;
        }
        .mediaTypeBtn {
          flex: 1; padding: 10px;
          background: transparent; border: none; border-radius: 7px;
          font-size: 12px; font-weight: 700; color: #8a7d6a;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .mediaTypeBtn.active {
          background: #fff; color: #c65f3b;
          box-shadow: 0 2px 6px rgba(90, 74, 58, 0.08);
        }

        .styleTabs {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
          margin-bottom: 16px;
        }
        .styleTab {
          padding: 12px 10px;
          background: #faf8f4; border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 10px; cursor: pointer; text-align: center;
          transition: all 0.18s;
        }
        .styleTab:hover {
          transform: translateY(-2px);
          border-color: #c65f3b;
        }
        .styleTab.active {
          background: #fdf1e7; border: 2px solid #c65f3b;
        }
        .styleEmoji { font-size: 22px; margin-bottom: 4px; }
        .styleName { font-size: 12px; font-weight: 800; color: #2a2419; letter-spacing: -0.015em; }
        .styleDesc { font-size: 10px; color: #8a7d6a; margin-top: 2px; line-height: 1.3; }

        .toolInfo {
          padding: 12px 16px; background: #eaf0f5;
          border-radius: 10px; margin-bottom: 14px;
        }
        .toolInfoTitle {
          font-size: 11px; font-weight: 800; color: #3a5a7a;
          letter-spacing: 0.05em; margin-bottom: 8px;
        }
        .toolGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .toolItem {
          padding: 8px 12px; background: #fff; border-radius: 7px;
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; transition: all 0.15s;
          border: 1px solid #dde4ea;
        }
        .toolItem:hover { border-color: #c65f3b; background: #fdf1e7; }
        .toolItemEmoji { font-size: 16px; }
        .toolItemBody { flex: 1; min-width: 0; }
        .toolItemName { font-size: 12px; font-weight: 700; color: #2a2419; }
        .toolItemSub { font-size: 10px; color: #8a7d6a; margin-top: 1px; }

        .sceneCards { display: flex; flex-direction: column; gap: 12px; }
        .sceneCard {
          background: #fff; border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 10px; padding: 16px;
        }
        .sceneHead {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px; border-bottom: 1px dashed rgba(90,74,58,0.1);
        }
        .sceneHeadLeft { display: flex; align-items: center; gap: 10px; }
        .scenePurpose {
          font-size: 13px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.015em;
        }
        .sceneTime {
          padding: 2px 8px; background: #faf8f4;
          border-radius: 999px; font-size: 10px; font-weight: 700;
          color: #8a7d6a;
        }
        .sceneAspect {
          padding: 2px 8px; background: #fdf1e7; color: #a64a2a;
          border-radius: 999px; font-size: 10px; font-weight: 700;
        }

        .sceneKorean {
          padding: 10px 12px;
          background: #f5f1ea; border-radius: 8px;
          margin-bottom: 8px;
        }
        .sceneKoreanLabel {
          font-size: 10px; font-weight: 800; color: #8a7d6a;
          letter-spacing: 0.06em; margin-bottom: 4px; text-transform: uppercase;
        }
        .sceneKoreanText {
          font-size: 13px; color: #2a2419; line-height: 1.6; font-weight: 500;
        }
        .sceneEnglish {
          padding: 10px 12px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .sceneEnglishLabel {
          font-size: 10px; font-weight: 800; color: #3a5a7a;
          letter-spacing: 0.06em; margin-bottom: 4px; text-transform: uppercase;
        }
        .sceneEnglishText {
          font-size: 11.5px; color: #2a2419; line-height: 1.55;
          font-family: 'Consolas', 'Monaco', monospace;
          word-break: break-word; font-weight: 500;
        }
        .sceneNegative {
          margin-top: 6px; padding: 8px 10px;
          background: #fce8e8; border-radius: 6px;
          font-size: 10.5px; color: #a32d2d;
          font-family: 'Consolas', monospace;
        }
        .sceneNegative strong { color: #791f1f; }

        .sceneActions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
        .sceneCopyBtn {
          padding: 6px 12px;
          background: #fff; border: 1px solid rgba(90,74,58,0.12);
          border-radius: 6px;
          font-size: 11px; font-weight: 700; color: #564a3a;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s;
        }
        .sceneCopyBtn:hover { border-color: #c65f3b; color: #c65f3b; }
        .sceneCopyBtn.copied {
          background: #eaf2ea; border-color: #7d9b7c; color: #5e7e5d;
        }

        .copyAllBtn {
          margin-top: 14px; padding: 10px 16px;
          background: linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%);
          color: #fff; border: none; border-radius: 9px;
          font-size: 12.5px; font-weight: 800; cursor: pointer;
          font-family: inherit;
          width: 100%;
        }

        .nextSteps {
          margin-top: 32px; padding: 20px 24px;
          background: #fff; border: 1px solid rgba(90, 74, 58, 0.08);
          border-radius: 14px;
        }
        .nextStepsTitle {
          font-size: 15px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.02em; margin-bottom: 12px;
        }
        .nextStepsGrid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .nextStepCard {
          padding: 14px 16px; background: #faf8f4; border-radius: 10px;
          border: 1px solid rgba(90, 74, 58, 0.06);
          transition: all 0.18s; text-decoration: none;
        }
        .nextStepCard:hover {
          transform: translateY(-2px);
          border-color: rgba(198, 95, 59, 0.25);
        }
        .nextStepIcon { font-size: 18px; margin-bottom: 5px; }
        .nextStepTitle {
          font-size: 12.5px; font-weight: 800; color: #2a2419;
          letter-spacing: -0.015em; margin-bottom: 2px;
        }
        .nextStepDesc {
          font-size: 11px; color: #8a7d6a; line-height: 1.5; font-weight: 500;
        }

        .adWrap { margin: 24px 0; }

        @media (max-width: 900px) {
          .downloadBtns { grid-template-columns: 1fr; }
          .styleTabs { grid-template-columns: 1fr 1fr; }
          .toolGrid { grid-template-columns: 1fr; }
          .tiktokBody { grid-template-columns: 1fr; }
          .igBody { grid-template-columns: 1fr; }
          .nextStepsGrid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .page { padding: 20px 14px 40px; }
          .pageTitle { font-size: 24px; }
          .tabBar { flex-direction: column; }
        }
      `}</style>

      <div className="page">
        <header className="pageHead">
          <div className="stepBadge">
            <span className="stepDot" />
            STEP 6 / 6 · 영상 완성 + 업로드 준비 완료
          </div>
          <h1 className="pageTitle">
            이제 <span className="accent">복사-붙여넣기</span>만 하세요!
          </h1>
          <p className="pageSub">
            각 플랫폼의 <strong style={{color: '#c65f3b'}}>실제 업로드 화면</strong>을 그대로 재현했어요.
            빈칸 채우는 대신 그대로 복사해서 업로드하면 됩니다.
          </p>
        </header>

        {/* ============================================================
            🔮 CrystalBallOracle - 압도적 신비감
            ============================================================ */}
        <CrystalBallOracle
          category="economy"
          keyword={keyword}
          title={displayTitle}
        />

        <section className="oracleBoosterSection">
          <AlgoBooster
            initialData={initialData}
            optimizedData={optimizedData}
            onApply={() => setApplied(true)}
            variant="full"
          />
        </section>

        <div className="adWrap">
          <AdSlot slot="done-mid" variant="horizontal" />
        </div>

        {/* 확장 섹션 */}
        <div className="extSection">
          <span className="extEmoji">✨</span>
          <div className="extText">
            <div className="extTitle">각 SNS 업로드 화면 그대로 준비됐어요</div>
            <div className="extSub">
              실제 업로드 페이지와 <strong>똑같이</strong> 재현했어요. 복사해서 그대로 붙여넣으세요.
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="tabBar">
          <button
            className={`tabBtn ${activeTab === 'sns' ? 'active' : ''}`}
            onClick={() => setActiveTab('sns')}
          >
            📱 <span>SNS 업로드 템플릿</span>
          </button>
          <button
            className={`tabBtn ${activeTab === 'prompts' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompts')}
          >
            🎨 <span>이미지/영상 프롬프트</span>
          </button>
        </div>

        {/* ========== SNS 업로드 템플릿 탭 ========== */}
        {activeTab === 'sns' && (
          <>
            <div className="platformSwitcher">
              {platforms.map((p) => p && (
                <button
                  key={p.id}
                  className={`platformTab ${activePlatform === p.id ? 'active' : ''}`}
                  onClick={() => setActivePlatform(p.id)}
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* YouTube 롱폼 - Studio 재현 */}
            {currentPlatform?.id === 'youtube-long' && (
              <div className="ytStudio">
                <div className="ytStudioHeader">
                  <div className="ytLogo">
                    <div className="ytLogoIcon" />
                    <span>Studio</span>
                  </div>
                  <span className="ytStudioTitle">동영상 업로드</span>
                </div>
                <div className="ytBody">
                  <div className="ytSectionTitle">세부정보</div>
                  <div className="ytSectionSub">이 제목과 설명이 동영상에 포함됩니다.</div>

                  <div className="ytField">
                    <div className="ytFieldHead">
                      <span className="ytFieldLabel required">제목</span>
                      <span className="ytFieldCount">{displayTitle.length}/100</span>
                    </div>
                    <div className="ytInput filled">{displayTitle}</div>
                    <button
                      className={`ytCopyBtn ${copiedKey === 'yt-title' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(displayTitle, 'yt-title')}
                    >
                      {copiedKey === 'yt-title' ? '✓ 복사됨' : '📋 제목 복사'}
                    </button>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldHead">
                      <span className="ytFieldLabel">설명</span>
                      <span className="ytFieldCount">{getDescription('youtube-long').length}/5000</span>
                    </div>
                    <div className="ytInput filled textarea">{getDescription('youtube-long')}</div>
                    <button
                      className={`ytCopyBtn ${copiedKey === 'yt-desc' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(getDescription('youtube-long'), 'yt-desc')}
                    >
                      {copiedKey === 'yt-desc' ? '✓ 복사됨' : '📋 설명 복사'}
                    </button>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 8}}>썸네일</div>
                    <div className="ytThumbnail">
                      <div className="ytThumbnailText">
                        <span style={{fontSize: 11, opacity: 0.7}}>1280 × 720</span>
                        <strong>{displayTitle.slice(0, 18)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 8}}>재생목록</div>
                    <div className="ytSelect">
                      {currentCategory?.emoji} {currentCategory?.name || '경제·재테크'} - {keyword}
                    </div>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 8}}>시청자층</div>
                    <div className="ytRadio">
                      <div className="ytRadioItem selected">
                        <div className="ytRadioDot" />
                        <div className="ytRadioText">
                          <div className="ytRadioLabel">아니요, 아동용이 아닙니다</div>
                          <div className="ytRadioDesc">13세 이상 사용자에게 더 적합한 동영상</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldHead">
                      <span className="ytFieldLabel">태그</span>
                      <span className="ytFieldCount">{getTags().length}/500</span>
                    </div>
                    <div className="ytInput filled" style={{fontSize: 12}}>{getTags()}</div>
                    <button
                      className={`ytCopyBtn ${copiedKey === 'yt-tags' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(getTags(), 'yt-tags')}
                    >
                      {copiedKey === 'yt-tags' ? '✓ 복사됨' : '📋 태그 복사'}
                    </button>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 8}}>카테고리</div>
                    <div className="ytSelect">
                      {category === 'economy' ? '뉴스/정치' :
                        category === 'health' ? '인물/블로그' :
                        category === 'it' ? '과학기술' :
                        category === 'education' ? '교육' :
                        category === 'game' ? '게임' : '엔터테인먼트'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* YouTube Shorts */}
            {currentPlatform?.id === 'youtube-shorts' && (
              <div className="shortsStudio">
                <div className="shortsHeader">
                  <div className="shortsLogo">▶ Shorts 업로드</div>
                </div>
                <div className="ytBody">
                  <div className="ytField">
                    <div className="ytFieldHead">
                      <span className="ytFieldLabel required">제목 (#Shorts 포함)</span>
                      <span className="ytFieldCount">100자</span>
                    </div>
                    <div className="ytInput filled">{displayTitle} #Shorts</div>
                    <button
                      className={`ytCopyBtn ${copiedKey === 'shorts-title' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(`${displayTitle} #Shorts`, 'shorts-title')}
                    >
                      {copiedKey === 'shorts-title' ? '✓ 복사됨' : '📋 복사'}
                    </button>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 6}}>해시태그</div>
                    <div className="ytInput filled">{getHashtags('youtube-shorts')}</div>
                    <button
                      className={`ytCopyBtn ${copiedKey === 'shorts-tags' ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(getHashtags('youtube-shorts'), 'shorts-tags')}
                    >
                      {copiedKey === 'shorts-tags' ? '✓ 복사됨' : '📋 복사'}
                    </button>
                  </div>

                  <div className="ytField">
                    <div className="ytFieldLabel" style={{marginBottom: 8}}>세로 커버 (1080×1920)</div>
                    <div className="ytThumbnail" style={{aspectRatio: '9/16', maxWidth: 180, margin: '0 auto'}}>
                      <div className="ytThumbnailText">
                        <strong style={{fontSize: 13}}>{displayTitle.slice(0, 12)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TikTok */}
            {currentPlatform?.id === 'tiktok' && (
              <div className="tiktokStudio">
                <div className="tiktokHeader">
                  <div className="tiktokLogo">TikTok</div>
                  <div className="tiktokTitle">Upload</div>
                </div>
                <div className="tiktokBody">
                  <div className="tiktokFields">
                    <div className="tiktokField">
                      <div className="tiktokFieldLabel">
                        Caption <span className="tiktokCount">(2,200자)</span>
                      </div>
                      <div className="tiktokInput filled">
{`${displayTitle} 💡

${keyword}에 대해 알려드릴게요!
이거 모르면 진짜 손해예요 😱

댓글로 여러분 의견 알려주세요 👇

${getHashtags('tiktok')}`}
                      </div>
                      <button
                        className={`tiktokCopyBtn ${copiedKey === 'tiktok-cap' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(
                          `${displayTitle} 💡\n\n${keyword}에 대해 알려드릴게요!\n이거 모르면 진짜 손해예요 😱\n\n댓글로 여러분 의견 알려주세요 👇\n\n${getHashtags('tiktok')}`,
                          'tiktok-cap'
                        )}
                      >
                        {copiedKey === 'tiktok-cap' ? '✓ 복사됨' : '📋 Caption 복사'}
                      </button>
                    </div>

                    <div className="tiktokField">
                      <div className="tiktokFieldLabel">Hashtags</div>
                      <div className="tiktokInput filled" style={{minHeight: 50}}>
                        {getHashtags('tiktok')}
                      </div>
                      <button
                        className={`tiktokCopyBtn ${copiedKey === 'tiktok-tags' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(getHashtags('tiktok'), 'tiktok-tags')}
                      >
                        {copiedKey === 'tiktok-tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>

                    <div className="tiktokField">
                      <div className="tiktokFieldLabel">Sound / BGM</div>
                      <div className="tiktokInput filled" style={{minHeight: 50}}>
                        🎵 긴박한 뉴스 BGM · 트렌드 음악 추천
                      </div>
                    </div>

                    <div>
                      <div className="tiktokToggle">
                        <span className="tiktokToggleLabel">Allow comments</span>
                        <span className="tiktokToggleOn">ON</span>
                      </div>
                      <div className="tiktokToggle">
                        <span className="tiktokToggleLabel">Allow Duet</span>
                        <span className="tiktokToggleOn">ON</span>
                      </div>
                      <div className="tiktokToggle">
                        <span className="tiktokToggleLabel">Allow Stitch</span>
                        <span className="tiktokToggleOn">ON</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="tiktokFieldLabel" style={{marginBottom: 8}}>Cover</div>
                    <div className="tiktokCover">
                      <div>
                        <span style={{fontSize: 10, opacity: 0.8}}>1080 × 1920</span>
                        <strong>{displayTitle.slice(0, 10)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram Reels */}
            {currentPlatform?.id === 'instagram-reels' && (
              <div className="igStudio">
                <div className="igHeader">
                  <div className="igLogo">📷 Instagram</div>
                  <div className="igTitle">새 릴스</div>
                </div>
                <div className="igBody">
                  <div>
                    <div className="igFieldLabel" style={{marginBottom: 8}}>커버</div>
                    <div className="igCover">
                      <div>
                        <span style={{fontSize: 10, opacity: 0.8}}>1080 × 1920</span>
                        <strong>{displayTitle.slice(0, 10)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="igFields">
                    <div className="igField">
                      <div className="igFieldLabel">캡션</div>
                      <div className="igInput filled">
{`${displayTitle} 💡

${keyword}에 대해 정리했어요!
저장 필수 🔖

${getHashtags('instagram-reels')}`}
                      </div>
                      <button
                        className={`igCopyBtn ${copiedKey === 'ig-cap' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(
                          `${displayTitle} 💡\n\n${keyword}에 대해 정리했어요!\n저장 필수 🔖\n\n${getHashtags('instagram-reels')}`,
                          'ig-cap'
                        )}
                      >
                        {copiedKey === 'ig-cap' ? '✓ 복사됨' : '📋 캡션 복사'}
                      </button>
                    </div>

                    <div className="igField">
                      <div className="igFieldLabel">해시태그 (최대 30개)</div>
                      <div className="igInput filled">{getHashtags('instagram-reels')}</div>
                      <button
                        className={`igCopyBtn ${copiedKey === 'ig-tags' ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(getHashtags('instagram-reels'), 'ig-tags')}
                      >
                        {copiedKey === 'ig-tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>

                    <div className="igField">
                      <div className="igFieldLabel">음악</div>
                      <div className="igInput filled" style={{minHeight: 40}}>
                        🎵 Instagram 라이브러리에서 추천 음악 선택
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== 이미지/영상 프롬프트 탭 ========== */}
        {activeTab === 'prompts' && (
          <>
            {/* 미디어 타입 선택 */}
            <div className="mediaTypeToggle">
              <button
                className={`mediaTypeBtn ${promptMediaType === 'image' ? 'active' : ''}`}
                onClick={() => { setPromptMediaType('image'); setActiveStyleIdx(0); }}
              >
                🖼️ <span>이미지</span>
              </button>
              <button
                className={`mediaTypeBtn ${promptMediaType === 'video' ? 'active' : ''}`}
                onClick={() => { setPromptMediaType('video'); setActiveStyleIdx(0); }}
              >
                🎬 <span>영상</span>
              </button>
            </div>

            {/* 스타일 선택 (이미지만) */}
            {promptMediaType === 'image' && (
              <div className="styleTabs">
                {imagePackages.map((pkg, idx) => (
                  <div
                    key={pkg.style}
                    className={`styleTab ${activeStyleIdx === idx ? 'active' : ''}`}
                    onClick={() => setActiveStyleIdx(idx)}
                  >
                    <div className="styleEmoji">{pkg.styleEmoji}</div>
                    <div className="styleName">{pkg.styleLabel}</div>
                    <div className="styleDesc">{pkg.description}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 추천 툴 */}
            {activePackages[activeStyleIdx] && (
              <>
                <div className="toolInfo">
                  <div className="toolInfoTitle">🛠️ 추천 AI 툴</div>
                  <div className="toolGrid">
                    {activePackages[activeStyleIdx].recommendedTools.map((tool, i) => (
                      <a
                        key={i}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="toolItem"
                      >
                        <span className="toolItemEmoji">{tool.emoji}</span>
                        <div className="toolItemBody">
                          <div className="toolItemName">{tool.name}</div>
                          <div className="toolItemSub">{tool.pricing}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 씬별 프롬프트 */}
                <div className="sceneCards">
                  {activePackages[activeStyleIdx].scenes.map((scene, i) => (
                    <div key={scene.id} className="sceneCard">
                      <div className="sceneHead">
                        <div className="sceneHeadLeft">
                          <span className="scenePurpose">{scene.purpose}</span>
                          <span className="sceneTime">{scene.time}</span>
                        </div>
                        <span className="sceneAspect">{scene.aspectRatio}</span>
                      </div>

                      <div className="sceneKorean">
                        <div className="sceneKoreanLabel">📝 한글 씬 설명</div>
                        <div className="sceneKoreanText">{scene.koreanDesc}</div>
                      </div>

                      <div className="sceneEnglish">
                        <div className="sceneEnglishLabel">🌐 영문 AI 프롬프트 (복사해서 사용)</div>
                        <div className="sceneEnglishText">{scene.englishPrompt}</div>
                        {scene.negativePrompt && (
                          <div className="sceneNegative">
                            <strong>Negative:</strong> {scene.negativePrompt}
                          </div>
                        )}
                      </div>

                      <div className="sceneActions">
                        <button
                          className={`sceneCopyBtn ${copiedKey === `eng-${activeStyleIdx}-${i}` ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(scene.englishPrompt, `eng-${activeStyleIdx}-${i}`)}
                        >
                          {copiedKey === `eng-${activeStyleIdx}-${i}` ? '✓ 복사됨' : '📋 영문 프롬프트'}
                        </button>
                        <button
                          className={`sceneCopyBtn ${copiedKey === `ko-${activeStyleIdx}-${i}` ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(scene.koreanDesc, `ko-${activeStyleIdx}-${i}`)}
                        >
                          {copiedKey === `ko-${activeStyleIdx}-${i}` ? '✓' : '📋 한글 설명'}
                        </button>
                        {scene.negativePrompt && (
                          <button
                            className={`sceneCopyBtn ${copiedKey === `neg-${activeStyleIdx}-${i}` ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(scene.negativePrompt || '', `neg-${activeStyleIdx}-${i}`)}
                          >
                            {copiedKey === `neg-${activeStyleIdx}-${i}` ? '✓' : '📋 Negative'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    className="copyAllBtn"
                    onClick={() => {
                      const allPrompts = activePackages[activeStyleIdx].scenes
                        .map((s, i) => `[Scene ${i+1}] ${s.purpose} (${s.time})\n한글: ${s.koreanDesc}\n영문: ${s.englishPrompt}\n`)
                        .join('\n');
                      copyToClipboard(allPrompts, 'all-prompts');
                    }}
                  >
                    {copiedKey === 'all-prompts' ? '✓ 전체 프롬프트 복사됨' : '📋 전체 프롬프트 한번에 복사'}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* 다음 단계 */}
        <section className="nextSteps">
          <h3 className="nextStepsTitle">🚀 다음 단계</h3>
          <div className="nextStepsGrid">
            <Link href="/" className="nextStepCard">
              <div className="nextStepIcon">🎬</div>
              <div className="nextStepTitle">새 영상 만들기</div>
              <div className="nextStepDesc">다른 키워드로 시작</div>
            </Link>
            <Link href="/blog" className="nextStepCard">
              <div className="nextStepIcon">📚</div>
              <div className="nextStepTitle">노하우 읽기</div>
              <div className="nextStepDesc">조회수 올리는 비법</div>
            </Link>
            <Link href="/about" className="nextStepCard">
              <div className="nextStepIcon">ℹ️</div>
              <div className="nextStepTitle">AlgoMaker 소개</div>
              <div className="nextStepDesc">더 자세히 알아보기</div>
            </Link>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
