// Vercel 서버리스 함수: 전체 방문자 조회수 합산 카운터 (Upstash Redis)
// 환경변수 UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN 미설정 시 조회수 숨김(가짜 숫자 없음)

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function configured(): boolean {
  return !!(REDIS_URL && REDIS_TOKEN);
}

// Upstash REST 호출 (단일 커맨드)
async function redis(command: string[]): Promise<any> {
  const res = await fetch(REDIS_URL as string, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const data = await res.json();
  return data.result;
}

function sanitize(id: string): string {
  return (id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  // 카운터 미설정 시: 조회수 기능 비활성 (사이트는 정상, 가짜 숫자 없음)
  if (!configured()) {
    res.status(200).json({ enabled: false });
    return;
  }

  try {
    const method = req.method || 'GET';

    // POST: 조회수 1 증가 후 반환
    if (method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const id = sanitize(body?.id);
      if (!id) { res.status(400).json({ error: 'id required' }); return; }
      const views = await redis(['INCR', `views:${id}`]);
      res.status(200).json({ id, views: Number(views) });
      return;
    }

    // GET ?ids=a,b,c : 여러 글 조회수 한 번에 (증가 없음)
    const ids = req.query?.ids;
    if (ids) {
      const list = String(ids).split(',').map(sanitize).filter(Boolean).slice(0, 100);
      if (!list.length) { res.status(200).json({ views: {} }); return; }
      const keys = list.map((x) => `views:${x}`);
      const results = await redis(['MGET', ...keys]);
      const out: Record<string, number> = {};
      list.forEach((x, i) => { out[x] = Number(results?.[i] || 0); });
      res.status(200).json({ views: out });
      return;
    }

    // GET ?id=a : 단일 글 조회수 읽기 (증가 없음)
    const id = sanitize(req.query?.id);
    if (!id) { res.status(400).json({ error: 'id required' }); return; }
    const views = await redis(['GET', `views:${id}`]);
    res.status(200).json({ id, views: Number(views || 0) });
  } catch (e: any) {
    // 오류 시에도 사이트에 영향 없도록 enabled:false 반환
    res.status(200).json({ enabled: false, error: String(e?.message || e) });
  }
}
