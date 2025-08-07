
export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}


export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffSeconds = (now.getTime() - date.getTime()) / 1000;

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffSeconds < 60) return formatter.format(-Math.floor(diffSeconds), "second");
  if (diffSeconds < 3600) return formatter.format(-Math.floor(diffSeconds / 60), "minute");
  if (diffSeconds < 86400) return formatter.format(-Math.floor(diffSeconds / 3600), "hour");
  if (diffSeconds < 604800) return formatter.format(-Math.floor(diffSeconds / 86400), "day");
  return formatter.format(-Math.floor(diffSeconds / 604800), "week");
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
