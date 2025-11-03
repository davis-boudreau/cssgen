
import type { ThemeSettings, ColorSettings } from '../types';
import { oklchToHex, hexToOklch } from '../utils/color';

const formatColorForFigma = (hex: string) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
};

export const generateFigmaVariablesJson = (settings: ThemeSettings): string => {
  const figmaObject: any = {
    version: '1.0',
    collections: [
      {
        name: 'Primitives',
        modes: [{ name: 'Default', variables: {} }],
        variables: {},
      },
      {
        name: 'Semantic',
        modes: [
          { name: 'Light', variables: {} },
          { name: 'Dark', variables: {} },
        ],
        variables: {},
      },
    ],
  };

  const primitives = figmaObject.collections[0].variables;
  const semantic = figmaObject.collections[1].variables;
  const lightMode = figmaObject.collections[1].modes[0].variables;
  const darkMode = figmaObject.collections[1].modes[1].variables;

  // Add Primitives
  const brands = {
      p1: settings.primary1,
      p2: settings.primary2,
      accent: settings.accent,
      neutral: settings.neutral
  };
  
  Object.entries(brands).forEach(([prefix, brandSettings]) => {
      const stops = brandSettings.stops.split(',').map(s => parseFloat(s.trim()));
      const names = prefix === 'neutral' 
        ? [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        : [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      
      stops.forEach((l, i) => {
          const name = `${prefix}/${names[i]}`;
          primitives[name] = {
              type: 'COLOR',
              valuesByMode: {
                  "Default": formatColorForFigma(oklchToHex(l, brandSettings.chroma, brandSettings.hue))
              }
          };
      });
  });
  
  (['success', 'warning', 'danger'] as const).forEach(key => {
    const notificationColorSettings = settings.notifications[key];
    const stops = notificationColorSettings.stops.split(',').map(s => parseFloat(s.trim()));
    const names = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    stops.forEach((l, i) => {
        const name = `${key}/${names[i]}`;
        primitives[name] = {
            type: 'COLOR',
            valuesByMode: {
                "Default": formatColorForFigma(oklchToHex(l, notificationColorSettings.chroma, notificationColorSettings.hue))
            }
        };
    });
  });


  // Semantic mappings
  const semanticMappings = {
    light: {
      'surface/1': 'neutral/50', 'surface/2': 'neutral/100', 'surface/3': 'neutral/200',
      'text/0': 'neutral/950', 'text/1': 'neutral/900', 'text/2': 'neutral/700',
      'brand/primary': 'p1/600', 'brand/secondary': 'p2/600', 'brand/accent': 'accent/500',
      'border/1': 'neutral/300',
      'notification/success': 'success/600',
      'notification/warning': 'warning/600',
      'notification/danger': 'danger/600',
    },
    dark: {
      'surface/1': 'neutral/900', 'surface/2': 'neutral/800', 'surface/3': 'neutral/700',
      'text/0': 'neutral/25', 'text/1': 'neutral/50', 'text/2': 'neutral/300',
      'brand/primary': 'p1/500', 'brand/secondary': 'p2/500', 'brand/accent': 'accent/400',
      'border/1': 'neutral/700',
      'notification/success': 'success/500',
      'notification/warning': 'warning/500',
      'notification/danger': 'danger/500',
    },
  };

  Object.keys(semanticMappings.light).forEach(key => {
    semantic[key] = { type: 'COLOR', valuesByMode: {} };
    lightMode[key] = { type: 'VARIABLE_ALIAS', alias: semanticMappings.light[key as keyof typeof semanticMappings.light] };
    darkMode[key] = { type: 'VARIABLE_ALIAS', alias: semanticMappings.dark[key as keyof typeof semanticMappings.dark] };
  });

  return JSON.stringify(figmaObject, null, 2);
};
