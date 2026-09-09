"use client";

import {
  ArrowDown,
  ArrowUp,
  Award,
  Banknote,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  GripVertical,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards,
  X,
  ExternalLink,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import React, { Fragment, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type StockIssue = {
  id: string;
  sentiment: "호재" | "악재";
  comment: string;
  articleUrl: string;
  publishedAt: string;
};

type Stock = {
  id: string;
  name: string;
  code: string;
  market: string;
  price: string;
  change: string;
  rate: number;
  turnover: string;
  volume: string;
  high: string;
  low: string;
  marketType?: "DOMESTIC" | "OVERSEAS";
  currency?: "KRW" | "USD";
  ticker?: string;
  issues?: StockIssue[];
};

type WatchGroup = {
  id: string;
  name: string;
  stockIds: string[];
};

type Article = {
  id: string;
  url?: string;
  stockIds: string[];
  title: string;
  date: string;
  section: string;
  tone: string;
  stockAnalyses: ArticleStockAnalysis[];
};

type ArticleStockAnalysis = {
  stockId: string;
  sentiment: "긍정" | "중립" | "부정";
  comment: string;
};

const SENTIMENT_EMOJI: Record<ArticleStockAnalysis["sentiment"], string> = {
  긍정: "🙂",
  중립: "😐",
  부정: "😞",
};

type Report = {
  id: string;
  stockId: string;
  firm: string;
  title: string;
  date: string;
  opinion: string;
  target: string;
};

type AlertSettings = {
  article: boolean;
  report: boolean;
  movement: boolean;
  timeline: boolean;
  threshold: "3" | "5" | "10";
};

type CollapsibleModule = "timeline" | "stocks" | "articles" | "reports";
type CollapsedModules = Record<CollapsibleModule, boolean>;

type PreviewItem =
  | { type: "article"; item: Article }
  | { type: "report"; item: Report }
  | null;

const TIMELINE_DATE_LABELS: Record<string, string> = {
  "08.03": "8/3(월)",
  "07.31": "7/31(금)",
  "07.30": "7/30(목)",
};

const STOCKS: Stock[] = [
  {
    id: "005930",
    name: "삼성전자",
    code: "005930",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "87,400",
    change: "1,400",
    rate: 1.62,
    turnover: "1,527,884",
    volume: "17,480,321",
    high: "88,100",
    low: "85,700",
    issues: [
      {
        id: "issue-005930-1",
        sentiment: "호재",
        comment: "차세대 파운드리 2나노 공정 수율 개선으로 글로벌 빅테크 수주 가능성 확대",
        articleUrl: "https://www.hankyung.com/article/2026080349201",
        publishedAt: "2026.08.03 09:18",
      },
      {
        id: "issue-005930-2",
        sentiment: "호재",
        comment: "미국 테일러 공장 보조금 지급 확정 및 세액공제 수혜로 투자비 부담 완화",
        articleUrl: "https://www.hankyung.com/article/2026080162201",
        publishedAt: "2026.08.01 16:22",
      },
      {
        id: "issue-005930-3",
        sentiment: "악재",
        comment: "레거시 메모리 가격 상승 탄력 둔화 전망에 따른 하반기 마진 우려 제기",
        articleUrl: "https://www.hankyung.com/article/2026080214101",
        publishedAt: "2026.08.02 14:10",
      },
    ],
  },
  {
    id: "005935",
    name: "삼성전자우",
    code: "005935",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "67,800",
    change: "700",
    rate: 1.04,
    turnover: "224,518",
    volume: "3,324,180",
    high: "68,200",
    low: "66,700",
    issues: [
      {
        id: "issue-005935-1",
        sentiment: "호재",
        comment: "본주 대비 할인율 축소 기대와 안정적 고배당 수익률 부각",
        articleUrl: "https://www.hankyung.com/article/2026080511201",
        publishedAt: "2026.08.05 11:20",
      },
    ],
  },
  {
    id: "009150",
    name: "삼성전기",
    code: "009150",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "164,800",
    change: "2,100",
    rate: 1.29,
    turnover: "118,420",
    volume: "721,305",
    high: "166,100",
    low: "162,000",
  },
  {
    id: "006400",
    name: "삼성SDI",
    code: "006400",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "198,700",
    change: "4,300",
    rate: -2.12,
    turnover: "192,684",
    volume: "968,840",
    high: "203,500",
    low: "197,900",
    issues: [
      {
        id: "issue-006400-1",
        sentiment: "악재",
        comment: "유럽 전기차 수요 정체와 설비 가동률 저하로 3분기 실적 눈높이 하향",
        articleUrl: "https://www.hankyung.com/article/2026080345001",
        publishedAt: "2026.08.03 08:30",
      },
    ],
  },
  {
    id: "032830",
    name: "삼성생명",
    code: "032830",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "137,600",
    change: "2,900",
    rate: 2.15,
    turnover: "83,412",
    volume: "608,221",
    high: "138,900",
    low: "134,200",
    issues: [
      {
        id: "issue-032830-1",
        sentiment: "호재",
        comment: "자본비율 개선에 따른 주주환원 배당 여력 확대 정책 공식화",
        articleUrl: "https://www.hankyung.com/article/2026080216501",
        publishedAt: "2026.08.02 16:50",
      },
    ],
  },
  {
    id: "028260",
    name: "삼성물산",
    code: "028260",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "188,400",
    change: "1,500",
    rate: 0.80,
    turnover: "126,751",
    volume: "674,380",
    high: "190,100",
    low: "186,500",
  },
  {
    id: "010140",
    name: "삼성중공업",
    code: "010140",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "17,230",
    change: "420",
    rate: 2.50,
    turnover: "316,804",
    volume: "18,442,670",
    high: "17,410",
    low: "16,780",
    issues: [
      {
        id: "issue-010140-1",
        sentiment: "호재",
        comment: "친환경 LNG 운반선 4척 1조 2천억 규모 신규 건조 수주 계약 체결",
        articleUrl: "https://www.hankyung.com/article/2026080374001",
        publishedAt: "2026.08.03 07:40",
      },
    ],
  },
  {
    id: "207940",
    name: "삼성바이오로직스",
    code: "207940",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "1,042,000",
    change: "18,000",
    rate: 1.76,
    turnover: "152,337",
    volume: "147,092",
    high: "1,051,000",
    low: "1,018,000",
    issues: [
      {
        id: "issue-207940-1",
        sentiment: "호재",
        comment: "글로벌 제약사와 1조 5,000억원 규모 초대형 위탁생산(CDMO) 추가 계약 체결",
        articleUrl: "https://www.hankyung.com/article/2026080381001",
        publishedAt: "2026.08.03 08:10",
      },
    ],
  },
  {
    id: "000660",
    name: "SK하이닉스",
    code: "000660",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "291,000",
    change: "21,100",
    rate: 7.82,
    turnover: "2,842,110",
    volume: "9,978,244",
    high: "294,500",
    low: "271,000",
    issues: [
      {
        id: "issue-000660-1",
        sentiment: "호재",
        comment: "차세대 HBM4 16단 샘플 공급 조기 성공으로 글로벌 독점적 지위 견고화",
        articleUrl: "https://www.hankyung.com/article/2026080310421",
        publishedAt: "2026.08.03 10:42",
      },
      {
        id: "issue-000660-2",
        sentiment: "악재",
        comment: "단기 급등에 따른 차익실현 매물 및 반도체 피크아웃 경계론 일부 제기",
        articleUrl: "https://www.hankyung.com/article/2026080214102",
        publishedAt: "2026.08.02 14:10",
      },
    ],
  },
  {
    id: "042700",
    name: "한미반도체",
    code: "042700",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "126,400",
    change: "3,900",
    rate: 3.18,
    turnover: "428,730",
    volume: "3,405,921",
    high: "128,900",
    low: "121,600",
    issues: [
      {
        id: "issue-042700-1",
        sentiment: "호재",
        comment: "2.5D 패키징용 듀얼 TC 본더 신규 수주 사이클 진입으로 하반기 실적 호조 전망",
        articleUrl: "https://www.hankyung.com/article/2026080217351",
        publishedAt: "2026.08.02 17:35",
      },
    ],
  },
  {
    id: "005380",
    name: "현대차",
    code: "005380",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "286,500",
    change: "3,600",
    rate: -1.24,
    turnover: "512,640",
    volume: "1,801,337",
    high: "291,000",
    low: "284,000",
  },
  {
    id: "373220",
    name: "LG에너지솔루션",
    code: "373220",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "405,500",
    change: "9,000",
    rate: -2.18,
    turnover: "366,814",
    volume: "913,420",
    high: "414,000",
    low: "403,500",
    issues: [
      {
        id: "issue-373220-1",
        sentiment: "악재",
        comment: "글로벌 완성차의 배터리 재고 조정 장기화로 분기 매출 가이던스 보수적 조정",
        articleUrl: "https://www.hankyung.com/article/2026080382001",
        publishedAt: "2026.08.03 08:20",
      },
    ],
  },
  {
    id: "086520",
    name: "에코프로",
    code: "086520",
    market: "KOSDAQ",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "71,400",
    change: "3,460",
    rate: -4.62,
    turnover: "287,410",
    volume: "4,012,558",
    high: "74,900",
    low: "70,800",
    issues: [
      {
        id: "issue-086520-1",
        sentiment: "악재",
        comment: "리튬 및 원자재 판가 하락으로 인한 양극재 재고자산 평가손실 확대",
        articleUrl: "https://www.hankyung.com/article/2026080382002",
        publishedAt: "2026.08.03 08:20",
      },
    ],
  },
  {
    id: "105560",
    name: "KB금융",
    code: "105560",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "103,800",
    change: "2,300",
    rate: 2.27,
    turnover: "354,282",
    volume: "3,455,110",
    high: "104,900",
    low: "101,600",
    issues: [
      {
        id: "issue-105560-1",
        sentiment: "호재",
        comment: "분기 배당 확대와 연간 자사주 매입 소각 1조원 돌파 발표로 밸류업 선도",
        articleUrl: "https://www.hankyung.com/article/2026080211041",
        publishedAt: "2026.08.02 11:04",
      },
    ],
  },
  {
    id: "055550",
    name: "신한지주",
    code: "055550",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "65,100",
    change: "680",
    rate: 1.05,
    turnover: "177,902",
    volume: "2,748,903",
    high: "65,800",
    low: "64,200",
    issues: [
      {
        id: "issue-055550-1",
        sentiment: "호재",
        comment: "CET1 비율 13% 안착으로 하반기 특별 주주환원 기대감 지속",
        articleUrl: "https://www.hankyung.com/article/2026080211042",
        publishedAt: "2026.08.02 11:04",
      },
    ],
  },
  {
    id: "TSLA",
    name: "테슬라",
    code: "TSLA",
    ticker: "TSLA",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$337.35",
    change: "$13.51",
    rate: -3.85,
    turnover: "4,928,314",
    volume: "112,484,930",
    high: "$349.20",
    low: "$332.10",
    issues: [
      {
        id: "issue-tsla-1",
        sentiment: "악재",
        comment: "전기차 할인 경쟁 심화로 2분기 자동차 부문 마진율 추가 압박",
        articleUrl: "https://www.hankyung.com/article/2026080373201",
        publishedAt: "2026.08.03 07:32",
      },
    ],
  },
  {
    id: "NVDA",
    name: "엔비디아",
    code: "NVDA",
    ticker: "NVDA",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$182.71",
    change: "$4.36",
    rate: 2.45,
    turnover: "9,815,220",
    volume: "192,338,440",
    high: "$184.90",
    low: "$178.44",
    issues: [
      {
        id: "issue-nvda-1",
        sentiment: "호재",
        comment: "빅테크 AI 인프라 자본지출 상향으로 블랙웰 GPU 수요 공급초과 지속",
        articleUrl: "https://www.hankyung.com/article/2026080705781",
        publishedAt: "2026.08.07 13:42",
      },
    ],
  },
  {
    id: "CRM",
    name: "세일즈포스",
    code: "CRM",
    ticker: "CRM",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$248.50",
    change: "$3.20",
    rate: 1.30,
    turnover: "1,248,600",
    volume: "18,920,400",
    high: "$251.20",
    low: "$246.30",
    issues: [
      {
        id: "issue-crm-1",
        sentiment: "호재",
        comment: "생성형 AI '에이전트포스(Agentforce)' 도입 기업 급증으로 구독형 ARR 가파른 증가세",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/crm",
        publishedAt: "2026.08.04 15:30",
      },
    ],
  },
  {
    id: "035420",
    name: "NAVER",
    code: "035420",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "254,000",
    change: "2,500",
    rate: 0.99,
    turnover: "212,880",
    volume: "842,156",
    high: "257,500",
    low: "251,000",
  },
];

const INITIAL_GROUPS: WatchGroup[] = [
  {
    id: "group-main",
    name: "재용이형만믿고갑니다",
    stockIds: ["005930", "005935", "009150", "006400", "032830", "028260", "010140", "207940"],
  },
  {
    id: "group-chip",
    name: "국내 반도체",
    stockIds: ["005930", "000660", "042700"],
  },
  {
    id: "group-global",
    name: "글로벌 테크",
    stockIds: ["TSLA", "NVDA", "CRM"],
  },
  {
    id: "group-battery",
    name: "2차전지",
    stockIds: ["373220", "086520"],
  },
  {
    id: "group-dividend",
    name: "배당주",
    stockIds: ["105560", "055550"],
  },
];

const ARTICLES: Article[] = [
  {
    id: "article-samsung-20260805-2",
    url: "https://www.hankyung.com/article/2026080555766",
    stockIds: ["005930", "005935", "009150"],
    title: "반도체가 돌아왔다…삼성전자·SK하이닉스부터 소부장도 강세 [종목+]",
    date: "2026.08.05 09:29",
    section: "증권",
    tone: "navy",
    stockAnalyses: [
      { stockId: "005930", sentiment: "긍정", comment: "미국 반도체주 강세와 업종 전반의 매수세 유입으로 동반 상승 기대가 형성됐습니다." },
      { stockId: "005935", sentiment: "긍정", comment: "보통주와 함께 반도체 투자심리 개선의 수혜 종목으로 언급됐습니다." },
      { stockId: "009150", sentiment: "부정", comment: "단기 상승폭이 커지며 차익 실현에 따른 변동성 확대 가능성이 제기됐습니다." },
    ],
  },
  {
    id: "article-samsung-20260805-3",
    url: "https://www.hankyung.com/article/2026080554876",
    stockIds: ["005930", "005935", "009150"],
    title: "코스피 4%대 급등 출발…반도체주 랠리에 6600선 회복",
    date: "2026.08.05 09:11",
    section: "마켓",
    tone: "blue",
    stockAnalyses: [
      { stockId: "005930", sentiment: "긍정", comment: "미국 반도체주 급등과 외국인 매수세 유입으로 장 초반 강세가 나타났습니다." },
    ],
  },
  {
    id: "article-samsung-20260805-1",
    url: "https://www.hankyung.com/article/2026080565876",
    stockIds: ["005930", "005935", "009150"],
    title: "코스피, 외국인 1.4조 순매수에 3%대 상승…코스닥도 2.4%↑",
    date: "2026.08.05 03:43",
    section: "마켓",
    tone: "mint",
    stockAnalyses: [
      { stockId: "005930", sentiment: "중립", comment: "시장 상승 흐름에는 동참했지만 종목 고유의 추가 재료는 제한적이었습니다." },
      { stockId: "005935", sentiment: "중립", comment: "보통주와 비슷한 흐름을 보이며 뚜렷한 방향성 없이 거래됐습니다." },
      { stockId: "009150", sentiment: "부정", comment: "급격한 주가 변동으로 단기적인 가격 부담이 커질 수 있다는 평가가 나왔습니다." },
    ],
  },
  {
    id: "article-samsung-20260804-1",
    url: "https://www.hankyung.com/article/2026080444426",
    stockIds: ["005930", "009150", "006400"],
    title: "\"삼성·현대차 집중 투자\"…우리운용, 피지컬AI 액티브 ETF 출시",
    date: "2026.08.04 04:17",
    section: "증권",
    tone: "purple",
    stockAnalyses: [
      { stockId: "005930", sentiment: "중립", comment: "신규 ETF 편입 소식이 전해졌지만 당장의 실적 변화는 확인되지 않았습니다." },
      { stockId: "009150", sentiment: "중립", comment: "피지컬 AI 밸류체인에 포함됐으나 구체적인 투자 비중은 제한적입니다." },
      { stockId: "006400", sentiment: "중립", comment: "관련 산업 노출 가능성은 있으나 직접적인 수혜 여부는 아직 불분명합니다." },
    ],
  },
  {
    id: "article-samsung-20260804-2",
    url: "https://www.hankyung.com/article/2026080443336",
    stockIds: ["005930", "032830", "028260"],
    title: "코스피, 삼전닉스 주춤해도 1%대 강세…코스닥선 바이오주 '불기둥'",
    date: "2026.08.04 03:43",
    section: "마켓",
    tone: "sand",
    stockAnalyses: [
      { stockId: "005930", sentiment: "긍정", comment: "장중 약세를 회복하고 강보합으로 마감하며 하방 압력을 방어했습니다." },
      { stockId: "032830", sentiment: "중립", comment: "지분가치가 다시 언급됐지만 뚜렷한 방향성으로 이어지지는 않았습니다." },
      { stockId: "028260", sentiment: "중립", comment: "그룹주 흐름과 함께 움직이며 제한적인 등락을 보였습니다." },
    ],
  },
  {
    id: "article-samsung-sdi-20260803",
    stockIds: ["006400"],
    title: "삼성SDI, 북미 배터리 생산라인 효율화 속도",
    date: "2026.08.03 08:45",
    section: "산업",
    tone: "blue",
    stockAnalyses: [
      { stockId: "006400", sentiment: "부정", comment: "생산 효율화 과정에서 단기적인 비용 부담이 이어질 가능성이 제기됐습니다." },
    ],
  },
  {
    id: "article-samsung-bio-20260803",
    stockIds: ["207940"],
    title: "삼성바이오로직스, 대형 위탁생산 계약 추가 확보",
    date: "2026.08.03 08:10",
    section: "기업",
    tone: "mint",
    stockAnalyses: [
      { stockId: "207940", sentiment: "긍정", comment: "대형 위탁생산 계약 확보로 중장기 매출 성장에 대한 기대가 높아졌습니다." },
    ],
  },
  {
    id: "article-samsung-heavy-20260803",
    stockIds: ["010140"],
    title: "삼성중공업, 친환경 선박 수주 경쟁 본격화",
    date: "2026.08.03 07:40",
    section: "산업",
    tone: "navy",
    stockAnalyses: [
      { stockId: "010140", sentiment: "중립", comment: "수주 경쟁에 참여하고 있지만 구체적인 계약 규모는 아직 확인되지 않았습니다." },
    ],
  },
  {
    id: "article-1",
    stockIds: ["000660"],
    title: "HBM4 양산 속도 낸 SK하이닉스…AI 메모리 주도권 굳힌다",
    date: "2026.08.03 10:42",
    section: "산업",
    tone: "navy",
    stockAnalyses: [
      { stockId: "000660", sentiment: "긍정", comment: "HBM4 공급 일정 구체화로 AI 메모리 시장의 주도권 강화 기대가 형성됐습니다." },
    ],
  },
  {
    id: "article-2",
    stockIds: ["005930"],
    title: "삼성전자, 차세대 파운드리 수율 개선…대형 고객사 확보 속도",
    date: "2026.08.03 09:18",
    section: "기업",
    tone: "blue",
    stockAnalyses: [
      { stockId: "005930", sentiment: "긍정", comment: "첨단 공정 수율 개선과 신규 고객사 협의로 파운드리 수익성 회복 기대가 커졌습니다." },
    ],
  },
  {
    id: "article-3",
    stockIds: ["042700", "000660"],
    title: "AI 서버 투자 확대로 HBM 장비 주문 증가…후공정 업계 분주",
    date: "2026.08.02 17:35",
    section: "증권",
    tone: "mint",
    stockAnalyses: [
      { stockId: "042700", sentiment: "긍정", comment: "HBM 후공정 설비 투자 확대에 따라 장비 수주 증가 기대가 부각됐습니다." },
      { stockId: "000660", sentiment: "긍정", comment: "AI 서버용 HBM 수요 증가가 생산능력 확대와 실적 성장 기대를 높였습니다." },
    ],
  },
  {
    id: "article-4",
    stockIds: ["000660"],
    title: "단기 급등한 반도체주, 실적 눈높이도 따라왔나",
    date: "2026.08.02 14:10",
    section: "마켓",
    tone: "red",
    stockAnalyses: [
      { stockId: "000660", sentiment: "부정", comment: "단기 급등으로 실적 기대가 주가에 선반영돼 변동성 확대 가능성이 제기됐습니다." },
    ],
  },
  {
    id: "article-5",
    stockIds: ["005930", "000660"],
    title: "미국 반도체 지원정책 세부안 발표…국내 기업 영향은",
    date: "2026.08.01 16:22",
    section: "글로벌",
    tone: "sand",
    stockAnalyses: [
      { stockId: "005930", sentiment: "긍정", comment: "미국 현지 투자에 대한 세액공제와 보조금 확대의 수혜 가능성이 부각됐습니다." },
      { stockId: "000660", sentiment: "부정", comment: "지원 확대와 함께 추가 현지 설비 투자 조건이 제시돼 비용 부담이 커질 수 있습니다." },
    ],
  },
  {
    id: "article-6",
    stockIds: ["373220", "086520"],
    title: "전기차 수요 회복 시점은…배터리 업계, 하반기 가동률에 촉각",
    date: "2026.08.03 08:20",
    section: "산업",
    tone: "green",
    stockAnalyses: [],
  },
  {
    id: "article-7",
    stockIds: ["105560", "055550"],
    title: "주주환원 확대 나선 금융주…배당 매력 다시 부각",
    date: "2026.08.02 11:04",
    section: "증권",
    tone: "purple",
    stockAnalyses: [
      { stockId: "105560", sentiment: "긍정", comment: "안정적인 이익과 주주환원 확대가 배당 매력을 높이는 요인으로 부각됐습니다." },
      { stockId: "055550", sentiment: "긍정", comment: "자본비율 개선과 배당 확대가 주주환원 정책의 지속 가능성을 높였습니다." },
    ],
  },
  {
    id: "article-8",
    stockIds: ["TSLA"],
    title: "테슬라 가격 경쟁 심화…자동차 부문 마진 압박 커졌다",
    date: "2026.08.03 07:32",
    section: "글로벌",
    tone: "charcoal",
    stockAnalyses: [
      { stockId: "TSLA", sentiment: "부정", comment: "전기차 할인 경쟁과 가격 인하가 이어지며 자동차 부문의 마진 압박이 커졌습니다." },
    ],
  },
];

const REPORTS: Report[] = [
  {
    id: "report-1",
    stockId: "000660",
    firm: "미래에셋증권",
    title: "HBM4로 이어지는 이익 성장",
    date: "2026.08.03",
    opinion: "매수",
    target: "380,000원",
  },
  {
    id: "report-2",
    stockId: "005930",
    firm: "한국투자증권",
    title: "메모리 회복과 파운드리 개선의 교차점",
    date: "2026.08.02",
    opinion: "매수",
    target: "115,000원",
  },
  {
    id: "report-3",
    stockId: "042700",
    firm: "NH투자증권",
    title: "TC 본더 수요는 계속된다",
    date: "2026.08.01",
    opinion: "매수",
    target: "165,000원",
  },
  {
    id: "report-4",
    stockId: "000660",
    firm: "KB증권",
    title: "AI 인프라 투자의 가장 직접적인 수혜",
    date: "2026.07.31",
    opinion: "매수",
    target: "365,000원",
  },
  {
    id: "report-5",
    stockId: "373220",
    firm: "삼성증권",
    title: "가동률 회복을 기다리는 구간",
    date: "2026.08.03",
    opinion: "매수",
    target: "510,000원",
  },
  {
    id: "report-6",
    stockId: "086520",
    firm: "신한투자증권",
    title: "업황 바닥 통과 여부를 확인할 때",
    date: "2026.08.01",
    opinion: "중립",
    target: "76,000원",
  },
  {
    id: "report-7",
    stockId: "105560",
    firm: "하나증권",
    title: "주주환원 가시성이 높아졌다",
    date: "2026.08.02",
    opinion: "매수",
    target: "126,000원",
  },
  {
    id: "report-8",
    stockId: "005935",
    firm: "키움증권",
    title: "우선주 할인율 축소 가능성 점검",
    date: "2026.08.05",
    opinion: "매수",
    target: "88,000원",
  },
  {
    id: "report-9",
    stockId: "009150",
    firm: "대신증권",
    title: "AI 서버 부품 수요가 이끄는 성장",
    date: "2026.08.04",
    opinion: "매수",
    target: "205,000원",
  },
  {
    id: "report-10",
    stockId: "006400",
    firm: "신영증권",
    title: "하반기 수익성 회복을 기다리며",
    date: "2026.08.03",
    opinion: "중립",
    target: "225,000원",
  },
  {
    id: "report-11",
    stockId: "032830",
    firm: "하나증권",
    title: "자본정책 변화와 배당 여력에 주목",
    date: "2026.08.02",
    opinion: "매수",
    target: "165,000원",
  },
  {
    id: "report-12",
    stockId: "028260",
    firm: "삼성증권",
    title: "보유 지분 가치와 사업 경쟁력 재평가",
    date: "2026.08.01",
    opinion: "매수",
    target: "220,000원",
  },
  {
    id: "report-13",
    stockId: "207940",
    firm: "유안타증권",
    title: "생산능력 확대가 만드는 장기 성장",
    date: "2026.07.31",
    opinion: "매수",
    target: "1,260,000원",
  },
];

const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; highlighted?: boolean }[] = [
  { id: "home", label: "My 브리핑", icon: Home },
  { id: "badges", label: "배지", icon: Award, highlighted: true },
  { id: "reporter", label: "관심 기자", icon: UserRound },
  { id: "scrap", label: "뉴스 스크랩", icon: Bookmark },
  { id: "recent", label: "최근 본 기사", icon: Clock3, highlighted: true },
  { id: "watchlist", label: "관심종목", icon: Star, highlighted: true },
  { id: "portfolio", label: "포트폴리오", icon: BarChart3 },
  { id: "payment", label: "결제내역", icon: WalletCards },
  { id: "account", label: "내 계정", icon: Settings },
  { id: "logout", label: "로그아웃", icon: LogOut },
];

const DASHBOARD_BADGES: { code: string; name: string; icon: LucideIcon; tone: string; image?: string }[] = [
  { code: "hankyung-prestige", name: "한경 프레스티지", icon: Star, tone: "premium", image: "/badges/hankyung-prestige.png" },
  { code: "share-good", name: "좋은 건 함께", icon: Bookmark, tone: "green", image: "/badges/share-good.png" },
  { code: "my-newsroom", name: "마이 뉴스룸", icon: FileText, tone: "green", image: "/badges/my-newsroom.png" },
  { code: "first-conversation", name: "소통의 첫걸음", icon: BookOpen, tone: "green", image: "/badges/first-conversation.png" },
  { code: "feedback-place", name: "공감 맛집", icon: Award, tone: "green", image: "/badges/feedback-place.png" },
  { code: "alice-invite", name: "ALICE Q의 초대", icon: Star, tone: "green", image: "/badges/alice-invite.png" },
];

const DASHBOARD_RECENT_ARTICLES = [
  {
    title: "코스피, 외국인 순매수에 3%대 상승…반도체주 강세",
    publishedAt: "2026.08.18 09:29",
    url: "https://www.hankyung.com/article/2026080565876",
  },
  {
    title: "반도체가 돌아왔다…삼성전자·SK하이닉스 동반 상승",
    publishedAt: "2026.08.18 09:11",
    url: "https://www.hankyung.com/article/2026080555766",
  },
  {
    title: "코스피 6600선 회복…기관과 외국인 수급은",
    publishedAt: "2026.08.18 08:47",
    url: "https://www.hankyung.com/article/2026080554876",
  },
  {
    title: "장중 변동성 커진 증시, 투자자가 확인할 세 가지",
    publishedAt: "2026.08.17 18:20",
    url: "https://www.hankyung.com/article/2026080444426",
  },
  {
    title: "배당주 다시 주목…금융주 주주환원 경쟁 본격화",
    publishedAt: "2026.08.17 16:05",
    url: "https://www.hankyung.com/article/2026080443336",
  },
  {
    title: "AI 데이터센터 투자 확대…관련 기업 실적 기대감 커져",
    publishedAt: "2026.08.17 13:42",
    url: "https://www.hankyung.com/article/202608070578i",
  },
];

const DASHBOARD_RECENT_SUMMARY = {
  count: 23,
  analysisThreshold: 30,
  readingType: "여우형 독자",
  topCategory: "증권",
  topCategoryShare: 54,
};

const DEFAULT_ALERTS: AlertSettings = {
  article: true,
  report: true,
  movement: true,
  timeline: true,
  threshold: "5",
};

const DEFAULT_COLLAPSED_MODULES: CollapsedModules = {
  timeline: false,
  stocks: false,
  articles: false,
  reports: false,
};

const COLLAPSED_MODULES_STORAGE_KEY = "myhankyung-watchlist-collapsed-modules";
const ARTICLE_ANALYSIS_VISIBILITY_STORAGE_KEY = "myhankyung-watchlist-ai-point-view-visible";

function getStockDetailUrl(stock: Stock) {
  if (stock.marketType === "OVERSEAS") {
    const ticker = (stock.ticker || stock.code).replace(/-US$/i, "").toLowerCase();
    return `https://www.hankyung.com/globalmarket/equities/americas/${encodeURIComponent(ticker)}`;
  }
  return `https://markets.hankyung.com/stock/${encodeURIComponent(stock.code)}`;
}

function formatRate(rate: number) {
  return `${rate > 0 ? "+" : ""}${rate.toFixed(2)}%`;
}

function stockById(id: string) {
  return STOCKS.find((stock) => stock.id === id);
}

function visibleArticleAnalyses(article: Article, groupStockIds: string[]) {
  return article.stockAnalyses
    .filter((analysis) => groupStockIds.includes(analysis.stockId))
    .slice(0, 3);
}

function Movement({ stock, compact = false }: { stock: Stock; compact?: boolean }) {
  const direction = stock.rate > 0 ? "up" : stock.rate < 0 ? "down" : "flat";
  const displayPrice = stock.currency === "USD" ? stock.price : `${stock.price}원`;
  return (
    <div className={`movement movement-${direction} ${compact ? "movement-compact" : ""}`}>
      <strong>{displayPrice}</strong>
      <span>
        {stock.rate > 0 ? <TrendingUp size={14} /> : stock.rate < 0 ? <TrendingDown size={14} /> : null}
        {formatRate(stock.rate)}
      </span>
    </div>
  );
}

function AppDialog({
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`dialog-panel ${wide ? "dialog-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={`${title} 닫기`}>
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function MyHankyungClient({ initialView = "home" }: { initialView?: "home" | "watchlist" }) {
  const view = initialView;
  const [groups, setGroups] = useState<WatchGroup[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState(INITIAL_GROUPS[0].id);
  const [showArticleAnalysis, setShowArticleAnalysis] = useState(true);
  const [dialog, setDialog] = useState<"add" | "alerts" | "manage" | null>(null);
  const [toast, setToast] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsedModules, setCollapsedModules] = useState<CollapsedModules>(DEFAULT_COLLAPSED_MODULES);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddStockId, setSelectedAddStockId] = useState<string | null>(null);
  const [addTargetGroupIds, setAddTargetGroupIds] = useState<string[]>([INITIAL_GROUPS[0].id]);

  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [pendingDeleteGroupId, setPendingDeleteGroupId] = useState<string | null>(null);

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(DEFAULT_ALERTS);
  const [alertDraft, setAlertDraft] = useState<AlertSettings>(DEFAULT_ALERTS);
  const [preview, setPreview] = useState<PreviewItem>(null);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const selectedGroupStocks = useMemo(
    () => selectedGroup.stockIds
      .map(stockById)
      .filter((stock): stock is Stock => Boolean(stock)),
    [selectedGroup],
  );

  const timelineItems = useMemo(() => {
    if (selectedGroupStocks.length < 3) return [];

    const rising = selectedGroupStocks.filter((stock) => stock.rate > 0);
    const falling = selectedGroupStocks.filter((stock) => stock.rate < 0);
    const sorted = [...selectedGroupStocks].sort((a, b) => b.rate - a.rate);
    const strongest = sorted[0];
    const secondStrongest = sorted[1];
    const weakest = sorted[sorted.length - 1];
    const direction = rising.length >= falling.length ? "상승 우위" : "하락 우위";

    return [
      {
        date: "08.03",
        time: "09:30",
        title: `${direction}로 장을 시작했습니다`,
        description: `${selectedGroup.name} 그룹의 ${selectedGroupStocks.length}개 종목 가운데 ${rising.length}개가 상승하고 ${falling.length}개가 하락하며 장을 시작했습니다. ${strongest.name}가 ${formatRate(strongest.rate)}로 가장 강한 흐름을 보였고 ${secondStrongest.name}도 상승세에 힘을 보탰습니다. 반면 ${weakest.name}는 약세를 보이며 종목별 흐름이 엇갈렸습니다.`,
      },
      {
        date: "07.31",
        time: "16:00",
        title: `${strongest.name} 중심의 강세로 마감했습니다`,
        description: `${selectedGroup.name} 그룹은 장 후반까지 종목별 온도 차가 이어졌습니다. ${strongest.name}가 상승 흐름을 지킨 가운데 일부 약세 종목도 낙폭을 줄이며 주간 거래를 마쳤습니다.`,
        note: "15:30 종가 기준",
      },
      {
        date: "07.31",
        time: "13:30",
        title: "오전 상승세가 오후에도 이어졌습니다",
        description: `오후에는 ${strongest.name}와 ${secondStrongest.name}가 그룹 흐름을 이끌었습니다. 다만 ${weakest.name}는 상대적으로 약한 모습을 보여 종목별 차별화가 이어졌습니다.`,
      },
      {
        date: "07.31",
        time: "09:30",
        title: "주요 종목이 소폭 상승 출발했습니다",
        description: `${selectedGroup.name} 그룹은 보합권에서 장을 시작한 뒤 주요 종목을 중심으로 상승 폭을 넓혔습니다. 개장 초 거래는 ${strongest.name}에 비교적 집중됐습니다.`,
      },
      {
        date: "07.30",
        time: "16:00",
        title: "장중 변동성을 줄이며 거래를 마쳤습니다",
        description: `${selectedGroup.name} 그룹은 오후 들어 상승 종목과 하락 종목의 격차가 줄었습니다. ${strongest.name}는 강세를 유지했고 ${weakest.name}는 낙폭을 일부 회복하며 마감했습니다.`,
        note: "15:30 종가 기준",
      },
      {
        date: "07.30",
        time: "13:30",
        title: "종목별 등락이 엇갈렸습니다",
        description: `뚜렷한 그룹 방향보다는 개별 종목 이슈에 따라 움직임이 갈렸습니다. ${strongest.name}는 상승세를 보였지만 ${weakest.name}는 약세를 이어갔습니다.`,
      },
      {
        date: "07.30",
        time: "09:30",
        title: "보합권에서 신중하게 출발했습니다",
        description: `${selectedGroup.name} 그룹은 개장 직후 제한적인 움직임을 보였습니다. 거래가 늘면서 종목별 방향이 점차 나뉘는 모습이 나타났습니다.`,
      },
    ];
  }, [selectedGroup, selectedGroupStocks]);

  const groupArticles = ARTICLES.filter((article) =>
    article.stockIds.some((stockId) => selectedGroup.stockIds.includes(stockId)),
  );
  const filteredArticles = groupArticles
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
  const groupReports = REPORTS.filter((report) => selectedGroup.stockIds.includes(report.stockId));
  const filteredReports = groupReports
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchedStocks = normalizedSearchQuery
    ? STOCKS.filter(
        (stock) =>
          stock.name.toLowerCase().includes(normalizedSearchQuery) ||
          stock.code.toLowerCase().includes(normalizedSearchQuery),
      ).slice(0, 6)
    : [];
  const selectedAddStock = selectedAddStockId ? stockById(selectedAddStockId) : undefined;
  const pendingDeleteGroup = pendingDeleteGroupId
    ? groups.find((group) => group.id === pendingDeleteGroupId)
    : undefined;
  const pendingDeleteOnlyCount = pendingDeleteGroup
    ? pendingDeleteGroup.stockIds.filter(
        (stockId) => groups.filter((group) => group.stockIds.includes(stockId)).length === 1,
      ).length
    : 0;

  const showToast = (message: string) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const saved = window.localStorage.getItem(COLLAPSED_MODULES_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<CollapsedModules>;
      window.requestAnimationFrame(() => {
        setCollapsedModules((current) => ({ ...current, ...parsed }));
      });
    } catch {
      window.localStorage.removeItem(COLLAPSED_MODULES_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(ARTICLE_ANALYSIS_VISIBILITY_STORAGE_KEY);
    if (saved === null) return;
    window.requestAnimationFrame(() => setShowArticleAnalysis(saved === "true"));
  }, []);

  useEffect(() => {
    if (!dialog && !preview) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialog(null);
        setPreview(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dialog, preview]);

  const chooseGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const toggleArticleAnalysis = () => {
    setShowArticleAnalysis((current) => {
      const next = !current;
      window.localStorage.setItem(ARTICLE_ANALYSIS_VISIBILITY_STORAGE_KEY, String(next));
      return next;
    });
  };

  const toggleModule = (module: CollapsibleModule) => {
    setCollapsedModules((current) => {
      const next = { ...current, [module]: !current[module] };
      window.localStorage.setItem(COLLAPSED_MODULES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const openAddDialog = () => {
    setSearchQuery("");
    setSelectedAddStockId(null);
    setAddTargetGroupIds([selectedGroupId]);
    setDialog("add");
  };

  const openManageDialog = () => {
    setEditingGroupId(null);
    setPendingDeleteGroupId(null);
    setDialog("manage");
  };

  const openAlertsDialog = () => {
    setAlertDraft(alertSettings);
    setDialog("alerts");
  };

  const addStock = () => {
    if (!selectedAddStock) return;
    let limitExceeded = false;
    setGroups((currentGroups) =>
      currentGroups.map((group) => {
        const shouldInclude = addTargetGroupIds.includes(group.id);
        const alreadyIncluded = group.stockIds.includes(selectedAddStock.id);
        if (shouldInclude && !alreadyIncluded) {
          if (group.stockIds.length >= 30) {
            limitExceeded = true;
            return group;
          }
          return { ...group, stockIds: [...group.stockIds, selectedAddStock.id] };
        }
        if (!shouldInclude && alreadyIncluded) {
          return { ...group, stockIds: group.stockIds.filter((stockId) => stockId !== selectedAddStock.id) };
        }
        return group;
      }),
    );
    setDialog(null);
    if (limitExceeded) {
      showToast("일부 그룹의 종목 한도(30개)를 초과하여 제외되었습니다.");
    } else {
      showToast(`${selectedAddStock.name}의 관심그룹을 저장했습니다.`);
    }
  };

  const addGroup = () => {
    if (groups.length >= 5) {
      showToast("관심그룹은 최대 5개까지 만들 수 있습니다.");
      return;
    }
    const name = newGroupName.trim().slice(0, 10);
    if (!name) return;
    const id = `group-${Date.now()}`;
    setGroups((current) => [...current, { id, name, stockIds: [] }]);
    setNewGroupName("");
    showToast(`${name} 그룹을 만들었습니다.`);
  };

  const moveGroup = (groupId: string, direction: -1 | 1) => {
    setGroups((current) => {
      const index = current.findIndex((group) => group.id === groupId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const startRenameGroup = (group: WatchGroup) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  const saveGroupName = () => {
    const name = editingGroupName.trim().slice(0, 10);
    if (!editingGroupId || !name) return;
    setGroups((current) =>
      current.map((group) => (group.id === editingGroupId ? { ...group, name } : group)),
    );
    setEditingGroupId(null);
    showToast("그룹 이름을 변경했습니다.");
  };

  const deleteGroup = () => {
    if (!pendingDeleteGroup || groups.length === 1) return;
    const nextGroups = groups.filter((group) => group.id !== pendingDeleteGroup.id);
    setGroups(nextGroups);
    if (selectedGroupId === pendingDeleteGroup.id) {
      setSelectedGroupId(nextGroups[0].id);
    }
    setPendingDeleteGroupId(null);
    showToast(`${pendingDeleteGroup.name} 그룹을 삭제했습니다.`);
  };

  const removeStockFromSelectedGroup = (stock: Stock) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === selectedGroupId
          ? { ...group, stockIds: group.stockIds.filter((stockId) => stockId !== stock.id) }
          : group,
      ),
    );
    showToast(`${stock.name}를 현재 그룹에서 삭제했습니다.`);
  };

  const handleNav = (id: string) => {
    setMobileNavOpen(false);
    if (id === "home") window.location.assign("/");
    else if (id === "badges") window.location.assign("/badges");
    else if (id === "recent") window.location.assign("/recent-articles");
    else if (id === "watchlist") window.location.assign("/watchlist");
    else showToast("이번 프로토타입은 관심종목 개편 범위에 집중했습니다.");
  };

  return (
    <div className="site-frame">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-small" type="button" onClick={() => window.location.assign("/")} aria-label="한경 홈">
            한경
          </button>
          <button className="brand-main" type="button" onClick={() => window.location.assign("/")} aria-label="마이한경 홈">
            <span>My</span>한경
          </button>
          <button
            className="mobile-menu"
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="마이한경 메뉴 열기"
            aria-expanded={mobileNavOpen}
          >
            <Menu size={23} />
          </button>
        </div>
      </header>

      <div className="site-body">
        <aside className={`side-nav ${mobileNavOpen ? "side-nav-open" : ""}`} aria-label="마이한경 메뉴">
          <nav>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.id === view || (view === "home" && item.id === "home");
              return (
                <button
                  key={item.id}
                  className={`nav-item ${active ? "nav-item-active" : ""}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                >
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.highlighted ? <span className="nav-item-dot" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="main-content">
          {view === "home" ? (
            <Dashboard
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={chooseGroup}
              onOpenBadges={() => window.location.assign("/badges")}
              onOpenRecent={() => window.location.assign("/recent-articles")}
              onOpenWatchlist={() => window.location.assign("/watchlist")}
            />
          ) : (
            <section className="watchlist-page">
              <div className="watchlist-titlebar">
                <div>
                  <h1>관심종목</h1>
                  <p>관심 있는 종목의 흐름과 한경의 기사·리포트를 한곳에서 확인하세요.</p>
                </div>
                <div className="page-actions">
                  <button className="button action-control-button" type="button" onClick={openAlertsDialog}>
                    <Bell size={18} />
                    알림 관리
                  </button>
                  <button className="button action-control-button" type="button" onClick={openManageDialog}>
                    <Settings size={18} />
                    그룹편집
                  </button>
                </div>
              </div>

              <section className="group-filter-panel" aria-labelledby="group-filter-title">
                <div className="module-heading">
                  <h2 id="group-filter-title">관심그룹</h2>
                  <div className="group-limit-badge">{groups.length}/5개 그룹</div>
                </div>
                <div className="group-tabs" role="group" aria-label="관심그룹 선택">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      aria-pressed={group.id === selectedGroup.id}
                      className={`group-tab ${group.id === selectedGroup.id ? "group-tab-active" : ""}`}
                      onClick={() => chooseGroup(group.id)}
                    >
                      <span>{group.name}</span>
                      <em>{group.stockIds.length}</em>
                    </button>
                  ))}
                </div>
              </section>

              <section className="stock-list-panel" aria-labelledby="stock-list-title">
                <div className="module-heading">
                  <h2 id="stock-list-title">관심종목 ({selectedGroupStocks.length}/30)</h2>
                  <div className="module-heading-actions">
                    <button className="button action-control-button" type="button" onClick={openAddDialog} aria-label="현재 그룹에 종목 추가">
                      <Plus size={18} />
                      <span>종목추가</span>
                    </button>
                    <CollapseButton
                      label="관심종목"
                      collapsed={collapsedModules.stocks}
                      onToggle={() => toggleModule("stocks")}
                    />
                  </div>
                </div>
                {!collapsedModules.stocks && selectedGroupStocks.length ? (
                  <>
                    <div className="stock-market-table-wrap">
                      <table className="stock-market-table" aria-label={`${selectedGroup.name} 종목 시세표`}>
                        <thead>
                          <tr>
                            <th scope="col">종목명</th>
                            <th scope="col">현재가</th>
                            <th scope="col">등락폭</th>
                            <th scope="col">등락률</th>
                            <th scope="col">고가</th>
                            <th scope="col">저가</th>
                            <th className="stock-action-column" scope="col" aria-label="종목 삭제" />
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroupStocks.map((stock) => {
                            const direction = stock.rate > 0 ? "up" : stock.rate < 0 ? "down" : "flat";
                            const detailUrl = getStockDetailUrl(stock);
                            const issues = (stock.issues || []).slice(0, 5);
                            const hasIssues = issues.length > 0;
                            const displayPrice = stock.currency === "USD" ? stock.price : `${stock.price}원`;
                            const displayChange = stock.currency === "USD" ? stock.change : `${stock.change}원`;
                            const displayHigh = stock.currency === "USD" ? stock.high : `${stock.high}원`;
                            const displayLow = stock.currency === "USD" ? stock.low : `${stock.low}원`;

                            return (
                              <React.Fragment key={stock.id}>
                                <tr>
                                  <td>
                                    <div className="stock-table-name">
                                      <a href={detailUrl} target="_blank" rel="noopener noreferrer" aria-label={`${stock.name} 종목 상세 페이지로 새 창 이동`}>
                                        {stock.name}
                                      </a>
                                      <span>
                                        {stock.code} · {stock.market}
                                        {stock.marketType === "OVERSEAS" ? (
                                          <span className="market-tag market-tag-overseas">해외</span>
                                        ) : null}
                                      </span>
                                    </div>
                                  </td>
                                  <td>{displayPrice}</td>
                                  <td className={`stock-number-${direction}`}>
                                    {stock.rate > 0 ? "▲" : stock.rate < 0 ? "▼" : "−"} {displayChange}
                                  </td>
                                  <td className={`stock-number-${direction}`}>{formatRate(stock.rate)}</td>
                                  <td>{displayHigh}</td>
                                  <td>{displayLow}</td>
                                  <td className="stock-action-column">
                                    <button
                                      className="stock-remove-button"
                                      type="button"
                                      onClick={() => removeStockFromSelectedGroup(stock)}
                                      aria-label={`${stock.name} 현재 그룹에서 삭제`}
                                    >
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>
                                {hasIssues ? (
                                  <tr className="stock-market-table-card-row">
                                    <td colSpan={7}>
                                      <div className="stock-intelligence-container">
                                        <div className="stock-intelligence-header">
                                          <Sparkles size={13} />
                                          <span>AI 핵심 이슈 ({issues.length}건)</span>
                                        </div>
                                        <div className="stock-intelligence-list">
                                          {issues.map((issue) => (
                                            <div
                                              key={issue.id}
                                              className={`stock-issue-card ${issue.sentiment === "호재" ? "stock-issue-positive" : "stock-issue-negative"}`}
                                            >
                                              <div className="stock-issue-left">
                                                <span
                                                  className={`stock-issue-badge ${issue.sentiment === "호재" ? "badge-positive" : "badge-negative"}`}
                                                >
                                                  {issue.sentiment}
                                                </span>
                                                <span className="stock-issue-comment">{issue.comment}</span>
                                              </div>
                                              <a
                                                href={issue.articleUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="stock-issue-link"
                                                aria-label="관련 한경 기사 새 창 보기"
                                              >
                                                <span>기사 보기</span>
                                                <ExternalLink size={12} />
                                              </a>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="stock-mobile-list" aria-label={`${selectedGroup.name} 모바일 종목 목록`}>
                      {selectedGroupStocks.map((stock) => {
                        const direction = stock.rate > 0 ? "up" : stock.rate < 0 ? "down" : "flat";
                        const detailUrl = getStockDetailUrl(stock);
                        const issues = (stock.issues || []).slice(0, 5);
                        const hasIssues = issues.length > 0;
                        const displayChange = stock.currency === "USD" ? stock.change : `${stock.change}원`;
                        const displayHigh = stock.currency === "USD" ? stock.high : `${stock.high}원`;
                        const displayLow = stock.currency === "USD" ? stock.low : `${stock.low}원`;

                        return (
                          <article key={stock.id} className="stock-mobile-card">
                            <div className="stock-mobile-heading">
                              <div className="stock-identity">
                                <div className="stock-mark">{stock.name.slice(0, 1)}</div>
                                <div>
                                  <a href={detailUrl} target="_blank" rel="noopener noreferrer" aria-label={`${stock.name} 종목 상세 페이지로 새 창 이동`}>
                                    {stock.name}
                                  </a>
                                  <span>
                                    {stock.code} · {stock.market}
                                    {stock.marketType === "OVERSEAS" ? (
                                      <span className="market-tag market-tag-overseas">해외</span>
                                    ) : null}
                                  </span>
                                </div>
                              </div>
                              <div className="stock-mobile-actions">
                                <Movement stock={stock} />
                                <button
                                  className="stock-remove-button"
                                  type="button"
                                  onClick={() => removeStockFromSelectedGroup(stock)}
                                  aria-label={`${stock.name} 현재 그룹에서 삭제`}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                            <dl className="stock-mobile-details">
                              <div>
                                <dt>등락폭</dt>
                                <dd className={`stock-number-${direction}`}>
                                  {stock.rate > 0 ? "▲" : stock.rate < 0 ? "▼" : "−"} {displayChange}
                                </dd>
                              </div>
                              <div>
                                <dt>고가</dt>
                                <dd>{displayHigh}</dd>
                              </div>
                              <div>
                                <dt>저가</dt>
                                <dd>{displayLow}</dd>
                              </div>
                            </dl>
                            {hasIssues ? (
                              <div className="stock-mobile-intelligence">
                                <div className="stock-intelligence-header">
                                  <Sparkles size={13} />
                                  <span>AI 핵심 이슈 ({issues.length}건)</span>
                                </div>
                                <div className="stock-intelligence-list">
                                  {issues.map((issue) => (
                                    <div
                                      key={issue.id}
                                      className={`stock-issue-card ${issue.sentiment === "호재" ? "stock-issue-positive" : "stock-issue-negative"}`}
                                    >
                                      <div className="stock-issue-left">
                                        <span
                                          className={`stock-issue-badge ${issue.sentiment === "호재" ? "badge-positive" : "badge-negative"}`}
                                        >
                                          {issue.sentiment}
                                        </span>
                                        <span className="stock-issue-comment">{issue.comment}</span>
                                      </div>
                                      <a
                                        href={issue.articleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="stock-issue-link"
                                        aria-label="관련 한경 기사 새 창 보기"
                                      >
                                        <span>기사 보기</span>
                                        <ExternalLink size={12} />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </>
                ) : !collapsedModules.stocks ? (
                  <div className="empty-panel">
                    <Star size={26} />
                    <strong>아직 등록한 종목이 없습니다.</strong>
                    <p>이 그룹에서 보고 싶은 종목을 한 개씩 추가해보세요.</p>
                  </div>
                ) : null}
              </section>

              <section className="content-panel content-panel-separate" aria-labelledby="reports-title">
                <div className="module-heading content-module-heading">
                  <a
                    className="module-title-link"
                    href="https://markets.hankyung.com/consensus"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="리포트 전체보기 (한경 컨센서스 새 창 이동)"
                  >
                    <h2 id="reports-title">증권사 리포트</h2>
                    <ChevronRight size={19} aria-hidden="true" />
                  </a>
                  <div className="module-heading-actions">
                    <CollapseButton
                      label="리포트"
                      collapsed={collapsedModules.reports}
                      onToggle={() => toggleModule("reports")}
                    />
                  </div>
                </div>
                {!collapsedModules.reports ? (
                  <div className="report-grid">
                    {filteredReports.length ? (
                      filteredReports.map((report) => (
                        <ReportCard key={report.id} report={report} onOpen={() => setPreview({ type: "report", item: report })} />
                      ))
                    ) : (
                      <ContentEmpty type="리포트" />
                    )}
                  </div>
                ) : null}
              </section>
            </section>
          )}
        </main>
      </div>

      <footer className="site-footer">© 한경닷컴 Corp. · 관심종목 서비스 프로토타입</footer>

      {dialog === "add" ? (
        <AppDialog
          title="관심종목 추가"
          onClose={() => setDialog(null)}
        >
          <div className="dialog-body add-stock-dialog">
            <section className="add-dialog-section stock-search-section">
              <div className="add-section-label">종목 검색</div>
              <label className="search-field">
                <Search size={19} />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSelectedAddStockId(null);
                  }}
                  placeholder="종목명 또는 종목코드 검색"
                  autoFocus
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedAddStockId(null);
                    }}
                    aria-label="검색어 지우기"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </label>

              {normalizedSearchQuery ? (
                <div className="search-results" aria-label="종목 검색 결과">
                  {searchedStocks.map((stock) => {
                    const alreadyAdded = selectedGroup.stockIds.includes(stock.id);
                    const checked = alreadyAdded || selectedAddStockId === stock.id;
                    return (
                      <button
                        key={stock.id}
                        className={`search-result ${checked ? "search-result-selected" : ""} ${alreadyAdded ? "search-result-added" : ""}`}
                        type="button"
                        aria-pressed={checked}
                        aria-label={alreadyAdded ? `${stock.name}, 현재 그룹에 등록됨, 그룹 설정` : `${stock.name} 선택`}
                        onClick={() => {
                          setSelectedAddStockId(stock.id);
                          const currentMemberships = groups
                            .filter((group) => group.stockIds.includes(stock.id))
                            .map((group) => group.id);
                          setAddTargetGroupIds(Array.from(new Set([selectedGroupId, ...currentMemberships])));
                        }}
                      >
                        <span className="radio-mark">{checked ? <Check size={14} /> : null}</span>
                        <span className="result-name">
                          <strong>{stock.name}</strong>
                          <small>{stock.code} · {stock.market}</small>
                        </span>
                        {alreadyAdded ? <span className="search-result-status">등록됨</span> : <Movement stock={stock} compact />}
                      </button>
                    );
                  })}
                  {!searchedStocks.length ? <div className="no-search-result">일치하는 종목이 없습니다.</div> : null}
                </div>
              ) : (
                <div className="search-before-state">
                  <Search size={22} />
                  <span>검색어를 입력하면 종목 결과가 표시됩니다.</span>
                </div>
              )}
            </section>
            <section className="add-dialog-section">
              <div className="add-section-label">관심그룹</div>
              <div className="add-group-checklist" aria-label="종목을 저장할 관심그룹">
                {groups.map((group) => {
                  const isCurrentGroup = group.id === selectedGroupId;
                  const checked = addTargetGroupIds.includes(group.id);
                  return (
                    <label key={group.id} className={`add-group-option ${checked ? "add-group-option-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isCurrentGroup}
                        onChange={(event) => {
                          setAddTargetGroupIds((current) =>
                            event.target.checked
                              ? Array.from(new Set([...current, group.id]))
                              : current.filter((groupId) => groupId !== group.id),
                          );
                        }}
                      />
                      <span className="checkbox-mark">{checked ? <Check size={14} /> : null}</span>
                      <strong>{group.name}</strong>
                      {isCurrentGroup ? <small>현재 그룹</small> : null}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
          <div className="dialog-actions">
            <button
              className="button button-primary"
              type="button"
              disabled={!selectedAddStock}
              onClick={addStock}
            >
              저장
            </button>
          </div>
        </AppDialog>
      ) : null}

      {dialog === "alerts" ? (
        <AppDialog
          title="알림 설정"
          description="관심종목에 중요한 소식이 발생하면 푸시 알림으로 신속하게 알려드립니다. (24시간 실시간 발송)"
          onClose={() => setDialog(null)}
        >
          <div className="dialog-body notification-list">
            <AlertRow
              title="AI 핵심 이슈 (호재·악재)"
              description="관심종목에 호재 또는 악재 뉴스가 감지되면 실시간 분석 코멘트와 함께 알려드립니다."
              checked={alertDraft.article}
              onChange={(checked) => setAlertDraft((current) => ({ ...current, article: checked }))}
              icon={<Sparkles size={20} />}
            />
            <AlertRow
              title="주가 급등락 변동폭"
              description="관심종목이 설정한 급등락률에 도달하면 신속하게 알려드립니다."
              checked={alertDraft.movement}
              onChange={(checked) => setAlertDraft((current) => ({ ...current, movement: checked }))}
              icon={<TrendingUp size={20} />}
            >
              <label className="inline-setting">
                변동 기준
                <select
                  value={alertDraft.threshold}
                  disabled={!alertDraft.movement}
                  onChange={(event) =>
                    setAlertDraft((current) => ({
                      ...current,
                      threshold: event.target.value as AlertSettings["threshold"],
                    }))
                  }
                >
                  <option value="3">±3% 이상</option>
                  <option value="5">±5% 이상</option>
                  <option value="10">±10% 이상</option>
                </select>
              </label>
            </AlertRow>
            <AlertRow
              title="증권사 리포트 발간"
              description="관심종목을 다룬 신규 목표주가 및 투자의견 리포트가 발행되면 알려드립니다."
              checked={alertDraft.report}
              onChange={(checked) => setAlertDraft((current) => ({ ...current, report: checked }))}
              icon={<FileText size={20} />}
            />
          </div>
          <div className="dialog-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                setAlertSettings(alertDraft);
                setDialog(null);
                showToast("알림 설정을 저장했습니다.");
              }}
            >
              저장
            </button>
          </div>
        </AppDialog>
      ) : null}

      {dialog === "manage" ? (
        <AppDialog
          title="관심그룹 관리"
          description="관심그룹은 최대 5개까지 생성 가능하며 최소 1개 이상 유지됩니다. (이름 최대 15자)"
          onClose={() => setDialog(null)}
        >
          <div className="manage-layout">
            <section className="manage-groups" aria-label="관심그룹 관리">
              <div className="manage-group-list">
                {groups.map((group, index) => (
                  <div
                    key={group.id}
                    className="manage-group-row"
                  >
                    <div className="group-select-area">
                      <GripVertical size={17} />
                      {editingGroupId === group.id ? (
                        <input
                          value={editingGroupName}
                          maxLength={15}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => setEditingGroupName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") saveGroupName();
                          }}
                          aria-label="그룹 이름"
                          autoFocus
                        />
                      ) : (
                        <span>{group.name}</span>
                      )}
                    </div>
                    <div className="group-row-actions">
                      {editingGroupId === group.id ? (
                        <button type="button" onClick={saveGroupName} aria-label="그룹 이름 저장"><Check size={16} /></button>
                      ) : (
                        <button type="button" onClick={() => startRenameGroup(group)} aria-label={`${group.name} 이름 수정`}><Pencil size={15} /></button>
                      )}
                      <button type="button" disabled={index === 0} onClick={() => moveGroup(group.id, -1)} aria-label={`${group.name} 위로 이동`}><ArrowUp size={15} /></button>
                      <button type="button" disabled={index === groups.length - 1} onClick={() => moveGroup(group.id, 1)} aria-label={`${group.name} 아래로 이동`}><ArrowDown size={15} /></button>
                      <button
                        className="danger-icon"
                        type="button"
                        disabled={groups.length === 1}
                        onClick={() => setPendingDeleteGroupId(group.id)}
                        aria-label={`${group.name} 삭제`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="new-group-form">
                <input
                  value={newGroupName}
                  maxLength={15}
                  disabled={groups.length >= 5}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addGroup();
                  }}
                  placeholder={groups.length >= 5 ? "그룹은 최대 5개까지 생성 가능합니다" : "새 그룹 이름 (최대 15자)"}
                  aria-label="새 그룹 이름"
                />
                <button
                  type="button"
                  onClick={addGroup}
                  disabled={!newGroupName.trim() || groups.length >= 5}
                  aria-label="새 그룹 추가"
                >
                  <Plus size={18} />
                </button>
              </div>

              {pendingDeleteGroup ? (
                <div className="delete-confirmation" role="alert">
                  <strong>‘{pendingDeleteGroup.name}’ 그룹을 삭제할까요?</strong>
                  <p>
                    이 그룹에만 있는 {pendingDeleteOnlyCount}개 종목은 관심종목에서도 함께 삭제됩니다.
                    {pendingDeleteGroup.stockIds.length - pendingDeleteOnlyCount > 0
                      ? ` 다른 그룹에도 있는 ${pendingDeleteGroup.stockIds.length - pendingDeleteOnlyCount}개 종목은 해당 그룹에 유지됩니다.`
                      : ""}
                  </p>
                  <div>
                    <button className="button button-ghost button-small" type="button" onClick={() => setPendingDeleteGroupId(null)}>취소</button>
                    <button className="button button-danger button-small" type="button" onClick={deleteGroup}>그룹 삭제</button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
          <div className="dialog-actions manage-dialog-actions">
            <p>현재 그룹 {groups.length}/5개 (최소 1개 유지)</p>
            <button className="button button-primary" type="button" onClick={() => setDialog(null)}>완료</button>
          </div>
        </AppDialog>
      ) : null}

      {preview ? (
        <AppDialog
          title={preview.type === "article" ? "기사 미리보기" : "리포트 미리보기"}
          description="실서비스에서는 한경닷컴의 기사뷰 또는 리포트 상세로 이동합니다."
          onClose={() => setPreview(null)}
        >
          <div className="dialog-body preview-content">
            {preview.type === "article" ? (
              <>
                <div className="preview-badges"><span>{preview.item.section}</span></div>
                <h3>{preview.item.title}</h3>
                <ArticleAnalysisList
                  analyses={visibleArticleAnalyses(preview.item, selectedGroup.stockIds)}
                />
                <small>{preview.item.date} · 한경닷컴</small>
              </>
            ) : (
              <>
                <div className="preview-badges"><span>{preview.item.firm}</span><span>{stockById(preview.item.stockId)?.name}</span></div>
                <h3>{preview.item.title}</h3>
                <dl>
                  <div><dt>투자의견</dt><dd>{preview.item.opinion}</dd></div>
                  <div><dt>목표주가</dt><dd>{preview.item.target}</dd></div>
                  <div><dt>발행일</dt><dd>{preview.item.date}</dd></div>
                </dl>
              </>
            )}
          </div>
          <div className="dialog-actions">
            <button className="button button-ghost" type="button" onClick={() => setPreview(null)}>닫기</button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                setPreview(null);
                showToast(preview.type === "article" ? "기사뷰로 이동합니다." : "리포트 상세로 이동합니다.");
              }}
            >
              {preview.type === "article" ? "기사뷰로 이동" : "리포트 상세 보기"}
            </button>
          </div>
        </AppDialog>
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          <Check size={17} /> {toast}
        </div>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return <MyHankyungClient initialView="home" />;
}

function Dashboard({
  groups,
  selectedGroupId,
  onSelectGroup,
  onOpenBadges,
  onOpenRecent,
  onOpenWatchlist,
}: {
  groups: WatchGroup[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onOpenBadges: () => void;
  onOpenRecent: () => void;
  onOpenWatchlist: () => void;
}) {
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const groupStocks = selectedGroup.stockIds
    .map(stockById)
    .filter((stock): stock is Stock => Boolean(stock));
  const visibleGroupStocks = groupStocks.slice(0, 5);

  return (
    <section className="dashboard-page">
      <div className="premium-banner">
        <div><strong>한경 PREMIUM</strong><span>AI를 넘어서는 성공투자</span></div>
        <em>구독 중</em>
      </div>
      <div className="dashboard-grid">
        <article className="dashboard-card dashboard-my-briefing-card">
          <div className="dashboard-card-title">
            <div className="title-with-icon">
              <MessageSquareText size={22} />
              <h2>My 브리핑</h2>
              <span>1개</span>
            </div>
          </div>

          <div className="dashboard-briefing-profile">
            <span className="dashboard-briefing-emblem" aria-hidden="true">
              <Banknote size={34} strokeWidth={1.7} />
            </span>
            <div>
              <div className="dashboard-briefing-name">
                <strong>미국 증시</strong>
                <Settings size={20} strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div className="dashboard-briefing-schedule">
                <span>매일(월~일)</span>
                <span>오전 08:00</span>
              </div>
            </div>
          </div>

          <div className="dashboard-briefing-copy">
            <p>2026년 8월 18일 오전 브리핑입니다.</p>
            <p>
              17일(현지시간) 뉴욕증시의 다우존스, S&amp;P500, 나스닥 등 3대 주요 지수는 미국과 이란 간의 임시 휴전 종료로 인한 중동 지정학적 긴장 고조 여파로 일제히 하락 마감했습니다. 양국 간 갈등이 심화되면서 브렌트유와 서부텍사스산원유(WTI) 등 국제 유가가 급등세로 전환했고, 이는 인플레이션 압력을 높여 미국 국채 금리 상승을 견인했습니다. 부진한 미국 소비 지표로 인해 경기 둔화 우려가 상존하는 가운데, 유가와 금리의 동반 상승이 투자 심리를 크게 위축시킨 것으로 분석됩니다.
            </p>
          </div>
        </article>

        <article className="dashboard-card dashboard-recent-card">
          <div className="dashboard-card-title">
            <a className="title-with-icon dashboard-recent-heading-link" href="/recent-articles">
              <Clock3 size={22} />
              <h2>최근 본 기사</h2>
              <span>{DASHBOARD_RECENT_SUMMARY.count}건</span>
            </a>
            <button type="button" onClick={onOpenRecent} aria-label="최근 본 기사 전체보기">
              <ChevronRight size={20} />
            </button>
          </div>
          <dl className="dashboard-recent-stats" aria-label="최근 본 기사 요약 통계">
            <div>
              <dt>나의 읽기 유형</dt>
              <dd>
                {DASHBOARD_RECENT_SUMMARY.count >= DASHBOARD_RECENT_SUMMARY.analysisThreshold
                  ? DASHBOARD_RECENT_SUMMARY.readingType
                  : `${DASHBOARD_RECENT_SUMMARY.analysisThreshold - DASHBOARD_RECENT_SUMMARY.count}건 더 필요해요`}
              </dd>
            </div>
            <div>
              <dt>많이 본 분야</dt>
              <dd className="dashboard-top-category">
                <span>{DASHBOARD_RECENT_SUMMARY.topCategory}</span>
                <span className="dashboard-top-category-share" aria-label={`${DASHBOARD_RECENT_SUMMARY.topCategoryShare}%`}>
                  <span
                    className="dashboard-mini-donut"
                    style={{ "--dashboard-share": `${DASHBOARD_RECENT_SUMMARY.topCategoryShare}%` } as CSSProperties}
                    aria-hidden="true"
                  />
                  <strong>{DASHBOARD_RECENT_SUMMARY.topCategoryShare}%</strong>
                </span>
              </dd>
            </div>
          </dl>
          <ul className="dashboard-recent-list" aria-label="최근 본 기사 목록">
            {DASHBOARD_RECENT_ARTICLES.map((article) => (
              <li className="dashboard-recent-item" key={`${article.url}-${article.publishedAt}`}>
                <a href={article.url}>
                  <strong>{article.title}</strong>
                  <time dateTime={article.publishedAt.replace(" ", "T")}>{article.publishedAt}</time>
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-card dashboard-badge-card">
          <div className="dashboard-card-title">
            <div className="title-with-icon"><Award size={21} /><h2>보유 배지</h2><span>8개</span></div>
            <button type="button" onClick={onOpenBadges} aria-label="보유 배지 전체보기"><ChevronRight size={20} /></button>
          </div>
          <div className="dashboard-badge-grid" aria-label="최근 획득한 배지 목록">
            {DASHBOARD_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <a className="dashboard-badge-item" href={`/badges?badge=${badge.code}`} key={badge.code}>
                  <span className={`dashboard-badge-emblem badge-tone-${badge.tone} ${badge.image ? "dashboard-badge-emblem-image" : ""}`} aria-hidden="true">
                    {badge.image ? <Image src={badge.image} alt="" width={80} height={80} unoptimized /> : <Icon size={29} strokeWidth={1.65} />}
                  </span>
                  <strong>{badge.name}</strong>
                </a>
              );
            })}
          </div>
        </article>

        <article className="dashboard-card compact-dashboard-card">
          <div className="dashboard-card-title">
            <div className="title-with-icon"><Bookmark size={21} /><h2>뉴스 스크랩</h2><span>6개</span></div>
            <button type="button" aria-label="뉴스 스크랩 전체보기"><ChevronRight size={20} /></button>
          </div>
          <ul className="dashboard-news-list">
            <li><strong>반도체 수출 다시 최고치…하반기 전망은</strong><small>2026.08.18 09:29</small></li>
            <li><strong>금융주 주주환원 정책 한눈에 보기</strong><small>2026.08.17 18:42</small></li>
            <li><strong>전기차 캐즘 이후의 배터리 시장</strong><small>2026.08.16 13:05</small></li>
          </ul>
        </article>

        <article className="dashboard-card dashboard-watch-card">
          <div className="dashboard-card-title">
            <div className="title-with-icon"><Star size={21} /><h2>관심종목</h2></div>
            <button type="button" onClick={onOpenWatchlist} aria-label="관심종목 전체보기"><ChevronRight size={20} /></button>
          </div>
          <div className="group-tabs dashboard-group-tabs" role="group" aria-label="My한경 메인 관심그룹 선택">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                aria-pressed={group.id === selectedGroup.id}
                className={`group-tab ${group.id === selectedGroup.id ? "group-tab-active" : ""}`}
                onClick={() => onSelectGroup(group.id)}
              >
                <span>{group.name}</span>
                <em>{group.stockIds.length}</em>
              </button>
            ))}
          </div>
          <div className="dashboard-stock-list">
            {visibleGroupStocks.map((stock) => (
              <button key={stock.id} type="button" onClick={onOpenWatchlist}>
                <span><strong>{stock.name}</strong><small>{stock.code}</small></span>
                <Movement stock={stock} compact />
              </button>
            ))}
            {visibleGroupStocks.length === 0 ? (
              <p className="dashboard-stock-empty">이 그룹에 등록된 관심종목이 없습니다.</p>
            ) : null}
          </div>
        </article>

        <article className="dashboard-card compact-dashboard-card">
          <div className="dashboard-card-title">
            <div className="title-with-icon"><UserRound size={21} /><h2>관심 기자</h2><span>8명</span></div>
            <button type="button" aria-label="관심 기자 전체보기"><ChevronRight size={20} /></button>
          </div>
          <div className="reporter-row">
            {["김우섭", "강경주", "박의명", "이시은"].map((name, index) => (
              <div key={name}><span>{name.slice(0, 1)}{index + 1}</span><strong>{name}</strong></div>
            ))}
          </div>
          <p className="reporter-update"><BookOpen size={16} /> 오늘 새 기사 5개가 도착했습니다.</p>
        </article>
      </div>
    </section>
  );
}

function CollapseButton({
  label,
  collapsed,
  onToggle,
}: {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="module-collapse-button"
      type="button"
      aria-expanded={!collapsed}
      aria-label={`${label} 모듈 ${collapsed ? "펼치기" : "접기"}`}
      onClick={onToggle}
    >
      {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
    </button>
  );
}

function ArticleAnalysisList({ analyses }: { analyses: ArticleStockAnalysis[] }) {
  if (!analyses.length) return null;

  return (
    <div className="article-analysis-list">
      {analyses.map((analysis) => {
        const stock = stockById(analysis.stockId);
        if (!stock) return null;
        return (
          <div className="article-analysis-row" key={`${analysis.stockId}-${analysis.sentiment}`}>
            <span
              className={`sentiment sentiment-${analysis.sentiment}`}
              role="img"
              aria-label={`${analysis.sentiment} 분석`}
              title={analysis.sentiment}
            >
              {SENTIMENT_EMOJI[analysis.sentiment]}
            </span>
            <strong>{stock.name}</strong>
            <span className="article-analysis-comment">{analysis.comment}</span>
          </div>
        );
      })}
    </div>
  );
}

function ArticleAnalysisSummary({ analyses }: { analyses: ArticleStockAnalysis[] }) {
  if (!analyses.length) return null;

  return (
    <div className="article-analysis-summary" aria-label={analyses.map((analysis) => `${stockById(analysis.stockId)?.name ?? "종목"} ${analysis.sentiment}`).join(", ")}>
      {analyses.map((analysis) => {
        const stock = stockById(analysis.stockId);
        if (!stock) return null;
        return (
          <span className="article-analysis-summary-item" key={`${analysis.stockId}-${analysis.sentiment}`} aria-hidden="true">
            <span>{SENTIMENT_EMOJI[analysis.sentiment]}</span>
            <strong>{stock.name}</strong>
          </span>
        );
      })}
    </div>
  );
}

function ArticleCard({
  article,
  analyses,
  showAnalysis,
  onOpen,
}: {
  article: Article;
  analyses: ArticleStockAnalysis[];
  showAnalysis: boolean;
  onOpen: () => void;
}) {
  return (
    <article className="article-card">
      <button type="button" onClick={onOpen}>
        <div className="article-copy">
          <h3>{article.title}</h3>
          {showAnalysis ? <ArticleAnalysisList analyses={analyses} /> : <ArticleAnalysisSummary analyses={analyses} />}
          <small>한경닷컴 · {article.section} · {article.date}</small>
        </div>
        <div className={`article-thumbnail thumb-${article.tone}`} aria-label="기사 썸네일">
          <Newspaper size={25} />
          <span>한경</span>
        </div>
      </button>
    </article>
  );
}

function ReportCard({ report, onOpen }: { report: Report; onOpen: () => void }) {
  const stock = stockById(report.stockId);
  return (
    <article className="report-card">
      <button type="button" onClick={onOpen}>
        <div className="report-main">
          <div className="report-meta"><span>{stock?.name}</span><span>{report.firm}</span><span>{report.date}</span></div>
          <h3>{report.title}</h3>
          <div className="report-details">
            <span>투자의견 <strong>{report.opinion}</strong></span>
            <span>목표주가 <strong>{report.target}</strong></span>
          </div>
        </div>
      </button>
    </article>
  );
}

function ContentEmpty({ type }: { type: string }) {
  return (
    <div className="content-empty">
      <FileText size={25} />
      <strong>새 {type}가 없습니다.</strong>
      <p>현재 관심그룹과 관련된 콘텐츠가 등록되면 이곳에 표시됩니다.</p>
    </div>
  );
}

function AlertRow({
  title,
  description,
  checked,
  onChange,
  icon,
  children,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={`alert-row ${checked ? "alert-row-on" : ""}`}>
      <div className="alert-row-main">
        <div className="alert-type-icon">{icon}</div>
        <div className="alert-copy"><strong>{title}</strong><p>{description}</p></div>
        <button
          className={`switch ${checked ? "switch-on" : ""}`}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${title} 알림 ${checked ? "끄기" : "켜기"}`}
          onClick={() => onChange(!checked)}
        >
          <span />
        </button>
      </div>
      {children ? <div className="alert-options">{children}</div> : null}
    </section>
  );
}
