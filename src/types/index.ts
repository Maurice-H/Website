export interface ThemeState {
  isBlueprint: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
  repoUrl?: string;
  language?: string;
  stars?: number;
  updatedAt?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillSection {
  id: string;
  title: string;
  content: string;
  skills: string[];
  categories?: SkillCategory[];
}

export const LightingPhase = {
  NAV: 'NAV',
  CONTENT: 'CONTENT',
} as const;

export type LightingPhase = (typeof LightingPhase)[keyof typeof LightingPhase];

export type NavWindowTheme = 'career' | 'about' | 'projects' | 'contact';

export interface NavTab {
  id: string;
  label: string;
  labelKey?: string;
  theme: NavWindowTheme;
  description?: string;
  targetSection?: string;
}

export interface ContactMethod {
  id: string;
  label: string;
  value: string;
  icon: string;
  action: 'link' | 'copy';
  url?: string;
}

export * from './webgl';
