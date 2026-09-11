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
  ChevronLeft,
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
  sentiment: "호재" | "악재" | "중립";
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
  // ==========================================
  // [국내 주식] (총 30개)
  // ==========================================
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
    issues: [
      {
        id: "issue-009150-1",
        sentiment: "호재",
        comment: "AI 가속기용 FC-BGA 기판 양산 본격화로 고부가 제품군 비중 확대",
        articleUrl: "https://www.hankyung.com/article/2026080512101",
        publishedAt: "2026.08.05 12:10",
      },
    ],
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
    issues: [
      {
        id: "issue-028260-1",
        sentiment: "중립",
        comment: "보유 그룹 계열사 지분가치 부각 속 건설부문 원가율 관리 지속",
        articleUrl: "https://www.hankyung.com/article/2026080443336",
        publishedAt: "2026.08.04 03:43",
      },
    ],
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
    id: "018260",
    name: "삼성에스디에스",
    code: "018260",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "172,000",
    change: "3,100",
    rate: 1.84,
    turnover: "64,220",
    volume: "374,210",
    high: "173,500",
    low: "168,000",
    issues: [
      {
        id: "issue-018260-1",
        sentiment: "호재",
        comment: "기업용 생성형 AI 솔루션 '브리티 코파일럿' 클라우드 고객사 30% 급증",
        articleUrl: "https://www.hankyung.com/article/2026080514101",
        publishedAt: "2026.08.05 14:10",
      },
    ],
  },
  {
    id: "000810",
    name: "삼성화재",
    code: "000810",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "364,500",
    change: "4,500",
    rate: 1.25,
    turnover: "52,340",
    volume: "143,620",
    high: "367,000",
    low: "359,000",
    issues: [
      {
        id: "issue-000810-1",
        sentiment: "호재",
        comment: "보험손익 호조 및 밸류업 계획에 따른 연간 주주환원율 40% 조기 달성 기대",
        articleUrl: "https://www.hankyung.com/article/2026080411201",
        publishedAt: "2026.08.04 11:20",
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
    issues: [
      {
        id: "issue-005380-1",
        sentiment: "중립",
        comment: "하이브리드 판매 비중 확대로 수익성 방어, 미국 관세 정책 모니터링 필요",
        articleUrl: "https://www.hankyung.com/article/2026080344426",
        publishedAt: "2026.08.03 14:20",
      },
    ],
  },
  {
    id: "000270",
    name: "기아",
    code: "000270",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "123,400",
    change: "1,800",
    rate: 1.48,
    turnover: "288,520",
    volume: "2,348,110",
    high: "124,500",
    low: "121,000",
    issues: [
      {
        id: "issue-000270-1",
        sentiment: "호재",
        comment: "분기 영업이익률 12% 유지 및 하반기 대형 전기 SUV EV9 판매 호조",
        articleUrl: "https://www.hankyung.com/article/2026080415301",
        publishedAt: "2026.08.04 15:30",
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
    id: "086790",
    name: "하나금융지주",
    code: "086790",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "72,800",
    change: "1,500",
    rate: 2.10,
    turnover: "142,500",
    volume: "1,960,300",
    high: "73,400",
    low: "71,000",
    issues: [
      {
        id: "issue-086790-1",
        sentiment: "호재",
        comment: "비이자이익 급증과 보통주 자본비율 개선으로 주주환원 여력 확대",
        articleUrl: "https://www.hankyung.com/article/2026080315201",
        publishedAt: "2026.08.03 15:20",
      },
    ],
  },
  {
    id: "316140",
    name: "우리금융지주",
    code: "316140",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "17,600",
    change: "210",
    rate: 1.21,
    turnover: "88,400",
    volume: "5,042,300",
    high: "17,800",
    low: "17,350",
    issues: [
      {
        id: "issue-316140-1",
        sentiment: "호재",
        comment: "증권사 인수로 비은행 포트폴리오 완성, 시너지 본격화 전망",
        articleUrl: "https://www.hankyung.com/article/2026080316001",
        publishedAt: "2026.08.03 16:00",
      },
    ],
  },
  {
    id: "003550",
    name: "LG",
    code: "003550",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "85,600",
    change: "900",
    rate: 1.06,
    turnover: "63,200",
    volume: "740,100",
    high: "86,400",
    low: "84,700",
    issues: [
      {
        id: "issue-003550-1",
        sentiment: "중립",
        comment: "주요 계열사 배당금 유입 안정적, 5천억 자사주 매입 순항 중",
        articleUrl: "https://www.hankyung.com/article/2026080417101",
        publishedAt: "2026.08.04 17:10",
      },
    ],
  },
  {
    id: "017670",
    name: "SK텔레콤",
    code: "017670",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "58,400",
    change: "400",
    rate: 0.69,
    turnover: "48,900",
    volume: "839,200",
    high: "58,800",
    low: "57,900",
    issues: [
      {
        id: "issue-017670-1",
        sentiment: "호재",
        comment: "AI 데이터센터 신사업 매출 가시화와 연 6%대 안정적 배당 매력",
        articleUrl: "https://www.hankyung.com/article/2026080509301",
        publishedAt: "2026.08.05 09:30",
      },
    ],
  },
  {
    id: "030200",
    name: "KT",
    code: "030200",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "43,200",
    change: "200",
    rate: 0.47,
    turnover: "39,100",
    volume: "906,400",
    high: "43,600",
    low: "42,800",
    issues: [
      {
        id: "issue-030200-1",
        sentiment: "중립",
        comment: "통신 본업의 안정적 현금흐름 유지, 마이크로소프트와의 AI 협력 기대",
        articleUrl: "https://www.hankyung.com/article/2026080510101",
        publishedAt: "2026.08.05 10:10",
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
    issues: [
      {
        id: "issue-035420-1",
        sentiment: "호재",
        comment: "사우디 디지털 트윈 및 소버린 AI 글로벌 수주 실적 가시화",
        articleUrl: "https://www.hankyung.com/article/2026080515301",
        publishedAt: "2026.08.05 15:30",
      },
    ],
  },
  {
    id: "035720",
    name: "카카오",
    code: "035720",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "46,800",
    change: "850",
    rate: -1.78,
    turnover: "115,400",
    volume: "2,450,200",
    high: "48,100",
    low: "46,500",
    issues: [
      {
        id: "issue-035720-1",
        sentiment: "악재",
        comment: "사법 리스크 지속 및 신규 AI 서비스 전환에 따른 마케팅 비용 증가",
        articleUrl: "https://www.hankyung.com/article/2026080414101",
        publishedAt: "2026.08.04 14:10",
      },
    ],
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
    id: "005490",
    name: "POSCO홀딩스",
    code: "005490",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "375,000",
    change: "4,500",
    rate: 1.21,
    turnover: "184,300",
    volume: "492,000",
    high: "379,000",
    low: "371,500",
    issues: [
      {
        id: "issue-005490-1",
        sentiment: "호재",
        comment: "철강 업황 바닥 통과 기대감과 아르헨티나 리튬 염호 1단계 상업 생산 돌입",
        articleUrl: "https://www.hankyung.com/article/2026080516401",
        publishedAt: "2026.08.05 16:40",
      },
    ],
  },
  {
    id: "012330",
    name: "현대모비스",
    code: "012330",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "248,000",
    change: "3,500",
    rate: 1.43,
    turnover: "92,100",
    volume: "372,400",
    high: "250,500",
    low: "244,000",
    issues: [
      {
        id: "issue-012330-1",
        sentiment: "호재",
        comment: "전동화 부품 핵심 마진 흑자 전환과 글로벌 OEM 대상 논캡티브 수주 확대",
        articleUrl: "https://www.hankyung.com/article/2026080410201",
        publishedAt: "2026.08.04 10:20",
      },
    ],
  },
  {
    id: "068270",
    name: "셀트리온",
    code: "068270",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "192,500",
    change: "2,200",
    rate: 1.16,
    turnover: "163,800",
    volume: "852,100",
    high: "194,800",
    low: "189,500",
    issues: [
      {
        id: "issue-068270-1",
        sentiment: "호재",
        comment: "미국 짐펜트라(피하주사 제형) 주요 처방집(PBM) 등재 완료로 실적 고성장",
        articleUrl: "https://www.hankyung.com/article/2026080409151",
        publishedAt: "2026.08.04 09:15",
      },
    ],
  },
  {
    id: "024110",
    name: "기업은행",
    code: "024110",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "15,450",
    change: "180",
    rate: 1.18,
    turnover: "31,200",
    volume: "2,024,000",
    high: "15,600",
    low: "15,250",
    issues: [
      {
        id: "issue-024110-1",
        sentiment: "호재",
        comment: "중소기업 대출 건전성 관리 안정화와 연 7%대 높은 배당수익률 지속",
        articleUrl: "https://www.hankyung.com/article/2026080517201",
        publishedAt: "2026.08.05 17:20",
      },
    ],
  },
  {
    id: "033780",
    name: "KT&G",
    code: "033780",
    market: "KOSPI",
    marketType: "DOMESTIC",
    currency: "KRW",
    price: "108,500",
    change: "1,200",
    rate: 1.12,
    turnover: "44,600",
    volume: "412,000",
    high: "109,200",
    low: "107,000",
    issues: [
      {
        id: "issue-033780-1",
        sentiment: "호재",
        comment: "글로벌 궐련형 전자담배(NGP) 해외 수출 성장 및 3개년 1조8천억 주주환원",
        articleUrl: "https://www.hankyung.com/article/2026080518001",
        publishedAt: "2026.08.05 18:00",
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

  // ==========================================
  // [미국 주식] (총 28개)
  // ==========================================
  {
    id: "AAPL",
    name: "애플",
    code: "AAPL",
    ticker: "AAPL",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$232.14",
    change: "$2.86",
    rate: 1.25,
    turnover: "6,420,100",
    volume: "48,210,300",
    high: "$233.50",
    low: "$229.80",
    issues: [
      {
        id: "issue-aapl-1",
        sentiment: "호재",
        comment: "애플 인텔리전스(AI) 탑재 아이폰16 교체 슈퍼사이클 가속화",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/aapl",
        publishedAt: "2026.08.05 07:10",
      },
    ],
  },
  {
    id: "MSFT",
    name: "마이크로소프트",
    code: "MSFT",
    ticker: "MSFT",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$448.20",
    change: "$5.40",
    rate: 1.22,
    turnover: "5,890,200",
    volume: "21,430,200",
    high: "$451.00",
    low: "$444.10",
    issues: [
      {
        id: "issue-msft-1",
        sentiment: "호재",
        comment: "애저(Azure) 클라우드 AI 매출 비중 12% 돌파로 성장 가속",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/msft",
        publishedAt: "2026.08.05 06:40",
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
    id: "AMZN",
    name: "아마존닷컴",
    code: "AMZN",
    ticker: "AMZN",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$198.45",
    change: "$3.15",
    rate: 1.61,
    turnover: "4,120,500",
    volume: "35,110,800",
    high: "$200.20",
    low: "$196.10",
    issues: [
      {
        id: "issue-amzn-1",
        sentiment: "호재",
        comment: "AWS 클라우드 영업이익률 38% 사상 최고치 경신 및 커머스 배송 효율 극대화",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/amzn",
        publishedAt: "2026.08.04 08:30",
      },
    ],
  },
  {
    id: "GOOGL",
    name: "알파벳 A",
    code: "GOOGL",
    ticker: "GOOGL",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$176.80",
    change: "$1.40",
    rate: 0.80,
    turnover: "3,650,400",
    volume: "24,800,200",
    high: "$178.50",
    low: "$175.20",
    issues: [
      {
        id: "issue-googl-1",
        sentiment: "중립",
        comment: "구글 검색 점유율 견고하나 검색 반독점 소송 관련 법원 판결 불확실성 상존",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/googl",
        publishedAt: "2026.08.04 07:15",
      },
    ],
  },
  {
    id: "META",
    name: "메타 플랫폼스",
    code: "META",
    ticker: "META",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$568.20",
    change: "$12.40",
    rate: 2.23,
    turnover: "4,950,200",
    volume: "14,200,800",
    high: "$572.00",
    low: "$559.00",
    issues: [
      {
        id: "issue-meta-1",
        sentiment: "호재",
        comment: "오픈소스 LLM '라마 4' 기반 AI 광고 타겟팅 솔루션 전환율 급증",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/meta",
        publishedAt: "2026.08.05 06:10",
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
    id: "AVGO",
    name: "브로드컴",
    code: "AVGO",
    ticker: "AVGO",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$168.90",
    change: "$3.50",
    rate: 2.12,
    turnover: "3,820,100",
    volume: "18,920,000",
    high: "$171.00",
    low: "$166.20",
    issues: [
      {
        id: "issue-avgo-1",
        sentiment: "호재",
        comment: "글로벌 하이퍼스케일러 맞춤형 AI ASIC 칩 및 이더넷 네트워킹 수주 폭증",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/avgo",
        publishedAt: "2026.08.05 08:20",
      },
    ],
  },
  {
    id: "ORCL",
    name: "오라클",
    code: "ORCL",
    ticker: "ORCL",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$172.40",
    change: "$4.10",
    rate: 2.44,
    turnover: "2,150,000",
    volume: "12,400,000",
    high: "$174.50",
    low: "$169.80",
    issues: [
      {
        id: "issue-orcl-1",
        sentiment: "호재",
        comment: "멀티클라우드 데이터베이스 파트너십 확대로 OCI(오라클 클라우드) 수주 잔고 급증",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/orcl",
        publishedAt: "2026.08.04 12:40",
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
    id: "AMD",
    name: "AMD",
    code: "AMD",
    ticker: "AMD",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$145.60",
    change: "$4.20",
    rate: 2.97,
    turnover: "3,210,000",
    volume: "42,100,000",
    high: "$147.20",
    low: "$142.10",
    issues: [
      {
        id: "issue-amd-1",
        sentiment: "호재",
        comment: "MI325X AI 가속기 클라우드 고객사 납품 본격화로 데이터센터 매출 비중 확대",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/amd",
        publishedAt: "2026.08.04 18:00",
      },
    ],
  },
  {
    id: "PLTR",
    name: "팔란티어 테크놀로지스",
    code: "PLTR",
    ticker: "PLTR",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$58.70",
    change: "$3.10",
    rate: 5.58,
    turnover: "2,840,000",
    volume: "65,300,000",
    high: "$59.80",
    low: "$56.10",
    issues: [
      {
        id: "issue-pltr-1",
        sentiment: "호재",
        comment: "AIP(인공지능 플랫폼) 미국 민간 기업 부문 고객 계약 수 분기 기준 83% 급증",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/pltr",
        publishedAt: "2026.08.05 05:40",
      },
    ],
  },
  {
    id: "JNJ",
    name: "존슨 앤드 존슨",
    code: "JNJ",
    ticker: "JNJ",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$162.80",
    change: "$0.90",
    rate: 0.56,
    turnover: "940,000",
    volume: "7,800,000",
    high: "$163.50",
    low: "$161.90",
    issues: [
      {
        id: "issue-jnj-1",
        sentiment: "호재",
        comment: "63년 연속 배당 증액 달성 및 항암 치료제 포트폴리오 매출 안정적 성장",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/jnj",
        publishedAt: "2026.08.04 11:00",
      },
    ],
  },
  {
    id: "PG",
    name: "프록터 앤드 갬블",
    code: "PG",
    ticker: "PG",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$171.40",
    change: "$1.10",
    rate: 0.65,
    turnover: "1,120,000",
    volume: "6,400,000",
    high: "$172.30",
    low: "$170.10",
    issues: [
      {
        id: "issue-pg-1",
        sentiment: "중립",
        comment: "필수소비재 가격 결정력으로 인플레이션 방어, 68년 연속 배당왕 유지",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/pg",
        publishedAt: "2026.08.03 14:10",
      },
    ],
  },
  {
    id: "KO",
    name: "코카콜라",
    code: "KO",
    ticker: "KO",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$68.90",
    change: "$0.40",
    rate: 0.58,
    turnover: "890,000",
    volume: "13,200,000",
    high: "$69.20",
    low: "$68.50",
    issues: [
      {
        id: "issue-ko-1",
        sentiment: "호재",
        comment: "북미 및 신흥국 음료 판매량 호조, 62년 연속 배당 인상 기록",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/ko",
        publishedAt: "2026.08.04 16:30",
      },
    ],
  },
  {
    id: "PEP",
    name: "펩시코",
    code: "PEP",
    ticker: "PEP",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$174.20",
    change: "$0.80",
    rate: 0.46,
    turnover: "780,000",
    volume: "4,900,000",
    high: "$175.10",
    low: "$173.40",
    issues: [
      {
        id: "issue-pep-1",
        sentiment: "중립",
        comment: "스낵 부문 글로벌 판매 안정세, 52년 연속 배당 귀족주 매력 부각",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/pep",
        publishedAt: "2026.08.03 11:20",
      },
    ],
  },
  {
    id: "MCD",
    name: "맥도날드",
    code: "MCD",
    ticker: "MCD",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$298.50",
    change: "$1.80",
    rate: 0.61,
    turnover: "910,000",
    volume: "3,100,000",
    high: "$300.00",
    low: "$296.80",
    issues: [
      {
        id: "issue-mcd-1",
        sentiment: "호재",
        comment: "가성비 세트 메뉴 프로모션 성공으로 글로벌 동일 매장 매출 반등",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/mcd",
        publishedAt: "2026.08.05 13:00",
      },
    ],
  },
  {
    id: "O",
    name: "리얼티 인컴",
    code: "O",
    ticker: "O",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$54.20",
    change: "$0.65",
    rate: 1.21,
    turnover: "620,000",
    volume: "8,900,000",
    high: "$54.80",
    low: "$53.60",
    issues: [
      {
        id: "issue-o-1",
        sentiment: "호재",
        comment: "월배당 650회 연속 지급 기념 배당금 상향 및 임대율 98.6% 유지",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/o",
        publishedAt: "2026.08.04 09:40",
      },
    ],
  },
  {
    id: "ABBV",
    name: "애브비",
    code: "ABBV",
    ticker: "ABBV",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$188.60",
    change: "$2.10",
    rate: 1.13,
    turnover: "1,050,000",
    volume: "5,800,000",
    high: "$189.50",
    low: "$186.70",
    issues: [
      {
        id: "issue-abbv-1",
        sentiment: "호재",
        comment: "면역질환 신약 린버크와 스카이리치 매출이 휴미라 특허 만료 충격 완벽 흡수",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/abbv",
        publishedAt: "2026.08.04 14:00",
      },
    ],
  },
  {
    id: "CVX",
    name: "셰브론",
    code: "CVX",
    ticker: "CVX",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$154.20",
    change: "$1.20",
    rate: 0.78,
    turnover: "870,000",
    volume: "6,200,000",
    high: "$155.50",
    low: "$153.10",
    issues: [
      {
        id: "issue-cvx-1",
        sentiment: "중립",
        comment: "국제유가 박스권 속에서도 견고한 잉여현금흐름으로 37년 연속 배당 인상",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/cvx",
        publishedAt: "2026.08.03 17:30",
      },
    ],
  },
  {
    id: "XOM",
    name: "엑슨모빌",
    code: "XOM",
    ticker: "XOM",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$118.40",
    change: "$0.90",
    rate: 0.77,
    turnover: "1,340,000",
    volume: "12,100,000",
    high: "$119.50",
    low: "$117.60",
    issues: [
      {
        id: "issue-xom-1",
        sentiment: "호재",
        comment: "파이오니어 내추럴 리소시스 합병 시너지로 퍼미안 분지 생산 원가 20% 절감",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/xom",
        publishedAt: "2026.08.04 08:50",
      },
    ],
  },
  {
    id: "JPM",
    name: "JP모건 체이스",
    code: "JPM",
    ticker: "JPM",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$224.50",
    change: "$3.10",
    rate: 1.40,
    turnover: "1,890,000",
    volume: "8,900,000",
    high: "$226.00",
    low: "$221.80",
    issues: [
      {
        id: "issue-jpm-1",
        sentiment: "호재",
        comment: "투자은행(IB) 수수료 수익 40% 반등 및 순이자이익 상향 가이던스 발표",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/jpm",
        publishedAt: "2026.08.05 07:45",
      },
    ],
  },
  {
    id: "WMT",
    name: "월마트",
    code: "WMT",
    ticker: "WMT",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$78.40",
    change: "$0.80",
    rate: 1.03,
    turnover: "1,450,000",
    volume: "18,400,000",
    high: "$79.20",
    low: "$77.80",
    issues: [
      {
        id: "issue-wmt-1",
        sentiment: "호재",
        comment: "이커머스 및 광고 사업부 고성장으로 연간 실적 전망치 상향 조정",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/wmt",
        publishedAt: "2026.08.05 11:15",
      },
    ],
  },
  {
    id: "COST",
    name: "코스트코 홀세일",
    code: "COST",
    ticker: "COST",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$896.50",
    change: "$8.20",
    rate: 0.92,
    turnover: "1,220,000",
    volume: "1,800,000",
    high: "$902.00",
    low: "$889.00",
    issues: [
      {
        id: "issue-cost-1",
        sentiment: "호재",
        comment: "연회비 인상 이후에도 멤버십 갱신율 93% 유지하며 강력한 락인 효과 입증",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/cost",
        publishedAt: "2026.08.04 16:50",
      },
    ],
  },
  {
    id: "LLY",
    name: "일라이 릴리",
    code: "LLY",
    ticker: "LLY",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$942.30",
    change: "$18.50",
    rate: 2.00,
    turnover: "3,110,000",
    volume: "2,950,000",
    high: "$948.00",
    low: "$926.00",
    issues: [
      {
        id: "issue-lly-1",
        sentiment: "호재",
        comment: "비만치료제 마운자로와 젭바운드 글로벌 공급 확대 및 심혈관 질환 적응증 추가",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/lly",
        publishedAt: "2026.08.05 06:30",
      },
    ],
  },
  {
    id: "NVO",
    name: "노보 노디스크",
    code: "NVO",
    ticker: "NVO",
    market: "뉴욕",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$136.20",
    change: "$1.80",
    rate: 1.34,
    turnover: "2,450,000",
    volume: "16,200,000",
    high: "$137.80",
    low: "$134.50",
    issues: [
      {
        id: "issue-nvo-1",
        sentiment: "호재",
        comment: "위고비 유럽 및 아시아 공급 개시로 글로벌 GLP-1 비만약 점유율 1위 수성",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/nvo",
        publishedAt: "2026.08.04 15:10",
      },
    ],
  },
  {
    id: "QCOM",
    name: "퀄컴",
    code: "QCOM",
    ticker: "QCOM",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$174.50",
    change: "$2.60",
    rate: 1.51,
    turnover: "1,980,000",
    volume: "9,400,000",
    high: "$176.20",
    low: "$172.10",
    issues: [
      {
        id: "issue-qcom-1",
        sentiment: "호재",
        comment: "온디바이스 AI PC용 스냅드래곤 X 엘리트 탑재 노트북 판매 호조",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/qcom",
        publishedAt: "2026.08.05 10:40",
      },
    ],
  },
  {
    id: "INTC",
    name: "인텔",
    code: "INTC",
    ticker: "INTC",
    market: "나스닥",
    marketType: "OVERSEAS",
    currency: "USD",
    price: "$21.40",
    change: "$0.85",
    rate: -3.82,
    turnover: "2,890,000",
    volume: "88,200,000",
    high: "$22.50",
    low: "$20.90",
    issues: [
      {
        id: "issue-intc-1",
        sentiment: "악재",
        comment: "파운드리 대규모 영업손실 및 실적 회복 지연으로 구조조정 속도",
        articleUrl: "https://www.hankyung.com/globalmarket/equities/americas/intc",
        publishedAt: "2026.08.03 08:10",
      },
    ],
  },
];

// ==========================================
// [관심그룹 5개 정의]
// 그룹1: 국내증권 (12개)
// 그룹2: 국내증권 (10개)
// 그룹3: 국내증권 + 미국주식 (12개)
// 그룹4: 미국주식 (12개)
// 그룹5: 미국주식 (10개)
// ==========================================
const INITIAL_GROUPS: WatchGroup[] = [
  {
    id: "group-ai-mobility",
    name: "AI & 모빌리티",
    stockIds: [
      "005930", // 삼성전자 (국내)
      "000660", // SK하이닉스 (국내)
      "042700", // 한미반도체 (국내)
      "005380", // 현대차 (국내)
      "012330", // 현대모비스 (국내)
      "035420", // NAVER (국내)
      "NVDA",   // 엔비디아 (미국)
      "TSLA",   // 테슬라 (미국)
      "MSFT",   // 마이크로소프트 (미국)
      "GOOGL",  // 알파벳 (미국)
      "AVGO",   // 브로드컴 (미국)
      "AMD",    // AMD (미국)
    ],
  },
  {
    id: "group-samsung",
    name: "쨰드래곤만믿고가는삼성몰빵",
    stockIds: [
      "005930", // 삼성전자
      "005935", // 삼성전자우
      "009150", // 삼성전기
      "006400", // 삼성SDI
      "032830", // 삼성생명
      "028260", // 삼성물산
      "010140", // 삼성중공업
      "207940", // 삼성바이오로직스
      "018260", // 삼성에스디에스
      "000810", // 삼성화재
      "000660", // SK하이닉스
      "042700", // 한미반도체
    ],
  },
  {
    id: "group-valueup",
    name: "코스피 밸류업 & 고배당",
    stockIds: [
      "105560", // KB금융
      "055550", // 신한지주
      "086790", // 하나금융지주
      "316140", // 우리금융지주
      "024110", // 기업은행
      "005380", // 현대차
      "000270", // 기아
      "003550", // LG
      "017670", // SK텔레콤
      "033780", // KT&G
    ],
  },
  {
    id: "group-us-mag7",
    name: "미국 빅테크 & AI 리더스",
    stockIds: [
      "AAPL",   // 애플
      "MSFT",   // 마이크로소프트
      "NVDA",   // 엔비디아
      "AMZN",   // 아마존닷컴
      "GOOGL",  // 알파벳 A
      "META",   // 메타
      "TSLA",   // 테슬라
      "AVGO",   // 브로드컴
      "ORCL",   // 오라클
      "CRM",    // 세일즈포스
      "PLTR",   // 팔란티어
      "AMD",    // AMD
    ],
  },
  {
    id: "group-us-dividend",
    name: "월가 배당귀족 & 방어주",
    stockIds: [
      "JNJ",    // 존슨앤드존슨
      "PG",     // 프록터앤드갬블
      "KO",     // 코카콜라
      "PEP",    // 펩시코
      "MCD",    // 맥도날드
      "O",      // 리얼티 인컴
      "ABBV",   // 애브비
      "CVX",    // 셰브론
      "JPM",    // JP모건 체이스
      "COST",   // 코스트코
    ],
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
    id: "article-7",
    stockIds: ["105560", "055550", "086790"],
    title: "주주환원 확대 나선 금융주…배당 매력 다시 부각",
    date: "2026.08.02 11:04",
    section: "증권",
    tone: "purple",
    stockAnalyses: [
      { stockId: "105560", sentiment: "긍정", comment: "안정적인 이익과 주주환원 확대가 배당 매력을 높이는 요인으로 부각됐습니다." },
      { stockId: "055550", sentiment: "긍정", comment: "자본비율 개선과 배당 확대가 주주환원 정책의 지속 가능성을 높였습니다." },
      { stockId: "086790", sentiment: "긍정", comment: "자사주 매입 소각 확대 의지로 밸류업 프로그램 선두 평가를 받았습니다." },
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
  {
    id: "article-nvda-rally",
    stockIds: ["NVDA", "MSFT", "AAPL"],
    title: "빅테크 AI 자본지출 경쟁 재점화…엔비디아·MS 동반 랠리",
    date: "2026.08.06 06:20",
    section: "글로벌",
    tone: "navy",
    stockAnalyses: [
      { stockId: "NVDA", sentiment: "긍정", comment: "차세대 블랙웰 칩 대량 양산 및 데이터센터 매출 폭증 기대가 지속되고 있습니다." },
      { stockId: "MSFT", sentiment: "긍정", comment: "애저 클라우드 성장률 가속화로 소프트웨어 AI 상용화 선두 지위가 공고해졌습니다." },
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
  {
    id: "report-14",
    stockId: "NVDA",
    firm: "골드만삭스",
    title: "블랙웰 GPU 생산 확대와 데이터센터 AI 수익성",
    date: "2026.08.05",
    opinion: "매수",
    target: "$210.00",
  },
  {
    id: "report-15",
    stockId: "AAPL",
    firm: "모건스탠리",
    title: "애플 인텔리전스가 주도하는 아이폰 교체 사이클",
    date: "2026.08.04",
    opinion: "매수",
    target: "$265.00",
  },
  {
    id: "report-16",
    stockId: "MSFT",
    firm: "JP모건",
    title: "클라우드와 AI 코파일럿의 복합 시너지",
    date: "2026.08.03",
    opinion: "매수",
    target: "$510.00",
  },
  {
    id: "report-17",
    stockId: "TSLA",
    firm: "웨드부시",
    title: "FSD 라이선싱과 로보택시가 이끌 차세대 모멘텀",
    date: "2026.08.02",
    opinion: "매수",
    target: "$400.00",
  },
  {
    id: "report-18",
    stockId: "005380",
    firm: "메리츠증권",
    title: "하이브리드 믹스 개선과 탄탄한 주주환원",
    date: "2026.08.04",
    opinion: "매수",
    target: "$360,000원",
  },
  {
    id: "report-19",
    stockId: "KO",
    firm: "뱅크오브아메리카",
    title: "글로벌 필수소비재 가격 탄력성과 지속가능한 배당",
    date: "2026.08.03",
    opinion: "매수",
    target: "$78.00",
  },
  {
    id: "report-20",
    stockId: "JNJ",
    firm: "씨티그룹",
    title: "소송 불확실성 해소 국면과 제약 파이프라인 가치",
    date: "2026.08.01",
    opinion: "매수",
    target: "$185.00",
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
  const [expandAllIssues, setExpandAllIssues] = useState(false);
  const [issueOverrides, setIssueOverrides] = useState<Record<string, boolean>>({});

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
    showToast(`${stock.name}을(를) 관심종목에서 해제했습니다.`);
  };

  const [draggedStockIndex, setDraggedStockIndex] = useState<number | null>(null);
  const [dragOverStockIndex, setDragOverStockIndex] = useState<number | null>(null);

  const reorderStocksInSelectedGroup = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const targetGroup = groups.find((g) => g.id === selectedGroupId);
    if (!targetGroup) return;

    const nextStockIds = [...targetGroup.stockIds];
    const [moved] = nextStockIds.splice(fromIndex, 1);
    nextStockIds.splice(toIndex, 0, moved);

    setGroups((current) =>
      current.map((g) =>
        g.id === selectedGroupId ? { ...g, stockIds: nextStockIds } : g,
      ),
    );
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
            <section className="watchlist-page recent-watchlist-page">
              {/* 상단 타이틀바 (최근 본 기사 동일 규격: h1 + p + 우측 날짜/알림 버튼) */}
              <div className="watchlist-titlebar recent-page-titlebar">
                <div>
                  <h1>관심종목</h1>
                  <p>관심 있는 종목의 실시간 흐름과 한경 AI 포인트 뷰·증권사 리포트를 확인하세요.</p>
                </div>
              </div>

              {/* 1. 관심그룹 세그먼트 모듈 (.recent-module) */}
              <section className="recent-module watchlist-group-module" aria-label="관심그룹 선택 및 관리">
                <div className="watchlist-group-bar">
                  <div className="watchlist-group-tabs" role="tablist" aria-label="관심그룹">
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        role="tab"
                        aria-selected={group.id === selectedGroup.id}
                        className={`watchlist-group-tab ${group.id === selectedGroup.id ? "active" : ""}`}
                        onClick={() => chooseGroup(group.id)}
                      >
                        <span className="group-tab-name">{group.name}</span>
                        <span className="group-tab-count">{group.stockIds.length}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="watchlist-group-manage-btn"
                    type="button"
                    onClick={openManageDialog}
                    aria-label="관심그룹 설정 및 관리"
                    title="관심그룹 관리"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </section>



              {/* 3. 관심종목 통합 리스트 모듈 (.recent-module) */}
              <section className="recent-module watchlist-list-module" aria-label="관심종목 리스트">
                <div className="recent-module-heading watchlist-list-heading">
                  <div className="watchlist-heading-left">
                    <span className="watchlist-total-count">총 <strong>{selectedGroupStocks.length}</strong>개 종목</span>
                  </div>
                  <div className="watchlist-heading-actions">
                    <button
                      type="button"
                      className="watchlist-toggle-btn"
                      onClick={() => {
                        const next = !expandAllIssues;
                        setExpandAllIssues(next);
                        setIssueOverrides({});
                      }}
                      aria-label={expandAllIssues ? "모든 종목 접기" : "모든 종목 펼치기"}
                    >
                      {expandAllIssues ? "접기" : "펼치기"}
                    </button>
                    <button
                      className="watchlist-add-stock-btn"
                      type="button"
                      onClick={openAddDialog}
                      aria-label="현재 그룹에 종목 추가"
                    >
                      <Plus size={16} />
                      <span>종목 추가</span>
                    </button>
                  </div>
                </div>

                {selectedGroupStocks.length ? (
                  <div className="watchlist-strip-list" role="list">
                    {selectedGroupStocks.map((stock, index) => {
                      const direction = stock.rate > 0 ? "up" : stock.rate < 0 ? "down" : "flat";
                      const detailUrl = getStockDetailUrl(stock);
                      const issues = (stock.issues || []).slice(0, 5);
                      const posIssuesCount = (stock.issues || []).filter((i) => i.sentiment === "호재").length;
                      const negIssuesCount = (stock.issues || []).filter((i) => i.sentiment === "악재").length;
                      const neutralIssuesCount = (stock.issues || []).filter((i) => i.sentiment === "중립").length;
                      const stockReports = REPORTS.filter((r) => r.stockId === stock.id);
                      const displayReports = stockReports.slice(0, 1);
                      const totalReportsCount = stockReports.length;
                      const hasSubContent = issues.length > 0 || stockReports.length > 0;
                      const isExpanded = hasSubContent && (issueOverrides[stock.id] ?? expandAllIssues);
                      const displayPrice = stock.currency === "USD" ? stock.price : `${stock.price}원`;
                      const displayChange = stock.currency === "USD" ? stock.change : `${stock.change}원`;

                      const isDragging = draggedStockIndex === index;
                      const isDragOver = dragOverStockIndex === index;

                      const toggleItem = () => {
                        if (hasSubContent) {
                          setIssueOverrides((prev) => ({
                            ...prev,
                            [stock.id]: !isExpanded,
                          }));
                        }
                      };

                      // 0개인 항목은 제외하고 1개 이상인 항목만 구성 (A안: 직관적인 표정 이모지 + 리포트 표기)
                      const summaryItems: { id: string; icon?: string; label: string; count: number; className: string }[] = [];
                      if (posIssuesCount > 0) {
                        summaryItems.push({ id: "pos", icon: "🙂", label: "호재", count: posIssuesCount, className: "badge-pos" });
                      }
                      if (negIssuesCount > 0) {
                        summaryItems.push({ id: "neg", icon: "🙁", label: "악재", count: negIssuesCount, className: "badge-neg" });
                      }
                      if (neutralIssuesCount > 0) {
                        summaryItems.push({ id: "neutral", icon: "😐", label: "중립", count: neutralIssuesCount, className: "badge-neutral" });
                      }
                      if (totalReportsCount > 0) {
                        summaryItems.push({ id: "report", label: "리포트", count: totalReportsCount, className: "badge-report" });
                      }

                      return (
                        <div
                          key={stock.id}
                          className={`watchlist-item-wrapper ${isExpanded ? "expanded" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "dragover" : ""}`}
                          draggable
                          onDragStart={(e) => {
                            setDraggedStockIndex(index);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", `${index}`);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            if (dragOverStockIndex !== index) {
                              setDragOverStockIndex(index);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverStockIndex === index) {
                              setDragOverStockIndex(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedStockIndex !== null && draggedStockIndex !== index) {
                              reorderStocksInSelectedGroup(draggedStockIndex, index);
                            }
                            setDraggedStockIndex(null);
                            setDragOverStockIndex(null);
                          }}
                          onDragEnd={() => {
                            setDraggedStockIndex(null);
                            setDragOverStockIndex(null);
                          }}
                        >
                          {/* 메인 종목 스트립 행 */}
                          <div
                            className="watchlist-strip-row"
                            onClick={toggleItem}
                            role="button"
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleItem();
                              }
                            }}
                          >
                            <div className="strip-col-left">
                              <div
                                className="watchlist-drag-grip"
                                title="드래그하여 순서 변경"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical size={16} />
                              </div>
                              <button
                                type="button"
                                className="watchlist-fav-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeStockFromSelectedGroup(stock);
                                }}
                                aria-label={`${stock.name} 관심종목 해제`}
                                title="관심종목 해제"
                              >
                                <Star size={16} className="star-filled" />
                              </button>
                              <div className="strip-identity">
                                <a
                                  href={detailUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="strip-stock-name"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {stock.name}
                                </a>
                                <span className="strip-stock-meta">
                                  {stock.code} · {stock.market}
                                  {stock.marketType === "OVERSEAS" ? (
                                    <span className="market-pill-overseas">해외</span>
                                  ) : null}
                                </span>
                              </div>
                            </div>

                            {/* 시세 컬럼 (가격 / 등락폭 / 등락률 세로열 정렬) */}
                            <div className="strip-col-price">
                              <span className="price-number">{displayPrice}</span>
                            </div>
                            <div className={`strip-col-diff rate-${direction}`}>
                              <span className="rate-diff-val">
                                {stock.rate > 0 ? "+" : ""}{displayChange}
                              </span>
                            </div>
                            <div className={`strip-col-rate rate-${direction}`}>
                              <span className="rate-percent-val">
                                {stock.rate > 0 ? "▲" : stock.rate < 0 ? "▼" : ""}{formatRate(stock.rate)}
                              </span>
                            </div>

                            {/* 우측: 0개가 아닌 항목만 노출되는 호재/악재/중립/리포트 배지 & 펼침 아이콘 */}
                            <div className="strip-col-right">
                              {summaryItems.length > 0 ? (
                                <div className="strip-summary-meta">
                                  {summaryItems.map((item) => (
                                    <span
                                      key={item.id}
                                      className={`summary-badge ${item.className}`}
                                      title={`${item.label} ${item.count}개`}
                                      aria-label={`${item.label} ${item.count}개`}
                                    >
                                      {item.icon ? (
                                        <span className="summary-badge-icon" aria-hidden="true">{item.icon}</span>
                                      ) : (
                                        <span className="summary-badge-text">{item.label}</span>
                                      )}
                                      <strong>{item.count}</strong>
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              {hasSubContent ? (
                                <span className={`strip-chevron ${isExpanded ? "open" : ""}`} aria-hidden="true">
                                  <ChevronDown size={16} />
                                </span>
                              ) : <span className="strip-chevron-spacer" />}
                            </div>
                          </div>

                          {/* 하위 펼침 인텔리전스 (포인트뷰 & 리포트를 한 묶음으로 세로 배열) */}
                          {isExpanded ? (
                            <div className="watchlist-sub-panel">
                              <div className="watchlist-intelligence-stream">
                                {/* 1. AI 포인트 뷰 항목들 (글자 없이 아이콘 이모지만으로 표시) */}
                                {issues.map((issue) => {
                                  const sentimentClass =
                                    issue.sentiment === "호재"
                                      ? "tag-pos"
                                      : issue.sentiment === "악재"
                                      ? "tag-neg"
                                      : "tag-neutral";
                                  const emoji =
                                    issue.sentiment === "호재"
                                      ? "🙂"
                                      : issue.sentiment === "악재"
                                      ? "🙁"
                                      : "😐";
                                  return (
                                    <div key={issue.id} className="stream-row stream-issue-row">
                                      <span
                                        className={`sentiment-tag ${sentimentClass} sentiment-tag-icon-only`}
                                        title={issue.sentiment}
                                        aria-label={issue.sentiment}
                                      >
                                        <span className="tag-emoji" aria-hidden="true">{emoji}</span>
                                      </span>
                                      <a
                                        href={issue.articleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="stream-link"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {issue.comment}
                                      </a>
                                      {issue.publishedAt ? (
                                        <span className="stream-date">{issue.publishedAt}</span>
                                      ) : null}
                                    </div>
                                  );
                                })}

                                {/* 2. 리포트 항목: [리포트] 매수 / 리포트명 / 목표가 / 증권사명 ... (우측 끝에 작성일) */}
                                {displayReports.map((report) => (
                                  <div key={report.id} className="stream-row stream-report-row">
                                    <span className="sentiment-tag tag-report">
                                      리포트
                                    </span>
                                    <a
                                      href="https://markets.hankyung.com/consensus/view/651320"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="stream-link stream-link-report"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className={`report-opinion-text op-${report.opinion === "매수" ? "buy" : "hold"}`}>
                                        {report.opinion}
                                      </span>
                                      <span className="report-title-text">{report.title}</span>
                                      <span className="report-target-text">목표가 {report.target}</span>
                                      <span className="report-firm-text">{report.firm}</span>
                                    </a>
                                    {report.date ? (
                                      <span className="stream-date">{report.date}</span>
                                    ) : null}
                                  </div>
                                ))}

                                {issues.length === 0 && displayReports.length === 0 ? (
                                  <p className="sub-empty-text">등록된 인텔리전스 및 리포트가 없습니다.</p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-panel">
                    <Star size={26} />
                    <strong>등록된 관심종목이 없습니다.</strong>
                    <p>상단의 '+ 종목 추가' 버튼을 눌러 관심 있는 종목을 등록해보세요.</p>
                  </div>
                )}
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
            {/* 1. 관심그룹 선택 (현재 그룹은 필수 포함/해제 불가) */}
            <section className="add-dialog-section">
              <div className="add-section-label">관심그룹</div>
              <div className="add-group-checklist" aria-label="종목을 저장할 관심그룹">
                {groups.map((group) => {
                  const isCurrentGroup = group.id === selectedGroupId;
                  const checked = addTargetGroupIds.includes(group.id);
                  return (
                    <label
                      key={group.id}
                      className={`add-group-option ${checked ? "add-group-option-checked" : ""} ${isCurrentGroup ? "add-group-option-current-disabled" : ""}`}
                      title={isCurrentGroup ? "현재 활성화된 그룹은 반드시 포함됩니다." : undefined}
                    >
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
                      {isCurrentGroup ? <small className="current-group-badge">현재 그룹 (필수)</small> : null}
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 2. 종목 검색 */}
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
            <button type="button" aria-label="My 브리핑 전체보기">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="dashboard-briefing-toolbar">
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
            <div className="dashboard-briefing-paging" aria-label="브리핑 넘겨보기">
              <button type="button" aria-label="이전 브리핑 보기" disabled>
                <ChevronLeft size={18} />
              </button>
              <span className="briefing-page-indicator">1 / 1</span>
              <button type="button" aria-label="다음 브리핑 보기" disabled>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="dashboard-briefing-copy">
            <p className="dashboard-briefing-date">2026년 8월 18일 오전 브리핑입니다.</p>
            <p className="dashboard-briefing-body">
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
            {DASHBOARD_RECENT_ARTICLES.slice(0, 4).map((article) => (
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
