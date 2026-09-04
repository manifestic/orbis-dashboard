export type ClientBranding = {
  logoUrl: string;
  greetingName?: string;
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
  HDgk8bXoo6ZE8BAnxFXr: {
    logoUrl: "/assets/anovite-brand-logo.png",
    greetingName: "Anovite team",
    primaryColor: "#73bff0",
    accentColor: "#1f789f",
    inkColor: "#12344a",
    mutedColor: "#4f6b7b",
  },
  QsbCjo5HFBGuRG0AKms0: {
    logoUrl:
      "https://affordablehealthcare.solutions/wp-content/uploads/2022/11/cropped-Website-Logo_84776_Affordable-Healthcare-Solutions_Flat_BR_04.png",
    greetingName: "Calvenn",
    primaryColor: "#0066cc",
    accentColor: "#f4a300",
    inkColor: "#2d3748",
    mutedColor: "#4a5568",
  },
  B2WqoVF535ixA9CbywEh: {
    logoUrl:
      "https://stationsurvivalco.com/cdn/shop/files/REAL_REAL_SVG_SSCO_LOGO_DE000D.png?v=1777737510&width=350",
    primaryColor: "#de000d",
    accentColor: "#108474",
    inkColor: "#1a1a1a",
    mutedColor: "#466174",
  },
  yI8j40OmqLKKHFdQ1goC: {
    logoUrl: "/assets/adventure-north-realty-logo.png",
    greetingName: "Jesse",
    primaryColor: "#208020",
    accentColor: "#09090f",
    inkColor: "#202020",
    mutedColor: "#526052",
  },
};

export function brandingForLocation(locationId: string): ClientBranding {
  return TENANT_BRANDING[locationId.trim()] ?? DEFAULT_BRANDING;
}
