import type { Metadata } from "next";
import RecentArticlesClient from "./recent-articles-client";

export const metadata: Metadata = {
  title: "최근 본 기사 | My한경",
  description: "최근 3개월간 읽은 기사와 관심 분야, AI 읽기 성향을 확인하세요.",
};

export default function RecentArticlesPage() {
  return <RecentArticlesClient />;
}
