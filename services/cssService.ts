import type { ThemeSettings, ColorSettings, NeutralSettings } from '../types';
import { oklchToHex, hexToOklch } from '../utils/color';

const generateRamp = (prefix: string, color: ColorSettings | NeutralSettings): string => {
  const stops = color.stops.split(',').map(s => parseFloat(s.trim()));
  const names = prefix === 'neutral'
    ? [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    : [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  let rampCss = `  /* ${prefix} ramp */\n`;
  stops.forEach((l, i) => {
    rampCss += `  --${prefix}-${names[i]}: oklch(${l} ${color.chroma} ${color.hue});\n`;
    rampCss += `  --${prefix}-${names[i]}-hex: ${oklchToHex(l, color.chroma, color.hue)};\n`;
  });
  return rampCss;
};

export const generateColorRamps = (settings: ThemeSettings): string => {
  const notificationRamps = (['success', 'warning', 'danger'] as const).map(key => {
    const notificationColorSettings = settings.notifications[key];
    return generateRamp(key, notificationColorSettings);
  }).join('\n');
  
  return `:root {\n` +
    generateRamp('p1', settings.primary1) + '\n' +
    generateRamp('p2', settings.primary2) + '\n' +
    generateRamp('accent', settings.accent) + '\n' +
    generateRamp('neutral', settings.neutral) + '\n' +
    notificationRamps +
    `}\n`;
};

export const generateSemanticTokens = (settings: ThemeSettings): string => {
  const { primary1 } = settings;
  let primaryBrandLight = `--brand-primary: var(--p1-600);`;
  let primaryBrandDark = `--brand-primary: var(--p1-500);`;

  if (primary1.useGradient && primary1.seed2) {
    try {
      const endColorOklch = hexToOklch(primary1.seed2);
      const stops = primary1.stops.split(',').map(s => parseFloat(s.trim()));
      
      const lightL = stops[6]; // for p1-600
      const endColorLight = oklchToHex(lightL, endColorOklch.c, endColorOklch.h || 0);
      primaryBrandLight = `--brand-primary: linear-gradient(45deg, var(--p1-600), ${endColorLight});`;

      const darkL = stops[5]; // for p1-500
      const endColorDark = oklchToHex(darkL, endColorOklch.c, endColorOklch.h || 0);
      primaryBrandDark = `--brand-primary: linear-gradient(45deg, var(--p1-500), ${endColorDark});`;
    } catch (e) {
      console.error("Could not generate gradient CSS:", e);
      // Fallback to solid color if hex is invalid
    }
  }

  const lightTheme = `
  /* Light Theme Semantic Colors */
  --surface-1: var(--neutral-50);
  --surface-2: var(--neutral-100);
  --surface-3: var(--neutral-200);
  --text-0: var(--neutral-950);
  --text-1: var(--neutral-900);
  --text-2: var(--neutral-700);
  --text-on-primary: var(--neutral-50);
  --text-on-secondary: var(--neutral-50);
  ${primaryBrandLight}
  --brand-secondary: var(--p2-600);
  --brand-accent: var(--accent-500);
  --border-1: var(--neutral-300);

  /* Notification colors */
  --notif-success: var(--success-600);
  --notif-warning: var(--warning-600);
  --notif-danger: var(--danger-600);
`;

  return `
:root, [data-theme="light"] {
  ${lightTheme}
}

[data-theme="dark"] {
  /* Dark Theme Semantic Colors */
  --surface-1: var(--neutral-900);
  --surface-2: var(--neutral-800);
  --surface-3: var(--neutral-700);
  --text-0: var(--neutral-25);
  --text-1: var(--neutral-50);
  --text-2: var(--neutral-300);
  --text-on-primary: var(--neutral-950);
  --text-on-secondary: var(--neutral-950);
  ${primaryBrandDark}
  --brand-secondary: var(--p2-500);
  --brand-accent: var(--accent-400);
  --border-1: var(--neutral-700);

  /* Notification colors */
  --notif-success: var(--success-500);
  --notif-warning: var(--warning-500);
  --notif-danger: var(--danger-500);
}
`;
};

export const generateSpacingScale = (): string => {
  return `
:root {
  /* Spacing (based on a 0.25rem grid) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-7: 1.75rem;  /* 28px */
  --space-8: 2rem;     /* 32px */
  --space-9: 2.5rem;   /* 40px */
  --space-10: 3rem;    /* 48px */
  --space-11: 4rem;    /* 64px */
  --space-12: 5rem;    /* 80px */
}
`;
};

export const generateTypographyScale = (): string => {
  return `
:root {
  /* Fluid Typography Scale (using clamp) */
  --step--2: clamp(0.78rem, 0.77rem + 0.03vw, 0.80rem);
  --step--1: clamp(0.94rem, 0.92rem + 0.11vw, 1.00rem);
  --step-0: clamp(1.13rem, 1.09rem + 0.19vw, 1.25rem);
  --step-1: clamp(1.35rem, 1.28rem + 0.35vw, 1.56rem);
  --step-2: clamp(1.62rem, 1.50rem + 0.59vw, 1.95rem);
  --step-3: clamp(1.94rem, 1.76rem + 0.93vw, 2.44rem);
  --step-4: clamp(2.33rem, 2.05rem + 1.40vw, 3.05rem);
  --step-5: clamp(2.80rem, 2.39rem + 2.04vw, 3.82rem);
}
`;
};

export const generateRadiiShadowsBorders = (): string => {
  return `
:root {
  /* Radii */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-color: 240 2% 50%;
  --shadow-1: 0 1px 2px 0 oklch(from var(--shadow-color) l c h / 0.05);
  --shadow-2: 0 1px 3px 0 oklch(from var(--shadow-color) l c h / 0.1), 0 1px 2px -1px oklch(from var(--shadow-color) l c h / 0.1);
  --shadow-3: 0 4px 6px -1px oklch(from var(--shadow-color) l c h / 0.1), 0 2px 4px -2px oklch(from var(--shadow-color) l c h / 0.1);
  --shadow-4: 0 10px 15px -3px oklch(from var(--shadow-color) l c h / 0.1), 0 4px 6px -4px oklch(from var(--shadow-color) l c h / 0.1);

  /* Borders */
  --border-width-1: 1px;
  --border-width-2: 2px;
}
[data-theme="dark"] {
    --shadow-color: 240 2% 0%;
}
`;
};

export const generateOsPreference = (): string => {
  const darkTheme = `
    /* Set dark theme variables if no theme is specified */
    --surface-1: var(--neutral-900);
    --surface-2: var(--neutral-800);
    --surface-3: var(--neutral-700);
    --text-0: var(--neutral-25);
    --text-1: var(--neutral-50);
    --text-2: var(--neutral-300);
    --text-on-primary: var(--neutral-950);
    --text-on-secondary: var(--neutral-950);
    --brand-primary: var(--p1-500);
    --brand-secondary: var(--p2-500);
    --brand-accent: var(--accent-400);
    --border-1: var(--neutral-700);
    --shadow-color: 240 2% 0%;
    --notif-success: var(--success-500);
    --notif-warning: var(--warning-500);
    --notif-danger: var(--danger-500);
`
  return `
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${darkTheme}
  }
}
`;
};

export const generateCssReset = (): string => {
    return `
/* Modern CSS Reset */
*, *::before, *::after { box-sizing: border-box; }
html { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: sans-serif; }
body { margin: 0; }
hr { height: 0; color: inherit; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
a { color: inherit; text-decoration: inherit; }
b, strong { font-weight: bolder; }
code, kbd, samp, pre { font-family: monospace, monospace; font-size: 1em; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
table { text-indent: 0; border-color: inherit; border-collapse: collapse; }
button, input, optgroup, select, textarea { font-family: inherit; font-size: 100%; line-height: 1.5; margin: 0; padding: 0; color: inherit; }
button, select { text-transform: none; }
button, [type='button'], [type='reset'], [type='submit'] { -webkit-appearance: button; }
::-moz-focus-inner { border-style: none; padding: 0; }
:-moz-focusring { outline: 1px dotted ButtonText; }
:-moz-ui-invalid { box-shadow: none; }
legend { padding: 0; }
progress { vertical-align: baseline; }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
[type='search'] { -webkit-appearance: textfield; outline-offset: -2px; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; }
summary { display: list-item; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; max-width: 100%; height: auto;}
    `
}

export const generateGlobalStyles = (settings: ThemeSettings): string => {
  return `
:root {
  --font-base: '${settings.fonts.base}', sans-serif;
  --font-heading: '${settings.fonts.heading}', sans-serif;
}

body {
  font-family: var(--font-base);
  background-color: var(--surface-1);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

/* Styles for the preview containers */
[data-theme] {
    background-color: var(--surface-1);
    color: var(--text-1);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-0);
  line-height: 1.2;
  font-weight: 700;
}

h1 { font-size: var(--step-4); }
h2 { font-size: var(--step-3); }
h3 { font-size: var(--step-2); }
h4 { font-size: var(--step-1); }
h5 { font-size: var(--step-0); }
p, a, li, button, input, label { font-size: var(--step-0); }

a {
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 500;
}
a:hover {
  text-decoration: underline;
}

ul, ol {
  padding-left: var(--space-5);
  margin-block: var(--space-4);
  list-style-position: inside;
}

ul { list-style-type: disc; }
ol { list-style-type: decimal; }

li {
  margin-bottom: var(--space-2);
}

ul ul, ol ol, ul ol, ol ul {
  margin-block: var(--space-3);
  padding-left: var(--space-5);
}

ul ul { list-style-type: circle; }
ol ol { list-style-type: lower-alpha; }
ul ol { list-style-type: lower-alpha; }
ol ul { list-style-type: circle; }
`;
};

export const generateVisuallyHidden = (): string => {
  return `
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;
};

export const generateComponentCss = (settings: ThemeSettings): string => {
    let btnPrimaryHoverCssLight = `.btn-primary:hover { background-color: var(--p1-700); }`;
    let btnPrimaryHoverCssDark = `[data-theme="dark"] .btn-primary:hover { background-color: var(--p1-400); }`;

    if (settings.primary1.useGradient) {
        btnPrimaryHoverCssLight = `.btn-primary:hover { box-shadow: var(--shadow-3); transform: translateY(-2px); }`;
        btnPrimaryHoverCssDark = `[data-theme="dark"] .btn-primary:hover { box-shadow: var(--shadow-3); transform: translateY(-2px); }`;
    }
    
    return `
/* ====== Buttons ====== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-base);
  font-size: var(--step-0);
  font-weight: 700;
  border-radius: var(--radius-md);
  border: var(--border-width-1) solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.btn:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 2px; }

.btn-primary { background: var(--brand-primary); color: var(--text-on-primary); }
${btnPrimaryHoverCssLight}
[data-theme="dark"] .btn-primary { color: var(--text-on-primary); }
${btnPrimaryHoverCssDark}

.btn-secondary { background-color: var(--brand-secondary); color: var(--text-on-secondary); }
.btn-secondary:hover { background-color: var(--p2-700); }
[data-theme="dark"] .btn-secondary { color: var(--text-on-secondary); }
[data-theme="dark"] .btn-secondary:hover { background-color: var(--p2-400); }

.btn-accent { background-color: var(--brand-accent); color: var(--neutral-950); }
.btn-accent:hover { background-color: var(--accent-600); }
[data-theme="dark"] .btn-accent:hover { background-color: var(--accent-300); }

.btn-success { background-color: var(--success-100); color: var(--success-700); }
.btn-success:hover { background-color: var(--success-200); }
[data-theme="dark"] .btn-success { background-color: var(--success-900); color: var(--success-200); }
[data-theme="dark"] .btn-success:hover { background-color: var(--success-800); }

.btn-warning { background-color: var(--warning-100); color: var(--warning-800); }
.btn-warning:hover { background-color: var(--warning-200); }
[data-theme="dark"] .btn-warning { background-color: var(--warning-900); color: var(--warning-200); }
[data-theme="dark"] .btn-warning:hover { background-color: var(--warning-800); }

.btn-danger { background-color: var(--danger-100); color: var(--danger-700); }
.btn-danger:hover { background-color: var(--danger-200); }
[data-theme="dark"] .btn-danger { background-color: var(--danger-900); color: var(--danger-200); }
[data-theme="dark"] .btn-danger:hover { background-color: var(--danger-800); }

/* ====== Badges ====== */
.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--step--1);
  font-weight: 600;
  border-radius: var(--radius-full);
  line-height: 1;
}
.badge-primary { background-color: var(--p1-100); color: var(--p1-800); }
.badge-secondary { background-color: var(--p2-100); color: var(--p2-800); }
.badge-accent { background-color: var(--accent-100); color: var(--accent-800); }
.badge-success { background-color: var(--success-100); color: var(--success-800); }
.badge-warning { background-color: var(--warning-100); color: var(--warning-800); }
.badge-danger { background-color: var(--danger-100); color: var(--danger-800); }

[data-theme="dark"] .badge-primary { background-color: var(--p1-800); color: var(--p1-200); }
[data-theme="dark"] .badge-secondary { background-color: var(--p2-800); color: var(--p2-200); }
[data-theme="dark"] .badge-accent { background-color: var(--accent-800); color: var(--accent-200); }
[data-theme="dark"] .badge-success { background-color: var(--success-800); color: var(--success-200); }
[data-theme="dark"] .badge-warning { background-color: var(--warning-800); color: var(--warning-200); }
[data-theme="dark"] .badge-danger { background-color: var(--danger-800); color: var(--danger-200); }

/* ====== Card ====== */
.card {
  background-color: var(--surface-2);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: var(--border-width-1) solid var(--border-1);
  box-shadow: var(--shadow-2);
}
.card-primary {
  background: var(--brand-primary);
  color: var(--text-on-primary);
}
.card-primary h4 {
  color: var(--text-on-primary);
}
.card-secondary {
  background-color: var(--brand-secondary);
  color: var(--text-on-secondary);
}
.card-secondary h4 {
  color: var(--text-on-secondary);
}

/* ====== Forms ====== */
.input-field {
    width: 100%;
    background-color: var(--surface-2);
    padding: var(--space-2) var(--space-3);
    color: var(--text-1);
    border-radius: var(--radius-md);
    border: var(--border-width-1) solid var(--border-1);
    transition: all 0.2s;
}
.input-field::placeholder { color: var(--text-2); }
.input-field:focus {
    border-color: var(--brand-primary);
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
}

/* ====== Tabs ====== */
.tab-list {
    display: flex;
    border-bottom: var(--border-width-2) solid var(--border-1);
}
.tab-button {
    padding: var(--space-2) var(--space-4);
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-2);
    border-bottom: var(--border-width-2) solid transparent;
    transform: translateY(var(--border-width-2));
    transition: all 0.2s;
}
.tab-button:hover {
    color: var(--text-0);
}
.tab-button.active {
    color: var(--brand-primary);
    border-color: var(--brand-primary);
}
.tab-panel {
    padding: var(--space-4);
    background-color: var(--surface-2);
    border: var(--border-width-1) solid var(--border-1);
    border-top: none;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
}

