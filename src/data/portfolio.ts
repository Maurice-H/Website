import type { HeroData, NavTab, PortfolioProject, SkillSection } from "../types";

export const HERO_DATA: HeroData = {
	name: "Alex",
	roles: ["Developer", "Architect", "Creator"],
	tagline: "A Junior Software Developer obsessed with performance, dynamic interfaces, and pixel-perfect design.",
};

export const NAV_TABS: NavTab[] = [
	{ id: "about", label: "About Me", theme: "about" },
	{ id: "projects", label: "Projects", theme: "projects" },
	{ id: "skills", label: "Experience", theme: "career" },
	{ id: "contact", label: "Get in Touch", theme: "contact" },
];

export const PROJECTS: PortfolioProject[] = [
	{
		id: "1",
		title: "Neon E-Commerce",
		description:
			"A blazing fast headless storefront built with Nuxt 3 and Shopify Storefront API. Designed for high conversion rates with sub-second page loads.",
		tags: ["Vue 3", "Nuxt", "GraphQL", "Tailwind CSS"],
		imageUrl: "",
	},
	{
		id: "2",
		title: "FlowState Dashboard",
		description:
			"Real-time analytics dashboard featuring WebSockets integration and D3.js interactive data visualizations for enterprise clients.",
		tags: ["TypeScript", "WebSocket", "D3.js", "Vitest"],
		imageUrl: "",
	},
];

export const SKILL_SECTIONS: SkillSection[] = [
	{
		id: "bio",
		title: "Discovery Path",
		content: "I bridge the gap between creative design and robust engineering. My journey is defined by a relentless pursuit of performance and pixel perfection.",
		skills: [],
	},
	{
		id: "stack",
		title: "STACK",
		content: "",
		skills: [
			"Vue 3",
			"TypeScript",
			"Node.js",
			"Tailwind",
			"PostgreSQL",
			"Three.js",
			"Vite",
			"GraphQL",
		],
	},
];
