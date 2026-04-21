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
}

export interface SkillSection {
  id: string;
  title: string;
  content: string;
  skills: string[];
}

export enum LightingPhase {
  NAV = 'NAV',
  CONTENT = 'CONTENT',
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface LightingState {
  phase: LightingPhase;
  isFlashActive: boolean;
}

export interface BentoGridItem {
  colSpan?: number;
  rowSpan?: number;
}

export type NavWindowTheme = 'career' | 'about' | 'projects' | 'contact';

export interface NavTab {
  id: string;
  label: string;
  theme: NavWindowTheme;
  description?: string;
}

export interface HeroData {
  name: string;
  roles: string[];
  tagline: string;
}
