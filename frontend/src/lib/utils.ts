import type { Post } from "../types";



export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}


export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffSeconds = (now.getTime() - date.getTime()) / 1000;

  const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffSeconds < 60) return formatter.format(-Math.floor(diffSeconds), "second");
  if (diffSeconds < 3600) return formatter.format(-Math.floor(diffSeconds / 60), "minute");
  if (diffSeconds < 86400) return formatter.format(-Math.floor(diffSeconds / 3600), "hour");
  if (diffSeconds < WEEK_IN_SECONDS) return formatter.format(-Math.floor(diffSeconds / 86400), "day");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


export const formatExactTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};
