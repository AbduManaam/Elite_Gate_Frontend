import React, { useState } from 'react';
import { MOCK_CREDENTIALS } from '../../../shared/mocks/identityMock';

export const ApiKeysList: React.FC = () => {
  const [credentialSubTab, setCredentialSubTab] = useState<'OAuth Clients' | 'Keys' | 'Service Accounts'>('Keys');
  const [keySearchQuery, setKeySearchQuery] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const filteredCredentials = MOCK_CREDENTIALS.filter((key) => {
    return key.name.toLowerCase().includes(keySearchQuery.toLowerCase()) ||
           key.permissions.toLowerCase().includes(keySearchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-lg text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">API Credentials</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-normal">
            Manage access tokens and client secrets for programmatic access.
          </p>
        </div>
        <button className="bg-[#113346] text-white px-gutter py-2 rounded-lg font-semibold text-xs flex items-center gap-stack-xs hover:opacity-90 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Generate Key
        </button>
      </div>

      {/* Sub-nav */}
      <div className="border-b border-outline-variant flex gap-stack-lg">
        {(['OAuth Clients', 'Keys', 'Service Accounts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setCredentialSubTab(tab)}
            className={`font-semibold text-sm pb-2 border-b-2 transition-all cursor-pointer ${
              credentialSubTab === tab
                ? 'text-[#113346] border-[#113346]'
                : 'text-on-surface-variant border-transparent hover:text-[#113346]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {credentialSubTab === 'Keys' ? (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-white">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="pl-9 pr-4 py-1 text-sm border border-outline-variant rounded-md focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] outline-none w-48 md:w-64"
                placeholder="Filter keys..."
                type="text"
                value={keySearchQuery}
                onChange={(e) => setKeySearchQuery(e.target.value)}
              />
            </div>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-1 rounded-md transition-colors border border-outline-variant cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant font-semibold text-xs text-on-surface-variant">
                <tr>
                  <th className="py-3 px-gutter font-medium">Name</th>
                  <th className="py-3 px-gutter font-medium">Prefix</th>
                  <th className="py-3 px-gutter font-medium">Permissions</th>
                  <th className="py-3 px-gutter font-medium">Expiration</th>
                  <th className="py-3 px-gutter font-medium">Last Used</th>
                  <th className="py-3 px-gutter font-medium">Status</th>
                  <th className="py-3 px-gutter w-[48px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm text-on-surface">
                {filteredCredentials.map((key) => (
                  <tr key={key.id} className={`hover:bg-surface-container-low transition-colors group ${key.status === 'Revoked' ? 'opacity-60 bg-slate-50/50' : ''}`}>
                    <td className={`py-4 px-gutter font-medium ${key.status === 'Revoked' ? 'line-through text-outline' : ''}`}>
                      {key.name}
                    </td>
                    <td className="py-4 px-gutter font-mono text-xs text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span>{key.prefix}</span>
                        {key.status === 'Active' && (
                          <button
                            onClick={() => handleCopy(key.id, key.prefix)}
                            className="text-outline hover:text-primary opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#587c94]">
                              {copiedKeyId === key.id ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-gutter">
                      <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant border border-outline-variant text-[10px] font-medium tracking-wide">
                        {key.permissions}
                      </span>
                    </td>
                    <td className="py-4 px-gutter text-on-surface-variant text-xs">{key.expiration}</td>
                    <td className="py-4 px-gutter text-on-surface-variant text-xs">{key.lastUsed}</td>
                    <td className="py-4 px-gutter">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className={`w-2 h-2 rounded-full ${key.status === 'Active' ? 'bg-emerald-500' : 'bg-error'}`}></div>
                        <span className={`font-semibold ${key.status === 'Active' ? 'text-emerald-700' : 'text-error'}`}>
                          {key.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-gutter text-right">
                      <button className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[20px] text-[#587c94]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-stack-md border-t border-outline-variant flex justify-between items-center bg-white text-xs text-on-surface-variant">
            <span>Showing {filteredCredentials.length} of {MOCK_CREDENTIALS.length} keys</span>
            <div className="flex items-center gap-stack-sm">
              <button className="p-1 rounded text-outline hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px] text-[#587c94]">chevron_left</span>
              </button>
              <button className="p-1 rounded text-outline hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px] text-[#587c94]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-xl border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium bg-white shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">hourglass_empty</span>
          {credentialSubTab} Screen is under active backend development.
        </div>
      )}
    </div>
  );
};

export default ApiKeysList;
