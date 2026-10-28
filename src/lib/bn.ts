import type { Product, SortKey } from "./types";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** 1850 -> "১,৮৫০", 63.5 -> "৬৩.৫০" */
export function toBnNumber(value: number, opts: { decimals?: number } = {}): string {
  const decimals = opts.decimals ?? (Number.isInteger(value) ? 0 : 2);
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Plain digit swap without grouping: "2.1" -> "২.১" */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Parse a number that may be written with Bengali digits and separators,
 * e.g. "১,৮৫০ টাকা" -> 1850. Used by sorting so values compare numerically.
 */
export function parseBnNumber(input: string | number): number {
  if (typeof input === "number") return input;
  const ascii = input
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[^0-9.\-]/g, "");
  const n = parseFloat(ascii);
  return Number.isNaN(n) ? 0 : n;
}

export const formatTaka = (value: number) => `${toBnNumber(value)} টাকা`;

export const formatPct = (pct: number) => `${toBnNumber(Math.abs(pct), { decimals: 1 })}%`;

const UNIT_LABEL: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export const unitShort = (unit: string) => UNIT_LABEL[unit] ?? unit;
export const unitLabel = (unit: string) => `প্রতি ${unitShort(unit)}`;

export function sortProducts(list: Product[], key: SortKey): Product[] {
  if (key === "default") return list;
  const dir = key === "asc" ? 1 : -1;
  return [...list].sort((a, b) => (parseBnNumber(a.today) - parseBnNumber(b.today)) * dir);
}

export function banglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function banglaDateTime(date: Date): string {
  const time = new Intl.DateTimeFormat("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(date);
  return `${banglaDate(date)} — ${time}`;
}
