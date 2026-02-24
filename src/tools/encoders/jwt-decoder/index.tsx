import { useState } from 'react';

function decodeJwt(token: string): { header: object; payload: object; signature: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decode = (str: string) => {
      const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - (str.length % 4)) % 4, '=');
      return JSON.parse(atob(padded));
    };
    return {
      header: decode(parts[0]),
      payload: decode(parts[1]),
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function JsonBlock({ label, data }: { label: string; data: object }) {
  return (
    <div>
      <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1.5">{label}</div>
      <pre className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono overflow-x-auto text-gray-800 dark:text-slate-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const decoded = token.trim() ? decodeJwt(token.trim()) : null;
  const hasToken = token.trim().length > 0;

  const payload = decoded?.payload as Record<string, unknown> | undefined;
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const isExpired = exp ? exp * 1000 < Date.now() : false;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste a JWT token (eyJ…)"
          className="w-full h-28 p-3 text-sm font-mono border border-[var(--color-border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent break-all"
        />
      </div>

      {hasToken && !decoded && (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          Invalid JWT format. Token must have 3 parts separated by dots.
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {(exp || iat) && (
            <div className="flex flex-wrap gap-3">
              {iat && (
                <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                  Issued: {formatTime(iat)}
                </div>
              )}
              {exp && (
                <div className={`text-xs px-3 py-1.5 rounded-full ${isExpired ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
                  {isExpired ? '✗ Expired' : '✓ Valid until'}: {formatTime(exp)}
                </div>
              )}
            </div>
          )}
          <JsonBlock label="Header" data={decoded.header} />
          <JsonBlock label="Payload" data={decoded.payload} />
          <div>
            <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1.5">Signature</div>
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-gray-800 dark:text-slate-200 break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
