'use client';

import Link from 'next/link';
import { V18Shell } from '../../_shared/V18Shell';

export default function ClaudeYoutubeWorkflowGuide() {
  return (
    <V18Shell>
      <style jsx>{`
        .guide-layout {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .guide-layout { grid-template-columns: 1fr; padding: 24px 20px 50px; gap: 20px; }
        }
        @media (max-width: 600px) {
          .guide-layout { padding: 20px 16px 50px; }
        }
        .toc-wrapper { display: block; }
        @media (max-width: 900px) {
          .toc-wrapper { display: none; }
        }
        .guide {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          line-height: 1.75;
          letter-spacing: -0.01em;
          max-width: 720px;
        }
        .guide-kicker {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #c2410c;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .guide-h1 {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.028em;
          line-height: 1.2;
          margin: 0 0 14px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-h1 { font-size: 26px; line-height: 1.25; }
        }
        .guide-subtitle {
          font-size: 16px;
          color: #525252;
          margin: 0 0 24px;
          line-height: 1.65;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide-subtitle { font-size: 14px; }
        }
        .guide-meta {
          display: flex;
          gap: 14px;
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          color: #a3a3a3;
          padding-bottom: 20px;
          border-bottom: 0.5px solid #e5e5e5;
          margin-bottom: 32px;
          flex-wrap: wrap;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .guide h2 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.022em;
          line-height: 1.3;
          margin: 44px 0 16px;
          padding-top: 8px;
          word-break: keep-all;
          scroll-margin-top: 80px;
        }
        @media (max-width: 600px) {
          .guide h2 { font-size: 21px; margin: 32px 0 14px; }
        }
        .guide h3 {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.018em;
          margin: 26px 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide h3 { font-size: 17px; }
        }
        .guide p {
          font-size: 17px;
          margin: 0 0 16px;
          word-break: keep-all;
          line-height: 1.75;
        }
        @media (max-width: 600px) {
          .guide p { font-size: 16px; }
        }
        .guide ul, .guide ol {
          padding-left: 24px;
          margin: 10px 0 20px;
        }
        .guide li {
          font-size: 17px;
          margin-bottom: 8px;
          line-height: 1.65;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .guide li { font-size: 16px; }
        }
        .guide strong { font-weight: 700; color: #0a0a0a; }
        .guide-callout {
          padding: 14px 18px;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          margin: 18px 0;
          font-size: 16px;
          line-height: 1.65;
          color: #78350f;
          word-break: keep-all;
        }
        .guide-quote {
          padding: 20px 24px;
          background: #fafafa;
          border-left: 4px solid #0a0a0a;
          margin: 24px 0;
          font-size: 17px;
          line-height: 1.7;
          color: #404040;
          word-break: keep-all;
          font-style: italic;
        }
        .guide-quote strong { color: #0a0a0a; font-style: normal; }
        .guide-section {
          padding: 18px 22px;
          background: #fff7ed;
          border-left: 3px solid #c2410c;
          margin: 24px 0;
          word-break: keep-all;
        }
        .guide-section h3 { margin-top: 0; }
        .guide-prompt {
          padding: 14px 18px;
          background: #f0f9ff;
          border-left: 3px solid #0284c7;
          margin: 18px 0;
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 13.5px;
          line-height: 1.65;
          color: #075985;
          word-break: keep-all;
        }
        .guide-back {
          display: inline-block;
          margin-bottom: 18px;
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 11px;
          color: #737373;
          text-decoration: none;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .guide-back:hover { color: #0a0a0a; }
      `}</style>

      <div className="post-wrapper">

        <article className="guide">
          <Link href="/blog" className="guide-back">← BACK TO GUIDES</Link>

          <div className="guide-kicker">AI TOOL · WORKFLOW</div>
          <h1 className="guide-h1">클로드로 유튜브 콘텐츠 자동화 - 4단계 프로세스</h1>
          <p className="guide-subtitle">
            기획부터 업로드 패키지까지 클로드 한 곳에서 완성하는 실전 가이드.
            대본·제목·썸네일·태그를 일관성 있게 만드는 핵심 노하우입니다.
          </p>

          <div className="guide-meta">
            <span>2026.05.04</span><span>·</span>
            <span>9 MIN READ</span><span>·</span>
            <span>AI TOOL</span>
          </div>

          <p>
            유튜브 콘텐츠 제작에 AI 도구를 활용하시는 분들이 늘어나고 있습니다.
            ChatGPT, Gemini, 클로드 등 다양한 도구가 있지만, 영상 대본과 블로그 글쓰기에서는
            <strong>클로드(Claude)가 압도적으로 자연스러운 한국어를 구사</strong>합니다.
            이 가이드는 클로드를 활용해 유튜브 콘텐츠 전 과정을 자동화하는 4단계 프로세스를 정리합니다.
          </p>

          <h2 id="sec-1">1. 왜 클로드인가 - 강점 2가지</h2>

          <p>
            다른 AI 도구 대비 클로드의 확실한 강점은 두 가지입니다.
          </p>

          <h3>① 자연스러운 한국어 구사</h3>

          <p>
            사람이 말하는 듯한 구어체 표현이 압도적입니다. ChatGPT가 작성한 대본은
            번역체 같은 느낌이 남는 반면, 클로드는 한국 시청자에게 익숙한 톤으로 글을 씁니다.
            특히 영상 대본, 블로그 글, 시니어 사연 쇼츠 같은 감정이 들어가는 콘텐츠에서
            차이가 두드러집니다.
          </p>

          <h3>② 원스톱 프로세스</h3>

          <p>
            클로드의 <strong>프로젝트 기능</strong>을 활용하면 기획, 대본, 썸네일 카피,
            제목, 태그 추출까지 한 공간에서 해결할 수 있습니다.
            매번 채널 설명을 반복할 필요가 없고, 모든 결과물이 일관성 있는 톤으로 나옵니다.
          </p>

          <h2 id="sec-2">2. 클로드 활용 4단계 프로세스</h2>

          <p>
            클로드를 유튜브 콘텐츠 제작에 사용하실 때는 다음 4단계를 따라가세요.
            각 단계마다 핵심 노하우가 있습니다.
          </p>

          <div className="guide-section">
            <h3>📋 클로드 활용 4단계 요약</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>1. 프로젝트 생성</strong>: 나만의 전용 작업 공간 구축</li>
              <li><strong>2. 맞춤 지침 설정</strong>: 채널 스타일과 톤앤매너 입력</li>
              <li><strong>3. 콘텐츠 제작</strong>: 주제 + 핵심 + 타겟 고민 입력</li>
              <li><strong>4. 업로드 패키지</strong>: 제목 / 썸네일 / 설명 / 태그 한 번에</li>
            </ul>
          </div>

          <h2 id="sec-3">3. 프로젝트 기능 - 핵심 차이점</h2>

          <p>
            많은 분이 클로드를 일반 대화창에서만 사용하시는데, 이는 큰 손실입니다.
            <strong>일반 대화창 vs 프로젝트</strong>의 차이는 분명합니다.
          </p>

          <p>일반 대화창의 한계:</p>
          <ul>
            <li>매번 채널 설명을 처음부터 다시 입력해야 함</li>
            <li>이전 대화의 톤앤매너가 유지되지 않음</li>
            <li>벤치마킹 자료를 매번 다시 첨부해야 함</li>
            <li>일관성 있는 결과물 어려움</li>
          </ul>

          <p>프로젝트 기능의 강점:</p>
          <ul>
            <li>지침에 채널 정보를 한 번 입력해두면 모든 대화에 자동 적용</li>
            <li>벤치마킹 자료를 프로젝트 파일로 저장 가능</li>
            <li>여러 대화창에서 같은 톤앤매너 유지</li>
            <li>채널별로 별도 프로젝트를 만들어 관리 가능</li>
          </ul>

          <div className="guide-callout">
            반드시 클로드 화면에서 "+ 새 프로젝트" 를 만들어 작업하세요.
            일반 대화창에서 작업하면 같은 결과를 못 얻습니다.
          </div>

          <h2 id="sec-4">4. 맞춤 지침 작성법</h2>

          <p>
            프로젝트를 만들었다면 다음 단계는 지침 작성입니다. 이 부분에서
            막막함을 느끼는 분이 많은데, 가장 쉬운 방법은 <strong>클로드에게 직접 만들어달라고 요청</strong>하는 것입니다.
          </p>

          <h3>지침 자동 생성 프롬프트</h3>

          <div className="guide-prompt">
            "저는 [채널 주제]를 다루는 유튜브 채널을 운영합니다.
            타겟 시청자는 [연령대 + 관심사]이고, 채널의 톤은 [친근함/전문적/감성적 등]입니다.
            영상 대본 작성을 위한 클로드 프로젝트 지침을 만들어주세요."
          </div>

          <p>
            이 프롬프트를 클로드에게 던지면 본인 채널에 맞는 지침을 자동으로 작성해줍니다.
            그 결과를 복사해서 클로드 프로젝트의 "지침" 영역에 붙여넣으시면 됩니다.
            10분 안에 본인만의 전용 작업 공간이 완성됩니다.
          </p>

          <h2 id="sec-5">5. 콘텐츠 제작 실전</h2>

          <p>
            지침을 설정했다면 이제 실제 콘텐츠를 만들 차례입니다.
            영상 대본을 요청하실 때 다음 3가지를 함께 입력하세요.
          </p>

          <ol>
            <li>
              <strong>주제</strong>: 영상이 다룰 핵심 키워드
            </li>
            <li>
              <strong>핵심 메시지</strong>: 시청자가 영상을 보고 얻을 가치
            </li>
            <li>
              <strong>타겟 고민</strong>: 시청자가 가지고 있는 문제나 궁금증
            </li>
          </ol>

          <h3>퀄리티 급상승 노하우 - 벤치마킹 영상 첨부</h3>

          <p>
            가장 강력한 노하우는 <strong>벤치마킹할 영상의 대본을 함께 넣는 것</strong>입니다.
            본인이 좋다고 생각한 채널의 영상 대본을 클로드에게 보여주면,
            그 톤과 구조를 학습해서 비슷한 스타일로 글을 써줍니다.
          </p>

          <div className="guide-prompt">
            "다음 영상 대본의 톤과 구조를 참고해서 [본인 주제]에 대한 영상 대본을 작성해주세요.
            [벤치마킹 대본 붙여넣기]"
          </div>

          <h2 id="sec-6">6. 업로드 패키지 자동 생성</h2>

          <p>
            대본이 완성됐다면 같은 대화창에서 업로드 패키지를 한 번에 요청하세요.
            <strong>같은 대화창에서 진행해야 맥락이 유지</strong>됩니다.
          </p>

          <p>요청할 항목:</p>
          <ul>
            <li>영상 제목 후보 5개 (8:2 법칙 적용)</li>
            <li>썸네일 카피 3개 (15자 이내)</li>
            <li>영상 설명란 (2~3 단락 + 키워드 자연 반복)</li>
            <li>해시태그 10개 (검색용 + 트렌드용)</li>
            <li>SEO 태그 (유튜브 입력용 50자 이내)</li>
            <li>타임스탬프 (시청 지속률 향상)</li>
          </ul>

          <div className="guide-section">
            <h3>💡 한 번에 모두 요청하는 프롬프트</h3>
            <p style={{ fontSize: 14, color: '#525252', marginBottom: 0 }}>
              "위 대본을 기반으로 다음을 한꺼번에 만들어주세요:
              <br />1) 영상 제목 후보 5개 (각 30자 내외, CTR 최적화)
              <br />2) 썸네일 카피 3개 (각 15자 이내, 강한 후크)
              <br />3) 설명란 (300자 내외, 핵심 키워드 3회 반복)
              <br />4) 해시태그 10개 (검색용 7 + 트렌드 3)
              <br />5) SEO 태그 (50자 이내, 쉼표 구분)
              <br />6) 타임스탬프 (주요 섹션 5~7개)"
            </p>
          </div>

          <h2 id="sec-7">7. 실전 체크리스트</h2>

          <p>
            아래 체크리스트를 따라 클로드 프로젝트를 셋업해보세요.
            한 번 셋업하면 매번 같은 채널의 영상 만들기가 매우 빠르고 일관성 있게 진행됩니다.
          </p>

          

          <h2>실전 적용 시 주의 사항</h2>

          <p>
            클로드를 활용하실 때 반드시 기억해야 할 점이 있습니다.
            <strong>AI는 도구일 뿐, 영상의 본질은 본인의 진짜 이야기</strong>여야 합니다.
            특히 시니어 사연 쇼츠나 인생 회상 콘텐츠처럼 진정성이 중요한 영상은
            클로드가 만든 대본을 그대로 사용하지 마세요. 본인의 경험과 표현으로 다듬어야 합니다.
          </p>

          <p>
            또한 클로드 무료 버전은 대본 작업 시 한도가 빠르게 소진됩니다.
            본격적으로 콘텐츠를 만드신다면 <strong>Pro 플랜(유료)을 권장</strong>합니다.
            긴 대화를 유지할 수 있고, 더 깊이 있는 추론이 가능합니다.
          </p>

          <h2>마치며</h2>

          <p>
            클로드를 활용한 유튜브 콘텐츠 자동화는 <strong>제작 시간을 1/3 이하로 줄여줍니다.</strong>
            대본 1편 쓰는 데 3시간 걸리던 것이 30~45분으로 단축됩니다.
            그 시간을 영상 촬영과 편집에 투자하면 채널이 빠르게 성장합니다.
          </p>

          <p>
            처음에는 프로젝트 셋업과 지침 작성에 한 시간 정도 투자하시되,
            그 이후로는 매번 같은 채널 영상이 빠르고 일관성 있게 만들어집니다.
            오늘 바로 클로드 프로젝트를 만들어보세요. 1주일 안에 작업 효율이 눈에 띄게 올라갑니다.
          </p>

          

          <div className="guide-section" style={{ marginTop: 32 }}>
            <h3>✨ 함께 보면 좋은 가이드</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><Link href="/blog/chatgpt-script" style={{ color: '#c2410c' }}>ChatGPT로 영상 대본 빠르게 쓰는 법</Link></li>
              <li><Link href="/blog/ai-tools" style={{ color: '#c2410c' }}>AI 영상 만들기 도구 모음</Link></li>
              <li><Link href="/blog/human-warmth" style={{ color: '#c2410c' }}>AI 시대, 유튜버가 잃지 말아야 할 인간의 온도</Link></li>
            </ul>
          </div>
        </article>
      </div>
    </V18Shell>
  );
}
