import type { Metadata } from "next";
import { MyHankyungClient } from "../page";

export const metadata: Metadata = {
  title: "관심종목 | My한경",
  description: "관심그룹별 종목 시세와 AI 호재·악재 인텔리전스, 증권사 리포트를 확인하세요.",
};

export default function WatchlistPage() {
  return <MyHankyungClient initialView="watchlist" />;
}
