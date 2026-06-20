import Link from 'next/link';
import { CATEGORIES, CATEGORY_KEYS, SITE } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';

export const revalidate = 60;

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function readMinutes(body: string): number {
  return Math.max(1, Math.round(body.length / 500));
}

function isNew(iso: string): boolean {
  const d = new Date(iso).getTime();
  return Date.now() - d < 1000 * 60 * 60 * 24 * 4; // 4일 이내
}

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 6);
  const trendingPosts = allPosts.slice(0, 3); // 상위 3개를 "이번 주 인기"로

  // 카테고리별 글 수
  const catCounts: Record<string, number> = {};
  for (const p of allPosts) catCounts[p.category] = (catCounts[p.category] || 0) + 1;

  return (
    <div className="nt-home">
      {/* ===== HERO ===== */}
      <section className="nt-hero">
        <div className="nt-hero-glow" />
        <div className="nt-hero-inner">
          <div className="nt-hero-badge">
            <span className="dot" /> 매일 업데이트되는 유튜브 운영 인사이트
          </div>
          <h1>
            유튜브, 감으로 하지 마세요.<br/>
            <span className="grad">데이터로 키우세요.</span>
          </h1>
          <p>
            알고리즘 · 시니어 사연 쇼츠 · AI 도구 · 수익화까지,<br/>
            실전에서 검증된 노하우를 한곳에 모았습니다.
          </p>

          <div className="nt-hero-actions">
            <Link href="/publish" className="nt-btn-primary">⚡ 메타데이터 생성기 써보기</Link>
            <Link href="/blog" className="nt-btn-ghost">가이드 둘러보기 →</Link>
          </div>

          <div className="nt-hero-stats">
            <div className="stat">
              <strong>{allPosts.length}</strong>
              <span>실전 가이드</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>4</strong>
              <span>전문 분야</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>100%</strong>
              <span>공식 출처 검증</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 카테고리 ===== */}
      <section className="nt-section">
        <div className="nt-section-head">
          <h2>무엇이 궁금하세요?</h2>
          <p>관심 분야를 골라 바로 들어가 보세요.</p>
        </div>
        <div className="nt-cat-grid">
          {CATEGORY_KEYS.map((key, i) => {
            const cat = CATEGORIES[key];
            return (
              <Link
                key={key}
                href={`/category/${key}`}
                className="nt-cat-card"
                style={{ ['--cat-grad' as any]: cat.gradient, ['--delay' as any]: `${i * 0.08}s` }}
              >
                <div className="nt-cat-icon">{cat.icon}</div>
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
                <div className="nt-cat-foot">
                  <span className="nt-cat-count">{catCounts[key] || 0}개 가이드</span>
                  <span className="nt-cat-arrow">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== 이번 주 인기 (랭킹) ===== */}
      {trendingPosts.length > 0 && (
        <section className="nt-section">
          <div className="nt-section-head">
            <h2>🔥 지금 인기 있는 가이드</h2>
            <p>크리에이터들이 가장 많이 찾는 글이에요.</p>
          </div>
          <div className="nt-rank-list">
            {trendingPosts.map((post, i) => {
              const cat = CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="nt-rank-item">
                  <div className="nt-rank-num" style={{ color: cat.color }}>{String(i + 1).padStart(2, '0')}</div>
                  <div className="nt-rank-body">
                    <span className="nt-rank-cat" style={{ background: cat.bgLight, color: cat.color }}>
                      {cat.icon} {cat.label}
                    </span>
                    <h3>{post.title}</h3>
                    <div className="nt-rank-meta">
                      {formatDate(post.publishedAt)} · {readMinutes(post.body)}분 읽기
                    </div>
                  </div>
                  <div className="nt-rank-arrow">→</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== 최신 가이드 ===== */}
      <section className="nt-section">
        <div className="nt-section-head">
          <h2>최신 가이드</h2>
          <p>방금 올라온 따끈한 글들입니다.</p>
        </div>
        <div className="nt-post-grid">
          {recentPosts.map((post, i) => {
            const cat = CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.algorithm;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="nt-post-card"
                style={{ ['--delay' as any]: `${i * 0.06}s` }}
              >
                <div className="nt-post-thumb" style={{ background: cat.gradient }}>
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} loading="lazy" />
                  ) : (
                    <span className="nt-post-thumb-icon">{cat.icon}</span>
                  )}
                  {isNew(post.publishedAt) && <span className="nt-badge-new">NEW</span>}
                </div>
                <div className="nt-post-body">
                  <span className="nt-post-cat" style={{ color: cat.color }}>{cat.icon} {cat.label}</span>
                  <h3>{post.title}</h3>
                  <div className="nt-post-meta">{formatDate(post.publishedAt)} · {readMinutes(post.body)}분</div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="nt-section-foot">
          <Link href="/blog" className="nt-btn-ghost dark">모든 가이드 보기 →</Link>
        </div>
      </section>

      {/* ===== 도구 CTA 배너 ===== */}
      <section className="nt-tool-banner-wrap">
        <div className="nt-tool-banner">
          <div className="nt-tool-banner-glow" />
          <div className="nt-tool-banner-content">
            <div className="nt-tool-tag">⚡ 무료 도구</div>
            <h2>제목·설명·태그를 5초 만에</h2>
            <p>키워드만 입력하면 알고리즘에 최적화된 메타데이터를 자동 생성합니다.</p>
            <Link href="/publish" className="nt-btn-primary lg">지금 만들어보기 →</Link>
          </div>
        </div>
      </section>

      <style>{`
        .nt-home {
          background: #0d1117;
          color: #e6edf3;
          min-height: 100vh;
        }

        /* HERO */
        .nt-hero {
          position: relative; overflow: hidden;
          padding: 100px 20px 80px; text-align: center;
        }
        .nt-hero-glow {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 600px;
          background: radial-gradient(circle, rgba(132,204,22,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .nt-hero-inner { position: relative; max-width: 820px; margin: 0 auto; }
        .nt-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px; border-radius: 999px;
          background: rgba(132,204,22,0.1); border: 1px solid rgba(132,204,22,0.25);
          font-size: 13px; font-weight: 600; color: #bef264;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }
        .nt-hero-badge .dot {
          width: 7px; height: 7px; border-radius: 50%; background: #84cc16;
          box-shadow: 0 0 8px #84cc16;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        .nt-hero h1 {
          font-size: 52px; font-weight: 900; letter-spacing: -0.04em;
          line-height: 1.12; margin: 0 0 24px; color: #fff;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .nt-hero h1 .grad {
          background: linear-gradient(120deg, #d9f99d 0%, #84cc16 50%, #4ade80 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nt-hero p {
          font-size: 18px; line-height: 1.7; color: rgba(230,237,243,0.65);
          margin: 0 0 36px; animation: fadeUp 0.6s ease 0.2s both;
        }
        .nt-hero-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 56px; animation: fadeUp 0.6s ease 0.3s both;
        }
        .nt-btn-primary {
          padding: 14px 28px; border-radius: 999px;
          background: linear-gradient(135deg, #84cc16 0%, #4ade80 100%);
          color: #0d1117; font-size: 15.5px; font-weight: 800;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 6px 24px rgba(132,204,22,0.4);
        }
        .nt-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(132,204,22,0.55); color: #0d1117; }
        .nt-btn-primary.lg { padding: 16px 36px; font-size: 16.5px; }
        .nt-btn-ghost {
          padding: 14px 24px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          color: #e6edf3; font-size: 15.5px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .nt-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .nt-btn-ghost.dark { display: inline-block; }

        .nt-hero-stats {
          display: inline-flex; align-items: center; gap: 28px;
          padding: 20px 36px; border-radius: 18px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          animation: fadeUp 0.6s ease 0.4s both;
        }
        .nt-hero-stats .stat { display: flex; flex-direction: column; align-items: center; }
        .nt-hero-stats .stat strong {
          font-size: 32px; font-weight: 900; color: #fff; line-height: 1;
          background: linear-gradient(120deg, #fff, #bef264);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .nt-hero-stats .stat span { font-size: 12.5px; color: rgba(230,237,243,0.55); margin-top: 6px; }
        .nt-hero-stats .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

        /* SECTION */
        .nt-section { max-width: 1200px; margin: 0 auto; padding: 64px 20px; }
        .nt-section-head { margin-bottom: 36px; }
        .nt-section-head h2 {
          font-size: 30px; font-weight: 900; color: #fff; margin: 0 0 8px;
          letter-spacing: -0.025em;
        }
        .nt-section-head p { font-size: 15px; color: rgba(230,237,243,0.55); margin: 0; }
        .nt-section-foot { text-align: center; margin-top: 40px; }

        /* CATEGORY CARDS */
        .nt-cat-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
        }
        @media(max-width: 768px){ .nt-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        .nt-cat-card {
          position: relative; overflow: hidden;
          padding: 26px 22px; border-radius: 18px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none; color: #fff;
          transition: all 0.25s; min-height: 190px;
          display: flex; flex-direction: column;
          animation: fadeUp 0.5s ease var(--delay, 0s) both;
        }
        .nt-cat-card::before {
          content: ''; position: absolute; inset: 0;
          background: var(--cat-grad); opacity: 0;
          transition: opacity 0.25s; z-index: 0;
        }
        .nt-cat-card:hover {
          transform: translateY(-6px); border-color: transparent;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
          color: #fff;
        }
        .nt-cat-card:hover::before { opacity: 1; }
        .nt-cat-card > * { position: relative; z-index: 1; }
        .nt-cat-icon { font-size: 36px; margin-bottom: 14px; transition: transform 0.25s; }
        .nt-cat-card:hover .nt-cat-icon { transform: scale(1.15) rotate(-5deg); }
        .nt-cat-card h3 { font-size: 17px; font-weight: 800; margin: 0 0 8px; }
        .nt-cat-card p {
          font-size: 12.5px; line-height: 1.5; margin: 0;
          color: rgba(255,255,255,0.6); flex: 1;
        }
        .nt-cat-card:hover p { color: rgba(255,255,255,0.9); }
        .nt-cat-foot {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .nt-cat-count { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); }
        .nt-cat-arrow { font-size: 16px; transition: transform 0.2s; }
        .nt-cat-card:hover .nt-cat-arrow { transform: translateX(4px); }

        /* RANK LIST */
        .nt-rank-list { display: flex; flex-direction: column; gap: 12px; }
        .nt-rank-item {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px; border-radius: 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none; transition: all 0.2s;
        }
        .nt-rank-item:hover {
          background: rgba(255,255,255,0.06); transform: translateX(6px);
          border-color: rgba(255,255,255,0.15);
        }
        .nt-rank-num {
          font-size: 32px; font-weight: 900; line-height: 1;
          min-width: 48px; font-variant-numeric: tabular-nums;
        }
        .nt-rank-body { flex: 1; min-width: 0; }
        .nt-rank-cat {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700; margin-bottom: 8px;
        }
        .nt-rank-body h3 {
          font-size: 16.5px; font-weight: 700; color: #fff; margin: 0 0 6px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
        }
        .nt-rank-meta { font-size: 12.5px; color: rgba(230,237,243,0.5); }
        .nt-rank-arrow {
          font-size: 20px; color: rgba(255,255,255,0.3); transition: all 0.2s;
        }
        .nt-rank-item:hover .nt-rank-arrow { color: #84cc16; transform: translateX(4px); }

        /* POST GRID */
        .nt-post-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
        }
        @media(max-width: 900px){ .nt-post-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 600px){ .nt-post-grid { grid-template-columns: 1fr; } }
        .nt-post-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; overflow: hidden; text-decoration: none;
          transition: all 0.25s;
          animation: fadeUp 0.5s ease var(--delay, 0s) both;
        }
        .nt-post-card:hover {
          transform: translateY(-6px); border-color: rgba(132,204,22,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .nt-post-thumb {
          position: relative; aspect-ratio: 16/9; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .nt-post-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .nt-post-thumb-icon { font-size: 52px; }
        .nt-badge-new {
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px; border-radius: 999px;
          background: #ef4444; color: #fff; font-size: 10.5px; font-weight: 800;
          letter-spacing: 0.05em; box-shadow: 0 2px 8px rgba(239,68,68,0.5);
        }
        .nt-post-body { padding: 18px 20px 20px; }
        .nt-post-cat { font-size: 12px; font-weight: 700; }
        .nt-post-body h3 {
          font-size: 16px; font-weight: 700; color: #fff; margin: 8px 0;
          line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .nt-post-meta { font-size: 12px; color: rgba(230,237,243,0.45); }

        /* TOOL BANNER */
        .nt-tool-banner-wrap { max-width: 1200px; margin: 0 auto; padding: 32px 20px 96px; }
        .nt-tool-banner {
          position: relative; overflow: hidden;
          padding: 64px 40px; border-radius: 28px; text-align: center;
          background: linear-gradient(135deg, #1a2332 0%, #0f1722 100%);
          border: 1px solid rgba(132,204,22,0.2);
        }
        .nt-tool-banner-glow {
          position: absolute; bottom: -150px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(circle, rgba(132,204,22,0.2) 0%, transparent 65%);
        }
        .nt-tool-banner-content { position: relative; z-index: 1; }
        .nt-tool-tag {
          display: inline-block; padding: 6px 16px; border-radius: 999px;
          background: rgba(132,204,22,0.15); color: #bef264;
          font-size: 13px; font-weight: 700; margin-bottom: 18px;
        }
        .nt-tool-banner h2 {
          font-size: 34px; font-weight: 900; color: #fff; margin: 0 0 14px;
          letter-spacing: -0.03em;
        }
        .nt-tool-banner p {
          font-size: 16px; color: rgba(230,237,243,0.65); margin: 0 0 28px;
          line-height: 1.6;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width: 640px){
          .nt-hero { padding: 64px 16px 56px; }
          .nt-hero h1 { font-size: 34px; }
          .nt-hero p { font-size: 15.5px; }
          .nt-hero-stats { gap: 18px; padding: 16px 22px; }
          .nt-hero-stats .stat strong { font-size: 26px; }
          .nt-section { padding: 48px 16px; }
          .nt-section-head h2 { font-size: 24px; }
          .nt-rank-item { padding: 16px; gap: 14px; }
          .nt-rank-num { font-size: 26px; min-width: 38px; }
          .nt-tool-banner { padding: 44px 24px; }
          .nt-tool-banner h2 { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}
