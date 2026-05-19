import type { NavTab, SkillSection } from '@/types';

export const NAV_TABS: NavTab[] = [
  {
    id: 'about',
    label: 'About Me',
    labelKey: 'nav.aboutMe',
    theme: 'about',
    targetSection: 'hero-section',
  },
  {
    id: 'projects',
    label: 'Projects',
    labelKey: 'nav.projects',
    theme: 'projects',
    targetSection: 'projects-section',
  },
  {
    id: 'skills',
    label: 'Experience',
    labelKey: 'nav.experience',
    theme: 'career',
    targetSection: 'about-discovery',
  },
  {
    id: 'contact',
    label: 'Get in Touch',
    labelKey: 'nav.contact',
    theme: 'contact',
    targetSection: 'contact-form',
  },
];

export const SKILL_SECTIONS: SkillSection[] = [
  {
    id: 'bio',
    title: 'Discovery Path',
    content: '', // Content sourced from i18n locale files (skills.bio)
    skills: [],
  },
  {
    id: 'stack',
    title: 'STACK',
    content: '',
    skills: [],
    categories: [
      {
        name: 'skills.categories.languages',
        skills: ['C#', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS', 'SCSS'],
      },
      {
        name: 'skills.categories.frameworks',
        skills: ['Vue.js', 'Node.js', 'Pinia', 'Tailwind CSS', 'WebGL', 'Three.js', 'Vite'],
      },
      {
        name: 'skills.categories.cloud',
        skills: [
          'AWS',
          'Serverless Architecture',
          'Terraform',
          'Docker Compose',
          'Docker',
          'CI/CD',
          'GitHub Actions',
          'Git',
        ],
      },
      {
        name: 'skills.categories.architecture',
        skills: [
          'AI-Assisted Software Engineering',
          'Spec-Driven Development (SDD)',
          'Softwarearchitektur',
          'Frontend Architecture',
          'Microservices',
          'REST APIs',
          'MVVM',
        ],
      },
      {
        name: 'skills.categories.testing',
        skills: [
          'Qualitätssicherung',
          'End-To-End-Tests',
          'Cypress',
          'Playwright',
          'Vitest',
          'Lighthouse',
        ],
      },
      {
        name: 'skills.categories.design',
        skills: ['UX/UI Design', 'User Experience (UX)', 'UI', 'Frontend-Design', 'Figma'],
      },
    ],
  },
];

export interface SocialLink {
  id: string;
  label: string;
  icon: string;
  url?: string;
  copyValue?: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'discord',
    label: 'Discord',
    icon: 'discord',
    copyValue: 'mauzi_i',
  },
  {
    id: 'xing',
    label: 'Xing',
    icon: 'xing',
    url: 'https://www.xing.com/profile/Maurice_Hanl',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/in/maurice-hanl',
  },
];
