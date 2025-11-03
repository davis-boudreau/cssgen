
import React from 'react';
import type { ThemeSettings } from '../types';
import { CodeBlock } from './CodeBlock';
import { 
    generateColorRamps, 
    generateSemanticTokens,
    generateSpacingScale,
    generateTypographyScale,
    generateRadiiShadowsBorders,
    generateOsPreference,
    generateGlobalStyles,
    generateVisuallyHidden,
    generateComponentCss,
    generateFullCss,
} from '../services/cssService';
import { generateFigmaVariablesJson } from '../services/figmaService';
import { copyToClipboard } from '../utils/helpers';
import { hexToOklch, oklchToHex } from '../utils/color';

interface ControlsPanelProps {
  settings: ThemeSettings;
  onSettingsChange: (settings: ThemeSettings) => void;
}

const InputGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800 p-4 rounded-lg mb-6">
    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-600 pb-2">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const LabeledInput: React.FC<{ label: string; id: string; children: React.ReactNode; }> = ({ label, id, children }) => (
    <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleColorChange = (brand: 'primary1' | 'primary2' | 'accent', property: 'seed' | 'hue' | 'chroma', value: string | number) => {
    const newSettings = { ...settings };
    const brandSettings = { ...newSettings[brand] };

    if (property === 'seed') {
        brandSettings.seed = value as string;
        try {
            const oklch = hexToOklch(value as string);
            brandSettings.hue = Math.round(oklch.h || 0);
            brandSettings.chroma = parseFloat(oklch.c.toFixed(3));
        } catch(e) { console.error("Invalid hex color"); }
    } else {
        brandSettings[property as 'hue' | 'chroma'] = Number(value);
    }
    
    newSettings[brand] = brandSettings;
    onSettingsChange(newSettings);
  };
  
  const handlePrimary1GradientChange = (property: 'useGradient' | 'seed2', value: boolean | string) => {
      onSettingsChange({
        ...settings,
        primary1: {
          ...settings.primary1,
          [property]: value,
        },
      });
  };

  const handleNotificationColorChange = (type: 'success' | 'warning' | 'danger', property: 'seed' | 'hue' | 'chroma', value: string | number) => {
    const newSettings = { ...settings };
    const notifSettings = { ...newSettings.notifications[type] };

    if (property === 'seed') {
        notifSettings.seed = value as string;
        try {
            const oklch = hexToOklch(value as string);
            notifSettings.hue = Math.round(oklch.h || 0);
            notifSettings.chroma = parseFloat(oklch.c.toFixed(3));
        } catch(e) { console.error("Invalid hex color"); }
    } else {
        notifSettings[property as 'hue' | 'chroma'] = Number(value);
    }

    newSettings.notifications[type] = notifSettings;
    onSettingsChange(newSettings);
  };
  
  const handleStopsChange = (brand: 'primary1' | 'primary2' | 'accent' | 'neutral', value: string) => {
    onSettingsChange({ ...settings, [brand]: { ...settings[brand], stops: value } });
  };
  
  const handleNotificationStopsChange = (type: 'success' | 'warning' | 'danger', value: string) => {
    const newNotifications = { ...settings.notifications };
    newNotifications[type] = { ...newNotifications[type], stops: value };
    onSettingsChange({ ...settings, notifications: newNotifications });
  };
  
  const handleFontChange = (type: 'base' | 'heading', value: string) => {
    onSettingsChange({ ...settings, fonts: { ...settings.fonts, [type]: value } });
  };

  const handleFigmaExport = () => {
    const json = generateFigmaVariablesJson(settings);
    copyToClipboard(json, 'Figma variables JSON copied to clipboard!');
  };

  const renderColorControls = (brandKey: 'primary1' | 'primary2' | 'accent', name: string) => {
    const brand = settings[brandKey];
    return (
      <InputGroup title={`${name} Brand Color`}>
        <LabeledInput label="Seed Hex" id={`${brandKey}-seed`}>
          <div className="flex items-center bg-gray-700 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
            <input type="color" value={brand.seed} onChange={(e) => handleColorChange(brandKey, 'seed', e.target.value)} className="w-10 h-10 p-1 bg-transparent border-none rounded-l-md" />
            <input type="text" id={`${brandKey}-seed`} value={brand.seed} onChange={(e) => handleColorChange(brandKey, 'seed', e.target.value)} className="w-full bg-transparent p-2 text-white outline-none"/>
          </div>
        </LabeledInput>
        <LabeledInput label={`Hue (H)`} id={`${brandKey}-hue`}>
            <input type="range" min="0" max="360" value={brand.hue} onChange={(e) => handleColorChange(brandKey, 'hue', e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
            <span className="text-xs text-center text-gray-400">{brand.hue}</span>
        </LabeledInput>
        <LabeledInput label={`Mid-Chroma (C)`} id={`${brandKey}-chroma`}>
            <input type="range" min="0" max="0.3" step="0.01" value={brand.chroma} onChange={(e) => handleColorChange(brandKey, 'chroma', e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
             <span className="text-xs text-center text-gray-400">{brand.chroma}</span>
        </LabeledInput>
        <div className="sm:col-span-2">
            <LabeledInput label={`Lightness (L) Stops (10 values from 50 to 900)`} id={`${brandKey}-stops`}>
                <input type="text" id={`${brandKey}-stops`} value={brand.stops} onChange={(e) => handleStopsChange(brandKey, e.target.value)} className="w-full bg-gray-700 p-2 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
            </LabeledInput>
        </div>
        {brandKey === 'primary1' && (
          <>
            <div className="sm:col-span-2 mt-4 pt-4 border-t border-gray-700">
              <label htmlFor="p1-use-gradient" className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="p1-use-gradient"
                  checked={(brand as any).useGradient || false}
                  onChange={(e) => handlePrimary1GradientChange('useGradient', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-300">Use Gradient for Primary Color</span>
              </label>
            </div>
            {(brand as any).useGradient && (
              <div className="sm:col-span-2">
                <LabeledInput label="Gradient End Color" id="p1-seed2">
                  <div className="flex items-center bg-gray-700 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                    <input type="color" value={(brand as any).seed2 || '#000000'} onChange={(e) => handlePrimary1GradientChange('seed2', e.target.value)} className="w-10 h-10 p-1 bg-transparent border-none rounded-l-md" />
                    <input type="text" id="p1-seed2" value={(brand as any).seed2 || '#000000'} onChange={(e) => handlePrimary1GradientChange('seed2', e.target.value)} className="w-full bg-transparent p-2 text-white outline-none" />
                  </div>
                </LabeledInput>
              </div>
            )}
          </>
        )}
      </InputGroup>
    );
  };
  
  const renderNotificationColorControls = (notifKey: 'success' | 'warning' | 'danger', name: string) => {
    const brand = settings.notifications[notifKey];
    return (
      <InputGroup title={`${name} Notification Color`}>
        <LabeledInput label="Seed Hex" id={`${notifKey}-seed`}>
          <div className="flex items-center bg-gray-700 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
            <input type="color" value={brand.seed} onChange={(e) => handleNotificationColorChange(notifKey, 'seed', e.target.value)} className="w-10 h-10 p-1 bg-transparent border-none rounded-l-md" />
            <input type="text" id={`${notifKey}-seed`} value={brand.seed} onChange={(e) => handleNotificationColorChange(notifKey, 'seed', e.target.value)} className="w-full bg-transparent p-2 text-white outline-none"/>
          </div>
        </LabeledInput>
        <LabeledInput label={`Hue (H)`} id={`${notifKey}-hue`}>
            <input type="range" min="0" max="360" value={brand.hue} onChange={(e) => handleNotificationColorChange(notifKey, 'hue', e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
            <span className="text-xs text-center text-gray-400">{brand.hue}</span>
        </LabeledInput>
        <LabeledInput label={`Chroma (C)`} id={`${notifKey}-chroma`}>
            <input type="range" min="0" max="0.3" step="0.01" value={brand.chroma} onChange={(e) => handleNotificationColorChange(notifKey, 'chroma', e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
             <span className="text-xs text-center text-gray-400">{brand.chroma}</span>
        </LabeledInput>
        <div className="sm:col-span-2">
            <LabeledInput label={`Lightness (L) Stops (10 values from 50 to 900)`} id={`${notifKey}-stops`}>
                <input type="text" id={`${notifKey}-stops`} value={brand.stops} onChange={(e) => handleNotificationStopsChange(notifKey, e.target.value)} className="w-full bg-gray-700 p-2 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
            </LabeledInput>
        </div>
      </InputGroup>
    );
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Modern CSS Generator</h1>
        <p className="text-gray-400 mt-2">Create a design system with OKLCH color ramps, fluid typography, and semantic tokens.</p>
      </header>
      
      <section id="inputs">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">1. Define Your Style</h2>
        {renderColorControls('primary1', 'Primary 1')}
        {renderColorControls('primary2', 'Primary 2')}
        {renderColorControls('accent', 'Accent')}

        <InputGroup title="Neutral Colors">
            <LabeledInput label={`Hue (H)`} id="neutral-hue">
                <input type="range" min="0" max="360" value={settings.neutral.hue} onChange={(e) => onSettingsChange({...settings, neutral: {...settings.neutral, hue: Number(e.target.value)}})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                 <span className="text-xs text-center text-gray-400">{settings.neutral.hue}</span>
            </LabeledInput>
            <LabeledInput label={`Chroma (C)`} id="neutral-chroma">
                <input type="range" min="0" max="0.1" step="0.005" value={settings.neutral.chroma} onChange={(e) => onSettingsChange({...settings, neutral: {...settings.neutral, chroma: Number(e.target.value)}})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                 <span className="text-xs text-center text-gray-400">{settings.neutral.chroma}</span>
            </LabeledInput>
             <div className="sm:col-span-2">
                <LabeledInput label={`Lightness (L) Stops (12 values from 25 to 950)`} id="neutral-stops">
                    <input type="text" id="neutral-stops" value={settings.neutral.stops} onChange={(e) => handleStopsChange('neutral', e.target.value)} className="w-full bg-gray-700 p-2 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                </LabeledInput>
            </div>
        </InputGroup>

        {renderNotificationColorControls('success', 'Success')}
        {renderNotificationColorControls('warning', 'Warning')}
        {renderNotificationColorControls('danger', 'Danger')}

        <InputGroup title="Typography">
            <LabeledInput label="Default Font (Google Fonts)" id="font-base">
                <input type="text" id="font-base" value={settings.fonts.base} onChange={(e) => handleFontChange('base', e.target.value)} className="w-full bg-gray-700 p-2 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
            </LabeledInput>
            <LabeledInput label="Heading Font (Google Fonts)" id="font-heading">
                <input type="text" id="font-heading" value={settings.fonts.heading} onChange={(e) => handleFontChange('heading', e.target.value)} className="w-full bg-gray-700 p-2 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
            </LabeledInput>
        </InputGroup>

      </section>

      <section id="outputs" className="mt-12">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-400">2. Get Your Code</h2>
            <button onClick={handleFigmaExport} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Export Figma Variables
            </button>
        </div>
        
        <CodeBlock title="Complete CSS File (All-in-one)" code={generateFullCss(settings)} />
        <CodeBlock title="Color Ramps" code={generateColorRamps(settings)} />
        <CodeBlock title="Semantic Tokens" code={generateSemanticTokens(settings)} />
        <CodeBlock title="Global Base Styles" code={generateGlobalStyles(settings)} />
        <CodeBlock title="Component Styles" code={generateComponentCss(settings)} />
        <CodeBlock title="Spacing Scale" code={generateSpacingScale()} />
        <CodeBlock title="Typography Scale" code={generateTypographyScale()} />
        <CodeBlock title="Radii, Shadows, Borders" code={generateRadiiShadowsBorders()} />
        <CodeBlock title="OS Preference" code={generateOsPreference()} />
        <CodeBlock title="Visually Hidden Utility" code={generateVisuallyHidden()} />
      </section>
    </div>
  );
};
