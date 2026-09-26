import { cn } from "@/lib/cn";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
}

export default function SectionHeading({ id, eyebrow, title, intro, tone = "dark", align = "center" }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl sm:mb-16", align === "center" && "mx-auto text-center")}>
      <p
        className={cn(
          "mb-3 text-sm font-semibold uppercase tracking-[0.2em]",
          tone === "dark" ? "text-accent-light" : "text-accent-deep",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-white" : "text-base-950",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-lg leading-relaxed text-pretty", tone === "dark" ? "text-muted" : "text-base-700")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
