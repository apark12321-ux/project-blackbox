import { ImageResponse } from 'next/og';

// ============================================================
// AlgoMaker - Open Graph Image (React로 자동 생성!)
// 
// 박예준 확정: React로 OG 이미지 만들기
// 빌드 시 자동으로 1200x630 PNG 생성
// URL: /opengraph-image
// 카카오톡, 슬랙, 페이스북 공유 시 자동 표시
// ============================================================

export const runtime = 'edge';
export const alt = 'AlgoMaker - AI가 만드는 유튜브 영상, 알고리즘이 작동합니다';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1230 0%, #2a1f4d 50%, #0a0518 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* 배경 글로우 효과 */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            right: '-200px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* 큰 구슬볼 (오른쪽 아래) */}
        <div
          style={{
            position: 'absolute',
            right: '-80px',
            bottom: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.5), rgba(138, 43, 226, 0.5) 30%, rgba(75, 0, 130, 0.6) 60%, rgba(20, 10, 40, 0.8) 100%)',
            boxShadow: '0 0 100px rgba(255, 215, 0, 0.4), inset -40px -40px 80px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {/* 구슬 안 텍스트 */}
          <div
            style={{
              fontSize: '90px',
              fontWeight: 900,
              color: '#ffd700',
              fontFamily: 'serif',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
              display: 'flex',
            }}
          >
            +280%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(245, 241, 234, 0.85)',
              letterSpacing: '0.3em',
              fontWeight: 700,
              marginTop: '8px',
              display: 'flex',
            }}
          >
            VIRAL BOOST
          </div>
        </div>

        {/* 코너 장식 */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            fontSize: '36px',
            color: '#ffd700',
            opacity: 0.5,
            display: 'flex',
          }}
        >
          ❦
        </div>
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            fontSize: '36px',
            color: '#ffd700',
            opacity: 0.5,
            display: 'flex',
          }}
        >
          ❦
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            fontSize: '36px',
            color: '#ffd700',
            opacity: 0.5,
            display: 'flex',
          }}
        >
          ❦
        </div>

        {/* 메인 콘텐츠 (왼쪽) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: '700px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* 경고 배지 */}
          <div
            style={{
              padding: '10px 28px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              borderRadius: '100px',
              color: '#ffd700',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.3em',
              marginBottom: '32px',
              display: 'flex',
            }}
          >
            ⚠️ 99% 모르는 진실
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              fontSize: '78px',
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#f5f1ea',
              letterSpacing: '-0.025em',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex' }}>AI 영상도 알고리즘</div>
            <div style={{ display: 'flex', color: '#ffd700', fontStyle: 'italic', fontFamily: 'serif' }}>
              없이는 묻힙니다.
            </div>
          </div>

          {/* 서브타이틀 */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(245, 241, 234, 0.85)',
              lineHeight: 1.5,
              marginBottom: '40px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex' }}>AlgoMaker가 베일 너머의 알고리즘을</div>
            <div style={{ display: 'flex', color: '#ff0080', fontWeight: 700, marginTop: '4px' }}>
              작동시킵니다.
            </div>
          </div>

          {/* 로고 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #c65f3b 0%, #a64a2a 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 900,
                boxShadow: '0 4px 20px rgba(198, 95, 59, 0.5)',
              }}
            >
              ▶
            </div>
            <div
              style={{
                color: '#f5f1ea',
                fontSize: '36px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              <span style={{ color: '#ffd700' }}>Algo</span>
              <span>Maker</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
