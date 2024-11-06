"use client";

import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navBar/NavBar";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import ThemeWrapper from "@/components/themeWrapper/ThemeWrapper";
import WebSettingProvider from "@/context/webSettingContext";
import { usePathname, useSearchParams } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";

import "slick-carousel/slick/slick.css";

import "./globals.css";
import DynamicFavicon from "@/components/dynamicFavicon/DynamicFavicon";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldHideNavAndFooter = pathname === "/login" || pathname === "/forgot-password" || pathname === "/signup";

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.maateen.me/solaiman-lipi/font.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeWrapper>
          <WebSettingProvider>
            {!shouldHideNavAndFooter && <NavBar />}
            {children}
            {!shouldHideNavAndFooter && <Footer />}
            <ScrollToTop />
            <DynamicFavicon />
          </WebSettingProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
