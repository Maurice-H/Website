import type { ContactMethod } from '@/types';

export const CONTACT_METHODS: ContactMethod[] = [
  {
    id: 'github',
    label: 'GitHub',
    value: 'Maurice-H',
    icon: 'github',
    action: 'link',
    url: 'https://github.com/Maurice-H',
  },
  {
    id: 'email',
    label: 'Email',
    value: 'maurice_hanl@outlook.de',
    icon: 'email',
    action: 'copy',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'maurice-hanl',
    icon: 'linkedin',
    action: 'link',
    url: 'https://www.linkedin.com/in/maurice-hanl',
  },
  {
    id: 'xing',
    label: 'Xing',
    value: 'Maurice_Hanl',
    icon: 'xing',
    action: 'link',
    url: 'https://www.xing.com/profile/Maurice_Hanl',
  },
  {
    id: 'discord',
    label: 'Discord',
    value: 'mauzi_i',
    icon: 'discord',
    action: 'copy',
  },
];
