import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '공지사항',
  description: 'NuTube 공지사항입니다.',
};

const NOTICES = [
  {
    date: '2026-05-18',
    title: 'NuTube 정식 오픈',
    body: '유튜브 채널 운영자를 위한 실전 가이드 미디어 NuTube가 정식 오픈했습니다. 알고리즘, 시니어 사연 쇼츠, AI 도구, 영상 채널 수익화 네 가지 카테고리에서 가이드를 제공합니다.',
  },
  {
    date: '2026-05-18',
    title: '콘텐츠 운영 원칙 안내',
    body: 'NuTube의 모든 가이드는 공식 출처 우선, 사실 검증, 실전 적용 가능성을 기준으로 작성됩니다. 자세한 내용은 소개 페이지에서 확인하실 수 있습니다.',
  },
  {
    date: '2026-05-18',
    title: '독자 의견 환영',
    body: '가이드 내용 중 정정이 필요한 부분이나 추가로 다뤄주셨으면 하는 주제가 있다면 ' + SITE.operator.email + ' 로 보내주세요. 의견은 편집팀이 직접 확인합니다.',
  },
];

export default function AnnouncementPage() {
  return (
    <div className="nt-page">
      <h1>공지사항</h1>
      <p className="nt-lead">NuTube 운영과 관련된 안내사항을 모았습니다.</p>

      <div style={{ marginTop: 32, display: 'grid', gap: 16 }}>
        {NOTICES.map((notice, i) => (
          <article key={i} style={{
            border: '1px solid #e5e7eb', borderRadius: 12,
            padding: 24, background: '#fff',
          }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{notice.date}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>{notice.title}</h3>
            <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{notice.body}</p>
          </article>
        ))}
      </div>

      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 32 }}>
        최신 공지는 본 페이지에 가장 위에 게시됩니다.
      </p>
    </div>
  );
}
