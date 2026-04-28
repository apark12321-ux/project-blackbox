import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AlgoMaker - 키워드 하나로 떡상 시나리오';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #c65f3b 0%, #ea7755 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 로고/뱃지 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '40px',
            padding: '12px 28px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '100px',
            fontSize: '22px',
            fontWeight: 800,
            color: '#c65f3b',
            letterSpacing: '0.02em',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#c65f3b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            A
          </div>
          AlgoMaker
        </div>

        {/* 메인 헤드라인 */}
        <div
          style={{
            fontSize: '74px',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>키워드 하나로</span>
          <span style={{ color: '#fef3c7' }}>떡상 시나리오 완성</span>
        </div>

        {/* 부제 */}
        <div
          style={{
            fontSize: '26px',
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '900px',
            marginBottom: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>AI가 분야별로 다른 떡상 트리거를 자동 매칭</span>
          <span>부동산은 수치, 영어는 경험담, 다이어트는 비포애프터</span>
        </div>

        {/* 통계 박스 3개 */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
          }}
        >
          {[
            { num: '9개', label: '도메인 자동 인식' },
            { num: '100명 = 100가지', label: '매번 다른 결과' },
            { num: '무료', label: '회원가입 X' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '18px 28px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '14px',
                minWidth: '180px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#c65f3b',
                  letterSpacing: '-0.02em',
                  marginBottom: '4px',
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: '15px',
                  color: '#666',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 도메인 */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          nutube.kr
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
