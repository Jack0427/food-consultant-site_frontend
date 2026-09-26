import { en, type Dictionary } from "./locales/en";
import { zhTW } from "./locales/zh-TW";

export type Language = "en" | "zh-TW";
export type { Dictionary };

export const DEFAULT_LANGUAGE: Language = "en";

export const translations: Record<Language, Dictionary> = {
  en,
  "zh-TW": zhTW,
};

// 對應到 <html lang>，讓螢幕閱讀器使用正確的發音
export const htmlLang: Record<Language, string> = {
  en: "en",
  "zh-TW": "zh-Hant-TW",
};
