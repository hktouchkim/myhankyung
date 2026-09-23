"use client";

import {
  Award,
  BarChart3,
  Bookmark,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flame,
  Globe2,
  Home,
  Layers,
  Menu,
  Newspaper,
  PieChart,
  RefreshCw,
  Star,
  TrendingUp,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import styles from "./admin.module.css";

type AdminTab =
  | "overview"
  | "briefing"
  | "recent-articles"
  | "watchlist"
  | "badges"
  | "reporters"
  | "scraps"
  | "portfolio";

interface NavMenuItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  ready: boolean;
  badge?: string;
}

const MENU_ITEMS: NavMenuItem[] = [
  { id: "overview", label: "대시보드 홈", icon: Home, ready: false, badge: "준비중" },
  { id: "briefing", label: "My 브리핑", icon: Newspaper, ready: true },
  { id: "recent-articles", label: "최근 본 기사", icon: Clock3, ready: true },
  { id: "watchlist", label: "관심종목", icon: Star, ready: true },
  { id: "badges", label: "배지", icon: Award, ready: true },
  { id: "reporters", label: "관심 기자", icon: UserRound, ready: false, badge: "준비중" },
  { id: "scraps", label: "뉴스 스크랩", icon: Bookmark, ready: false, badge: "준비중" },
  { id: "portfolio", label: "포트폴리오", icon: BarChart3, ready: false, badge: "준비중" },
];

