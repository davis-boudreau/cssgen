
// Note: These are simplified approximations for demonstration purposes.
// A production-grade implementation would use a robust color library like `culori`.

/**
 * A simplified, not perfectly accurate, conversion from HEX to OKLCH.
 * This is primarily used to get initial H and C values from a user's hex input.
 */
export const hexToOklch = (hex: string): { l: number, c: number, h: number | undefined } => {
  hex = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // sRGB to Linear RGB
  const r_linear = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  const g_linear = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  const b_linear = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Linear RGB to XYZ
  const x = 0.4124564 * r_linear + 0.3575761 * g_linear + 0.1804375 * b_linear;
  const y = 0.2126729 * r_linear + 0.7151522 * g_linear + 0.0721750 * b_linear;
  const z = 0.0193339 * r_linear + 0.1191920 * g_linear + 0.9503041 * b_linear;

  // XYZ to LMS
  const l_ = 0.4124564 * x + 0.3575761 * y + 0.1804375 * z;
  const m_ = 0.2126729 * x + 0.7151522 * y + 0.0721750 * z;
  const s_ = 0.0193339 * x + 0.1191920 * y + 0.9503041 * z;

  const l_cbrt = Math.cbrt(l_);
  const m_cbrt = Math.cbrt(m_);
  const s_cbrt = Math.cbrt(s_);

  // LMS to OKLab
  const l = 0.2104542553 * l_cbrt + 0.7936177850 * m_cbrt - 0.0040720468 * s_cbrt;
  const a = 1.9779984951 * l_cbrt - 2.4285922050 * m_cbrt + 0.4505937099 * s_cbrt;
  const b_ok = 0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.8086757660 * s_cbrt;

  const c = Math.sqrt(a * a + b_ok * b_ok);
  let h = Math.atan2(b_ok, a) * 180 / Math.PI;
  if (h < 0) h += 360;

  return { l, c, h };
};

/**
 * A simplified OKLCH to HEX conversion.
 * This is used for display purposes in the UI.
 */
export const oklchToHex = (l: number, c: number, h: number): string => {
  const h_rad = h * Math.PI / 180;
  const a = c * Math.cos(h_rad);
  // FIX: Rename 'b' to 'b_ok' to avoid redeclaring a block-scoped variable.
  const b_ok = c * Math.sin(h_rad);

  const l_ = Math.pow(l + 0.3963377774 * a + 0.2158037573 * b_ok, 3);
  const m_ = Math.pow(l - 0.1055613458 * a - 0.0638541728 * b_ok, 3);
  const s_ = Math.pow(l - 0.0894841775 * a - 1.2914855480 * b_ok, 3);

  const x =  1.2270138511 * l_ - 0.5577999807 * m_ + 0.2812561490 * s_;
  const y = -0.0405801784 * l_ + 1.1122568696 * m_ - 0.0716766787 * s_;
  const z = -0.0763812845 * l_ - 0.4214819784 * m_ + 1.5861632204 * s_;
  
  const r_linear =  4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z;
  const g_linear = -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z;
  const b_linear = -0.0041960863 * x - 0.7034186147 * y + 1.7076147010 * z;

  const r = r_linear > 0.0031308 ? 1.055 * Math.pow(r_linear, 1/2.4) - 0.055 : 12.92 * r_linear;
  const g = g_linear > 0.0031308 ? 1.055 * Math.pow(g_linear, 1/2.4) - 0.055 : 12.92 * g_linear;
  const b = b_linear > 0.0031308 ? 1.055 * Math.pow(b_linear, 1/2.4) - 0.055 : 12.92 * b_linear;

  const toHex = (c: number) => {
    const i = Math.round(Math.max(0, Math.min(1, c)) * 255);
    return i.toString(16).padStart(2, '0');
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
