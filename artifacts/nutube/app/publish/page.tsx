import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '메타데이터 생성기 (점검 중)',
  description: 'NuTube 메타데이터 생성기 - 시스템 개편 중입니다.',
  robots: { index: false, follow: false },
};

export default function PublishPage() {
  return (
    <div className="nt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🛠️</div>
      <h1>메타데이터 생성기 점검 중</h1>
      <p className="nt-lead" style={{ maxWidth: 560, margin: '0 auto 32px' }}>
        더 빠르고 안정적인 환경으로 옮기는 작업을 진행하고 있습니다. 곧 다시 사용하실 수 있도록 준비 중입니다.
      </p>

      <div style={{
        display: 'inline-block', textAlign: 'left',
        background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 16,
        padding: '24px 32px', marginBottom: 40,
      }}>
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
          기존 사용자께서는 잠시만 기다려주세요.<br />
          메타데이터 생성기 관련 문의는<br />
          <a href={`mailto:${SITE.operator.email}`} style={{ color: '#4f46e5', fontWeight: 600 }}>{SITE.operator.email}</a>로 부탁드립니다.
        </p>
      </div>

      <div>
        <Link href="/blog" style={{
          display: 'inline-block', padding: '12px 24px',
          background: '#4f46e5', color: '#fff',
          fontSize: 15, fontWeight: 700, borderRadius: 999,
        }}>
          그동안 가이드 보러 가기 →
        </Link>
      </div>
    </div>
  );
}
