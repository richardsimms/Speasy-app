'use client';

import { useState } from 'react';

export function SyncUserButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Failed to sync user';
        const details = data.details ? `\nDetails: ${JSON.stringify(data.details, null, 2)}` : '';
        throw new Error(`${errorMsg}${details}`);
      }

      setMessage(`User synced successfully! Email: ${data.user?.email || 'N/A'}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Syncing...' : 'Sync to Supabase'}
      </button>
      {message && (
        <p className="mt-2 text-sm text-green-600">{message}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
