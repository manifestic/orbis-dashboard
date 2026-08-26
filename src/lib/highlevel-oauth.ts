import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  createVerify,
  randomBytes,
  timingSafeEqual,
  verify,
} from "node:crypto";
import { getTenantByLocation, saveTenantProfile } from "./tenant-registry";

const HIGHLEVEL_API = "https://services.leadconnectorhq.com";
const HIGHLEVEL_VERSION = "v3";
const CONNECTIONS_TABLE = "command_center_highlevel_oauth";
const WEBHOOKS_TABLE = "command_center_highlevel_webhooks";
const AGENCY_SCOPE_KEY = "agency";
const CALVENN_LOCATION_ID = process.env.CALVENN_LOCATION_ID?.trim() ?? "";

const GHL_ED25519_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAi2HR1srL4o18O8BRa7gVJY7G7bupbN3H9AwJrHCDiOg=
-----END PUBLIC KEY-----`;
const GHL_LEGACY_RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAokvo/r9tVgcfZ5DysOSC
Frm602qYV0MaAiNnX9O8KxMbiyRKWeL9JpCpVpt4XHIcBOK4u3cLSqJGOLaPuXw6
dO0t6Q/ZVdAV5Phz+ZtzPL16iCGeK9po6D6JHBpbi989mmzMryUnQJezlYJ3DVfB
csedpinheNnyYeFXolrJvcsjDtfAeRx5ByHQmTnSdFUzuAnC9/GepgLT9SM4nCpv
uxmZMxrJt5Rw+VUa9Q9B8JSvbMPpez4peKaJPZHBbU3OdeCVx5klVXXZQGNHOs8gF
3kvoV5rTnXV0IknLBXlcKKAQLZcY/Q9rG6Ifi9c+5vqlvHPCUJFT5XUGG5RKgOKU
J062fRtN+rLYZUV+BjafxQauvC8wSWeYja63VSUruvmNj8xkx2zE/Juc+yjLjTXp
IocmaiFeAO6fUtNjDeFVkhf5LNb59vECyrHD2SQIrhgXpO4Q3dVNA5rw576PwTzN
h/AMfHKIjE4xQA1SZuYJmNnmVZLIZBlQAF9Ntd03rfadZ+yDiOXCCs9FkHibELhC
HULgCsnuDJHcrGNd5/Ddm5hxGQ0ASitgHeMZ0kcIOwKDOzOU53lDza6/Y09T7sYJ
PQe7z0cvj7aE4B+Ax1ZoZGPzpJlZtGXCsu9aTEGEnKzmsFqwcSsnw3JB31IGKAyk
T1hhTiaCeIY/OwwwNUY2yvcCAwEAAQ==
-----END PUBLIC KEY-----`;

type UserType = "Company" | "Location";

type StoredConnection = {
  scopeKey: string;
  locationId?: string;
  companyId?: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope?: string;
  userType: UserType;
  appId?: string;
  versionId?: string;
};

type TokenResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
  expires_in?: unknown;
  scope?: unknown;
  userType?: unknown;
  companyId?: unknown;
  locationId?: unknown;
  appId?: unknown;
  versionId?: unknown;
};

function text(...values: unknown[]) {
  return (
    values
      .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function number(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0) || 0;
}

function supabaseAdminConfig() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  return url && key ? { url, key } : null;
}

function encryptionKey() {
  const configured = process.env.COMMAND_CENTER_OAUTH_ENCRYPTION_KEY?.trim() ?? "";
  return configured ? createHash("sha256").update(configured).digest() : null;
}

function encrypt(value: string) {
  const key = encryptionKey();
  if (!key || !value) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `v1:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${ciphertext.toString("base64url")}`;
}

