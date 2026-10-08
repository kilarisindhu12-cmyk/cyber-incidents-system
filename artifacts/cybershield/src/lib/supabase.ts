/**
 * Supabase client and helper integration
 * Connects to Supabase REST and Auth endpoints when environment variables are supplied.
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project') &&
    SUPABASE_URL.startsWith('http')
  );
}

export interface SupabaseQueryOptions {
  headers?: Record<string, string>;
  token?: string;
}

export async function supabaseRest<T = any>(
  endpoint: string,
  options: RequestInit & SupabaseQueryOptions = {}
): Promise<{ data: T | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${cleanEndpoint}`;

  const customHeaders: Record<string, string> = {};
  if (options.headers) {
    if (Array.isArray(options.headers)) {
      for (const [k, v] of options.headers) customHeaders[k] = v;
    } else if (typeof (options.headers as any).forEach === 'function') {
      (options.headers as Headers).forEach((v, k) => {
        customHeaders[k] = v;
      });
    } else {
      Object.assign(customHeaders, options.headers);
    }
  }

  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${options.token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...customHeaders,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { data: null, error: new Error(`Supabase error (${res.status}): ${errorText}`) };
    }

    if (res.status === 204) {
      return { data: null, error: null };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
