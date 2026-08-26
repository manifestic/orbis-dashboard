import { resolveHighLevelOAuthToken } from "./highlevel-oauth";

const GLOBAL_TOKEN_ENV_NAMES = [
  "HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN",
  "HIGHLEVEL_ACCESS_TOKEN",
] as const;

type LocationTokenEntry = string | { token?: unknown };

function locationTokenMap() {
  const result: Record<string, string> = {};
  for (const raw of [
    process.env.COMMAND_CENTER_HIGHLEVEL_TOKENS_JSON,
    process.env.COMMAND_CENTER_HIGHLEVEL_TOKENS_JSON_EXTRA,
  ]) {
    if (!raw?.trim()) continue;
    try {
      const parsed = JSON.parse(raw) as Record<string, LocationTokenEntry>;
      for (const [locationId, entry] of Object.entries(parsed ?? {})) {
        const token =
          typeof entry === "string"
            ? entry.trim()
            : entry && typeof entry.token === "string"
              ? entry.token.trim()
              : "";
        if (locationId.trim() && token) result[locationId.trim()] = token;
      }
    } catch {
      // Ignore one malformed optional map while preserving other tenant entries.
    }
  }
  return result;
}

export function highLevelTokenForLocation(locationId: string) {
  const normalizedLocationId = locationId.trim();
  const testLocationId = process.env.COMMAND_CENTER_TEST_LOCATION_ID?.trim();
  const testToken = process.env.COMMAND_CENTER_TEST_HIGHLEVEL_TOKEN?.trim();
  if (testLocationId && testLocationId === normalizedLocationId && testToken) return testToken;
  const scopedToken = locationTokenMap()[normalizedLocationId];
  if (scopedToken) return scopedToken;
  const globalTokenLocationId =
    process.env.HIGHLEVEL_GLOBAL_TOKEN_LOCATION_ID?.trim() ||
    process.env.CALVENN_LOCATION_ID?.trim();
  if (!globalTokenLocationId || globalTokenLocationId !== normalizedLocationId) return "";
  for (const envName of GLOBAL_TOKEN_ENV_NAMES) {
    const token = process.env[envName]?.trim();
    if (token) return token;
  }
  return "";
}

export async function resolveHighLevelTokenForLocation(locationId: string) {
  const normalizedLocationId = locationId.trim();
  const oauthToken = await resolveHighLevelOAuthToken(normalizedLocationId);
  if (oauthToken) return oauthToken;

  // Keep the existing scoped PIT path available during migration, but make it
  // easy to turn off once agency OAuth is connected and verified everywhere.
  if (process.env.COMMAND_CENTER_ALLOW_PIT_FALLBACK?.trim().toLowerCase() === "false") return "";
  return highLevelTokenForLocation(normalizedLocationId);
}