function decrypt(value: unknown) {
  const key = encryptionKey();
  if (!key || typeof value !== "string" || !value.startsWith("v1:")) return "";
  const [, ivValue, tagValue, ciphertextValue] = value.split(":");
  if (!ivValue || !tagValue || !ciphertextValue) return "";
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return "";
  }
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = supabaseAdminConfig();
  if (!config) throw new Error("The secure HighLevel connection store is not configured.");
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function storedConnection(row: Record<string, unknown>): StoredConnection | null {
  const scopeKey = text(row.scope_key);
  const accessToken = decrypt(row.access_token_ciphertext);
  const refreshToken = decrypt(row.refresh_token_ciphertext);
  const userType = row.user_type === "Location" ? "Location" : "Company";
  if (!scopeKey || !accessToken || !refreshToken) return null;
  return {
    scopeKey,
    locationId: text(row.location_id) || undefined,
    companyId: text(row.company_id) || undefined,
    accessToken,
    refreshToken,
    expiresAt: new Date(text(row.token_expires_at)).getTime() || 0,
    scope: text(row.scope) || undefined,
    userType,
    appId: text(row.app_id) || undefined,
    versionId: text(row.version_id) || undefined,
  };
}

async function getConnection(scopeKey: string) {
  const response = await supabaseRequest(
    `${CONNECTIONS_TABLE}?scope_key=eq.${encodeURIComponent(scopeKey)}&select=*&limit=1`,
    { headers: { "cache-control": "no-store" } },
  );
  if (!response.ok) throw new Error("The secure HighLevel connection store could not be read.");
  const rows = (await response.json().catch(() => [])) as unknown;
  return Array.isArray(rows) && rows[0] && typeof rows[0] === "object"
    ? storedConnection(rows[0] as Record<string, unknown>)
    : null;
}

async function saveConnection(connection: StoredConnection) {
  if (!encryptionKey()) throw new Error("OAuth encryption is not configured on the server.");
  const response = await supabaseRequest(CONNECTIONS_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      scope_key: connection.scopeKey,
      location_id: connection.locationId ?? null,
      company_id: connection.companyId ?? null,
      access_token_ciphertext: encrypt(connection.accessToken),
      refresh_token_ciphertext: encrypt(connection.refreshToken),
      token_expires_at: new Date(connection.expiresAt).toISOString(),
      scope: connection.scope ?? null,
      user_type: connection.userType,
      app_id: connection.appId ?? null,
      version_id: connection.versionId ?? null,
      status: "connected",
      last_error: null,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error("The HighLevel connection could not be stored securely.");
}

function oauthConfig() {
  const clientId = process.env.HIGHLEVEL_OAUTH_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.HIGHLEVEL_OAUTH_CLIENT_SECRET?.trim() ?? "";
  const redirectUri = process.env.HIGHLEVEL_OAUTH_REDIRECT_URI?.trim() ?? "";
  const scopes = process.env.HIGHLEVEL_OAUTH_SCOPES?.trim() ?? "";
  const stateSecret =
    process.env.HIGHLEVEL_OAUTH_STATE_SECRET?.trim() ??
    process.env.COMMAND_CENTER_SESSION_SECRET?.trim() ??
    process.env.COMMAND_CENTER_EMBED_SECRET?.trim() ??
    "";
  return { clientId, clientSecret, redirectUri, scopes, stateSecret };
}

export function highLevelOAuthConfigStatus() {
  const config = oauthConfig();
  return {
    configured: Boolean(
      config.clientId &&
      config.clientSecret &&
      config.redirectUri &&
      config.scopes &&
      config.stateSecret &&
      encryptionKey(),
    ),
    clientConfigured: Boolean(config.clientId),
    redirectConfigured: Boolean(config.redirectUri),
    scopesConfigured: Boolean(config.scopes),
    encryptionConfigured: Boolean(encryptionKey()),
  };
}

function signedState() {
  const { stateSecret } = oauthConfig();
  if (!stateSecret) return "";
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
      nonce: randomBytes(18).toString("hex"),
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", stateSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function validState(value: string) {
  const { stateSecret } = oauthConfig();
  if (!stateSecret) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", stateSecret).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  )
    return false;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: unknown;
    };
    return typeof claims.exp === "number" && claims.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function highLevelOAuthInstallUrl() {
  const config = oauthConfig();
  const state = signedState();
  if (!config.clientId || !config.redirectUri || !config.scopes || !state)
    throw new Error("HighLevel OAuth is not configured on the server.");
  const configuredInstallUrl = process.env.HIGHLEVEL_OAUTH_INSTALL_URL?.trim();
  const installUrl = new URL(
    configuredInstallUrl || "https://marketplace.gohighlevel.com/oauth/chooselocation",
  );
  installUrl.searchParams.set("client_id", config.clientId);
  installUrl.searchParams.set("response_type", "code");
  installUrl.searchParams.set("redirect_uri", config.redirectUri);
  installUrl.searchParams.set("scope", config.scopes);
  installUrl.searchParams.set("state", state);
  return installUrl.toString();
}

async function tokenRequest(body: URLSearchParams) {
  const response = await fetch(`${HIGHLEVEL_API}/oauth/token`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json().catch(() => ({}))) as TokenResponse;
  if (!response.ok) throw new Error("HighLevel OAuth token exchange failed.");
  return payload;
}

function connectionFromTokenResponse(
  payload: TokenResponse,
  scopeKey: string,
  fallback: Partial<StoredConnection> = {},
): StoredConnection {
  const accessToken = text(payload.access_token);
  const refreshToken = text(payload.refresh_token);
  const expiresIn = Math.max(60, number(payload.expires_in) || 86_399);
  if (!accessToken || !refreshToken)
    throw new Error("HighLevel did not return a refreshable token.");
  return {
    scopeKey,
    locationId: text(payload.locationId, fallback.locationId) || undefined,
    companyId: text(payload.companyId, fallback.companyId) || undefined,
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    scope: text(payload.scope, fallback.scope) || undefined,
    userType: payload.userType === "Location" ? "Location" : (fallback.userType ?? "Company"),
    appId: text(payload.appId, fallback.appId) || undefined,
    versionId: text(payload.versionId, fallback.versionId) || undefined,
  };
}

async function refreshConnection(connection: StoredConnection) {
  const config = oauthConfig();
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
    refresh_token: connection.refreshToken,
    user_type: connection.userType,
    redirect_uri: config.redirectUri,
  });
  const refreshed = connectionFromTokenResponse(
    await tokenRequest(body),
    connection.scopeKey,
    connection,
  );
  await saveConnection(refreshed);
  return refreshed;
}

