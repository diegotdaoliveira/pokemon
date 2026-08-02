function normalizeCardSearchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9/]/g, "");
}

function normalizeExactCardNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const matches = raw.matchAll(/(?:^|[^A-Za-z0-9])([A-Za-z]{0,5}\d{1,3}(?:\/[A-Za-z]{0,5}\d{1,3})?)(?=$|[^A-Za-z0-9])/g);
  for (const match of matches) {
    const candidate = match[1].replace(/\s+/g, "");
    if (candidate && /\d/.test(candidate)) {
      return candidate;
    }
  }

  const cleaned = raw.replace(/\s+/g, "");
  return cleaned || raw;
}

function normalizeCardNumberForComparison(value) {
  const raw = normalizeExactCardNumber(value || "");
  if (!raw) return null;

  const match = raw.match(/^([A-Za-z0-9]+)\s*\/\s*([A-Za-z0-9]+)$/);
  if (!match) return null;

  const left = match[1].replace(/^0+(?=\d)/, "");
  const right = match[2].replace(/^0+(?=\d)/, "");

  return `${left}/${right}`;
}

function buildCardNumberVariants(value) {
  const raw = normalizeExactCardNumber(value || "");
  if (!raw) return [];

  const cleaned = raw.replace(/\s+/g, "");
  const normalized = normalizeCardNumberForComparison(cleaned);
  return normalized ? [cleaned, normalized] : [cleaned];
}

function extractCardNumberQuery(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const matches = raw.matchAll(/(?:^|[^A-Za-z0-9])([A-Za-z]{0,5}\d{1,3}(?:\/[A-Za-z]{0,5}\d{1,3})?)(?=$|[^A-Za-z0-9])/g);
  for (const match of matches) {
    const candidate = match[1].replace(/\s+/g, "");
    if (candidate && /\d/.test(candidate)) {
      return candidate;
    }
  }

  return null;
}

function isExactCardNumberMatch(leftValue, rightValue) {
  return normalizeExactCardNumber(leftValue || "") === normalizeExactCardNumber(rightValue || "");
}

function isCardNumberEquivalent(leftValue, rightValue) {
  const left = normalizeCardNumberForComparison(leftValue);
  const right = normalizeCardNumberForComparison(rightValue);
  return Boolean(left && right && left === right);
}

const cardSearchUtils = {
  normalizeCardSearchValue,
  normalizeExactCardNumber,
  normalizeCardNumberForComparison,
  buildCardNumberVariants,
  extractCardNumberQuery,
  isExactCardNumberMatch,
  isCardNumberEquivalent
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = cardSearchUtils;
}

if (typeof window !== "undefined") {
  window.cardSearchUtils = cardSearchUtils;
}
