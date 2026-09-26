"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { CategoryId, ClientTypeId } from "@/lib/inquiry";

interface InquiryContextType {
  category: CategoryId;
  setCategory: (id: CategoryId) => void;
  clientType: ClientTypeId | "";
  setClientType: (id: ClientTypeId | "") => void;
  /** 從其他區塊跳到聯絡表單，可同時預選分類或客戶類型 */
  goToInquiry: (preset?: { category?: CategoryId; clientType?: ClientTypeId }) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const CONTACT_FOCUS_TARGET_ID = "contact-start";

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<CategoryId>("regulatory");
  const [clientType, setClientType] = useState<ClientTypeId | "">("");

  const goToInquiry = useCallback<InquiryContextType["goToInquiry"]>((preset) => {
    if (preset?.category) setCategory(preset.category);
    if (preset?.clientType) setClientType(preset.clientType);

    const target = document.getElementById(CONTACT_FOCUS_TARGET_ID);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // 將焦點移到表單起點，鍵盤與螢幕閱讀器使用者才能接續操作
    target.focus({ preventScroll: true });
  }, []);

  return (
    <InquiryContext.Provider value={{ category, setCategory, clientType, setClientType, goToInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return context;
}