async function usableConnection(scopeKey: string) {
  const connection = await getConnection(scopeKey);
  if (!connection) return null;
  if (connection.expiresAt > Date.now() + 60_000) return connection;
  return refreshConnection(connection);
}

export async function completeHighLevelOAuth(code: string, state: string) {
  const config = oauthConfig();
  if (!config.clientId || !config.clientSecret || !config.redirectUri || !validState(state))
    throw new Error("The HighLevel OAuth callback could not be verified.");
  const payload = await tokenRequest(
    new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "authorization_code",
      code,
      user_type: "Company",
      redirect_uri: config.redirectUri,
    }),
  );
  const connection = connectionFromTokenResponse(payload, AGENCY_SCOPE_KEY, {
    userType: "Company",
  });
  await saveConnection(connection);
}

async function provisionLocationAccess(
  locationId: string,
  companyId: string,
  locationName?: string,
) {
  const agency = await usableConnection(AGENCY_SCOPE_KEY);
  if (!agency) throw new Error("The HighLevel agency OAuth connection is not available.");
  const response = await fetch(`${HIGHLEVEL_API}/oauth/location-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${agency.accessToken}`,
      Version: HIGHLEVEL_VERSION,
    },
    body: new URLSearchParams({ companyId, locationId }),
  });
  const payload = (await response.json().catch(() => ({}))) as TokenResponse;
  if (!response.ok) throw new Error("HighLevel could not issue a location access token.");
  const connection = connectionFromTokenResponse(payload, locationId, {
    locationId,
    companyId,
    userType: "Location",
    appId: agency.appId,
    versionId: agency.versionId,
  });
  await saveConnection(connection);

  // Never overwrite an existing client profile. New locations start with a
  // clearly pending placeholder until onboarding supplies the real brand data.
  if (locationId !== CALVENN_LOCATION_ID && !(await getTenantByLocation(locationId))) {
    await saveTenantProfile({
      locationId,
      companyId,
      clientName: text(locationName) || `New HighLevel location ${locationId}`,
      onboardingStatus: "pending",
    });
  }
}

