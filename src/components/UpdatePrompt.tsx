import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { applyUpdate } from '../utils/appUpdate';

const CHECK_EVERY_MS = 30 * 60_000;

/** Floating pill shown when a newer version is deployed. One tap updates and reloads. */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (!reg) return;
      // Look for new deploys periodically and whenever the app comes back to the foreground.
      setInterval(() => reg.update().catch(() => {}), CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    },
  });

  useEffect(() => {
    if (needRefresh) navigator.vibrate?.(30);
  }, [needRefresh]);

  if (!needRefresh) return null;
  return (
    <div className="update-pill animate-fade-up" role="status" aria-live="polite">
      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 20 }}>system_update</span>
      <span className="update-text">A new version is ready</span>
      <button className="update-btn" onClick={() => { updateServiceWorker(true).catch(() => {}); applyUpdate(); }}>Update now</button>
      <button className="update-x" aria-label="Later" onClick={() => setNeedRefresh(false)}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
      </button>
    </div>
  );
}
