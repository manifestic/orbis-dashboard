import { createHmac, timingSafeEqual } from "node:crypto";
import { decryptHighLevelUserContext, type HighLevelUserContext } from "./highlevel-user-context";

const ACCESS_COOKIE = "cc_access_token";
const REFRESH_COOKIE = "cc_refresh_token";
const EMBED_COOKIE = "cc_embed_token";
const HIGHLEVEL_SESSION_COOKIE = "cc_highlevel_session";
const SUPABASE_API_VERSION = "2024-01-01";

export type CommandCenterUser = {
  id: string;
  email: string;
  displayName: string;
  clientName: string;
  locationId: string;
  role: "viewer" | "operator";
  capabilities: string[];
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
const COMMAND_CENTER_EMBED_SECRET = process.env.COMMAND_CENTER_EMBED_SECRET ?? "";
const COMMAND_CENTER_SESSION_SECRET =
  process.env.COMMAND_CENTER_SESSION_SECRET || COMMAND_CENTER_EMBED_SECRET;
const HIGHLEVEL_APP_SHARED_SECRET = process.env.HIGHLEVEL_APP_SHARED_SECRET ?? "";
const HIGHLEVEL_SESSION_TTL_SECONDS = Math.max(
  60 * 15,
  Number(process.env.HIGHLEVEL_SESSION_TTL_SECONDS ?? 60 * 60 * 8) || 60 * 60 * 8,
);
const COMMAND_CENTER_EMBED_TTL_SECONDS = Math.max(
  60 * 60,
  Number(process.env.COMMAND_CENTER_EMBED_TTL_SECONDS ?? 60 * 60 * 24 * 30) || 60 * 60 * 24 * 30,
);
const ADMIN_EMAILS = new Set(
  (process.env.CALVENN_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

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
  // The Command Center is embedded inside the HighLevel sub-account in a
  // cross-site iframe, so the authenticated session must be available in that
  // iframe context. Secure is required when SameSite=None is used.
  return `${name}=${encodeURIComponent(value)}; Max-Age=${Math.max(0, Math.floor(maxAge))}; Path=/; HttpOnly; Secure; SameSite=None`;
}

export function clearSessionCookies() {
  return [
    cookie(ACCESS_COOKIE, "", 0),
    cookie(REFRESH_COOKIE, "", 0),
    cookie(EMBED_COOKIE, "", 0),
    cookie(HIGHLEVEL_SESSION_COOKIE, "", 0),
  ];
}

type TenantConfig = {
  locationId: string;
  clientName: string;
  companyId?: string;
};

const READ_CAPABILITIES = ["inbox.read", "calendar.read", "opportunities.read", "reports.read"];

function configuredTenants(): TenantConfig[] {
  const raw = process.env.COMMAND_CENTER_TENANTS_JSON ?? "";
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const values = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
      const tenants = values.filter((value): value is Record<string, unknown> =>
        Boolean(value && typeof value === "object"),
      );
      const normalized = tenants
        .map((tenant) => ({
          locationId: typeof tenant.locationId === "string" ? tenant.locationId.trim() : "",
          clientName: typeof tenant.clientName === "string" ? tenant.clientName.trim() : "",
          companyId: typeof tenant.companyId === "string" ? tenant.companyId.trim() : undefined,
        }))
        .filter((tenant) => tenant.locationId && tenant.clientName);
      if (normalized.length) return normalized;
    } catch {
      // Fall back to the existing Calvenn configuration until the registry is configured.
    }
  }
  return CALVENN_LOCATION_ID
    ? [{ locationId: CALVENN_LOCATION_ID, clientName: CALVENN_CLIENT_NAME }]
    : [];
}

function tenantForLocation(locationId: string) {
  return configuredTenants().find((tenant) => tenant.locationId === locationId) ?? null;
}

