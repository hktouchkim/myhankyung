import type { Metadata } from "next";
import AdminDashboardClient from "./admin-dashboard-client";

export const metadata: Metadata = {
  title: "관리자 대시보드 | My한경",
  description: "마이한경 서비스별 활성도, 사용자 참여도, 성장 지표를 모니터링하는 관리자 대시보드입니다.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
