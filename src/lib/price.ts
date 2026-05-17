export function parsePriceAmount(
  price?: string | number | null,
): number | undefined {
  if (price === undefined || price === null) return undefined;

  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : undefined;
  }

  const normalized = price.trim().toLowerCase().replace(/,/g, '');
  if (!normalized) return undefined;

  const multiplier = getPriceMultiplier(normalized);
  const hasKnownUnit = multiplier !== 1;
  const withoutCurrencyWords = normalized
    .replace(/\b(bdt|tk|taka)\b/g, '')
    .trim();
  const isPlainNumeric = /^\d+(?:\.\d+)?$/.test(
    withoutCurrencyWords.replace(/\s+/g, ''),
  );

  if (!hasKnownUnit && !isPlainNumeric) return undefined;

  const match = normalized.match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;

  const amount = Number(match[0]);
  if (!Number.isFinite(amount)) return undefined;

  return amount * multiplier;
}

function getPriceMultiplier(value: string): number {
  if (/(^|[^a-z])(crore|core|cr)\b/.test(value)) return 10000000;
  if (/(^|[^a-z])(lakh|lac|l)\b/.test(value)) return 100000;
  if (/(^|[^a-z])(million|mn|m)\b/.test(value)) return 1000000;
  if (/(^|[^a-z])(thousand|k)\b/.test(value)) return 1000;
  return 1;
}
