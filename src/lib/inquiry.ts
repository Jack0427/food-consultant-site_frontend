// 詢問表單共用的常數與型別（Client 與 Server Action 共用）

export const CATEGORY_IDS = [
  "regulatory",
  "product",
  "shelfLife",
  "safety",
  "quality",
  "research",
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CLIENT_TYPE_IDS = ["individual", "sme", "enterprise"] as const;
export type ClientTypeId = (typeof CLIENT_TYPE_IDS)[number];

export const TIMELINE_IDS = ["flexible", "month", "urgent"] as const;
export type TimelineId = (typeof TIMELINE_IDS)[number];

export const INQUIRY_FIELDS = [
  "category",
  "name",
  "email",
  "clientType",
  "organization",
  "subject",
  "timeline",
  "message",
  "consent",
] as const;
export type InquiryField = (typeof INQUIRY_FIELDS)[number];

export type InquiryErrorCode = "required" | "email" | "tooLong" | "tooShort";

export type InquiryState = {
  status: "idle" | "success" | "error";
  errors: Partial<Record<InquiryField, InquiryErrorCode>>;
};

export const initialInquiryState: InquiryState = { status: "idle", errors: {} };

export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 5000;
