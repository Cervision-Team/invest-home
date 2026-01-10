export function formatDateTime(value, options = {}) {
  const { locale = "az-AZ", fallback = "" } = options;

  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

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
