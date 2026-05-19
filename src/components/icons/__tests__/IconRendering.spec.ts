import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ChevronUpIcon from '../ChevronUpIcon.vue';
import DiscordIcon from '../DiscordIcon.vue';
import EmailIcon from '../EmailIcon.vue';
import EnvelopeIcon from '../EnvelopeIcon.vue';
import LampIcon from '../LampIcon.vue';
import LinkedinIcon from '../LinkedinIcon.vue';
import ThemeToggleIcon from '../ThemeToggleIcon.vue';
import XingIcon from '../XingIcon.vue';

describe('Icon Components', () => {
  const icons: {
    name: string;
    comp: Parameters<typeof mount>[0];
    props?: Record<string, unknown>;
  }[] = [
    { name: 'ChevronUpIcon', comp: ChevronUpIcon },
    { name: 'DiscordIcon', comp: DiscordIcon },
    { name: 'EmailIcon', comp: EmailIcon },
    { name: 'EnvelopeIcon', comp: EnvelopeIcon },
    { name: 'LampIcon', comp: LampIcon, props: { lightingEnabled: true } },
    { name: 'LinkedinIcon', comp: LinkedinIcon },
    { name: 'ThemeToggleIcon', comp: ThemeToggleIcon, props: { isBlueprint: true } },
    { name: 'XingIcon', comp: XingIcon },
  ];

  it.each(icons)('should render $name correctly as an SVG', ({ comp, props }) => {
    const wrapper = mount(comp, { props });
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.html()).toMatch(/path|circle|rect|polyline|line|polygon|ellipse/);
  });

  it('LampIcon shows light rays when lightingEnabled is true', () => {
    const wrapper = mount(LampIcon, { props: { lightingEnabled: true } });
    // Should render the 5 light ray lines inside the template v-if
    const lines = wrapper.findAll('line');
    expect(lines.length).toBe(5);
    expect(wrapper.find('svg').classes()).toContain('drop-shadow-[0_0_15px_currentColor]');
  });

  it('LampIcon hides light rays when lightingEnabled is false', () => {
    const wrapper = mount(LampIcon, { props: { lightingEnabled: false } });
    const lines = wrapper.findAll('line');
    expect(lines.length).toBe(0);
    expect(wrapper.find('svg').classes()).toContain('opacity-40');
  });

  it('ThemeToggleIcon renders correctly with isBlueprint false', () => {
    const wrapper = mount(ThemeToggleIcon, { props: { isBlueprint: false } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
