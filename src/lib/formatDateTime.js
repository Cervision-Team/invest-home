export function formatDateTime(value, options = {}) {
  const { locale = "az-AZ", fallback = "", style = "numeric" } = options;

  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  if (style === "az-long") {
    const azMonths = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avqust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ];

    const day = String(date.getDate());
    const monthName = azMonths[date.getMonth()] ?? "";
    const year = String(date.getFullYear());

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    const datePart = `${day} ${monthName} ${year}`.trim();
    const timePart = `${hour}:${minute}`;
    return `${datePart}, saat ${timePart}`.trim();
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function toYMD(value, options = {}) {
  const { fallback = "" } = options;
  if (!value) return fallback;

  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : value;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return fallback;
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return fallback;
}

export function formatTimeAgo(value, options = {}) {
  const {
    fallback = "",
    now = new Date(),
    maxHours = 24,
    absoluteStyle = "az-long",
  } = options;

  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  const nowDate = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(nowDate.getTime())) return fallback;

  let diffSeconds = Math.floor((nowDate.getTime() - date.getTime()) / 1000);
  if (diffSeconds < 0) diffSeconds = 0;

  if (diffSeconds < 5) return "indi";
  if (diffSeconds < 60) return `${diffSeconds} saniyə əvvəl`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} dəqiqə əvvəl`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < maxHours) return `${diffHours} saat əvvəl`;

  return formatDateTime(date, { style: absoluteStyle, fallback });
}
