export function getLocalized<T extends Record<string, any>, K extends keyof T>(
  record: T,
  field: K,
  locale: string
): string {
  if (locale === "en") {
    const enKey = `${String(field)}En` as K;
    return (record[enKey] as string) || (record[field] as string) || "";
  }
  return (record[field] as string) || "";
}

export function getLocalizedOrNull<
  T extends Record<string, any>,
  K extends keyof T
>(record: T, field: K, locale: string): string | null {
  if (locale === "en") {
    const enKey = `${String(field)}En` as K;
    return (record[enKey] as string) || (record[field] as string) || null;
  }
  return (record[field] as string) || null;
}
