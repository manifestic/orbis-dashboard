import { createFileRoute } from "@tanstack/react-router";
import aiVisibilityReport from "../../assets/client-reports/calvenn/aivisibility-report.html?raw";
import communityReport from "../../assets/client-reports/calvenn/community-report.html?raw";
import competitorsReport from "../../assets/client-reports/calvenn/competitors-report.html?raw";
import keywordsReport from "../../assets/client-reports/calvenn/keywords-report.html?raw";
import youtubeReport from "../../assets/client-reports/calvenn/youtube-report.html?raw";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";

const CALVENN_LOCATION_ID = "QsbCjo5HFBGuRG0AKms0";

const reports: Record<string, string> = {
  "ai-visibility": aiVisibilityReport,
  community: communityReport,
  competitors: competitorsReport,
  keywords: keywordsReport,
  youtube: youtubeReport,
};

export const Route = createFileRoute("/api/client-report")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session) {
          return applySessionCookies(
            new Response("Authentication required", {
              status: 401,
              headers: { "cache-control": "no-store" },
            }),
            auth.cookies,
          );
        }

        if (auth.session.locationId !== CALVENN_LOCATION_ID) {
          return applySessionCookies(
            new Response("Tenant report unavailable", {
              status: 403,
              headers: { "cache-control": "no-store" },
            }),
            auth.cookies,
          );
        }

        const reportId = new URL(request.url).searchParams.get("report")?.trim() ?? "";
        const report = reports[reportId];
        if (!report) {
          return applySessionCookies(
            new Response("Report not found", {
              status: 404,
              headers: { "cache-control": "no-store" },
            }),
            auth.cookies,
          );
        }

        return applySessionCookies(
          new Response(report, {
            status: 200,
            headers: {
              "cache-control": "no-store",
              "content-type": "text/html; charset=utf-8",
              "content-security-policy":
                "default-src 'self' https: data:; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self' https://app.gohighlevel.com https://app.manifestic.ai",
            },
          }),
          auth.cookies,
        );
      },
    },
  },
});
