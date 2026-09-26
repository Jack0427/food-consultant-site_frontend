"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, CircleAlert, CircleCheck, ClipboardPaste, Copy, Mail, Send } from "lucide-react";
import { submitInquiry } from "@/lib/submitInquiry";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  CATEGORY_IDS,
  CLIENT_TYPE_IDS,
  INQUIRY_FIELDS,
  TIMELINE_IDS,
  initialInquiryState,
  type ClientTypeId,
  type InquiryField,
  type InquiryState,
  type TimelineId,
} from "@/lib/inquiry";
import { cn } from "@/lib/cn";
import { CONTACT_FOCUS_TARGET_ID, useInquiry } from "./InquiryContext";
import { CATEGORY_ICONS } from "./Services";
import SectionHeading from "./ui/SectionHeading";

type FormState = InquiryState & { serverError?: boolean };

type Values = {
  name: string;
  email: string;
  organization: string;
  subject: string;
  timeline: TimelineId;
  message: string;
  consent: boolean;
};

const EMPTY_VALUES: Values = {
  name: "",
  email: "",
  organization: "",
  subject: "",
  timeline: "flexible",
  message: "",
  consent: false,
};

const fieldId = (field: InquiryField) => `inquiry-${field}`;

const inputClass =
  "w-full rounded-xl border border-base-600 bg-base-950 px-4 py-3 text-white transition-[border-color,box-shadow] duration-500 placeholder:text-base-200/55 hover:border-base-200/60 aria-[invalid=true]:border-red-400";

// 帶入模板後短暫高亮欄位，讓使用者看到內容已寫入
const flashClass = "border-accent-light shadow-[0_0_0_4px_rgb(247_200_115_/_0.35)]";

