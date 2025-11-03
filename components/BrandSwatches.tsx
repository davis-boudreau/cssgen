import React from 'react';

interface Swatch {
  token: string;
  hex: string;
}

interface BrandSwatchesProps {
  swatches: Swatch[];
}

export const BrandSwatches: React.FC<BrandSwatchesProps> = ({ swatches }) => {
  return (
    <section>
      <h3 className="text-xl font-bold mb-4 text-text-0">Brand Swatches</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {swatches.map(({ token, hex }) => {
          return (
            <div key={token} className="rounded-lg border border-border-1 overflow-hidden shadow-sm flex flex-col">
              <div
                className="h-24 w-full flex-grow flex items-end p-2"
                style={{ background: `var(${token})` }}
              >
                 <div className="p-1 rounded-sm bg-black/40 backdrop-blur-sm">
                    <span className="font-mono text-xs text-white">
                        {token}
                    </span>
                 </div>
              </div>
              <div className="bg-surface-2 p-2 text-center">
                <span className="font-mono text-xs text-text-2">{hex}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
