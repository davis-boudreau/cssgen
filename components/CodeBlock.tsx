
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';
import { copyToClipboard } from '../utils/helpers';

interface CodeBlockProps {
  title: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-700">
        <h4 className="font-mono text-sm text-purple-300">{title}</h4>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
          aria-label={`Copy ${title} to clipboard`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};
