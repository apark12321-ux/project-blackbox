'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';
import { GuideMetadata } from '../../_shared/GuideMetadata';

export default function SeniorCapcutBasicGuide() {
  return (
    <V18Shell>
      <GuideMetadata
        slug="senior-capcut-basic"
        title="시니어 영상 편집 - 무료 앱 기본 사용법"
        subtitle="처음 시작하는 시니어를 위한 영상 편집 5단계"
        description="처음 시작하는 시니어를 위한 영상 편집 5단계"
        category="시니어"
        publishedAt="2026-05-06"
        readTime="8분"
      />

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
          margin-bottom: 32px; padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }
        .guide-section { margin-bottom: 36px; }
        .guide-section h2 {
          font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
          margin: 0 0 16px; padding-top: 12px;
        }
        @media (max-width: 600px) { .guide-section h2 { font-size: 19px; } }
        .guide-section h3 {
          font-size: 17px; font-weight: 700; letter-spacing: -0.018em;
          margin: 24px 0 10px;
        }
        .guide-section p {
          font-size: 16px; margin: 0 0 14px; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section p { font-size: 15px; } }
        .guide-section ul, .guide-section ol {
          margin: 0 0 16px; padding-left: 24px;
        }
        .guide-section li {
          font-size: 16px; margin-bottom: 8px; line-height: 1.7; word-break: keep-all;
        }
        @media (max-width: 600px) { .guide-section li { font-size: 15px; } }
        .guide-section strong { color: #c2410c; font-weight: 700; }
      `}</style>

      <article className="guide">
        <Link href="/blog" style={{ fontSize: 13, color: '#737373', marginBottom: 16, display: 'inline-block' }}>
          ← 가이드 목록으로
        </Link>

        <div className="guide-kicker">시니어 사연 쇼츠 · 영상 편집</div>
        <h1 className="guide-h1">
          시니어 영상 편집 - 무료 앱 기본 사용법
        </h1>
        <p className="guide-subtitle">
          50대 이후 처음 영상 편집을 시작하시는 분들을 위한 무료 편집 앱 5단계 사용법입니다.
        </p>

        <div className="guide-meta">
          <span>📅 2026.05.06 발행</span>
          <span>·</span>
          <span>📂 시니어</span>
        </div>

        <div className="guide-section">
          <p>
            영상 편집은 처음에 가장 어렵게 느껴지는 부분입니다.
            많은 시니어 분들이 "편집은 너무 복잡하다"며 시작도 못 하시는 경우가 많습니다.
            하지만 <strong>5단계만 익히시면 누구나 영상 편집을 하실 수 있습니다.</strong>
          </p>
          <p>
            이 가이드는 무료 영상 편집 앱의 핵심 5단계만 골라서 알려드립니다.
            <strong>전문 편집자가 되실 필요는 없습니다.</strong>
            기본만 하셔도 충분히 깔끔한 영상을 만드실 수 있습니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>1단계: 무료 편집 앱 설치</h2>
          <p>
            시니어 분들께 가장 추천드리는 무료 영상 편집 앱입니다.
            한국어 지원이 잘 되어 있고, 직관적인 인터페이스로 처음 시작하시는 분께 적합합니다.
          </p>
          <h3>스마트폰 앱</h3>
          <ul>
            <li><strong>VLLO</strong>: 한국어 100% 지원, 직관적, 무료 기능 풍부</li>
            <li><strong>키네마스터</strong>: 한국 사용자 많음, 워터마크 있음 (무료)</li>
            <li><strong>InShot</strong>: 쇼츠 편집에 특화</li>
          </ul>
          <h3>설치 방법</h3>
          <ol>
            <li>플레이스토어 (안드로이드) 또는 앱스토어 (아이폰) 열기</li>
            <li>"VLLO" 또는 "키네마스터" 검색</li>
            <li>"설치" 버튼 누르기</li>
            <li>설치 후 앱 실행</li>
          </ol>
          <p>
            <strong>처음에는 한 가지 앱만 골라서 익히세요.</strong>
            여러 앱을 동시에 배우시면 헷갈립니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>2단계: 영상 가져오기 + 자르기</h2>
          <p>
            영상 편집의 가장 기본은 <strong>자르기</strong>입니다.
            촬영한 영상에서 필요 없는 부분을 잘라내는 작업입니다.
          </p>
          <h3>기본 순서</h3>
          <ol>
            <li>앱 실행 → "새 프로젝트" 또는 "새 영상" 누르기</li>
            <li>스마트폰 갤러리에서 촬영한 영상 선택</li>
            <li>영상이 편집 화면에 들어오면 영상을 손가락으로 누르기</li>
            <li>자르고 싶은 위치에 빨간 선 (재생 위치) 두기</li>
            <li>"자르기" 또는 가위 모양 버튼 누르기</li>
            <li>영상이 둘로 나뉨 → 필요 없는 부분 선택 후 삭제</li>
          </ol>
          <p>
            처음에는 자르기만 익히셔도 됩니다.
            영상 시작과 끝의 멍한 부분만 잘라내셔도 영상이 훨씬 깔끔해집니다.
          </p>
        </div>

        <div className="guide-section">
          <h2>3단계: 자막 추가</h2>
          <p>
            <strong>자막은 시청 지속률을 30~50% 올립니다.</strong>
            특히 시니어 시청자는 자막을 좋아합니다.
            귀가 안 좋으셔서 영상 소리를 안 듣고 자막만 보시는 분도 많기 때문입니다.
          </p>
          <h3>자막 넣는 방법</h3>
          <ol>
            <li>영상 편집 화면에서 "T" 또는 "텍스트" 버튼 누르기</li>
            <li>자막을 넣고 싶은 위치에 재생 위치 두기</li>
            <li>자막 내용 입력</li>
            <li>글자 크기, 색상, 폰트 선택</li>
            <li>자막이 나올 시간 (시작 ~ 끝) 조정</li>
          </ol>
          <h3>시니어 친화 자막 팁</h3>
          <ul>
            <li>글자 크기 <strong>크게</strong> (스마트폰에서 잘 보이게)</li>
            <li>색상은 <strong>흰 글씨 + 검은 테두리</strong> 가 가장 잘 보임</li>
            <li>한 줄에 12~15자 이내</li>
            <li>중요한 단어만 자막 (모든 말 다 자막 X)</li>
          </ul>
          <h3>자동 자막 기능 (추천)</h3>
          <p>
            VLLO 와 키네마스터에는 <strong>자동 자막 인식</strong> 기능이 있습니다.
            영상 음성을 자동으로 텍스트로 변환해줍니다.
            손으로 일일이 입력하실 필요가 없어집니다.
          </p>
          <ul>
            <li>"자동 자막" 또는 "음성 인식" 버튼 찾기</li>
            <li>한국어 선택</li>
            <li>자동 변환 → 결과 검토 후 수정</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4단계: 배경 음악 추가</h2>
          <p>
            배경 음악은 영상의 분위기를 만들어줍니다.
            <strong>사연 영상에는 잔잔한 음악</strong>이, <strong>일상 영상에는 밝은 음악</strong>이 어울립니다.
          </p>
          <h3>저작권 안전한 음악 출처</h3>
          <ul>
            <li><strong>YouTube 오디오 라이브러리</strong>: 100% 무료, 저작권 안전</li>
            <li><strong>VLLO 내장 음악</strong>: 앱 안에서 바로 사용 가능</li>
            <li><strong>키네마스터 에셋 스토어</strong>: 무료/유료 음악 다양</li>
          </ul>
          <h3>음악 추가 방법</h3>
          <ol>
            <li>편집 화면에서 "음악" 또는 "오디오" 버튼 누르기</li>
            <li>마음에 드는 음악 선택</li>
            <li>음악 길이를 영상 길이에 맞게 자르기</li>
            <li>음량 조절 (배경 음악은 작게, 본인 목소리는 크게)</li>
          </ol>
          <h3>주의사항</h3>
          <ul>
            <li>유명 가요 사용 X (저작권 위반)</li>
            <li>유튜브 무료 라이브러리 활용 권장</li>
            <li>음악 음량은 본인 목소리의 30~40% 정도</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5단계: 내보내기 (저장)</h2>
          <p>
            편집을 마치셨으면 마지막 단계는 <strong>내보내기</strong>입니다.
            완성된 영상을 스마트폰에 저장하는 과정입니다.
          </p>
          <h3>내보내기 방법</h3>
          <ol>
            <li>편집 화면 우측 상단 "내보내기" 또는 "저장" 버튼 누르기</li>
            <li>화질 선택 (1080p 권장, 4K는 용량 너무 큼)</li>
            <li>저장 시작 → 1~5분 대기 (영상 길이에 따라 다름)</li>
            <li>저장 완료 → 갤러리에 영상 저장됨</li>
          </ol>
          <h3>유튜브 업로드 팁</h3>
          <ul>
            <li>유튜브 앱 열기 → 가운데 "+" 버튼</li>
            <li>방금 저장한 영상 선택</li>
            <li>제목, 설명, 해시태그 입력</li>
            <li>"공개" 선택 후 게시</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>마치며</h2>
          <p>
            처음에는 한 영상 편집에 1~2시간 걸리실 수 있습니다.
            <strong>5번 정도 해보시면 30분 안에 끝나게 됩니다.</strong>
            10번째쯤에는 익숙해지셔서 편집이 즐거워지십니다.
          </p>
          <p>
            중요한 것은 <strong>완벽한 편집보다 꾸준한 업로드</strong>입니다.
            처음에는 자르기만 하셔도 됩니다. 자막, 음악은 나중에 추가하셔도 됩니다.
          </p>
          <p>
            한 단계씩 천천히 익히시면 됩니다.
            오늘 자르기만, 다음 주 자막, 그다음 주 음악 — 이렇게 한 가지씩 늘려가세요.
          </p>
        </div>

        <div className="guide-section" style={{ marginTop: 32 }}>
          <h3>✨ 함께 보면 좋은 가이드</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><Link href="/blog/free-editing-apps" style={{ color: '#c2410c' }}>무료 영상 편집 앱 추천</Link></li>
            <li><Link href="/blog/senior-shooting-mistakes" style={{ color: '#c2410c' }}>시니어가 처음 영상 찍을 때 흔한 실수 7가지</Link></li>
            <li><Link href="/blog/thumbnail-tips" style={{ color: '#c2410c' }}>눈길을 사로잡는 썸네일 글자 디자인</Link></li>
          </ul>
        </div>
      </article>
    </V18Shell>
  );
}
