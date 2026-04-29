'use client';
/**
 * AlgoMaker 결과 페이지 v6.5.0
 *
 * 박예준 대표 비전:
 * "SNS 초보자가 사이트에 딱 왔을 때 뭔가 필이 팍 꽂혀야 한다"
 * "100명이 같은 키워드 입력해도 100가지 결과"
 * "겉으로는 안보이고, 뒷단에서 알고리즘이 움직여야 함"
 *
 * v6.5.0 추가 (2026.04.30):
 * - 📖 작가급 스토리 모드 (넷플릭스 다큐 + 떡상 유튜버 융합)
 * - 📱 SNS 4종 실제 UI 재현 (YouTube/Shorts/Instagram/TikTok)
 * - 🎨 Midjourney v7 / Sora 2 / VEO 3 전문가급 프롬프트
 *
 * 스토리보드 (6단계):
 * STEP 1 - 비슷한 떡상 영상 사례
 * STEP 2 - 제목 선택 (3개 중 1개)
 * STEP 3 - 떡상 시나리오 (기본 ↔ 작가급 모드 전환 가능) ← v6.5.0
 * STEP 4 - 영상 제작 AI 프롬프트 (기본 ↔ 전문가급 모드) ← v6.5.0
 * STEP 5 - 메타데이터 (설명·태그·썸네일)
 * STEP 6 - SNS 업로드 (4개 플랫폼 실제 UI 재현) ← v6.5.0
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import { CATEGORIES, SCENARIOS } from '../_shared/platforms';
import {
  generateTitles,
  generateDescription,
  generateTags,
  generateVideoSequences,
  generateThumbnailConcepts,
  generateShortsScript,
  getViralCases,
  bumpSeed,
} from '../_shared/contentEngine';
import AdSlot from '../_shared/AdSlot';
import RewardedAd from '../_shared/RewardedAd';

// ============================================================
// v6.5.0 추가 모듈 (작가급 시나리오 + SNS 4종 + 전문가 프롬프트)
// ============================================================
import { generateV650Data, type V650DataPackage } from '../_shared/v650Adapter';
import { CinematicScenarioDisplay } from '../_shared/CinematicScenarioDisplay_v6_5_0';
import { CinematicPromptDisplay } from '../_shared/CinematicPromptDisplay_v6_5_0';
import { SNSUploadPanel } from '../_shared/SNSUploadPanel_v6_5_0';

type StepId = 'cases' | 'title' | 'script' | 'video' | 'meta' | 'sns';

const STEPS: { id: StepId; emoji: string; label: string; sub: string; color: string; bg: string }[] = [
  { id: 'cases', emoji: '📺', label: 'STEP 1', sub: '비슷한 떡상 사례', color: '#185FA5', bg: '#E6F1FB' },
  { id: 'title', emoji: '✏️', label: 'STEP 2', sub: '제목 선택', color: '#534AB7', bg: '#EEEDFE' },
  { id: 'script', emoji: '🎬', label: 'STEP 3', sub: '대본 7단계', color: '#993C1D', bg: '#FAECE7' },
  { id: 'video', emoji: '🎨', label: 'STEP 4', sub: '영상 제작', color: '#0F6E56', bg: '#E1F5EE' },
  { id: 'meta', emoji: '🏷️', label: 'STEP 5', sub: '메타데이터', color: '#854F0B', bg: '#FAEEDA' },
  { id: 'sns', emoji: '📲', label: 'STEP 6', sub: 'SNS 업로드', color: '#D4537E', bg: '#FBEAF0' },
];

function PublishPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'realestate';
  const scenarioId = searchParams.get('scenario') || 'curiosity';

  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  // 단계별 펼치기/접기
  const [openSteps, setOpenSteps] = useState<Record<StepId, boolean>>({
    cases: true,
    title: true,
    script: true,
    video: false,
    meta: false,
    sns: false,
  });
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [snsTab, setSnsTab] = useState<'youtube' | 'shorts' | 'tiktok' | 'reels'>('youtube');
  const [copied, setCopied] = useState('');
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [showRewarded, setShowRewarded] = useState(false);
  const [usedCount, setUsedCount] = useState(0);
  
  // ============================================================
  // v6.5.0: 작가급 모드 토글 (기본 OFF, 토글 ON 시 v6.5.0 발동)
  // ============================================================
  const [cinematicMode, setCinematicMode] = useState(false);    // STEP 3 작가급 모드
  const [proPromptMode, setProPromptMode] = useState(false);    // STEP 4 전문가 프롬프트 모드
  const [proSnsMode, setProSnsMode] = useState(true);           // STEP 6 SNS 실제 UI 모드 (기본 ON)

  // 무료 횟수 (5회까지 무료)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const used = parseInt(localStorage.getItem('algomaker_use_count') || '0');
      setUsedCount(used);
      if (used === 0) {
        localStorage.setItem('algomaker_use_count', '1');
        setUsedCount(1);
      }
    }
  }, []);

  const remainingFree = Math.max(0, 5 - usedCount);

  // 콘텐츠 생성
  const titles = useMemo(
    () => generateTitles(keyword, scenarioId, cat.name),
    [keyword, scenarioId, cat.name, regenerateKey]
  );
  const description = useMemo(
    () => generateDescription(keyword, cat.name, scenarioId),
    [keyword, cat.name, scenarioId, regenerateKey]
  );
  const tags = useMemo(
    () => generateTags(keyword, cat.name),
    [keyword, cat.name, regenerateKey]
  );
  const sequences = useMemo(
    () => generateVideoSequences(keyword, scenarioId),
    [keyword, scenarioId, regenerateKey]
  );
  const thumbnails = useMemo(
    () => generateThumbnailConcepts(keyword, cat.name),
    [keyword, cat.name, regenerateKey]
  );
  const shortsScript = useMemo(
    () => generateShortsScript(keyword, scenarioId),
    [keyword, scenarioId, regenerateKey]
  );

  // Phase 1: 비슷한 떡상 영상 사례 매칭
  const viralCases = useMemo(
    () => getViralCases(categoryId, 3),
    [categoryId]
  );

  // 해시태그 자동 변환 (띄어쓰기 제거 + #)
  const toHashtag = (text: string) => '#' + text.replace(/[\s·,.\-]/g, '').replace(/[^가-힣a-zA-Z0-9]/g, '');
  const hashtagsBase = tags.slice(0, 8).map(t => toHashtag(t.tag)).join(' ');
  const shortsHashtags = `#Shorts ${hashtagsBase} #쇼츠 ${toHashtag(cat.name)}`;
  const tiktokHashtags = `#fyp #foryou ${hashtagsBase} #추천 #바이럴`;
  const instaHashtags = `${hashtagsBase} #인스타그램 #릴스 ${toHashtag(cat.name)} #일상`;

  const selectedTitle = titles[selectedTitleIdx]?.title || '';

  // ============================================================
  // v6.5.0: 통합 데이터 패키지 생성
  // (선택된 제목 + 키워드 기반으로 작가급 시나리오 + SNS 4종 + 전문가 프롬프트)
  // ============================================================
  const v650Data: V650DataPackage | null = useMemo(() => {
    if (!keyword || !selectedTitle) return null;
    try {
      return generateV650Data(keyword, selectedTitle, cat.name);
    } catch (e) {
      console.error('[v6.5.0] 데이터 생성 실패:', e);
      return null;
    }
  }, [keyword, selectedTitle, cat.name, regenerateKey]);

  // 다시 생성 (무료 5회 + 광고 시청 필요)
  const handleRegenerate = () => {
    if (remainingFree > 0) {
      const newCount = usedCount + 1;
      localStorage.setItem('algomaker_use_count', String(newCount));
      setUsedCount(newCount);
      bumpSeed();
      setRegenerateKey(k => k + 1);
    } else {
      setShowRewarded(true);
    }
  };

  const handleRewardedComplete = () => {
    setShowRewarded(false);
    bumpSeed();
    setRegenerateKey(k => k + 1);
  };

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  const toggleStep = (id: StepId) => {
    setOpenSteps(s => ({ ...s, [id]: !s[id] }));
  };

  const expandAll = () => {
    setOpenSteps({ cases: true, title: true, script: true, video: true, meta: true, sns: true });
  };

  const collapseAll = () => {
    setOpenSteps({ cases: false, title: false, script: false, video: false, meta: false, sns: false });
  };

  if (!keyword) {
    if (typeof window !== 'undefined') {
      router.push('/create');
    }
    return null;
  }

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 32px 24px 60px; }
        @media (max-width: 600px) { .page { padding: 20px 16px 40px; } }

        .breadcrumb {
          display: flex; align-items: center; gap: 6px; font-size: 12px;
          color: #888; margin-bottom: 16px;
        }
        .breadcrumb a { color: #888; text-decoration: none; }
        .breadcrumb a:hover { color: #c65f3b; }

        /* 헤더 */
        .header {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 1.5px solid #fbbf24;
          border-radius: 16px;
          padding: 22px 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 600px) { .header { padding: 18px 16px; } }

        .headerBadge {
          display: inline-block;
          padding: 4px 12px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .headerTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 6px;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .headerTitle { font-size: 18px; } }
        .headerSub {
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .headerMeta {
          display: flex; gap: 8px; flex-wrap: wrap;
          font-size: 12px;
        }
        .metaChip {
          padding: 5px 12px;
          background: rgba(255,255,255,0.7);
          border-radius: 100px;
          color: #92400e;
          font-weight: 700;
        }

        /* 무료 횟수 알림 */
        .quotaBar {
          display: flex; align-items: center; justify-content: space-between;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 12px 18px;
          margin-bottom: 14px;
          font-size: 13px;
        }
        @media (max-width: 600px) {
          .quotaBar { flex-direction: column; gap: 10px; align-items: flex-start; padding: 14px 16px; }
        }
        .quotaText { color: #444; line-height: 1.5; }
        .quotaCount { color: #c65f3b; font-weight: 800; }
        .regenBtn {
          padding: 9px 18px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .regenBtn:hover { background: #b04e2d; transform: translateY(-1px); }

        /* 단계 토글 (확장/축소) */
        .toggleAll {
          display: flex; gap: 8px; margin-bottom: 16px;
          font-size: 12px;
        }
        .toggleBtn {
          padding: 5px 11px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .toggleBtn:hover { border-color: #c65f3b; color: #c65f3b; }

        /* 단계 카드 */
        .step {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          margin-bottom: 14px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .step.active { border-color: #c65f3b; }

        .stepHead {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 22px;
          cursor: pointer;
          user-select: none;
          transition: background 0.15s;
        }
        @media (max-width: 600px) { .stepHead { padding: 14px 16px; gap: 10px; } }
        .stepHead:hover { background: #fafafa; }
        
        .stepEmoji {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .stepEmoji { width: 36px; height: 36px; font-size: 18px; border-radius: 10px; }
        }

        .stepInfo { flex: 1; min-width: 0; }
        .stepLabel {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .stepTitle {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        @media (max-width: 600px) { .stepTitle { font-size: 14.5px; } }

        .stepArrow {
          font-size: 12px;
          color: #888;
          transition: transform 0.2s;
          margin-left: 8px;
          flex-shrink: 0;
        }
        .stepArrow.open { transform: rotate(180deg); }

        .stepBody {
          padding: 0 22px 22px;
          border-top: 1px solid #f0f0f0;
        }
        @media (max-width: 600px) { .stepBody { padding: 0 16px 18px; } }

        /* ============================================ */
        /* STEP 1 - 제목 선택 */
        /* ============================================ */
        /* ============================================ */
        /* STEP 1 - 비슷한 떡상 영상 사례 (Phase 1) */
        /* ============================================ */
        .casesIntro {
          background: linear-gradient(135deg, #e6f1fb 0%, #d3e7f8 100%);
          border-left: 3px solid #185FA5;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 13px;
          color: #042c53;
          line-height: 1.7;
          margin: 16px 0 18px;
        }
        .casesList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .caseCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 16px 18px;
          transition: all 0.2s;
        }
        .caseCard:hover {
          border-color: #185FA5;
          background: #fafbfd;
        }
        .caseCardHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #e5e5e5;
        }
        .caseCardEmoji {
          font-size: 22px;
        }
        .caseCardPattern {
          font-size: 14.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          flex: 1;
        }
        .caseCardLength {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .caseCardLabel {
          display: block;
          font-size: 10.5px;
          font-weight: 800;
          color: #185FA5;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .caseCardHook {
          background: #e6f1fb;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .caseCardHookText {
          font-size: 14px;
          font-weight: 700;
          color: #042c53;
          font-style: italic;
          line-height: 1.5;
        }
        .caseCardWhy {
          margin-bottom: 12px;
        }
        .caseCardWhy p {
          font-size: 13px;
          color: #555;
          line-height: 1.7;
          margin: 0;
        }
        .caseCardKey {
          padding: 8px 12px;
          background: #fafafa;
          border-radius: 8px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.55;
        }
        .caseCardKey .caseCardKeyLabel {
          font-weight: 700;
          color: #c65f3b;
          margin-right: 4px;
        }

        /* ============================================ */
        /* STEP 2 - 제목 선택 */
        /* ============================================ */
        .titleHelp {
          background: #fff8f3;
          border-left: 3px solid #c65f3b;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 16px 0 18px;
        }
        .titleList { display: flex; flex-direction: column; gap: 10px; }
        .titleCard {
          background: #fafafa;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .titleCard:hover { background: #fff8f3; }
        .titleCard.selected {
          background: #fff8f3;
          border-color: #c65f3b;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.1);
        }
        .titleCardHead {
          display: flex; gap: 8px; align-items: center;
          margin-bottom: 8px;
        }
        .titlePattern {
          padding: 3px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .titleCtr {
          padding: 3px 9px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .titleSelected {
          padding: 3px 9px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-left: auto;
        }
        .titleText {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.5;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        @media (max-width: 600px) { .titleText { font-size: 14.5px; } }
        .titleReason {
          font-size: 12.5px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }

        /* ============================================ */
        /* STEP 2 - 시나리오 7단계 (메인!) */
        /* ============================================ */
        .scriptIntro {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 16px 0 18px;
        }
        .scriptIntroLabel {
          font-size: 11px;
          font-weight: 800;
          color: #92400e;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .scriptIntroText {
          font-size: 13.5px;
          color: #78350f;
          line-height: 1.7;
        }

        .seqList { display: flex; flex-direction: column; gap: 12px; }
        .seqCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .seqCard:hover { border-color: #c65f3b; }

        .seqHead {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }
        .seqNum {
          width: 32px; height: 32px;
          background: #c65f3b;
          color: #fff;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .seqHeadInfo { flex: 1; min-width: 0; }
        .seqStepTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 2px;
          letter-spacing: -0.02em;
        }
        .seqDuration {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .seqPurpose {
          padding: 12px 18px;
          background: #fffbf8;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          border-bottom: 1px solid #f5f5f5;
        }
        .seqPurpose strong { color: #c65f3b; }
        .seqScriptBox {
          padding: 16px 18px;
          font-size: 14.5px;
          color: #1a1a1a;
          line-height: 1.85;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .seqScriptBox { font-size: 13.5px; padding: 14px 16px; } }

        .seqActions {
          display: flex; gap: 8px;
          padding: 0 18px 14px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) { .seqActions { padding: 0 16px 12px; } }

        .seqActionBtn {
          padding: 7px 14px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .seqActionBtn:hover { border-color: #c65f3b; color: #c65f3b; }
        .seqActionBtn.copied {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        .seqTip {
          padding: 10px 18px;
          background: #fffbf3;
          border-top: 1px solid #fef3c7;
          font-size: 12px;
          color: #92400e;
          line-height: 1.55;
        }

        /* 1분 쇼츠 박스 */
        .shortsBox {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          border: 1.5px solid #a855f7;
          border-radius: 14px;
          padding: 18px 20px;
          margin-top: 18px;
        }
        .shortsBoxHead {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .shortsBoxTitle {
          font-size: 14px;
          font-weight: 800;
          color: #581c87;
        }
        .shortsBoxSub {
          font-size: 11.5px;
          color: #7c3aed;
          background: rgba(255,255,255,0.6);
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 700;
          margin-left: auto;
        }
        .shortsScript {
          background: #fff;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 13px;
          color: #1a1a1a;
          line-height: 1.85;
          white-space: pre-line;
        }
        @media (max-width: 600px) { .shortsScript { font-size: 12.5px; padding: 12px 14px; } }

        /* ============================================ */
        /* STEP 3 - 영상 제작 */
        /* ============================================ */
        .videoIntro {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 16px 0 18px;
        }
        .videoIntroLabel {
          font-size: 11px;
          font-weight: 800;
          color: #065f46;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .videoIntroText {
          font-size: 13px;
          color: #064e3b;
          line-height: 1.7;
          margin-bottom: 10px;
        }
        .videoIntroLink {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 7px 14px;
          background: #10b981;
          color: #fff;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
        }
        .videoIntroLink:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .promptList { display: flex; flex-direction: column; gap: 8px; }
        .promptCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
        }
        .promptCardHead {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          background: #fafafa;
          font-size: 12.5px;
          font-weight: 700;
          color: #444;
          cursor: pointer;
        }
        .promptCardHead:hover { background: #f5f5f5; }
        .promptCardSeq {
          padding: 2px 8px;
          background: #c65f3b;
          color: #fff;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 800;
        }
        .promptCardArrow {
          margin-left: auto;
          font-size: 11px;
          color: #888;
          transition: transform 0.2s;
        }
        .promptCardArrow.open { transform: rotate(180deg); }
        .promptCardBody {
          padding: 14px 16px;
          background: #fffefb;
          border-top: 1px solid #f0f0f0;
        }
        .promptItem { margin-bottom: 12px; }
        .promptItem:last-child { margin-bottom: 0; }
        .promptItemHead {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 6px;
        }
        .promptLang {
          padding: 2px 8px;
          background: #f5f5f5;
          color: #555;
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .promptLang.kr { background: #dbeafe; color: #1e40af; }
        .promptLang.en { background: #fef3c7; color: #92400e; }
        .promptText {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.6;
          font-family: 'SF Mono', Monaco, monospace;
        }
        .promptCopyBtn {
          margin-left: auto;
          padding: 4px 10px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .promptCopyBtn:hover { border-color: #c65f3b; color: #c65f3b; }
        .promptCopyBtn.copied { background: #c65f3b; color: #fff; border-color: #c65f3b; }

        /* ============================================ */
        /* STEP 4 - 메타데이터 */
        /* ============================================ */
        .metaSection {
          margin-top: 16px;
          padding: 16px 18px;
          background: #fafafa;
          border-radius: 12px;
        }
        .metaSection:first-child { margin-top: 18px; }
        .metaLabelRow {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .metaLabel {
          font-size: 13.5px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }
        .metaHelper {
          font-size: 12px;
          color: #888;
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .metaContent {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 13px;
          color: #444;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .copyBtnSm {
          margin-left: auto;
          padding: 5px 12px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copyBtnSm:hover { border-color: #c65f3b; color: #c65f3b; }
        .copyBtnSm.copied { background: #c65f3b; color: #fff; border-color: #c65f3b; }

        .tagGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 8px;
        }
        .tagItem {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 12.5px;
        }
        .tagItemName {
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .tagItemMeta {
          display: flex; gap: 6px;
          font-size: 11px;
          color: #888;
        }
        .tagItemMeta .vol { color: #c65f3b; font-weight: 700; }
        .tagItemMeta .comp.low { color: #10b981; font-weight: 700; }
        .tagItemMeta .comp.medium { color: #f59e0b; font-weight: 700; }
        .tagItemMeta .comp.high { color: #ef4444; font-weight: 700; }

        .thumbGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }
        .thumbCard {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 14px 16px;
        }
        .thumbType {
          font-size: 13px;
          font-weight: 800;
          color: #c65f3b;
          margin-bottom: 8px;
        }
        .thumbDetail {
          font-size: 11.5px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .thumbDetail strong { color: #1a1a1a; }
        .thumbCtr {
          margin-top: 8px;
          padding: 4px 10px;
          background: #fff8f3;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          color: #c65f3b;
          display: inline-block;
        }

        /* ============================================ */
        /* STEP 5 - SNS 업로드 */
        /* ============================================ */
        .snsTabs {
          display: flex;
          gap: 6px;
          margin: 18px 0 16px;
          flex-wrap: wrap;
        }
        .snsTab {
          padding: 9px 16px;
          background: #fff;
          border: 1.5px solid #e5e5e5;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .snsTab:hover { border-color: #c65f3b; color: #c65f3b; }
        .snsTab.active {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        .snsBox {
          background: #fafafa;
          border-radius: 12px;
          padding: 18px 20px;
        }
        .snsHead {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .snsName {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .snsSpec {
          font-size: 11.5px;
          color: #888;
          font-weight: 600;
        }
        .snsField { margin-bottom: 14px; }
        .snsField:last-child { margin-bottom: 0; }
        .snsFieldLabel {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .snsFieldHelper {
          font-size: 11.5px;
          color: #888;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .snsFieldContent {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 12.5px;
          color: #444;
          line-height: 1.7;
          word-break: break-all;
        }

        /* 광고 영역 */
        .adArea { margin: 24px 0; }
        
        /* 완료 안내 */
        .doneBox {
          background: linear-gradient(135deg, #c65f3b 0%, #ea7755 100%);
          color: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          margin-top: 28px;
        }
        .doneTitle {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }
        @media (max-width: 600px) { .doneTitle { font-size: 17px; } }
        .doneSub {
          font-size: 13.5px;
          color: #ffe0d0;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .doneActions {
          display: flex; gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .doneBtn {
          display: inline-block;
          padding: 11px 22px;
          background: #fff;
          color: #c65f3b;
          border-radius: 100px;
          font-size: 13.5px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.15s;
        }
        .doneBtn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .doneBtn.outline {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }
        .doneBtn.outline:hover { background: #fff; color: #c65f3b; }

        /* 한도 모달 */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modalCard {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          max-width: 400px;
          text-align: center;
        }

        /* ============================================ */
        /* 🎯 시니어 모바일 최적화 (v6.3.0) */
        /* ============================================ */
        @media (max-width: 600px) {
          /* 페이지 여백 */
          .page { padding: 18px 12px 50px !important; }

          /* 헤더 영역 */
          .pageHeader { padding: 22px 16px !important; }
          .pageTitle { font-size: 20px !important; line-height: 1.4 !important; }
          .pageSub { font-size: 14px !important; line-height: 1.6 !important; }

          /* STEP 카드 - 시니어 시력 고려 */
          .stepHead {
            padding: 16px 14px !important;
            gap: 10px !important;
            min-height: 64px;
          }
          .stepEmoji {
            width: 40px !important;
            height: 40px !important;
            font-size: 20px !important;
          }
          .stepLabel { font-size: 11px !important; }
          .stepTitle { 
            font-size: 14.5px !important; 
            line-height: 1.5 !important;
          }
          .stepArrow { font-size: 14px !important; }

          /* STEP 본문 */
          .stepBody { padding: 14px 14px 16px !important; }

          /* 시퀀스 카드 (STEP 3) */
          .seqCard { 
            padding: 0 !important; 
            margin-bottom: 12px !important;
          }
          .seqHead { padding: 14px 16px 10px !important; }
          .seqNum {
            width: 32px !important;
            height: 32px !important;
            font-size: 14px !important;
          }
          .seqStepTitle { font-size: 14.5px !important; }
          .seqDuration { font-size: 11.5px !important; }
          .seqPurpose { 
            padding: 10px 16px !important; 
            font-size: 13px !important;
            line-height: 1.65 !important;
          }
          .seqScriptBox {
            font-size: 13.5px !important;
            padding: 12px 14px !important;
            line-height: 1.7 !important;
          }
          .seqActions { padding: 0 14px 10px !important; }
          .seqActionBtn {
            font-size: 12.5px !important;
            padding: 10px 14px !important;
            min-height: 40px;
          }
          .seqTip {
            padding: 10px 14px !important;
            font-size: 12px !important;
            line-height: 1.65 !important;
          }

          /* 떡상 사례 카드 (STEP 1) */
          .caseCard { padding: 14px 14px !important; }
          .caseCardEmoji { font-size: 20px !important; }
          .caseCardPattern { font-size: 13.5px !important; }
          .caseCardLength { font-size: 11px !important; }
          .caseCardLabel { font-size: 10px !important; }
          .caseCardHookText { 
            font-size: 13px !important; 
            line-height: 1.55 !important;
          }
          .caseCardWhy p { 
            font-size: 12.5px !important; 
            line-height: 1.7 !important;
          }
          .caseCardKey { 
            font-size: 12px !important; 
            line-height: 1.6 !important;
          }
          .casesIntro {
            font-size: 12.5px !important;
            padding: 10px 14px !important;
            line-height: 1.7 !important;
          }

          /* 제목 카드 (STEP 2) */
          .titleCard { padding: 14px 16px !important; }
          .titleCardText { 
            font-size: 14.5px !important; 
            line-height: 1.5 !important;
          }
          .titleHelp { 
            font-size: 13px !important; 
            padding: 10px 14px !important;
          }

          /* SNS 탭 (STEP 6) */
          .snsTabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .snsTab { 
            font-size: 12.5px !important; 
            padding: 10px 14px !important;
            min-width: 80px;
            white-space: nowrap;
          }
          .snsBox { padding: 14px !important; }

          /* 펼치기/접기 버튼 */
          .toggleBtn { 
            font-size: 12.5px !important; 
            padding: 8px 14px !important;
            min-height: 36px;
          }

          /* 무료 횟수 안내 */
          .quotaBar { 
            padding: 12px 14px !important; 
            font-size: 13px !important;
          }
          .quotaCount { font-size: 14px !important; }
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span>/</span>
          <Link href="/create">분야</Link>
          <span>/</span>
          <Link href={`/keyword?category=${categoryId}`}>키워드</Link>
          <span>/</span>
          <span style={{ color: '#c65f3b', fontWeight: 700 }}>완성</span>
        </nav>

        {/* HEADER - 결과 안내 */}
        <header className="header">
          <span className="headerBadge">✨ AI 추천 완료</span>
          <h1 className="headerTitle">
            "{keyword}" 영상 자료가 준비됐습니다
          </h1>
          <p className="headerSub">
            아래 5단계 순서대로 따라가시면 됩니다. 각 단계 클릭하면 펼쳐집니다.
          </p>
          <div className="headerMeta">
            <span className="metaChip">🎯 {cat.name}</span>
            <span className="metaChip">📂 {scenario?.name || '시나리오'}</span>
            <span className="metaChip">⚡ {sequences.length}단계 시나리오</span>
          </div>
        </header>

        {/* QUOTA BAR */}
        <div className="quotaBar">
          <div className="quotaText">
            🎁 마음에 안 들면 다시 만들어 보세요. 매번 다른 시나리오가 나와요.<br />
            <span style={{ fontSize: '12px', color: '#888' }}>
              무료 이용권 <span className="quotaCount">{remainingFree}회</span> 남음 (이후엔 광고 시청)
            </span>
          </div>
          <button className="regenBtn" onClick={handleRegenerate}>
            🔄 다시 생성
          </button>
        </div>

        {/* 펼치기/접기 토글 */}
        <div className="toggleAll">
          <button className="toggleBtn" onClick={expandAll}>📂 전체 펼치기</button>
          <button className="toggleBtn" onClick={collapseAll}>📁 전체 접기</button>
        </div>

        {/* ============================================ */}
        {/* STEP 1 - 비슷한 떡상 영상 사례 (Phase 1 NEW) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.cases ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('cases')}>
            <div className="stepEmoji" style={{ background: STEPS[0].bg, color: STEPS[0].color }}>
              {STEPS[0].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[0].color }}>{STEPS[0].label}</div>
              <div className="stepTitle">비슷한 떡상 영상 사례 — 어떤 패턴으로 잘 됐을까</div>
            </div>
            <div className={`stepArrow ${openSteps.cases ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.cases && (
            <div className="stepBody">
              <div className="casesIntro">
                💡 "{cat.name}" 분야에서 실제로 잘된 영상들의 공통 패턴이에요.
                내 영상도 이런 패턴으로 만들면 좋아요.
              </div>
              <div className="casesList">
                {viralCases.map((vc, i) => (
                  <div key={i} className="caseCard">
                    <div className="caseCardHead">
                      <span className="caseCardEmoji">{vc.emoji}</span>
                      <span className="caseCardPattern">{vc.pattern}</span>
                      <span className="caseCardLength">⏱️ {vc.videoLength}</span>
                    </div>
                    <div className="caseCardHook">
                      <span className="caseCardLabel">핵심 후크 (첫 3초)</span>
                      <div className="caseCardHookText">"{vc.hook}"</div>
                    </div>
                    <div className="caseCardWhy">
                      <span className="caseCardLabel">왜 떡상했을까?</span>
                      <p>{vc.why}</p>
                    </div>
                    <div className="caseCardKey">
                      <span className="caseCardKeyLabel">🎯 핵심 요소:</span>
                      <span>{vc.keyElement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 2 - 제목 선택 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.title ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('title')}>
            <div className="stepEmoji" style={{ background: STEPS[1].bg, color: STEPS[1].color }}>
              {STEPS[1].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[1].color }}>{STEPS[1].label}</div>
              <div className="stepTitle">제목 선택 — 마음에 드는 제목 1개를 골라주세요</div>
            </div>
            <div className={`stepArrow ${openSteps.title ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.title && (
            <div className="stepBody">
              <div className="titleHelp">
                💡 알고리즘 분석으로 클릭률(CTR) 예측한 제목 3개입니다. 클릭하면 선택돼요.
              </div>
              <div className="titleList">
                {titles.map((t, i) => (
                  <div
                    key={i}
                    className={`titleCard ${selectedTitleIdx === i ? 'selected' : ''}`}
                    onClick={() => setSelectedTitleIdx(i)}
                  >
                    <div className="titleCardHead">
                      <span className="titlePattern">{t.pattern}</span>
                      <span className="titleCtr">📊 CTR {t.ctr_estimate}</span>
                      {selectedTitleIdx === i && <span className="titleSelected">✓ 선택됨</span>}
                    </div>
                    <h3 className="titleText">{t.title}</h3>
                    <p className="titleReason">💬 {t.reasoning}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className={`copyBtnSm ${copied === 'title' ? 'copied' : ''}`}
                  onClick={() => copy(selectedTitle, 'title')}
                  style={{ marginLeft: 0 }}
                >
                  {copied === 'title' ? '✓ 복사됨' : '📋 선택한 제목 복사'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 2 - 시나리오 7단계 (메인!) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.script ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('script')}>
            <div className="stepEmoji" style={{ background: STEPS[2].bg, color: STEPS[2].color }}>
              {STEPS[2].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[2].color }}>{STEPS[2].label} · 메인 콘텐츠</div>
              <div className="stepTitle">떡상 시나리오 {sequences.length}단계 — 영상 대본 흐름</div>
            </div>
            <div className={`stepArrow ${openSteps.script ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.script && (
            <div className="stepBody">
              <div className="scriptIntro">
                <div className="scriptIntroLabel">🔥 떡상의 핵심</div>
                <div className="scriptIntroText">
                  단순한 대본이 아닙니다. 시청자가 끝까지 보게 만드는 7단계 구조예요.<br />
                  <strong>훅(0~15초)</strong>이 영상의 운명을 결정합니다. 이대로 영상을 만들어보세요.
                </div>
              </div>

              {/* ============================================ */}
              {/* v6.5.0: 작가급 스토리 모드 토글 */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: cinematicMode 
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
                    : '#fafafa',
                  border: `1.5px solid ${cinematicMode ? '#fbbf24' : '#e5e5e5'}`,
                  borderRadius: 12,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setCinematicMode(m => !m)}
                >
                  <div style={{
                    width: 44,
                    height: 24,
                    background: cinematicMode ? '#c65f3b' : '#d1d5db',
                    borderRadius: 100,
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 2,
                      left: cinematicMode ? 22 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>
                      📖 작가급 스토리 모드 {cinematicMode ? '(켜짐)' : '(꺼짐)'}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#666', lineHeight: 1.5 }}>
                      {cinematicMode 
                        ? '✨ 넷플릭스 다큐 작가 + 떡상 유튜버 융합 시나리오로 보고 있어요.' 
                        : '클릭하면 단락마다 연결된 작가급 시나리오로 바뀝니다.'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 작가급 모드 ON: CinematicScenarioDisplay */}
              {/* ============================================ */}
              {cinematicMode && v650Data ? (
                <CinematicScenarioDisplay scenario={v650Data.scenario} />
              ) : (
              /* 기본 모드 OFF: 기존 7단계 시퀀스 표시 */
              <>
              <div className="seqList">
                {sequences.map((seq, idx) => (
                  <div key={seq.number} className="seqCard">
                    <div className="seqHead">
                      <div className="seqNum">{seq.number}</div>
                      <div className="seqHeadInfo">
                        <div className="seqStepTitle">{seq.title}</div>
                        <div className="seqDuration">⏱️ {seq.duration}</div>
                      </div>
                    </div>
                    <div className="seqPurpose">
                      <strong>📌 목적:</strong> {seq.purpose}
                    </div>
                    <div className="seqScriptBox">{seq.script}</div>

                    <div className="seqActions">
                      <button
                        className={`seqActionBtn ${copied === `seq-${idx}` ? 'copied' : ''}`}
                        onClick={() => copy(seq.script, `seq-${idx}`)}
                      >
                        {copied === `seq-${idx}` ? '✓ 복사됨' : '📋 대본 복사'}
                      </button>
                    </div>
                    <div className="seqTip">{seq.tip}</div>
                  </div>
                ))}
              </div>

              {/* 1분 쇼츠 박스 */}
              <div className="shortsBox">
                <div className="shortsBoxHead">
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <span className="shortsBoxTitle">1분 쇼츠 버전</span>
                  <span className="shortsBoxSub">{shortsScript.totalDuration}</span>
                </div>
                <div className="shortsScript">{shortsScript.fullScript}</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className={`copyBtnSm ${copied === 'shorts' ? 'copied' : ''}`}
                    onClick={() => copy(shortsScript.fullScript, 'shorts')}
                  >
                    {copied === 'shorts' ? '✓ 복사됨' : '📋 쇼츠 대본 복사'}
                  </button>
                </div>
              </div>

              <button
                className={`copyBtnSm ${copied === 'all-script' ? 'copied' : ''}`}
                onClick={() => copy(sequences.map(s => `[${s.number}. ${s.title} - ${s.duration}]\n${s.script}`).join('\n\n'), 'all-script')}
                style={{ marginTop: 16, marginLeft: 0, padding: '10px 18px', fontSize: '13px' }}
              >
                {copied === 'all-script' ? '✓ 전체 대본 복사됨' : '📋 전체 7단계 대본 한 번에 복사'}
              </button>
              </>
              )}
            </div>
          )}
        </div>

        <div className="adArea">
          <AdSlot slot="publish-mid" variant="horizontal" />
        </div>

        {/* ============================================ */}
        {/* STEP 3 - 영상 제작 (AI 프롬프트) */}
        {/* ============================================ */}
        <div className={`step ${openSteps.video ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('video')}>
            <div className="stepEmoji" style={{ background: STEPS[3].bg, color: STEPS[3].color }}>
              {STEPS[3].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[3].color }}>{STEPS[3].label}</div>
              <div className="stepTitle">영상 제작 — AI 도구용 프롬프트 (단계별)</div>
            </div>
            <div className={`stepArrow ${openSteps.video ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.video && (
            <div className="stepBody">
              <div className="videoIntro">
                <div className="videoIntroLabel">🎨 일관된 영상 만드는 비결</div>
                <div className="videoIntroText">
                  AI 영상이 어색한 이유는 매 시퀀스마다 새로 그리기 때문입니다.<br />
                  <strong>NotebookLM(무료) + Pinterest(무료)</strong> 조합으로 60장 일관된 이미지를 만들 수 있어요.
                </div>
                <Link href="/workflow" className="videoIntroLink">
                  📚 일관된 영상 만들기 가이드 →
                </Link>
              </div>

              {/* ============================================ */}
              {/* v6.5.0: 전문가 프롬프트 모드 토글 */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: proPromptMode 
                    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                    : '#fafafa',
                  border: `1.5px solid ${proPromptMode ? '#10b981' : '#e5e5e5'}`,
                  borderRadius: 12,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setProPromptMode(m => !m)}
                >
                  <div style={{
                    width: 44,
                    height: 24,
                    background: proPromptMode ? '#10b981' : '#d1d5db',
                    borderRadius: 100,
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 2,
                      left: proPromptMode ? 22 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>
                      🎬 전문가급 프롬프트 모드 {proPromptMode ? '(켜짐)' : '(꺼짐)'}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#666', lineHeight: 1.5 }}>
                      {proPromptMode 
                        ? '✨ Midjourney v7 + Sora 2 + VEO 3 카메라/렌즈/조명/색감까지 전문가급으로 보고 있어요.' 
                        : '클릭하면 카메라·렌즈·조명·색감·LUT까지 전문가급 프롬프트로 바뀝니다.'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 전문가 모드 ON: CinematicPromptDisplay */}
              {/* ============================================ */}
              {proPromptMode && v650Data ? (
                <CinematicPromptDisplay prompts={v650Data.prompts} />
              ) : (
                /* 기본 모드 OFF: 기존 단계별 프롬프트 카드 */
                <div className="promptList">
                  {sequences.map((seq, idx) => (
                    <PromptCard
                      key={seq.number}
                      seq={seq}
                      idx={idx}
                      copied={copied}
                      onCopy={copy}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 4 - 메타데이터 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.meta ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('meta')}>
            <div className="stepEmoji" style={{ background: STEPS[4].bg, color: STEPS[4].color }}>
              {STEPS[4].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[4].color }}>{STEPS[4].label}</div>
              <div className="stepTitle">메타데이터 — 설명·태그·썸네일</div>
            </div>
            <div className={`stepArrow ${openSteps.meta ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.meta && (
            <div className="stepBody">
              {/* 설명 */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">📝 영상 설명</span>
                  <button
                    className={`copyBtnSm ${copied === 'desc' ? 'copied' : ''}`}
                    onClick={() => copy(description, 'desc')}
                  >
                    {copied === 'desc' ? '✓ 복사됨' : '📋 복사'}
                  </button>
                </div>
                <div className="metaHelper">SEO 최적화 + 챕터(목차) 포함. 첫 100자가 검색 미리보기에 노출됩니다.</div>
                <div className="metaContent">{description}</div>
              </div>

              {/* 태그 (YouTube) */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">🏷️ 태그 (YouTube 태그 필드용)</span>
                  <button
                    className={`copyBtnSm ${copied === 'tags' ? 'copied' : ''}`}
                    onClick={() => copy(tags.map(t => t.tag).join(', '), 'tags')}
                  >
                    {copied === 'tags' ? '✓ 복사됨' : '📋 모두 복사'}
                  </button>
                </div>
                <div className="metaHelper">
                  YouTube 업로드 화면 "태그" 필드에 그대로 붙여넣으세요. <strong>띄어쓰기 그대로</strong> (해시태그 X, # 기호 X).
                </div>
                <div className="tagGrid">
                  {tags.map((t, i) => (
                    <div key={i} className="tagItem">
                      <div className="tagItemName">{t.tag}</div>
                      <div className="tagItemMeta">
                        <span className="vol">📊 {t.volume}</span>
                        <span className={`comp ${t.competition === '낮음' ? 'low' : t.competition === '높음' ? 'high' : 'medium'}`}>
                          🎯 {t.competition}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 썸네일 */}
              <div className="metaSection">
                <div className="metaLabelRow">
                  <span className="metaLabel">🖼️ 썸네일 콘셉트 3가지</span>
                </div>
                <div className="metaHelper">
                  알고리즘 검증된 3가지 콘셉트. 클릭해서 영상 프롬프트로 만들어 사용하세요.
                </div>
                <div className="thumbGrid">
                  {thumbnails.map((t, i) => (
                    <div key={i} className="thumbCard">
                      <div className="thumbType">{t.type}</div>
                      <div className="thumbDetail"><strong>배경:</strong> {t.background}</div>
                      <div className="thumbDetail"><strong>메인 텍스트:</strong> {t.mainText}</div>
                      <div className="thumbDetail"><strong>표정:</strong> {t.expression}</div>
                      <div className="thumbDetail"><strong>색상:</strong> {t.colors}</div>
                      <div className="thumbCtr">{t.ctr_estimate}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          className={`copyBtnSm ${copied === `thumb-${i}` ? 'copied' : ''}`}
                          onClick={() => copy(t.imagePromptKr, `thumb-${i}`)}
                          style={{ marginLeft: 0, fontSize: '11px' }}
                        >
                          {copied === `thumb-${i}` ? '✓ 복사' : '🇰🇷 한글 프롬프트'}
                        </button>
                        <Link
                          href={`/imagegen?prompt=${encodeURIComponent(t.imagePromptEn)}&ar=16:9`}
                          style={{
                            padding: '5px 12px',
                            background: '#c65f3b',
                            color: '#fff',
                            borderRadius: 100,
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          🎨 영상 프롬프트로
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* STEP 5 - SNS 업로드 */}
        {/* ============================================ */}
        <div className={`step ${openSteps.sns ? 'active' : ''}`}>
          <div className="stepHead" onClick={() => toggleStep('sns')}>
            <div className="stepEmoji" style={{ background: STEPS[5].bg, color: STEPS[5].color }}>
              {STEPS[5].emoji}
            </div>
            <div className="stepInfo">
              <div className="stepLabel" style={{ color: STEPS[5].color }}>{STEPS[5].label}</div>
              <div className="stepTitle">SNS 업로드 — 4개 플랫폼별 자료</div>
            </div>
            <div className={`stepArrow ${openSteps.sns ? 'open' : ''}`}>▼</div>
          </div>
          {openSteps.sns && (
            <div className="stepBody">
              {/* ============================================ */}
              {/* v6.5.0: SNS 실제 UI 모드 토글 (기본 ON) */}
              {/* ============================================ */}
              {v650Data && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: proSnsMode 
                    ? 'linear-gradient(135deg, #fbeaf0 0%, #fce4ec 100%)' 
                    : '#fafafa',
                  border: `1.5px solid ${proSnsMode ? '#D4537E' : '#e5e5e5'}`,
                  borderRadius: 12,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
                onClick={() => setProSnsMode(m => !m)}
                >
                  <div style={{
                    width: 44,
                    height: 24,
                    background: proSnsMode ? '#D4537E' : '#d1d5db',
                    borderRadius: 100,
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 2,
                      left: proSnsMode ? 22 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>
                      📱 SNS 실제 화면 모드 {proSnsMode ? '(켜짐)' : '(꺼짐)'}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#666', lineHeight: 1.5 }}>
                      {proSnsMode 
                        ? '✨ YouTube Studio · 인스타 릴스 · 틱톡 실제 업로드 화면 그대로 보고 있어요.' 
                        : '클릭하면 각 SNS 실제 업로드 화면과 똑같은 형태로 바뀝니다.'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* v6.5.0 실제 UI 모드 ON: SNSUploadPanel */}
              {/* ============================================ */}
              {proSnsMode && v650Data ? (
                <SNSUploadPanel formats={v650Data.sns} />
              ) : (
              /* 기본 모드 OFF: 기존 4탭 SNS 박스 */
              <>
              <div className="snsTabs">
                <button
                  className={`snsTab ${snsTab === 'youtube' ? 'active' : ''}`}
                  onClick={() => setSnsTab('youtube')}
                >
                  📹 YouTube (긴 영상)
                </button>
                <button
                  className={`snsTab ${snsTab === 'shorts' ? 'active' : ''}`}
                  onClick={() => setSnsTab('shorts')}
                >
                  📱 YouTube 쇼츠
                </button>
                <button
                  className={`snsTab ${snsTab === 'tiktok' ? 'active' : ''}`}
                  onClick={() => setSnsTab('tiktok')}
                >
                  🎵 틱톡
                </button>
                <button
                  className={`snsTab ${snsTab === 'reels' ? 'active' : ''}`}
                  onClick={() => setSnsTab('reels')}
                >
                  📷 인스타 릴스
                </button>
              </div>

              {snsTab === 'youtube' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📹</span>
                    <div>
                      <div className="snsName">YouTube 긴 영상</div>
                      <div className="snsSpec">8분 이상 · 가로 16:9 · 광고 수익 가능</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">📌 제목</div>
                    <div className="snsFieldHelper">최대 100자. STEP 1에서 선택한 제목입니다.</div>
                    <div className="snsFieldContent">{selectedTitle}</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">📝 카테고리</div>
                    <div className="snsFieldHelper">YouTube 카테고리 필드 추천값.</div>
                    <div className="snsFieldContent">📂 뉴스/정치 또는 교육</div>
                  </div>
                  <div style={{ padding: '14px 16px', background: '#fff8f3', borderRadius: 10, fontSize: '12.5px', color: '#666', lineHeight: 1.6 }}>
                    💡 설명·태그·썸네일은 <strong>STEP 4</strong>에서 복사하세요.
                  </div>
                </div>
              )}

              {snsTab === 'shorts' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📱</span>
                    <div>
                      <div className="snsName">YouTube 쇼츠</div>
                      <div className="snsSpec">60초 이내 · 세로 9:16 · 빠른 확산</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 제목 + #Shorts
                      <button
                        className={`copyBtnSm ${copied === 'shorts-title' ? 'copied' : ''}`}
                        onClick={() => copy(`${selectedTitle.substring(0, 80)} #Shorts`, 'shorts-title')}
                      >
                        {copied === 'shorts-title' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">최대 100자. #Shorts 필수.</div>
                    <div className="snsFieldContent">{selectedTitle.substring(0, 80)} #Shorts</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      🏷️ 해시태그 (붙여쓰기 + #)
                      <button
                        className={`copyBtnSm ${copied === 'shorts-tags' ? 'copied' : ''}`}
                        onClick={() => copy(shortsHashtags, 'shorts-tags')}
                      >
                        {copied === 'shorts-tags' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">SNS 해시태그는 띄어쓰기 X, # 기호 O.</div>
                    <div className="snsFieldContent">{shortsHashtags}</div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📝 쇼츠 대본 (1분)
                      <button
                        className={`copyBtnSm ${copied === 'shorts-full' ? 'copied' : ''}`}
                        onClick={() => copy(shortsScript.fullScript, 'shorts-full')}
                      >
                        {copied === 'shorts-full' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>{shortsScript.fullScript}</div>
                  </div>
                </div>
              )}

              {snsTab === 'tiktok' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>🎵</span>
                    <div>
                      <div className="snsName">틱톡</div>
                      <div className="snsSpec">15~60초 · 세로 9:16 · 바이럴 강함</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 캡션 + 해시태그
                      <button
                        className={`copyBtnSm ${copied === 'tt-cap' ? 'copied' : ''}`}
                        onClick={() => copy(`💡 ${keyword} 진짜 핵심만!\n${selectedTitle}\n\n${tiktokHashtags}`, 'tt-cap')}
                      >
                        {copied === 'tt-cap' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">캡션은 짧게. 해시태그가 핵심.</div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>
                      {`💡 ${keyword} 진짜 핵심만!\n${selectedTitle}\n\n${tiktokHashtags}`}
                    </div>
                  </div>
                </div>
              )}

              {snsTab === 'reels' && (
                <div className="snsBox">
                  <div className="snsHead">
                    <span style={{ fontSize: '24px' }}>📷</span>
                    <div>
                      <div className="snsName">인스타그램 릴스</div>
                      <div className="snsSpec">15~90초 · 세로 9:16 · 일상 톤</div>
                    </div>
                  </div>
                  <div className="snsField">
                    <div className="snsFieldLabel">
                      📌 캡션 + 해시태그
                      <button
                        className={`copyBtnSm ${copied === 'rs-cap' ? 'copied' : ''}`}
                        onClick={() => copy(`📊 ${keyword} 핵심 정리\n\n${selectedTitle}\n\n💬 댓글로 여러분 생각 공유해주세요!\n\n${instaHashtags}`, 'rs-cap')}
                      >
                        {copied === 'rs-cap' ? '✓ 복사' : '📋 복사'}
                      </button>
                    </div>
                    <div className="snsFieldHelper">최대 30개 해시태그. 인기·중간·롱테일 조합.</div>
                    <div className="snsFieldContent" style={{ whiteSpace: 'pre-line' }}>
                      {`📊 ${keyword} 핵심 정리\n\n${selectedTitle}\n\n💬 댓글로 여러분 생각 공유해주세요!\n\n${instaHashtags}`}
                    </div>
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}
        </div>

        {/* DONE BOX */}
        <div className="doneBox">
          <div className="doneTitle">🎉 모두 완료했어요!</div>
          <div className="doneSub">
            영상 제작 후 다른 키워드로도 만들어보세요.<br />
            매번 다른 결과가 나옵니다.
          </div>
          <div className="doneActions">
            <Link href="/create" className="doneBtn">
              🎬 다른 영상 만들기
            </Link>
            <Link href="/blog" className="doneBtn outline">
              📚 노하우 보기
            </Link>
          </div>
        </div>
      </div>

      <RewardedAd
        open={showRewarded}
        rewardLabel="1회 추가 생성"
        onComplete={handleRewardedComplete}
        onClose={() => setShowRewarded(false)}
      />
    </V11Shell>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<div />}>
      <PublishPageInner />
    </Suspense>
  );
}

// ============================================================
// 영상 제작 프롬프트 카드 (별도 컴포넌트)
// ============================================================
type SeqType = ReturnType<typeof generateVideoSequences>[0];

function PromptCard({
  seq,
  idx,
  copied,
  onCopy,
}: {
  seq: SeqType;
  idx: number;
  copied: string;
  onCopy: (text: string, key: string) => void;
}) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="promptCard">
      <div className="promptCardHead" onClick={() => setOpen(o => !o)}>
        <span className="promptCardSeq">{seq.number}</span>
        <span>{seq.title}</span>
        <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>
          ⏱️ {seq.duration}
        </span>
        <span className={`promptCardArrow ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="promptCardBody">
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang kr">🇰🇷 KR · 이미지</span>
              <button
                className={`promptCopyBtn ${copied === `imk-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.imagePromptKr, `imk-${idx}`)}
              >
                {copied === `imk-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.imagePromptKr}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang en">🇺🇸 EN · 이미지 (Midjourney/DALL-E)</span>
              <button
                className={`promptCopyBtn ${copied === `ime-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.imagePromptEn, `ime-${idx}`)}
              >
                {copied === `ime-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.imagePromptEn}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang kr">🇰🇷 KR · 영상</span>
              <button
                className={`promptCopyBtn ${copied === `vdk-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.videoPromptKr, `vdk-${idx}`)}
              >
                {copied === `vdk-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.videoPromptKr}</div>
          </div>
          <div className="promptItem">
            <div className="promptItemHead">
              <span className="promptLang en">🇺🇸 EN · 영상 (Runway/Sora/Google Flow/VEO/Pika)</span>
              <button
                className={`promptCopyBtn ${copied === `vde-${idx}` ? 'copied' : ''}`}
                onClick={() => onCopy(seq.videoPromptEn, `vde-${idx}`)}
              >
                {copied === `vde-${idx}` ? '✓' : '복사'}
              </button>
            </div>
            <div className="promptText">{seq.videoPromptEn}</div>
          </div>
        </div>
      )}
    </div>
  );
}
