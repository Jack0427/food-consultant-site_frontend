// 詢問表單的驗證與送出。網站以 GitHub Pages 靜態部署，沒有伺服器，所以在瀏覽器端執行。
// 之後若要真的寄出，可在 TODO 處呼叫第三方表單服務（例如 Formspree）或自架 API。

import {
  CATEGORY_IDS,
  CLIENT_TYPE_IDS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  TIMELINE_IDS,
  type InquiryState,
} from "@/lib/inquiry";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // 隱藏欄位（honeypot）：真人看不到也不會填，有值就視為機器人，直接假裝成功
  if (text(formData, "website")) {
    return { status: "success", errors: {} };
  }

  const data = {
    category: text(formData, "category"),
    name: text(formData, "name"),
    email: text(formData, "email"),
    clientType: text(formData, "clientType"),
    organization: text(formData, "organization"),
    subject: text(formData, "subject"),
    timeline: text(formData, "timeline"),
    message: text(formData, "message"),
    consent: formData.get("consent") === "on",
  };

  const errors: InquiryState["errors"] = {};
  if (!(CATEGORY_IDS as readonly string[]).includes(data.category)) errors.category = "required";
  if (!data.name) errors.name = "required";
  else if (data.name.length > 100) errors.name = "tooLong";
  if (!data.email) errors.email = "required";
  else if (!EMAIL_PATTERN.test(data.email)) errors.email = "email";
  if (!(CLIENT_TYPE_IDS as readonly string[]).includes(data.clientType)) errors.clientType = "required";
  if (data.organization.length > 150) errors.organization = "tooLong";
  if (!data.subject) errors.subject = "required";
  else if (data.subject.length > 200) errors.subject = "tooLong";
  if (!(TIMELINE_IDS as readonly string[]).includes(data.timeline)) errors.timeline = "required";
  if (!data.message) errors.message = "required";
  else if (data.message.length < MESSAGE_MIN_LENGTH) errors.message = "tooShort";
  else if (data.message.length > MESSAGE_MAX_LENGTH) errors.message = "tooLong";
  if (!data.consent) errors.consent = "required";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  // TODO: 串接表單服務（例如 Formspree）或後端 API，將 data 寄到顧問信箱並寄送確認信給客戶。
  // 目前尚未實作寄信，驗證通過即回傳成功（demo 用）。

  return { status: "success", errors: {} };
}
