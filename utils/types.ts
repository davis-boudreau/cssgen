export interface ColorSettings {
  seed: string;
  hue: number;
  chroma: number;
  stops: string; // Comma-separated list of lightness values
  useGradient?: boolean;
  seed2?: string;
}

export interface NeutralSettings {
  hue: number;
  chroma: number;
  stops: string; // Comma-separated list of lightness values
}

export interface NotificationSettings {
  success: ColorSettings;
  warning: ColorSettings;
  danger: ColorSettings;
}

export interface FontSettings {
  base: string;
  heading: string;
}

export interface ThemeSettings {
  primary1: ColorSettings;
  primary2: ColorSettings;
  accent: ColorSettings;
  neutral: NeutralSettings;
  notifications: NotificationSettings;
  fonts: FontSettings;
}

export interface Token {
    token: string;
    hex: string;
    l: number;
    c: number;
    h: number;
}