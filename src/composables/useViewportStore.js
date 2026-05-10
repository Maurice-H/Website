import { useViewportStore as usePiniaViewportStore } from '../stores/viewport';
export function useViewportStore() {
    return usePiniaViewportStore();
}
/**
 * Compatibility shim for legacy service initialization
 */
export function initGlobalViewportService() {
    const store = usePiniaViewportStore();
    store.init();
}
