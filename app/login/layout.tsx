"use client";

import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navBar/NavBar";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import ThemeWrapper from "@/components/themeWrapper/ThemeWrapper";
import WebSettingProvider from "@/context/webSettingContext";
import 'react-loading-skeleton/dist/skeleton.css';

import "react-datepicker/dist/react-datepicker.css";

import "slick-carousel/slick/slick.css";

// import "./globals.css";
import DynamicFavicon from "@/components/dynamicFavicon/DynamicFavicon";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en">
      <head>
      </head>
      <body>
      <ThemeWrapper>
          <WebSettingProvider>
            {/* <NavBar /> */}

            {children}

            {/* <Footer /> */}

            <ScrollToTop />

            <DynamicFavicon />
          </WebSettingProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}