
import React from 'react';
import type { Token } from '../types';

interface ColorSwatchesProps {
  title: string;
  tokens: Token[];
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({ title, tokens }) => {
  return (
    <div>
      <h4 className="text-lg font-bold mb-2 text-text-0">{title}</h4>
      <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {tokens.map((token) => (
          <div key={token.token} className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-md border border-border-1"
              style={{ backgroundColor: `var(${token.token})` }}
            ></div>
            <span className="mt-1 text-xs font-mono text-text-2">{token.token.split('-').pop()}</span>
            <span className="text-xs font-mono text-text-2">{token.hex}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
