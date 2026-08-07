"use client";

import {
  Award,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Crown,
  Database,
  Eye,
  Gamepad2,
  Gift,
  Home,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  PartyPopper,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type BadgeGroupId = "premium" | "welcome" | "explorer" | "heritage" | "hidden";
type BadgeGroupFilter = "all" | BadgeGroupId;
type BadgeFilter = "all" | "earned" | "locked";
type BadgeTone = "premium" | "silver" | "navy" | "green" | "purple" | "gold";

type BadgeGroup = {
  id: BadgeGroupId;
  name: string;
  tagline: string;
  description: string;
};

type BadgeRecord = {
  code: string;
  group: BadgeGroupId;
  name: string;
  icon: LucideIcon;
  tone: BadgeTone;
  hint: string;
  image?: string;
  earnedAt?: string;
  current?: number;
  target?: number;
  unit?: string;
  isNew?: boolean;
  actionLabel?: string;
  actionHref?: string;
};

const NAV_ITEMS: { label: string; icon: LucideIcon; href: string; active?: boolean }[] = [
  { label: "My 브리핑", icon: Home, href: "/" },
  { label: "배지", icon: Award, href: "/badges", active: true },
  { label: "관심 기자", icon: UserRound, href: "/" },
  { label: "뉴스 스크랩", icon: Bookmark, href: "/" },
  { label: "최근 본 기사", icon: Clock3, href: "/recent-articles" },
  { label: "관심종목", icon: Star, href: "/watchlist" },
  { label: "포트폴리오", icon: BarChart3, href: "/" },
  { label: "결제내역", icon: WalletCards, href: "/" },
  { label: "내 계정", icon: Settings, href: "/" },
  { label: "로그아웃", icon: LogOut, href: "/" },
];

const BADGE_GROUPS: BadgeGroup[] = [
  {
    id: "premium",
    name: "프리미엄9 라운지",
    tagline: "깊이 있는 시선이 머무는 곳, 프리미엄 이상의 가치를 만나보세요.",
    description: "한경 프리미엄 구독자만을 위한 특별한 배지 컬렉션입니다. 프리미엄 기사와 AI 투자 서비스 등 구독자 전용 기능을 이용하며 쌓은 기록을 확인해 보세요. 한경과 함께 넓혀온 안목과 경험이 프레스티지의 가치를 완성합니다.",
  },
  {
    id: "welcome",
    name: "월컴 스타터",
    tagline: "한경과 함께 지식의 지평을 넓히는 첫 번째 문입니다.",
    description: "한경닷컴에 오신 것을 환영합니다. 회원가입부터 프로필 설정, 첫 스크랩과 공유, 앱 로그인과 게임 참여까지 한경의 다양한 기능을 하나씩 경험해 보세요. 새로운 시작의 순간마다 특별한 배지가 기다리고 있습니다.",
  },
  {
    id: "explorer",
    name: "한경 탐험가",
    tagline: "한경 곳곳을 탐험하며 쌓아온 당신의 기록입니다.",
    description: "매일 뉴스를 읽고 의견을 나누며, 유익한 기사를 공유하고 게임에 도전하는 모든 활동이 이곳에 기록됩니다. 다양한 서비스를 경험하고 꾸준히 활동하며 한경과 함께한 시간을 배지로 남겨보세요.",
  },
  {
    id: "heritage",
    name: "한경 헤리티지",
    tagline: "한경과 함께 쌓아온 깊이 있는 경험과 기록이 하나의 유산이 됩니다.",
    description: "심층 기사를 읽고, 관심 있는 기자를 구독하며, AI와 데이터 서비스를 활용해 자신만의 관점을 넓혀보세요. 오랜 시간 축적한 지식과 통찰, 그리고 깊이 있는 이용의 흔적이 당신만의 헤리티지를 완성합니다.",
  },
  {
    id: "hidden",
    name: "히든 배지",
    tagline: "누군가는 우연히, 누군가는 끈질긴 탐색 끝에 발견하게 될 특별한 컬렉션입니다.",
    description: "평범한 이용 중 우연히 마주칠 수도, 오랜 탐색 끝에 발견할 수도 있습니다. 한경 곳곳에 숨겨진 조건을 찾아 특별한 배지를 획득하고, 아직 공개되지 않은 컬렉션의 빈자리를 채워보세요.",
  },
];

const BADGES: BadgeRecord[] = [
  { code: "hankyung-prestige", group: "premium", name: "한경 프레스티지", icon: Crown, tone: "premium", image: "/badges/hankyung-prestige.png", earnedAt: "2026.08.01", hint: "한경 프리미엄9 구독자가 되어 특별한 컬렉션을 시작해 보세요." },
  { code: "ai-invest-master", group: "premium", name: "AI 투자 고수", icon: BarChart3, tone: "silver", earnedAt: "2026.08.05", isNew: true, hint: "epic AI에게 10번 질문하고 이번 달 이용권을 모두 사용해 보세요." },
  { code: "premium-reader", group: "premium", name: "프리미엄 탐독가", icon: BookOpen, tone: "premium", current: 63, target: 100, unit: "개", hint: "한경 프리미엄9 기사를 100개 이상 읽어보세요.", actionLabel: "프리미엄 기사 보기", actionHref: "/recent-articles" },
  { code: "paid-months", group: "premium", name: "유료구독 4개월", icon: CalendarDays, tone: "gold", earnedAt: "2026.08.01", hint: "프리미엄 구독을 유지하며 함께한 시간을 쌓아보세요." },
  { code: "prestige-ambassador-2026", group: "premium", name: "2026 프레스티지 앰배서더", icon: Award, tone: "gold", earnedAt: "2026.02.03", hint: "2026년에 프리미엄9 구독을 시작하면 받을 수 있습니다." },
  { code: "knowledge-navigator", group: "premium", name: "지식의 항해사", icon: Lightbulb, tone: "navy", current: 31, target: 50, unit: "회", hint: "AI가 추천한 관련 기사를 50회 확인해 보세요.", actionLabel: "추천 기사 보기", actionHref: "/recent-articles" },
  { code: "careful-reader", group: "premium", name: "꼼꼼한 탐독가", icon: Eye, tone: "navy", current: 18, target: 50, unit: "회", hint: "단어를 드래그해 AI 용어 설명을 50회 사용해 보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },

  { code: "alice-invite", group: "welcome", name: "ALICE Q의 초대", icon: Gamepad2, tone: "green", image: "/badges/alice-invite.png", earnedAt: "2026.06.21", hint: "ALICE Q 게임을 한 번 완료해 보세요." },
  { code: "this-is-me", group: "welcome", name: "이게 바로 나", icon: UserRound, tone: "green", image: "/badges/this-is-me.png", earnedAt: "2026.06.21", hint: "ALICE Q 닉네임이나 프로필 사진을 등록해 보세요." },
  { code: "feedback-place", group: "welcome", name: "공감 맛집", icon: Bell, tone: "green", image: "/badges/feedback-place.png", earnedAt: "2026.07.02", hint: "기사에 좋아요 또는 싫어요 피드백을 3번 남겨보세요." },
  { code: "my-newsroom", group: "welcome", name: "마이 뉴스룸", icon: Newspaper, tone: "green", image: "/badges/my-newsroom.png", earnedAt: "2026.07.18", hint: "응원하는 기자 3명을 구독해 나만의 뉴스룸을 완성해 보세요." },
  { code: "first-conversation", group: "welcome", name: "소통의 첫걸음", icon: MessageCircle, tone: "green", image: "/badges/first-conversation.png", earnedAt: "2026.07.10", hint: "기사를 읽고 댓글을 3번 남겨보세요." },
  { code: "hankyung-member", group: "welcome", name: "오늘부터 한경인", icon: Gift, tone: "navy", image: "/badges/hankyung-member.png", earnedAt: "2026.05.12", hint: "한경닷컴 회원이 되면 기본으로 받는 배지입니다." },
  { code: "hankyung-in-hand", group: "welcome", name: "내 손안의 한경", icon: WalletCards, tone: "green", current: 0, target: 1, unit: "회", hint: "한경 앱을 설치하고 처음 로그인해 보세요.", actionLabel: "앱 안내 보기", actionHref: "/" },
  { code: "thought-archive", group: "welcome", name: "생각의 보관함", icon: Bookmark, tone: "green", current: 0, target: 1, unit: "회", hint: "기억하고 싶은 기사를 처음으로 스크랩해 보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },
  { code: "share-good", group: "welcome", name: "좋은 건 함께", icon: Share2, tone: "green", image: "/badges/share-good.png", earnedAt: "2026.07.22", hint: "유익한 기사를 주변에 5번 공유해 보세요." },
  { code: "push-lover", group: "welcome", name: "한경 알림 ON", icon: Bell, tone: "green", earnedAt: "2026.07.28", hint: "한경 푸시 알림을 통해 앱에 3번 접속해 보세요." },

  { code: "perfect-week", group: "explorer", name: "퍼펙트 위크", icon: CalendarDays, tone: "purple", earnedAt: "2026.07.30", isNew: true, hint: "7일 연속으로 한경을 방문해 보세요." },
  { code: "regular-debater", group: "explorer", name: "단골 토론가", icon: MessageCircle, tone: "purple", current: 12, target: 50, unit: "개", hint: "댓글을 50개 작성해 생각을 나눠보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },
  { code: "knowledge-sharer", group: "explorer", name: "지식 전파자", icon: Share2, tone: "purple", current: 18, target: 100, unit: "회", hint: "기사 공유 100회를 달성해 보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },
  { code: "month-record", group: "explorer", name: "한 달의 기록", icon: CalendarDays, tone: "purple", current: 9, target: 30, unit: "일", hint: "30일 연속 방문 기록을 만들어 보세요." },
  { code: "newsroom-partner", group: "explorer", name: "편집국 파트너", icon: Users, tone: "purple", current: 8, target: 50, unit: "명", hint: "관심 기자 50명을 구독해 보세요.", actionLabel: "기자 찾아보기", actionHref: "/" },
  { code: "newsroom-adviser", group: "explorer", name: "편집국 조언자", icon: Check, tone: "purple", current: 19, target: 100, unit: "회", hint: "기사 피드백 100회를 달성해 보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },
  { code: "local-bingo-master", group: "explorer", name: "우리동네 빙고 고수", icon: Gamepad2, tone: "green", current: 1, target: 2, unit: "회", hint: "3×3 빙고에서 2줄 완성을 두 번 달성해 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },
  { code: "bingo-king", group: "explorer", name: "빙고왕", icon: Trophy, tone: "gold", current: 0, target: 2, unit: "회", hint: "5×5 빙고에서 50점 초과 기록을 두 번 만들어 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },
  { code: "cat-butler", group: "explorer", name: "마음을 읽는 냥집사", icon: Sparkles, tone: "green", current: 1, target: 3, unit: "회", hint: "몸으로 말해요 게임을 세 번 완료해 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },
  { code: "local-traveler", group: "explorer", name: "이쯤 되면 현지인", icon: Eye, tone: "green", current: 1, target: 3, unit: "회", hint: "한장여행 게임을 세 번 완료해 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },
  { code: "consonant-master", group: "explorer", name: "ㅊㅅㅇ ㅅ", icon: Lightbulb, tone: "green", current: 2, target: 3, unit: "회", hint: "초성 게임을 세 번 완료해 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },
  { code: "alphabet-linker", group: "explorer", name: "알파벳 연결술사", icon: Gamepad2, tone: "green", current: 1, target: 3, unit: "회", hint: "영문 크로스워드를 세 번 완료해 보세요.", actionLabel: "ALICE Q 가기", actionHref: "/" },

  { code: "hundred-days", group: "heritage", name: "백일의 동행", icon: CalendarDays, tone: "gold", current: 42, target: 100, unit: "일", hint: "한경과 100일 연속 방문 기록을 만들어 보세요." },
  { code: "endless-voyager", group: "heritage", name: "끝없는 항해자", icon: BookOpen, tone: "navy", earnedAt: "2026.05.27", hint: "한 번의 방문에서 기사 20개를 탐독해 보세요." },
  { code: "deep-focus", group: "heritage", name: "무아지경", icon: Eye, tone: "navy", current: 11, target: 15, unit: "회", hint: "최근 30일 동안 깊이 있는 읽기 세션을 15회 만들어 보세요.", actionLabel: "기사 보러 가기", actionHref: "/recent-articles" },
  { code: "trend-setter", group: "heritage", name: "트렌드 세터", icon: Newspaper, tone: "navy", current: 68, target: 100, unit: "회", hint: "메인 톱편집 기사를 100회 확인해 보세요.", actionLabel: "한경 홈 가기", actionHref: "/" },
  { code: "all-rounder", group: "heritage", name: "한경 올라운더", icon: Award, tone: "gold", current: 7, target: 10, unit: "개", hint: "최근 30일 동안 한경의 서비스 그룹 10개를 경험해 보세요." },
  { code: "three-meals", group: "heritage", name: "한경세끼", icon: Clock3, tone: "gold", current: 12, target: 30, unit: "일", hint: "하루 세 번 방문하는 습관을 30일 동안 이어가 보세요." },
  { code: "hankyung-analyst", group: "heritage", name: "한경 애널리스트", icon: Database, tone: "silver", current: 46, target: 100, unit: "회", hint: "데이터 상세 페이지를 100회 이상 살펴보세요.", actionLabel: "관심종목 보기", actionHref: "/watchlist" },
  { code: "hankyung-companion", group: "heritage", name: "한경의 동반자", icon: Star, tone: "gold", current: 0, target: 1, unit: "년", hint: "가입 후 1년 동안 한경과 꾸준히 함께해 보세요." },

  { code: "birthday-guest", group: "hidden", name: "생일파티 손님", icon: PartyPopper, tone: "gold", earnedAt: "2025.10.12", hint: "한경의 특별한 날에 함께한 기록입니다." },
  { code: "scroll-to-end", group: "hidden", name: "끝을 보는 성격", icon: Eye, tone: "navy", hint: "숨겨진 조건입니다." },
  { code: "rights-guardian", group: "hidden", name: "권리의 수호자", icon: LockKeyhole, tone: "purple", hint: "숨겨진 조건입니다." },
];

function BadgeEmblem({ badge, large = false }: { badge: BadgeRecord; large?: boolean }) {
  const Icon = badge.icon;
  const locked = !badge.earnedAt;
  if (badge.image) {
    const size = large ? 140 : 90;
    return (
      <span className={`badge-emblem badge-emblem-image ${large ? "badge-emblem-large" : ""}`} aria-hidden="true">
        <Image src={badge.image} alt="" width={size} height={size} unoptimized />
      </span>
    );
  }
  return (
    <span className={`badge-emblem badge-emblem-${badge.tone} ${locked ? `badge-emblem-locked badge-emblem-locked-shape badge-emblem-shape-${badge.group}` : ""} ${large ? "badge-emblem-large" : ""}`} aria-hidden="true">
      <Icon size={large ? 49 : 31} strokeWidth={1.65} />
      {locked ? <LockKeyhole className="badge-emblem-lock" size={large ? 21 : 16} /> : null}
    </span>
  );
}

function progressText(badge: BadgeRecord) {
  if (badge.current == null || badge.target == null) return null;
  return `${badge.current}/${badge.target}${badge.unit ?? ""}`;
}

export default function BadgesClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [groupFilter, setGroupFilter] = useState<BadgeGroupFilter>("all");
  const [filter, setFilter] = useState<BadgeFilter>("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [seenCodes, setSeenCodes] = useState<string[]>([]);
  const selectedBadge = BADGES.find((badge) => badge.code === selectedCode) ?? null;
  const earnedBadges = BADGES.filter((badge) => badge.earnedAt);
  const scopedBadges = BADGES.filter((badge) => groupFilter === "all" || badge.group === groupFilter);
  const earnedScopedCount = scopedBadges.filter((badge) => badge.earnedAt).length;
  const statusFilterOptions: { id: BadgeFilter; label: string; count: number }[] = [
    { id: "all", label: "전체", count: scopedBadges.length },
    { id: "earned", label: "획득", count: earnedScopedCount },
    { id: "locked", label: "미획득", count: scopedBadges.length - earnedScopedCount },
  ];
  const groupFilterOptions: { id: BadgeGroupFilter; label: string; count: number }[] = [
    { id: "all", label: "전체", count: BADGES.length },
    ...BADGE_GROUPS.map((group) => ({ id: group.id, label: group.name, count: BADGES.filter((badge) => badge.group === group.id).length })),
  ];

  useEffect(() => {
    const requestedCode = new URLSearchParams(window.location.search).get("badge");
    const requestedBadge = BADGES.find((badge) => badge.code === requestedCode);
    if (!requestedBadge || (requestedBadge.group === "hidden" && !requestedBadge.earnedAt)) return;
    window.requestAnimationFrame(() => {
      setSelectedCode(requestedBadge.code);
      setSeenCodes((current) => current.includes(requestedBadge.code) ? current : [...current, requestedBadge.code]);
    });
  }, []);

  useEffect(() => {
    if (!selectedBadge) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelectedCode(null);
      window.history.replaceState(null, "", "/badges");
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedBadge]);

  const openBadge = (badge: BadgeRecord) => {
    if (badge.group === "hidden" && !badge.earnedAt) return;
    setSelectedCode(badge.code);
    setSeenCodes((current) => current.includes(badge.code) ? current : [...current, badge.code]);
    window.history.replaceState(null, "", `/badges?badge=${encodeURIComponent(badge.code)}`);
  };

  const closeBadge = () => {
    setSelectedCode(null);
    window.history.replaceState(null, "", "/badges");
  };

  return (
    <div className="site-frame badge-service-frame">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand-small badge-brand-link" href="/" aria-label="한경 홈">한경</Link>
          <Link className="brand-main badge-brand-link" href="/" aria-label="마이한경 홈"><span>My</span>한경</Link>
          <button className="mobile-menu" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="마이한경 메뉴 열기" aria-expanded={mobileNavOpen}>
            <Menu size={23} />
          </button>
        </div>
      </header>

      <div className="site-body">
        <aside className={`side-nav badge-side-nav ${mobileNavOpen ? "side-nav-open" : ""}`} aria-label="마이한경 메뉴">
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

        <main className="main-content badge-main">
          <section className="watchlist-titlebar badge-page-titlebar">
            <div>
              <h1>배지</h1>
              <p>한경에서 쌓아온 활동과 앞으로 획득할 배지를 확인해보세요.</p>
            </div>
            <span>2026.08.06 기준</span>
          </section>

          <section className="badge-module badge-summary-module badge-summary-compact" aria-labelledby="badge-summary-title">
            <div className="badge-summary-lead">
              <span>획득한 배지</span>
              <strong id="badge-summary-title">{earnedBadges.length}<em>개</em></strong>
              <p>읽고, 참여하고, 탐험하며 쌓아온 나의 한경 기록입니다.</p>
            </div>
          </section>

          <section className="badge-toolbar" aria-label="배지 목록 도구">
            <div className="badge-group-nav" role="group" aria-label="배지 그룹 필터">
              {groupFilterOptions.map((option) => (
                <button type="button" key={option.id} className={groupFilter === option.id ? "badge-filter-active" : ""} aria-pressed={groupFilter === option.id} onClick={() => setGroupFilter(option.id)}>
                  {option.label}<em>{option.count}</em>
                </button>
              ))}
            </div>
            <div className="badge-status-filter" role="group" aria-label="배지 획득 상태 필터">
              {statusFilterOptions.map((option) => (
                <button type="button" key={option.id} className={filter === option.id ? "badge-filter-active" : ""} aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
                  {option.label}<em>{option.count}</em>
                </button>
              ))}
            </div>
          </section>

          <div className="badge-groups">
            {BADGE_GROUPS.filter((group) => groupFilter === "all" || group.id === groupFilter).map((group) => {
              const groupBadges = BADGES.filter((badge) => badge.group === group.id)
                .filter((badge) => filter === "all" || (filter === "earned" ? badge.earnedAt : !badge.earnedAt));
              const earnedCount = BADGES.filter((badge) => badge.group === group.id && badge.earnedAt).length;
              const totalCount = BADGES.filter((badge) => badge.group === group.id).length;
              return (
                <section className="badge-module badge-group-section" id={`badge-group-${group.id}`} key={group.id} aria-labelledby={`badge-group-title-${group.id}`}>
                  <div className="badge-group-heading">
                    <div>
                      <div className="badge-group-title-row"><h2 id={`badge-group-title-${group.id}`}>{group.name}</h2><span>{group.id === "hidden" ? `${earnedCount}개 발견` : `${earnedCount}/${totalCount}`}</span></div>
                      <strong>{group.tagline}</strong>
                      <p>{group.description}</p>
                    </div>
                  </div>
                  {groupBadges.length ? (
                    <div className="badge-card-grid">
                      {groupBadges.map((badge) => {
                        const earned = Boolean(badge.earnedAt);
                        const mystery = group.id === "hidden" && !earned;
                        const progress = progressText(badge);
                        const showNew = badge.isNew && !seenCodes.includes(badge.code);
                        return (
                          <button className={`badge-card ${earned ? "badge-card-earned" : "badge-card-locked"} ${mystery ? "badge-card-mystery" : ""}`} type="button" key={badge.code} disabled={mystery} onClick={() => openBadge(badge)}>
                            {showNew ? <span className="badge-new-chip">NEW</span> : null}
                            {mystery ? <span className="badge-emblem badge-emblem-mystery" aria-hidden="true"><b>?</b></span> : <BadgeEmblem badge={badge} />}
                            <strong>{mystery ? "히든 배지" : badge.name}</strong>
                            {earned ? <><span className="badge-state badge-state-earned"><Check size={12} /> 획득</span><time>{badge.earnedAt}</time></> : <><span className="badge-state"><LockKeyhole size={12} /> 미획득</span>{!mystery && progress ? <div className="badge-card-progress"><span><i style={{ width: `${Math.min(100, ((badge.current ?? 0) / (badge.target ?? 1)) * 100)}%` }} /></span><small>{progress}</small></div> : null}</>}
                          </button>
                        );
                      })}
                    </div>
                  ) : <p className="badge-filter-empty">선택한 상태의 배지가 없습니다.</p>}
                </section>
              );
            })}
          </div>
        </main>
      </div>

      <footer className="site-footer">© 한경닷컴 Corp. · 배지 서비스 프로토타입</footer>

      {selectedBadge ? (
        <div className="badge-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) closeBadge(); }}>
          <section className="badge-detail-panel" role="dialog" aria-modal="true" aria-labelledby="badge-detail-title">
            <button className="badge-detail-close" type="button" onClick={closeBadge} aria-label="배지 상세 닫기"><X size={21} /></button>
            <div className="badge-detail-visual"><BadgeEmblem badge={selectedBadge} large /></div>
            <div className="badge-detail-copy">
              <span className={`badge-detail-state ${selectedBadge.earnedAt ? "badge-detail-state-earned" : ""}`}>{selectedBadge.earnedAt ? "획득 완료" : "도전 중"}</span>
              <h2 id="badge-detail-title">{selectedBadge.name}</h2>
              {selectedBadge.earnedAt ? (
                <>
                  <time>{selectedBadge.earnedAt} 획득</time>
                  <p>{selectedBadge.hint} 한경과 함께 쌓아온 활동이 또 하나의 소중한 기록으로 남았습니다.</p>
                </>
              ) : (
                <>
                  <p>{selectedBadge.hint}</p>
                  {selectedBadge.current != null && selectedBadge.target != null ? (
                    <div className="badge-detail-progress">
                      <div><span>현재 진행률</span><strong>{progressText(selectedBadge)}</strong></div>
                      <span><i style={{ width: `${Math.min(100, (selectedBadge.current / selectedBadge.target) * 100)}%` }} /></span>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
