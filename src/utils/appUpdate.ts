/**
 * Reliable "apply update": activate the waiting service worker and reload.
 * Falls back to a hard reload so the button never does nothing (Nabil, 2026-11-15).
 */
export async function applyUpdate(): Promise<void> {
  const reg = await navigator.serviceWorker?.getRegistration();
  let reloaded = false;
  const reload = () => { if (!reloaded) { reloaded = true; window.location.reload(); } };
  navigator.serviceWorker?.addEventListener('controllerchange', reload);
  if (reg?.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
  setTimeout(reload, 2500);
}

/** Ask the server for a newer version. Resolves true if one is waiting. */
export async function checkForUpdate(): Promise<boolean> {
  const reg = await navigator.serviceWorker?.getRegistration();
  if (!reg) return false;
  await reg.update().catch(() => {});
  if (reg.installing) await new Promise((r) => reg.installing!.addEventListener('statechange', r, { once: true }));
  return !!reg.waiting;
}
