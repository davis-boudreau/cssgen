import React, { useMemo, useState } from 'react';
import type { ThemeSettings, Token, ColorSettings, NeutralSettings } from '../types';
import { oklchToHex } from '../utils/color';
import { ColorSwatches } from './ColorSwatches';
import { BrandSwatches } from './BrandSwatches';
import { ChevronDownIcon } from './icons';

interface PreviewProps {
  theme: 'light' | 'dark';
  settings: ThemeSettings;
}

const generateTokens = (prefix: string, color: ColorSettings | NeutralSettings): Token[] => {
    const stops = color.stops.split(',').map(s => parseFloat(s.trim()));
    const names = prefix === 'neutral' 
      ? [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      : [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    
    return stops.map((l, i) => {
        const tokenName = `--${prefix}-${names[i]}`;
        return {
            token: tokenName,
            hex: oklchToHex(l, color.chroma, color.hue),
            l, c: color.chroma, h: color.hue
        };
    });
};


export const Preview: React.FC<PreviewProps> = ({ theme, settings }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [openAccordion, setOpenAccordion] = useState<string | null>('accordion1');
  const [sliderValue, setSliderValue] = useState(50);

  const p1Tokens = useMemo(() => generateTokens('p1', settings.primary1), [settings.primary1]);
  const p2Tokens = useMemo(() => generateTokens('p2', settings.primary2), [settings.primary2]);
  const accentTokens = useMemo(() => generateTokens('accent', settings.accent), [settings.accent]);
  const neutralTokens = useMemo(() => generateTokens('neutral', settings.neutral), [settings.neutral]);
  
  const notificationTokens = useMemo(() => {
    return {
      success: generateTokens('success', settings.notifications.success),
      warning: generateTokens('warning', settings.notifications.warning),
      danger: generateTokens('danger', settings.notifications.danger),
    };
  }, [settings.notifications]);

  const brandSwatches = useMemo(() => {
    const findToken = (name: string, tokens: Token[]) => {
        const tokenName = `--${name}`;
        return tokens.find(t => t.token === tokenName);
    }

    const mappings = {
        light: {
            '--brand-primary': findToken('p1-600', p1Tokens),
            '--brand-secondary': findToken('p2-600', p2Tokens),
            '--brand-accent': findToken('accent-500', accentTokens),
            '--notif-success': findToken('success-600', notificationTokens.success),
            '--notif-warning': findToken('warning-600', notificationTokens.warning),
            '--notif-danger': findToken('danger-600', notificationTokens.danger),
        },
        dark: {
            '--brand-primary': findToken('p1-500', p1Tokens),
            '--brand-secondary': findToken('p2-500', p2Tokens),
            '--brand-accent': findToken('accent-400', accentTokens),
            '--notif-success': findToken('success-500', notificationTokens.success),
            '--notif-warning': findToken('warning-500', notificationTokens.warning),
            '--notif-danger': findToken('danger-500', notificationTokens.danger),
        }
    };

    return Object.entries(mappings[theme]).map(([tokenName, tokenData]) => ({
        token: tokenName,
        // FIX: Cast `tokenData` to `Token | undefined` to address a type inference issue with Object.entries, where `tokenData` was being inferred as `unknown`.
        hex: (tokenData as Token | undefined)?.hex ?? '#000000',
    }));
  }, [theme, p1Tokens, p2Tokens, accentTokens, notificationTokens]);
  
  const handleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
  
  const themeTitle = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <div data-theme={theme} className="p-4 md:p-6 lg:p-8 border-b xl:border-b-0 xl:border-r border-gray-700">
       <h2 className="text-2xl font-bold mb-6 text-text-0 text-center">{themeTitle} Theme</h2>
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h3 className="text-xl font-bold mb-4 text-text-0">Color Ramps</h3>
          <div className="space-y-4">
            <ColorSwatches title="Primary 1" tokens={p1Tokens} />
            <ColorSwatches title="Primary 2" tokens={p2Tokens} />
            <ColorSwatches title="Accent" tokens={accentTokens} />
            <ColorSwatches title="Neutral" tokens={neutralTokens} />
            <ColorSwatches title="Success" tokens={notificationTokens.success} />
            <ColorSwatches title="Warning" tokens={notificationTokens.warning} />
            <ColorSwatches title="Danger" tokens={notificationTokens.danger} />
          </div>
        </section>

        <BrandSwatches swatches={brandSwatches} />
        
        <section>
          <h3 className="text-xl font-bold mb-4 text-text-0">Typography</h3>
          <div className="space-y-4">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <p>This is a paragraph of text demonstrating the base font style. It includes a <a href="#">link</a> to show how hyperlinks are rendered. The typography is fluid and responsive to different screen sizes.</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-text-0">Components</h3>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
              </div>
            </div>
             <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Notification Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-danger">Danger</button>
              </div>
            </div>
             <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Badges</h4>
              <div className="flex flex-wrap gap-4 items-center">
                <span className="badge badge-primary">Primary</span>
                <span className="badge badge-secondary">Secondary</span>
                <span className="badge badge-accent">Accent</span>
                <span className="badge badge-success">Success</span>
                <span className="badge badge-warning">Warning</span>
                <span className="badge badge-danger">Danger</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Cards</h4>
              <div className="space-y-4">
                <div className="card">
                  <h4 className="text-lg font-bold mb-2">Default Card</h4>
                  <p className="text-text-2">This card uses the default surface color for its background.</p>
                </div>
                <div className="card card-primary">
                  <h4 className="text-lg font-bold mb-2">Primary Brand Card</h4>
                  <p>This card uses the primary brand color. Text color is adjusted for contrast.</p>
                </div>
                <div className="card card-secondary">
                  <h4 className="text-lg font-bold mb-2">Secondary Brand Card</h4>
                  <p>This card uses the secondary brand color for alternative contexts.</p>
                </div>
              </div>
            </div>
            
            <div>
                <h4 className="text-lg font-bold mb-2 text-text-0">Form Input</h4>
                <input type="text" placeholder="Enter your email..." className="input-field" />
            </div>

             <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Tabs</h4>
                <div>
                  <div className="tab-list">
                    <button className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`} onClick={() => setActiveTab('tab1')}>Tab One</button>
                    <button className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`} onClick={() => setActiveTab('tab2')}>Tab Two</button>
                    <button className={`tab-button ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => setActiveTab('tab3')}>Tab Three</button>
                  </div>
                  {activeTab === 'tab1' && <div className="tab-panel"><p>Content for Tab One.</p></div>}
                  {activeTab === 'tab2' && <div className="tab-panel"><p>Content for Tab Two.</p></div>}
                  {activeTab === 'tab3' && <div className="tab-panel"><p>Content for Tab Three.</p></div>}
                </div>
            </div>

            <div>
                <h4 className="text-lg font-bold mb-2 text-text-0">Accordion</h4>
                 <div className="accordion">
                    <div className="accordion-item">
                        <div className="accordion-header">
                            <button onClick={() => handleAccordion('accordion1')} className="flex justify-between items-center w-full">
                                <span>Accordion Item 1</span>
                                <ChevronDownIcon className={`transform transition-transform ${openAccordion === 'accordion1' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className={`accordion-content ${openAccordion === 'accordion1' ? 'open' : ''}`}>
                            <p>This is the content for the first accordion item. It is hidden by default and shown when the header is clicked.</p>
                        </div>
                    </div>
                     <div className="accordion-item">
                        <div className="accordion-header">
                            <button onClick={() => handleAccordion('accordion2')} className="flex justify-between items-center w-full">
                                <span>Accordion Item 2</span>
                                <ChevronDownIcon className={`transform transition-transform ${openAccordion === 'accordion2' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className={`accordion-content ${openAccordion === 'accordion2' ? 'open' : ''}`}>
                           <p>This is the content for the second accordion item. It demonstrates how multiple items can be managed.</p>
                        </div>
                    </div>
                 </div>
            </div>

             <div>
                <h4 className="text-lg font-bold mb-2 text-text-0">Slider</h4>
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue} 
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="slider-track"
                    style={{ '--value': sliderValue } as React.CSSProperties}
                 />
                 <p className="text-center text-text-2 text-sm mt-2">Value: {sliderValue}</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-bold mb-4 text-text-0">Lists</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Ordered List</h4>
              <ol>
                <li><a href="#">First item as a link</a></li>
                <li>Second item</li>
                <li>
                  Third item
                  <ol>
                    <li>Nested item A</li>
                    <li><a href="#">Nested item B as a link</a></li>
                  </ol>
                </li>
                <li>Fourth item</li>
              </ol>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 text-text-0">Unordered List</h4>
              <ul>
                <li>Bullet point one</li>
                <li><a href="#">Bullet point two as a link</a></li>
                <li>
                  Another point
                  <ul>
                    <li>Nested bullet</li>
                    <li><a href="#">Another nested bullet as a link</a></li>
                  </ul>
                </li>
                <li>Final bullet</li>
              </ul>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};
