/**
 * SEO 시맨틱 HTML 컴포넌트
 *
 * 'use client' 페이지는 metadata export가 불가능합니다.
 * 대신 이 컴포넌트를 사용해 시맨틱 HTML 구조로 SEO 최적화합니다.
 * 크롤러는 시맨틱 태그(section, article, h1-h6)를 우선 인식합니다.
 */

import React from 'react';

interface SEOSemanticProps {
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * 페이지 상단에 삽입하는 SEO 시맨틱 구조
 * 시각적으로는 숨기지만 크롤러는 읽을 수 있음
 */
export function SEOSemanticMarker({ pageTitle, pageDescription, breadcrumbs }: SEOSemanticProps) {
  return (
    <>
      {/* 스크린리더 & 크롤러용 페이지 설명 (sr-only) */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-hidden="false"
      >
        {pageTitle && <h1>{pageTitle}</h1>}
        {pageDescription && <p>{pageDescription}</p>}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((b, i) => (
                <li key={i}>
                  {i < breadcrumbs.length - 1 ? <a href={b.url}>{b.name}</a> : b.name}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </>
  );
}

/**
 * JSON-LD 구조화 데이터 삽입 컴포넌트
 * 'use client' 페이지에서도 사용 가능
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Breadcrumb JSON-LD 생성 헬퍼
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article JSON-LD 생성 헬퍼 (블로그 글용)
 */
export function generateArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  modifiedAt?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl || 'https://nutube.kr/og-image.jpg',
    datePublished: publishedAt || '2025-01-01T00:00:00+09:00',
    dateModified: modifiedAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'AlgoMaker',
      url: 'https://nutube.kr',
    },
    publisher: {
      '@type': 'Organization',
      name: '한줄컴퍼니',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nutube.kr/logo-512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nutube.kr/knowhow/${slug}`,
    },
  };
}

/**
 * FAQ JSON-LD 생성 헬퍼
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo JSON-LD 생성 헬퍼 (서비스 사용 방법 안내)
 */
export function generateHowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
