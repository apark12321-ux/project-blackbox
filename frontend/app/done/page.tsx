'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { V10Shell, getV10Project, clearV10Project } from '../_shared/V10Shell';
import styles from './done.module.css';

export default function DonePage() {
  const router = useRouter();
  const [project, setProject] = useState<any>({});
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const p = getV10Project();
    if (!p.keyword) {
      router.replace('/create');
      return;
    }
    setProject(p);
  }, [router]);

  const keyword = project.keyword || '';
  const categoryLabel = project.categoryLabel || '';

  // 시연용 콘텐츠 생성
  const seoTitle = `${keyword} 위험한 3가지 신호 | 모르면 당합니다 (2026)`;
  const seoDescription = `${keyword}에 관심 있으신 분이라면 꼭 확인하세요.\n\n이 영상에서 다루는 내용:\n✔ 실제 전문가가 경고하는 3가지 위험 신호\n✔ 2026년 최신 데이터 기반 분석\n✔ ${categoryLabel} 분야 초보자도 쉽게 이해\n\n도움이 되셨다면 구독과 좋아요 부탁드립니다!\n\n#${keyword.replace(/\s/g, '')} #${categoryLabel} #2026 #YouTube`;
  const tags = [keyword, categoryLabel, '2026', '트렌드', '분석', '가이드', '초보자', '실전', '꿀팁', '정보', 'YouTube', '유튜브'];

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {}
  };

  const handleUpload = () => {
    setUploadState('uploading');
    setTimeout(() => setUploadState('done'), 3000);
  };

  const handleNew = () => {
    clearV10Project();
    router.push('/create');
  };

  return (
    <V10Shell step={5} title="완성 & 다운로드" showStepDots={true}>
      <div className={styles.container}>
        <div className={styles.stepBar}>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>카테고리</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>키워드</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>설정</span>
          </span>
          <span className={styles.stepBarArrow}>›</span>
          <span className={styles.stepBarItem}>
            <span className={`${styles.stepBarNum} ${styles.stepBarDone}`}>✓</span>
            <span>자동 생성</span>
          </span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroEmoji}>🎉</div>
          <h1 className={styles.heroTitle}>영상 제작 완료!</h1>
          <p className={styles.heroSub}>
            <strong>"{keyword}"</strong> 주제의 10분 분량 YouTube 영상이 준비되었습니다
          </p>
          <div className={styles.heroMeta}>
            <span>🎬 1920×1080</span>
            <span>•</span>
            <span>⏱️ 10분 12초</span>
            <span>•</span>
            <span>💾 142 MB</span>
            <span>•</span>
            <span className={styles.heroBadge}>수익화 안전도 A+ (92/100)</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* 좌측 · 영상 미리보기 + 다운로드 */}
          <div className={styles.leftCol}>
            <div className={styles.videoCard}>
              <div className={styles.thumbnail}>
                <div className={styles.thumbnailOverlay}>
                  <span className={styles.playBtn}>▶</span>
                </div>
                <div className={styles.thumbnailTxt}>
                  <div className={styles.thumbnailMain}>{keyword.split(' ').slice(0, 2).join(' ')}</div>
                  <div className={styles.thumbnailSub}>위험한 3가지 신호</div>
                </div>
                <div className={styles.thumbnailBadge}>10:12</div>
              </div>

              <div className={styles.videoActions}>
                <button className={styles.downloadBtn}>
                  <span>⬇️</span>
                  <span>영상 MP4 다운로드</span>
                  <span className={styles.downloadSize}>142 MB</span>
                </button>
                <div className={styles.subActions}>
                  <button className={styles.subBtn}>🎤 음성만 MP3</button>
                  <button className={styles.subBtn}>📄 대본 TXT</button>
                  <button className={styles.subBtn}>🎨 썸네일 PNG</button>
                </div>
              </div>
            </div>

            {/* YouTube 업로드 */}
            <div className={styles.uploadCard}>
              <div className={styles.uploadHead}>
                <div className={styles.youtubeLogo}>
                  <span className={styles.ytPlay}>▶</span>
                  <span>YouTube</span>
                </div>
                <div className={styles.uploadStatus}>
                  {uploadState === 'idle' && '연결 대기'}
                  {uploadState === 'uploading' && '업로드 중...'}
                  {uploadState === 'done' && '업로드 완료 ✓'}
                </div>
              </div>

              {uploadState === 'idle' && (
                <button className={styles.uploadBtn} onClick={handleUpload}>
                  <span>🚀</span>
                  <span>YouTube에 바로 업로드</span>
                </button>
              )}

              {uploadState === 'uploading' && (
                <div className={styles.uploadProgress}>
                  <div className={styles.uploadBar}>
                    <div className={styles.uploadBarFill} />
                  </div>
                  <div className={styles.uploadHint}>영상을 YouTube에 전송하고 있습니다...</div>
                </div>
              )}

              {uploadState === 'done' && (
                <div className={styles.uploadDone}>
                  <div className={styles.uploadDoneIcon}>✓</div>
                  <div>
                    <div className={styles.uploadDoneTitle}>업로드 완료</div>
                    <a href="#" className={styles.uploadDoneLink}>https://youtube.com/watch?v=abc123 →</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 우측 · SEO 정보 */}
          <div className={styles.rightCol}>
            <div className={styles.seoCard}>
              <div className={styles.seoHead}>
                <span>🎯</span>
                <span>YouTube SEO 2026</span>
                <span className={styles.seoGrade}>A+</span>
              </div>

              <div className={styles.seoField}>
                <div className={styles.seoLabel}>
                  제목 <span className={styles.seoCount}>{seoTitle.length}/60</span>
                </div>
                <div className={styles.seoValue}>
                  {seoTitle}
                  <button className={styles.copyBtn} onClick={() => handleCopy(seoTitle, 'title')}>
                    {copiedField === 'title' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div className={styles.seoField}>
                <div className={styles.seoLabel}>
                  설명 <span className={styles.seoCount}>{seoDescription.length}자</span>
                </div>
                <div className={styles.seoValueLong}>
                  {seoDescription}
                  <button className={styles.copyBtn} onClick={() => handleCopy(seoDescription, 'desc')}>
                    {copiedField === 'desc' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div className={styles.seoField}>
                <div className={styles.seoLabel}>
                  태그 <span className={styles.seoCount}>{tags.length}개</span>
                </div>
                <div className={styles.tags}>
                  {tags.map((t, i) => (
                    <span key={i} className={styles.tag}>#{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.seoMetrics}>
                <div className={styles.metric}>
                  <div className={styles.metricVal} style={{ color: '#16a34a' }}>92</div>
                  <div className={styles.metricLabel}>안전도</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricVal} style={{ color: '#d4a537' }}>$18</div>
                  <div className={styles.metricLabel}>예상 CPM</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricVal}>87%</div>
                  <div className={styles.metricLabel}>CTR 예상</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricVal}>A+</div>
                  <div className={styles.metricLabel}>블루오션</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.newBtn} onClick={handleNew}>
            <span>✨</span>
            <span>새 영상 만들기</span>
          </button>
        </div>
      </div>
    </V10Shell>
  );
}
