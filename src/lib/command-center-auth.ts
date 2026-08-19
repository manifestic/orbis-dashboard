const ACCESS_COOKIE = "cc_access_token";
const REFRESH_COOKIE = "cc_refresh_token";
const SUPABASE_API_VERSION = "2024-01-01";

export type CommandCenterUser = {
  id: string;
  email: string;
  displayName: string;
  clientName: string;
  locationId: string;
};

export type CommandCenterSession = CommandCenterUser & {
  accessToken: string;
};

type SupabaseUser = { id?: unknown; email?: unknown; user_metadata?: Record<string, unknown> };
type SupabaseTokenResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
  expires_in?: unknown;
  user?: SupabaseUser;
};

const CALVENN_USER_ID = process.env.CALVENN_SUPABASE_USER_ID ?? "";
const CALVENN_LOCATION_ID = process.env.CALVENN_LOCATION_ID ?? "";
const CALVENN_CLIENT_NAME = process.env.CALVENN_CLIENT_NAME ?? "Your Best Health Quote";

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

function cookies(request: Request) {
  const result = new Map<string, string>();
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    result.set(
      part.slice(0, separator).trim(),
      decodeURIComponent(part.slice(separator + 1).trim()),
    );
  }
  return result;
}

function cookie(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Max-Age=${Math.max(0, Math.floor(maxAge))}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookies() {
  return [cookie(ACCESS_COOKIE, "", 0), cookie(REFRESH_COOKIE, "", 0)];
}

export async function revokeCalvennSession(request: Request) {
  const accessToken = cookies(request).get(ACCESS_COOKIE);
  if (!accessToken) return;
  try {
    await supabaseRequest("/auth/v1/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // Cookie clearing remains the local logout guarantee if the provider is unavailable.
  }
}

function userFromSupabase(user: SupabaseUser | undefined): CommandCenterUser | null {
  const id = typeof user?.id === "string" ? user.id : "";
  const email = typeof user?.email === "string" ? user.email : "";
  if (!id || id !== CALVENN_USER_ID || !email) return null;
  const metadata = user?.user_metadata ?? {};
  const displayName =
    typeof metadata.full_name === "string" && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : email;
  return {
    id,
    email,
    displayName,
    clientName: CALVENN_CLIENT_NAME,
    locationId: CALVENN_LOCATION_ID,
  };
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase authentication is not configured on the server.");
  return fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

async function validateAccessToken(accessToken: string) {
  const response = await supabaseRequest("/auth/v1/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return userFromSupabase((await readJson(response)) as SupabaseUser);
}

async function refreshAccessToken(refreshToken: string) {
  const response = await supabaseRequest(`/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) return null;
  const body = (await readJson(response)) as SupabaseTokenResponse;
  const accessToken = typeof body.access_token === "string" ? body.access_token : "";
  const nextRefreshToken =
    typeof body.refresh_token === "string" ? body.refresh_token : refreshToken;
  const expiresIn = typeof body.expires_in === "number" ? body.expires_in : 3600;
  const user = userFromSupabase(body.user);
  if (!accessToken || !user) return null;
  return {
    user,
    accessToken,
    cookies: [
      cookie(ACCESS_COOKIE, accessToken, expiresIn),
      cookie(REFRESH_COOKIE, nextRefreshToken, 60 * 60 * 24 * 30),
    ],
  };
}

export async function getCalvennSession(
  request: Request,
): Promise<{ session: CommandCenterSession | null; cookies?: string[] }> {
  const jar = cookies(request);
  const accessToken = jar.get(ACCESS_COOKIE);
  if (accessToken) {
    const user = await validateAccessToken(accessToken);
    if (user) return { session: { ...user, accessToken } };
  }
  const refreshToken = jar.get(REFRESH_COOKIE);
  if (!refreshToken) return { session: null };
  const refreshed = await refreshAccessToken(refreshToken);
  if (!refreshed) return { session: null, cookies: clearSessionCookies() };
  return {
    session: { ...refreshed.user, accessToken: refreshed.accessToken },
    cookies: refreshed.cookies,
  };
}

export async function loginCalvenn(email: string, password: string) {
  const response = await supabaseRequest(`/auth/v1/token?grant_type=password`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const body = (await readJson(response)) as SupabaseTokenResponse & {
    error_description?: unknown;
    msg?: unknown;
  };
  if (!response.ok) {
    const message =
      typeof body.error_description === "string"
        ? body.error_description
        : typeof body.msg === "string"
          ? body.msg
          : "Unable to sign in.";
    return { ok: false as const, message };
  }
  const accessToken = typeof body.access_token === "string" ? body.access_token : "";
  const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
  const expiresIn = typeof body.expires_in === "number" ? body.expires_in : 3600;
  const user = userFromSupabase(body.user);
  if (!accessToken || !refreshToken || !user)
    return {
      ok: false as const,
      message: "This login is not authorized for the Calvenn workspace.",
    };
  return {
    ok: true as const,
    user,
    cookies: [
      cookie(ACCESS_COOKIE, accessToken, expiresIn),
      cookie(REFRESH_COOKIE, refreshToken, 60 * 60 * 24 * 30),
    ],
  };
}

export function applySessionCookies(response: Response, values?: string[]) {
  for (const value of values ?? []) response.headers.append("Set-Cookie", value);
  return response;
}

export function authConfigStatus() {
  return {
    configured: Boolean(supabaseConfig()),
    userMappingConfigured: Boolean(CALVENN_USER_ID && CALVENN_LOCATION_ID),
  };
}

export { SUPABASE_API_VERSION };
