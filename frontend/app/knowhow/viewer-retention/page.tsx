'use client';
import Link from 'next/link';
import { V11Shell } from '../../_shared/V11Shell';
import AdSlot from '../../_shared/AdSlot';

export default function Page() {
  return (
    <V11Shell>
      <style jsx>{`
        .page { max-width: 920px; margin: 0 auto; padding: 56px 24px 60px; }
        .breadcrumb {
          display: flex; gap: 8px; font-size: 13px;
          color: #888; margin-bottom: 24px;
        }
        .breadcrumb a:hover { color: #c65f3b; }
        .breadcrumb .sep { color: #ccc; }
        .pageBadge {
          display: inline-block; padding: 6px 14px;
          background: #fdf1e7; color: #c65f3b;
          border-radius: 100px; font-size: 12px; font-weight: 700;
          margin-bottom: 16px;
        }
        .header { text-align: center; margin-bottom: 40px; }
        .title {
          font-size: 32px; font-weight: 800;
          color: #1a1a1a; letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .sub { font-size: 15px; color: #666; line-height: 1.7; }
        @media (max-width: 600px) { .title { font-size: 24px; } }
        .meta {
          display: flex; justify-content: center; gap: 16px;
          font-size: 12px; color: #888; margin-top: 12px;
        }
        .meta span { display: flex; align-items: center; gap: 4px; }
        .content {
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 14px; padding: 32px;
          line-height: 1.8; color: #333;
        }
        @media (max-width: 600px) { .content { padding: 22px 18px; } }
        .content h2 {
          font-size: 19px; font-weight: 800;
          color: #1a1a1a; margin: 28px 0 12px;
        }
        .content h2:first-child { margin-top: 0; }
        .content p { margin: 0 0 14px; font-size: 15px; }
        .adArea { margin: 32px 0; }
        .related {
          margin-top: 32px; padding: 24px;
          background: #fafafa; border-radius: 12px;
        }
        .relatedTitle {
          font-size: 14px; font-weight: 800;
          color: #1a1a1a; margin-bottom: 12px;
        }
        .relatedLink {
          display: block; padding: 10px 14px;
          background: #fff; border: 1px solid #e5e5e5;
          border-radius: 8px; text-decoration: none;
          color: #1a1a1a; font-size: 13px; font-weight: 600;
          margin-bottom: 6px; transition: all 0.15s;
        }
        .relatedLink:hover { border-color: #c65f3b; background: #fff8f3; }
      `}</style>

      <div className="page">
        <nav className="breadcrumb">
          <Link href="/">홈</Link>
          <span className="sep">/</span>
          <Link href="/blog">노하우</Link>
          <span className="sep">/</span>
          <span>시청 유지율 50% 넘기는 영상 구조 7단계</span>
        </nav>

        <header className="header">
          <span className="pageBadge">📊 시청 유지율</span>
          <h1 className="title">시청 유지율 50% 넘기는 영상 구조 7단계</h1>
          <p className="sub">시청자가 끝까지 보게 만드는 검증된 영상 구성법</p>
          <div className="meta">
            <span>📅 2026.04.23</span>
            <span>⏱️ 11분 읽기</span>
          </div>
        </header>

        <article className="content">
          <p>유튜브 알고리즘이 가장 중요하게 보는 지표는 시청 유지율(Audience Retention)입니다. 영상이 10분이면 평균 5분 이상은 봐야 알고리즘이 &quot;좋은 영상&quot;으로 판단합니다. 이 글에서는 검증된 7단계 영상 구조를 소개합니다. 이 구조를 따르면 시청 유지율 50%, 잘 만든 경우 70%까지도 가능합니다.</p>
          <h2>1단계: 후크(Hook) - 첫 3초 (0:00~0:03)</h2>
          <p>영상 시작 첫 3초가 가장 중요합니다. 이 구간에서 60% 이상의 시청자가 이탈합니다. 후크의 핵심은 &quot;이 영상을 끝까지 봐야 하는 이유&quot;를 명확히 전달하는 것입니다. 예: &quot;이거 모르면 노후 준비 망합니다&quot;, &quot;3년 전 이걸 알았다면 1억은 벌었을 텐데&quot;.</p>
          <h2>2단계: 약속(Promise) - 0:03~0:15</h2>
          <p>후크 이후에는 영상에서 무엇을 얻을 수 있는지 명확히 약속합니다. &quot;이 영상에서는 ~~를 알려드립니다&quot; 형태로 구체적으로 말하세요. 시청자가 &quot;끝까지 보면 이걸 얻을 수 있구나&quot;라고 확신해야 이탈하지 않습니다.</p>
          <h2>3단계: 본론 도입 - 0:15~1:00</h2>
          <p>곧바로 본론으로 들어가지 마세요. 시청자가 마음의 준비를 할 시간을 줍니다. 자기소개, 채널 소개, 영상 주제의 배경 설명을 간단히 합니다. 단, 1분을 넘기면 안 됩니다. 너무 길면 시청자가 &quot;본론이 언제 나오지?&quot; 하며 이탈합니다.</p>
          <h2>4단계: 핵심 콘텐츠 - 1:00~7:00</h2>
          <p>영상의 메인 내용입니다. 여기서 가장 중요한 것은 정보를 작은 덩어리로 나누는 것입니다. 예를 들어 &quot;부동산 투자 5가지 방법&quot; 영상이라면, 각 방법마다 2분씩 할당하고 중간에 시각적 변화(화면 전환, 자막 변경, 효과음)를 줍니다. 이렇게 하면 시청자의 집중력이 유지됩니다.</p>
          <h2>5단계: 클라이맥스 - 7:00~8:30</h2>
          <p>영상의 가장 흥미로운 부분이나 핵심 결론을 이 구간에 배치합니다. 시청자가 &quot;이거 듣고 싶어서 끝까지 봤어&quot;라고 느끼게 해야 합니다. 예: 가장 강력한 노하우, 가장 의외의 사실, 가장 충격적인 결과 등.</p>
          <h2>6단계: 정리 및 행동 유도 - 8:30~9:30</h2>
          <p>영상 내용을 1~2문장으로 정리하고, 시청자에게 행동을 요구합니다. &quot;좋아요와 구독 부탁드립니다&quot; 보다는 &quot;오늘부터 이 방법 적용해보고 댓글로 결과 알려주세요&quot;가 더 효과적입니다. 구체적인 행동 유도가 댓글과 구독률을 높입니다.</p>
          <h2>7단계: 다음 영상 유도 - 9:30~10:00</h2>
          <p>마지막 30초는 다음 영상을 보게 만드는 시간입니다. 종료 화면을 활용해 관련 영상이나 시리즈 다음 편을 추천합니다. 이 단계가 세션 시간을 늘리는 핵심입니다. 시청자가 내 영상을 보고 곧바로 다른 영상을 더 보면 알고리즘이 채널 전체를 더 적극 노출시킵니다.</p>
          <h2>시청 유지율을 더 높이는 추가 팁</h2>
          <p>1) 매 1~2분마다 화면 전환이나 시각 효과 추가, 2) 자막을 적극 활용 (소리 없이 보는 시청자 30%), 3) 중간중간 &quot;잠깐, 이건 꼭 알아야 합니다&quot; 같은 재후크 삽입, 4) 영상 길이를 너무 늘리지 말 것 (8~12분이 최적), 5) 같은 정보를 다른 표현으로 2번 반복하지 말 것.</p>
          <h2>결론: 시청 유지율 향상의 본질</h2>
          <p>시청 유지율의 본질은 &quot;시청자가 한순간이라도 지루함을 느끼지 않게 하는 것&quot;입니다. 7단계 구조를 따르되, 각 단계에서 시청자에게 &quot;다음에 뭐가 나올까?&quot;라는 호기심을 계속 만들어내야 합니다. AlgoMaker는 영상 시퀀스 6단계 대본을 자동으로 추천해 시청 유지율을 높이는 구조를 만들어드립니다.</p>
        </article>

        <div className="adArea">
          <AdSlot slot="knowhow-bottom" variant="horizontal" />
        </div>

        <div className="related">
          <div className="relatedTitle">📚 관련 노하우</div>
          <Link href="/blog" className="relatedLink">
            🏠 모든 노하우 보기 →
          </Link>
          <Link href="/create" className="relatedLink">
            ✨ AI로 영상 자료 만들기 →
          </Link>
          <Link href="/workflow" className="relatedLink">
            🎬 일관된 영상 만드는 5단계 가이드 →
          </Link>
        </div>
      </div>
    </V11Shell>
  );
}
