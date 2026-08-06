import type { Metadata } from "next";
import { MyHankyungClient } from "../page";

export const metadata: Metadata = {
  title: "관심종목 | My한경",
  description: "관심그룹별 종목 시세와 타임 브리핑, 관련 기사와 리포트를 확인하세요.",
};

export default function WatchlistPage() {
  return <MyHankyungClient initialView="watchlist" />;
}
