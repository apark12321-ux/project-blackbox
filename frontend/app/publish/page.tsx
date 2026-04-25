'use client';
/**
 * /publish - SNS 메타데이터 템플릿 (핵심 결과 페이지)
 * 박 대표님 비전: "SNS 사이트별 메타데이터 입력 템플릿 그대로"
 * - YouTube/Shorts/TikTok/Reels 4개 탭
 * - 각 플랫폼의 입력 화면처럼 보임
 * - 복사 버튼으로 즉시 사용 가능
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { V11Shell, getProject } from '../_shared/V11Shell';
import { getCategoryById, getScenarioById, PLATFORMS, getPlatformById } from '../_shared/platforms';
import AdSlot from '../_shared/AdSlot';

export default function PublishPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [activePlatform, setActivePlatform] = useState('youtube-long');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const project = getProject();
    setCategory(project.category || 'realestate');
    setKeyword(project.keyword || '2026년 부동산 전망');
    setScenarioId(project.scenarioStyleId || 'curiosity');
  }, []);

  const cat = getCategoryById(category);
  const scenario = getScenarioById(scenarioId);
  const platform = getPlatformById(activePlatform);

  if (!cat || !platform) return null;

  // ============================================================
  // 콘텐츠 생성 (백엔드 연동 전 템플릿 - 추후 API 연동)
  // ============================================================
  const generateTitles = () => {
    const patterns = {
      curiosity: [
        `${keyword}, 이거 모르면 후회합니다`,
        `[충격] ${keyword}의 진짜 이유는?`,
        `${keyword} - 전문가도 놓치는 핵심`,
      ],
      tutorial: [
        `${keyword} 따라하기 - 5분 완벽 가이드`,
        `초보자를 위한 ${keyword} 단계별 정리`,
        `${keyword}, 이렇게 시작하세요`,
      ],
      review: [
        `${keyword} 솔직 리뷰 - 장단점 비교`,
        `${keyword} TOP 5 비교 분석`,
        `${keyword} - 추천 vs 비추천`,
      ],
      storytelling: [
        `${keyword} - 제 경험을 공유합니다`,
        `${keyword}으로 인생이 바뀐 이야기`,
        `${keyword} 도전기 - 1년 후 결과`,
      ],
      list: [
        `${keyword} BEST 5 정리`,
        `${keyword} 꼭 알아야 할 7가지`,
        `${keyword} TOP 10 랭킹`,
      ],
      qa: [
        `Q&A: ${keyword}에 대한 모든 것`,
        `${keyword} 자주 묻는 질문 7가지`,
        `${keyword} - 궁금한 점 답해드립니다`,
      ],
    };
    return patterns[scenarioId as keyof typeof patterns] || patterns.curiosity;
  };

  const titles = generateTitles();

  const description = `📌 영상 핵심 요약
${keyword}에 대해 자세히 다룹니다.

🎯 이 영상에서 다루는 내용:
- ${keyword}의 현재 상황 분석
- 핵심 포인트 정리
- 실전 적용 방법
- 주의해야 할 점

💡 ${cat.name} 분야에서 꼭 알아야 할 정보를 단계별로 설명드립니다.

📺 영상이 도움이 되셨다면 구독·좋아요 부탁드립니다!

#${keyword.replace(/\s/g, '')} #${cat.name.replace(/[·]/g, '')}

⏰ 챕터:
00:00 인트로
00:30 ${keyword} 개요
03:00 핵심 분석
06:00 실전 적용
09:00 마무리

📩 비즈니스 문의: [이메일 주소]`;

  const tags = [
    keyword.replace(/\s/g, ''),
    cat.name.replace(/[·]/g, ''),
    '2026',
    '트렌드',
    '정보',
    '핵심정리',
    '알고리즘',
    '추천',
  ];
  
  const hashtags = tags.map(t => `#${t}`).join(' ');
  const hashtagsShorts = `#Shorts ${hashtags}`;
  const hashtagsTiktok = `#fyp ${hashtags}`;

  const thumbnailConcept = `[배경] ${cat.name} 관련 임팩트 있는 이미지
[메인 텍스트] "${keyword}" - 큰 글씨, 강조색
[보조 텍스트] 호기심 유발 문구 (예: "이거 모르면 후회!")
[표정] 놀란 표정 또는 진지한 표정
[색상] 빨강·노랑 (클릭률 높은 색상)`;

  const scriptStructure = scenario ? scenario.structure : '문제 제기 → 단서 제공 → 핵심 공개';

  // ============================================================
  // 복사 함수
  // ============================================================
  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
      });
    }
  };

  // ============================================================
  // 플랫폼별 콘텐츠
  // ============================================================
  const getPlatformContent = () => {
    if (activePlatform === 'youtube-long') {
      return {
        title: titles[0],
        description,
        tags: tags.join(', '),
        category: cat.name,
        thumbnail: thumbnailConcept,
      };
    } else if (activePlatform === 'youtube-shorts') {
      return {
        title: `${keyword} 1분 정리 #Shorts`,
        description: `${keyword} 핵심을 1분에 정리했습니다!\n\n${hashtagsShorts}`,
        hashtags: hashtagsShorts,
      };
    } else if (activePlatform === 'tiktok') {
      return {
        caption: `💰 ${keyword} - 1분에 끝!\n${hashtagsTiktok}`,
        hashtags: hashtagsTiktok,
      };
    } else if (activePlatform === 'instagram-reels') {
      return {
        caption: `📊 ${keyword} 핵심 정리\n\n자세한 내용은 프로필 링크에서 확인하세요!\n\n${hashtags}`,
        hashtags,
      };
    }
    return {};
  };

  const content = getPlatformContent();

  return (
    <V11Shell currentStep={4}>
      <style jsx>{`
        .page { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
        
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }

        .header { text-align: center; margin-bottom: 32px; }
        .doneBadge {
          display: inline-block; padding: 6px 14px;
          background: #e8f5e9; color: #2e7d32;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.6; }
        @media (max-width: 600px) { .title { font-size: 24px; } }

        .summary {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 14px 18px;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; color: #555; flex-wrap: wrap;
          justify-content: center;
        }
        .summary strong { color: #1a1a1a; }

        /* 플랫폼 탭 */
        .platformTabs {
          display: flex; gap: 8px; margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .tab {
          padding: 12px 18px; background: #fff;
          border: 2px solid #e5e5e5; border-radius: 12px;
          font-size: 14px; color: #555; font-weight: 600;
          cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.15s;
        }
        .tab:hover { border-color: #c65f3b; color: #c65f3b; }
        .tab.active {
          background: #c65f3b; color: #fff;
          border-color: #c65f3b; font-weight: 700;
        }
        .tabEmoji { font-size: 18px; }

        /* 플랫폼 정보 */
        .platformInfo {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 12px; padding: 16px 20px;
          margin-bottom: 20px; font-size: 12.5px;
          color: #555; display: flex; gap: 18px;
          flex-wrap: wrap; align-items: center;
        }
        .platformInfo strong { color: #1a1a1a; }

        /* 메타데이터 박스 (실제 SNS 입력 화면처럼) */
        .metaBox {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 24px;
          margin-bottom: 16px;
        }
        .fieldHead {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px; padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
        }
        .fieldLabel {
          font-size: 13px; font-weight: 700;
          color: #1a1a1a;
          display: flex; align-items: center; gap: 8px;
        }
        .fieldLabelEn {
          font-size: 11px; color: #888;
          font-weight: 500; margin-left: 4px;
        }
        .copyBtn {
          padding: 6px 12px; background: #fafafa;
          border: 1px solid #e5e5e5; border-radius: 8px;
          font-size: 11.5px; color: #555;
          cursor: pointer; font-family: inherit;
          font-weight: 600; transition: all 0.15s;
        }
        .copyBtn:hover { background: #f0f0f0; border-color: #ccc; }
        .copyBtn.copied {
          background: #e8f5e9; color: #2e7d32;
          border-color: #c8e6c9;
        }
        .charCount {
          font-size: 10.5px; color: #888;
          margin-left: 8px; font-weight: 500;
        }

        /* 입력 영역 (SNS 입력 화면처럼 디자인) */
        .titleItems { display: flex; flex-direction: column; gap: 8px; }
        .titleItem {
          padding: 12px 14px; background: #fafafa;
          border-radius: 8px; font-size: 14px;
          color: #1a1a1a;
          display: flex; align-items: center; gap: 12px;
        }
        .titleNum {
          width: 22px; height: 22px;
          background: #c65f3b; color: #fff;
          border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
        }
        .titleText { flex: 1; }

        .field {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 8px; padding: 14px;
          font-size: 13.5px; color: #1a1a1a;
          line-height: 1.7; white-space: pre-wrap;
          font-family: 'Pretendard Variable', monospace;
        }
        .fieldDesc {
          font-size: 11.5px; color: #888;
          margin-bottom: 10px; line-height: 1.5;
        }

        .tagList { display: flex; flex-wrap: wrap; gap: 6px; }
        .tagItem {
          padding: 6px 12px; background: #fdf1e7;
          color: #c65f3b; border-radius: 100px;
          font-size: 12px; font-weight: 600;
        }

        /* 액션 영역 */
        .actions {
          display: flex; gap: 12px;
          margin-top: 32px; flex-wrap: wrap;
        }
        .actionBtn {
          flex: 1; padding: 14px 24px;
          border-radius: 12px; font-size: 14px;
          font-weight: 700; cursor: pointer;
          font-family: inherit; transition: all 0.2s;
          text-align: center; text-decoration: none;
          min-width: 200px;
        }
        .actionBtn.primary {
          background: #c65f3b; color: #fff;
          border: 1px solid #c65f3b;
        }
        .actionBtn.primary:hover {
          background: #a64a2a;
        }
        .actionBtn.secondary {
          background: #fff; color: #555;
          border: 1px solid #e5e5e5;
        }
        .actionBtn.secondary:hover {
          background: #fafafa; border-color: #ccc;
        }

        .adArea { margin: 32px 0; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <span>완성</span>
        </nav>

        <header className="header">
          <div className="doneBadge">✓ 자료 생성 완료</div>
          <h1 className="title">AI 추천 자료가 준비되었어요</h1>
          <p className="sub">아래 내용을 복사해서 SNS 업로드 시 그대로 붙여넣으세요</p>
        </header>

        <div className="summary">
          <span>{cat.emoji} <strong>{cat.name}</strong></span>
          <span>·</span>
          <span>🎯 <strong>{keyword}</strong></span>
          {scenario && (
            <>
              <span>·</span>
              <span>{scenario.emoji} <strong>{scenario.name}</strong></span>
            </>
          )}
        </div>

        {/* 플랫폼 탭 */}
        <div className="platformTabs">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`tab ${activePlatform === p.id ? 'active' : ''}`}
              onClick={() => setActivePlatform(p.id)}
            >
              <span className="tabEmoji">{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* 플랫폼 정보 */}
        <div className="platformInfo">
          <span><strong>{platform.emoji} {platform.name}</strong></span>
          <span>· 길이: <strong>{platform.durationLabel}</strong></span>
          <span>· 화면: <strong>{platform.orientation}</strong></span>
          <span>· 타겟: <strong>{platform.audience}</strong></span>
        </div>

        {/* YouTube 롱폼 */}
        {activePlatform === 'youtube-long' && (
          <>
            {/* 영상 제목 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📝</span>
                  <span>영상 제목 추천 (3개)</span>
                  <span className="fieldLabelEn">Title</span>
                  <span className="charCount">최대 100자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'titles' ? 'copied' : ''}`}
                  onClick={() => copy(titles.join('\n'), 'titles')}
                >
                  {copied === 'titles' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="fieldDesc">
                사람들이 영상 목록에서 보는 글자입니다. 클릭률을 높이는 제목 3가지를 추천합니다.
              </div>
              <div className="titleItems">
                {titles.map((t, i) => (
                  <div key={i} className="titleItem">
                    <span className="titleNum">{i + 1}</span>
                    <span className="titleText">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 영상 설명 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📄</span>
                  <span>영상 설명</span>
                  <span className="fieldLabelEn">Description</span>
                  <span className="charCount">최대 5,000자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'desc' ? 'copied' : ''}`}
                  onClick={() => copy(description, 'desc')}
                >
                  {copied === 'desc' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="fieldDesc">
                영상 아래 더보기 버튼을 누르면 나오는 설명문입니다. 챕터, 해시태그 포함.
              </div>
              <div className="field">{description}</div>
            </div>

            {/* 광고 */}
            <div className="adArea">
              <AdSlot slot="publish-mid" variant="horizontal" />
            </div>

            {/* 태그 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>🏷️</span>
                  <span>태그</span>
                  <span className="fieldLabelEn">Tags</span>
                  <span className="charCount">최대 500자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'tags' ? 'copied' : ''}`}
                  onClick={() => copy(tags.join(', '), 'tags')}
                >
                  {copied === 'tags' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="fieldDesc">
                검색에 잘 노출되는 키워드들입니다. 쉼표로 구분되어 있어요.
              </div>
              <div className="tagList">
                {tags.map((tag, i) => (
                  <span key={i} className="tagItem">{tag}</span>
                ))}
              </div>
            </div>

            {/* 카테고리 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📁</span>
                  <span>카테고리</span>
                  <span className="fieldLabelEn">Category</span>
                </div>
              </div>
              <div className="field">{cat.name}</div>
            </div>

            {/* 썸네일 콘셉트 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>🖼️</span>
                  <span>썸네일 콘셉트</span>
                  <span className="fieldLabelEn">Thumbnail</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'thumb' ? 'copied' : ''}`}
                  onClick={() => copy(thumbnailConcept, 'thumb')}
                >
                  {copied === 'thumb' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{thumbnailConcept}</div>
            </div>

            {/* 영상 구조 */}
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📋</span>
                  <span>영상 대본 구조</span>
                  <span className="fieldLabelEn">Script Structure</span>
                </div>
              </div>
              <div className="field">{scriptStructure}</div>
            </div>
          </>
        )}

        {/* YouTube Shorts */}
        {activePlatform === 'youtube-shorts' && (
          <>
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📝</span>
                  <span>쇼츠 제목</span>
                  <span className="fieldLabelEn">Shorts Title</span>
                  <span className="charCount">최대 100자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 's-title' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).title || '', 's-title')}
                >
                  {copied === 's-title' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).title}</div>
            </div>

            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📄</span>
                  <span>설명</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 's-desc' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).description || '', 's-desc')}
                >
                  {copied === 's-desc' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).description}</div>
            </div>

            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>#️⃣</span>
                  <span>해시태그</span>
                  <span className="charCount">#Shorts 필수</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 's-tags' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).hashtags || '', 's-tags')}
                >
                  {copied === 's-tags' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).hashtags}</div>
            </div>
          </>
        )}

        {/* TikTok */}
        {activePlatform === 'tiktok' && (
          <>
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📝</span>
                  <span>캡션</span>
                  <span className="fieldLabelEn">Caption</span>
                  <span className="charCount">최대 2,200자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 't-cap' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).caption || '', 't-cap')}
                >
                  {copied === 't-cap' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).caption}</div>
            </div>

            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>#️⃣</span>
                  <span>해시태그</span>
                  <span className="charCount">#fyp 필수</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 't-tags' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).hashtags || '', 't-tags')}
                >
                  {copied === 't-tags' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).hashtags}</div>
            </div>
          </>
        )}

        {/* Instagram Reels */}
        {activePlatform === 'instagram-reels' && (
          <>
            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>📝</span>
                  <span>캡션</span>
                  <span className="fieldLabelEn">Caption</span>
                  <span className="charCount">최대 2,200자</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'r-cap' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).caption || '', 'r-cap')}
                >
                  {copied === 'r-cap' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).caption}</div>
            </div>

            <div className="metaBox">
              <div className="fieldHead">
                <div className="fieldLabel">
                  <span>#️⃣</span>
                  <span>해시태그</span>
                </div>
                <button 
                  className={`copyBtn ${copied === 'r-tags' ? 'copied' : ''}`}
                  onClick={() => copy((content as any).hashtags || '', 'r-tags')}
                >
                  {copied === 'r-tags' ? '✓ 복사됨' : '복사'}
                </button>
              </div>
              <div className="field">{(content as any).hashtags}</div>
            </div>
          </>
        )}

        {/* 액션 */}
        <div className="actions">
          <Link href="/done" className="actionBtn primary">
            ✅ 모두 완료했어요
          </Link>
          <Link href="/create" className="actionBtn secondary">
            🔄 다른 영상 만들기
          </Link>
        </div>

        {/* 광고 */}
        <div className="adArea">
          <AdSlot slot="publish-bottom" variant="horizontal" />
        </div>
      </div>
    </V11Shell>
  );
}
