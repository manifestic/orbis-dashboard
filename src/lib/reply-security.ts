const CSRF_COOKIE = "cc_reply_csrf";

function readCookie(request: Request, name: string) {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name)
      return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return "";
}

function csrfCookie(value: string) {
  return `${CSRF_COOKIE}=${encodeURIComponent(value)}; Max-Age=3600; Path=/; Secure; SameSite=None`;
}

export function issueCsrfToken(request: Request) {
  const existing = readCookie(request, CSRF_COOKIE);
  if (existing) return { token: existing };
  const token = crypto.randomUUID();
  return { token, cookie: csrfCookie(token) };
}

export function hasValidCsrfToken(request: Request) {
  const cookie = readCookie(request, CSRF_COOKIE);
  const header = request.headers.get("x-command-center-csrf") ?? "";
  return Boolean(cookie && header && cookie === header);
}

export function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin")?.trim();
  if (!origin) return false;
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const requestOrigin = new URL(request.url).origin;
  const configuredOrigins = (process.env.COMMAND_CENTER_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const allowedOrigins = new Set([
    requestOrigin,
    "https://app.gohighlevel.com",
    ...configuredOrigins,
  ]);
  return allowedOrigins.has(parsedOrigin.origin);
}

export { CSRF_COOKIE };
