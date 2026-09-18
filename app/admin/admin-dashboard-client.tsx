"use client";

import {
  Award,
  BarChart3,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  ExternalLink,
  Flame,
  Globe2,
  HelpCircle,
  Home,
  Info,
  Layers,
  LineChart,
  LogOut,
  Menu,
  Minus,
  Newspaper,
  PieChart,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

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
  { id: "overview", label: "대시보드 홈", icon: Home, ready: true },
  { id: "briefing", label: "My 브리핑", icon: Newspaper, ready: true },
  { id: "recent-articles", label: "최근 본 기사", icon: Clock3, ready: true },
  { id: "watchlist", label: "관심종목", icon: Star, ready: true },
  { id: "badges", label: "배지", icon: Award, ready: true },
  { id: "reporters", label: "관심 기자", icon: UserRound, ready: false, badge: "준비중" },
  { id: "scraps", label: "뉴스 스크랩", icon: Bookmark, ready: false, badge: "준비중" },
  { id: "portfolio", label: "포트폴리오", icon: BarChart3, ready: false, badge: "준비중" },
];

export default function AdminDashboardClient() {
  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBadgeGroup, setSelectedBadgeGroup] = useState<string>("all");
  const [lastRefreshed, setLastRefreshed] = useState("2026.09.18 16:40");

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
    <div className="min-h-screen bg-[#f1f3f7] text-[#17191d] flex flex-col md:flex-row font-sans">
      {/* 모바일 상단 바 */}
      <div className="md:hidden bg-[#12284e] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">My한경 관리자</span>
          <span className="text-xs bg-blue-600/80 text-blue-100 px-1.5 py-0.5 rounded font-mono">ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 사이드바 LNB */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#12284e] text-slate-200 flex flex-col shrink-0 min-h-screen z-20`}
      >
        <div className="p-5 border-b border-white/10 hidden md:block">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
              HK
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none">마이한경 관리자</h1>
              <span className="text-[11px] text-slate-400 font-medium">서비스 모니터링 시스템</span>
            </div>
          </div>
        </div>

        {/* 내비게이션 메뉴 */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            모니터링 대시보드
          </div>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 하단 바로가기 및 정보 */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              마이한경 서비스 바로가기
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <div className="text-[11px] text-slate-400 px-1">
            <span>한국경제신문 디지털미디어본부</span>
            <div className="mt-0.5 text-slate-500">v1.0 (2026.09.18)</div>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5">
              <span>관리자 콘솔</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-700 font-semibold">
                {MENU_ITEMS.find((m) => m.id === currentTab)?.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {MENU_ITEMS.find((m) => m.id === currentTab)?.label} 모니터링
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>기준일시: <strong className="text-slate-700">{lastRefreshed}</strong> (오늘 기준)</span>
            </div>
            <button
              onClick={refreshData}
              title="데이터 새로고침"
              className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 탭 본문 내용 */}
        <div className="p-6 space-y-6 max-w-7xl">
          {currentTab === "overview" && <OverviewTab onNavigate={setCurrentTab} />}
          {currentTab === "briefing" && <BriefingTab />}
          {currentTab === "recent-articles" && <RecentArticlesTab />}
          {currentTab === "watchlist" && <WatchlistTab />}
          {currentTab === "badges" && (
            <BadgesTab
              selectedGroup={selectedBadgeGroup}
              onSelectGroup={setSelectedBadgeGroup}
            />
          )}
          {["reporters", "scraps", "portfolio"].includes(currentTab) && (
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
    <div className="space-y-6">
      {/* 4대 서비스 핵심 KPI 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My 브리핑 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              My 브리핑
            </span>
            <Newspaper className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">42,850명</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>등록된 에이전트: <strong>94,270개</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">1인 평균 2.2개 생성</span>
            <button
              onClick={() => onNavigate("briefing")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
            >
              상세보기 <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 최근 본 기사 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              최근 본 기사
            </span>
            <Clock3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">18.4건</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>1인 평균 열람 기사수</span>
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8.7%
            </span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">최고 342건 (다독자)</span>
            <button
              onClick={() => onNavigate("recent-articles")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              상세보기 <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 관심종목 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              관심종목
            </span>
            <Star className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">31,420명</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>총 등록 종목: <strong>218,650건</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +11.5%
            </span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">그룹당 평균 5.3개</span>
            <button
              onClick={() => onNavigate("watchlist")}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center"
            >
              상세보기 <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 배지 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              배지
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">142,380개</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>획득 회원: <strong>58,190명</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +19.3%
            </span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">라이브 배지: 10종</span>
            <button
              onClick={() => onNavigate("badges")}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center"
            >
              상세보기 <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 종합 주간 활성화 추이 차트 및 표 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">최근 8주간 서비스별 참여도 성장 추이</h3>
            <p className="text-xs text-slate-500 mt-0.5">주차별 활성 사용자수 및 핵심 활동량 누적 트렌드</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-slate-600">My 브리핑 생성</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600">기사 열람 건수 (백단위)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">관심종목 등록</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-slate-600">배지 획득수</span>
            </div>
          </div>
        </div>

        {/* 심플 시각화 바/라인 차트 영역 */}
        <div className="h-64 flex items-end gap-2 sm:gap-6 pt-6 pb-2 border-b border-slate-200">
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
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-48">
                <div
                  style={{ height: `${(item.b / 142) * 100}%` }}
                  className="w-1.5 sm:w-2 bg-blue-600 rounded-t transition-all group-hover:brightness-110"
                  title={`My 브리핑: ${item.b}`}
                />
                <div
                  style={{ height: `${(item.r / 142) * 100}%` }}
                  className="w-1.5 sm:w-2 bg-indigo-500 rounded-t transition-all group-hover:brightness-110"
                  title={`기사 열람: ${item.r}`}
                />
                <div
                  style={{ height: `${(item.w / 142) * 100}%` }}
                  className="w-1.5 sm:w-2 bg-amber-500 rounded-t transition-all group-hover:brightness-110"
                  title={`관심종목: ${item.w}`}
                />
                <div
                  style={{ height: `${(item.a / 142) * 100}%` }}
                  className="w-1.5 sm:w-2 bg-purple-500 rounded-t transition-all group-hover:brightness-110"
                  title={`배지 획득: ${item.a}`}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 truncate max-w-[60px]">
                {item.week}
              </span>
            </div>
          ))}
        </div>

        {/* 주차별 비교 표 */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">구분</th>
                <th className="py-2.5 px-3">08.2주</th>
                <th className="py-2.5 px-3">08.3주</th>
                <th className="py-2.5 px-3">08.4주</th>
                <th className="py-2.5 px-3">09.1주</th>
                <th className="py-2.5 px-3">09.2주</th>
                <th className="py-2.5 px-3 bg-blue-50/50 text-blue-900">09.3주 (현재)</th>
                <th className="py-2.5 px-3">전주 대비 증감</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> My 브리핑 유저
                </td>
                <td className="py-2.5 px-3">28,400</td>
                <td className="py-2.5 px-3">31,200</td>
                <td className="py-2.5 px-3">34,500</td>
                <td className="py-2.5 px-3">37,800</td>
                <td className="py-2.5 px-3">40,100</td>
                <td className="py-2.5 px-3 font-bold bg-blue-50/50 text-blue-900">42,850</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">+6.8%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 기사 열람 총건 (천건)
                </td>
                <td className="py-2.5 px-3">540K</td>
                <td className="py-2.5 px-3">582K</td>
                <td className="py-2.5 px-3">630K</td>
                <td className="py-2.5 px-3">690K</td>
                <td className="py-2.5 px-3">740K</td>
                <td className="py-2.5 px-3 font-bold bg-blue-50/50 text-blue-900">788K</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">+6.5%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 관심종목 등록 회원
                </td>
                <td className="py-2.5 px-3">21,100</td>
                <td className="py-2.5 px-3">23,400</td>
                <td className="py-2.5 px-3">25,800</td>
                <td className="py-2.5 px-3">28,100</td>
                <td className="py-2.5 px-3">29,900</td>
                <td className="py-2.5 px-3 font-bold bg-blue-50/50 text-blue-900">31,420</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">+5.1%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> 배지 총 지급수
                </td>
                <td className="py-2.5 px-3">72,500</td>
                <td className="py-2.5 px-3">86,300</td>
                <td className="py-2.5 px-3">101,200</td>
                <td className="py-2.5 px-3">116,400</td>
                <td className="py-2.5 px-3">131,200</td>
                <td className="py-2.5 px-3 font-bold bg-blue-50/50 text-blue-900">142,380</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">+8.5%</td>
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
    <div className="space-y-6">
      {/* KPI 카드 4종 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">1개 이상 등록 사용자 수</div>
          <div className="text-2xl font-bold text-slate-900">42,850명</div>
          <div className="text-[11px] text-slate-500 mt-2">전체 회원 침투율: <strong className="text-blue-600 font-semibold">38.4%</strong></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">등록된 총 브리핑 수</div>
          <div className="text-2xl font-bold text-slate-900">94,270개</div>
          <div className="text-[11px] text-slate-500 mt-2">일일 자동 발행 대상 브리핑</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">사용자 평균 등록 브리핑 수</div>
          <div className="text-2xl font-bold text-slate-900">2.2개</div>
          <div className="text-[11px] text-slate-500 mt-2">브리핑 등록 회원 기준</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">1인 최다 등록 브리핑 수</div>
          <div className="text-2xl font-bold text-slate-900">8개</div>
          <div className="text-[11px] text-slate-500 mt-2">헤비 에이전트 유저</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주제별 비중 (4대 주제) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">브리핑 주제별 선호 비중</h3>
              <p className="text-xs text-slate-500">4개 핵심 주제 설정 현황</p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5 mt-6">
            {[
              { name: "미국 증시", count: "39,593건", pct: 42, color: "bg-blue-600" },
              { name: "국내 증시", count: "29,223건", pct: 31, color: "bg-indigo-500" },
              { name: "부동산 시장", count: "15,083건", pct: 16, color: "bg-emerald-500" },
              { name: "주요 이슈", count: "10,371건", pct: 11, color: "bg-amber-500" },
            ].map((topic, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{topic.name}</span>
                  <span className="text-slate-500">{topic.count} ({topic.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{ width: `${topic.pct}%` }}
                    className={`${topic.color} h-full rounded-full transition-all`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
            💡 <strong>인사이트</strong>: 글로벌 금리 및 환율 변동성으로 인해 <strong>미국 증시 브리핑(42%)</strong>에 대한 구독 비중이 가장 높게 형성되어 있습니다.
          </div>
        </div>

        {/* 수신 시간대별 설정 비중 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">수신 시간대별 설정 비중</h3>
              <p className="text-xs text-slate-500">출근길 vs 오후 장 마감 리포트</p>
            </div>
            <Clock3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-blue-800">오전 08:00 (출근길)</span>
              <span className="text-3xl font-extrabold text-blue-900 my-2">68%</span>
              <span className="text-xs text-slate-500">64,103건 등록</span>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-amber-800">오후 17:00 (오후)</span>
              <span className="text-3xl font-extrabold text-amber-900 my-2">32%</span>
              <span className="text-xs text-slate-500">30,167건 등록</span>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-xs text-slate-500">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span>매일(월~일) 자동 발행 비율</span>
              <strong className="text-slate-800">89.4%</strong>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span>평일만 수신 비율</span>
              <strong className="text-slate-800">10.6%</strong>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>AI 브리핑 정상 생성 성공률</span>
              <strong className="text-emerald-600 font-semibold">99.8% (안정)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 8주간 브리핑 누적 생성 추이 표 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-1">My 브리핑 주간 성장 추이 히스토리</h3>
        <p className="text-xs text-slate-500 mb-4">주차별 신규 에이전트 생성 건수 및 누적 등록수</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">주차</th>
                <th className="py-2.5 px-3">등록 유저수</th>
                <th className="py-2.5 px-3">총 브리핑수</th>
                <th className="py-2.5 px-3">주간 신규 생성</th>
                <th className="py-2.5 px-3">미국증시(%)</th>
                <th className="py-2.5 px-3">국내증시(%)</th>
                <th className="py-2.5 px-3">전주 대비 증감</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { w: "09.3주 (현재)", u: "42,850", b: "94,270", n: "+8,210", us: "42%", kr: "31%", diff: "+9.5%" },
                { w: "09.2주", u: "40,100", b: "86,060", n: "+7,890", us: "41%", kr: "31%", diff: "+10.1%" },
                { w: "09.1주", u: "37,800", b: "78,170", n: "+7,220", us: "40%", kr: "32%", diff: "+10.2%" },
                { w: "08.4주", u: "34,500", b: "70,950", n: "+6,750", us: "39%", kr: "33%", diff: "+10.5%" },
                { w: "08.3주", u: "31,200", b: "64,200", n: "+6,100", us: "39%", kr: "33%", diff: "+10.5%" },
              ].map((row, idx) => (
                <tr key={idx} className={idx === 0 ? "bg-blue-50/40 font-medium" : ""}>
                  <td className="py-2.5 px-3 text-slate-900">{row.w}</td>
                  <td className="py-2.5 px-3">{row.u}</td>
                  <td className="py-2.5 px-3">{row.b}</td>
                  <td className="py-2.5 px-3 text-blue-600 font-semibold">{row.n}</td>
                  <td className="py-2.5 px-3">{row.us}</td>
                  <td className="py-2.5 px-3">{row.kr}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-semibold">{row.diff}</td>
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
    <div className="space-y-6">
      {/* 4대 대표값 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">1인당 평균 읽은 기사량</div>
          <div className="text-2xl font-bold text-slate-900">18.4건</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> 전주 대비 +1.2건 증가
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">중앙값 (Median)</div>
          <div className="text-2xl font-bold text-slate-900">11.0건</div>
          <div className="text-[11px] text-slate-500 mt-2">일반 독자 표준 열람 기준</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">최고 열람량 (최다 다독자)</div>
          <div className="text-2xl font-bold text-indigo-700">342건</div>
          <div className="text-[11px] text-slate-500 mt-2">헤비 리더 (증권/산업 위주)</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">최저 열람량</div>
          <div className="text-2xl font-bold text-slate-900">1.0건</div>
          <div className="text-[11px] text-slate-500 mt-2">단일 기사 유입 후 이탈</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 시간대별 기사 소비 집중도 (6대 시간대) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">시간대별 기사 소비 집중도 (24H)</h3>
              <p className="text-xs text-slate-500">6개 시간대별 독자 유입량 및 피크 타임</p>
            </div>
            <Clock3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
            {[
              { time: "06~10시", name: "아침/출근", count: "312,400건", pct: 39.6, peak: true },
              { time: "10~14시", name: "오전/점심", count: "168,200건", pct: 21.3, peak: false },
              { time: "18~22시", name: "저녁/퇴근", count: "142,500건", pct: 18.1, peak: false },
              { time: "14~18시", name: "오후", count: "98,300건", pct: 12.5, peak: false },
              { time: "22~02시", name: "심야/야간", count: "48,100건", pct: 6.1, peak: false },
              { time: "02~06시", name: "새벽", count: "18,500건", pct: 2.4, low: true },
            ].map((slot, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-center flex flex-col justify-between ${
                  slot.peak
                    ? "border-blue-300 bg-blue-50/60"
                    : slot.low
                    ? "border-slate-200 bg-slate-50/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold text-slate-700">{slot.time}</div>
                  <div className="text-[10px] text-slate-500">{slot.name}</div>
                  {slot.peak && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-blue-600 text-white rounded font-semibold">
                      최고 피크
                    </span>
                  )}
                  {slot.low && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-slate-400 text-white rounded font-medium">
                      최저점
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-base font-extrabold text-slate-900">{slot.pct}%</div>
                  <div className="text-[10px] text-slate-400">{slot.count}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 소비량 구간 분포도 (로그정규/롱테일) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3">회원 1인당 기사 소비량 구간 분포 (로그정규 롱테일)</h4>
            <div className="space-y-2">
              {[
                { range: "1~3건 (탐색형)", pct: 36, count: "28,200명", color: "bg-slate-400" },
                { range: "4~10건 (일반형)", pct: 31, count: "24,300명", color: "bg-blue-500" },
                { range: "11~20건 (관심층)", pct: 19, count: "14,900명", color: "bg-indigo-600" },
                { range: "21~50건 (충성독자)", pct: 10, count: "7,800명", color: "bg-purple-600" },
                { range: "51건 이상 (헤비 리더)", pct: 4, count: "3,100명", color: "bg-amber-600" },
              ].map((b, i) => (
                <div key={i} className="flex items-center text-xs gap-3">
                  <span className="w-32 shrink-0 text-slate-600 font-medium">{b.range}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      style={{ width: `${b.pct}%` }}
                      className={`${b.color} h-full rounded-full`}
                    />
                  </div>
                  <span className="w-24 text-right font-semibold text-slate-800">{b.pct}% ({b.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 카테고리 전수 소비 비중 테이블 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">전체 카테고리 소비</h3>
              <p className="text-xs text-slate-500">전체 섹션 누적 열람 건수 및 비중</p>
            </div>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">섹션명</th>
                  <th className="py-2 px-2.5 text-right">열람 건수</th>
                  <th className="py-2 px-2.5 text-right">점유율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { name: "증권", count: "342,100", pct: "43.4%", hot: true },
                  { name: "부동산", count: "165,400", pct: "21.0%", hot: true },
                  { name: "경제", count: "112,800", pct: "14.3%" },
                  { name: "산업", count: "68,200", pct: "8.7%" },
                  { name: "정치", count: "39,100", pct: "5.0%" },
                  { name: "국제", count: "28,400", pct: "3.6%" },
                  { name: "라이프/문화", count: "19,200", pct: "2.4%" },
                  { name: "스포츠/연예", count: "12,800", pct: "1.6%" },
                ].map((sec, idx) => (
                  <tr key={idx} className={sec.hot ? "font-semibold bg-blue-50/20" : ""}>
                    <td className="py-2 px-2.5 flex items-center gap-1.5">
                      <span className="text-slate-400 text-[10px]">{idx + 1}</span>
                      <span className={sec.hot ? "text-blue-900" : "text-slate-800"}>{sec.name}</span>
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-600">{sec.count}</td>
                    <td className="py-2 px-2.5 text-right font-medium text-slate-900">{sec.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 16개 AI 읽기 유형 카드 점유율 (전수 노출) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">16개 AI 읽기 유형 카드 점유율 (전수 순위)</h3>
            <p className="text-xs text-slate-500">독자의 활동 시간대 × 관심 분야 × 읽기 성향 조합 페르소나 분석</p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold border border-indigo-200">
            16종 카드 분류 체계
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[
            { rank: 1, name: "얼리버드 개척자", desc: "출근길 증시 속보 중심", pct: "16.8%", count: "13,180명", color: "border-l-blue-600" },
            { rank: 2, name: "마켓 네비게이터", desc: "시장 전반 균형 투자자", pct: "14.2%", count: "11,140명", color: "border-l-blue-500" },
            { rank: 3, name: "헤지펀드 분석가", desc: "심층 기업 보고서 독파", pct: "11.5%", count: "9,020명", color: "border-l-indigo-600" },
            { rank: 4, name: "부동산 나침반", desc: "청약/재건축 정책 집중", pct: "9.8%", count: "7,690명", color: "border-l-emerald-600" },
            { rank: 5, name: "올빼미 모니터링", desc: "심야 미국장 실시간 체크", pct: "8.4%", count: "6,590명", color: "border-l-purple-600" },
            { rank: 6, name: "글로벌 매크로", desc: "환율/금리/원자재 통찰", pct: "7.1%", count: "5,570명", color: "border-l-cyan-600" },
            { rank: 7, name: "테크 이노베이터", desc: "반도체/AI 신기술 탐독", pct: "6.5%", count: "5,100명", color: "border-l-sky-600" },
            { rank: 8, name: "배당 안정 추구", desc: "고배당 금융/지주사 중심", pct: "5.4%", count: "4,230명", color: "border-l-amber-600" },
            { rank: 9, name: "퇴근길 서머라이저", desc: "하루 경제 종합 요약형", pct: "4.8%", count: "3,760명", color: "border-l-slate-600" },
            { rank: 10, name: "점심 핑거스캐너", desc: "10분 컷 핵심 이슈 파악", pct: "4.2%", count: "3,290명", color: "border-l-slate-500" },
            { rank: 11, name: "성장주 모멘텀", desc: "2차전지/바이오 급등주", pct: "3.5%", count: "2,740명", color: "border-l-rose-500" },
            { rank: 12, name: "정책 규제 헌터", desc: "정부 법안/세제 개편 집중", pct: "2.8%", count: "2,190명", color: "border-l-teal-600" },
            { rank: 13, name: "컬처&라이프스타일", desc: "문화/예술/소비 트렌드", pct: "1.9%", count: "1,490명", color: "border-l-pink-500" },
            { rank: 14, name: "슈퍼 차티스트", desc: "기술적 분석 및 수급 동향", pct: "1.5%", count: "1,170명", color: "border-l-orange-500" },
            { rank: 15, name: "그린 에너지 탐험", desc: "ESG/신재생 산업 관심", pct: "1.0%", count: "780명", color: "border-l-green-500" },
            { rank: 16, name: "스타트업 드리머", desc: "벤처 투자/유니콘 발굴", pct: "0.6%", count: "470명", color: "border-l-violet-500" },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-lg border border-slate-200 border-l-4 ${card.color} bg-white shadow-2xs`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400">TOP {card.rank}</span>
                <span className="text-xs font-bold text-slate-900">{card.pct}</span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate">{card.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{card.desc}</div>
              <div className="text-[11px] text-slate-400 mt-2 text-right">{card.count}</div>
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
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">관심종목 이용 회원 수</div>
          <div className="text-2xl font-bold text-slate-900">31,420명</div>
          <div className="text-[11px] text-slate-500 mt-2">전체 회원 침투율: <strong className="text-amber-600 font-semibold">28.1%</strong></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">총 담긴 관심종목 수</div>
          <div className="text-2xl font-bold text-slate-900">218,650건</div>
          <div className="text-[11px] text-slate-500 mt-2">사용자 보유 종목 누적 합계</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">1인당 평균 보유 종목 수</div>
          <div className="text-2xl font-bold text-slate-900">7.0개</div>
          <div className="text-[11px] text-slate-500 mt-2">1인 최다 종목 수: <strong>148개</strong></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">그룹당 평균 적재 종목 수</div>
          <div className="text-2xl font-bold text-slate-900">5.3개</div>
          <div className="text-[11px] text-slate-500 mt-2">그룹 밀도 지표</div>
        </div>
      </div>

      {/* 1~10개 그룹 개수별 사용자 수 전수 분포 (요구사항 100% 반영) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">관심종목 그룹 개수별 사용자 수 분포 (1~10개 전수 노출)</h3>
            <p className="text-xs text-slate-500">사용자가 생성해 둔 그룹 개수(1~10개)에 따른 회원수와 비중</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded border border-slate-200">
            최대 허용 그룹수: 10개
          </span>
        </div>

        {/* 1~10 바 차트 시각화 */}
        <div className="h-48 flex items-end gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-200">
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
            { group: "10개(풀)", count: 110, pct: "0.3%", h: 1 },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] text-slate-500 group-hover:font-bold hidden sm:block">
                {item.pct}
              </span>
              <div
                style={{ height: `${item.h}%` }}
                className={`w-full max-w-[40px] rounded-t transition-all ${
                  idx === 0
                    ? "bg-amber-600"
                    : idx === 1
                    ? "bg-amber-500"
                    : "bg-amber-400 group-hover:bg-amber-500"
                }`}
              />
              <span className="text-xs font-semibold text-slate-700 mt-1">{item.group}</span>
            </div>
          ))}
        </div>

        {/* 1~10 전수 상세 표 */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">생성 그룹수</th>
                <th className="py-2.5 px-3 text-right">사용자 수 (명)</th>
                <th className="py-2.5 px-3 text-right">비중 (%)</th>
                <th className="py-2.5 px-3 text-right">해당 그룹 총 종목수</th>
                <th className="py-2.5 px-3 text-right">전주 대비 증감</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { g: "1개 그룹 (기본 사용자)", u: "14,200", p: "45.2%", s: "68,160", diff: "+4.2%" },
                { g: "2개 그룹", u: "8,100", p: "25.8%", s: "48,600", diff: "+6.1%" },
                { g: "3개 그룹", u: "4,200", p: "13.4%", s: "35,280", diff: "+8.4%" },
                { g: "4개 그룹", u: "2,100", p: "6.7%", s: "21,840", diff: "+5.0%" },
                { g: "5개 그룹", u: "1,250", p: "4.0%", s: "16,250", diff: "+3.9%" },
                { g: "6개 그룹", u: "680", p: "2.2%", s: "10,200", diff: "+2.1%" },
                { g: "7개 그룹", u: "390", p: "1.2%", s: "6,630", diff: "+1.5%" },
                { g: "8개 그룹", u: "240", p: "0.8%", s: "4,560", diff: "+0.8%" },
                { g: "9개 그룹", u: "150", p: "0.5%", s: "3,150", diff: "+0.2%" },
                { g: "10개 그룹 (최대 한도 생성)", u: "110", p: "0.3%", s: "3,980", diff: "+0.1%" },
              ].map((row, i) => (
                <tr key={i} className={i < 2 ? "bg-amber-50/20 font-medium" : ""}>
                  <td className="py-2 px-3 text-slate-900 font-semibold">{row.g}</td>
                  <td className="py-2 px-3 text-right">{row.u}</td>
                  <td className="py-2 px-3 text-right font-bold text-amber-900">{row.p}</td>
                  <td className="py-2 px-3 text-right text-slate-500">{row.s}</td>
                  <td className="py-2 px-3 text-right text-emerald-600 font-medium">{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 시장별 담기 비중 (국내 vs 해외) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">시장별 담기 비중</h3>
              <p className="text-xs text-slate-500">국내 주식 vs 해외(미국 등) 주식</p>
            </div>
            <Globe2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-center">
              <span className="text-xs font-semibold text-blue-800">국내 주식</span>
              <div className="text-2xl font-extrabold text-blue-900 my-1">64.5%</div>
              <span className="text-[11px] text-slate-500">141,029건</span>
            </div>
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 text-center">
              <span className="text-xs font-semibold text-indigo-800">해외 주식</span>
              <div className="text-2xl font-extrabold text-indigo-900 my-1">35.5%</div>
              <span className="text-[11px] text-slate-500">77,621건</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>국내 전용 그룹 보유자</span>
              <strong className="text-slate-800">54.2%</strong>
            </div>
            <div className="flex justify-between">
              <span>국내+해외 혼합 보유자</span>
              <strong className="text-slate-800">38.1%</strong>
            </div>
            <div className="flex justify-between">
              <span>해외 전용 그룹 보유자</span>
              <strong className="text-slate-800">7.7%</strong>
            </div>
          </div>
        </div>

        {/* 가장 많이 담긴 인기 종목 TOP 10 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">가장 많이 등록된 인기 종목 TOP 10</h3>
              <p className="text-xs text-slate-500">전체 사용자 관심종목 등록 수 기준 랭킹</p>
            </div>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">순위</th>
                  <th className="py-2.5 px-3">종목명</th>
                  <th className="py-2.5 px-3">종목코드</th>
                  <th className="py-2.5 px-3">시장</th>
                  <th className="py-2.5 px-3 text-right">담은 회원수</th>
                  <th className="py-2.5 px-3 text-right">순위 변동</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { r: 1, name: "삼성전자", code: "005930", m: "국내 (코스피)", u: "19,840명", diff: "-" },
                  { r: 2, name: "엔비디아 (NVDA)", code: "NVDA", m: "해외 (나스닥)", u: "16,420명", diff: "+1" },
                  { r: 3, name: "SK하이닉스", code: "000660", m: "국내 (코스피)", u: "15,890명", diff: "-1" },
                  { r: 4, name: "애플 (AAPL)", code: "AAPL", m: "해외 (나스닥)", u: "13,100명", diff: "-" },
                  { r: 5, name: "테슬라 (TSLA)", code: "TSLA", m: "해외 (나스닥)", u: "12,450명", diff: "+2" },
                  { r: 6, name: "현대차", code: "005380", m: "국내 (코스피)", u: "9,820명", diff: "-" },
                  { r: 7, name: "마이크로소프트 (MSFT)", code: "MSFT", m: "해외 (나스닥)", u: "9,120명", diff: "-1" },
                  { r: 8, name: "NAVER", code: "035420", m: "국내 (코스피)", u: "7,840명", diff: "-" },
                  { r: 9, name: "카카오", code: "035720", m: "국내 (코스피)", u: "7,110명", diff: "+3" },
                  { r: 10, name: "알파벳 A (GOOGL)", code: "GOOGL", m: "해외 (나스닥)", u: "6,980명", diff: "-1" },
                ].map((stock, i) => (
                  <tr key={i} className={stock.r <= 3 ? "bg-amber-50/25 font-medium" : ""}>
                    <td className="py-2 px-3 font-bold text-slate-900">{stock.r}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{stock.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">{stock.code}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${stock.m.includes("국내") ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {stock.m}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-900">{stock.u}</td>
                    <td className="py-2 px-3 text-right">
                      {stock.diff === "-" ? (
                        <span className="text-slate-400">-</span>
                      ) : stock.diff.startsWith("+") ? (
                        <span className="text-rose-600 font-bold">{stock.diff}</span>
                      ) : (
                        <span className="text-blue-600 font-bold">{stock.diff}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. 배지 상세 모니터링 (요청 통계값 & 라이브 10종 배지 100% 반영)
// -------------------------------------------------------------
function BadgesTab({
  selectedGroup,
  onSelectGroup,
}: {
  selectedGroup: string;
  onSelectGroup: (g: string) => void;
}) {
  // 실제 라이브 중인 10종 배지 데이터
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
    <div className="space-y-6">
      {/* 사용자 요청 최소 배지 통계값 4종 KPI 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 운영 중인 배지 수 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">운영 중인 배지 수</div>
          <div className="text-2xl font-bold text-slate-900">10개</div>
          <div className="text-[11px] text-slate-500 mt-2">
            웰컴 8종 + 프리미엄 2종 라이브
          </div>
        </div>

        {/* 2. 사용자들에게 지급된 총 배지 수 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">사용자들에게 지급된 총 배지 수</div>
          <div className="text-2xl font-bold text-purple-700">142,380개</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> 최근 1주간 +6,020개 지급
          </div>
        </div>

        {/* 3. 배지를 1개라도 획득한 사용자 수 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">배지 1개 이상 획득 사용자 수</div>
          <div className="text-2xl font-bold text-slate-900">58,190명</div>
          <div className="text-[11px] text-slate-500 mt-2">
            전체 회원 대비 달성률: <strong className="text-blue-600 font-semibold">52.1%</strong>
          </div>
        </div>

        {/* 4. 회원당 평균 배지 수 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-1">회원당 평균 배지 수</div>
          <div className="text-2xl font-bold text-slate-900">2.45개</div>
          <div className="text-[11px] text-slate-500 mt-2">
            (배지 보유자 기준 평균: <strong>2.82개</strong>)
          </div>
        </div>
      </div>

      {/* 5대 그룹별 현황 및 추이 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">5대 배지 그룹별 운영 현황 및 지급량</h3>
            <p className="text-xs text-slate-500">그룹별 라이브 배지 수량과 누적 획득 지표</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            총 5개 그룹
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              id: "웰컴 스타터",
              name: "웰컴 스타터",
              status: "라이브 (8개)",
              totalIssued: "133,440개",
              activeUsers: "57,800명",
              color: "border-blue-500 bg-blue-50/30",
            },
            {
              id: "프리미엄9 라운지",
              name: "프리미엄9 라운지",
              status: "라이브 (2개)",
              totalIssued: "8,940개",
              activeUsers: "6,210명",
              color: "border-purple-500 bg-purple-50/30",
            },
            {
              id: "한경 탐험가",
              name: "한경 탐험가",
              status: "오픈 준비중",
              totalIssued: "0개",
              activeUsers: "-",
              color: "border-slate-300 bg-slate-50/50 text-slate-400",
            },
            {
              id: "한경 헤리티지",
              name: "한경 헤리티지",
              status: "오픈 준비중",
              totalIssued: "0개",
              activeUsers: "-",
              color: "border-slate-300 bg-slate-50/50 text-slate-400",
            },
            {
              id: "히든 배지",
              name: "히든 배지",
              status: "오픈 준비중",
              totalIssued: "0개",
              activeUsers: "-",
              color: "border-slate-300 bg-slate-50/50 text-slate-400",
            },
          ].map((grp, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border-2 ${grp.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{grp.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{grp.status}</div>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/60">
                <div className="text-[11px] text-slate-500">총 지급량</div>
                <div className="text-base font-extrabold text-slate-900">{grp.totalIssued}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">획득자: {grp.activeUsers}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배지별 상세 테이블 (10개 운영 배지 전수 순위 & 추이) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">운영 중인 배지별 획득자 수 및 획득률 (전수)</h3>
            <p className="text-xs text-slate-500">획득자 수 기준 자동 내림차순 랭킹</p>
          </div>

          {/* 그룹 탭 필터 */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {[
              { id: "all", label: "전체 (10종)" },
              { id: "웰컴 스타터", label: "웰컴 스타터 (8)" },
              { id: "프리미엄9 라운지", label: "프리미엄9 라운지 (2)" },
              { id: "한경 탐험가", label: "한경 탐험가 (0)" },
              { id: "한경 헤리티지", label: "헤리티지 (0)" },
              { id: "히든 배지", label: "히든 배지 (0)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectGroup(tab.id)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedGroup === tab.id
                    ? "bg-white text-slate-900 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 배지 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">순위</th>
                <th className="py-2.5 px-3">배지명</th>
                <th className="py-2.5 px-3">소속 그룹</th>
                <th className="py-2.5 px-3 text-right">누적 획득자 수</th>
                <th className="py-2.5 px-3 text-right">전체 대비 획득률</th>
                <th className="py-2.5 px-3 text-right">주간 신규 획득 (증가 추이)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBadges.length > 0 ? (
                filteredBadges.map((badge, idx) => (
                  <tr key={idx} className={idx < 3 ? "bg-purple-50/20 font-medium" : ""}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      {badge.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          badge.group === "프리미엄9 라운지"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {badge.group}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {badge.earners.toLocaleString()}명
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-purple-700">
                      {badge.rate}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                      {badge.weekGain}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
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
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {item?.label} 모니터링 준비 중
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        {item?.label} 서비스는 현재 개발 및 데이터 파이프라인 구축 단계에 있습니다. 정식 오픈 후 지표 모니터링이 제공될 예정입니다.
      </p>
      <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
        <Clock3 className="w-3.5 h-3.5" /> 차기 릴리즈 오픈 예정
      </div>
    </div>
  );
}