async function recordWebhook(webhookId: string, type: string, locationId?: string) {
  if (!webhookId) return true;
  const response = await supabaseRequest(WEBHOOKS_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      webhook_id: webhookId,
      event_type: type,
      location_id: locationId ?? null,
    }),
  });
  if (!response.ok) throw new Error("The HighLevel webhook ledger is not available.");
  const rows = (await response.json().catch(() => [])) as unknown;
  return Array.isArray(rows) && rows.length > 0;
}

export async function handleHighLevelWebhook(
  rawBody: string,
  signature: string,
  legacySignature: string,
) {
  const signatureValue = signature.trim();
  const publicKey = GHL_ED25519_PUBLIC_KEY;
  const verified = signatureValue
    ? verify(null, Buffer.from(rawBody, "utf8"), publicKey, Buffer.from(signatureValue, "base64"))
    : legacySignature.trim()
      ? (() => {
          const verifier = createVerify("SHA256");
          verifier.update(rawBody);
          return verifier.verify(GHL_LEGACY_RSA_PUBLIC_KEY, legacySignature.trim(), "base64");
        })()
      : false;
  if (!verified) throw new Error("The HighLevel webhook signature could not be verified.");
  const body = JSON.parse(rawBody) as Record<string, unknown>;
  const event = (body.data && typeof body.data === "object" ? body.data : body) as Record<
    string,
    unknown
  >;
  const type = text(body.type, event.type).toUpperCase();
  const locationId = text(event.locationId, event.location_id);
  const companyId = text(event.companyId, event.company_id);
  const webhookId = text(body.webhookId, body.webhook_id, event.webhookId);
  if (type !== "INSTALL" || !locationId || !companyId)
    return { accepted: true, provisioned: false };
  if (!(await recordWebhook(webhookId, type, locationId)))
    return { accepted: true, duplicate: true, provisioned: false };
  await provisionLocationAccess(
    locationId,
    companyId,
    text(event.locationName, event.location_name),
  );
  return { accepted: true, provisioned: true };
}

export async function resolveHighLevelOAuthToken(locationId: string) {
  if (!highLevelOAuthConfigStatus().configured) return "";
  const tenant = await getTenantByLocation(locationId);
  if (!tenant) return "";
  const connection = await usableConnection(locationId);
  if (connection && (await verifyHighLevelLocationAccess(locationId, connection.accessToken, tenant.companyId)))
    return connection.accessToken;
  try {
    const agency = await usableConnection(AGENCY_SCOPE_KEY);
    const companyId = text(tenant.companyId, agency?.companyId);
    if (!agency || !companyId || (tenant.companyId && agency.companyId && tenant.companyId !== agency.companyId))
      return "";
    await provisionLocationAccess(locationId, companyId);
    const locationConnection = await usableConnection(locationId);
    if (
      !locationConnection ||
      !(await verifyHighLevelLocationAccess(locationId, locationConnection.accessToken, tenant.companyId))
    )
      return "";
    return locationConnection.accessToken;
  } catch {
    return "";
  }
}

/** Confirm that a credential can read this exact HighLevel location. */
export async function verifyHighLevelLocationAccess(
  locationId: string,
  token: string,
  expectedCompanyId?: string,
) {
  const response = await fetch(`${HIGHLEVEL_API}/locations/${encodeURIComponent(locationId)}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: HIGHLEVEL_VERSION,
    },
  });
  if (!response.ok) return false;
  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const location = (payload.location ?? payload) as Record<string, unknown>;
  const returnedLocationId = text(location.id, location.locationId);
  const returnedCompanyId = text(location.companyId, location.company_id);
  if (returnedLocationId && returnedLocationId !== locationId) return false;
  if (expectedCompanyId && returnedCompanyId && returnedCompanyId !== expectedCompanyId) return false;
  return true;
}
