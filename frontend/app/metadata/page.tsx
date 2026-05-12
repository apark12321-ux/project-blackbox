'use client';
  /**
   * /metadata — YouTube 메타데이터 생성기
   * 실제 백엔드 POST /api/beta/seo 호출 (Gemini 기반)
   * 생성: 제목 2개 · 썸네일 텍스트 2개 · 설명란 · 태그 10-12개
   */
  import { useState } from 'react';
  import { V11Shell } from '../_shared/V11Shell';

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://project-blackbox-production.up.railway.app';

  const CATEGORIES = [
    { key: 'economy', label: '경제·재테크' },
    { key: 'health', label: '건강·의학' },
    { key: 'selfdev', label: '자기계발' },
    { key: 'tech', label: 'IT·기술' },
    { key: 'life', label: '라이프' },
  ];

  interface SeoResult {
    seoTitle: string;
    seoTitleAlt: string;
    thumbnail: string;
    thumbnailAlt: string;
    description: string;
    tags: string[];
  }

  function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };
    return (
      <button
        onClick={copy}
        style={{
          padding: '4px 10px', fontSize: 11, fontWeight: 700,
          background: copied ? '#16a34a' : '#f0f0f0',
          color: copied ? '#fff' : '#555',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        {copied ? '✓ 복사됨' : '복사'}
      </button>
    );
  }

  export default function MetadataPage() {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('economy');
    const [seniorMode, setSeniorMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<SeoResult | null>(null);

    const handleGenerate = async () => {
      if (!keyword.trim()) return;
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const res = await fetch(`${API_BASE}/api/beta/seo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: keyword.trim(), category, senior_mode: seniorMode }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `API 오류 (${res.status})`);
          return;
        }
        setResult(json.data);
      } catch (e) {
        setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <V11Shell>
        <style jsx>{`
          .page { max-width: 860px; margin: 0 auto; padding: 40px 24px 60px; }
          .header { margin-bottom: 28px; }
          .badge {
            display: inline-block; padding: 5px 12px;
            background: #fdf1e7; color: #c65f3b;
            border-radius: 100px; font-size: 11px; font-weight: 800;
            margin-bottom: 10px; letter-spacing: 0.05em;
          }
          .title { font-size: 26px; font-weight: 800; color: #1a1a1a; margin: 0 0 6px; letter-spacing: -0.02em; }
          .sub { font-size: 14px; color: #666; line-height: 1.6; }
          .formCard {
            background: #fff; border: 1px solid #e5e5e5;
            border-radius: 14px; padding: 24px; margin-bottom: 24px;
          }
          .formRow { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
          .kwInput {
            flex: 1; min-width: 200px; padding: 12px 16px;
            border: 1.5px solid #e5e5e5; border-radius: 10px;
            font-size: 15px; font-family: inherit; color: #1a1a1a;
            transition: border-color 0.15s;
          }
          .kwInput:focus { outline: none; border-color: #c65f3b; }
          .kwInput::placeholder { color: #aaa; }
          .catSelect {
            padding: 12px 14px; border: 1.5px solid #e5e5e5;
            border-radius: 10px; font-size: 14px; font-family: inherit;
            color: #1a1a1a; background: #fff; cursor: pointer;
          }
          .catSelect:focus { outline: none; border-color: #c65f3b; }
          .seniorRow {
            display: flex; align-items: center; gap: 10px;
            margin-bottom: 16px; font-size: 13px; color: #555;
          }
          .toggle {
            width: 40px; height: 22px; background: #e5e5e5;
            border-radius: 999px; cursor: pointer; position: relative;
            transition: background 0.2s; border: none; flex-shrink: 0;
          }
          .toggle.on { background: #c65f3b; }
          .toggleKnob {
            position: absolute; top: 3px; left: 3px;
            width: 16px; height: 16px; background: #fff;
            border-radius: 50%; transition: left 0.2s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          }
          .toggle.on .toggleKnob { left: 21px; }
          .genBtn {
            width: 100%; padding: 13px; background: #c65f3b; color: #fff;
            border: none; border-radius: 10px; font-size: 15px;
            font-weight: 800; cursor: pointer; font-family: inherit;
            transition: background 0.15s;
          }
          .genBtn:hover:not(:disabled) { background: #a84e2f; }
          .genBtn:disabled { background: #ccc; cursor: not-allowed; }
          .loadingBox {
            text-align: center; padding: 48px; color: #888; font-size: 14px;
          }
          .spinner {
            width: 28px; height: 28px; border: 3px solid #f0f0f0;
            border-top-color: #c65f3b; border-radius: 50%;
            animation: spin 0.8s linear infinite; margin: 0 auto 12px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .errorBox {
            background: #fef2f2; border: 1px solid #fca5a5;
            border-radius: 10px; padding: 14px 16px;
            color: #b91c1c; font-size: 13px;
          }
          .resultSection { display: flex; flex-direction: column; gap: 16px; }
          .resultCard {
            background: #fff; border: 1px solid #e5e5e5;
            border-radius: 12px; padding: 20px;
          }
          .resultLabel {
            font-size: 11px; font-weight: 800; color: #888;
            letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;
          }
          .resultRow {
            display: flex; align-items: flex-start;
            gap: 10px; margin-bottom: 10px; padding-bottom: 10px;
            border-bottom: 1px solid #f5f5f5;
          }
          .resultRow:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .resultText {
            flex: 1; font-size: 14px; color: #1a1a1a; line-height: 1.6; font-weight: 500;
          }
          .tagList { display: flex; flex-wrap: wrap; gap: 7px; }
          .tag {
            padding: 4px 10px; background: #f5f5f5;
            border-radius: 6px; font-size: 12px; color: #555;
          }
          .tagsAllBtn {
            margin-top: 12px; display: flex; align-items: center; gap: 8px;
          }
        `}</style>

        <div className="page">
          <div className="header">
            <div className="badge">📋 무료 도구</div>
            <h1 className="title">YouTube 메타데이터 생성기</h1>
            <p className="sub">
              키워드를 입력하면 AI가 YouTube 알고리즘에 최적화된<br />
              제목·썸네일 텍스트·설명란·태그를 5초 안에 만들어드립니다.
            </p>
          </div>

          <div className="formCard">
            <div className="formRow">
              <input
                className="kwInput"
                placeholder="예: 2026 금리 전망, 시니어 건강 관리..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                maxLength={60}
              />
              <select
                className="catSelect"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="seniorRow">
              <button
                className={`toggle ${seniorMode ? 'on' : ''}`}
                onClick={() => setSeniorMode((v) => !v)}
                aria-label="시니어 모드 토글"
              >
                <div className="toggleKnob" />
              </button>
              <span>시니어 채널 최적화 (50-70대 타겟 키워드 패턴 적용)</span>
            </div>

            <button
              className="genBtn"
              onClick={handleGenerate}
              disabled={!keyword.trim() || loading}
            >
              {loading ? '생성 중...' : '▶ 메타데이터 생성'}
            </button>
          </div>

          {loading && (
            <div className="loadingBox">
              <div className="spinner" />
              AI가 메타데이터를 최적화하는 중입니다 (약 5초)...
            </div>
          )}

          {error && <div className="errorBox">⚠️ {error}</div>}

          {result && (
            <div className="resultSection">
              {/* 제목 */}
              <div className="resultCard">
                <div className="resultLabel">📌 YouTube 제목 (CTR 최적화)</div>
                <div className="resultRow">
                  <div className="resultText">{result.seoTitle}</div>
                  <CopyBtn text={result.seoTitle} />
                </div>
                <div className="resultRow">
                  <div className="resultText" style={{ color: '#666' }}>
                    대안: {result.seoTitleAlt}
                  </div>
                  <CopyBtn text={result.seoTitleAlt} />
                </div>
              </div>

              {/* 썸네일 */}
              <div className="resultCard">
                <div className="resultLabel">🖼️ 썸네일 텍스트</div>
                <div className="resultRow">
                  <div className="resultText" style={{ fontWeight: 800, fontSize: 16 }}>
                    {result.thumbnail.replace(/\\n/g, ' / ')}
                  </div>
                  <CopyBtn text={result.thumbnail} />
                </div>
                {result.thumbnailAlt && (
                  <div className="resultRow">
                    <div className="resultText" style={{ color: '#666' }}>
                      대안: {result.thumbnailAlt.replace(/\\n/g, ' / ')}
                    </div>
                    <CopyBtn text={result.thumbnailAlt} />
                  </div>
                )}
              </div>

              {/* 설명란 */}
              <div className="resultCard">
                <div className="resultLabel">📝 설명란 초안</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <pre style={{
                    flex: 1, fontSize: 13, color: '#333', lineHeight: 1.7,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    background: '#fafafa', borderRadius: 8, padding: 14, margin: 0,
                    fontFamily: 'inherit',
                  }}>
                    {result.description}
                  </pre>
                  <CopyBtn text={result.description} />
                </div>
              </div>

              {/* 태그 */}
              <div className="resultCard">
                <div className="resultLabel">🔖 SEO 태그 ({result.tags.length}개)</div>
                <div className="tagList">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="tagsAllBtn">
                  <CopyBtn text={result.tags.join(', ')} />
                  <span style={{ fontSize: 12, color: '#888' }}>태그 전체 복사</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </V11Shell>
    );
  }
  