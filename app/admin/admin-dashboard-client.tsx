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
          <div className={styles.navSectionTitle}>모니터링 대시보드</div>
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
            <div className={styles.breadcrumb}>
              <span>관리자 콘솔</span>
              <ChevronRight size={12} />
              <strong style={{ color: "#334155" }}>
                {MENU_ITEMS.find((m) => m.id === currentTab)?.label}
              </strong>
            </div>
            <h2 className={styles.pageHeading}>
              {MENU_ITEMS.find((m) => m.id === currentTab)?.label} 모니터링
            </h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.timestampBox}>
              <span className={styles.statusDot}></span>
              <span>기준일시: <strong style={{ color: "#0f172a" }}>{lastRefreshed}</strong> (오늘 기준)</span>
            </div>
            <button
              onClick={refreshData}
              title="데이터 새로고침"
              type="button"
              className={styles.refreshBtn}
            >
              <RefreshCw size={15} />
            </button>
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
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>1개 이상 등록 사용자 수</div>
          <div className={styles.kpiValue}>42,850명</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            전체 회원 침투율: <strong style={{ color: "#2563eb" }}>38.4%</strong>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>등록된 총 브리핑 수</div>
          <div className={styles.kpiValue}>94,270개</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>일일 자동 발행 대상</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>사용자 평균 등록 브리핑 수</div>
          <div className={styles.kpiValue}>2.2개</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>브리핑 등록 회원 기준</div>
        </div>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>1인 최다 등록 브리핑 수</div>
          <div className={styles.kpiValue}>8개</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>헤비 에이전트 유저</div>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* 주제별 비중 (4대 주제) */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>브리핑 주제별 선호 비중</h3>
              <p className={styles.sectionSubtitle}>4개 핵심 주제 설정 현황</p>
            </div>
            <PieChart size={18} color="#94a3b8" />
          </div>

          <div className={styles.progressList}>
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

          <div style={{ marginTop: "24px", padding: "12px", borderRadius: "8px", backgroundColor: "#f8fafc", fontSize: "12px", color: "#475569" }}>
            💡 <strong>인사이트</strong>: 글로벌 증시 변동성 확대로 인해 <strong>미국 증시 브리핑(42%)</strong>에 대한 선호가 압도적으로 높습니다.
          </div>
        </div>

        {/* 수신 시간대별 설정 비중 */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>수신 시간대별 설정 비중</h3>
              <p className={styles.sectionSubtitle}>출근길 vs 오후 장 마감 리포트</p>
            </div>
            <Clock3 size={18} color="#94a3b8" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
            <div style={{ padding: "18px", borderRadius: "10px", border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e40af" }}>오전 08:00 (출근길)</div>
              <div style={{ fontSize: "30px", fontWeight: 800, color: "#1e3a8a", margin: "6px 0" }}>68%</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>64,103건 등록</div>
            </div>
            <div style={{ padding: "18px", borderRadius: "10px", border: "1px solid #fde68a", backgroundColor: "#fffbeb", textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400e" }}>오후 17:00 (오후)</div>
              <div style={{ fontSize: "30px", fontWeight: 800, color: "#78350f", margin: "6px 0" }}>32%</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>30,167건 등록</div>
            </div>
          </div>

          <div style={{ marginTop: "24px", fontSize: "12px", color: "#64748b", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid #f1f5f9" }}>
              <span>매일(월~일) 자동 발행 비율</span>
              <strong style={{ color: "#0f172a" }}>89.4%</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid #f1f5f9" }}>
              <span>평일만 수신 비율</span>
              <strong style={{ color: "#0f172a" }}>10.6%</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>AI 브리핑 정상 생성 성공률</span>
              <strong style={{ color: "#059669" }}>99.8% (정상 가동)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 브리핑 주간 성장 추이 표 */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>My 브리핑 주간 성장 추이 히스토리</h3>
        <p className={styles.sectionSubtitle}>주차별 신규 에이전트 생성 건수 및 누적 등록수</p>

        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>주차</th>
                <th>등록 유저수</th>
                <th>총 브리핑수</th>
                <th>주간 신규 생성</th>
                <th>미국증시(%)</th>
                <th>국내증시(%)</th>
                <th>전주 대비 증감</th>
              </tr>
            </thead>
            <tbody>
              {[
                { w: "09.3주 (현재)", u: "42,850", b: "94,270", n: "+8,210", us: "42%", kr: "31%", diff: "+9.5%" },
                { w: "09.2주", u: "40,100", b: "86,060", n: "+7,890", us: "41%", kr: "31%", diff: "+10.1%" },
                { w: "09.1주", u: "37,800", b: "78,170", n: "+7,220", us: "40%", kr: "32%", diff: "+10.2%" },
                { w: "08.4주", u: "34,500", b: "70,950", n: "+6,750", us: "39%", kr: "33%", diff: "+10.5%" },
                { w: "08.3주", u: "31,200", b: "64,200", n: "+6,100", us: "39%", kr: "33%", diff: "+10.5%" },
              ].map((row, idx) => (
                <tr key={idx} className={idx === 0 ? styles.highlightRow : ""}>
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>{row.w}</td>
                  <td>{row.u}</td>
                  <td>{row.b}</td>
                  <td style={{ color: "#2563eb", fontWeight: 700 }}>{row.n}</td>
                  <td>{row.us}</td>
                  <td>{row.kr}</td>
                  <td style={{ color: "#059669", fontWeight: 700 }}>{row.diff}</td>
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
    { name: "ALICE Q의 초대", group: "웰컴 스타터", earners: 38240, rate: "65.7%", weekGain: "+1,240" },
    { name: "오늘부터 한경인", group: "웰컴 스타터", earners: 34100, rate: "58.6%", weekGain: "+1,180" },
    { name: "이게 바로 나", group: "웰컴 스타터", earners: 24890, rate: "42.8%", weekGain: "+890" },
    { name: "마이 뉴스룸", group: "웰컴 스타터", earners: 18450, rate: "31.7%", weekGain: "+740" },
    { name: "소통의 첫걸음", group: "웰컴 스타터", earners: 14200, rate: "24.4%", weekGain: "+590" },
    { name: "공감 맛집", group: "웰컴 스타터", earners: 11300, rate: "19.4%", weekGain: "+420" },
    { name: "알림은 못 참지", group: "웰컴 스타터", earners: 9840, rate: "16.9%", weekGain: "+380" },
    { name: "좋은 건 함께", group: "웰컴 스타터", earners: 7420, rate: "12.7%", weekGain: "+290" },
    { name: "한경 프레스티지", group: "프리미엄9 라운지", earners: 5820, rate: "10.0%", weekGain: "+180" },
    { name: "AI 투자 고수", group: "프리미엄9 라운지", earners: 3120, rate: "5.4%", weekGain: "+110" },
  ];

  const filteredBadges = useMemo(() => {
    if (selectedGroup === "all") return ALL_LIVE_BADGES;
    return ALL_LIVE_BADGES.filter((b) => b.group === selectedGroup);
  }, [selectedGroup]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 사용자 요청 최소 배지 통계값 4종 KPI 카드 */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>운영 중인 배지 수</div>
          <div className={styles.kpiValue}>10개</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            웰컴 8종 + 프리미엄 2종 라이브
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>사용자들에게 지급된 총 배지 수</div>
          <div className={styles.kpiValue} style={{ color: "#7e22ce" }}>142,380개</div>
          <div style={{ fontSize: "11px", color: "#059669", fontWeight: 700, marginTop: "6px" }}>
            최근 1주간 +6,020개 지급
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>배지 1개 이상 획득 사용자 수</div>
          <div className={styles.kpiValue}>58,190명</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            전체 회원 대비 달성률: <strong style={{ color: "#2563eb" }}>52.1%</strong>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>회원당 평균 배지 수</div>
          <div className={styles.kpiValue}>2.45개</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            (보유자 기준 평균: <strong>2.82개</strong>)
          </div>
        </div>
      </div>

      {/* 5대 그룹별 현황 */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>5대 배지 그룹별 운영 현황 및 지급량</h3>
            <p className={styles.sectionSubtitle}>그룹별 라이브 배지 수량과 누적 획득 지표</p>
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", backgroundColor: "#f8fafc", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            총 5개 그룹
          </span>
        </div>

        <div className={styles.badgeGroupGrid}>
          {[
            { id: "웰컴 스타터", name: "웰컴 스타터", status: "라이브 (8개)", totalIssued: "133,440개", activeUsers: "57,800명", active: true },
            { id: "프리미엄9 라운지", name: "프리미엄9 라운지", status: "라이브 (2개)", totalIssued: "8,940개", activeUsers: "6,210명", active: true },
            { id: "한경 탐험가", name: "한경 탐험가", status: "오픈 준비중", totalIssued: "0개", activeUsers: "-", active: false },
            { id: "한경 헤리티지", name: "한경 헤리티지", status: "오픈 준비중", totalIssued: "0개", activeUsers: "-", active: false },
            { id: "히든 배지", name: "히든 배지", status: "오픈 준비중", totalIssued: "0개", activeUsers: "-", active: false },
          ].map((grp, idx) => (
            <div
              key={idx}
              className={`${styles.badgeGroupCard} ${grp.active ? styles.bgActive : styles.bgInactive}`}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{grp.name}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{grp.status}</div>
              </div>
              <div style={{ marginTop: "16px", paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>총 지급량</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a" }}>{grp.totalIssued}</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "2px" }}>획득자: {grp.activeUsers}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배지별 상세 테이블 (10종 전수) */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>운영 중인 배지별 획득자 수 및 획득률 (전수)</h3>
            <p className={styles.sectionSubtitle}>획득자 수 기준 자동 내림차순 랭킹</p>
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
                <th>순위</th>
                <th>배지명</th>
                <th>소속 그룹</th>
                <th style={{ textAlign: "right" }}>누적 획득자 수</th>
                <th style={{ textAlign: "right" }}>전체 대비 획득률</th>
                <th style={{ textAlign: "right" }}>주간 신규 획득 (증가 추이)</th>
              </tr>
            </thead>
            <tbody>
              {filteredBadges.length > 0 ? (
                filteredBadges.map((badge, idx) => (
                  <tr key={idx} className={idx < 3 ? styles.highlightRow : ""}>
                    <td style={{ fontWeight: 800, color: "#0f172a" }}>{idx + 1}</td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Award size={15} color="#7e22ce" />
                        {badge.name}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "10.5px", padding: "2px 8px", borderRadius: "4px", backgroundColor: badge.group === "프리미엄9 라운지" ? "#faf5ff" : "#eff6ff", color: badge.group === "프리미엄9 라운지" ? "#7e22ce" : "#1d4ed8", fontWeight: 600 }}>
                        {badge.group}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "#0f172a" }}>
                      {badge.earners.toLocaleString()}명
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#7e22ce" }}>
                      {badge.rate}
                    </td>
                    <td style={{ textAlign: "right", color: "#059669", fontWeight: 700 }}>
                      {badge.weekGain}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
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