export default function AdminDashboardClient() {
  const [currentTab, setCurrentTab] = useState<AdminTab>("briefing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBadgeGroup, setSelectedBadgeGroup] = useState<string>("all");
  const [lastRefreshed, setLastRefreshed] = useState("2026.09.18 17:05");

  const refreshData = () => {
    const now = new Date();
    const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setLastRefreshed(formatted);
  };

  return (
    <div className={styles.adminLayout}>
      {/* 모바일 상단 바 */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileTitle}>
          <span>My한경 관리자</span>
          <span className={styles.mobileBadge}>ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={styles.mobileMenuBtn}
          type="button"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 사이드바 LNB */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>HK</div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>마이한경 관리자</div>
            <div className={styles.logoSubtitle}>서비스 모니터링 시스템</div>
          </div>
        </div>

        {/* 내비게이션 메뉴 */}
        <nav className={styles.navContainer}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ""}`}
              >
                <div className={styles.navLeft}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className={styles.navItemBadge}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* 하단 바로가기 및 정보 */}
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.linkToService}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ExternalLink size={14} />
              마이한경 서비스 바로가기
            </span>
            <ChevronRight size={14} />
          </Link>
          <div className={styles.footerCopyright}>
            <div>한국경제신문 디지털미디어본부</div>
            <div style={{ color: "#475569" }}>v1.0 (2026.09.18)</div>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainArea}>
        {/* 상단 헤더 */}
        <header className={styles.mainHeader}>
          <div>
            <h2 className={styles.pageHeading}>
              {MENU_ITEMS.find((m) => m.id === currentTab)?.label} 모니터링
            </h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.timestampBox}>
              <span className={styles.statusDot}></span>
              <span>기준일시: <strong style={{ color: "#0f172a" }}>{lastRefreshed}</strong> (오늘 기준)</span>
            </div>
          </div>
        </header>

        {/* 탭 본문 내용 */}
        <div className={styles.contentContainer}>
          {currentTab === "briefing" && <BriefingTab />}
          {currentTab === "recent-articles" && <RecentArticlesTab />}
          {currentTab === "watchlist" && <WatchlistTab />}
          {currentTab === "badges" && (
            <BadgesTab
              selectedGroup={selectedBadgeGroup}
              onSelectGroup={setSelectedBadgeGroup}
            />
          )}
          {["overview", "reporters", "scraps", "portfolio"].includes(currentTab) && (
            <EmptyStateTab tab={currentTab} />
          )}
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// 1. 대시보드 홈 (종합 지표)
// -------------------------------------------------------------
function OverviewTab({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 4대 서비스 핵심 KPI 요약 카드 */}
      <div className={styles.kpiGrid}>
        {/* My 브리핑 */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={`${styles.kpiTag} ${styles.tagBlue}`}>My 브리핑</span>
            <Newspaper size={18} color="#94a3b8" />
          </div>
          <div className={styles.kpiValue}>42,850명</div>
          <div className={styles.kpiSubText}>
            <span>등록된 에이전트: <strong>94,270개</strong></span>
            <span className={styles.gainText}>
              <TrendingUp size={13} style={{ marginRight: "3px" }} /> +14.2%
            </span>
          </div>
          <div className={styles.kpiBottom}>
            <span>1인 평균 2.2개 생성</span>
            <button
              onClick={() => onNavigate("briefing")}
              type="button"
              className={styles.cardActionBtn}
            >
              상세보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 최근 본 기사 */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={`${styles.kpiTag} ${styles.tagIndigo}`}>최근 본 기사</span>
            <Clock3 size={18} color="#94a3b8" />
          </div>
          <div className={styles.kpiValue}>18.4건</div>
          <div className={styles.kpiSubText}>
            <span>1인 평균 열람 기사수</span>
            <span className={styles.gainText}>
              <TrendingUp size={13} style={{ marginRight: "3px" }} /> +8.7%
            </span>
          </div>
          <div className={styles.kpiBottom}>
            <span>최고 342건 (다독자)</span>
            <button
              onClick={() => onNavigate("recent-articles")}
              type="button"
              className={styles.cardActionBtn}
            >
              상세보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 관심종목 */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={`${styles.kpiTag} ${styles.tagAmber}`}>관심종목</span>
            <Star size={18} color="#94a3b8" />
          </div>
          <div className={styles.kpiValue}>31,420명</div>
          <div className={styles.kpiSubText}>
            <span>총 등록 종목: <strong>218,650건</strong></span>
            <span className={styles.gainText}>
              <TrendingUp size={13} style={{ marginRight: "3px" }} /> +11.5%
            </span>
          </div>
          <div className={styles.kpiBottom}>
            <span>그룹당 평균 5.3개</span>
            <button
              onClick={() => onNavigate("watchlist")}
              type="button"
              className={styles.cardActionBtn}
            >
              상세보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 배지 */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={`${styles.kpiTag} ${styles.tagPurple}`}>배지</span>
            <Award size={18} color="#94a3b8" />
          </div>
          <div className={styles.kpiValue}>142,380개</div>
          <div className={styles.kpiSubText}>
            <span>획득 회원: <strong>58,190명</strong></span>
            <span className={styles.gainText}>
              <TrendingUp size={13} style={{ marginRight: "3px" }} /> +19.3%
            </span>
          </div>
          <div className={styles.kpiBottom}>
            <span>라이브 배지: 10종</span>
            <button
              onClick={() => onNavigate("badges")}
              type="button"
              className={styles.cardActionBtn}
            >
              상세보기 <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 종합 주간 활성화 추이 차트 및 표 */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>최근 8주간 서비스별 참여도 성장 추이</h3>
            <p className={styles.sectionSubtitle}>주차별 활성 사용자수 및 핵심 활동량 누적 트렌드</p>
          </div>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2563eb" }}></span>
              My 브리핑
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#6366f1" }}></span>
              기사 열람
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }}></span>
              관심종목
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#a855f7" }}></span>
              배지 획득
            </span>
          </div>
        </div>

        {/* 시각화 바 차트 영역 */}
        <div className={styles.barChartWrapper}>
          {[
            { week: "07.4주", b: 42, r: 55, w: 38, a: 45 },
            { week: "08.1주", b: 48, r: 60, w: 42, a: 52 },
            { week: "08.2주", b: 55, r: 68, w: 49, a: 63 },
            { week: "08.3주", b: 62, r: 72, w: 56, a: 74 },
            { week: "08.4주", b: 71, r: 81, w: 65, a: 88 },
            { week: "09.1주", b: 79, r: 88, w: 73, a: 104 },
            { week: "09.2주", b: 88, r: 96, w: 82, a: 122 },
            { week: "09.3주(현재)", b: 100, r: 100, w: 100, a: 142 },
          ].map((item, idx) => (
            <div key={idx} className={styles.barCol}>
              <div className={styles.barGroup}>
                <div
                  style={{ height: `${(item.b / 142) * 100}%`, backgroundColor: "#2563eb" }}
                  className={styles.barItem}
                  title={`My 브리핑: ${item.b}`}
                />
                <div
                  style={{ height: `${(item.r / 142) * 100}%`, backgroundColor: "#6366f1" }}
                  className={styles.barItem}
                  title={`기사 열람: ${item.r}`}
                />
                <div
                  style={{ height: `${(item.w / 142) * 100}%`, backgroundColor: "#f59e0b" }}
                  className={styles.barItem}
                  title={`관심종목: ${item.w}`}
                />
                <div
                  style={{ height: `${(item.a / 142) * 100}%`, backgroundColor: "#a855f7" }}
                  className={styles.barItem}
                  title={`배지 획득: ${item.a}`}
                />
              </div>
              <span className={styles.barLabel}>{item.week}</span>
            </div>
          ))}
        </div>

        {/* 주차별 비교 표 */}
        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>구분</th>
                <th>08.2주</th>
                <th>08.3주</th>
                <th>08.4주</th>
                <th>09.1주</th>
                <th>09.2주</th>
                <th style={{ backgroundColor: "#eff6ff", color: "#1e3a8a" }}>09.3주 (현재)</th>
                <th>전주 대비 증감</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>My 브리핑 유저</td>
                <td>28,400</td>
                <td>31,200</td>
                <td>34,500</td>
                <td>37,800</td>
                <td>40,100</td>
                <td className={styles.highlightRow} style={{ color: "#1e3a8a" }}>42,850</td>
                <td style={{ color: "#059669", fontWeight: 700 }}>+6.8%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>기사 열람 총건 (천건)</td>
                <td>540K</td>
                <td>582K</td>
                <td>630K</td>
                <td>690K</td>
                <td>740K</td>
                <td className={styles.highlightRow} style={{ color: "#1e3a8a" }}>788K</td>
                <td style={{ color: "#059669", fontWeight: 700 }}>+6.5%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>관심종목 등록 회원</td>
                <td>21,100</td>
                <td>23,400</td>
                <td>25,800</td>
                <td>28,100</td>
                <td>29,900</td>
                <td className={styles.highlightRow} style={{ color: "#1e3a8a" }}>31,420</td>
                <td style={{ color: "#059669", fontWeight: 700 }}>+5.1%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>배지 총 지급수</td>
                <td>72,500</td>
                <td>86,300</td>
                <td>101,200</td>
                <td>116,400</td>
                <td>131,200</td>
                <td className={styles.highlightRow} style={{ color: "#1e3a8a" }}>142,380</td>
                <td style={{ color: "#059669", fontWeight: 700 }}>+8.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. My 브리핑 상세 모니터링
// -------------------------------------------------------------
function BriefingTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className={styles.kpiGrid3}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>1개 이상 등록 사용자 수</div>
          <div className={styles.kpiValue}>42,850명</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>등록된 총 브리핑 수</div>
          <div className={styles.kpiValue}>94,270개</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>사용자 평균 등록 브리핑 수</div>
          <div className={styles.kpiValue}>2.2개</div>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* 주제별 브리핑 수 */}
        <div className={styles.sectionCard} style={{ display: "flex", flexDirection: "column" }}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>주제별 브리핑 수</h3>
            </div>
            <PieChart size={18} color="#94a3b8" />
          </div>

          <div className={styles.progressList} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
            {[
              { name: "미국 증시", count: "39,593건", pct: 42, color: "#2563eb" },
              { name: "국내 증시", count: "29,223건", pct: 31, color: "#4f46e5" },
              { name: "부동산 시장", count: "15,083건", pct: 16, color: "#10b981" },
              { name: "주요 이슈", count: "10,371건", pct: 11, color: "#f59e0b" },
            ].map((topic, i) => (
              <div key={i} className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <strong style={{ color: "#0f172a" }}>{topic.name}</strong>
                  <span style={{ color: "#64748b" }}>{topic.count} ({topic.pct}%)</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    style={{ width: `${topic.pct}%`, backgroundColor: topic.color }}
                    className={styles.progressBar}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시간대별 브리핑 수 */}
        <div className={styles.sectionCard} style={{ display: "flex", flexDirection: "column" }}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>시간대별 브리핑 수</h3>
            </div>
            <Clock3 size={18} color="#94a3b8" />
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "32px 16px", borderRadius: "10px", border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e40af" }}>오전</div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "#1e3a8a", margin: "10px 0 6px 0" }}>68%</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#2563eb" }}>64,103건</div>
              </div>
              <div style={{ padding: "32px 16px", borderRadius: "10px", border: "1px solid #fde68a", backgroundColor: "#fffbeb", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>오후</div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "#78350f", margin: "10px 0 6px 0" }}>32%</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#d97706" }}>30,167건</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 브리핑 추이 표 (배지처럼 행열 반전) */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>My 브리핑 추이</h3>

        <div className={styles.tableResponsive} style={{ marginTop: "16px" }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "160px" }}>구분</th>
                <th style={{ textAlign: "right" }}>08.3주</th>
                <th style={{ textAlign: "right" }}>08.4주</th>
                <th style={{ textAlign: "right" }}>09.1주</th>
                <th style={{ textAlign: "right" }}>09.2주</th>
                <th style={{ textAlign: "right", backgroundColor: "#eff6ff", color: "#1e3a8a" }}>09.3주 (현재)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "등록유저", w1: "31,200명", w2: "34,500명", w3: "37,800명", w4: "40,100명", current: "42,850명", isMajor: true },
                { name: "총 브리핑", w1: "64,200건", w2: "70,950건", w3: "78,170건", w4: "86,060건", current: "94,270건", isMajor: true },
                { name: "미국증시 비중", w1: "39%", w2: "39%", w3: "40%", w4: "41%", current: "42%", isMajor: false },
                { name: "국내증시 비중", w1: "33%", w2: "33%", w3: "32%", w4: "31%", current: "31%", isMajor: false },
                { name: "부동산 시장 비중", w1: "16%", w2: "17%", w3: "17%", w4: "17%", current: "16%", isMajor: false },
                { name: "주요 이슈 비중", w1: "12%", w2: "11%", w3: "11%", w4: "11%", current: "11%", isMajor: false },
              ].map((row, idx) => (
                <tr key={idx} className={row.isMajor ? styles.highlightRow : ""}>
                  <td style={{ fontWeight: 700, color: row.isMajor ? "#1e3a8a" : "#0f172a" }}>
                    {row.name}
                  </td>
                  <td style={{ textAlign: "right" }}>{row.w1}</td>
                  <td style={{ textAlign: "right" }}>{row.w2}</td>
                  <td style={{ textAlign: "right" }}>{row.w3}</td>
                  <td style={{ textAlign: "right" }}>{row.w4}</td>
                  <td style={{ textAlign: "right", fontWeight: 800, color: "#1e3a8a", backgroundColor: "#eff6ff" }}>
                    {row.current}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. 최근 본 기사 모니터링
// -------------------------------------------------------------
function RecentArticlesTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 3대 핵심 통계 카드 */}
      <div className={styles.kpiGrid3}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>총 열람 수</div>
          <div className={styles.kpiValue}>788,200건</div>
          <div style={{ fontSize: "11px", color: "#059669", fontWeight: 600, marginTop: "6px" }}>
            전주 대비 +6.5% 증가
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>전체 열람 평균</div>
          <div className={styles.kpiValue}>18.4건</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>1인당 평균 읽은 기사량</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>상위 10% 열람 평균</div>
          <div className={styles.kpiValue} style={{ color: "#2563eb" }}>74.2건</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>충성·헤비 독자층 평균 소비량</div>
        </div>
      </div>

      <div className={styles.grid3Col}>
        {/* 시간대별 기사 소비 집중도 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>시간대별 기사 소비 집중도 (24H)</h3>
            </div>
            <Clock3 size={18} color="#94a3b8" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginTop: "16px" }}>
            {[
              { time: "06~10시", count: "312,400건", pct: 39.6, peak: true },
              { time: "10~14시", count: "168,200건", pct: 21.3 },
              { time: "18~22시", count: "142,500건", pct: 18.1 },
              { time: "14~18시", count: "98,300건", pct: 12.5 },
              { time: "22~02시", count: "48,100건", pct: 6.1 },
              { time: "02~06시", count: "18,500건", pct: 2.4, low: true },
            ].map((slot, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 8px",
                  borderRadius: "8px",
                  border: slot.peak ? "1px solid #dbeafe" : slot.low ? "1px solid #f1f5f9" : "1px solid #e2e8f0",
                  backgroundColor: slot.peak ? "#f0f7ff" : slot.low ? "#f8fafc" : "#ffffff",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: slot.peak ? 700 : 600, color: slot.peak ? "#1e40af" : slot.low ? "#64748b" : "#1e293b" }}>
                  {slot.time}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: slot.peak ? "#1e3a8a" : slot.low ? "#64748b" : "#0f172a", marginTop: "12px" }}>
                  {slot.pct}%
                </div>
                <div style={{ fontSize: "11px", color: slot.low ? "#94a3b8" : "#64748b", marginTop: "2px" }}>
                  {slot.count}
                </div>
              </div>
            ))}
          </div>

          {/* 소비량 구간 분포 */}
          <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
              회원 1인당 기사 소비량 구간 분포
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { range: "1~3건 (탐색형)", pct: 36, count: "28,200명", color: "#94a3b8" },
                { range: "4~10건 (일반형)", pct: 31, count: "24,300명", color: "#3b82f6" },
                { range: "11~20건 (관심층)", pct: 19, count: "14,900명", color: "#6366f1" },
                { range: "21~50건 (충성독자)", pct: 10, count: "7,800명", color: "#8b5cf6" },
                { range: "51건 이상 (헤비 리더)", pct: 4, count: "3,100명", color: "#f59e0b" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", fontSize: "12px", gap: "12px" }}>
                  <span style={{ width: "130px", flexShrink: 0, color: "#475569", fontWeight: 500 }}>{b.range}</span>
                  <div style={{ flex: 1, backgroundColor: "#f1f5f9", height: "12px", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${b.pct}%`, backgroundColor: b.color, height: "100%", borderRadius: "999px" }} />
                  </div>
                  <span style={{ width: "110px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>
                    {b.pct}% ({b.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 카테고리 전수 소비 비중 (10개 카테고리) */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>전체 카테고리 소비</h3>
            </div>
            <Layers size={18} color="#94a3b8" />
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th style={{ textAlign: "right" }}>열람 건수</th>
                  <th style={{ textAlign: "right" }}>점유율</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "증권", count: "328,600", pct: "41.7%", hot: true },
                  { name: "부동산", count: "159,200", pct: "20.2%", hot: true },
                  { name: "경제", count: "108,700", pct: "13.8%" },
                  { name: "IT/과학", count: "58,300", pct: "7.4%" },
                  { name: "오피니언", count: "39,400", pct: "5.0%" },
                  { name: "정치", count: "33,100", pct: "4.2%" },
                  { name: "사회", count: "24,400", pct: "3.1%" },
                  { name: "국제", count: "19,700", pct: "2.5%" },
                  { name: "생활/문화", count: "10,800", pct: "1.4%" },
                  { name: "스포츠", count: "6,000", pct: "0.7%" },
                ].map((sec, idx) => (
                  <tr key={idx} className={sec.hot ? styles.highlightRow : ""}>
                    <td style={{ fontWeight: sec.hot ? 700 : 500, color: sec.hot ? "#1e3a8a" : "#334155" }}>
                      {idx + 1}. {sec.name}
                    </td>
                    <td style={{ textAlign: "right", color: "#64748b" }}>{sec.count}</td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#0f172a" }}>{sec.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI 읽기 성향 분포도 */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>AI 읽기 성향 분포도</h3>
          </div>
          <span style={{ fontSize: "11px", backgroundColor: "#eef2ff", color: "#4338ca", padding: "4px 10px", borderRadius: "999px", fontWeight: 700 }}>
            16종 페르소나
          </span>
        </div>

        <div className={styles.cardPersonaGrid}>
          {[
            { rank: 1, name: "독수리형 독자", time: "오전형", field: "집중형", target: "대상형", img: "/aicard/독수리.svg", pct: "16.8%", count: "13,180명" },
            { rank: 2, name: "비버형 독자", time: "오전형", field: "집중형", target: "흐름형", img: "/aicard/비버.svg", pct: "14.2%", count: "11,140명" },
            { rank: 3, name: "올빼미형 독자", time: "야간형", field: "집중형", target: "대상형", img: "/aicard/올빼미.svg", pct: "11.5%", count: "9,020명" },
            { rank: 4, name: "치타형 독자", time: "오후형", field: "집중형", target: "대상형", img: "/aicard/치타.svg", pct: "9.8%", count: "7,690명" },
            { rank: 5, name: "고양이형 독자", time: "저녁형", field: "집중형", target: "대상형", img: "/aicard/고양이.svg", pct: "8.4%", count: "6,590명" },
            { rank: 6, name: "다람쥐형 독자", time: "오전형", field: "탐험형", target: "대상형", img: "/aicard/다람쥐.svg", pct: "7.1%", count: "5,570명" },
            { rank: 7, name: "꿀벌형 독자", time: "오전형", field: "탐험형", target: "흐름형", img: "/aicard/꿀벌.svg", pct: "6.5%", count: "5,100명" },
            { rank: 8, name: "코끼리형 독자", time: "오후형", field: "집중형", target: "흐름형", img: "/aicard/코끼리.svg", pct: "5.4%", count: "4,230명" },
            { rank: 9, name: "늑대형 독자", time: "저녁형", field: "집중형", target: "흐름형", img: "/aicard/늑대.svg", pct: "4.8%", count: "3,760명" },
            { rank: 10, name: "반딧불이형 독자", time: "야간형", field: "집중형", target: "흐름형", img: "/aicard/반딧불이.svg", pct: "4.2%", count: "3,290명" },
            { rank: 11, name: "미어캣형 독자", time: "오후형", field: "탐험형", target: "대상형", img: "/aicard/미어캣.svg", pct: "3.5%", count: "2,740명" },
            { rank: 12, name: "기린형 독자", time: "오후형", field: "탐험형", target: "흐름형", img: "/aicard/기린.svg", pct: "2.8%", count: "2,190명" },
            { rank: 13, name: "수달형 독자", time: "저녁형", field: "탐험형", target: "대상형", img: "/aicard/수달.svg", pct: "1.9%", count: "1,490명" },
            { rank: 14, name: "돌고래형 독자", time: "저녁형", field: "탐험형", target: "흐름형", img: "/aicard/돌고래.svg", pct: "1.5%", count: "1,170명" },
            { rank: 15, name: "너구리형 독자", time: "야간형", field: "탐험형", target: "대상형", img: "/aicard/너구리.svg", pct: "1.0%", count: "780명" },
            { rank: 16, name: "여우형 독자", time: "야간형", field: "탐험형", target: "흐름형", img: "/aicard/여우.svg", pct: "0.6%", count: "470명" },
          ].map((card, i) => (
            <div key={i} className={styles.personaCard}>
              <div className={styles.personaTop}>
                <span className={styles.personaRank}>TOP {card.rank}</span>
                <span className={styles.personaPct}>{card.pct}</span>
              </div>
              <div className={styles.personaBody}>
                <div className={styles.personaImgBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.name}
                    className={styles.personaImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.personaInfo}>
                  <div className={styles.personaName}>{card.name}</div>
                  <div className={styles.personaTags}>
                    <span className={styles.personaTag}>{card.time}</span>
                    <span className={styles.personaTag}>{card.field}</span>
                    <span className={styles.personaTag}>{card.target}</span>
                  </div>
                </div>
              </div>
              <div className={styles.personaBottom}>
                <span>{card.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. 관심종목 모니터링
// -------------------------------------------------------------
function WatchlistTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>관심종목 이용 회원 수</div>
          <div className={styles.kpiValue}>31,420명</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>총 담긴 관심종목 수</div>
          <div className={styles.kpiValue}>218,650건</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>1인당 평균 보유 종목 수</div>
          <div className={styles.kpiValue}>7.0개</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>그룹당 평균 적재 종목 수</div>
          <div className={styles.kpiValue}>5.3개</div>
        </div>
      </div>

      {/* 1~10개 그룹 개수별 사용자 수 전수 분포 */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>관심종목 그룹 개수별 사용자 수 분포</h3>
          </div>
        </div>

        {/* 바 차트 */}
        <div className={styles.barChartWrapper}>
          {[
            { group: "1개", count: 14200, pct: "45.2%", h: 100 },
            { group: "2개", count: 8100, pct: "25.8%", h: 57 },
            { group: "3개", count: 4200, pct: "13.4%", h: 30 },
            { group: "4개", count: 2100, pct: "6.7%", h: 15 },
            { group: "5개", count: 1250, pct: "4.0%", h: 9 },
            { group: "6개", count: 680, pct: "2.2%", h: 5 },
            { group: "7개", count: 390, pct: "1.2%", h: 3 },
            { group: "8개", count: 240, pct: "0.8%", h: 2 },
            { group: "9개", count: 150, pct: "0.5%", h: 1.5 },
            { group: "10개", count: 110, pct: "0.3%", h: 1 },
          ].map((item, idx) => (
            <div key={idx} className={styles.barCol}>
              <span style={{ fontSize: "10px", color: "#64748b", marginBottom: "4px" }}>{item.pct}</span>
              <div
                style={{
                  height: `${item.h}%`,
                  width: "100%",
                  maxWidth: "40px",
                  borderRadius: "4px 4px 0 0",
                  backgroundColor: idx === 0 ? "#b45309" : idx === 1 ? "#d97706" : "#f59e0b",
                }}
              />
              <span className={styles.barLabel}>{item.group}</span>
            </div>
          ))}
        </div>

        {/* 1~10 전수 상세 표 */}
        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>생성 그룹수</th>
                <th style={{ textAlign: "right" }}>사용자 수 (명)</th>
                <th style={{ textAlign: "right" }}>비중 (%)</th>
                <th style={{ textAlign: "right" }}>해당 그룹 총 종목수</th>
              </tr>
            </thead>
            <tbody>
              {[
                { g: "1개 그룹", u: "14,200", p: "45.2%", s: "68,160" },
                { g: "2개 그룹", u: "8,100", p: "25.8%", s: "48,600" },
                { g: "3개 그룹", u: "4,200", p: "13.4%", s: "35,280" },
                { g: "4개 그룹", u: "2,100", p: "6.7%", s: "21,840" },
                { g: "5개 그룹", u: "1,250", p: "4.0%", s: "16,250" },
                { g: "6개 그룹", u: "680", p: "2.2%", s: "10,200" },
                { g: "7개 그룹", u: "390", p: "1.2%", s: "6,630" },
                { g: "8개 그룹", u: "240", p: "0.8%", s: "4,560" },
                { g: "9개 그룹", u: "150", p: "0.5%", s: "3,150" },
                { g: "10개 그룹", u: "110", p: "0.3%", s: "3,980" },
              ].map((row, i) => (
                <tr key={i} className={i < 2 ? styles.highlightRow : ""}>
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>{row.g}</td>
                  <td style={{ textAlign: "right" }}>{row.u}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#92400e" }}>{row.p}</td>
                  <td style={{ textAlign: "right", color: "#64748b" }}>{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 가장 많이 등록된 인기 종목 TOP 20 (시장별 비율 통합) */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader} style={{ flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 className={styles.sectionTitle}>가장 많이 등록된 인기 종목 TOP 20</h3>
          </div>
          {/* 국내/해외 주식 등록 비율 바 */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "6px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>시장별 등록 비중:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2563eb" }} />
              <span style={{ color: "#1e40af", fontWeight: 700 }}>국내주식 64.5%</span>
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>(141,029건)</span>
            </div>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#9333ea" }} />
              <span style={{ color: "#6b21a8", fontWeight: 700 }}>해외주식 35.5%</span>
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>(77,621건)</span>
            </div>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>순위</th>
                <th>종목명</th>
                <th>종목코드</th>
                <th>시장</th>
                <th style={{ textAlign: "right" }}>담은 회원수</th>
              </tr>
            </thead>
            <tbody>
              {[
                { r: 1, name: "삼성전자", code: "005930", m: "국내 (코스피)", u: "19,840명" },
                { r: 2, name: "엔비디아 (NVDA)", code: "NVDA", m: "해외 (나스닥)", u: "16,420명" },
                { r: 3, name: "SK하이닉스", code: "000660", m: "국내 (코스피)", u: "15,890명" },
                { r: 4, name: "애플 (AAPL)", code: "AAPL", m: "해외 (나스닥)", u: "13,100명" },
                { r: 5, name: "테슬라 (TSLA)", code: "TSLA", m: "해외 (나스닥)", u: "12,450명" },
                { r: 6, name: "현대차", code: "005380", m: "국내 (코스피)", u: "9,820명" },
                { r: 7, name: "마이크로소프트 (MSFT)", code: "MSFT", m: "해외 (나스닥)", u: "9,120명" },
                { r: 8, name: "NAVER", code: "035420", m: "국내 (코스피)", u: "7,840명" },
                { r: 9, name: "카카오", code: "035720", m: "국내 (코스피)", u: "7,110명" },
                { r: 10, name: "알파벳 A (GOOGL)", code: "GOOGL", m: "해외 (나스닥)", u: "6,980명" },
                { r: 11, name: "LG에너지솔루션", code: "373220", m: "국내 (코스피)", u: "6,450명" },
                { r: 12, name: "아마존 (AMZN)", code: "AMZN", m: "해외 (나스닥)", u: "6,120명" },
                { r: 13, name: "기아", code: "000270", m: "국내 (코스피)", u: "5,840명" },
                { r: 14, name: "메타 플랫폼스 (META)", code: "META", m: "해외 (나스닥)", u: "5,320명" },
                { r: 15, name: "셀트리온", code: "068270", m: "국내 (코스피)", u: "4,980명" },
                { r: 16, name: "브로드컴 (AVGO)", code: "AVGO", m: "해외 (나스닥)", u: "4,610명" },
                { r: 17, name: "삼성바이오로직스", code: "207940", m: "국내 (코스피)", u: "4,250명" },
                { r: 18, name: "AMD", code: "AMD", m: "해외 (나스닥)", u: "3,980명" },
                { r: 19, name: "POSCO홀딩스", code: "005490", m: "국내 (코스피)", u: "3,750명" },
                { r: 20, name: "팔란티어 (PLTR)", code: "PLTR", m: "해외 (뉴욕)", u: "3,540명" },
              ].map((stock, i) => (
                <tr key={i} className={stock.r <= 3 ? styles.highlightRow : ""}>
                  <td style={{ fontWeight: 800, color: stock.r <= 3 ? "#1e40af" : "#0f172a" }}>{stock.r}</td>
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>{stock.name}</td>
                  <td style={{ fontFamily: "monospace", color: "#64748b" }}>{stock.code}</td>
                  <td>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: stock.m.includes("국내") ? "#eff6ff" : "#faf5ff", color: stock.m.includes("국내") ? "#1d4ed8" : "#7e22ce", fontWeight: 600 }}>
                      {stock.m}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#0f172a" }}>{stock.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. 배지 상세 모니터링
// -------------------------------------------------------------
function BadgesTab({
  selectedGroup,
  onSelectGroup,
}: {
  selectedGroup: string;
  onSelectGroup: (g: string) => void;
}) {
  const ALL_LIVE_BADGES = [
    { name: "ALICE Q의 초대", group: "웰컴 스타터", w1: 34200, w2: 35600, w3: 37000, current: 38240, diff: "+3.4%" },
    { name: "오늘부터 한경인", group: "웰컴 스타터", w1: 30500, w2: 31700, w3: 32920, current: 34100, diff: "+3.6%" },
    { name: "이게 바로 나", group: "웰컴 스타터", w1: 22100, w2: 23100, w3: 24000, current: 24890, diff: "+3.7%" },
    { name: "마이 뉴스룸", group: "웰컴 스타터", w1: 16100, w2: 16900, w3: 17710, current: 18450, diff: "+4.2%" },
    { name: "소통의 첫걸음", group: "웰컴 스타터", w1: 12400, w2: 13000, w3: 13610, current: 14200, diff: "+4.3%" },
    { name: "공감 맛집", group: "웰컴 스타터", w1: 9900, w2: 10400, w3: 10880, current: 11300, diff: "+3.9%" },
    { name: "알림은 못 참지", group: "웰컴 스타터", w1: 8600, w2: 9000, w3: 9460, current: 9840, diff: "+4.0%" },
    { name: "좋은 건 함께", group: "웰컴 스타터", w1: 6500, w2: 6800, w3: 7130, current: 7420, diff: "+4.1%" },
    { name: "한경 프레스티지", group: "프리미엄9 라운지", w1: 5200, w2: 5400, w3: 5640, current: 5820, diff: "+3.2%" },
    { name: "AI 투자 고수", group: "프리미엄9 라운지", w1: 2700, w2: 2850, w3: 3010, current: 3120, diff: "+3.7%" },
  ];

  const filteredBadges = useMemo(() => {
    if (selectedGroup === "all") return ALL_LIVE_BADGES;
    return ALL_LIVE_BADGES.filter((b) => b.group === selectedGroup);
  }, [selectedGroup]);

  const weeklySums = useMemo(() => {
    return filteredBadges.reduce(
      (acc, b) => ({
        w1: acc.w1 + b.w1,
        w2: acc.w2 + b.w2,
        w3: acc.w3 + b.w3,
        current: acc.current + b.current,
      }),
      { w1: 0, w2: 0, w3: 0, current: 0 }
    );
  }, [filteredBadges]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 4종 KPI 카드 */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>운영중인 배지 수</div>
          <div className={styles.kpiValue}>10개</div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>지급된 총 배지 수</div>
          <div className={styles.kpiValue} style={{ color: "#7e22ce" }}>142,380개</div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>배지 사용자 수</div>
          <div className={styles.kpiValue}>58,190명</div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>인당 평균 배지 수</div>
          <div className={styles.kpiValue}>2.45개</div>
        </div>
      </div>

      {/* 배지 추이 상세 테이블 (방식 B) */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader} style={{ flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 className={styles.sectionTitle}>배지 추이</h3>
          </div>

          <div className={styles.filterTabs}>
            {[
              { id: "all", label: "전체 (10종)" },
              { id: "웰컴 스타터", label: "웰컴 스타터 (8)" },
              { id: "프리미엄9 라운지", label: "프리미엄9 라운지 (2)" },
              { id: "한경 탐험가", label: "탐험가 (0)" },
              { id: "한경 헤리티지", label: "헤리티지 (0)" },
              { id: "히든 배지", label: "히든 (0)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectGroup(tab.id)}
                className={`${styles.filterBtn} ${selectedGroup === tab.id ? styles.filterBtnActive : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>순위</th>
                <th>배지명</th>
                <th>소속 그룹</th>
                <th style={{ textAlign: "right" }}>08.4주</th>
                <th style={{ textAlign: "right" }}>09.1주</th>
                <th style={{ textAlign: "right" }}>09.2주</th>
                <th style={{ textAlign: "right", backgroundColor: "#faf5ff", color: "#6b21a8" }}>09.3주 (현재)</th>
              </tr>
            </thead>
            <tbody>
              {filteredBadges.length > 0 ? (
                <>
                  {filteredBadges.map((badge, idx) => (
                    <tr key={idx} className={idx < 3 ? styles.highlightRow : ""}>
                      <td style={{ fontWeight: 800, color: "#0f172a" }}>{idx + 1}</td>
                      <td style={{ fontWeight: 700, color: "#0f172a" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Award size={15} color="#7e22ce" />
                          {badge.name}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: badge.group === "프리미엄9 라운지" ? "#faf5ff" : "#eff6ff", color: badge.group === "프리미엄9 라운지" ? "#7e22ce" : "#1d4ed8", fontWeight: 600 }}>
                          {badge.group}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>{badge.w1.toLocaleString()}개</td>
                      <td style={{ textAlign: "right" }}>{badge.w2.toLocaleString()}개</td>
                      <td style={{ textAlign: "right" }}>{badge.w3.toLocaleString()}개</td>
                      <td style={{ textAlign: "right", fontWeight: 800, color: "#7e22ce", backgroundColor: "#faf5ff" }}>
                        {badge.current.toLocaleString()}개
                      </td>
                    </tr>
                  ))}
                  {/* 합계 행 */}
                  <tr style={{ backgroundColor: "#f8fafc", borderTop: "2px solid #cbd5e1" }}>
                    <td colSpan={3} style={{ fontWeight: 800, color: "#1e293b", textAlign: "center", letterSpacing: "1px" }}>
                      합계 ({selectedGroup === "all" ? "전체" : selectedGroup})
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{weeklySums.w1.toLocaleString()}개</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{weeklySums.w2.toLocaleString()}개</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{weeklySums.w3.toLocaleString()}개</td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "#7e22ce", fontSize: "15px", backgroundColor: "#faf5ff" }}>
                      {weeklySums.current.toLocaleString()}개
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                    현재 운영 중인 배지가 없는 그룹입니다. (오픈 준비중)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. 준비 중 메뉴 화면 (Empty State)
// -------------------------------------------------------------
function EmptyStateTab({ tab }: { tab: AdminTab }) {
  const item = MENU_ITEMS.find((m) => m.id === tab);
  const Icon = item?.icon || Layers;

  return (
    <div className={styles.emptyStateCard}>
      <div className={styles.emptyIconCircle}>
        <Icon size={32} />
      </div>
      <h3 className={styles.emptyTitle}>
        {item?.label} 모니터링 준비 중
      </h3>
      <p className={styles.emptyDesc}>
        {item?.label} 서비스는 현재 개발 및 데이터 파이프라인 구축 단계에 있습니다. 정식 오픈 후 지표 모니터링이 제공될 예정입니다.
      </p>
      <div className={styles.emptyBadge}>
        <Clock3 size={14} /> 차기 릴리즈 오픈 예정
      </div>
    </div>
  );
}