/* ====== Accordion ====== */
.accordion-item {
    background-color: var(--surface-2);
    border: var(--border-width-1) solid var(--border-1);
    border-radius: var(--radius-md);
}
.accordion-item:not(:last-child) { margin-bottom: var(--space-2); }
.accordion-header button {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    text-align: left;
    background: none;
    border: none;
    font-weight: 700;
    color: var(--text-0);
    cursor: pointer;
}
.accordion-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-in-out;
}
.accordion-content.open { grid-template-rows: 1fr; }
.accordion-content > p {
    overflow: hidden;
    padding: 0 var(--space-4) var(--space-4) var(--space-4);
    color: var(--text-2);
}

/* ====== Slider ====== */
.slider-track {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: var(--radius-full);
    background: linear-gradient(to right, var(--brand-primary) calc(var(--value, 50) * 1%), var(--surface-3) calc(var(--value, 50) * 1%));
    outline: none;
}
.slider-track::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--brand-primary);
    cursor: pointer;
    border: 3px solid var(--surface-1);
    box-shadow: var(--shadow-1);
}
.slider-track::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--brand-primary);
    cursor: pointer;
    border: 3px solid var(--surface-1);
    box-shadow: var(--shadow-1);
}
    `;
};


export const generateFullCss = (settings: ThemeSettings): string => {
  return [
    generateCssReset(),
    generateColorRamps(settings),
    generateSemanticTokens(settings),
    generateSpacingScale(),
    generateTypographyScale(),
    generateRadiiShadowsBorders(),
    generateOsPreference(),
    generateGlobalStyles(settings),
    generateVisuallyHidden(),
    generateComponentCss(settings)
  ].join('\n\n');
};