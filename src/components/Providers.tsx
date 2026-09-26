"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { InquiryProvider } from "./InquiryContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user"：系統開啟「減少動態」時，framer-motion 會停用位移類動畫
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <InquiryProvider>{children}</InquiryProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