function configuredOperatorEmails() {
  return new Set(
    (process.env.COMMAND_CENTER_HANDOFF_OPERATOR_EMAILS ?? process.env.CALVENN_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function contextUser(context: HighLevelUserContext, tenant: TenantConfig): CommandCenterUser {
  const isOperator = configuredOperatorEmails().has(context.email);
  return {
    id: `highlevel:${context.userId}`,
    email: context.email,
    displayName: context.displayName,
    clientName: tenant.clientName,
    locationId: tenant.locationId,
    role: isOperator ? "operator" : "viewer",
    capabilities: isOperator ? [...READ_CAPABILITIES, "inbox.reply"] : [...READ_CAPABILITIES],
  };
}

type HighLevelSessionClaims = {
  version: 1;
  user: CommandCenterUser;
  exp: number;
};

function sessionSignature(encodedClaims: string) {
  if (!COMMAND_CENTER_SESSION_SECRET) return "";
  return createHmac("sha256", COMMAND_CENTER_SESSION_SECRET)
    .update(encodedClaims)
    .digest("base64url");
}

function createHighLevelSessionToken(
  user: CommandCenterUser,
  ttlSeconds = HIGHLEVEL_SESSION_TTL_SECONDS,
) {
  if (!COMMAND_CENTER_SESSION_SECRET) return null;
  const claims: HighLevelSessionClaims = {
    version: 1,
    user,
    exp: Math.floor(Date.now() / 1000) + Math.max(60 * 15, Math.floor(ttlSeconds)),
  };
  const encodedClaims = base64Url(JSON.stringify(claims));
  return `${encodedClaims}.${sessionSignature(encodedClaims)}`;
}

function highLevelUserFromSessionToken(token: string | null | undefined): CommandCenterUser | null {
  if (!COMMAND_CENTER_SESSION_SECRET || !token) return null;
  const [encodedClaims, signature] = token.split(".");
  if (!encodedClaims || !signature) return null;
  const expected = sessionSignature(encodedClaims);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  )
    return null;
  try {
    const claims = JSON.parse(
      Buffer.from(encodedClaims, "base64url").toString("utf8"),
    ) as Partial<HighLevelSessionClaims>;
    if (
      claims.version !== 1 ||
      typeof claims.exp !== "number" ||
      claims.exp <= Math.floor(Date.now() / 1000) ||
      !claims.user ||
      (claims.user.role !== "viewer" && claims.user.role !== "operator") ||
      !Array.isArray(claims.user.capabilities)
    )
      return null;
    const tenant = tenantForLocation(claims.user.locationId);
    if (!tenant || tenant.clientName !== claims.user.clientName) return null;
    return {
      ...claims.user,
      capabilities: claims.user.capabilities.filter(
        (capability): capability is string => typeof capability === "string",
      ),
    };
  } catch {
    return null;
  }
}

type EmbedClaims = {
  locationId: string;
  clientName: string;
  exp: number;
};

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function embedSignature(encodedClaims: string) {
  return createHmac("sha256", COMMAND_CENTER_EMBED_SECRET)
    .update(encodedClaims)
    .digest("base64url");
}

function embedUser(token: string | null | undefined): CommandCenterUser | null {
  if (!COMMAND_CENTER_EMBED_SECRET || !token) return null;
  const [encodedClaims, signature] = token.split(".");
  if (!encodedClaims || !signature) return null;
  const expected = embedSignature(encodedClaims);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  )
    return null;
  try {
    const claims = JSON.parse(
      Buffer.from(encodedClaims, "base64url").toString("utf8"),
    ) as Partial<EmbedClaims>;
    if (
      typeof claims.locationId !== "string" ||
      !claims.locationId ||
      typeof claims.clientName !== "string" ||
      !claims.clientName ||
      typeof claims.exp !== "number" ||
      claims.exp <= Math.floor(Date.now() / 1000)
    )
      return null;
    const tenant = tenantForLocation(claims.locationId);
    if (!tenant || tenant.clientName !== claims.clientName) return null;
    return {
      id: `embed:${claims.locationId}`,
      email: "",
      displayName: claims.clientName,
      clientName: tenant.clientName,
      locationId: tenant.locationId,
      role: "viewer",
      capabilities: [...READ_CAPABILITIES],
    };
  } catch {
    return null;
  }
}

export function createCommandCenterEmbedToken(
  locationId: string,
  clientName: string,
  ttlSeconds = COMMAND_CENTER_EMBED_TTL_SECONDS,
) {
  if (!COMMAND_CENTER_EMBED_SECRET || !locationId || !clientName) return null;
  const claims: EmbedClaims = {
    locationId,
    clientName,
    exp: Math.floor(Date.now() / 1000) + Math.max(60, Math.floor(ttlSeconds)),
  };
  const encodedClaims = base64Url(JSON.stringify(claims));
  return `${encodedClaims}.${embedSignature(encodedClaims)}`;
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
  const isCalvenn = Boolean(CALVENN_USER_ID && id === CALVENN_USER_ID);
  const isAdmin = Boolean(email && ADMIN_EMAILS.has(email.toLowerCase()));
  if (!id || (!isCalvenn && !isAdmin) || !email) return null;
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
    role: isAdmin ? "operator" : "viewer",
    capabilities: isAdmin ? [...READ_CAPABILITIES, "inbox.reply"] : [...READ_CAPABILITIES],
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
  const highLevelUser = highLevelUserFromSessionToken(jar.get(HIGHLEVEL_SESSION_COOKIE));
  if (highLevelUser) {
    return { session: { ...highLevelUser, accessToken: "" } };
  }
  const requestEmbedToken = new URL(request.url).searchParams.get("embedToken");
  const embedToken = requestEmbedToken || jar.get(EMBED_COOKIE);
  const embeddedUser = embedUser(embedToken);
  if (embeddedUser) {
    return {
      session: { ...embeddedUser, accessToken: "" },
      cookies: requestEmbedToken
        ? [cookie(EMBED_COOKIE, requestEmbedToken, COMMAND_CENTER_EMBED_TTL_SECONDS)]
        : undefined,
    };
  }
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

export function loginHighLevelContext(encryptedData: string) {
  if (!HIGHLEVEL_APP_SHARED_SECRET || !COMMAND_CENTER_SESSION_SECRET)
    return {
      ok: false as const,
      message: "HighLevel signed context is not configured on the server.",
    };
  const context = decryptHighLevelUserContext(encryptedData, HIGHLEVEL_APP_SHARED_SECRET);
  if (!context)
    return { ok: false as const, message: "The HighLevel user context could not be verified." };
  const tenant = tenantForLocation(context.activeLocation);
  if (!tenant) return { ok: false as const, message: "This HighLevel location is not registered." };
  if (tenant.companyId && tenant.companyId !== context.companyId)
    return { ok: false as const, message: "This HighLevel company is not registered." };
  const user = contextUser(context, tenant);
  const sessionToken = createHighLevelSessionToken(user);
  if (!sessionToken)
    return { ok: false as const, message: "HighLevel session signing is not configured." };
  return {
    ok: true as const,
    user,
    cookies: [cookie(HIGHLEVEL_SESSION_COOKIE, sessionToken, HIGHLEVEL_SESSION_TTL_SECONDS)],
  };
}

export function hasCommandCenterCapability(
  session: CommandCenterSession | CommandCenterUser,
  capability: string,
) {
  return session.capabilities.includes(capability);
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
    adminMappingConfigured: ADMIN_EMAILS.size > 0,
    embedConfigured: Boolean(COMMAND_CENTER_EMBED_SECRET),
    highLevelContextConfigured: Boolean(
      HIGHLEVEL_APP_SHARED_SECRET && COMMAND_CENTER_SESSION_SECRET && configuredTenants().length,
    ),
    tenantCount: configuredTenants().length,
  };
}

export { SUPABASE_API_VERSION };
