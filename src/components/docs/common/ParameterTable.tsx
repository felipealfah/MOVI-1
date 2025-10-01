import React from 'react';

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  example?: string;
}

interface ParameterTableProps {
  parameters: Parameter[];
  title?: string;
}

export default function ParameterTable({ parameters, title = "Parameters" }: ParameterTableProps) {
  return (
    <div className="border border-white overflow-hidden" style={{ backgroundColor: '#212121' }}>
      <div className="px-4 py-3 border-b border-white">
        <h4 className="text-white font-medium">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white">
            <tr style={{ backgroundColor: '#131313' }}>
              <th className="px-4 py-2 text-left text-white text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-white text-sm font-medium">Type</th>
              <th className="px-4 py-2 text-left text-white text-sm font-medium">Required</th>
              <th className="px-4 py-2 text-left text-white text-sm font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {parameters.map((param, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <code className="text-white font-mono text-sm">{param.name}</code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-blue-300 text-xs">{param.type}</code>
                </td>
                <td className="px-4 py-3">
                  {param.required ? (
                    <span className="text-red-400 text-xs font-medium">Required</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Optional</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-white opacity-80 text-sm mb-1">{param.description}</p>
                  {param.default && (
                    <p className="text-white opacity-60 text-xs">Default: <code>{param.default}</code></p>
                  )}
                  {param.example && (
                    <p className="text-white opacity-60 text-xs">Example: <code>{param.example}</code></p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
