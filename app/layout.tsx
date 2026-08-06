import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My한경",
  description: "관심종목과 최근 본 기사 등 나의 한경 콘텐츠를 한곳에서 확인하는 개인화 서비스",
  openGraph: {
    title: "My한경",
    description: "관심종목과 최근 본 기사 등 나의 한경 콘텐츠를 한곳에서 확인하세요.",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-watchlist.png",
        width: 1672,
        height: 941,
        alt: "관심종목과 뉴스, 리포트를 표현한 추상 금융 그래픽",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My한경",
    description: "관심종목과 최근 본 기사 등 나의 한경 콘텐츠를 한곳에서 확인하세요.",
    images: ["/og-watchlist.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
