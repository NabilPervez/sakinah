export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

/** Shows a system notification via the service worker (works on Android/iOS PWA), falling back to the page API. */
export async function showSystemNotification(title: string, opts: { body: string; tag: string; url?: string; requireInteraction?: boolean }) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  const options: NotificationOptions & { vibrate?: number[]; renotify?: boolean } = {
    body: opts.body,
    tag: opts.tag,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: { url: opts.url ?? '/today' },
    requireInteraction: opts.requireInteraction,
    vibrate: [120, 80, 120],
    renotify: true,
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) { await reg.showNotification(title, options); return true; }
    const n = new Notification(title, options);
    n.onclick = () => { window.focus(); if (opts.url) window.location.assign(opts.url); n.close(); };
    return true;
  } catch {
    return false;
  }
}
