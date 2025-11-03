import React, { useState, useEffect, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Preview } from './components/Preview';
import { generateFullCss } from './services/cssService';
import { updateGoogleFontsLink } from './utils/helpers';
import type { ThemeSettings } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>({
    primary1: { seed: '#7B458F', hue: 320, chroma: 0.15, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2', useGradient: false, seed2: '#2A7BDB' },
    primary2: { seed: '#004780', hue: 230, chroma: 0.2, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2' },
    accent: { seed: '#CBDB2A', hue: 107, chroma: 0.12, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2' },
    neutral: { hue: 240, chroma: 0.02, stops: '0.99, 0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1' },
    notifications: {
      success: { seed: '#CBDB2A', hue: 107, chroma: 0.18, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2' },
      warning: { seed: '#F37327', hue: 36, chroma: 0.19, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2' },
      danger: { seed: '#EF426F', hue: 2, chroma: 0.18, stops: '0.98, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2' },
    },
    fonts: {
      base: 'Open Sans',
      heading: 'Montserrat',
    },
  });

  const [generatedCss, setGeneratedCss] = useState('');

  const handleSettingsChange = useCallback((newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  useEffect(() => {
    const fullCss = generateFullCss(settings);
    setGeneratedCss(fullCss);

    const styleElement = document.getElementById('dynamic-theme-styles');
    if (styleElement) {
      styleElement.innerHTML = fullCss;
    } else {
      const newStyleElement = document.createElement('style');
      newStyleElement.id = 'dynamic-theme-styles';
      newStyleElement.innerHTML = fullCss;
      document.head.appendChild(newStyleElement);
    }
    
    updateGoogleFontsLink(settings.fonts.base, settings.fonts.heading);

  }, [settings]);


  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="lg:h-screen lg:overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-900 border-r border-gray-700">
          <ControlsPanel settings={settings} onSettingsChange={setSettings} />
        </div>
        <div className="relative lg:h-screen lg:overflow-y-auto">
          <div className="sticky top-0 z-10 p-4 bg-gray-800/80 backdrop-blur-sm flex justify-center items-center border-b border-gray-700">
             <h2 className="text-xl font-bold text-white">Live Preview</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <Preview theme='light' settings={settings} />
            <Preview theme='dark' settings={settings} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;