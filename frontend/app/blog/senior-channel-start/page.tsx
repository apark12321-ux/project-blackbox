'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function SeniorChannelStartGuide() {
  return (
    <V18Shell>
      <style jsx>{`
        .guide {
          max-width: 760px; margin: 0 auto; padding: 24px 20px 60px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a; line-height: 1.75; letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .guide { padding: 18px 16px 50px; } }
        .guide-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          color: #c2410c; margin-bottom: 8px; text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 32px; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.3; margin: 0 0 12px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-h1 { font-size: 26px; } }
        .guide-subtitle {
          font-size: 15px; color: #525252; margin: 0 0 24px; line-height: 1.6;
          word-break: keep-all;
        }
        .guide-meta {
          display: flex; gap: 12px; font-size: 14px; color: #737373;
          padding-bottom: 18px; border-bottom: 1px solid #e5e5e5; margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .guide h2 {
          font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
          line-height: 1.4; margin: 36px 0 14px; padding-top: 8px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h2 { font-size: 21px; margin: 28px 0 12px; } }
        .guide h3 {
          font-size: 19px; font-weight: 700; letter-spacing: -0.015em;
          margin: 24px 0 10px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide h3 { font-size: 17.5px; } }
        .guide p { font-size: 18px; margin: 0 0 14px; word-break: keep-all; }
        @media (max-width: 600px) { .guide p { font-size: 17px; } }
        .guide ul, .guide ol { padding-left: 22px; margin: 8px 0 18px; }
        .guide li { font-size: 18px; margin-bottom: 8px; line-height: 1.6; word-break: keep-all; }
        @media (max-width: 600px) { .guide li { font-size: 17px; } }
        .guide-callout {
          padding: 14px 16px; background: #fffbeb; border-left: 3px solid #fbbf24;
          margin: 16px 0; font-size: 17px; line-height: 1.6; color: #78350f; word-break: keep-all;
        }
        .guide-section {
          padding: 16px 20px; background: #fef3c7; border-left: 3px solid #f59e0b;
          margin: 20px 0; word-break: keep-all;
        }
        .guide-section h3 { margin-top: 0; }
        .guide-back {
          display: inline-block; margin-bottom: 18px;
          font-size: 13px; color: #737373; text-decoration: none;
        }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <article className="guide">
        <Link href="/blog" className="guide-back">← 전체 가이드</Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 시작하기</div>
        <h1 className="guide-h1">
          50대부터 시작하는<br />
          시니어 사연 쇼츠 채널
        </h1>
        <p className="guide-subtitle">
          시니어 시청자를 위한 짧은 영상 콘텐츠는 진입 장벽이 낮습니다.
          처음 시작하시는 분들을 위한 단계별 안내입니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.04 발행</span><span>📂 시니어</span>
        </div>

        <p>
          유튜브 시장에서 시니어 사연 쇼츠는 가장 빠르게 성장하는 분야 중 하나입니다.
          50~80대 시청자가 폭발적으로 늘어나면서, 그분들의 추억과 인생 이야기를 담은
          짧은 영상이 수십만에서 수백만 조회수를 기록하고 있습니다.
        </p>

        <p>
          이 가이드는 50대 이상이 직접 시니어 채널을 운영하시거나,
          가족 어르신의 이야기를 담아 채널을 만들고 싶은 분들을 위한 입문서입니다.
          처음 시작할 때 알아야 할 핵심만 정리해 드립니다.
        </p>

        <h2>1. 시니어 사연 쇼츠란 무엇인가</h2>

        <p>
          시니어 사연 쇼츠는 일반적으로 <strong>60초 이내의 짧은 영상</strong>으로,
          시니어 세대의 인생 경험, 추억, 가족 이야기, 후회담을 다룹니다.
          긴 영상보다 진입 장벽이 낮고, 모바일에서 빠르게 소비되기 때문에
          시니어 시청자가 부담 없이 시청할 수 있습니다.
        </p>

        <h3>왜 사연 쇼츠가 강한가</h3>

        <ul>
          <li><strong>공감대 형성</strong>: 비슷한 세대 시청자가 자기 이야기처럼 느낌</li>
          <li><strong>짧은 분량</strong>: 60초 이내라 끝까지 시청 가능</li>
          <li><strong>알고리즘 친화</strong>: 시청 완료율이 높아 추천 영상에 잘 노출</li>
          <li><strong>제작 용이</strong>: 긴 영상 편집 기술 없이도 만들 수 있음</li>
        </ul>

        <h2>2. 채널 컨셉 잡기</h2>

        <p>
          시니어 채널을 시작할 때 가장 먼저 결정해야 할 것은 <strong>채널 컨셉</strong>입니다.
          어떤 이야기를 다룰 것인지 명확히 정해야 시청자가 채널을 기억합니다.
        </p>

        <h3>인기 컨셉 5가지</h3>

        <ol>
          <li>
            <strong>인생 사연 회상</strong>: 본인의 50~80년 인생에서 가장 기억에 남는 순간
          </li>
          <li>
            <strong>부모님 추억</strong>: 돌아가신 부모님의 말씀, 행동, 가르침
          </li>
          <li>
            <strong>가족 이야기</strong>: 형제자매, 자녀, 손주와의 일상
          </li>
          <li>
            <strong>인생 후회담</strong>: 시간이 지나서야 깨달은 후회와 교훈
          </li>
          <li>
            <strong>시대 회상</strong>: 60~80년대 한국의 풍경, 삶의 모습
          </li>
        </ol>

        <h2>3. 영상 만들기 - 5단계 흐름</h2>

        <div className="guide-section">
          <h3>📋 시니어 사연 쇼츠 제작 5단계</h3>
          <ol>
            <li><strong>주제 선정</strong>: 오늘 떠올릴 추억 한 가지 정하기</li>
            <li><strong>스크립트</strong>: 60초 안에 들어갈 핵심 메시지 (200자 내외)</li>
            <li><strong>녹음</strong>: 본인 목소리로 녹음 (떨려도 괜찮음)</li>
            <li><strong>영상 편집</strong>: 옛날 사진 + 자막 + 잔잔한 음악</li>
            <li><strong>업로드</strong>: 정각 회피, 오전 시간대 권장</li>
          </ol>
        </div>

        <h3>스크립트 - 첫 5초가 핵심</h3>

        <p>
          시니어 시청자가 영상을 끝까지 보게 만들려면 <strong>첫 5초의 후크</strong>가 결정적입니다.
          첫 문장부터 호기심을 자극해야 합니다.
        </p>

        <p>강력한 후크 패턴:</p>
        <ul>
          <li>"50년 전 이맘때, 저는…"</li>
          <li>"그날 어머니가 마지막으로 하신 말씀은…"</li>
          <li>"평생 잊지 못할 그 한 마디"</li>
          <li>"인생 60년, 가장 후회하는 한 가지"</li>
        </ul>

        <p>
          이런 패턴은 시청자가 "그 다음이 궁금해" 라는 마음을 갖게 만듭니다.
          첫 5초를 잘 잡으면 끝까지 시청률이 60% 이상 올라갑니다.
        </p>

        <h2>4. 촬영과 편집 - 핸드폰만으로 충분</h2>

        <p>
          시니어 채널 시작에 비싼 카메라는 필요하지 않습니다. <strong>스마트폰만으로 충분</strong>합니다.
          중요한 건 화질이 아니라 진정성과 이야기입니다.
        </p>

        <h3>촬영 팁</h3>

        <ul>
          <li><strong>밝은 곳에서</strong>: 창가 자연광이 가장 좋습니다</li>
          <li><strong>안정된 자세</strong>: 핸드폰을 책상에 받쳐두거나 거치대 사용</li>
          <li><strong>가까이서</strong>: 얼굴이 화면 가운데 잘 보이도록</li>
          <li><strong>조용한 곳</strong>: 주변 소음이 적은 공간 선택</li>
        </ul>

        <h3>편집 도구</h3>

        <p>
          무료 편집 앱으로 충분히 사연 쇼츠를 만들 수 있습니다.
          주로 사용되는 앱은 캡컷 (CapCut), VLLO, 곰믹스 등이 있습니다.
          자막을 큰 글씨로 넣어주시는 것이 시니어 시청자에게 친화적입니다.
        </p>

        <div className="guide-callout">
          편집을 처음 하실 때는 캡컷을 추천합니다. 한국어 지원이 잘 되어 있고,
          자막 자동 생성 기능이 있어 시니어 분들도 쉽게 사용하실 수 있습니다.
        </div>

        <h2>5. 업로드 시 주의 사항</h2>

        <p>
          영상을 만들었다면 업로드할 때도 신경 써야 할 부분이 있습니다.
          잘못 업로드하면 알고리즘 추천을 못 받거나 채널이 제한될 수 있습니다.
        </p>

        <h3>꼭 지킬 점</h3>

        <ul>
          <li>
            <strong>"아동용 아님" 체크</strong>: 시니어 콘텐츠는 성인 시청자 대상이므로 반드시 체크
          </li>
          <li>
            <strong>자극적 소재 회피</strong>: 폭력, 사기, 음모론 등은 채널 제한 위험
          </li>
          <li>
            <strong>허위 사실 금지</strong>: 본인 또는 가족 어르신의 진짜 이야기여야 함
          </li>
          <li>
            <strong>1일 1영상</strong>: 너무 자주 올리면 평균 시청률이 떨어짐
          </li>
          <li>
            <strong>업로드 후 삭제·재업로드 금지</strong>: 알고리즘 페널티
          </li>
          <li>
            <strong>정각 업로드 회피</strong>: 오전 9~12시 사이, 5~20분 사이 추천
          </li>
        </ul>

        <h2>6. 첫 100명 구독자까지 - 인내가 핵심</h2>

        <p>
          시니어 채널은 처음에는 조회수가 잘 안 나옵니다.
          한 달 동안 영상이 50회 조회수만 나와도 정상입니다.
          중요한 건 <strong>꾸준히 올리는 것</strong>입니다.
        </p>

        <p>
          알고리즘은 채널을 평가하는 데 시간이 걸립니다.
          최소 한 달, 길게는 3개월 동안 꾸준히 영상을 올려야
          알고리즘이 채널을 인식하고 추천하기 시작합니다.
        </p>

        <h2>마치며: 진정성이 가장 큰 무기</h2>

        <p>
          시니어 사연 쇼츠는 기술이 아니라 <strong>진정성</strong>이 핵심입니다.
          AI가 만든 가짜 사연이 아니라, 본인 또는 가족의 진짜 이야기를 담아야
          시청자가 공감합니다.
        </p>

        <p>
          처음에는 어색하고 부끄러울 수 있습니다. 하지만 그 어색함 자체가
          시니어 시청자에게는 친근함으로 느껴집니다.
          완벽하지 않아도 괜찮습니다. 진짜 이야기면 충분합니다.
        </p>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/senior-content-ideas" style={{ color: '#c2410c' }}>시니어 채널 콘텐츠 아이디어 30가지</Link></li>
            <li><Link href="/blog/human-warmth" style={{ color: '#c2410c' }}>AI 시대, 유튜버가 잃지 말아야 할 인간의 온도</Link></li>
            <li><Link href="/blog/algorithm-seo" style={{ color: '#c2410c' }}>알고리즘이 내 영상을 알아보게 하는 SEO 전략</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
