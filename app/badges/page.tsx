import type { Metadata } from "next";
import BadgesClient from "./badges-client";

export const metadata: Metadata = {
  title: "배지 | My한경",
  description: "한경에서 쌓은 활동 기록과 획득·미획득 배지를 그룹별로 확인하세요.",
};

export default function BadgesPage() {
  return <BadgesClient />;
}
