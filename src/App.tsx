import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Share2, 
  Printer, 
  Heart, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  AlertCircle, 
  Check, 
  Copy, 
  FileText, 
  Info, 
  Menu, 
  X, 
  Award, 
  Zap, 
  CornerDownRight, 
  ThumbsUp, 
  MapPin, 
  Mail, 
  Hash, 
  FileCode,
  Compass
} from 'lucide-react';
import { CATEGORIES, INITIAL_POSTS, SITE_OPERATOR } from './data';
import { CategoryKey, GuidePost, MetadataResult } from './types';
import { generateMetadataLocal } from './generator';
import { renderThumbnailSvg, getThumbnailTexts, CATEGORY_SPECS, THUMBNAIL_TEXTS_MAP } from './utils/thumbnail-mapping';

function formatDate(iso: string): string {
  if (!iso) return '';
  if (iso.length <= 10) return iso.replace(/-/g, '.');
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<'home' | 'guides' | 'generator' | 'legal'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom posts state (supports likes & bookmarks)
  const [posts, setPosts] = useState<GuidePost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<GuidePost | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Generator states
  const [generatorKeyword, setGeneratorKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorResult, setGeneratorResult] = useState<MetadataResult | null>(null);
  const [generatorSubTab, setGeneratorSubTab] = useState<'titles' | 'description' | 'tags' | 'storyboard' | 'thumbnails' | 'shorts'>('titles');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sub-legal view state
  const [activeLegalTab, setActiveLegalTab] = useState<'about' | 'privacy' | 'terms' | 'partnership' | 'announcements'>('about');

  // URL route sync to keep navigation in perfect harmony with state
  useEffect(() => {
    const path = location.pathname;
    
    // 1. 기존 옛 URL -> 새 URL 리다이렉트 (쿼리 파라미터 체크)
    // /blog?cat=xxx, /blog?category=xxx -> /category/xxx 로 교체
    const params = new URLSearchParams(location.search);
    const catQuery = params.get('cat') || params.get('category');
    if (catQuery) {
      navigate(`/category/${catQuery}`, { replace: true });
      return;
    }

    // 2. /generator -> /publish 리다이렉트
    if (path === '/generator' || path === '/generator/') {
      navigate('/publish', { replace: true });
      return;
    }

    if (path === '/' || path === '') {
      setCurrentTab('home');
      setSelectedPost(null);
      setSelectedCategory('all');
    } else if (path.startsWith('/category/')) {
      const cat = path.replace('/category/', '') as CategoryKey;
      setCurrentTab('guides');
      setSelectedPost(null);
      setSelectedCategory(cat);
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const found = INITIAL_POSTS.find(p => p.slug === slug);
      if (found) {
        setSelectedPost(found);
      } else {
        // Fallback to guides
        setCurrentTab('guides');
        setSelectedPost(null);
        setSelectedCategory('all');
      }
    } else if (path === '/blog' || path === '/blog/') {
      setCurrentTab('guides');
      setSelectedPost(null);
      setSelectedCategory('all');
    } else if (path === '/publish' || path === '/publish/') {
      setCurrentTab('generator');
      setSelectedPost(null);
    } else if (path === '/about') {
      setCurrentTab('legal');
      setActiveLegalTab('about');
      setSelectedPost(null);
    } else if (path === '/privacy') {
      setCurrentTab('legal');
      setActiveLegalTab('privacy');
      setSelectedPost(null);
    } else if (path === '/terms') {
      setCurrentTab('legal');
      setActiveLegalTab('terms');
      setSelectedPost(null);
    } else if (path === '/partnership') {
      setCurrentTab('legal');
      setActiveLegalTab('partnership');
      setSelectedPost(null);
    } else if (path === '/announcement') {
      setCurrentTab('legal');
      setActiveLegalTab('announcements');
      setSelectedPost(null);
    }
  }, [location, navigate]);

  // Load liked posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nutube_liked_posts');
    if (saved) {
      try {
        setLikedPosts(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Dynamic SEO & JSON-LD 4종 구조화 데이터 Injection
  useEffect(() => {
    const url = `https://www.nutube.kr${location.pathname === '/' ? '' : location.pathname}`;
    let title = 'NuTube (뉴튜브) - 유튜브 채널 운영자를 위한 실전 가이드 미디어';
    let description = '신뢰할 수 있는 공식 YouTube 정책과 최신 알고리즘 트렌드를 반영한 유튜브 에디팅, 채널 최적화, 메타데이터 생성 및 크리에이터 수익화 전문 가이드 미디어입니다.';
    let ogImage = 'https://www.nutube.kr/og-image.png'; // 기본 OG 이미지 경로

    // 주소나 탭에 따라 SEO 정보 최적화
    if (selectedPost) {
      title = `${selectedPost.title} | NuTube (뉴튜브)`;
      description = selectedPost.summary || description;
    } else if (currentTab === 'generator') {
      title = 'AI 유튜브 메타데이터 생성 마스터 | NuTube (뉴튜브)';
      description = '유튜브 영상용 제목, 설명란 구문, 핵심 해시태그 및 숏폼 시나리오 대본까지 인공지능 기반으로 한 번에 생성해내는 크리에이터용 최적화 툴입니다.';
    } else if (currentTab === 'guides') {
      if (selectedCategory !== 'all') {
        const catSpec = CATEGORIES.find(c => c.key === selectedCategory);
        if (catSpec) {
          title = `${catSpec.label} 분야 검증 가이드 | NuTube (뉴튜브)`;
          description = `${catSpec.description} - NuTube가 정리한 전문 유튜브 운영 비법 목록입니다.`;
        }
      } else {
        title = '실전 가이드 인사이트 라이브러리 | NuTube (뉴튜브)';
        description = '유튜브 알고리즘 분석, 시니어 사연 쇼츠 채널 설계, AI 제작 도구 활용, 수익화 다각화 등 유튜브 크리에이터를 위한 명쾌한 핵심 가이드 모음입니다.';
      }
    } else if (currentTab === 'legal') {
      if (activeLegalTab === 'about') {
        title = '상상아트 NuTube 소개 | NuTube (뉴튜브)';
        description = '유튜브 채널 운영 실전 가이드 미디어 NuTube의 편집 원칙과 상상아트 운영 사업자 정보를 안내합니다.';
      } else if (activeLegalTab === 'privacy') {
        title = '개인정보처리방침 | NuTube (뉴튜브)';
        description = '상상아트가 서비스하는 NuTube 플랫폼의 개인정보처리방침 및 구글 애드센스(Google AdSense) 제3자 쿠키 사용 안내 문서입니다.';
      } else if (activeLegalTab === 'terms') {
        title = '이용약관 | NuTube (뉴튜브)';
        description = '상상아트 NuTube 서비스의 이용약관 및 크리에이터 이용 수칙 가이드라인입니다.';
      } else if (activeLegalTab === 'partnership') {
        title = '제휴 및 비즈니스 문의 | NuTube (뉴튜브)';
        description = '유튜브 실전 미디어 NuTube 협업 문의 및 상상아트 공식 비즈니스 파트너십 제안 페이지입니다.';
      } else if (activeLegalTab === 'announcements') {
        title = '새소식 및 공지사항 | NuTube (뉴튜브)';
        description = 'NuTube의 공지사항 및 유튜브 알고리즘 패치 노트 등 중요 변경 및 새소식을 알립니다.';
      }
    }

    // React 단에서 document.title 및 meta 태그 업데이트
    document.title = title;

    // meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // OpenGraph Image
    let ogImgMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImgMeta) {
      ogImgMeta = document.createElement('meta');
      ogImgMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgMeta);
    }
    ogImgMeta.setAttribute('content', ogImage);

    // OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', url);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // ──────────────────────────────────────────────────────────
    // JSON-LD 4종 동적 구조화 데이터 빌드
    // ──────────────────────────────────────────────────────────
    const jsonLdList: any[] = [];

    // 1. WebSite
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'NuTube',
      'url': 'https://www.nutube.kr',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://www.nutube.kr/blog?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });

    // 2. Organization (대표자 실명 제외 필수!)
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': '상상아트',
      'url': 'https://www.nutube.kr',
      'logo': 'https://www.nutube.kr/logo.png',
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': 'apark12321@gmail.com',
        'contactType': 'customer support'
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '인천광역시 서구 크리스탈로 100',
        'addressLocality': '인천광역시',
        'addressCountry': 'KR'
      },
      'founder': {
        '@type': 'Organization',
        'name': '상상아트'
      }
    });

    // 3. BreadcrumbList
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': '홈',
        'item': 'https://www.nutube.kr/'
      }
    ];

    if (selectedPost) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 2,
        'name': selectedPost.categoryLabel || '라이브러리',
        'item': `https://www.nutube.kr/category/${selectedPost.category}`
      });
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 3,
        'name': selectedPost.title,
        'item': `https://www.nutube.kr/blog/${selectedPost.slug}`
      });
    } else if (currentTab === 'generator') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 2,
        'name': 'AI 메타데이터 생성기',
        'item': 'https://www.nutube.kr/publish'
      });
    } else if (currentTab === 'guides') {
      if (selectedCategory !== 'all') {
        const catSpec = CATEGORIES.find(c => c.key === selectedCategory);
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': 2,
          'name': catSpec ? catSpec.label : '가이드',
          'item': `https://www.nutube.kr/category/${selectedCategory}`
        });
      } else {
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': 2,
          'name': '가이드 라이브러리',
          'item': 'https://www.nutube.kr/blog'
        });
      }
    } else if (currentTab === 'legal') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 2,
        'name': activeLegalTab === 'about' ? '소개' : (activeLegalTab === 'privacy' ? '개인정보처리방침' : '안내'),
        'item': `https://www.nutube.kr/${activeLegalTab === 'about' ? 'about' : activeLegalTab}`
      });
    }

    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    });

    // 4. Article (본문 읽는 상태일 때만)
    if (selectedPost) {
      jsonLdList.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': selectedPost.title,
        'alternativeHeadline': selectedPost.subtitle,
        'image': ogImage,
        'author': {
          '@type': 'Organization',
          'name': 'NuTube 편집팀',
          'url': 'https://www.nutube.kr'
        },
        'genre': selectedPost.categoryLabel,
        'keywords': selectedPost.tags ? selectedPost.tags.join(' ') : '유튜브 가이드',
        'publisher': {
          '@type': 'Organization',
          'name': '상상아트',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.nutube.kr/logo.png'
          }
        },
        'url': `https://www.nutube.kr/blog/${selectedPost.slug}`,
        'datePublished': selectedPost.publishedAt || '2026-04-28',
        'dateCreated': selectedPost.publishedAt || '2026-04-28',
        'dateModified': selectedPost.updatedAt || selectedPost.publishedAt || '2026-04-28',
        'description': selectedPost.summary || selectedPost.title,
        'articleBody': selectedPost.content || selectedPost.summary
      });
    }

    // script 태그 제거 및 재생성 주입
    let scriptTag = document.getElementById('ld-json-seo');
    if (scriptTag) {
      scriptTag.remove();
    }
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'ld-json-seo');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.innerHTML = JSON.stringify(jsonLdList);
    document.head.appendChild(scriptTag);

  }, [location, selectedPost, currentTab, selectedCategory, activeLegalTab]);

  const handleLike = (slug: string) => {
    let next: string[];
    if (likedPosts.includes(slug)) {
      next = likedPosts.filter(s => s !== slug);
      showToast('좋아요가 취소되었습니다.');
    } else {
      next = [...likedPosts, slug];
      showToast('이 인사이트를 추천했습니다! ❤️');
    }
    setLikedPosts(next);
    localStorage.setItem('nutube_liked_posts', JSON.stringify(next));
  };

  // Scroll to top on tab change via router push
  const navigateToTab = (tab: 'home' | 'guides' | 'generator' | 'legal') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'guides') {
      navigate('/blog');
    } else if (tab === 'generator') {
      navigate('/publish');
    } else if (tab === 'legal') {
      navigate('/about');
    }
  };

  const handleShare = (post: GuidePost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: url
      }).catch(() => {
        // Fallback to copy
        copyToClipboard(url, '주소를 클립보드에 복사했습니다!');
      });
    } else {
      copyToClipboard(url, '주소를 클립보드에 복사했습니다!');
    }
  };

  const copyToClipboard = (text: string, successMsg: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      // Fallback prompt
      window.prompt('아래 주소를 복사하세요:', text);
    });
  };

  // Run Local Metadata Generator
  const handleGenerateMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatorKeyword.trim()) {
      showToast('키워드나 영상 주제를 먼저 입력해 주세요!');
      return;
    }

    setIsGenerating(true);
    setGeneratorSubTab('titles'); // reset sub tab
    
    // Simulate high-end calculations
    setTimeout(() => {
      const result = generateMetadataLocal(generatorKeyword);
      setGeneratorResult(result);
      setIsGenerating(false);
      showToast('⚡ 오리지널 알고리즘 분석 및 AI 메타데이터가 생성되었습니다!');
    }, 1200);
  };

  // Quick keywords template triggers
  const handleTriggerQuickKeyword = (kw: string) => {
    setGeneratorKeyword(kw);
    // Auto submit feeling
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateMetadataLocal(kw);
      setGeneratorResult(result);
      setIsGenerating(false);
      showToast(`'${kw}' 최적화 분석을 가져왔습니다.`);
    }, 800);
  };

  // Filtering posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate read time metric correctly if not present
  const getReadTime = (post: GuidePost) => {
    if (post.readTime) return post.readTime;
    const wordCount = post.content.length;
    const min = Math.max(1, Math.ceil(wordCount / 500));
    return `${min}분`;
  };

  // Top trending posts on home (using 3 handchosen top indicators)
  const trendingPosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg text-[#2d362f] pb-20 leading-snug flex flex-col font-sans selection:bg-neon-lime selection:text-white">
      
      {/* Dynamic Toast Element */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            id="toast-notification"
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-3.5 bg-brand-card border-2 border-neon-lime text-slate-900 text-xs sm:text-sm font-semibold rounded-xl shadow-[0_4px_20px_rgba(36,94,60,0.15)] flex items-center gap-3 break-keep max-w-[90vw] sm:max-w-md"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-neon-lime animate-pulse" />
            <span className="flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Live Status Indicator */}
      <div className="w-full bg-brand-dark border-b border-brand-border py-2.5 px-4 text-center text-xs text-slate-700 select-none flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neon-lime/10 text-neon-lime font-mono text-[10px] uppercase font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-ping" />
          라이브
        </span>
        <span className="tracking-tight text-slate-700 font-semibold">NuTube 2026 개정 유튜브 검색 가이드라인 & 크리에이터 최적화 양식 적용 완료</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => navigateToTab('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="header-logo-container"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-neon-lime to-emerald-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-display font-extrabold text-lg sm:text-2xl tracking-tighter">N</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tighter group-hover:text-neon-lime transition-colors">NuTube</span>
                <span className="text-[10px] text-neon-lime font-mono font-bold">v2.5</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-600 font-sans tracking-tight leading-none break-keep hidden sm:block">크리에이터 지식 아카이브</p>
            </div>
          </div>

          {/* Desktop Navigation Link */}
          <nav className="hidden md:flex items-center gap-2.5 font-semibold text-sm">
            <button 
              onClick={() => navigateToTab('home')}
              className={`px-4 py-2.5 rounded-xl transition-all ${currentTab === 'home' ? 'text-white bg-neon-lime shadow-md' : 'text-slate-700 hover:text-slate-900 hover:bg-brand-dark'}`}
            >
              메인 홈
            </button>
            <button 
              onClick={() => navigateToTab('guides')}
              className={`px-4 py-2.5 rounded-xl transition-all ${currentTab === 'guides' ? 'text-white bg-neon-lime shadow-md' : 'text-slate-700 hover:text-slate-900 hover:bg-brand-dark'}`}
            >
              인사이트 라이브러리
            </button>
            <button 
              onClick={() => navigateToTab('generator')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${currentTab === 'generator' ? 'text-white bg-neon-lime shadow-md' : 'text-neon-lime hover:text-white hover:bg-neon-lime'}`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              AI 메타 생성기
            </button>
            <button 
              onClick={() => navigateToTab('legal')}
              className={`px-4 py-2.5 rounded-xl transition-all ${currentTab === 'legal' ? 'text-white bg-neon-lime shadow-md' : 'text-slate-700 hover:text-slate-900 hover:bg-brand-dark'}`}
            >
              운영 및 정보
            </button>
          </nav>

          {/* Mobile and Right Quick Master Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateToTab('generator')}
              className="px-3.5 py-2 rounded-xl bg-neon-lime text-white font-bold text-xs flex items-center gap-1.5 md:hidden shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
              AI 생성기
            </button>
            
            {/* Operator Quick View Info Link */}
            <button
              onClick={() => {
                navigateToTab('legal');
                setActiveLegalTab('about');
              }}
              className="w-10 h-10 rounded-xl border border-brand-border bg-brand-card flex items-center justify-center text-slate-700 hover:text-neon-lime hover:border-slate-400 transition-all shadow-sm"
              title="운영 정부 보기"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="grid grid-cols-4 border-t border-brand-border bg-brand-dark md:hidden text-center text-xs font-bold font-sans">
          <button 
            onClick={() => navigateToTab('home')}
            className={`py-3.5 ${currentTab === 'home' ? 'text-neon-lime border-b-2 border-neon-lime bg-white' : 'text-slate-500'}`}
          >
            홈
          </button>
          <button 
            onClick={() => navigateToTab('guides')}
            className={`py-3 ${currentTab === 'guides' ? 'text-neon-lime border-b-2 border-neon-lime bg-brand-card' : 'text-slate-600'}`}
          >
            인사이트
          </button>
          <button 
            onClick={() => navigateToTab('generator')}
            className={`py-3 ${currentTab === 'generator' ? 'text-neon-lime border-b-2 border-neon-lime bg-brand-card' : 'text-slate-600'}`}
          >
            생성기
          </button>
          <button 
            onClick={() => navigateToTab('legal')}
            className={`py-3 ${currentTab === 'legal' ? 'text-neon-lime border-b-2 border-neon-lime bg-brand-card' : 'text-slate-600'}`}
          >
            정보
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-12">

        {currentTab === 'home' && !selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* HERO SECTION */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-brand-bg to-brand-dark p-6 sm:p-12 border border-brand-border shadow-md flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="absolute top-0 right-0 w-80 h-80 bg-neon-lime/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e2eedf] border border-brand-border text-neon-lime text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#1e4d30] animate-ping" />
                  실시간 유튜브 로드맵 43편 탑재 완료
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug break-keep">
                  유튜브, 감으로 하지 마세요. <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime to-emerald-800">데이터와 신뢰</span>로 키우세요.
                </h1>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-xl break-keep mx-auto md:mx-0 font-medium">
                  수많은 유튜버의 카더라 통신에서 비롯된 저품질 양산 패턴을 버리고, 
                  구글 검색엔진 최적화(SEO)와 오디언스 만족 중심의 검증된 1% 노하우 라이브러리를 살펴보십시오.
                </p>

                {/* Human-centric value descriptors: 신뢰, 알고리즘, 노하우 */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0 pt-2 text-center text-xs font-bold">
                  <div className="p-2.5 rounded-xl bg-white border border-brand-border shadow-sm">
                    <span className="text-neon-lime text-sm block mb-1">신뢰 100%</span>
                    <span className="text-slate-600 text-[10px] font-semibold leading-none block break-keep">정량적 분석 검증</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-brand-border shadow-sm">
                    <span className="text-emerald-700 text-sm block mb-1">알고리즘 우선</span>
                    <span className="text-slate-600 text-[10px] font-semibold leading-none block break-keep">구글 만족도 최적화</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-brand-border shadow-sm">
                    <span className="text-neon-coral text-sm block mb-1">실전 노하우</span>
                    <span className="text-slate-600 text-[10px] font-semibold leading-none block break-keep">대본 작성 및 편집 팁</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                  <button 
                    onClick={() => navigateToTab('guides')}
                    className="px-6 py-3 rounded-xl bg-neon-lime text-white border border-neon-lime-hover font-extrabold text-sm hover:bg-neon-lime-hover transition-all flex items-center gap-2 shadow-sm"
                  >
                    가이드 라이브러리 보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigateToTab('generator')}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-brand-dark text-slate-800 border border-brand-border font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
                  >
                    AI 메타생성기 즉시 체험
                    <Zap className="w-4 h-4 text-neon-lime" />
                  </button>
                </div>
              </div>

              {/* Graphic Mock Widget / Isometric Dashboard Box */}
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-md space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-brand-border pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neon-lime" />
                      <span className="font-bold text-slate-800">대시보드 실시간 측정</span>
                    </div>
                    <span className="text-[10px] text-slate-500">활성화됨</span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-brand-bg/90 p-2.5 rounded-lg border border-brand-border/45">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>평균 시청 지속 시간</span>
                        <span className="text-neon-lime font-bold">67.4%</span>
                      </div>
                      <div className="w-full bg-[#e2e7df] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-neon-lime h-full rounded-full" style={{ width: '67.4%' }} />
                      </div>
                    </div>

                    <div className="bg-brand-bg/90 p-2.5 rounded-lg border border-brand-border/45">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>검색 노출 최적화 점수</span>
                        <span className="text-neon-coral font-bold">94.8%</span>
                      </div>
                      <div className="w-full bg-[#f9e2df] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-neon-coral h-full rounded-full" style={{ width: '94.8%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic interactive mock quick generator */}
                  <div className="pt-1">
                    <p className="text-[10px] text-slate-500 font-bold mb-1.5">★ 실시간 추천 시퀀스 테스트</p>
                    <div className="flex gap-1">
                      <button onClick={() => handleTriggerQuickKeyword('알고리즘')} className="flex-1 py-1 rounded bg-[#eef1eb] hover:bg-neon-lime hover:text-white transition-colors text-[10px] font-bold text-center text-slate-800">알고리즘</button>
                      <button onClick={() => handleTriggerQuickKeyword('시니어 사연')} className="flex-1 py-1 rounded bg-[#eef1eb] hover:bg-neon-lime hover:text-white transition-colors text-[10px] font-bold text-center text-slate-800">시니어 사연</button>
                      <button onClick={() => handleTriggerQuickKeyword('수익화')} className="flex-1 py-1 rounded bg-[#eef1eb] hover:bg-neon-lime hover:text-white transition-colors text-[10px] font-bold text-center text-slate-800">수익화</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900">
                  맞춤형 크리에이터 인사이트 카테고리
                </h2>
                <p className="text-sm text-slate-600 break-keep">
                  초보 입문부터 정밀 알고리즘 세팅까지, 6대 전문화 카테고리 속에서 나만의 최적화를 설계해보세요.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat.key}
                    onClick={() => {
                      navigate(`/category/${cat.key}`);
                    }}
                    className="p-5 rounded-2xl bg-white border border-brand-border hover:border-neon-lime/40 cursor-pointer shadow-sm group hover:scale-[1.01] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl`}>
                          {cat.icon}
                        </div>
                        <span className="text-[10px] text-neon-lime font-mono font-bold tracking-widest px-2.5 py-1 bg-[#e2eedf] border border-brand-border rounded-full">
                          {cat.count}편 수록
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-neon-lime transition-colors">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-slate-600 leading-normal break-keep">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-border/40 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{cat.persona.split(' ')[0]} 톤</span>
                      <span className="group-hover:text-neon-lime flex items-center gap-1 transition-colors">
                        둘러보기 <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRENDING GUIDES TOP 3 CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* TOP 3 Left Card Intro */}
              <div className="lg:col-span-1 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-white to-brand-bg border border-brand-border flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neon-lime/10 text-neon-lime flex items-center justify-center font-bold">
                    ★
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug break-keep">인사이트 라이브러리 <br />인기 TOP 3 랭킹</h3>
                  <p className="text-xs text-slate-600 leading-normal break-keep">
                    독자분들과 시니어 유튜버들 사이에서 가장 뜨겁고 깊은 피드백을 기록한 3대 메인 템플릿입니다. 이 글들만 정독해도 애드센스 심률과 노출량이 급상승합니다.
                  </p>
                </div>
                <button 
                  onClick={() => navigateToTab('guides')}
                  className="font-bold text-xs text-neon-lime flex items-center gap-1.5 hover:underline"
                >
                  43개 전체 가이드 목록 가기
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* TOP 3 Render Block */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingPosts.slice(0, 2).map((post, idx) => (
                  <div 
                    key={post.slug}
                    onClick={() => {
                      navigate(`/blog/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-5 rounded-2xl bg-white border border-brand-border hover:border-neon-lime/40 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neon-lime/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-display font-black text-slate-300 group-hover:text-neon-lime transition-colors">
                          0{idx + 1}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-mono font-bold px-2 py-0.5 bg-[#e2eedf] rounded">
                          {post.categoryLabel}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-neon-lime transition-colors leading-snug break-keep">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-brand-border/40 text-[10px] text-slate-500 font-mono">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{getReadTime(post)} 읽기</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* QUICK AI WEB banner block */}
            <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-brand-dark via-white to-brand-bg border border-brand-border text-center space-y-4 relative overflow-hidden shadow-md">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-lime/5 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-xl mx-auto space-y-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fae5e1] border border-brand-border text-neon-coral text-[10px] font-mono uppercase font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  프리미엄 대화형 AI 도구
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug break-keep">
                  제목 · 설명 · 태그 및 시나리오 숏폼 대본을 <br />
                  5초 만에 완벽하게 추출하는 AI 생성 마스터
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 font-medium leading-normal break-keep">
                  어색한 AI 양식이나 수식이 붙어 나오는 패턴을 완전히 해결한 고도화 알고리즘입니다. 
                  주요 핵심 키워드를 넣으면 고유 CTR과 숏콘텐츠 기획까지 실시간으로 출력합니다.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => navigateToTab('generator')}
                    className="px-6 py-3 rounded-xl bg-neon-lime hover:bg-neon-lime-hover text-white font-extrabold text-sm transition-all shadow-sm inline-flex items-center gap-2"
                  >
                    마스터 도구 바로 시작하기
                    <Zap className="w-4 h-4 fill-current animate-pulse" />
                  </button>
                </div>
              </div>
            </div>

            {/* RECENT GUIDES PREVIEW FEED */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-neon-lime" />
                    최신 크리에이터 가이드북 피드
                  </h3>
                  <p className="text-xs text-slate-500 break-keep">최근 5월에 업데이트된 신규 라이브러리 가이드 팩트체크 리스트</p>
                </div>
                <button 
                  onClick={() => navigateToTab('guides')}
                  className="text-xs font-bold text-neon-lime hover:underline flex items-center gap-1"
                >
                  43개 글 모두 보기 <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.slice(0, 4).map(post => (
                  <div 
                    key={post.slug}
                    onClick={() => {
                      navigate(`/blog/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-border/80 cursor-pointer transition-all duration-300 flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-brand-bg text-slate-800 text-[10px] font-bold">
                          {post.categoryLabel}
                        </span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-neon-lime transition-colors leading-snug break-keep">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] text-slate-700 bg-brand-dark px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-border/40 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-neon-lime" /> {post.author}
                      </span>
                      <span>{getReadTime(post)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: ALL INSIGHT GUIDES LIBRARY */}
        {currentTab === 'guides' && !selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Page Header */}
            <div className="space-y-4 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                인사이트 가이드 라이브러리
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl break-keep">
                유튜브 추천 알고리즘의 동작 방식부터 시니어 맞춤 감성스토리, AI 대본 저작권 가이드라인까지, 
                NuTube에서 엄선한 최고의 팩트체크 지식 카드 32선이 모두 보관되어 있습니다.
              </p>
            </div>

            {/* Filter and Search Action Block */}
            <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Category buttons slider */}
              <div className="flex flex-wrap items-center gap-1.5" id="category-selector-strip">
                <button
                  onClick={() => navigate('/blog')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${selectedCategory === 'all' ? 'bg-neon-lime text-white' : 'bg-white text-slate-700 hover:text-neon-lime hover:border-neon-lime/40 border border-brand-border shadow-sm'}`}
                >
                  전체보기
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => navigate(`/category/${cat.key}`)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${selectedCategory === cat.key ? 'bg-neon-lime text-white' : 'bg-white text-slate-700 hover:text-neon-lime hover:border-neon-lime/40 border border-brand-border shadow-sm'}`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              {/* Search text input */}
              <div className="relative w-full lg:w-72" id="search-input-wrapper">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="제목, 요약, 태그 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-brand-border text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-lime focus:border-neon-lime transition-all"
                />
              </div>

            </div>

            {/* Posts Grid List */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => {
                  const catInfo = CATEGORIES.find(c => c.key === post.category);
                  const gradientStr = catInfo ? catInfo.gradient : 'from-indigo-600 to-indigo-800';
                  const iconStr = catInfo ? catInfo.icon : '📄';

                  return (
                    <div 
                      key={post.slug}
                      onClick={() => {
                        navigate(`/blog/${post.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-2xl bg-brand-card border border-brand-border hover:border-slate-500/50 cursor-pointer shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full overflow-hidden group"
                    >
                      {/* Premium SVG Thumbnail Image from NuTube design language */}
                      <div className="aspect-[16/10] w-full relative overflow-hidden bg-brand-dark border-b border-brand-border">
                        <img 
                          src={`/thumbnails/${post.slug}.svg`} 
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-tr p-4 flex flex-col justify-between overflow-hidden">
                          {/* Fallback gradient layout in case image fails to load */}
                          <div className={`absolute inset-0 bg-gradient-to-tr ${gradientStr}`} />
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full z-10" />
                          <span className="text-2xl sm:text-3xl relative z-10">{iconStr}</span>
                          <div className="relative z-20 text-white font-mono text-[9px] uppercase tracking-widest font-black uppercase text-white/80 select-none">
                            NuTube.kr · {post.categoryLabel}
                          </div>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-neon-lime font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-neon-lime/10">
                            {post.categoryLabel}
                          </span>
                          
                          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-neon-lime transition-colors word-break break-keep line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            {post.summary}
                          </p>
                        </div>

                        {/* tags and metric footers */}
                        <div className="space-y-3 pt-3 border-t border-brand-border/40">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] text-slate-600 bg-brand-dark px-2 py-0.5 rounded font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
                            </span>
                            <span>{getReadTime(post)} 읽기</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">동작하는 가이드가 없습니다</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto break-keep">이 카테고리나 검색어에 맞는 글을 찾지 못했습니다. 카테고리를 전체보기로 재설정하고 검색을 다시 시도해 보세요.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-neon-lime text-white border border-neon-lime-hover hover:bg-neon-lime-hover font-extrabold text-xs cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: RESTORED FULL-WORKSPACE AI METADATA MASTER (메타데이터 생성기) */}
        {currentTab === 'generator' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Page Header */}
            <div className="space-y-3 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-[10px] font-mono uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                크리에이터 AI 워크스페이스 v15.0 구축 완료
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                ⚡ AI 유튜브 메타데이터 생성 마스터
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl break-keep font-medium">
                복잡한 AI 생성 템플릿의 흔적, 중복 서수, 깨지는 마크다운, 요리 등 미스매칭 톤을 원천 차단했습니다.
                실제 알고리즘에 가점을 부여받는 고품질 타이틀과 대화형 숏폼 대본을 실시간으로 가져갑니다.
              </p>
            </div>

            {/* MAIN LIME-THEMED WORKSPACE CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form Selection / Input Panel (12 cols grid: 4 cols) */}
              <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border-2 border-brand-border hover:border-neon-lime/40 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon-lime fill-current" />
                    주제 및 키워드 주입
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal break-keep font-medium">최고의 정량 가치 결과물이 자동으로 계산되어 도출됩니다.</p>
                </div>

                <form onSubmit={handleGenerateMetadata} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-700 font-bold block">유튜브 대주제 / 핵심 키워드</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 부동산 세금 절세, 시니어 스마트폰, 요리..."
                      value={generatorKeyword}
                      onChange={e => setGeneratorKeyword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-neon-lime focus:border-transparent transition-all font-sans font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-3 rounded-xl bg-neon-lime hover:bg-neon-lime-hover disabled:bg-slate-700 disabled:text-slate-400 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>특급 알고리즘 계산 중...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current animate-pulse" />
                          <span>⚡ 5초 만에 신비로운 최적화 추출</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick test templates shortcuts list */}
                <div className="space-y-3 pt-4 border-t border-brand-border/40 text-xs">
                  <div className="text-slate-700 font-bold">★ 즉시 사용해보는 추천 테마 리스트</div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleTriggerQuickKeyword('유튜브 알고리즘 추천')}
                      className="text-left p-2.5 rounded-lg bg-brand-bg hover:bg-brand-border transition-colors flex items-center justify-between text-slate-700 font-semibold cursor-pointer"
                    >
                      <span>🎯 알고리즘 추천 로직</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neon-lime" />
                    </button>
                    <button 
                      onClick={() => handleTriggerQuickKeyword('시니어 사연 라디오')}
                      className="text-left p-2.5 rounded-lg bg-brand-bg hover:bg-brand-border transition-colors flex items-center justify-between text-slate-700 font-semibold cursor-pointer"
                    >
                      <span>👴 시니어 감동 사연</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neon-lime" />
                    </button>
                    <button 
                      onClick={() => handleTriggerQuickKeyword('챗GPT로 쇼츠 월 매출 가설')}
                      className="text-left p-2.5 rounded-lg bg-brand-bg hover:bg-brand-border transition-colors flex items-center justify-between text-slate-700 font-semibold cursor-pointer"
                    >
                      <span>🤖 AI 도구 및 대본 제작</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neon-lime" />
                    </button>
                    <button 
                      onClick={() => handleTriggerQuickKeyword('개인과세 사업자 세제 혜택')}
                      className="text-left p-2.5 rounded-lg bg-brand-bg hover:bg-brand-border transition-colors flex items-center justify-between text-slate-700 font-semibold cursor-pointer"
                    >
                      <span>💰 애드센스 다각화 수익화</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neon-lime" />
                    </button>
                  </div>
                </div>

                {/* Creator Core Ego Badge */}
                <div className="p-3.5 bg-brand-dark/80 rounded-xl border border-brand-border/50 text-[11px] text-slate-600 space-y-1 font-sans leading-relaxed font-medium">
                  <p className="font-bold text-neon-lime">📌 NuTube 통합 아카이브 원칙 반영 중</p>
                  <p>A 정체성: 복잡한 유튜브 로직을 가시적인 수치로 증명하는 든든한 사업 동반자</p>
                  <p>B 신념: 기술과 자동화는 도구일 뿐, 승인은 정성스러운 인간의 흔적에 달려있다.</p>
                </div>

              </div>

              {/* Right Results Dashboard Output (12 cols grid: 8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {generatorResult ? (
                  <div className="space-y-6">
                    
                    {/* Horizontal sub tab navigation */}
                    <div className="flex flex-wrap border-b border-brand-border bg-brand-card p-1 rounded-xl">
                      <button
                        onClick={() => setGeneratorSubTab('titles')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'titles' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        제목 8선
                      </button>
                      <button
                        onClick={() => setGeneratorSubTab('description')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'description' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        채널 설명
                      </button>
                      <button
                        onClick={() => setGeneratorSubTab('tags')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'tags' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        추천 태그
                      </button>
                      <button
                        onClick={() => setGeneratorSubTab('storyboard')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'storyboard' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        스토리보드
                      </button>
                      <button
                        onClick={() => setGeneratorSubTab('thumbnails')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'thumbnails' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        썸네일 컨셉
                      </button>
                      <button
                        onClick={() => setGeneratorSubTab('shorts')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${generatorSubTab === 'shorts' ? 'bg-neon-lime text-white shadow' : 'text-slate-600 hover:text-neon-lime hover:bg-brand-bg/60'}`}
                      >
                        쇼츠 대본
                      </button>
                    </div>

                    {/* SUBTAB CONTENT 1: TITLE SANDBOX */}
                    {generatorSubTab === 'titles' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <span>제목 심리학 분석 (8개 후보군)</span>
                            <span className="text-[10px] bg-neon-lime/10 text-neon-lime px-2 py-0.5 rounded font-mono">가장 높은 CTR 획득 지표</span>
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">"{generatorResult.keyword}" 검색 매칭</span>
                        </div>

                        <div className="space-y-3">
                          {generatorResult.titles.map((t, idx) => (
                            <div 
                              key={idx}
                              className="p-4 rounded-xl bg-white border border-brand-border hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="space-y-1.5 flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-neon-lime uppercase px-2 py-0.5 bg-neon-lime/5 border border-neon-lime/15 rounded">
                                    {t.type}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-semibold">CTR {t.ctr}% 추정</span>
                                </div>
                                <p className="font-extrabold text-slate-800 text-sm sm:text-base selection:bg-neon-lime selection:text-white word-break break-all leading-snug">
                                  {t.title}
                                </p>
                                <p className="text-[11px] text-slate-600 leading-normal mb-1 font-medium">
                                  {t.reason}
                                </p>
                              </div>

                              <button
                                onClick={() => copyToClipboard(t.title, '선택한 제목이 복사되었습니다!')}
                                className="px-3 py-1.5 rounded-lg bg-[#f0f2ed] text-[11px] font-bold text-slate-700 hover:text-white hover:bg-neon-lime transition-colors flex items-center gap-1.5 outline-none cursor-pointer border border-[#d6dbce]"
                              >
                                <Copy className="w-3 h-3" />
                                복사
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* SUBTAB CONTENT 2: VIDEO DESCRIPTION */}
                    {generatorSubTab === 'description' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            스마트 채널 설명란 템플릿
                          </h4>
                          <button
                            onClick={() => copyToClipboard(generatorResult.description, '설명란 텍스트가 전체 복사되었습니다.')}
                            className="px-3 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-hover text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-neon-lime-hover"
                          >
                            <Copy className="w-3.5 h-3.5 fill-current" />
                            전체 복사
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-brand-border font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 select-text selection:bg-neon-lime selection:text-white shadow-sm">
                          {generatorResult.description}
                        </div>
                      </motion.div>
                    )}

                    {/* SUBTAB CONTENT 3: 추천 태그 (TAGS CLOUD) */}
                    {generatorSubTab === 'tags' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            SEO 가중치 추천 키워드 (14종류)
                          </h4>
                          <button
                            onClick={() => copyToClipboard(generatorResult.tags.join(', '), '컴마로 구분된 모든 태그가 복사되었습니다.')}
                            className="px-3 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-hover text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-neon-lime-hover"
                          >
                            <Copy className="w-3.5 h-3.5 fill-current" />
                            태그 콤마 복사
                          </button>
                        </div>

                        <p className="text-xs text-slate-650 font-medium break-keep leading-tight">
                          첫 단어 알고리즘 가중치를 보전하고, 시청자의 다양한 검색 의도(정보, 비교, 타겟)를 6가지 분류로 나누어 채워 넣었습니다. 
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {generatorResult.tags.map((tag, idx) => (
                            <div 
                              key={idx}
                              onClick={() => copyToClipboard(tag, `'${tag}' 복사됨`)}
                              className="p-2.5 rounded-xl bg-white border border-brand-border hover:border-neon-lime/40 text-xs text-center font-bold text-slate-700 cursor-pointer transition-colors flex items-center justify-center gap-1 group shadow-sm"
                            >
                              <span className="text-neon-lime select-none">#</span>
                              <span className="group-hover:text-neon-lime transition-colors">{tag}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* SUBTAB CONTENT 4: 5단계 영상 스토리보드 */}
                    {generatorSubTab === 'storyboard' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            5단계 영상 스토리보드 & 씬 구성안
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">60초 최적 배치</span>
                        </div>

                        <div className="space-y-3">
                          {generatorResult.storyboard.map((item, idx) => (
                            <div 
                              key={idx}
                              className="p-4 rounded-xl bg-white border border-brand-border space-y-2.5 shadow-sm"
                            >
                              <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                                <span className="font-extrabold text-neon-lime text-xs sm:text-sm">
                                  {item.scene}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono bg-brand-bg px-2 py-0.5 rounded font-bold">
                                  {item.timing}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-slate-600 font-bold block mb-1">🎬 화면 연출 (Visual Guide)</span>
                                  <p className="text-slate-700 font-medium leading-normal break-keep bg-[#fcfdfa] p-2 rounded border border-brand-border/30">
                                    {item.visual}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-600 font-bold block mb-1">🎙️ 오디오 내레이션 (Audio Script)</span>
                                  <p className="text-slate-700 font-medium leading-normal break-keep bg-[#fcfdfa] p-2 rounded border border-brand-border/30 font-mono selection:bg-neon-lime selection:text-white">
                                    {item.audio}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* SUBTAB CONTENT 5: 썸네일 기획 아이디어 */}
                    {generatorSubTab === 'thumbnails' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                          썸네일 기획 레이아웃 및 카피 문구 추천 (3종)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {generatorResult.thumbnails.map((item, idx) => (
                            <div 
                              key={idx}
                              className="p-4 rounded-xl bg-white border border-brand-border hover:border-slate-350 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className="text-neon-coral font-bold">TYPE 0{idx + 1}</span>
                                  <span className="text-slate-500 font-semibold">1200 × 630 px</span>
                                </div>

                                {/* LIVE VECTOR THUMBNAIL RENDERER */}
                                {(() => {
                                  // Map detected domain or fallback
                                  let catKey: CategoryKey = 'algorithm';
                                  const kw = generatorKeyword.toLowerCase();
                                  if (kw.includes('알고리즘') || kw.includes('algorithm') || kw.includes('seo') || kw.includes('노출') || kw.includes('추천')) {
                                    catKey = 'algorithm';
                                  } else if (kw.includes('시니어') || kw.includes('senior') || kw.includes('사연') || kw.includes('나이') || kw.includes('실버')) {
                                    catKey = 'senior';
                                  } else if (kw.includes('도구') || kw.includes('aitools') || kw.includes('목소리') || kw.includes('tts') || kw.includes('자동')) {
                                    catKey = 'aitools';
                                  } else if (kw.includes('수익') || kw.includes('돈') || kw.includes('애드센스') || kw.includes('광고') || kw.includes('협찬')) {
                                    catKey = 'monetization';
                                  } else if (kw.includes('초보') || kw.includes('시작') || kw.includes('왕초보') || kw.includes('beginner') || kw.includes('세팅') || kw.includes('장비')) {
                                    catKey = 'beginner';
                                  } else {
                                    catKey = 'advanced';
                                  }

                                  // Format short title
                                  let tempTitle = item.titleText || '유튜브';
                                  if (tempTitle.length > 10) {
                                    tempTitle = tempTitle.substring(0, 9) + '..';
                                  }
                                  
                                  const tempSubText = generatorKeyword ? (generatorKeyword.length > 14 ? generatorKeyword.substring(0, 13) + '..' : generatorKeyword) : '실전 AI 특급 가이드';
                                  const svgId = `custom-gen-${idx}`;
                                  const svgMarkup = renderThumbnailSvg(svgId, tempTitle, tempSubText, catKey);

                                  return (
                                    <div className="space-y-2">
                                      <div 
                                        className="w-full aspect-[1.91] rounded-lg overflow-hidden border border-brand-border/60 bg-brand-bg select-none shadow-sm"
                                        dangerouslySetInnerHTML={{ __html: svgMarkup }}
                                      />
                                      <div className="flex items-center gap-1.5 justify-end">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(svgMarkup);
                                          }}
                                          className="px-2 py-1 bg-brand-bg hover:bg-brand-border border border-brand-border rounded text-[10px] font-bold text-slate-700 transition cursor-pointer select-none"
                                          title="SVG 소스 복사"
                                        >
                                          소스 복사
                                        </button>
                                        <button
                                          onClick={() => {
                                            const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = `nutube-thumbnail-${idx+1}.svg`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                          }}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold transition cursor-pointer select-none"
                                          title="SVG 다운로드"
                                        >
                                          다운로드
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })()}

                                <div className="bg-brand-bg p-3 rounded-lg border border-brand-border/50 text-center space-y-1 select-none">
                                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">주요 카피문구</span>
                                  <span className="font-extrabold text-neon-lime text-xs sm:text-sm tracking-tight inline-block break-keep">
                                    {item.titleText}
                                  </span>
                                </div>

                                <div className="space-y-1 text-xs">
                                  <span className="text-slate-600 font-bold block">🎨 그래픽 요소</span>
                                  <p className="text-slate-700 font-medium leading-normal break-keep min-h-[3.5rem]">
                                    {item.graphic}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2.5 border-t border-brand-border/30 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                                <span>감성:</span>
                                <span className="text-purple-700 font-bold">{item.vibe}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* SUBTAB CONTENT 6: 쇼츠 60초 대본 */}
                    {generatorSubTab === 'shorts' && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            쇼츠 60초 다이내믹 기록 대본
                          </h4>
                          <button
                            onClick={() => {
                              const fulldialog = `[오프닝 훅]\n${generatorResult.shortsScript.hook}\n\n[실전 세부내용]\n${generatorResult.shortsScript.body}\n\n[결론 및 액션 유도]\n${generatorResult.shortsScript.cta}`;
                              copyToClipboard(fulldialog, '쇼츠 대본이 통째로 복사되었습니다!');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-hover text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-neon-lime-hover"
                          >
                            <Copy className="w-3.5 h-3.5 fill-current" />
                            전체 대본 복사
                          </button>
                        </div>

                        <div className="space-y-4 bg-white p-5 rounded-xl border border-brand-border text-xs leading-relaxed select-text font-sans shadow-sm">
                          <div className="space-y-1">
                            <span className="text-neon-coral font-bold uppercase tracking-wider text-[10px] block">01. 오프닝 훅 (0~10초)</span>
                            <p className="p-3 bg-[#f8faf6] text-slate-800 rounded-lg border border-brand-border/40 font-medium text-sm transition-all italic leading-relaxed selection:bg-neon-lime selection:text-black">
                              "{generatorResult.shortsScript.hook}"
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-neon-lime font-bold uppercase tracking-wider text-[10px] block font-mono">02. 실전 세부내용 (10~50초)</span>
                            <p className="p-3 bg-[#f8faf6] text-slate-800 rounded-lg border border-brand-border/40 text-sm leading-relaxed selection:bg-neon-lime selection:text-black">
                              {generatorResult.shortsScript.body}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] block">03. 결론 및 액션 유도 (50~60초)</span>
                            <p className="p-3 bg-[#f8faf6] text-slate-800 rounded-lg border border-brand-border/40 text-sm leading-relaxed selection:bg-neon-lime selection:text-black">
                              "{generatorResult.shortsScript.cta}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>
                ) : (
                  <div className="h-[28rem] rounded-2xl border-2 border-dashed border-brand-border bg-white flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-neon-lime/10 flex items-center justify-center font-display text-2xl text-neon-lime animate-pulse">
                      ⚡
                    </div>
                    <div className="max-w-xs space-y-1">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">대기 중인 마스터 패널</h4>
                      <p className="text-xs text-slate-600 leading-normal break-keep">
                        주입할 핵심 키워드를 기재하고 생성 버튼을 누르시면, 수식 버그 및 양산 흔적이 말끔히 제거된 최고 등급의 기획 데이터 포트폴리오를 제공하겠습니다.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 4: LEGAL & OPERATOR CREDENTIALS */}
        {currentTab === 'legal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Tab sub menus */}
            <div className="flex flex-wrap border-b border-brand-border">
              {(['about', 'privacy', 'terms', 'partnership', 'announcements'] as const).map(tab => {
                const labels = {
                  about: '소개 및 제작 원칙',
                  privacy: '개인정보처리방침',
                  terms: '서비스 이용약관',
                  partnership: '제휴 및 비즈니스 문의',
                  announcements: '공지사항 & 연혁'
                };
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      if (tab === 'about') navigate('/about');
                      else if (tab === 'privacy') navigate('/privacy');
                      else if (tab === 'terms') navigate('/terms');
                      else if (tab === 'partnership') navigate('/partnership');
                      else if (tab === 'announcements') navigate('/announcement');
                    }}
                    className={`py-3.5 px-4 font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all ${activeLegalTab === tab ? 'border-neon-lime text-neon-lime font-extrabold' : 'border-transparent text-slate-500 hover:text-neon-lime'}`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Rendered content */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-brand-border space-y-6 shadow-sm">

              {activeLegalTab === 'about' && (
                <div id="legal-about-view" className="space-y-6 select-text">
                  <h3 className="text-xl font-extrabold text-slate-800 border-b border-brand-border pb-3">NuTube 소개</h3>
                  
                  <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed break-keep">
                    <p className="font-semibold text-slate-800 text-sm sm:text-base bg-[#f8faf6] p-3 rounded-xl border border-brand-border">
                      유튜브 채널을 운영하면서 마주치는 진짜 문제들을, 검증된 데이터와 실전 경험으로 풀어드리는 미디어입니다.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">■ 다루는 주제</h4>
                      <p className="text-xs text-slate-600">NuTube는 다음 네 가지 주제에 집중합니다.</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                        <li><strong>유튜브 알고리즘</strong> - 추천 시스템의 작동 원리, CTR과 평균 시청 지속 시간의 균형</li>
                        <li><strong>시니어 사연 쇼츠</strong> - 시니어 타깃 사연·고민·체험담 쇼츠의 기획과 운영</li>
                        <li><strong>AI 도구</strong> - 대본, 음성, 이미지, 편집까지 유튜버에게 실제로 도움이 되는 도구</li>
                        <li><strong>영상 채널 수익화</strong> - 애드센스부터 멤버십, 슈퍼챗, 브랜드 협찬까지</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm pt-2">■ 콘텐츠 제작 원칙</h4>
                      <p className="text-xs text-slate-600">NuTube의 모든 가이드는 다음 원칙을 지킵니다.</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                        <li><strong>사실 검증</strong> - 정책, 알고리즘 변화, 도구 정보는 공식 출처를 우선 확인합니다.</li>
                        <li><strong>실전 우선</strong> - 이론만 나열하지 않고, 실제 채널 운영 관점에서 적용 가능한 형태로 정리합니다.</li>
                        <li><strong>중립성</strong> - 특정 도구나 서비스를 무조건적으로 추천하지 않습니다. 장단점을 함께 안내합니다.</li>
                        <li><strong>업데이트</strong> - 알고리즘이나 정책이 바뀌면 관련 글을 점검하고 갱신합니다.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm pt-2">■ 편집 검증 프로세스</h4>
                      <p className="text-xs text-slate-600">모든 가이드는 다음 검증을 거칩니다.</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                        <li><strong>일차 자료 확인</strong> - 유튜브 공식 발표, 크리에이터 인사이더, 신뢰할 수 있는 업계 리포트 우선 참고</li>
                        <li><strong>편집팀 검토</strong> - 사실관계 점검 + 가독성 다듬기</li>
                        <li><strong>독자 의견 반영</strong> - 이메일로 받은 정정 요청은 신속히 반영</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-950 text-sm pt-2">■ 다루지 않는 주제</h4>
                      <p className="text-xs text-slate-600">NuTube는 다음 주제는 다루지 않습니다.</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                        <li>알고리즘 우회·어뷰징 기법 (정책 위반 위험)</li>
                        <li>저작권 침해 소지가 있는 콘텐츠 제작 방법</li>
                        <li>특정 채널의 노출도·수익 등 개별 정보 (개인정보)</li>
                      </ul>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm pt-4 border-t border-brand-border/40">★ 정식 운영 및 등록 정보</h4>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm bg-brand-dark p-4 rounded-xl border border-brand-border/50 shadow-sm">
                      <div>
                        <dt className="text-slate-600 font-bold block">상호</dt>
                        <dd className="text-slate-800 font-semibold">{SITE_OPERATOR.name}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">사업자등록번호</dt>
                        <dd className="text-slate-800 font-semibold font-mono">{SITE_OPERATOR.registrationNum}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">통신판매업 신고</dt>
                        <dd className="text-slate-800 font-semibold font-mono">{SITE_OPERATOR.mailOrderNum}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">개업일</dt>
                        <dd className="text-slate-800 font-semibold font-mono">{SITE_OPERATOR.openingDate}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">업태/종목</dt>
                        <dd className="text-slate-800 font-semibold">{SITE_OPERATOR.businessType}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">사업장 주소</dt>
                        <dd className="text-slate-800 font-semibold">{SITE_OPERATOR.address}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">이메일</dt>
                        <dd className="text-slate-800 font-semibold font-mono">{SITE_OPERATOR.email}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-600 font-bold block">웹사이트</dt>
                        <dd className="text-slate-800 font-semibold font-mono">{SITE_OPERATOR.website}</dd>
                      </div>
                    </dl>
                    <p className="text-xs text-slate-500 mt-2">가이드 정정 요청, 제휴 문의, 게재 요청 등은 위 이메일로 보내주세요. 제휴 문의 안내도 확인하실 수 있습니다.</p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'privacy' && (
                <div id="legal-privacy-view" className="space-y-6 select-text max-h-[70vh] overflow-y-auto pr-2">
                  <h3 className="text-xl font-extrabold text-slate-800 border-b border-brand-border pb-3">개인정보처리방침</h3>
                  
                  <div className="space-y-5 text-[11px] sm:text-xs text-slate-700 leading-relaxed break-keep font-sans">
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60 font-semibold mb-4 leading-normal">
                      💡 정보보호 안내: NuTube는 회원 가입이나 별도의 본인인증이 없는 완전 비회원제 서비스로 운영됩니다. 메타데이터 생성기를 포함한 모든 콘텐츠 도구는 귀하의 로컬 웹 브라우저에서 직접 계산 및 실행되며, 결과물이나 입력 정보가 서버로 전송되거나 축적되지 않기 때문에 안심하고 이용하실 수 있습니다.
                    </div>

                    <p className="text-slate-600">
                      상상아트(이하 '회사' 또는 '운영진')는 'NuTube' 서비스(이하 '서비스')의 투명한 운영을 위해 개인정보 관련 방침을 고지합니다. 본 방침은 서비스 내에서 수집되거나 이용자가 자유의사로 전달하는 정보의 범주와 처리 방식을 알리기 위함입니다.
                    </p>
                    
                    <h4 className="font-extrabold text-slate-900 text-sm">제1조 (총칙 - 수집하는 개인정보 항목)</h4>
                    <p>회사는 회원의 회원가입이 존재하지 않으므로 회원 관련 개인정보를 일체 수집하지 않습니다. 다만, 본 서비스 이용 과정에서 서비스 개선 목적의 분석을 위해 다음과 같은 정보들이 자동 혹은 자발적 제공 방식으로 수집될 수 있습니다.</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>자발적 이메일 문의 시:</strong> 이메일 주소, 문의 답변 내용 및 첨부 자료</li>
                      <li><strong>자동 생성 시스템 로그:</strong> 방문 시간, 사이트 이용 행동 패턴, 접속 국가 및 단말기 기기 정보(OS, 웹브라우저 종류)</li>
                    </ul>

                    <h4 className="font-extrabold text-slate-900 text-sm">제2조 (개인정보 수집 방법)</h4>
                    <p>회사는 다음과 같은 경로와 방식으로 관련 데이터를 수집합니다.</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>사용자가 비즈니스 협조 및 게재 정정 요청을 위해 직접 대표 이메일로 메일을 발송하는 형태</li>
                      <li>서비스 브라우징 프로세스에 적용된 구글 애널리틱스 등 공신력 있는 이용자 통계 분석 라이브러리의 자동 로그 수집기</li>
                    </ul>

                    <h4 className="font-extrabold text-slate-900 text-sm">제3조 (개인정보 수집·이용 목적)</h4>
                    <p>회사는 수집된 한정적인 데이터를 다음 영역에 한하여 한정적으로 활용합니다.</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>접수된 콘텐츠 수정 요청 및 제휴 파트너십 메일 대응 피드백 발송용</li>
                      <li>방문자 통계(구글 트래픽 분석 등) 측정 및 광고 배치의 효율적 정렬</li>
                    </ul>

                    <h4 className="font-extrabold text-slate-900 text-sm">제4조 (쿠키 및 광고 - Google AdSense / 제3자 광고 쿠키 명시)</h4>
                    <p className="p-3 bg-brand-dark rounded border border-brand-border/40 text-slate-800 leading-relaxed">
                      회사는 서비스의 무료 유지 보수 및 콘텐츠 양질 유지를 위해 <strong>Google AdSense(구글 애드센스)</strong> 광고 및 제3자 맞춤 광고 네트워크를 활용합니다.
                      <br />
                      이 과정에서 구글 및 제3자 벤더는 쿠키를 사용하여 본 사이트 또는 다른 사이트의 이전 방문 기록을 바탕으로 양질의 맞춤형 광고를 게재합니다.
                      <br />
                      Google은 광고 파트너십 쿠키를 통해 스스로 및 파트너 사업자들의 맞춤 광고 송출을 제어하며, 이용자는 Google 광고 설정 페이지(<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-neon-lime underline">https://adssettings.google.com</a>)를 방문하거나 웹브라우저의 설정을 조절하여 맞춤형 광고 수집을 위한 관심도 쿠키를 차단하거나 거부할 수 있습니다.
                    </p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제5조 (개인정보 보유 및 이용 기간)</h4>
                    <p>회사는 개인정보를 수집하지 아니함을 원칙으로 하되, 자발적 접수 메일 등의 경우 이메일 수신함 내 기록 보존 형태로서 민원 및 게재 제안 조치 종료 후 최대 3개월 이내에 영구 삭제 조치합니다. 전자상거래 등 소비자보호에 관한 법령 등 관계 법령이 보존하여야 한다고 지정한 업무 자료가 있다면 법에 명시된 엄격한 연한을 절대 준수합니다.</p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제6조 (개인정보 제3자 제공)</h4>
                    <p>회사는 이용자 동의가 있거나 관계 법정의 적법 절차에 기한 정부기관의 영장 제출 등의 비상사태가 입증되는 사유를 제외하고는, 어떠한 경우에도 수집한 이메일이나 문의 기록 등을 제3자 상업 주체에 제공, 이관 및 노출 분배하지 않습니다.</p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제7조 (개인정보 처리 위탁)</h4>
                    <p>회사는 기본적 시스템 인프라 연동 업무를 위해 글로벌 호스팅사 등 다음 클라우드 플랫폼에 전산 서비스를 안전 위탁하며, 그 외 보증받지 못한 상업 정보 연계 목적의 위탁은 일체 수행하지 않습니다.</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>위탁 대상자:</strong> Vercel Inc. 및 Google Cloud Platform / Run</li>
                      <li><strong>위탁 업무 내용:</strong> 웹 애플리케이션 CDN 네트워킹 서빙 및 정적 자산 로딩 보증</li>
                    </ul>

                    <h4 className="font-extrabold text-slate-900 text-sm">제8조 (정보주체의 권리·의무 및 행사 방법)</h4>
                    <p>이용자는 자신의 자발적 문의 메일의 삭제, 정정, 파기 처리를 대표 이메일({SITE_OPERATOR.email})로 신청할 수 있으며, 회사는 본인 성명이 검증되는 등의 타당한 검토 절차 완료 하에 지체 없이 기록 삭제 등 성실 조치를 영위합니다.</p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제9조 (개인정보의 파기)</h4>
                    <p>회사는 보유 자산 보유 기한 도래 즉시 목적을 이룬 대상 정보를 영구 폐기합니다. 전자적 데이터 파일은 복구 및 재생 불가능하도록 식별키를 폐쇄 정밀 소멸하며, 출력 서류 등은 파쇄 기법을 통해 온전히 폐기합니다.</p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제10조 (개인정보 보호책임자)</h4>
                    <p>본 서비스의 사용자 소통 안전망 구축 및 개인정보 관련 법규 준수에 책임을 다하고자 총괄 책임자를 아래와 같이 지정합니다.</p>
                    <dl className="p-3.5 bg-brand-dark rounded border border-brand-border/40 space-y-1 text-slate-800 text-xs mt-3">
                      <dt className="font-bold text-slate-900">개인정보 보호책임자: 박예준</dt>
                      <dd>담당 연락처 및 이메일: {SITE_OPERATOR.email}</dd>
                      <dd>소재지: {SITE_OPERATOR.address}</dd>
                    </dl>

                    <h4 className="font-extrabold text-slate-900 text-sm">제11조 (개인정보 열람청구)</h4>
                    <p>이용자는 개인정보 보호법 등 관계 법령에 따라 열람 청구를 공식 수신 이메일 주소로 신청할 권리를 가지며, 담당 수탁 주체는 관련 내용을 파악 후 정돈하여 신속 회신 보고합니다.</p>

                    <h4 className="font-extrabold text-slate-900 text-sm">제12조 (권익침해 구제방법)</h4>
                    <p>기타 개인정보 침해에 관한 전문적 법률 피해 문의 및 구제 절차가 긴급한 경우, 이용자는 아래 외부 지정 법정 공공 조사 기관에 직접 조정 접수하거나 상담받을 수 있습니다.</p>
                    <ul className="list-decimal pl-5 space-y-1 text-slate-600">
                      <li><strong>개인정보분쟁조정위원회:</strong> (국번없이) 1833-6972</li>
                      <li><strong>개인정보침해신고센터:</strong> (국번없이) 118</li>
                      <li><strong>대검찰청 사이버수사과:</strong> (국번없이) 1301</li>
                      <li><strong>경찰청 사이버범죄수사대:</strong> (국번없이) 182</li>
                    </ul>

                    <h4 className="font-extrabold text-slate-900 text-sm">제13조 (시행일자)</h4>
                    <p>본 고지 공시 문서는 <strong>2026년 4월 28일</strong>부터 즉시 수립 선포되어 성실히 이행 및 시행됩니다.</p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'terms' && (
                <div id="legal-terms-view" className="space-y-6 select-text max-h-[70vh] overflow-y-auto pr-2">
                  <h3 className="text-xl font-extrabold text-slate-800 border-b border-brand-border pb-3">서비스 이용약관</h3>
                  
                  <div className="space-y-4 text-xs text-slate-700 leading-relaxed break-keep font-sans">
                    <h4 className="font-bold text-slate-900 text-sm">제1조 (목적)</h4>
                    <p>본 약관은 상상아트(이하 "회사")가 제공하는 웹사이트 'NuTube'(이하 "서비스")를 이용함에 있어 회사와 이용자 간의 서비스 이용 조건, 권리, 의무 및 제반 책임 사항을 규정함을 목적으로 합니다.</p>

                    <h4 className="font-bold text-slate-900 text-sm">제2조 (용어의 정의)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>"서비스"라 함은 회사가 웹사이트를 통해 제공하는 유튜브 알고리즘 분석, 쇼츠 제작 노하우 정보, AI 메타레이아웃 플래너 및 크리에이터 성장 인사이트 가이드북 일체를 뜻합니다.</li>
                      <li>"이용자"란 본 서비스에 접속하여 회사가 제공하는 정보나 도구를 열람 및 활용하는 모든 방문 고객을 의미합니다.</li>
                    </ul>

                    <h4 className="font-bold text-slate-900 text-sm">제3조 (약관의 효력 및 변경)</h4>
                    <p>본 약관은 회사가 서비스 화면에 게시함으로써 효력이 발생합니다. 회사는 합리적인 사유 또는 관계 법령의 변경이 있을 경우 본 약관을 수정할 수 있으며, 이 경우 공지사항을 통해 발효일 기준 7일 전부터 사전 예고합니다. 약관 개정 이후 계속하여 서비스를 이용하는 경우 약관 변경 사항에 동의한 것으로 간주됩니다.</p>

                    <h4 className="font-bold text-slate-900 text-sm">제4조 (회사의 의무 및 서비스 제공)</h4>
                    <p>회사는 이용자에게 보다 전문적이고 깨끗한 품질의 유튜브 미디어 전략 및 검색엔진 입점 최적화 지식 자산을 제공하는 데 사명을 다합니다. 모든 분석 보고와 가이드는 수집된 공식 자료를 기반으로 하되, 시스템 장애나 유지 보수 등의 긴급 사유가 있을 때는 예고 후 서비스 일부를 조정하거나 일시 중지할 수 있습니다.</p>

                    <h4 className="font-bold text-slate-900 text-sm">제5조 (이용자의 의무 및 지식재산권 등의 권리 귀속)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>본 서비스 내 모든 칼럼 기사, 가이드 텍스트, AI 생성 레이아웃 템플릿의 지식재산권은 회사 및 정당한 라이선서에게 귀속됩니다.</li>
                      <li>이용자는 회사의 사전 서면 승낙 없이 서비스 자료를 복제, 송신, 인쇄, 2차 가공 또는 상업적으로 재배포하거나 무단 도용하는 행위를 일체 금지합니다.</li>
                      <li>비상업적 용도로 부분 발췌 및 스크랩을 하는 경우에도 반드시 출처(NuTube 및 원문 주소)를 임시 명시하여야 합니다.</li>
                    </ul>

                    <h4 className="font-bold text-slate-900 text-sm">제6조 (법적 책임의 한계 및 면책 고지)</h4>
                    <p className="text-neon-orange font-medium bg-[#fdfaf2] p-3 rounded-lg border border-brand-border">
                      본 서비스에서 배포하는 유튜브 알고리즘 해설 및 수익 승률 가이드북, 메타데이터 추천 정보들은 크리에이터들에게 자발적 지표 분석 가이드를 제시하는 주관적/객관적 분석 데이터 참고자료일 뿐입니다. 특정 채널의 조회수 폭증, 구독자 증가 및 실제 광고 수익 정산 승률 등과 관련된 최종 결과에 관하여 회사는 결과의 성패를 보장하지 않으며, 이용자의 주관적 경영 의사결정 결과(손실 또는 유실)에 따른 민·형사상 어떠한 보상 및 손해 배상 한계 법적 책임도 부담하지 않습니다.
                    </p>

                    <h4 className="font-bold text-slate-900 text-sm">제7조 (분쟁의 해결)</h4>
                    <p>본 약관과 관련하여 회사와 이용자 간에 발생한 소송이나 법정 분쟁은 회사의 주소지 관할 법원을 합의 관할 법원으로 하여 대한민국 관계 법령을 준용해 조속히 해결하도록 합니다.</p>
                    <p className="font-bold mt-2">약관 발효 및 최초 시행일자: 2026년 5월 20일</p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'partnership' && (
                <div id="legal-partnership-view" className="space-y-6 select-text font-sans">
                  <h3 className="text-xl font-extrabold text-slate-900 border-b border-brand-border pb-3">제휴 및 비즈니스 문의</h3>
                  
                  <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed break-keep font-medium">
                    <p>
                      NuTube 크리에이터 가이드북 아카이브는 지속가능한 1인 창작 생태계에 도움이 될 수 있는 다양한 영상 제작 교육 기관, 크리에이터 협의 연대 및 에이전시와의 기술 제휴와 비즈니스 논의를 환영합니다.
                    </p>
                    <p>
                      우리는 1인 크리에이터들이 겪는 알고리즘 정체 원인을 정량적으로 진단해주는 분석 가이드 보강 사업을 영위하고 있습니다. 
                      관련 비즈니스 제안은 아래 이메일로 접수해 주시면 영업일 3일 내에 신뢰 속 회신해 드립니다.
                    </p>

                    <div className="p-4 bg-brand-dark rounded-xl border border-brand-border/40 inline-flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neon-lime" />
                        <span className="font-bold text-slate-800">{SITE_OPERATOR.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neon-lime" />
                        <span className="text-xs text-slate-600">{SITE_OPERATOR.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeLegalTab === 'announcements' && (
                <div id="legal-announcements-view" className="space-y-6 select-text font-sans">
                  <div className="border-b border-brand-border pb-3">
                    <h3 className="text-xl font-extrabold text-slate-900">공지사항</h3>
                    <p className="text-xs text-slate-500 mt-1">NuTube 운영과 관련된 안내사항을 시간순으로 정리했습니다.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative border-l-2 border-brand-border pl-6 space-y-6 text-xs sm:text-sm">
                      {/* 2026-05-18 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-neon-lime border-4 border-white shadow-sm" />
                        <span className="font-mono text-neon-lime font-extrabold text-xs">2026-05-18</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">메타데이터 생성기 일시 점검 안내</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          메타데이터 생성기를 더 안정적이고 빠른 환경으로 옮기는 작업을 진행하고 있습니다. 작업이 완료되면 본 페이지에서 다시 안내드리겠습니다. 그동안 가이드 콘텐츠는 정상 이용하실 수 있습니다.
                        </p>
                      </div>

                      {/* 2026-05-15 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#f4a261] border-4 border-white shadow-sm" />
                        <span className="font-mono text-[#f4a261] font-bold text-xs">2026-05-15</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">시니어 사연 쇼츠 카테고리 가이드 보강</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          시니어 사연 쇼츠 카테고리의 스토리텔링, BGM, 내레이션 관련 실전 가이드 8편을 보강했습니다. 사연을 영상화할 때 지켜야 할 윤리 원칙과 구체적 제작 노하우를 정리한 글들입니다.
                        </p>
                      </div>

                      {/* 2026-05-10 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                        <span className="font-mono text-emerald-600 font-bold text-xs">2026-05-10</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">AI 도구 카테고리 확대</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          AI 음성, 이미지 생성, 영상 편집, 리서치까지 유튜버에게 실제로 도움이 되는 AI 도구 비교 가이드 8편을 추가했습니다. 무료부터 유료까지 가격별로 정리했습니다.
                        </p>
                      </div>

                      {/* 2026-05-04 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                        <span className="font-mono text-blue-600 font-bold text-xs">2026-05-04</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">영상 채널 수익화 가이드 시리즈 시작</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          광고 수익부터 멤버십, 브랜드 협찬, 어필리에이트까지 채널 수익 다각화 전략을 다루는 가이드 시리즈를 시작했습니다.
                        </p>
                      </div>

                      {/* 2026-04-28 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm" />
                        <span className="font-mono text-purple-600 font-bold text-xs">2026-04-28</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">NuTube 정식 오픈</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          유튜브 채널 운영자를 위한 실전 가이드 미디어 NuTube가 정식 오픈했습니다. 알고리즘, 시니어 사연 쇼츠, AI 도구, 영상 채널 수익화 네 가지 카테고리에서 검증된 데이터와 실전 경험 기반의 가이드를 제공합니다.
                        </p>
                      </div>

                      {/* 2026-04-28 - 콘텐츠 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm" />
                        <span className="font-mono text-indigo-600 font-bold text-xs">2026-04-28</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">콘텐츠 운영 원칙 안내</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          NuTube의 모든 가이드는 공식 출처 우선 확인, 사실 검증, 실전 적용 가능성을 기준으로 작성됩니다. 알고리즘이나 정책이 바뀌면 관련 글을 점검하고 갱신합니다. 자세한 내용은 소개 페이지에서 확인하실 수 있습니다.
                        </p>
                      </div>

                      {/* 2026-04-28 - 의견 */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#e76f51] border-4 border-white shadow-sm" />
                        <span className="font-mono text-[#e76f51] font-bold text-xs">2026-04-28</span>
                        <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">독자 의견 환영</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-keep">
                          가이드 내용 중 정정이 필요한 부분이나 추가로 다뤄주셨으면 하는 주제가 있다면 <a href={`mailto:${SITE_OPERATOR.email}`} className="text-neon-lime hover:underline font-semibold">{SITE_OPERATOR.email}</a> 로 보내주세요. 의견은 편집팀이 직접 확인하고 신속히 반영하겠습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 border-t border-brand-border/40 pt-4 text-center">최신 공지는 본 페이지 상단에 게시됩니다.</p>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* DETAILED SINGLE INSIGHT POST VIEW */}
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 select-text"
          >
            {/* Breadcrumb Navigation - perfectly compliant with Google SEO guidelines */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-650 font-bold bg-[#f8faf6] p-3 rounded-xl border border-brand-border leading-snug shadow-sm">
              <span className="hover:text-neon-lime cursor-pointer" onClick={() => navigate('/blog')}>인사이트 라이브러리 홈</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="hover:text-neon-lime cursor-pointer" onClick={() => navigate(`/category/${selectedPost.category}`)}>{selectedPost.categoryLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 truncate max-w-[12rem] sm:max-w-xs">{selectedPost.title}</span>
            </div>

            {/* Back action */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => navigate(`/category/${selectedPost.category}`)}
                className="px-4 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-slate-700 hover:text-white hover:bg-neon-lime hover:border-transparent transition-all font-bold cursor-pointer shadow-sm"
              >
                ← 가이드 목록으로 돌아가기
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(selectedPost.slug)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${likedPosts.includes(selectedPost.slug) ? 'bg-neon-coral/10 border-neon-coral text-neon-coral' : 'bg-white border-brand-border text-slate-600 hover:text-neon-coral hover:border-neon-coral shadow-sm'}`}
                  title="이 글 추천하기"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="w-9 h-9 rounded-xl border border-brand-border bg-white flex items-center justify-center text-slate-600 hover:text-neon-lime hover:border-neon-lime transition-all cursor-pointer shadow-sm"
                  title="이 글 공유하기"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-9 h-9 rounded-xl border border-brand-border bg-white flex items-center justify-center text-slate-600 hover:text-neon-lime hover:border-neon-lime transition-all cursor-pointer shadow-sm"
                  title="이 글 인쇄하기"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Article Detail Presentation Board */}
            <article className="rounded-3xl bg-white border border-brand-border overflow-hidden shadow-sm">
              
              {/* Header Cover gradient card */}
              {(() => {
                const catInfo = CATEGORIES.find(c => c.key === selectedPost.category);
                const gradientStr = catInfo ? catInfo.gradient : 'from-indigo-600 to-indigo-800';
                return (
                  <div className={`w-full bg-gradient-to-r ${gradientStr} p-6 sm:p-10 text-white relative overflow-hidden select-none`}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="space-y-3 relative z-10 max-w-2xl">
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest px-3 py-1 bg-white/10 rounded-full border border-white/15">
                        {selectedPost.categoryLabel}
                      </span>
                      {/* reduced slightly the title size, line-height compact for mobile */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold tracking-tight leading-snug break-keep text-white">
                        {selectedPost.title}
                      </h1>
                      {selectedPost.subtitle && (
                        <p className="text-xs sm:text-sm text-white/80 tracking-normal break-keep">
                          {selectedPost.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Interactive Thumbnail Poster Preview & Utility Block */}
              <div className="bg-[#fbfcfa] border-b border-brand-border/60 p-5 sm:p-8 flex flex-col items-center justify-center space-y-4">
                <div className="max-w-md w-full relative group rounded-2xl overflow-hidden border border-brand-border shadow-sm bg-brand-bg select-none">
                  <img 
                    src={`/thumbnails/${selectedPost.slug}.svg`} 
                    alt="정량 백터 대표 썸네일" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-105 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 bg-brand-dark/90 rounded-xl border border-white/10 shadow-sm leading-none font-mono">
                      NuTube 디자인 가이드 규격 (1200 × 630 px)
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <a 
                    href={`/thumbnails/${selectedPost.slug}.svg`} 
                    download={`${selectedPost.slug}.svg`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-[11px] sm:text-xs font-bold text-white transition-colors cursor-pointer shadow-sm select-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-neon-lime" />
                    썸네일 SVG 파일 다운로드
                  </a>
                  <button 
                    onClick={() => {
                      const svgMarkup = renderThumbnailSvg(selectedPost.slug, selectedPost.title, selectedPost.subtitle, selectedPost.category);
                      navigator.clipboard.writeText(svgMarkup);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-brand-bg border border-brand-border rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-sm select-none"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    SVG 소스 복사
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                
                {/* Author Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/45 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border text-neon-lime flex items-center justify-center font-display font-black text-sm">
                      N
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-850 text-xs sm:text-sm">NuTube {selectedPost.author}</p>
                      <p className="text-[11px] text-slate-550 font-mono tracking-tight font-medium">
                        발행일: {formatDate(selectedPost.publishedAt)} 
                        {selectedPost.updatedAt && ` · 최종업데이트: ${formatDate(selectedPost.updatedAt)}`}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-brand-bg px-3 py-1 rounded-full border border-brand-border/60 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-neon-lime" />
                    <span>읽는 시간: {getReadTime(selectedPost)}</span>
                  </div>
                </div>

                {/* Highly readable, structured, customized text parser - perfectly handles the requested line height and clean styling */}
                <div className="markdown-body transition-all leading-relaxed tracking-normal break-keep select-text text-sm sm:text-base text-slate-700">
                  {selectedPost.content.split('\n').map((line, idx) => {
                    const lineTrimmed = line.trim();
                    if (!lineTrimmed) return <div key={idx} className="h-4" />;
                    
                    if (lineTrimmed.startsWith('## ')) {
                      return <h2 key={idx} className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-8 mb-4 border-b border-brand-border/40 pb-2 flex items-center gap-2"><CornerDownRight className="w-5 h-5 text-neon-lime" /> {lineTrimmed.substring(3)}</h2>;
                    }
                    if (lineTrimmed.startsWith('### ')) {
                      return <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 mt-6 mb-2">{lineTrimmed.substring(4)}</h3>;
                    }
                    if (lineTrimmed.startsWith('- ')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 pl-4 py-0.5 leading-relaxed text-xs sm:text-sm text-slate-700">
                          <span className="text-neon-lime font-bold select-none">•</span>
                          <span className="flex-1 font-medium">{lineTrimmed.substring(2)}</span>
                        </div>
                      );
                    }
                    if (lineTrimmed.startsWith('1. ') || lineTrimmed.startsWith('2. ') || lineTrimmed.startsWith('3. ') || lineTrimmed.startsWith('4. ') || lineTrimmed.startsWith('5. ')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 pl-4 py-1.5 leading-relaxed text-xs sm:text-sm text-slate-700 font-mono">
                          <span className="text-neon-lime font-bold">{lineTrimmed.split(' ')[0]}</span>
                          <span className="flex-1 text-slate-800 font-sans font-medium">{lineTrimmed.substring(lineTrimmed.indexOf(' ') + 1)}</span>
                        </div>
                      );
                    }
                    
                    // Bold wrapping inline replacement
                    let text = line;
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const parts = [];
                    let lastIndex = 0;
                    let match;
                    
                    while ((match = boldRegex.exec(text)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(text.substring(lastIndex, match.index));
                      }
                      parts.push(<strong key={match.index} className="text-slate-900 font-extrabold border-b border-neon-lime/30">{match[1]}</strong>);
                      lastIndex = boldRegex.lastIndex;
                    }
                    if (lastIndex < text.length) {
                      parts.push(text.substring(lastIndex));
                    }

                    return (
                      <p key={idx} className="mb-4 leading-relaxed text-xs sm:text-sm text-slate-650 break-keep font-medium">
                        {parts.length > 0 ? parts : text}
                      </p>
                    );
                  })}
                </div>

                {/* External Official Authority Link */}
                {selectedPost.authorityUrl && (
                  <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border/60 flex items-center justify-between flex-wrap gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-700 font-bold block">✓ 구글 공식 및 신뢰 가이드라인 교차 검증</span>
                      <p className="text-slate-600 leading-normal break-keep font-medium">본 기사의 법리적 데이터는 공식 소스에서 수립 및 확인되었습니다.</p>
                    </div>
                    <a 
                      href={selectedPost.authorityUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white text-slate-800 font-bold hover:bg-neon-lime hover:text-white transition-all flex items-center gap-1.5 border border-brand-border cursor-pointer shadow-sm"
                    >
                      {selectedPost.authorityLabel || '공식 가이드에서 더 알아보기'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Category Disclaimer Notice */}
                <div className="p-4 bg-[#f8faf6] rounded-xl border border-brand-border/50 text-[11px] text-slate-600 leading-relaxed break-keep font-medium">
                  <p className="font-extrabold text-slate-800 mb-1">※ NuTube 법적 면책 공지</p>
                  본 가이드에서 다루는 유튜브 추천 가중치, 구글 AI 정책, CTR 실험 내역 등은 독자적인 연구 분석을 기반으로 제작된 학술 보조 가이드라인입니다. 
                  귀하의 채널 실제 노출률, 애드센스 수익, 저작권 승인 여부에 대해서는 소유 크리에이터의 정성적 제작 환경과 구글 알고리즘 업데이트 상태에 따라 수시로 변하므로, 본 아카이브 제작진은 어떠한 명시적/정량적 보증이나 직접적 민형사상 배상 책임도 지지 않음을 명확히 상호 고지합니다.
                </div>

                {/* Related Internal Posts Carousel Recommendations list */}
                <div className="pt-8 border-t border-brand-border/40 space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-base">
                    📌 {selectedPost.categoryLabel} 분야 관련 가이드 더 보기
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {posts
                      .filter(p => p.category === selectedPost.category && p.slug !== selectedPost.slug)
                      .slice(0, 2)
                      .map(p => (
                        <div 
                          key={p.slug}
                          onClick={() => {
                            navigate(`/blog/${p.slug}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-4 rounded-xl bg-white border border-brand-border hover:border-neon-lime/40 cursor-pointer transition-all space-y-2 flex flex-col justify-between shadow-sm hover:scale-[1.01]"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] text-neon-lime font-mono font-bold truncate block">{p.categoryLabel}</span>
                            <h5 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-neon-lime">{p.title}</h5>
                            <p className="text-[11px] text-slate-550 font-semibold line-clamp-1 leading-normal">{p.summary}</p>
                          </div>
                          <span className="text-[10px] text-slate-600 font-bold italic block mt-2 text-right">정독하기 →</span>
                        </div>
                      ))
                    }
                  </div>
                </div>

              </div>
            </article>
          </motion.div>
        )}

      </main>

      {/* Structured Eco Cozy Theme Footer */}
      <footer className="w-full mt-20 border-t border-brand-border bg-white text-xs text-slate-500 font-sans">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-6 sm:space-y-8 select-text">
          
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-brand-border">
            <div className="space-y-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neon-lime/10 text-neon-lime flex items-center justify-center font-display font-extrabold text-sm shadow animate-pulse">N</div>
              <div>
                <p className="text-slate-950 font-extrabold font-display">NuTube.kr</p>
                <p className="text-[10px] text-slate-500 leading-none">유튜브 최적화 크리에이터 오픈소스 아카이브</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button onClick={() => { navigate('/about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-neon-lime transition-colors">소개</button>
              <button onClick={() => { navigate('/privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-neon-lime transition-colors">개인정보처리방침</button>
              <button onClick={() => { navigate('/terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-neon-lime transition-colors">이용약관</button>
              <button onClick={() => { navigate('/partnership'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-neon-lime transition-colors">제휴 및 비즈니스 문의</button>
              <button onClick={() => { navigate('/announcement'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-neon-lime transition-colors">공지사항</button>
            </div>
          </div>

          {/* Middle/Bottom row - cleaned operator credentials */}
          <div className="flex flex-col md:flex-row justify-between gap-6 text-[11px] text-slate-650 font-sans leading-relaxed break-keep">
            <div className="space-y-1 max-w-xl">
              <p className="font-semibold text-slate-900">NuTube 통합 미디어 연구 아카이브</p>
              <p>
                운영: {SITE_OPERATOR.name} · 이메일: {SITE_OPERATOR.email}
              </p>
            </div>

            <div className="md:text-right space-y-1">
              <p>© 2026 NuTube. OpenSource Project Contributors.</p>
              <p className="text-[10px] text-slate-500 font-mono leading-none pt-1">
                모든 콘텐츠는 불필요한 기계적 노이즈를 방지하기 위해 엄격히 최적화 및 정제 필터링되었습니다.
              </p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
