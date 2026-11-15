// Preview build only: stands in for vite-plugin-pwa's virtual module (service workers are blocked in the artifact frame).
import { useState } from 'react';
export function useRegisterSW() {
  const needRefresh = useState(false);
  const offlineReady = useState(false);
  return { needRefresh, offlineReady, updateServiceWorker: async () => {} };
}
