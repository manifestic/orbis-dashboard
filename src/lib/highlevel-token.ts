const GLOBAL_TOKEN_ENV_NAMES = [
  "HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN",
  "HIGHLEVEL_ACCESS_TOKEN",
] as const;

type LocationTokenEntry = string | { token?: unknown };

function locationTokenMap() {
  const raw = process.env.COMMAND_CENTER_HIGHLEVEL_TOKENS_JSON?.trim();
  if (!raw) return {} as Record<string, string>;
  try {
    const parsed = JSON.parse(raw) as Record<string, LocationTokenEntry>;
    return Object.fromEntries(
      Object.entries(parsed ?? {})
        .map(([locationId, entry]) => {
          const token =
            typeof entry === "string"
              ? entry.trim()
              : entry && typeof entry.token === "string"
                ? entry.token.trim()
                : "";
          return [locationId.trim(), token] as const;
        })
        .filter(([locationId, token]) => locationId && token),
    );
  } catch {
    return {} as Record<string, string>;
  }
}

export function highLevelTokenForLocation(locationId: string) {
  const scopedToken = locationTokenMap()[locationId.trim()];
  if (scopedToken) return scopedToken;
  for (const envName of GLOBAL_TOKEN_ENV_NAMES) {
    const token = process.env[envName]?.trim();
    if (token) return token;
  }
  return "";
}
