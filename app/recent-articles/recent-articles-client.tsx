"use client";

import {
  BarChart3,
  Bookmark,
  BrainCircuit,
  Clock3,
  Home,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ArticleSeed = {
  title: string;
  section: string;
  reporter?: string;
  premium?: boolean;
};

type RecentArticle = ArticleSeed & {
  id: string;
  lead: string;
  publishedAt: string;
  viewedAt: string;
  url: string;
};

const NAV_ITEMS: { label: string; icon: LucideIcon; href: string; active?: boolean }[] = [
  { label: "My 브리핑", icon: Home, href: "/" },
  { label: "관심 기자", icon: UserRound, href: "/" },
  { label: "뉴스 스크랩", icon: Bookmark, href: "/" },
  { label: "최근 본 기사", icon: Clock3, href: "/recent-articles", active: true },
  { label: "관심종목", icon: Star, href: "/watchlist" },
  { label: "포트폴리오", icon: BarChart3, href: "/" },
  { label: "결제내역", icon: WalletCards, href: "/" },
  { label: "내 계정", icon: Settings, href: "/" },
  { label: "로그아웃", icon: LogOut, href: "/" },
];

const CATEGORY_DATA = [
  { name: "증권", count: 8, color: "#17366d" },
  { name: "경제", count: 7, color: "#3568ad" },
  { name: "산업", count: 5, color: "#6a8fc3" },
  { name: "정치", count: 4, color: "#b27a48" },
  { name: "국제", count: 3, color: "#6d8b77" },
  { name: "라이프", count: 3, color: "#a16b86" },
  { name: "스포츠", count: 2, color: "#8e94a1" },
];

const READING_TIME_DATA = [
  { label: "00~04", count: 2 },
  { label: "04~08", count: 3 },
  { label: "08~12", count: 8 },
  { label: "12~16", count: 7 },
  { label: "16~20", count: 5 },
  { label: "20~24", count: 7 },
];

const REPORTERS = [
  { id: "1021", name: "김연지", tone: "#dce8f7" },
  { id: "1044", name: "한경우", tone: "#e9e2d8" },
  { id: "1087", name: "강경주", tone: "#dceadf" },
  { id: "1120", name: "노정동", tone: "#e6e0ef" },
  { id: "1158", name: "신현보", tone: "#e8e8df" },
];

const ARTICLE_SEEDS: ArticleSeed[] = [
  { section: "증권", title: "코스피, 외국인 순매수에 3%대 상승…반도체주 강세", reporter: "김연지" },
  { section: "증권", title: "반도체가 돌아왔다…삼성전자·SK하이닉스 동반 상승", reporter: "한경우", premium: true },
  { section: "증권", title: "코스피 6600선 회복…기관과 외국인 수급은", reporter: "김연지" },
  { section: "증권", title: "장중 변동성 커진 증시, 투자자가 확인할 세 가지", reporter: "한경우", premium: true },
  { section: "증권", title: "배당주 다시 주목…금융주 주주환원 경쟁 본격화", reporter: "김연지" },
  { section: "증권", title: "2차전지 반등의 조건…실적과 수주 흐름 점검", reporter: "한경우" },
  { section: "증권", title: "개인 자금은 어디로…ETF 순매수 상위 종목 분석", reporter: "김연지" },
  { section: "증권", title: "증권가가 꼽은 하반기 실적 개선 기대주", reporter: "한경우", premium: true },
  { section: "경제", title: "수출 증가세 이어졌다…반도체가 이끈 무역수지", reporter: "노정동" },
  { section: "경제", title: "금리 인하 기대와 집값 흐름, 하반기 변수는", reporter: "노정동" },
  { section: "경제", title: "소비심리 회복 조짐…유통업계 체감경기는 아직", reporter: "노정동" },
  { section: "경제", title: "원·달러 환율 변동성 확대, 기업 대응 분주", reporter: "노정동" },
  { section: "경제", title: "고용은 늘었지만 청년층 체감 온도는 달랐다" },
  { section: "경제", title: "물가 상승률 둔화…생활물가는 왜 그대로일까" },
  { section: "경제", title: "정부, 성장률 전망 조정…민간소비 회복에 달렸다" },
  { section: "산업", title: "삼성·현대차 집중 투자…피지컬 AI 경쟁 가속", reporter: "강경주", premium: true },
  { section: "산업", title: "HBM 주도권 경쟁, 공급망 투자 다시 빨라진다", reporter: "강경주" },
  { section: "산업", title: "조선업 수주 잔고 최고치…고부가 선박이 효자", reporter: "강경주" },
  { section: "산업", title: "전기차 캐즘 이후 배터리 기업의 다음 전략", reporter: "강경주", premium: true },
  { section: "산업", title: "로봇이 바꾼 생산 현장…스마트팩토리 확산", reporter: "강경주" },
  { section: "정치", title: "여야, 민생 법안 처리 합의…쟁점 법안은 계속 논의" },
  { section: "정치", title: "정부 조직 개편안 공개…정책 실행력에 초점" },
  { section: "정치", title: "국회 경제 분야 대정부질문, 성장 전략 공방" },
  { section: "정치", title: "지방 재정 확충 방안 발표…지역별 반응 엇갈려" },
  { section: "국제", title: "뉴욕증시 사상 최고치…기술주가 상승 주도", reporter: "신현보" },
  { section: "국제", title: "미국 금리 경로 다시 안갯속…글로벌 시장 촉각", reporter: "신현보" },
  { section: "국제", title: "유럽 경기 회복 신호에도 제조업은 신중", reporter: "신현보" },
  { section: "라이프", title: "여름철 숙면을 돕는 생활 습관 다섯 가지" },
  { section: "라이프", title: "도심에서 만나는 신진 작가전…이번 주 전시" },
  { section: "라이프", title: "걷기 운동, 속도보다 중요한 것은 꾸준함" },
  { section: "스포츠", title: "월드컵 예선 명단 발표…새 얼굴 대거 합류" },
  { section: "스포츠", title: "후반기 순위 경쟁 본격화…프로야구 관전 포인트" },
];

const ARTICLE_URLS = [
  "https://www.hankyung.com/article/2026080565876",
  "https://www.hankyung.com/article/2026080555766",
  "https://www.hankyung.com/article/2026080554876",
  "https://www.hankyung.com/article/2026080444426",
  "https://www.hankyung.com/article/2026080443336",
];

const RECENT_ARTICLES: RecentArticle[] = ARTICLE_SEEDS.map((article, index) => ({
  ...article,
  id: `recent-${index + 1}`,
  lead: `${article.title}와 관련한 핵심 변화와 배경을 짚었습니다. 주요 수치와 현장의 반응을 함께 살펴보며 앞으로의 흐름을 정리합니다.`,
  publishedAt: index < 4 ? `2026.08.06 ${String(10 - index).padStart(2, "0")}:${index % 2 ? "20" : "45"}` : `2026.08.${String(5 - Math.floor((index - 4) / 7)).padStart(2, "0")} ${String(18 - (index % 7)).padStart(2, "0")}:10`,
  viewedAt: `2026.08.${index < 11 ? "06" : index < 22 ? "05" : "04"} ${String(11 - (index % 10)).padStart(2, "0")}:30`,
  url: ARTICLE_URLS[index % ARTICLE_URLS.length],
}));

function ReadingDonut() {
  const total = CATEGORY_DATA.reduce((sum, item) => sum + item.count, 0);
  const [activeName, setActiveName] = useState<string | null>(null);
  const active = CATEGORY_DATA.find((item) => item.name === activeName);
  const segments = CATEGORY_DATA.map((item, index) => ({
    ...item,
    percentage: (item.count / total) * 100,
    offset: (CATEGORY_DATA.slice(0, index).reduce((sum, previous) => sum + previous.count, 0) / total) * 100,
  }));

  return (
    <div className="reading-donut-wrap">
      <div className="reading-donut">
        <svg viewBox="0 0 180 180" role="img" aria-label="최근 3개월 분야별 기사 열람 비중">
          <circle className="reading-donut-track" cx="90" cy="90" r="66" />
          {segments.map((item) => {
            return (
              <circle
                key={item.name}
                className={`reading-donut-segment ${activeName && activeName !== item.name ? "reading-donut-segment-muted" : ""}`}
                cx="90"
                cy="90"
                r="66"
                pathLength="100"
                stroke={item.color}
                strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                strokeDashoffset={-item.offset}
                tabIndex={0}
                aria-label={`${item.name} ${item.count}건, ${item.percentage.toFixed(1)}%`}
                onMouseEnter={() => setActiveName(item.name)}
                onMouseLeave={() => setActiveName(null)}
                onFocus={() => setActiveName(item.name)}
                onBlur={() => setActiveName(null)}
              />
            );
          })}
        </svg>
        <div className="reading-donut-center" aria-live="polite">
          {active ? (
            <><strong>{active.name}</strong><span>{active.count}건 · {((active.count / total) * 100).toFixed(1)}%</span></>
          ) : (
            <><strong>{total}건</strong><span>총 열람 기사</span></>
          )}
        </div>
      </div>
      <p>차트에 마우스를 올리면 분야별 상세 비중을 볼 수 있습니다.</p>
    </div>
  );
}

export default function RecentArticlesClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [articles, setArticles] = useState(RECENT_ARTICLES);
  const [visibleCount, setVisibleCount] = useState(20);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const visibleArticles = useMemo(() => articles.slice(0, visibleCount), [articles, visibleCount]);
  const topCategories = CATEGORY_DATA.slice(0, 5);
  const total = CATEGORY_DATA.reduce((sum, item) => sum + item.count, 0);
  const peakReadingCount = Math.max(...READING_TIME_DATA.map((item) => item.count));

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const removeArticle = (article: RecentArticle) => {
    setRemovingId(article.id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setArticles((current) => current.filter((item) => item.id !== article.id));
      setRemovingId(null);
      setToast("최근 본 기사에서 삭제했습니다.");
    }, reduceMotion ? 0 : 220);
  };

  return (
    <div className="site-frame recent-service-frame">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand-small recent-brand-link" href="/" aria-label="한경 홈">한경</Link>
          <Link className="brand-main recent-brand-link" href="/" aria-label="마이한경 홈"><span>My</span>한경</Link>
          <button className="mobile-menu" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="마이한경 메뉴 열기" aria-expanded={mobileNavOpen}>
            <Menu size={23} />
          </button>
        </div>
      </header>

      <div className="site-body">
        <aside className={`side-nav recent-side-nav ${mobileNavOpen ? "side-nav-open" : ""}`} aria-label="마이한경 메뉴">
          <nav>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} className={`nav-item ${item.active ? "nav-item-active" : ""}`} href={item.href} onClick={() => setMobileNavOpen(false)}>
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="main-content recent-main">
          <section className="watchlist-titlebar recent-page-titlebar">
            <div>
              <h1>최근 본 기사</h1>
              <p>최근 3개월의 기사 기록과 나의 읽기 흐름을 확인해보세요.</p>
            </div>
            <span>2026.08.06 00:00 기준</span>
          </section>

          <section className="recent-module reading-stats-module" aria-labelledby="reading-stats-title">
            <div className="recent-module-heading">
              <h2 id="reading-stats-title">읽기 통계</h2>
            </div>
            <div className="reading-category-section">
              <h3>많이 읽은 분야</h3>
              <div className="reading-stats-layout">
                <ReadingDonut />
                <ol className="top-category-list" aria-label="가장 많이 본 분야 상위 5개">
                  {topCategories.map((item, index) => (
                    <li key={item.name}>
                      <span className="category-rank">{index + 1}</span>
                      <i style={{ background: item.color }} aria-hidden="true" />
                      <strong>{item.name}</strong>
                      <span>{item.count}건</span>
                      <em>{((item.count / total) * 100).toFixed(1)}%</em>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="reading-time-section">
              <div className="reading-time-heading">
                <h3>읽은 시간대</h3>
                <span>4시간 단위</span>
              </div>
              <div className="reading-time-chart" role="img" aria-label="4시간 단위 기사 열람 건수">
                {READING_TIME_DATA.map((item) => (
                  <div className="reading-time-column" key={item.label} aria-label={`${item.label}시 ${item.count}건`}>
                    <strong>{item.count}건</strong>
                    <span className="reading-time-bar-track" aria-hidden="true">
                      <i style={{ height: `${(item.count / peakReadingCount) * 100}%` }} />
                    </span>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="recent-module reporter-module" aria-labelledby="favorite-reporters-title">
            <div className="recent-module-heading">
              <h2 id="favorite-reporters-title">관심 있게 본 기자</h2>
            </div>
            <div className="recent-reporter-list">
              {REPORTERS.map((reporter) => (
                <a key={reporter.id} className="recent-reporter-button" href="https://www.hankyung.com/reporter" aria-label={`${reporter.name} 기자 기사 모아보기`}>
                  <span className="reporter-avatar" style={{ background: reporter.tone }}>{reporter.name.slice(0, 1)}</span>
                  <strong>{reporter.name}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="recent-module reading-ai-module" aria-labelledby="reading-ai-title">
            <div className="ai-orbit" aria-hidden="true"><BrainCircuit size={28} /><span /></div>
            <div className="ai-reading-copy">
              <div className="ai-reading-kicker"><Sparkles size={15} /><span>AI 읽기 흐름 분석</span></div>
              <h2 id="reading-ai-title">회원님은 <strong>다방면 탐색형</strong> 독자입니다.</h2>
              <p>최근 읽기 흐름을 보면 ‘다방면 탐색형’ 독자에 가깝습니다. 주요 경제 지표와 기업 동향을 따라가면서도 정치, 스포츠, 건강 정보까지 시선을 넓혀 사회 전반의 맥락을 입체적으로 살펴보는 경향이 두드러집니다. 특정 주제에 머무르기보다 여러 분야의 변화를 연결해 이해하려는 균형 잡힌 읽기 습관이 나타납니다.</p>
              <small>2026.08.06 분석 · 매일 자정 업데이트</small>
            </div>
          </section>

          <section className="recent-module recent-list-module" aria-labelledby="recent-list-title">
            <div className="recent-module-heading recent-list-heading">
              <h2 id="recent-list-title">최근 본 기사 내역</h2>
              <div className="recent-list-meta">
                <span className="recent-retention-chip" aria-label="기사 내역은 최대 3개월까지 확인할 수 있습니다.">최근 3개월</span>
                <span className="module-count">{articles.length}건</span>
              </div>
            </div>
            <div className="recent-article-list">
              {visibleArticles.map((article) => (
                <article className={`recent-article-item ${removingId === article.id ? "recent-article-removing" : ""}`} key={article.id}>
                  <a className={`recent-thumbnail recent-thumbnail-${article.section}`} href={article.url} aria-label={`${article.title} 기사 보기`}>
                    <Newspaper size={24} />
                    <span>{article.section}</span>
                  </a>
                  <div className="recent-article-copy">
                    <div className="recent-article-meta">
                      <span>{article.section}</span>
                      {article.premium ? <em>PREMIUM</em> : null}
                      <time>{article.publishedAt}</time>
                    </div>
                    <a href={article.url}><h3>{article.title}</h3></a>
                    <p>{article.lead}</p>
                    <small>최근 열람 {article.viewedAt}{article.reporter ? ` · ${article.reporter} 기자` : ""}</small>
                  </div>
                  <button className="recent-delete-button" type="button" onClick={() => removeArticle(article)} aria-label={`${article.title} 최근 본 기사에서 삭제`}>
                    <X size={18} />
                  </button>
                </article>
              ))}
            </div>
            {visibleCount < articles.length ? (
              <button className="recent-load-more" type="button" onClick={() => setVisibleCount((count) => count + 20)}>
                더보기 <span>({Math.min(20, articles.length - visibleCount)}개)</span>
              </button>
            ) : null}
          </section>
        </main>
      </div>

      <footer className="site-footer">© 한경닷컴 Corp. · 최근 본 기사 서비스 프로토타입</footer>

      {toast ? <div className="toast" role="status"><X size={16} /> {toast}</div> : null}
    </div>
  );
}
