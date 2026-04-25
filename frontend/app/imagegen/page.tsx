'use client';
/**
 * /imagegen - AI 이미지 생성기
 *
 * Auto Whisk 코드 기반으로 박 대표님 컨셉에 통일된 이미지 생성 도구.
 * - Pollinations AI (무료, API 키 불필요) 기본
 * - 한 줄당 1 프롬프트로 일괄 생성
 * - URL 파라미터로 /publish에서 프롬프트 자동 전달 받음
 * - V11Shell 적용 + AdSense 정책 준수
 */

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';
import RewardedAd, {
  isFreeAvailable,
  getRemainingFree,
  incrementUsage,
  addBonusCredit,
  tryUseCredit,
  getBonusCredits,
  FREE_LIMIT,
} from '../_shared/RewardedAd';

// 비율별 이미지 크기
const ASPECT_DIMS: Record<string, { w: number; h: number }> = {
  '1:1': { w: 1024, h: 1024 },
  '16:9': { w: 1344, h: 768 },
  '9:16': { w: 768, h: 1344 },
  '4:3': { w: 1152, h: 896 },
  '3:4': { w: 896, h: 1152 },
};

interface QueueItem {
  prompt: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  imgUrl?: string;
  errorMsg?: string;
}

function ImagegenPageInner() {
  const searchParams = useSearchParams();
  const [promptText, setPromptText] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imgCount, setImgCount] = useState(1);
  const [model, setModel] = useState('flux');
  const [running, setRunning] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [results, setResults] = useState<{ prompt: string; imgUrl: string; ar: string }[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, status: '대기 중' });
  const [toast, setToast] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const stopRef = useRef(false);
  
  // 광고 게이트 상태
  const [showAd, setShowAd] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [bonusCredits, setBonusCredits] = useState(0);
  const [pendingGeneration, setPendingGeneration] = useState(false);

  // /publish에서 전달된 프롬프트 자동 채우기 + 사용 횟수 확인
  useEffect(() => {
    const fromPublish = searchParams.get('prompt');
    if (fromPublish) {
      setPromptText(decodeURIComponent(fromPublish));
      showToast('✨ 결과 페이지에서 프롬프트 가져왔어요');
    }
    const ar = searchParams.get('ar');
    if (ar && ASPECT_DIMS[ar]) setAspectRatio(ar);
    
    // 사용권 정보 로드
    setRemaining(getRemainingFree());
    setBonusCredits(getBonusCredits());
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const getPrompts = (): string[] => {
    return promptText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  };

  // 시도별 다른 엔드포인트 사용 (백업 API 전략)
  const generateImageUrl = (prompt: string, ar: string, attempt: number = 0): string => {
    const { w, h } = ASPECT_DIMS[ar] || { w: 1024, h: 1024 };
    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(prompt);

    // 시도 1: 기본 Pollinations (선택한 모델)
    if (attempt === 0) {
      return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&model=${model}&seed=${seed}&nologo=true`;
    }
    // 시도 2: turbo 모델로 재시도 (더 빠른 응답, 콜드 스타트에 강함)
    if (attempt === 1) {
      return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&model=turbo&seed=${seed}&nologo=true`;
    }
    // 시도 3: 새 엔드포인트 (gen.pollinations.ai)
    return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&seed=${seed}&nologo=true`;
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // 실제 생성 로직 (게이트 통과 후 실행)
  const doGeneration = async () => {
    const prompts = getPrompts();
    if (prompts.length === 0) {
      showToast('⚠️ 프롬프트를 입력해주세요');
      return;
    }

    // 큐 만들기 (프롬프트 × imgCount)
    const newQueue: QueueItem[] = [];
    for (const p of prompts) {
      for (let c = 0; c < imgCount; c++) {
        newQueue.push({ prompt: p, status: 'pending' });
      }
    }

    setQueue(newQueue);
    setResults([]);
    setRunning(true);
    stopRef.current = false;

    const total = newQueue.length;
    setProgress({ done: 0, total, status: '생성 시작...' });

    let doneCount = 0;
    for (let i = 0; i < newQueue.length; i++) {
      if (stopRef.current) break;

      // 상태 업데이트: loading
      setQueue((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'loading' };
        return next;
      });
      setProgress({ done: doneCount, total, status: `생성 중 (${i + 1}/${total})` });

      // 최대 3회 시도 (1차: 기본 모델, 2차: turbo, 3차: 기본 엔드포인트)
      let success = false;
      let finalImgUrl = '';
      let lastError = '';

      for (let attempt = 0; attempt < 3 && !success && !stopRef.current; attempt++) {
        try {
          const imgUrl = generateImageUrl(newQueue[i].prompt, aspectRatio, attempt);
          
          // 이미지 프리로드 (콜드 스타트 대응 - 30초 타임아웃)
          const loadResult = await new Promise<'success' | 'error' | 'timeout'>((resolve) => {
            const img = new Image();
            const timer = setTimeout(() => resolve('timeout'), 30000); // 30초로 증가
            img.onload = () => {
              clearTimeout(timer);
              // 이미지 크기로 깨짐 여부 추가 검증
              if (img.naturalWidth > 100 && img.naturalHeight > 100) {
                resolve('success');
              } else {
                resolve('error');
              }
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve('error');
            };
            img.src = imgUrl;
          });

          if (loadResult === 'success') {
            success = true;
            finalImgUrl = imgUrl;
          } else {
            const reason = loadResult === 'timeout' ? '시간 초과' : '생성 실패';
            const nextAction = attempt === 0 ? 'Turbo 모델로 재시도' : attempt === 1 ? '기본 모델로 재시도' : '재시도 종료';
            lastError = `${reason} (${nextAction})`;
            // 재시도 전 2초 대기
            if (attempt < 2) await sleep(2000);
          }
        } catch (err: any) {
          lastError = err?.message || '오류';
          if (attempt < 2) await sleep(2000);
        }
      }

      if (success) {
        setQueue((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'done', imgUrl: finalImgUrl };
          return next;
        });
        setResults((prev) => [...prev, { prompt: newQueue[i].prompt, imgUrl: finalImgUrl, ar: aspectRatio }]);
        doneCount++;
      } else {
        setQueue((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'error', errorMsg: lastError || '생성 실패' };
          return next;
        });
      }

      setProgress({ done: doneCount, total, status: `진행 중 (${doneCount}/${total})` });

      if (i < newQueue.length - 1 && !stopRef.current) {
        await sleep(1000); // 차단 방지 1초 대기
      }
    }

    setRunning(false);
    if (stopRef.current) {
      setProgress((p) => ({ ...p, status: '⏹ 중지됨' }));
      showToast('중지되었습니다');
    } else {
      setProgress({ done: doneCount, total, status: `✅ 완료 (${doneCount}/${total})` });
      showToast(`✅ ${doneCount}개 이미지 생성 완료!`);
    }
  };

  // 광고 게이트가 포함된 메인 진입 함수
  const startGeneration = async () => {
    const prompts = getPrompts();
    if (prompts.length === 0) {
      showToast('⚠️ 프롬프트를 입력해주세요');
      return;
    }
    
    // 사용권 확인
    const result = tryUseCredit();
    if (result.allowed) {
      // 무료 또는 보너스 사용권 있음 → 즉시 진행
      setRemaining(getRemainingFree());
      setBonusCredits(getBonusCredits());
      if (result.source === 'free') {
        showToast(`✨ 무료 이용권 사용 (${getRemainingFree()}회 남음)`);
      } else {
        showToast('🎁 광고 보너스 사용권으로 진행합니다');
      }
      await doGeneration();
    } else {
      // 사용권 없음 → 광고 시청 필요
      setPendingGeneration(true);
      setShowAd(true);
    }
  };
  
  // 광고 시청 완료 후 자동 생성 시작
  const handleAdComplete = async () => {
    addBonusCredit();
    setBonusCredits(getBonusCredits());
    
    if (pendingGeneration) {
      setPendingGeneration(false);
      // 약간 지연 후 생성 시작 (모달 닫힘 애니메이션)
      setTimeout(async () => {
        // 보너스 사용권 사용
        const result = tryUseCredit();
        if (result.allowed) {
          setBonusCredits(getBonusCredits());
          await doGeneration();
        }
      }, 300);
    }
  };
  
  const handleAdClose = () => {
    setShowAd(false);
    setPendingGeneration(false);
  };

  const stopGeneration = () => {
    stopRef.current = true;
  };

  // 단일 이미지 재생성 (실패한 이미지) - 다중 백업 전략 적용
  const regenerateSingle = async (idx: number) => {
    const item = queue[idx];
    if (!item) return;

    // loading 상태로 변경
    setQueue((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: 'loading' };
      return next;
    });

    let success = false;
    let finalImgUrl = '';

    // 최대 3회 시도 (재생성도 백업 전략 적용)
    for (let attempt = 0; attempt < 3 && !success; attempt++) {
      try {
        const imgUrl = generateImageUrl(item.prompt, aspectRatio, attempt);
        const loadResult = await new Promise<'success' | 'error' | 'timeout'>((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => resolve('timeout'), 30000);
          img.onload = () => {
            clearTimeout(timer);
            if (img.naturalWidth > 100 && img.naturalHeight > 100) {
              resolve('success');
            } else {
              resolve('error');
            }
          };
          img.onerror = () => {
            clearTimeout(timer);
            resolve('error');
          };
          img.src = imgUrl;
        });

        if (loadResult === 'success') {
          success = true;
          finalImgUrl = imgUrl;
        } else if (attempt < 2) {
          await sleep(2000);
        }
      } catch {
        if (attempt < 2) await sleep(2000);
      }
    }

    if (success) {
      setQueue((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], status: 'done', imgUrl: finalImgUrl };
        return next;
      });
      setResults((prev) => [...prev, { prompt: item.prompt, imgUrl: finalImgUrl, ar: aspectRatio }]);
      showToast('✅ 재생성 완료!');
    } else {
      setQueue((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], status: 'error', errorMsg: '서버가 일시적으로 바쁩니다. 1~2분 후 다시 시도해주세요.' };
        return next;
      });
      showToast('❌ 재생성 실패. 잠시 후 다시 시도해주세요.');
    }
  };

  const downloadImage = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `algomaker_image_${idx + 1}.jpg`;
    a.target = '_blank';
    a.click();
  };

  const clearAll = () => {
    setPromptText('');
    setQueue([]);
    setResults([]);
    setProgress({ done: 0, total: 0, status: '대기 중' });
  };

  const examplePrompts = `cinematic black and white photography, dramatic lighting
korean middle-aged man, surprised expression, close-up shot, 4K
notebook and pen on desk, natural lighting, lifestyle photography`;

  return (
    <V11Shell currentStep={0}>
      {/* 광고 모달 */}
      <RewardedAd
        open={showAd}
        rewardLabel="이미지 생성 1회"
        onComplete={handleAdComplete}
        onClose={handleAdClose}
      />
      <style jsx>{`
        .page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }

        .breadcrumb {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #888;
          margin-bottom: 20px;
        }
        .breadcrumb a:hover {
          color: #c65f3b;
        }
        .breadcrumb .sep {
          color: #ccc;
        }

        .header {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f0 100%);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 24px;
        }
        @media (max-width: 720px) {
          .header {
            padding: 20px;
          }
        }
        .freeBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #2e7d32;
          color: #fff;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .title {
          font-size: 26px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.025em;
          margin: 0 0 6px;
        }
        .sub {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }

        .grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 24px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        /* 좌측 컨트롤 패널 */
        .controlPanel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          position: sticky;
          top: 20px;
        }
        @media (max-width: 1024px) {
          .controlPanel {
            position: static;
          }
        }

        .panelSection {
          padding: 18px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .panelSection:last-child {
          border-bottom: none;
        }

        .sectionLabel {
          font-size: 11px;
          font-weight: 800;
          color: #888;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .promptInput {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          background: #fafafa;
          font-size: 13px;
          color: #1a1a1a;
          font-family: 'SF Mono', Monaco, monospace;
          line-height: 1.6;
          resize: vertical;
          min-height: 120px;
          box-sizing: border-box;
        }
        .promptInput:focus {
          outline: none;
          border-color: #c65f3b;
        }

        .promptHint {
          font-size: 11px;
          color: #888;
          margin-top: 8px;
          line-height: 1.5;
        }

        .quickFill {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .quickBtn {
          padding: 5px 10px;
          background: #fdf1e7;
          color: #c65f3b;
          border: 1px solid #f5d4b8;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .quickBtn:hover {
          background: #c65f3b;
          color: #fff;
        }

        .settingsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .settingItem label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 5px;
          font-weight: 600;
        }
        .settingSelect {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          background: #fff;
          font-size: 12.5px;
          color: #1a1a1a;
          font-family: inherit;
          cursor: pointer;
        }
        .settingSelect:focus {
          outline: none;
          border-color: #c65f3b;
        }

        .actionRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 18px 20px;
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }
        .btnStart {
          padding: 12px 16px;
          background: #c65f3b;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .btnStart:hover:not(:disabled) {
          background: #a64a2a;
        }
        .btnStart:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btnStop {
          padding: 12px 16px;
          background: #fff;
          color: #d63b3b;
          border: 1px solid #d63b3b;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .btnStop:hover:not(:disabled) {
          background: #ffeeee;
        }
        .btnStop:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .progressArea {
          padding: 14px 20px;
          background: #fafafa;
        }
        .progressBar {
          height: 6px;
          background: #e5e5e5;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progressFill {
          height: 100%;
          background: linear-gradient(90deg, #c65f3b, #d97155);
          transition: width 0.4s ease;
        }
        .progressStatus {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #555;
          font-weight: 600;
        }

        /* 우측 결과 패널 */
        .resultsPanel {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 24px;
          min-height: 400px;
        }

        .resultsEmpty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          gap: 12px;
          color: #888;
          text-align: center;
        }
        .emptyIcon {
          font-size: 48px;
          opacity: 0.4;
        }
        .emptyText {
          font-size: 14px;
        }
        .emptySub {
          font-size: 12px;
          color: #aaa;
        }

        .resultsHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        .resultsTitle {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .resultsCount {
          font-size: 12px;
          color: #c65f3b;
          font-weight: 700;
        }
        .clearBtn {
          padding: 6px 12px;
          background: #fff;
          color: #888;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .clearBtn:hover {
          color: #d63b3b;
          border-color: #d63b3b;
        }

        .resultsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }

        .resultCard {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.15s;
          cursor: pointer;
        }
        .resultCard:hover {
          border-color: #c65f3b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.1);
        }

        .resultImg {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          background: #eee;
        }
        .resultImg.ar11 {
          aspect-ratio: 1 / 1;
        }
        .resultImg.ar916 {
          aspect-ratio: 9 / 16;
        }
        .resultImg.ar43 {
          aspect-ratio: 4 / 3;
        }
        .resultImg.ar34 {
          aspect-ratio: 3 / 4;
        }

        .resultLoading {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #f0f0f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 11px;
          color: #888;
        }
        .resultLoading.ar11 { aspect-ratio: 1/1; }
        .resultLoading.ar916 { aspect-ratio: 9/16; }
        .resultLoading.ar43 { aspect-ratio: 4/3; }
        .resultLoading.ar34 { aspect-ratio: 3/4; }
        .spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #e5e5e5;
          border-top-color: #c65f3b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .resultInfo {
          padding: 10px 12px;
        }
        .resultPrompt {
          font-size: 11.5px;
          color: #666;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .resultActions {
          display: flex;
          gap: 6px;
        }
        .actionBtn {
          padding: 5px 9px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 5px;
          font-size: 11px;
          color: #555;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }
        .actionBtn:hover {
          background: #c65f3b;
          color: #fff;
          border-color: #c65f3b;
        }

        /* 라이트박스 */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .lightboxImg {
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 8px;
          box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
        }
        .lightboxClose {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 50%;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }
        .lightboxClose:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* 토스트 */
        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: #fff;
          padding: 12px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          z-index: 9998;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .infoBox {
          background: #fff8f0;
          border: 1px solid #fde0c5;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 16px;
        }
        .infoTitle {
          font-size: 13px;
          font-weight: 800;
          color: #c65f3b;
          margin-bottom: 6px;
        }
        .infoText {
          font-size: 12px;
          color: #555;
          line-height: 1.6;
        }

        /* 한글 텍스트 안내 카드 */
        .hangulNotice {
          background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
          border: 1.5px solid #f59e0b;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 20px;
        }
        .hangulTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 12px;
        }
        .hangulIcon {
          font-size: 20px;
        }
        .hangulBody {
          font-size: 13px;
        }
        .hangulText {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .hangulText strong {
          color: #92400e;
        }
        .hangulTools {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }
        .hangulToolCard {
          background: #fff;
          border: 1.5px solid #fde68a;
          border-radius: 10px;
          padding: 12px 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          display: block;
        }
        .hangulToolCard:hover {
          border-color: #f59e0b;
          background: #fffbeb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
        }
        .hangulToolHead {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .hangulToolEmoji {
          font-size: 18px;
        }
        .hangulToolName {
          font-size: 13px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .hangulToolDesc {
          font-size: 11.5px;
          color: #555;
          line-height: 1.5;
        }
        .hangulHint {
          font-size: 12px;
          color: #555;
          line-height: 1.6;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          margin: 0;
        }
        .hangulHint strong {
          color: #92400e;
        }

        .adArea {
          margin: 24px 0;
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>AI 이미지 생성</span>
        </nav>

        <div className="header">
          <span className="freeBadge">✨ 완전 무료 · API 키 불필요</span>
          <h1 className="title">🎨 AI 이미지 생성</h1>
          <p className="sub">
            프롬프트를 입력하면 AI가 이미지를 만들어드립니다.
            <br />
            영상 썸네일·콘텐츠·광고 이미지로 바로 활용하세요.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, padding: '6px 14px',
            background: 'rgba(198, 95, 59, 0.08)',
            border: '1px solid rgba(198, 95, 59, 0.2)',
            borderRadius: 100, fontSize: 12, color: '#555', fontWeight: 500
          }}>
            {remaining > 0 ? (
              <>🎁 무료 이용권 <strong style={{ color: '#c65f3b', fontWeight: 800 }}>{remaining}회</strong> 남았어요</>
            ) : bonusCredits > 0 ? (
              <>🎁 광고 보너스 <strong style={{ color: '#c65f3b', fontWeight: 800 }}>{bonusCredits}회</strong> 사용 가능</>
            ) : (
              <>✨ 광고 1회 시청 = 1장 이미지 생성</>
            )}
          </div>
        </div>

        <div className="infoBox">
          <div className="infoTitle">💡 사용 팁</div>
          <div className="infoText">
            • <strong>한 줄에 하나씩</strong> 프롬프트를 입력하시면 각각의 이미지로 생성됩니다
            <br />• <strong>영문 프롬프트</strong>가 더 정확한 결과를 만듭니다 (한글도 작동하지만 품질 차이 있음)
            <br />• <strong>SNS 업로드 자료 페이지</strong>의 <strong>"🎨 이미지 생성"</strong> 또는 <strong>"🎨 썸네일 만들기"</strong> 버튼을 누르시면 프롬프트가 자동으로 채워집니다
            <br />• <strong>첫 번째 이미지</strong>는 서버 준비 시간 때문에 30초까지 걸릴 수 있어요. 실패해도 <strong>"🔄 다시 생성"</strong> 버튼으로 재시도 가능합니다.
          </div>
        </div>

        {/* 한글 텍스트 이미지 안내 카드 */}
        <div className="hangulNotice">
          <div className="hangulTitle">
            <span className="hangulIcon">⚠️</span>
            <span>한글 텍스트가 들어간 이미지를 만드시려면?</span>
          </div>
          <div className="hangulBody">
            <p className="hangulText">
              현재 사용 중인 <strong>Pollinations AI(무료)</strong>는 한글이 깨져서 나옵니다.
              한국어 텍스트가 정확히 들어간 이미지가 필요하시면 아래 도구들이 가장 좋습니다:
            </p>
            <div className="hangulTools">
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hangulToolCard"
              >
                <div className="hangulToolHead">
                  <span className="hangulToolEmoji">🤖</span>
                  <span className="hangulToolName">ChatGPT (GPT Image)</span>
                </div>
                <div className="hangulToolDesc">
                  한글 정확도 95% 이상 · 가장 추천<br />
                  <span style={{ color: '#888' }}>유료 (Plus $20/월)</span>
                </div>
              </a>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hangulToolCard"
              >
                <div className="hangulToolHead">
                  <span className="hangulToolEmoji">✨</span>
                  <span className="hangulToolName">Google Gemini</span>
                </div>
                <div className="hangulToolDesc">
                  한글 텍스트 지원 (Nano Banana 2)<br />
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>무료 사용 가능</span>
                </div>
              </a>
              <a
                href="https://www.canva.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hangulToolCard"
              >
                <div className="hangulToolHead">
                  <span className="hangulToolEmoji">🎨</span>
                  <span className="hangulToolName">Canva (편집)</span>
                </div>
                <div className="hangulToolDesc">
                  AI 이미지 + 한글 텍스트 직접 추가<br />
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>무료 가능</span>
                </div>
              </a>
            </div>
            <p className="hangulHint">
              💡 <strong>추천 워크플로우</strong>: ① 본 사이트에서 영문 프롬프트로 배경 이미지 생성 →
              ② Canva에서 한글 텍스트 추가 → ③ 완성!
            </p>
          </div>
        </div>

        <div className="grid">
          {/* 좌측 컨트롤 */}
          <div className="controlPanel">
            <div className="panelSection">
              <div className="sectionLabel">프롬프트 입력</div>
              <textarea
                className="promptInput"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={`프롬프트를 한 줄에 하나씩 입력하세요\n\n예시:\n${examplePrompts}`}
                disabled={running}
              />
              <div className="promptHint">💡 각 줄이 별도의 이미지로 생성됩니다</div>
              <div className="quickFill">
                <button className="quickBtn" onClick={() => setPromptText(examplePrompts)}>
                  예시 프롬프트
                </button>
                <button className="quickBtn" onClick={() => setPromptText('')}>
                  지우기
                </button>
              </div>
            </div>

            <div className="panelSection">
              <div className="sectionLabel">생성 옵션</div>
              <div className="settingsGrid">
                <div className="settingItem">
                  <label>화면 비율</label>
                  <select className="settingSelect" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} disabled={running}>
                    <option value="16:9">16:9 (가로 영상)</option>
                    <option value="9:16">9:16 (세로 영상)</option>
                    <option value="1:1">1:1 (정사각형)</option>
                    <option value="4:3">4:3</option>
                    <option value="3:4">3:4</option>
                  </select>
                </div>
                <div className="settingItem">
                  <label>이미지 수 / 프롬프트</label>
                  <select className="settingSelect" value={imgCount} onChange={(e) => setImgCount(parseInt(e.target.value))} disabled={running}>
                    <option value="1">1장</option>
                    <option value="2">2장</option>
                    <option value="3">3장</option>
                    <option value="4">4장</option>
                  </select>
                </div>
              </div>
              <div className="settingItem" style={{ marginTop: 10 }}>
                <label>스타일</label>
                <select className="settingSelect" value={model} onChange={(e) => setModel(e.target.value)} disabled={running}>
                  <option value="flux">Flux (기본 - 고품질)</option>
                  <option value="turbo">Turbo (빠름)</option>
                  <option value="flux-realism">Flux Realism (사실적)</option>
                  <option value="flux-anime">Flux Anime</option>
                  <option value="flux-3d">Flux 3D</option>
                </select>
              </div>
            </div>

            <div className="actionRow">
              <button className="btnStart" onClick={startGeneration} disabled={running}>
                ▶ 생성 시작
              </button>
              <button className="btnStop" onClick={stopGeneration} disabled={!running}>
                ⏹ 중지
              </button>
            </div>

            {progress.total > 0 && (
              <div className="progressArea">
                <div className="progressBar">
                  <div className="progressFill" style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}></div>
                </div>
                <div className="progressStatus">
                  <span>{progress.status}</span>
                  <span>
                    {progress.done} / {progress.total}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 우측 결과 */}
          <div>
            <div className="resultsPanel">
              {results.length === 0 && queue.length === 0 && (
                <div className="resultsEmpty">
                  <div className="emptyIcon">🖼️</div>
                  <div className="emptyText">생성된 이미지가 여기에 표시됩니다</div>
                  <div className="emptySub">프롬프트를 입력하고 시작 버튼을 눌러주세요</div>
                </div>
              )}

              {(results.length > 0 || queue.length > 0) && (
                <>
                  <div className="resultsHeader">
                    <div>
                      <span className="resultsTitle">생성 결과</span>
                      {results.length > 0 && <span className="resultsCount" style={{ marginLeft: 8 }}>{results.length}개</span>}
                    </div>
                    {results.length > 0 && (
                      <button className="clearBtn" onClick={clearAll}>
                        🗑️ 초기화
                      </button>
                    )}
                  </div>

                  <div className="resultsGrid">
                    {queue.map((item, i) => {
                      const arClass = aspectRatio === '1:1' ? 'ar11' : aspectRatio === '9:16' ? 'ar916' : aspectRatio === '4:3' ? 'ar43' : aspectRatio === '3:4' ? 'ar34' : '';
                      if (item.status === 'done' && item.imgUrl) {
                        return (
                          <div key={i} className="resultCard">
                            <img
                              className={`resultImg ${arClass}`}
                              src={item.imgUrl}
                              alt={item.prompt}
                              onClick={() => setLightbox(item.imgUrl!)}
                              onError={(e) => {
                                // 이미지 로드 실패 시 자동으로 error 상태로 변경
                                setQueue((prev) => {
                                  const next = [...prev];
                                  if (next[i]) {
                                    next[i] = { ...next[i], status: 'error', errorMsg: '이미지 로드 실패' };
                                  }
                                  return next;
                                });
                              }}
                            />
                            <div className="resultInfo">
                              <div className="resultPrompt">{item.prompt}</div>
                              <div className="resultActions">
                                <button className="actionBtn" onClick={() => downloadImage(item.imgUrl!, i)}>
                                  💾 저장
                                </button>
                                <button className="actionBtn" onClick={() => setLightbox(item.imgUrl!)}>
                                  🔍 확대
                                </button>
                                <button
                                  className="actionBtn"
                                  onClick={() => regenerateSingle(i)}
                                  disabled={running}
                                  title="다시 생성"
                                >
                                  🔄
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (item.status === 'loading') {
                        return (
                          <div key={i} className="resultCard">
                            <div className={`resultLoading ${arClass}`}>
                              <div className="spinner"></div>
                              <span>생성 중...</span>
                            </div>
                            <div className="resultInfo">
                              <div className="resultPrompt">{item.prompt}</div>
                            </div>
                          </div>
                        );
                      } else if (item.status === 'error') {
                        return (
                          <div key={i} className="resultCard">
                            <div className={`resultLoading ${arClass}`} style={{ color: '#d63b3b' }}>
                              <div style={{ fontSize: 28 }}>❌</div>
                              <span style={{ fontSize: 11, padding: '0 12px', textAlign: 'center' }}>{item.errorMsg}</span>
                            </div>
                            <div className="resultInfo">
                              <div className="resultPrompt">{item.prompt}</div>
                              <div className="resultActions">
                                <button
                                  className="actionBtn"
                                  style={{ background: '#c65f3b', color: '#fff', borderColor: '#c65f3b' }}
                                  onClick={() => regenerateSingle(i)}
                                  disabled={running}
                                >
                                  🔄 다시 생성
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="adArea">
              <AdSlot slot="imagegen-bottom" variant="horizontal" />
            </div>
          </div>
        </div>

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button className="lightboxClose" onClick={() => setLightbox(null)}>
              ✕
            </button>
            <img className="lightboxImg" src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </V11Shell>
  );
}

export default function ImagegenPage() {
  return (
    <Suspense fallback={<div />}>
      <ImagegenPageInner />
    </Suspense>
  );
}
