import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/**
 * Returns a Set of admin emails from the ADMIN_EMAILS env var.
 * Comma or newline separated.
 */
export function getAdminEmailAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || '';
  const list = raw
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set(list);
}

export async function getSessionOrNull() {
  try {
    const session = await getServerSession(authOptions);
    return session ?? null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ email: string; id: string } | null> {
  const session = await getSessionOrNull();
  // Cast loosely to avoid brittle type coupling
  const email = (session as unknown as { user?: { email?: string | null } } | null)?.user?.email?.toLowerCase();
  const id = (session as unknown as { user?: { id?: string } })?.user?.id;

  if (!email || !id) return null;

  const allowlist = getAdminEmailAllowlist();
  if (allowlist.size === 0) return null; // Explicitly require configuration

  if (allowlist.has(email)) {
    return { email, id };
  }
  return null;
}


