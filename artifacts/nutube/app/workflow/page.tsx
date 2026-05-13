'use client';
/**
 * /workflow - 일관된 스타일 영상 만들기 5단계 가이드
 *
 * 박예준 대표 영상 노하우 반영:
 * - "한 사람이 그린 듯한 일관성"이 조회수 비결
 * - NotebookLM + Pinterest + Pollinations + Grok 모두 무료
 * - 60장 이미지 → 1개 영상 (대사 없이도 가능)
 */

import { useState } from 'react';
import Link from 'next/link';
import { V11Shell } from '../_shared/V11Shell';
import AdSlot from '../_shared/AdSlot';

interface Step {
  number: number;
  emoji: string;
  title: string;
  shortDesc: string;
  tools: { name: string; url: string; price: string; emoji: string }[];
  details: string[];
  tips: string[];
  example?: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    emoji: '🎨',
    title: '레퍼런스 이미지 + 시대설정 시트 만들기',
    shortDesc: 'AI한테 "이 느낌으로 그려라"고 명령하는 단계',
    tools: [
      { name: 'Pinterest', url: 'https://www.pinterest.com', price: '무료', emoji: '📌' },
      { name: 'ChatGPT (무료판)', url: 'https://chatgpt.com', price: '무료', emoji: '🤖' },
      { name: 'Google Gemini', url: 'https://gemini.google.com', price: '무료', emoji: '✨' },
    ],
    details: [
      'Pinterest에서 원하는 영상 분위기와 비슷한 이미지 1장 찾기',
      '예: "1920년대 저택" / "조선시대 한옥" / "현대 도시 야경"',
      'ChatGPT나 Gemini에 이미지 + 한 줄 주제 입력',
      '예시 입력: "1920년대 저택에 사는 여성의 아침 일상"',
      'AI가 색감, 분위기, 시대 배경, 주인공 외모, 공간 묘사 등을 한 번에 정리',
      '결과물 = "시대 설정 시트" 전체 복사해서 보관',
    ],
    tips: [
      '💡 핀터레스트 검색 키워드 예: "vintage painting", "oil painting 1920s", "한국 전통 화풍"',
      '💡 화풍은 유화로 통일하면 결과 일관성 ↑',
      '💡 "이 이미지의 색감과 분위기를 분석해줘"라고 명확히 요청',
    ],
    example: `[입력 예시]
이미지: (Pinterest 1920년대 저택 사진)
주제: 1920년대 저택에 사는 여성의 아침 일상

[AI가 만드는 시대 설정 시트]
- 시대 배경: 1920년대 미국 동부
- 화풍: 유화, 따뜻한 베이지/골드 톤
- 주인공: 30대 여성, 갈색 머리, 단발 펌
- 의상: 실크 가운, 진주 목걸이
- 공간: 빅토리아풍 침실, 큰 창문
- 조명: 아침 햇살, 은은한 그림자
- 분위기: 우아함, 평온함, 향수`,
  },
  {
    number: 2,
    emoji: '📚',
    title: 'NotebookLM에 시대 설정 시트 소스로 등록',
    shortDesc: '핵심 단계! AI가 "이 기준으로만 움직이게" 만들기',
    tools: [
      { name: 'NotebookLM', url: 'https://notebooklm.google.com', price: '무료 (Google 계정)', emoji: '📓' },
    ],
    details: [
      'notebooklm.google.com 접속 (Google 로그인)',
      '"새 노트북" 클릭',
      '"소스 추가" → "복사된 텍스트" 선택',
      '1단계에서 만든 시대 설정 시트 전체 붙여넣기',
      '소스로 등록 완료 → AI가 이 기준만 따름',
    ],
    tips: [
      '🔑 NotebookLM의 핵심: 소스에 등록된 내용은 "절대 잊지 않음"',
      '💡 무료로 노트북 100개까지 만들 수 있음',
      '⚠️ Pro 안 사도 충분 (무료가 충분히 강력)',
    ],
  },
  {
    number: 3,
    emoji: '📝',
    title: '60장 장면 프롬프트 자동 생성',
    shortDesc: '60개 장면을 AI가 한 번에 만들어줌',
    tools: [
      { name: 'NotebookLM', url: 'https://notebooklm.google.com', price: '무료', emoji: '📓' },
    ],
    details: [
      'NotebookLM 채팅창에 명령 입력',
      '👇 명령어 복사해서 사용 (아래 박스 참고)',
      '1번부터 60번까지 장면이 자동 나열됨',
      '결과물 우측 → "메모에 저장" 클릭',
      '저장된 메모 → 더보기(⋮) → "소스로 변환" 클릭',
      '⚡ 이 단계가 핵심: 소스가 풍부할수록 디테일 ↑',
    ],
    tips: [
      '💡 프롬프트가 없는 분야도 가능 (역사, 야담, 심리학, 경제학 등)',
      '💡 60장이 부담스러우면 30장으로 시작해도 OK',
    ],
    example: `[NotebookLM 채팅창에 입력]
이 소스를 바탕으로 1920년 여인의 아침을 담은
60개의 키프레임 이미지 프롬프트 작성해줘.

각 장면은:
- 1초당 한 장면
- 시간 순서대로
- 영문 프롬프트로 작성
- 시대 설정 시트의 색감/분위기 반드시 유지`,
  },
  {
    number: 4,
    emoji: '🖼️',
    title: '20장씩 끊어서 이미지 시각화',
    shortDesc: '⚠️ 한꺼번에 60장 X → AI 과부하 발생',
    tools: [
      { name: 'NotebookLM 슬라이드', url: 'https://notebooklm.google.com', price: '무료', emoji: '📓' },
      { name: 'AlgoMaker 이미지 생성기', url: '/imagegen', price: '무료', emoji: '🎨' },
    ],
    details: [
      '⚠️ 절대 60장 한 번에 X (스타일 무너짐)',
      '20장씩 3번 나눠서 요청',
      '입력: "1번부터 20번 프롬프트를 슬라이드로 시각화해줘. 텍스트 일체 넣지 마."',
      '20장 완성 → PDF 다운로드 → 다시 소스로 업로드',
      '"21번부터 40번 프롬프트로 시각화해줘. 소스에 등록된 화풍/색감/주인공 외모 반드시 유지"',
      '같은 방식으로 41~60번 마무리',
      '🎁 마음에 안 드는 이미지 → 우측 상단 "수정" 버튼으로 즉시 수정',
    ],
    tips: [
      '🔑 핵심 꿀팁: 20장 완성 시마다 PDF로 만들어 소스에 추가하면 일관성 유지',
      '⚠️ "이 질문에 답할 수 없습니다" 오류 → 새로고침 후 재시도',
      '💡 NotebookLM 결과가 마음에 안 들면 → /imagegen에서 영문 프롬프트로 재생성',
    ],
    example: `[입력 명령]
21번부터 40번 프롬프트를 슬라이드로 시각화해줘.
텍스트 일체 넣지 마.
소스에 등록된 화풍, 색감, 주인공 외모 반드시 유지해줘.`,
  },
  {
    number: 5,
    emoji: '🎬',
    title: '이미지 → 영상 + BGM 마무리',
    shortDesc: '60장을 영상으로 만들고 음악 입혀 완성',
    tools: [
      { name: 'Grok (X)', url: 'https://x.com/i/grok', price: '무료 / 유료', emoji: '🦾' },
      { name: 'Filmora', url: 'https://filmora.wondershare.com', price: '무료 체험', emoji: '🎞️' },
      { name: 'CapCut', url: 'https://www.capcut.com', price: '기본 무료 (Pro 유료)', emoji: '✂️' },
      { name: 'YouTube 오디오 라이브러리', url: 'https://studio.youtube.com', price: '무료', emoji: '🎵' },
    ],
    details: [
      '60장 이미지 다운로드 완료',
      '영상 편집기 선택 (CapCut 무료 버전 또는 다빈치 리졸브 무료 버전)',
      '60장을 1초당 1장씩 배치 (총 1분 영상)',
      '잔잔한 BGM 추가 (YouTube 오디오 라이브러리에서 무료 다운로드)',
      '시작/끝 페이드 인/아웃 효과',
      '필요하면 자막 추가 (대사 없어도 OK)',
      '저장 → 유튜브 업로드',
    ],
    tips: [
      '🎵 BGM 장르 추천: 잔잔한 피아노, 클래식, 앰비언트',
      '🎬 CapCut PC/모바일 무료 버전 사용 가능 (워터마크 일부 + 1080p 제한)',
      '💡 대사 없는 영상이 시청 유지율 ↑ (의외!)',
      '🔑 영상 길이 1분~3분이 알고리즘 최적',
    ],
  },
];

