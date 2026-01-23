export type TenantIndustry = "agriculture" | "manufacturing" | "retail";

export type TenantTheme = {
  /** Primary brand color used for buttons, links, highlights */
  primaryColor: string; // hex like #10b981
  /** Optional secondary color for gradients / accents */
  secondaryColor?: string; // hex
  /** Short text logo (keeps this frontend-only) */
  logoText: string;
};

export type Tenant = {
  id: string;
  /** Used in routing: /[tenant]/... */
  slug: string;
  name: string;
  industry: TenantIndustry;
  theme: TenantTheme;
};

