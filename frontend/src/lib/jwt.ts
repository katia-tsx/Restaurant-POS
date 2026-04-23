
/** Decode JWT payload (client-side display only; server validates signature). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function roleFromToken(token: string | null): string | null {
  if (!token) return null;
  const p = decodeJwtPayload(token);
  const r = p?.role;
  return typeof r === 'string' ? r : null;
}