const TOOL_COMPARISON = [
  {
    category: '레퍼런스',
    tools: [
      { name: 'Pinterest', free: '✅ 무료', desc: '이미지 검색 (광고 노출 있음)' },
    ],
  },
  {
    category: 'AI 분석',
    tools: [
      { name: 'ChatGPT 무료', free: '✅ 무료', desc: '시대 설정 시트 생성 (월 한도 있음)' },
      { name: 'Google Gemini', free: '✅ 무료 버전', desc: '한글 우수 (Advanced 유료 옵션)' },
      { name: 'NotebookLM', free: '✅ 무료', desc: '소스 기반 일관성 (한도 있음)' },
    ],
  },
  {
    category: '이미지 생성',
    tools: [
      { name: 'NotebookLM 슬라이드', free: '✅ 무료', desc: '소스 기반 이미지 (강력, 한도 있음)' },
      { name: 'Pollinations.ai', free: '✅ 무료 무제한', desc: '오픈소스 무료 API' },
      { name: 'Bing Image Creator', free: '✅ 무료', desc: 'DALL-E 3 사용 (일 15회)' },
    ],
  },
  {
    category: '영상 편집',
    tools: [
      { name: 'CapCut', free: '✅ 기본 무료', desc: 'Free 버전 충분 (Pro $9.99~$19.99/월)' },
      { name: 'Filmora', free: '⚠️ 체험판', desc: '무료 워터마크 있음' },
      { name: 'DaVinci Resolve', free: '✅ 무료 (Studio 별도)', desc: '무료 버전도 전문가급 (Studio 일회성 $295)' },
    ],
  },
  {
    category: 'BGM',
    tools: [
      { name: 'YouTube 오디오 라이브러리', free: '✅ 무료', desc: '저작권 X, 상업 사용 OK' },
      { name: '무료 BGM 사이트', free: '✅ 무료', desc: 'Royalty Free 음악 검색' },
    ],
  },
];

