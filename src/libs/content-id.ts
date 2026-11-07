const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns whether a route segment is a canonical UUID suitable for lookup. */
export function isContentId(id: string): boolean {
  return UUID_PATTERN.test(id);
}
