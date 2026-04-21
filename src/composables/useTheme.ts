import { ref, watch } from "vue";

const isBlueprint = ref(false);

// Singleton watcher — runs once at module level, not per component call
if (typeof window !== "undefined") {
	watch(isBlueprint, (newVal) => {
		if (newVal) {
			document.documentElement.setAttribute("data-theme", "blueprint");
		} else {
			document.documentElement.removeAttribute("data-theme");
		}
	});
}

export function useTheme() {
	const toggleTheme = () => {
		isBlueprint.value = !isBlueprint.value;
	};

	return {
		isBlueprint,
		toggleTheme,
	};
}
