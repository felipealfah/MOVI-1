import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ code, language, title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white overflow-hidden" style={{ backgroundColor: '#131313' }}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">{title}</span>
            <span className="text-white opacity-40 text-xs">{language}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-1 text-white hover:text-gray-300 transition-colors"
            title="Copy code"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-1.5 bg-white text-black hover:bg-gray-200 transition-colors rounded"
            title="Copy code"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
        <pre className="p-4 overflow-x-auto text-xs md:text-sm">
          <code className="text-white font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
