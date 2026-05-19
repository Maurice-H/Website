/**
 * Safely removes the LCP skeleton element from the DOM once Vue takes over rendering.
 * Encapsulating this avoids direct imperative DOM actions in Vue components.
 */
export function removeLcpSkeleton(): void {
  if (typeof document !== 'undefined') {
    const skeleton = document.getElementById('lcp-skeleton');
    if (skeleton && typeof skeleton.remove === 'function') {
      skeleton.remove();
    }
  }
}
