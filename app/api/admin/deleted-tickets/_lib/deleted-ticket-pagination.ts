export function parseDeletedTicketListParams(searchParams: URLSearchParams) {
  return {
    page: parsePositiveInteger(searchParams.get("page"), 1, {
      max: Number.MAX_SAFE_INTEGER,
      min: 1,
    }),
    size: parsePositiveInteger(searchParams.get("size"), 10, {
      max: 100,
      min: 5,
    }),
  };
}

function parsePositiveInteger(
  value: string | null,
  fallback: number,
  range: {
    max: number;
    min: number;
  },
) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) return fallback;
  if (parsed < range.min) return fallback;
  if (parsed > range.max) return fallback;

  return parsed;
}
