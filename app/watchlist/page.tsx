import type { Metadata } from "next";
import { MyHankyungClient } from "../page";

export const metadata: Metadata = {
  title: "관심종목 | My한경",
  description: "관심종목을 그룹별로 등록·관리하고, 주가 변동과 시세 정보, AI 호재·악재 코멘트를 한눈에 확인하세요.",
  openGraph: {
    title: "관심종목 | My한경",
    description: "관심종목을 그룹별로 등록·관리하고, 주가 변동과 시세 정보, AI 호재·악재 코멘트를 한눈에 확인하세요.",
    url: "https://myhankyung.vercel.app/watchlist",
  },
};

export default function WatchlistPage() {
  return <MyHankyungClient initialView="watchlist" />;
}