export default function WorkflowPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState('');

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  return (
    <V11Shell currentStep={0}>
      <style jsx>{`
        .page {
          max-width: 1200px;
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

        /* 히어로 */
        .hero {
          background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
          color: #fff;
          border-radius: 20px;
          padding: 40px 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(circle, rgba(198, 95, 59, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (max-width: 720px) {
          .hero { padding: 28px 20px; }
        }
        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(198, 95, 59, 0.2);
          color: #fde0c5;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
        }
        .heroTitle {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 14px;
          line-height: 1.3;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 720px) {
          .heroTitle { font-size: 24px; }
        }
        .heroSub {
          font-size: 16px;
          color: #ccc;
          line-height: 1.7;
          margin: 0 0 20px;
          position: relative;
          z-index: 1;
        }
        .heroStats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .heroStat {
          flex: 1;
          min-width: 140px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
        }
        .heroStatLabel {
          font-size: 11px;
          color: #aaa;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .heroStatValue {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
        }

        /* 노티스 박스 */
        .noticeBox {
          background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
          border: 1.5px solid #f59e0b;
          border-radius: 14px;
          padding: 18px 22px;
          margin-bottom: 28px;
        }
        .noticeTitle {
          font-size: 14px;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .noticeText {
          font-size: 13px;
          color: #555;
          line-height: 1.7;
        }
        .noticeText strong {
          color: #92400e;
        }

        /* 단계 네비게이션 */
        .stepNav {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 24px;
          background: #fff;
          padding: 8px;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
        }
        @media (max-width: 720px) {
          .stepNav {
            grid-template-columns: repeat(5, 1fr);
            padding: 6px;
            gap: 4px;
          }
        }
        .stepNavBtn {
          padding: 10px 8px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          text-align: center;
        }
        .stepNavBtn:hover {
          background: #fafafa;
        }
        .stepNavBtn.active {
          background: #c65f3b;
          color: #fff;
        }
        .stepNavNum {
          font-size: 18px;
          margin-bottom: 2px;
        }
        @media (max-width: 720px) {
          .stepNavNum { font-size: 14px; }
        }
        .stepNavTitle {
          font-size: 11px;
          font-weight: 700;
          line-height: 1.3;
        }
        @media (max-width: 720px) {
          .stepNavTitle { font-size: 9.5px; }
        }
        .stepNavBtn:not(.active) .stepNavTitle {
          color: #555;
        }

        /* 단계 콘텐츠 */
        .stepContent {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 32px 28px;
          margin-bottom: 24px;
        }
        @media (max-width: 720px) {
          .stepContent { padding: 24px 18px; }
        }
        .stepHead {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .stepBigEmoji {
          font-size: 48px;
          line-height: 1;
          flex-shrink: 0;
        }
        @media (max-width: 720px) {
          .stepBigEmoji { font-size: 36px; }
        }
        .stepInfo {
          flex: 1;
          min-width: 0;
        }
        .stepLabel {
          font-size: 11px;
          font-weight: 800;
          color: #c65f3b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .stepTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 6px;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }
        @media (max-width: 720px) {
          .stepTitle { font-size: 18px; }
        }
        .stepSubtitle {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }

        /* 도구 목록 */
        .toolsSection {
          margin-bottom: 24px;
        }
        .sectionTitle {
          font-size: 13px;
          font-weight: 800;
          color: #888;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .toolsList {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }
        .toolCard {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 12px 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
          display: block;
        }
        .toolCard:hover {
          border-color: #c65f3b;
          background: #fff8f3;
          transform: translateY(-1px);
        }
        .toolName {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .toolEmoji {
          font-size: 16px;
        }
        .toolPrice {
          font-size: 11px;
          color: #2e7d32;
          font-weight: 700;
        }
        .toolPrice.paid {
          color: #d4a545;
        }

        /* 단계별 디테일 */
        .detailsSection {
          margin-bottom: 24px;
        }
        .detailsList {
          margin: 0;
          padding-left: 0;
          list-style: none;
        }
        .detailItem {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          font-size: 14px;
          color: #1a1a1a;
          line-height: 1.6;
          border-bottom: 1px dashed #f0f0f0;
        }
        .detailItem:last-child {
          border-bottom: none;
        }
        .detailNum {
          width: 24px;
          height: 24px;
          background: #c65f3b;
          color: #fff;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* 예시 박스 */
        .exampleBox {
          background: #1a1a1a;
          color: #f0f0f0;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 24px;
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 12.5px;
          line-height: 1.7;
          white-space: pre-wrap;
          position: relative;
        }
        .exampleHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #333;
        }
        .exampleLabel {
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          background: #c65f3b;
          color: #fff;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .copyBtn {
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copyBtn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .copyBtn.copied {
          background: #2e7d32;
          color: #fff;
          border-color: #2e7d32;
        }

        /* 팁 박스 */
        .tipsBox {
          background: linear-gradient(135deg, #fff8f0 0%, #fff5e8 100%);
          border: 1px solid #fde0c5;
          border-radius: 12px;
          padding: 16px 18px;
        }
        .tipItem {
          font-size: 13px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 6px;
        }
        .tipItem:last-child {
          margin-bottom: 0;
        }
        .tipItem strong {
          color: #c65f3b;
        }

        /* 도구 비교표 */
        .comparison {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 28px 24px;
          margin-bottom: 24px;
        }
        .compTitle {
          font-size: 18px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 16px;
          letter-spacing: -0.025em;
        }
        .compCategory {
          margin-bottom: 18px;
        }
        .compCategoryTitle {
          font-size: 13px;
          font-weight: 800;
          color: #c65f3b;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 2px solid #fdf1e7;
        }
        .compToolsList {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
        }
        .compTool {
          padding: 10px 14px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
        }
        .compToolName {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 3px;
        }
        .compToolFree {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .compToolDesc {
          font-size: 11.5px;
          color: #666;
          line-height: 1.5;
        }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #c65f3b 0%, #d97155 100%);
          color: #fff;
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
          margin-bottom: 24px;
        }
        .ctaTitle {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 10px;
          letter-spacing: -0.025em;
        }
        .ctaSub {
          font-size: 14px;
          margin: 0 0 20px;
          opacity: 0.95;
          line-height: 1.6;
        }
        .ctaBtn {
          display: inline-block;
          padding: 14px 32px;
          background: #fff;
          color: #c65f3b;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: all 0.2s;
        }
        .ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .adArea {
          margin: 24px 0;
        }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>일관된 스타일 영상 만들기</span>
        </nav>

        {/* 히어로 */}
        <div className="hero">
          <span className="heroBadge">✨ 100% 무료 워크플로우</span>
          <h1 className="heroTitle">
            한 사람이 그린 듯한 일관된 스타일,<br />
            대사 없이도 조회수 20만 만드는 비결
          </h1>
          <p className="heroSub">
            NotebookLM(무료) + Pinterest(무료) + AlgoMaker(무료)만으로
            <br />
            60장 이미지를 일관된 스타일로 생성하는 완전한 워크플로우 가이드
          </p>
          <div className="heroStats">
            <div className="heroStat">
              <div className="heroStatLabel">난이도</div>
              <div className="heroStatValue">🟢 입문 가능</div>
            </div>
            <div className="heroStat">
              <div className="heroStatLabel">소요 시간</div>
              <div className="heroStatValue">⏰ 약 1시간</div>
            </div>
            <div className="heroStat">
              <div className="heroStatLabel">비용</div>
              <div className="heroStatValue">💰 0원</div>
            </div>
            <div className="heroStat">
              <div className="heroStatLabel">결과물</div>
              <div className="heroStatValue">🎬 1분 영상 1편</div>
            </div>
          </div>
        </div>

        {/* 핵심 노하우 */}
        <div className="noticeBox">
          <div className="noticeTitle">💡 이 가이드의 핵심 노하우</div>
          <div className="noticeText">
            <strong>"AI 영상이 일관성 없는 이유"</strong>는 매번 새로 그리기 때문입니다.
            <br />
            <strong>NotebookLM의 "소스" 기능</strong>을 활용하면 AI가 같은 기준으로 60장 이상의 이미지를
            만들 수 있어요. 핀터레스트 레퍼런스 + AI 시대 설정 시트 + NotebookLM 소스 = 일관된 영상의 비결!
          </div>
        </div>

        {/* 단계 네비게이션 */}
        <div className="stepNav">
          {STEPS.map((s) => (
            <button
              key={s.number}
              className={`stepNavBtn ${activeStep === s.number ? 'active' : ''}`}
              onClick={() => setActiveStep(s.number)}
            >
              <div className="stepNavNum">{s.emoji}</div>
              <div className="stepNavTitle">
                {s.number}단계
              </div>
            </button>
          ))}
        </div>

        {/* 활성 단계 콘텐츠 */}
        {STEPS.filter((s) => s.number === activeStep).map((step) => (
          <div key={step.number} className="stepContent">
            <div className="stepHead">
              <div className="stepBigEmoji">{step.emoji}</div>
              <div className="stepInfo">
                <div className="stepLabel">STEP {step.number} / 5</div>
                <h2 className="stepTitle">{step.title}</h2>
                <div className="stepSubtitle">{step.shortDesc}</div>
              </div>
            </div>

            {/* 사용 도구 */}
            <div className="toolsSection">
              <div className="sectionTitle">🛠️ 사용 도구</div>
              <div className="toolsList">
                {step.tools.map((tool, i) => (
                  <a
                    key={i}
                    href={tool.url}
                    target={tool.url.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="toolCard"
                  >
                    <div className="toolName">
                      <span className="toolEmoji">{tool.emoji}</span>
                      <span>{tool.name}</span>
                    </div>
                    <div className={`toolPrice ${tool.price.includes('무료') ? '' : 'paid'}`}>
                      {tool.price}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 단계별 상세 */}
            <div className="detailsSection">
              <div className="sectionTitle">📋 진행 순서</div>
              <ul className="detailsList">
                {step.details.map((detail, i) => (
                  <li key={i} className="detailItem">
                    <span className="detailNum">{i + 1}</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 예시 (있는 경우만) */}
            {step.example && (
              <div className="exampleBox">
                <div className="exampleHead">
                  <span className="exampleLabel">📝 예시</span>
                  <button
                    className={`copyBtn ${copied === `ex-${step.number}` ? 'copied' : ''}`}
                    onClick={() => copy(step.example!, `ex-${step.number}`)}
                  >
                    {copied === `ex-${step.number}` ? '✓ 복사됨' : '복사'}
                  </button>
                </div>
                {step.example}
              </div>
            )}

            {/* 꿀팁 */}
            <div>
              <div className="sectionTitle">💎 꿀팁</div>
              <div className="tipsBox">
                {step.tips.map((tip, i) => (
                  <div key={i} className="tipItem">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="adArea">
          <AdSlot slot="workflow-mid" variant="horizontal" />
        </div>

        {/* 도구 비교표 */}
        <div className="comparison">
          <h2 className="compTitle">🆓 모든 단계 무료 도구 모음</h2>
          {TOOL_COMPARISON.map((cat, i) => (
            <div key={i} className="compCategory">
              <div className="compCategoryTitle">{cat.category}</div>
              <div className="compToolsList">
                {cat.tools.map((tool, j) => (
                  <div key={j} className="compTool">
                    <div className="compToolName">{tool.name}</div>
                    <div className="compToolFree" style={{ color: tool.free.includes('완전') || tool.free.startsWith('✅ 무료') ? '#2e7d32' : '#d4a545' }}>
                      {tool.free}
                    </div>
                    <div className="compToolDesc">{tool.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta">
          <h3 className="ctaTitle">🚀 이제 영상 만들 준비가 되셨나요?</h3>
          <p className="ctaSub">
            지금 바로 키워드 입력하면 AI가 영상 자료 + 한글/영문 프롬프트까지 만들어드립니다.
            <br />
            여기서 받은 프롬프트로 NotebookLM에서 일관된 60장 이미지를 만드세요!
          </p>
          <Link href="/create" className="ctaBtn">
            ✨ 영상 만들기 시작 →
          </Link>
        </div>

        <div className="adArea">
          <AdSlot slot="workflow-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
