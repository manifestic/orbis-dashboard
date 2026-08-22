export type ClientBranding = {
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  inkColor: string;
  mutedColor: string;
};

const DEFAULT_BRANDING: ClientBranding = {
  logoUrl: "",
  primaryColor: "#1377b8",
  accentColor: "#0e9a85",
  inkColor: "#102336",
  mutedColor: "#466174",
};

const TENANT_BRANDING: Record<string, ClientBranding> = {
  QsbCjo5HFBGuRG0AKms0: {
    logoUrl:
      "https://assets.cdn.filesafe.space/QsbCjo5HFBGuRG0AKms0/media/5e87639f-90b5-4c90-94d9-393a5a224611.png",
    primaryColor: "#1377b8",
    accentColor: "#0e9a85",
    inkColor: "#102336",
    mutedColor: "#466174",
  },
  B2WqoVF535ixA9CbywEh: {
    logoUrl:
      "https://stationsurvivalco.com/cdn/shop/files/REAL_REAL_SVG_SSCO_LOGO_DE000D.png?v=1777737510&width=350",
    primaryColor: "#de000d",
    accentColor: "#108474",
    inkColor: "#1a1a1a",
    mutedColor: "#466174",
  },
};

export function brandingForLocation(locationId: string): ClientBranding {
  return TENANT_BRANDING[locationId.trim()] ?? DEFAULT_BRANDING;
}
