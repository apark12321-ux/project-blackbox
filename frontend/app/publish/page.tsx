'use client';
/**
 * /publish - SNS 메타데이터 결과 페이지 (최종판)
 * 
 * 박예준 대표 핵심 요구사항:
 * 1. 각 SNS 실제 업로드 화면과 동일한 UI
 * 2. 알고리즘 반영된 진짜 고퀄리티 콘텐츠
 * 3. 영상 제작 프롬프트 (한글 + 영문)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { V11Shell, getProject } from '../_shared/V11Shell';
import { getCategoryById, getScenarioById, getTrendingKeywords } from '../_shared/platforms';
import {
  generateTitles,
  generateDescription,
  generateTags,
  generateVideoSequences,
  generateThumbnailConcepts,
  getYouTubeCategory,
} from '../_shared/contentEngine';
import AdSlot from '../_shared/AdSlot';

type TabType = 'youtube-long' | 'youtube-shorts' | 'tiktok' | 'instagram-reels' | 'video-prompts';

export default function PublishPage() {
  const [category, setCategory] = useState('realestate');
  const [keyword, setKeyword] = useState('2026년 부동산 전망');
  const [scenarioId, setScenarioId] = useState('curiosity');
  const [activeTab, setActiveTab] = useState<TabType>('youtube-long');
  const [copied, setCopied] = useState('');
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [selectedThumbIdx, setSelectedThumbIdx] = useState(0);

  useEffect(() => {
    const project = getProject();
    if (project.category) setCategory(project.category);
    if (project.keyword) setKeyword(project.keyword);
    if (project.scenarioStyleId) setScenarioId(project.scenarioStyleId);
  }, []);

  const cat = getCategoryById(category);
  const scenario = getScenarioById(scenarioId);
  if (!cat) return null;

  const titles = generateTitles(keyword, scenarioId, cat.name);
  const description = generateDescription(keyword, cat.name, scenarioId);
  const tags = generateTags(keyword, cat.name);
  const sequences = generateVideoSequences(keyword, scenarioId);
  const thumbnails = generateThumbnailConcepts(keyword, cat.name);
  const youtubeCategory = getYouTubeCategory(category);

  const selectedTitle = titles[selectedTitleIdx]?.title || '';
  const selectedThumb = thumbnails[selectedThumbIdx];

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  const hashtagsBase = tags.slice(0, 8).map(t => `#${t.tag}`).join(' ');
  const shortsHashtags = `#Shorts ${hashtagsBase} #쇼츠 #${cat.name.replace(/[·]/g, '')}`;
  const tiktokHashtags = `#fyp #foryou ${hashtagsBase} #추천 #바이럴`;
  const instaHashtags = `${hashtagsBase} #인스타그램 #릴스 #${cat.name.replace(/[·]/g, '')} #일상`;

  const shortsCaption = `${selectedTitle.substring(0, 50)}...\n\n자세한 내용은 본 채널 풀버전 영상에서 확인하세요!`;
  const tiktokCaption = `💡 ${keyword} 진짜 핵심만!\n${selectedTitle}\n\n${tiktokHashtags}`;
  const reelsCaption = `📊 ${keyword} 핵심 정리\n\n${selectedTitle}\n\n💬 댓글로 여러분 생각 공유해주세요!\n\n${instaHashtags}`;

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page { max-width: 1400px; margin: 0 auto; padding: 32px 20px 60px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 13px; color: #888; margin-bottom: 20px; }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .header {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f0 100%);
          border-radius: 16px; padding: 28px 32px; margin-bottom: 24px;
          display: flex; gap: 24px; align-items: center; flex-wrap: wrap;
        }
        @media (max-width: 720px) { .header { padding: 20px; } }
        .doneBadge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; background: #2e7d32; color: #fff;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 8px;
        }
        .title {
          font-size: 24px; font-weight: 800; color: #1a1a1a;
          letter-spacing: -0.025em; margin: 0 0 4px;
        }
        .sub { font-size: 14px; color: #555; }
        .summaryChips { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
        .chip {
          padding: 8px 14px; background: #fff; border: 1px solid #e5e5e5;
          border-radius: 100px; font-size: 12.5px; color: #555; font-weight: 600;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .chip strong { color: #1a1a1a; }
        .grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: flex-start; }
        @media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } .sidebar { display: none; } }
        .platformTabs {
          display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap;
          background: #fff; padding: 8px; border: 1px solid #e5e5e5; border-radius: 12px;
        }
        .tab {
          padding: 10px 16px; background: transparent; border: none; border-radius: 8px;
          font-size: 13.5px; color: #666; font-weight: 600; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.15s; white-space: nowrap;
        }
        .tab:hover { background: #fafafa; color: #1a1a1a; }
        .tab.active { background: #c65f3b; color: #fff; font-weight: 700; }
        .tabEmoji { font-size: 16px; }
        .uploadScreen { background: #fff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; margin-bottom: 16px; }
        .platformHeader { padding: 18px 24px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
        .platformHeader.youtube { background: #fff; }
        .platformHeader.shorts { background: #fff; }
        .platformHeader.tiktok { background: #000; color: #fff; }
        .platformHeader.reels {
          background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #fff;
        }
        .platformLogo { font-size: 22px; }
        .platformInfo { flex: 1; }
        .platformName { font-size: 16px; font-weight: 800; color: inherit; margin: 0; }
        .platformSpecs { font-size: 11.5px; opacity: 0.7; margin-top: 2px; }
        .platformBadge { padding: 4px 10px; background: rgba(255,255,255,0.15); border-radius: 100px; font-size: 10.5px; font-weight: 700; }
        .platformHeader.youtube .platformBadge,
        .platformHeader.shorts .platformBadge { background: #fdf1e7; color: #c65f3b; }
        .uploadBody { padding: 24px; }
        .formField { margin-bottom: 24px; }
        .formField:last-child { margin-bottom: 0; }
        .fieldLabelRow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .fieldLabel { font-size: 14px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 8px; }
        .fieldRequired { color: #d63b3b; font-size: 13px; }
        .fieldHelper { font-size: 11.5px; color: #888; margin-top: 4px; line-height: 1.5; margin-bottom: 10px; }
        .charLimit { font-size: 11px; color: #888; font-weight: 500; }
        .copyBtn {
          padding: 6px 14px; background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 8px; font-size: 11.5px; color: #555; cursor: pointer;
          font-family: inherit; font-weight: 600; transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .copyBtn:hover { background: #c65f3b; color: #fff; border-color: #c65f3b; }
        .copyBtn.copied { background: #2e7d32; color: #fff; border-color: #2e7d32; }
        .uploadInput {
          width: 100%; padding: 14px 16px; border: 1px solid #d0d0d0;
          border-radius: 8px; background: #fafafa; font-size: 14px; color: #1a1a1a;
          font-family: inherit; line-height: 1.6; box-sizing: border-box;
          white-space: pre-wrap; word-break: break-word; min-height: 50px;
        }
        .uploadInput.large { min-height: 200px; }
        .titleOptions { display: flex; flex-direction: column; gap: 10px; }
        .titleOption {
          padding: 16px 18px; background: #fafafa; border: 2px solid #e5e5e5;
          border-radius: 10px; cursor: pointer; transition: all 0.15s;
          font-family: inherit; text-align: left; width: 100%;
        }
        .titleOption:hover { border-color: #c65f3b; background: #fff8f3; }
        .titleOption.selected { border-color: #c65f3b; background: #fdf1e7; }
        .titleOptionTop { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 10px; flex-wrap: wrap; }
        .titleOptionLabel { font-size: 11px; font-weight: 800; color: #c65f3b; padding: 3px 8px; background: #fff; border-radius: 4px; }
        .titleOptionCTR { font-size: 11px; color: #2e7d32; font-weight: 700; padding: 3px 8px; background: #e8f5e9; border-radius: 4px; }
        .titleOptionText { font-size: 15px; font-weight: 700; color: #1a1a1a; line-height: 1.5; margin-bottom: 8px; }
        .titleOptionReason { font-size: 11.5px; color: #666; line-height: 1.55; padding-top: 8px; border-top: 1px dashed #e0e0e0; }
        .tagAnalytics { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
        .tagItem { padding: 8px 12px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 12px; }
        .tagItemName { font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .tagItemMeta { font-size: 10.5px; color: #666; display: flex; gap: 8px; }
        .tagVolume.high { color: #2e7d32; font-weight: 700; }
        .tagVolume.medium { color: #d4a545; font-weight: 600; }
        .tagComp.low { color: #2e7d32; }
        .tagComp.medium { color: #888; }
        .thumbCards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
        .thumbCard {
          background: #fff; border: 2px solid #e5e5e5; border-radius: 12px;
          padding: 18px; cursor: pointer; transition: all 0.15s;
        }
        .thumbCard:hover { border-color: #c65f3b; }
        .thumbCard.selected { border-color: #c65f3b; background: #fdf1e7; }
        .thumbCardHead { font-size: 14px; font-weight: 800; color: #c65f3b; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .thumbCardCTR { font-size: 10.5px; color: #2e7d32; padding: 3px 8px; background: #e8f5e9; border-radius: 4px; font-weight: 700; }
        .thumbCardItem { font-size: 12px; color: #555; line-height: 1.6; margin-bottom: 4px; }
        .thumbCardItem strong { color: #1a1a1a; }
        .sequenceCard { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 0; margin-bottom: 14px; overflow: hidden; }
        .seqHead { padding: 16px 20px; background: linear-gradient(135deg, #fdf1e7, #fff8f0); border-bottom: 1px solid #e5e5e5; display: flex; align-items: center; gap: 12px; }
        .seqNumber { width: 32px; height: 32px; background: #c65f3b; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
        .seqInfo { flex: 1; min-width: 0; }
        .seqTitle { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 2px; }
        .seqDuration { font-size: 11px; color: #888; font-weight: 600; }
        .seqPurpose { font-size: 11.5px; color: #666; padding: 10px 20px; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        .seqPurpose strong { color: #c65f3b; }
        .seqBody { padding: 16px 20px; }
        .seqSection { margin-bottom: 14px; }
        .seqSection:last-child { margin-bottom: 0; }
        .seqSectionLabel { font-size: 11.5px; font-weight: 800; color: #888; letter-spacing: 0.05em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
        .seqScript { font-size: 13px; color: #1a1a1a; line-height: 1.7; padding: 12px 14px; background: #fafafa; border-radius: 8px; border-left: 3px solid #c65f3b; }
        .seqPrompt { padding: 12px 14px; background: #1a1a1a; color: #f0f0f0; border-radius: 8px; font-family: 'SF Mono', Monaco, monospace; font-size: 11.5px; line-height: 1.6; word-break: break-word; }
        .seqPrompt.kr { background: #2c3e50; }
        .seqPromptHead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .seqPromptLang { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.08em; }
        .seqPromptLang.kr { background: #c65f3b; color: #fff; }
        .seqPromptLang.en { background: #4a90d9; color: #fff; }
        .seqTip { font-size: 11.5px; color: #666; padding: 10px 14px; background: #fff8f0; border: 1px solid #fde0c5; border-radius: 8px; line-height: 1.5; }
        .sidebar { position: sticky; top: 20px; background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; }
        .sidebarTitle { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
        .sidebarSection { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px dashed #f0f0f0; }
        .sidebarSection:last-child { border-bottom: none; }
        .sidebarLabel { font-size: 11px; font-weight: 700; color: #888; letter-spacing: 0.05em; margin-bottom: 8px; }
        .sidebarText { font-size: 12px; color: #1a1a1a; line-height: 1.6; }
        .sidebarText strong { color: #c65f3b; }
        .sidebarStat { font-size: 16px; font-weight: 800; color: #c65f3b; }
        .sidebarStatLabel { font-size: 11px; color: #666; margin-top: 2px; }
        .actions { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
        .actionBtn { padding: 13px 22px; border-radius: 10px; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .actionBtn.primary { background: #c65f3b; color: #fff; border: 1px solid #c65f3b; }
        .actionBtn.primary:hover { background: #a64a2a; }
        .actionBtn.secondary { background: #fff; color: #555; border: 1px solid #e5e5e5; }
        .actionBtn.secondary:hover { background: #fafafa; }
        .adArea { margin: 32px 0; }
        .promptIntro { background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%); color: #fff; padding: 24px; border-radius: 14px; margin-bottom: 20px; }
        .promptIntroTitle { font-size: 18px; font-weight: 800; margin: 0 0 8px; }
        .promptIntroSub { font-size: 13px; opacity: 0.85; line-height: 1.6; margin-bottom: 16px; }
        .promptIntroTools { display: flex; gap: 8px; flex-wrap: wrap; }
        .promptToolChip { padding: 6px 12px; background: rgba(255,255,255,0.15); border-radius: 100px; font-size: 11.5px; font-weight: 600; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/create">분야</Link>
          <span className="sep">/</span>
          <Link href="/keyword">키워드</Link>
          <span className="sep">/</span>
          <span>완성</span>
        </nav>

        <div className="header">
          <div>
            <span className="doneBadge">✓ AI 분석 완료</span>
            <h1 className="title">SNS 업로드 자료 준비 완료</h1>
            <p className="sub">각 플랫폼 업로드 화면에 그대로 복사·붙여넣기하시면 됩니다</p>
          </div>
          <div className="summaryChips">
            <span className="chip">{cat.emoji} <strong>{cat.name}</strong></span>
            <span className="chip">🎯 <strong>{keyword}</strong></span>
            {scenario && <span className="chip">{scenario.emoji} <strong>{scenario.name}</strong></span>}
          </div>
        </div>

        <div className="platformTabs">
          <button className={`tab ${activeTab === 'youtube-long' ? 'active' : ''}`} onClick={() => setActiveTab('youtube-long')}>
            <span className="tabEmoji">📺</span><span>YouTube 롱폼</span>
          </button>
          <button className={`tab ${activeTab === 'youtube-shorts' ? 'active' : ''}`} onClick={() => setActiveTab('youtube-shorts')}>
            <span className="tabEmoji">📱</span><span>YouTube Shorts</span>
          </button>
          <button className={`tab ${activeTab === 'tiktok' ? 'active' : ''}`} onClick={() => setActiveTab('tiktok')}>
            <span className="tabEmoji">🎵</span><span>TikTok</span>
          </button>
          <button className={`tab ${activeTab === 'instagram-reels' ? 'active' : ''}`} onClick={() => setActiveTab('instagram-reels')}>
            <span className="tabEmoji">📸</span><span>Instagram Reels</span>
          </button>
          <button className={`tab ${activeTab === 'video-prompts' ? 'active' : ''}`} onClick={() => setActiveTab('video-prompts')}>
            <span className="tabEmoji">🎬</span><span>영상 제작 프롬프트</span>
          </button>
        </div>

        <div className="grid">
          <main>
            {activeTab === 'youtube-long' && (
              <div className="uploadScreen">
                <div className="platformHeader youtube">
                  <span className="platformLogo">📺</span>
                  <div className="platformInfo">
                    <h3 className="platformName">YouTube Studio · 영상 세부정보</h3>
                    <div className="platformSpecs">8분 이상 · 가로 16:9 · 광고 수익 가능</div>
                  </div>
                  <span className="platformBadge">롱폼</span>
                </div>
                <div className="uploadBody">
                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">제목 <span className="fieldRequired">(필수)</span></div>
                      <span className="charLimit">최대 100자</span>
                    </div>
                    <div className="fieldHelper">💡 알고리즘 분석 기반 클릭률(CTR) 높은 제목 3가지. 클릭해서 선택하세요.</div>
                    <div className="titleOptions">
                      {titles.map((t, i) => (
                        <button key={i} className={`titleOption ${selectedTitleIdx === i ? 'selected' : ''}`} onClick={() => setSelectedTitleIdx(i)}>
                          <div className="titleOptionTop">
                            <span className="titleOptionLabel">{t.pattern}</span>
                            <span className="titleOptionCTR">예상 CTR {t.ctr_estimate}</span>
                          </div>
                          <div className="titleOptionText">{t.title}</div>
                          <div className="titleOptionReason">💭 <strong>알고리즘 분석:</strong> {t.reasoning}</div>
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button className={`copyBtn ${copied === 'yt-title' ? 'copied' : ''}`} onClick={() => copy(selectedTitle, 'yt-title')}>
                        {copied === 'yt-title' ? '✓ 복사됨' : '📋 선택한 제목 복사'}
                      </button>
                    </div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">설명 <span className="fieldRequired">(필수)</span></div>
                      <button className={`copyBtn ${copied === 'yt-desc' ? 'copied' : ''}`} onClick={() => copy(description, 'yt-desc')}>
                        {copied === 'yt-desc' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="fieldHelper">💡 SEO 최적화 + 챕터(목차) 포함. 첫 100자가 검색 미리보기에 노출됩니다.</div>
                    <div className="uploadInput large">{description}</div>
                  </div>

                  <div className="adArea">
                    <AdSlot slot="publish-mid" variant="horizontal" />
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">썸네일 <span className="fieldRequired">(필수)</span></div>
                      <span className="charLimit">1280×720 / 16:9</span>
                    </div>
                    <div className="fieldHelper">💡 알고리즘 검증된 3가지 콘셉트. 클릭해서 영상 프롬프트 확인.</div>
                    <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                      ⚠️ <strong>썸네일 한글 텍스트는 ChatGPT(GPT Image) 또는 Gemini 추천</strong>: Pollinations(현재 도구)는 한글이 깨질 수 있어요. 
                      한글 텍스트가 정확한 썸네일을 원하시면 <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c65f3b', fontWeight: 700 }}>ChatGPT</a> 또는 <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c65f3b', fontWeight: 700 }}>Gemini</a>를 사용하세요.
                    </div>
                    <div className="thumbCards">
                      {thumbnails.map((th, i) => (
                        <div key={i} className={`thumbCard ${selectedThumbIdx === i ? 'selected' : ''}`} onClick={() => setSelectedThumbIdx(i)}>
                          <div className="thumbCardHead">
                            <span>{th.type}</span>
                            <span className="thumbCardCTR">{th.ctr_estimate}</span>
                          </div>
                          <div className="thumbCardItem"><strong>배경:</strong> {th.background}</div>
                          <div className="thumbCardItem"><strong>메인 텍스트:</strong> {th.mainText}</div>
                          <div className="thumbCardItem"><strong>보조 텍스트:</strong> {th.subText}</div>
                          <div className="thumbCardItem"><strong>표정:</strong> {th.expression}</div>
                          <div className="thumbCardItem"><strong>색상:</strong> {th.colors}</div>
                        </div>
                      ))}
                    </div>
                    {selectedThumb && (
                      <div style={{ marginTop: 14 }}>
                        <div className="seqSection">
                          <div className="seqSectionLabel">🇰🇷 한글 프롬프트 (Midjourney, DALL-E 3 등)</div>
                          <div className="seqPrompt kr">
                            <div className="seqPromptHead">
                              <span className="seqPromptLang kr">KR</span>
                              <button className={`copyBtn ${copied === `thumb-kr-${selectedThumbIdx}` ? 'copied' : ''}`} onClick={() => copy(selectedThumb.imagePromptKr, `thumb-kr-${selectedThumbIdx}`)}>
                                {copied === `thumb-kr-${selectedThumbIdx}` ? '✓' : '복사'}
                              </button>
                            </div>
                            {selectedThumb.imagePromptKr}
                          </div>
                        </div>
                        <div className="seqSection">
                          <div className="seqSectionLabel">🇺🇸 영문 프롬프트 (Stable Diffusion, Midjourney)</div>
                          <div className="seqPrompt">
                            <div className="seqPromptHead">
                              <span className="seqPromptLang en">EN</span>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <Link
                                  href={`/imagegen?prompt=${encodeURIComponent(selectedThumb.imagePromptEn)}&ar=16:9`}
                                  className="copyBtn"
                                  style={{ background: '#c65f3b', color: '#fff', borderColor: '#c65f3b' }}
                                >
                                  🎨 썸네일 만들기
                                </Link>
                                <button className={`copyBtn ${copied === `thumb-en-${selectedThumbIdx}` ? 'copied' : ''}`} onClick={() => copy(selectedThumb.imagePromptEn, `thumb-en-${selectedThumbIdx}`)}>
                                  {copied === `thumb-en-${selectedThumbIdx}` ? '✓' : '복사'}
                                </button>
                              </div>
                            </div>
                            {selectedThumb.imagePromptEn}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow"><div className="fieldLabel">카테고리</div></div>
                    <div className="fieldHelper">💡 YouTube 카테고리는 알고리즘 추천에 영향을 줍니다.</div>
                    <div className="uploadInput">📁 {youtubeCategory}</div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">태그</div>
                      <button className={`copyBtn ${copied === 'yt-tags' ? 'copied' : ''}`} onClick={() => copy(tags.map(t => t.tag).join(', '), 'yt-tags')}>
                        {copied === 'yt-tags' ? '✓ 복사됨' : '📋 모두 복사'}
                      </button>
                    </div>
                    <div className="fieldHelper">💡 검색량과 경쟁률 분석한 추천 태그입니다.</div>
                    <div className="tagAnalytics">
                      {tags.map((t, i) => (
                        <div key={i} className="tagItem">
                          <div className="tagItemName">{t.tag}</div>
                          <div className="tagItemMeta">
                            <span className={`tagVolume ${t.volume === '높음' || t.volume === '매우높음' ? 'high' : 'medium'}`}>📊 {t.volume}</span>
                            <span className={`tagComp ${t.competition === '낮음' ? 'low' : 'medium'}`}>🎯 {t.competition}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'youtube-shorts' && (
              <div className="uploadScreen">
                <div className="platformHeader shorts">
                  <span className="platformLogo">📱</span>
                  <div className="platformInfo">
                    <h3 className="platformName">YouTube Shorts · 업로드</h3>
                    <div className="platformSpecs">60초 이하 · 세로 9:16 · 빠른 구독 증가</div>
                  </div>
                  <span className="platformBadge">SHORTS</span>
                </div>
                <div className="uploadBody">
                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">쇼츠 제목</div>
                      <span className="charLimit">최대 100자</span>
                    </div>
                    <div className="fieldHelper">💡 짧고 강렬하게. 첫 단어에 핵심 키워드 배치.</div>
                    <div className="uploadInput">{`${keyword} 1분 정리 #Shorts`}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button className={`copyBtn ${copied === 's-title' ? 'copied' : ''}`} onClick={() => copy(`${keyword} 1분 정리 #Shorts`, 's-title')}>
                        {copied === 's-title' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">캡션</div>
                      <button className={`copyBtn ${copied === 's-cap' ? 'copied' : ''}`} onClick={() => copy(shortsCaption, 's-cap')}>
                        {copied === 's-cap' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="uploadInput large">{shortsCaption}</div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">해시태그</div>
                      <button className={`copyBtn ${copied === 's-tags' ? 'copied' : ''}`} onClick={() => copy(shortsHashtags, 's-tags')}>
                        {copied === 's-tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="fieldHelper">💡 #Shorts 필수 + 트렌드 해시태그 조합</div>
                    <div className="uploadInput">{shortsHashtags}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tiktok' && (
              <div className="uploadScreen">
                <div className="platformHeader tiktok">
                  <span className="platformLogo">🎵</span>
                  <div className="platformInfo">
                    <h3 className="platformName">TikTok · Upload Video</h3>
                    <div className="platformSpecs">15~60초 · 세로 9:16 · 바이럴 확산력 최강</div>
                  </div>
                  <span className="platformBadge">TIKTOK</span>
                </div>
                <div className="uploadBody">
                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">캡션 (Caption)</div>
                      <span className="charLimit">최대 2,200자</span>
                    </div>
                    <div className="fieldHelper">💡 첫 100자가 핵심. 호기심 유발 + 해시태그.</div>
                    <div className="uploadInput large">{tiktokCaption}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button className={`copyBtn ${copied === 'tt-cap' ? 'copied' : ''}`} onClick={() => copy(tiktokCaption, 'tt-cap')}>
                        {copied === 'tt-cap' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">해시태그</div>
                      <button className={`copyBtn ${copied === 'tt-tags' ? 'copied' : ''}`} onClick={() => copy(tiktokHashtags, 'tt-tags')}>
                        {copied === 'tt-tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="fieldHelper">💡 #fyp #foryou는 추천 알고리즘 필수.</div>
                    <div className="uploadInput">{tiktokHashtags}</div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabel" style={{ marginBottom: 8 }}>📌 TikTok 알고리즘 팁</div>
                    <div className="seqTip">
                      ⏰ <strong>업로드 골든 타임:</strong> 평일 오후 6시~9시, 주말 오전 9시~12시<br />
                      🎵 <strong>음악 선택:</strong> 트렌드 사운드 사용 시 노출 5배 증가<br />
                      📊 <strong>첫 3초:</strong> 시청자 이탈 80%가 첫 3초에 발생. 강한 후크 필수<br />
                      💬 <strong>댓글 유도:</strong> 영상 끝에 질문 던지면 알고리즘 점수 상승
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instagram-reels' && (
              <div className="uploadScreen">
                <div className="platformHeader reels">
                  <span className="platformLogo">📸</span>
                  <div className="platformInfo">
                    <h3 className="platformName">Instagram · 새 릴스</h3>
                    <div className="platformSpecs">90초 이하 · 세로 9:16 · 브랜드 친화적</div>
                  </div>
                  <span className="platformBadge">REELS</span>
                </div>
                <div className="uploadBody">
                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">캡션 (Caption)</div>
                      <span className="charLimit">최대 2,200자</span>
                    </div>
                    <div className="fieldHelper">💡 인스타 톤은 부드럽게. 이모지 적절히.</div>
                    <div className="uploadInput large">{reelsCaption}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button className={`copyBtn ${copied === 'r-cap' ? 'copied' : ''}`} onClick={() => copy(reelsCaption, 'r-cap')}>
                        {copied === 'r-cap' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabelRow">
                      <div className="fieldLabel">해시태그</div>
                      <button className={`copyBtn ${copied === 'r-tags' ? 'copied' : ''}`} onClick={() => copy(instaHashtags, 'r-tags')}>
                        {copied === 'r-tags' ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <div className="fieldHelper">💡 인스타 해시태그는 최대 30개. 인기·중간·롱테일 조합.</div>
                    <div className="uploadInput">{instaHashtags}</div>
                  </div>

                  <div className="formField">
                    <div className="fieldLabel" style={{ marginBottom: 8 }}>📌 Reels 알고리즘 팁</div>
                    <div className="seqTip">
                      💼 <strong>장점:</strong> 브랜드 신뢰도 높음, 광고 단가 좋음<br />
                      ⏰ <strong>업로드 시간:</strong> 평일 오전 11시~오후 1시 최적<br />
                      🎬 <strong>커버 이미지:</strong> 피드에 보이는 첫 화면 매우 중요<br />
                      🔗 <strong>프로필 링크:</strong> "프로필 링크에서 자세히" 멘트로 외부 유입
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'video-prompts' && (
              <>
                <div className="promptIntro">
                  <h3 className="promptIntroTitle">🎬 영상 제작 프롬프트 모음</h3>
                  <p className="promptIntroSub">
                    선택하신 시나리오 ({scenario?.name})에 맞춰 영상 시퀀스 6개 자동 생성.<br />
                    각 시퀀스마다 대본, 한글/영문 이미지·영상 프롬프트 포함.
                  </p>
                  <div className="promptIntroTools">
                    <span className="promptToolChip">Midjourney</span>
                    <span className="promptToolChip">Stable Diffusion</span>
                    <span className="promptToolChip">DALL-E 3</span>
                    <span className="promptToolChip">Runway</span>
                    <span className="promptToolChip">Pika</span>
                    <span className="promptToolChip">Sora</span>
                    <span className="promptToolChip">Kling AI</span>
                  </div>
                </div>

                {sequences.map((seq, idx) => (
                  <div key={seq.number} className="sequenceCard">
                    <div className="seqHead">
                      <div className="seqNumber">{seq.number}</div>
                      <div className="seqInfo">
                        <h4 className="seqTitle">{seq.title}</h4>
                        <div className="seqDuration">⏱️ {seq.duration}</div>
                      </div>
                    </div>
                    <div className="seqPurpose"><strong>📌 목적:</strong> {seq.purpose}</div>
                    <div className="seqBody">
                      <div className="seqSection">
                        <div className="seqSectionLabel">📝 추천 대본</div>
                        <div className="seqScript">{seq.script}</div>
                      </div>
                      <div className="seqSection">
                        <div className="seqSectionLabel">🇰🇷 이미지 프롬프트 (한글)</div>
                        <div className="seqPrompt kr">
                          <div className="seqPromptHead">
                            <span className="seqPromptLang kr">KR · IMAGE</span>
                            <button className={`copyBtn ${copied === `img-kr-${idx}` ? 'copied' : ''}`} onClick={() => copy(seq.imagePromptKr, `img-kr-${idx}`)}>
                              {copied === `img-kr-${idx}` ? '✓ 복사' : '복사'}
                            </button>
                          </div>
                          {seq.imagePromptKr}
                        </div>
                      </div>
                      <div className="seqSection">
                        <div className="seqSectionLabel">🇺🇸 이미지 프롬프트 (영문 - Midjourney/SD)</div>
                        <div className="seqPrompt">
                          <div className="seqPromptHead">
                            <span className="seqPromptLang en">EN · IMAGE</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Link
                                href={`/imagegen?prompt=${encodeURIComponent(seq.imagePromptEn)}&ar=16:9`}
                                className="copyBtn"
                                style={{ background: '#c65f3b', color: '#fff', borderColor: '#c65f3b' }}
                              >
                                🎨 이미지 생성
                              </Link>
                              <button className={`copyBtn ${copied === `img-en-${idx}` ? 'copied' : ''}`} onClick={() => copy(seq.imagePromptEn, `img-en-${idx}`)}>
                                {copied === `img-en-${idx}` ? '✓ 복사' : '복사'}
                              </button>
                            </div>
                          </div>
                          {seq.imagePromptEn}
                        </div>
                      </div>
                      <div className="seqSection">
                        <div className="seqSectionLabel">🇰🇷 영상 프롬프트 (한글)</div>
                        <div className="seqPrompt kr">
                          <div className="seqPromptHead">
                            <span className="seqPromptLang kr">KR · VIDEO</span>
                            <button className={`copyBtn ${copied === `vid-kr-${idx}` ? 'copied' : ''}`} onClick={() => copy(seq.videoPromptKr, `vid-kr-${idx}`)}>
                              {copied === `vid-kr-${idx}` ? '✓ 복사' : '복사'}
                            </button>
                          </div>
                          {seq.videoPromptKr}
                        </div>
                      </div>
                      <div className="seqSection">
                        <div className="seqSectionLabel">🇺🇸 영상 프롬프트 (영문 - Runway/Pika/Sora)</div>
                        <div className="seqPrompt">
                          <div className="seqPromptHead">
                            <span className="seqPromptLang en">EN · VIDEO</span>
                            <button className={`copyBtn ${copied === `vid-en-${idx}` ? 'copied' : ''}`} onClick={() => copy(seq.videoPromptEn, `vid-en-${idx}`)}>
                              {copied === `vid-en-${idx}` ? '✓ 복사' : '복사'}
                            </button>
                          </div>
                          {seq.videoPromptEn}
                        </div>
                      </div>
                      <div className="seqTip">{seq.tip}</div>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="actions">
              <Link href="/done" className="actionBtn primary">✅ 모두 완료했어요</Link>
              <Link href="/create" className="actionBtn secondary">🔄 다른 영상 만들기</Link>
            </div>

            <div className="adArea">
              <AdSlot slot="publish-bottom" variant="horizontal" />
            </div>
          </main>

          <aside className="sidebar">
            <h3 className="sidebarTitle">📊 알고리즘 분석</h3>
            <div className="sidebarSection">
              <div className="sidebarLabel">예상 CTR (클릭률)</div>
              <div className="sidebarStat">{titles[selectedTitleIdx]?.ctr_estimate || '7~10%'}</div>
              <div className="sidebarStatLabel">선택한 제목 기준</div>
            </div>
            <div className="sidebarSection">
              <div className="sidebarLabel">분야 입문 난이도</div>
              <div className="sidebarStat">
                {cat.competition === '낮음' ? '🟢 쉬움' : cat.competition === '높음' ? '🔴 어려움' : '🟡 보통'}
              </div>
              <div className="sidebarStatLabel">{cat.name} · 경쟁 정도</div>
            </div>
            <div className="sidebarSection">
              <div className="sidebarLabel">추천 키워드</div>
              <div className="sidebarStat">{getTrendingKeywords(cat.id).length}개</div>
              <div className="sidebarStatLabel">{cat.name} 인기 키워드</div>
            </div>
            <div className="sidebarSection">
              <div className="sidebarLabel">📌 업로드 체크리스트</div>
              <div className="sidebarText">
                ✅ 제목 선택<br />
                ✅ 설명문 복사<br />
                ✅ 태그 입력<br />
                ✅ 카테고리 설정<br />
                ✅ 썸네일 생성<br />
                ✅ 영상 시퀀스 확인
              </div>
            </div>
            <div className="sidebarSection">
              <div className="sidebarLabel">💡 알고리즘 핵심 팁</div>
              <div className="sidebarText">
                <strong>1. 첫 30초:</strong><br />시청 유지율 최우선<br /><br />
                <strong>2. 시청 지속:</strong><br />각 1분마다 새 정보·반전<br /><br />
                <strong>3. 마무리:</strong><br />다음 영상 예고 → 체류 시간 ↑
              </div>
            </div>
            <div className="sidebarSection">
              <div className="sidebarLabel">🎯 업로드 골든 타임</div>
              <div className="sidebarText">
                YouTube: 평일 19:00~21:00<br />
                Shorts: 오전 8~10시 / 19~21시<br />
                TikTok: 평일 18~21시<br />
                Reels: 평일 11~13시
              </div>
            </div>
          </aside>
        </div>
      </div>
    </V11Shell>
  );
}
