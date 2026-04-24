/**
 * 📚 Blog 페이지 (서버 컴포넌트)
 *
 * SEO Prerender: 12개 노하우 글 목록이 view-source에 노출됨
 */

import type { Metadata } from 'next';
import Script from 'next/script';
import BlogClient from './BlogClient';
import { generateBreadcrumbJsonLd } from '../_shared/SEO';

export const metadata: Metadata = {
  title: '유튜브 크리에이터 노하우 12가지 - AlgoMaker 블로그',
  description: '유튜브 알고리즘, 조회수 올리는 법, 썸네일 제작, 제목 SEO, 첫 30초 훅, 유지율 편집, 키워드 발굴 등 실전 크리에이터 노하우 12가지 공개.',
  keywords: [
    '유튜브 노하우',
    '유튜브 알고리즘',
    '조회수 올리는 법',
    '유튜브 썸네일',
    '유튜브 제목',
    '영상 편집 노하우',
    '유튜브 키워드',
  ],
  alternates: {
    canonical: 'https://nutube.kr/blog',
  },
  openGraph: {
    title: '유튜브 크리에이터 노하우 12가지',
    description: '알고리즘, 썸네일, 제목, 유지율 등 실전 노하우',
    url: 'https://nutube.kr/blog',
  },
};

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'AlgoMaker 노하우 블로그',
  description: '유튜브 알고리즘·조회수·썸네일·제목 등 크리에이터 노하우 12가지',
  url: 'https://nutube.kr/blog',
  publisher: {
    '@type': 'Organization',
    name: 'AlgoMaker',
    url: 'https://nutube.kr',
  },
  inLanguage: 'ko-KR',
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: '홈', url: 'https://nutube.kr' },
  { name: '노하우 블로그', url: 'https://nutube.kr/blog' },
]);

// 12개 블로그 글 메타데이터
const BLOG_POSTS = [
  { slug: 'first-30-seconds-hook', title: '첫 30초가 영상의 운명을 결정합니다', sub: '왜 4명 중 3명이 30초 안에 떠나는가' },
  { slug: 'seo-title-formula', title: '제목 하나로 조회수가 10배 차이 나는 이유', sub: 'SEO 제목 설계의 복잡성' },
  { slug: 'ctr-thumbnail', title: '클릭률 5% vs 15% 썸네일의 차이', sub: 'CTR 결정 요소의 숨겨진 패턴' },
  { slug: 'viral-topic-formula', title: '바이럴이 터지는 주제는 따로 있습니다', sub: '알고리즘이 밀어주는 소재의 특징' },
  { slug: 'algorithm-script-structure', title: '대본 구조 하나로 유지율이 3배 올라갑니다', sub: '알고리즘 친화 스크립트 구조' },
  { slug: 'first-page-tags', title: '태그 잘못 넣으면 검색 노출 안 됩니다', sub: '첫 페이지 노출 태그 전략' },
  { slug: '8min-hook-points', title: '8분 영상에도 훅 포인트가 필요합니다', sub: '중후반 유지율 설계' },
  { slug: 'blue-ocean-keyword', title: '경쟁 없는 키워드는 정말 있을까요?', sub: '블루오션 키워드 발굴법' },
  { slug: 'retention-editing-rhythm', title: '편집 리듬이 유지율을 결정합니다', sub: '알고리즘이 선호하는 컷 타이밍' },
  { slug: '12-narrative-structures', title: '조회수 높은 영상은 12가지 구조를 씁니다', sub: '영상 내러티브 구조 패턴' },
  { slug: 'target-viewer-design', title: '타겟 시청자 설정 실수가 치명적입니다', sub: '페르소나 기반 콘텐츠 설계' },
  { slug: 'narration-tone-match', title: '내레이션 톤이 맞아야 유지율이 올라갑니다', sub: '카테고리별 톤앤매너' },
];

export default function BlogPage() {
  return (
    <>
      <Script
        id="ld-blog"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Script
        id="ld-breadcrumb-blog"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* SEO 정적 콘텐츠 */}
      <section className="seo-static" aria-hidden="false" style={{ display: 'none' }}>
        <nav role="navigation" aria-label="주요 메뉴">
          <a href="https://nutube.kr">홈</a>
          <a href="https://nutube.kr/blog">노하우 블로그</a>
          <a href="https://nutube.kr/about">AlgoMaker 소개</a>
          <a href="https://nutube.kr/contact">문의하기</a>
        </nav>

        <section aria-labelledby="blog-heading">
          <h1 id="blog-heading">유튜브 크리에이터 노하우 12가지</h1>
          <p>
            유튜브 알고리즘, 조회수 올리는 법, 썸네일 제작, 제목 SEO, 첫 30초 훅,
            유지율 편집, 키워드 발굴 등 실전 크리에이터 노하우 12가지를 공개합니다.
          </p>
          <p>
            이 글들은 수많은 크리에이터의 성공·실패 사례를 분석해서 만들어졌습니다.
            각 노하우의 핵심 원리를 이해하면 본인의 영상도 더 좋은 성과를 낼 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="posts-heading">
          <h2 id="posts-heading">전체 노하우 글 목록</h2>
          <ul>
            {BLOG_POSTS.map((post) => (
              <li key={post.slug}>
                <article>
                  <h3>
                    <a href={`https://nutube.kr/knowhow/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p>{post.sub}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading">관련 링크</h2>
          <ul>
            <li>
              <a href="https://nutube.kr">AlgoMaker 홈 - AI로 영상 자동 생성하기</a>
            </li>
            <li>
              <a href="https://nutube.kr/about">AlgoMaker 서비스 소개</a>
            </li>
            <li>
              <a href="https://nutube.kr/contact">문의하기</a>
            </li>
          </ul>
        </section>
      </section>

      <BlogClient />
    </>
  );
}
