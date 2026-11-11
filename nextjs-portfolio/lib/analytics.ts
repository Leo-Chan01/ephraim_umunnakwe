import { supabase } from './supabase';

const SESSION_KEY = 'pv_session_id';
const SEEN_KEY = 'pv_seen_paths';

function getSessionId(): string | null {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

// Returns true the first time a path is seen in this browser session
function markSeen(path: string): boolean {
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]');
    if (seen.includes(path)) return false;
    seen.push(path);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    return true;
  } catch {
    return true;
  }
}

export type ShareMethod = 'native' | 'copy' | 'x' | 'linkedin' | 'whatsapp' | 'facebook';

/** Records that a blog post was shared via one of the share buttons. Never throws. */
export async function trackShare(slug: string, method: ShareMethod): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const { error } = await supabase.from('blog_shares').insert({
      slug,
      method,
      session_id: getSessionId(),
    });
    if (error) console.warn('Share tracking failed:', error.message);
  } catch (error) {
    console.warn('Share tracking failed:', error);
  }
}

/**
 * Records a page view in Supabase. Skips admin pages and repeat views
 * of the same path within a browser session (so refreshes don't inflate counts).
 */
export async function trackPageView(rawPath: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const path = (rawPath.split(/[?#]/)[0] || '/').replace(/(.)\/$/, '$1');
  if (path.startsWith('/admin')) return;
  if (!markSeen(path)) return;

  try {
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      user_agent: navigator.userAgent.slice(0, 500),
    });
    if (error) console.warn('Page view tracking failed:', error.message);
  } catch (error) {
    console.warn('Page view tracking failed:', error);
  }
}