export default function Contact() {
  const { t } = useLanguage();
  const f = t.contact.form;
  const { category, setCategory, clientType, setClientType } = useInquiry();
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  // 使用者尚未自行修改主旨／內容前，直接顯示目前分類（與語言）的模板作為預設內容
  const [draftEdited, setDraftEdited] = useState(false);
  const [flash, setFlash] = useState(false);
  const template = t.contact.templates[category];
  const subject = draftEdited ? values.subject : template.subject;
  const message = draftEdited ? values.message : template.body;
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(async (prev, formData) => {
    try {
      const result = await submitInquiry(prev, formData);
      if (result.status === "success") {
        setValues(EMPTY_VALUES);
        setDraftEdited(false);
        setClientType("");
      }
      return result;
    } catch {
      return { status: "error", errors: {}, serverError: true };
    }
  }, initialInquiryState);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const showSuccess = state.status === "success" && state !== dismissed;
  const errors = state.status === "error" ? state.errors : {};
  const errorFields = INQUIRY_FIELDS.filter((field) => errors[field]);

  // 送出失敗時把焦點移到錯誤摘要，讓螢幕閱讀器使用者立即得知結果（成功訊息由 SuccessPanel 自行聚焦）
  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => setValues((prev) => ({ ...prev, [key]: value }));
  const updateDraft = (key: "subject" | "message", value: string) => {
    setValues((prev) => ({ ...prev, subject, message, [key]: value }));
    setDraftEdited(true);
  };

  const insertTemplate = () => {
    setValues((prev) => ({ ...prev, subject: template.subject, message: template.body }));
    setDraftEdited(true);
    setFlash(true);
    // 手機版表單在模板下方，若主旨欄不在畫面中就捲過去
    const el = subjectRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < 80 || rect.bottom > window.innerHeight) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  const describedBy = (field: InquiryField, hintId?: string) =>
    [hintId, errors[field] ? `${fieldId(field)}-error` : null].filter(Boolean).join(" ") || undefined;

  const fieldError = (field: InquiryField) =>
    errors[field] ? (
      <p id={`${fieldId(field)}-error`} className="flex items-center gap-2 text-sm font-medium text-red-300">
        <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
        {f.errors[errors[field]!]}
      </p>
    ) : null;

  const fieldLabels: Record<InquiryField, string> = {
    category: t.contact.stepCategory,
    name: f.name,
    email: f.email,
    clientType: f.clientType,
    organization: f.organization,
    subject: f.subject,
    timeline: f.timeline,
    message: f.message,
    consent: f.consent,
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-base-800/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="contact-title" eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

        <AnimatePresence mode="wait" initial={false}>
          {showSuccess ? (
            <SuccessPanel key="success" onDismiss={() => setDismissed(state)} />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              noValidate
              onSubmit={onSubmit}
              aria-labelledby="contact-title"
            >
              {state.status === "error" && (
                <div
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-8 rounded-2xl border-2 border-red-400 bg-red-950/60 p-5 outline-none sm:p-6"
                >
                  {state.serverError ? (
                    <p className="flex items-center gap-2 font-semibold text-red-100">
                      <CircleAlert aria-hidden="true" className="size-5 shrink-0" />
                      {f.serverError}
                    </p>
                  ) : (
                    <>
                      <p className="mb-3 flex items-center gap-2 font-semibold text-red-100">
                        <CircleAlert aria-hidden="true" className="size-5 shrink-0" />
                        {f.errorSummary}
                      </p>
                      <ul className="list-disc space-y-1 pl-10">
                        {errorFields.map((field) => (
                          <li key={field}>
                            <a href={`#${fieldId(field)}`} className="text-red-100 underline underline-offset-4 hover:text-white">
                              {fieldLabels[field]}: {f.errors[errors[field]!]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                {/* 左欄：步驟 1 分類 + 步驟 2 模板 */}
                <div className="space-y-8">
                  <fieldset
                    aria-describedby={errors.category ? `${fieldId("category")}-error` : undefined}
                    className="rounded-3xl border border-base-700 bg-base-900 p-6 sm:p-8"
                  >
                    <legend
                      id={CONTACT_FOCUS_TARGET_ID}
                      tabIndex={-1}
                      className="float-left mb-5 flex w-full items-center gap-3 text-xl font-bold text-white outline-none"
                    >
                      <StepBadge n={1} />
                      {t.contact.stepCategory}
                    </legend>
                    <div id={fieldId("category")} className="clear-both grid gap-3 sm:grid-cols-2">
                      {CATEGORY_IDS.map((id) => {
                        const Icon = CATEGORY_ICONS[id];
                        return (
                          <label
                            key={id}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-base-700 bg-base-950 p-4 transition-colors hover:border-base-600 has-[:checked]:border-accent-gold has-[:checked]:bg-base-800"
                          >
                            <input
                              type="radio"
                              name="category"
                              value={id}
                              checked={category === id}
                              onChange={() => setCategory(id)}
                              className="size-5 shrink-0 accent-accent-gold"
                            />
                            <Icon aria-hidden="true" className="size-5 shrink-0 text-accent-light" />
                            <span className="font-medium text-base-100">{t.services.items[id].title}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-2">{fieldError("category")}</div>
                  </fieldset>

                  <TemplatePanel onInsert={insertTemplate} currentSubject={subject} currentMessage={message} />
                </div>

                {/* 右欄：步驟 3 聯絡資料。欄位使用 subgrid，同一列的輸入框永遠對齊 */}
                <fieldset className="rounded-3xl border border-base-700 bg-base-900 p-6 sm:p-8">
                  <legend className="float-left mb-6 flex w-full items-center gap-3 text-xl font-bold text-white">
                    <StepBadge n={3} />
                    {t.contact.stepDetails}
                  </legend>

                  <div className="clear-both grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <Field label={f.name} htmlFor={fieldId("name")} error={fieldError("name")}>
                      <input
                        id={fieldId("name")}
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder={f.placeholders.name}
                        required
                        value={values.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={describedBy("name")}
                        className={inputClass}
                      />
                    </Field>

                    <Field label={f.email} htmlFor={fieldId("email")} error={fieldError("email")}>
                      <input
                        id={fieldId("email")}
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder={f.placeholders.email}
                        required
                        value={values.email}
                        onChange={(e) => update("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        aria-describedby={describedBy("email")}
                        className={inputClass}
                      />
                    </Field>

                    <Field label={f.clientType} htmlFor={fieldId("clientType")} error={fieldError("clientType")}>
                      <Select
                        id={fieldId("clientType")}
                        name="clientType"
                        required
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value as ClientTypeId | "")}
                        aria-invalid={!!errors.clientType}
                        aria-describedby={describedBy("clientType")}
                      >
                        <option value="">{f.selectPlaceholder}</option>
                        {CLIENT_TYPE_IDS.map((id) => (
                          <option key={id} value={id}>
                            {f.clientTypeOptions[id]}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field
                      label={f.organization}
                      optional={f.optional}
                      htmlFor={fieldId("organization")}
                      error={fieldError("organization")}
                    >
                      <input
                        id={fieldId("organization")}
                        name="organization"
                        type="text"
                        autoComplete="organization"
                        placeholder={f.placeholders.organization}
                        value={values.organization}
                        onChange={(e) => update("organization", e.target.value)}
                        aria-invalid={!!errors.organization}
                        aria-describedby={describedBy("organization")}
                        className={inputClass}
                      />
                    </Field>

                    <Field label={f.subject} htmlFor={fieldId("subject")} error={fieldError("subject")} className="sm:col-span-2">
                      <input
                        ref={subjectRef}
                        id={fieldId("subject")}
                        name="subject"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => updateDraft("subject", e.target.value)}
                        aria-invalid={!!errors.subject}
                        aria-describedby={describedBy("subject")}
                        className={cn(inputClass, flash && flashClass)}
                      />
                    </Field>

                    <Field label={f.timeline} htmlFor={fieldId("timeline")} error={fieldError("timeline")} className="sm:col-span-2">
                      <Select
                        id={fieldId("timeline")}
                        name="timeline"
                        required
                        value={values.timeline}
                        onChange={(e) => update("timeline", e.target.value as TimelineId)}
                        aria-invalid={!!errors.timeline}
                        aria-describedby={describedBy("timeline")}
                      >
                        {TIMELINE_IDS.map((id) => (
                          <option key={id} value={id}>
                            {f.timelineOptions[id]}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field
                      label={f.message}
                      htmlFor={fieldId("message")}
                      hint={f.messageHint}
                      hintId={`${fieldId("message")}-hint`}
                      error={fieldError("message")}
                      className="sm:col-span-2"
                    >
                      <textarea
                        id={fieldId("message")}
                        name="message"
                        required
                        rows={12}
                        value={message}
                        onChange={(e) => updateDraft("message", e.target.value)}
                        aria-invalid={!!errors.message}
                        aria-describedby={describedBy("message", `${fieldId("message")}-hint`)}
                        className={cn(inputClass, "resize-y text-sm leading-relaxed", flash && flashClass)}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <label htmlFor={fieldId("consent")} className="flex cursor-pointer items-start gap-3 text-base-100">
                        <input
                          id={fieldId("consent")}
                          name="consent"
                          type="checkbox"
                          required
                          checked={values.consent}
                          onChange={(e) => update("consent", e.target.checked)}
                          aria-invalid={!!errors.consent}
                          aria-describedby={describedBy("consent")}
                          className="mt-1 size-5 shrink-0 accent-accent-gold"
                        />
                        <span>{f.consent}</span>
                      </label>
                      <div className="mt-2">{fieldError("consent")}</div>
                    </div>

                    {/* Honeypot：對真人與輔助科技隱藏，用來擋垃圾訊息 */}
                    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                      <label htmlFor="inquiry-website">{f.honeypot}</label>
                      <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-gold px-6 py-4 text-lg font-bold text-base-950 transition-colors hover:bg-accent-light disabled:cursor-wait disabled:opacity-70"
                      >
                        <Send aria-hidden="true" className="size-5" />
                        {pending ? f.sending : f.submit}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function SuccessPanel({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // AnimatePresence 會等表單退場後才掛載此區塊，因此在掛載時聚焦
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-2xl rounded-3xl border border-accent-gold/60 bg-base-900 p-8 text-center sm:p-12"
    >
      <CircleCheck aria-hidden="true" className="mx-auto mb-6 size-16 text-accent-light" />
      <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-white sm:text-3xl">
        {t.contact.form.successTitle}
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-base-100">{t.contact.form.successText}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-8 rounded-full bg-accent-gold px-6 py-3 font-bold text-base-950 transition-colors hover:bg-accent-light"
      >
        {t.contact.form.newInquiry}
      </button>
    </motion.div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-gold text-base font-bold text-base-950">
      {n}
    </span>
  );
}

/**
 * 表單欄位：使用 CSS subgrid 佔三列（標籤／輸入框／錯誤訊息），
 * 同一列左右兩欄的標籤即使長度不同換行，輸入框仍在同一水平線。
 */
function Field({
  label,
  htmlFor,
  optional,
  hint,
  hintId,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: string;
  hint?: string;
  hintId?: string;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("row-span-3 grid grid-rows-subgrid gap-y-2", className)}>
      <div className="self-end">
        <label htmlFor={htmlFor} className="block font-medium text-base-100">
          {label}
          {optional && <span className="ml-2 text-sm font-normal text-muted">({optional})</span>}
        </label>
        {hint && (
          <p id={hintId} className="mt-1 text-sm text-muted">
            {hint}
          </p>
        )}
      </div>
      {children}
      <div>{error}</div>
    </div>
  );
}

/** 自訂箭頭的下拉選單：箭頭與右邊框保持適當距離 */
function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputClass, "cursor-pointer appearance-none pr-12", className)}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-accent-light"
      />
    </div>
  );
}

/** 剪貼簿 API 只在安全環境（HTTPS 或 localhost）可用；區網 IP 等情況改用 execCommand 備援 */
async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

function TemplatePanel({
  onInsert,
  currentSubject,
  currentMessage,
}: {
  onInsert: () => void;
  currentSubject: string;
  currentMessage: string;
}) {
  const { t } = useLanguage();
  const { category } = useInquiry();
  const [announcement, setAnnouncement] = useState("");
  const [done, setDone] = useState<"copy" | "insert" | null>(null);
  const headingId = useId();
  const template = t.contact.templates[category];
  const Icon = CATEGORY_ICONS[category];

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setDone(null), 2000);
    return () => window.clearTimeout(timer);
  }, [done]);

  // 先清空再寫入，確保重複操作時螢幕閱讀器仍會朗讀
  const announce = (message: string) => {
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(message), 50);
  };

  const copy = async () => {
    try {
      await copyText(`${t.contact.subjectLabel}: ${template.subject}\n\n${template.body}`);
      setDone("copy");
      announce(t.contact.copied);
    } catch {
      setDone(null);
      announce(t.contact.copyFailed);
    }
  };

  const insert = () => {
    const hasOwnText =
      (currentSubject && currentSubject !== template.subject) || (currentMessage && currentMessage !== template.body);
    if (hasOwnText && !window.confirm(t.contact.replaceConfirm)) return;
    onInsert();
    setDone("insert");
    announce(t.contact.inserted);
  };

  const mailto = `mailto:${t.contact.email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;

  return (
    <section aria-labelledby={headingId} className="rounded-3xl border border-base-700 bg-base-900 p-6 sm:p-8">
      <h3 id={headingId} className="mb-3 flex items-center gap-3 text-xl font-bold text-white">
        <StepBadge n={2} />
        {t.contact.stepTemplate}
      </h3>
      <p className="mb-5 leading-relaxed text-muted">{t.contact.templateHelp}</p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* 目前模板所屬分類，切換分類時可明確看出內容已改變 */}
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-gold px-4 py-1.5 text-sm font-bold text-base-950">
            <Icon aria-hidden="true" className="size-4" />
            {t.contact.currentTemplate}: {t.services.items[category].title}
          </p>
          <div
            tabIndex={0}
            role="region"
            aria-label={`${t.contact.currentTemplate}: ${t.services.items[category].title}`}
            className="max-h-96 overflow-y-auto rounded-2xl border-2 border-accent-gold/60 bg-base-950 p-5"
          >
            <p className="mb-4 border-b border-base-700 pb-3 text-sm text-base-100">
              <span className="font-semibold text-accent-light">{t.contact.subjectLabel}: </span>
              {template.subject}
            </p>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-base-100">{template.body}</pre>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={insert}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent-gold px-5 py-3 font-bold text-base-950 transition-colors hover:bg-accent-light"
        >
          {done === "insert" ? <Check aria-hidden="true" className="size-5" /> : <ClipboardPaste aria-hidden="true" className="size-5" />}
          {done === "insert" ? t.contact.insertDone : t.contact.insert}
        </button>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3 font-semibold transition-colors",
            done === "copy"
              ? "border-accent-light bg-base-800 text-white"
              : "border-accent-gold/70 text-accent-light hover:bg-base-800",
          )}
        >
          {done === "copy" ? <Check aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
          {done === "copy" ? t.contact.copyDone : t.contact.copy}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm font-medium text-accent-light">
        {announcement}
      </p>

      <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
        <Mail aria-hidden="true" className="size-4" />
        {t.contact.directEmailText}
        <a href={mailto} className="font-semibold text-accent-light underline underline-offset-4 hover:text-white">
          {t.contact.directEmailLink}
        </a>
      </p>
    </section>
  );
}
