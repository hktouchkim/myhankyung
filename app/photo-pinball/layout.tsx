import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Punch — 사진으로 만드는 핀볼",
  description: "로그인과 AI 토큰 없이, 내 사진을 브라우저에서 바로 핀볼 맵으로 만드는 웹게임",
  openGraph: {
    title: "Pixel Punch — 사진으로 만드는 핀볼",
    description: "사진을 올리면 색과 윤곽을 읽어 나만의 핀볼 맵을 만듭니다.",
    type: "website",
    locale: "ko_KR",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Pixel Punch — 사진으로 만드는 핀볼",
    description: "로그인과 AI 토큰 없이 즐기는 사진 핀볼 웹게임",
    images: [],
  },
};

export default function PhotoPinballLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
