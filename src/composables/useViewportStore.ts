import { reactive } from "vue";

interface ViewportOffset {
	left: number;
	top: number;
}

interface ComponentRegistration {
	el: HTMLElement;
	offsets: ViewportOffset;
}

// Singleton state
const registeredComponents = reactive<Map<string, ComponentRegistration>>(
	new Map(),
);
const mousePosition = reactive({ x: 0, y: 0 });

/**
 * Singleton service for coordinating viewport-relative offsets
 * to prevent layout thrashing from multiple scroll/resize listeners.
 */
export function useViewportStore() {
	const register = (id: string, el: HTMLElement) => {
		const update = () => {
			const rect = el.getBoundingClientRect();
			if (!rect) return;
			registeredComponents.set(id, {
				el,
				offsets: { left: rect.left || 0, top: rect.top || 0 },
			});
		};

		// Initial update
		update();

		return { update, unregister: () => registeredComponents.delete(id) };
	};

	const getOffsets = (id: string): ViewportOffset => {
		return registeredComponents.get(id)?.offsets || { left: 0, top: 0 };
	};

	return {
		register,
		getOffsets,
		mousePosition,
		registeredComponents,
	};
}

// Global listener for all registered elements
let isListening = false;

export function initGlobalViewportService() {
	if (isListening) return;

	const updateAll = () => {
		for (const [id, reg] of registeredComponents) {
			const rect = reg.el.getBoundingClientRect();
			reg.offsets.left = rect.left;
			reg.offsets.top = rect.top;
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		mousePosition.x = e.clientX;
		mousePosition.y = e.clientY;

		// 1. Update global mask variables (raw pixels)
		document.documentElement.style.setProperty("--mask-x", `${e.clientX}px`);
		document.documentElement.style.setProperty("--mask-y", `${e.clientY}px`);

		// 2. Update spotlight beam (percentages) - only in CONTENT phase
		// Note: We import useLightingEngine here or access its state
		// To avoid circular dependency, we can just update variables if they exist
		// or use a more robust way. For now, we'll just update them if in CONTENT mode.
		// Actually, let's just update the variables and let the CSS handle it if needed.
		const xPct = (e.clientX / window.innerWidth) * 100;
		const yPct = (e.clientY / window.innerHeight) * 100;
		document.documentElement.style.setProperty("--spotlight-x-raw", `${xPct}%`);
		document.documentElement.style.setProperty("--spotlight-y-raw", `${yPct}%`);
	};

	window.addEventListener("scroll", updateAll, {
		passive: true,
		capture: true,
	});
	window.addEventListener("resize", updateAll, { passive: true });
	window.addEventListener("mousemove", handleMouseMove, { passive: true });

	isListening = true;
}
