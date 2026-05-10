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
    const icons = [
        { name: 'ChevronUpIcon', comp: ChevronUpIcon },
        { name: 'DiscordIcon', comp: DiscordIcon },
        { name: 'EmailIcon', comp: EmailIcon },
        { name: 'EnvelopeIcon', comp: EnvelopeIcon },
        { name: 'LampIcon', comp: LampIcon },
        { name: 'LinkedinIcon', comp: LinkedinIcon },
        { name: 'ThemeToggleIcon', comp: ThemeToggleIcon },
        { name: 'XingIcon', comp: XingIcon },
    ];
    it.each(icons)('should render $name correctly as an SVG', ({ comp }) => {
        const wrapper = mount(comp);
        expect(wrapper.find('svg').exists()).toBe(true);
        // Ensure it has some path or circle or similar content
        expect(wrapper.html()).toMatch(/path|circle|rect|polyline|line|polygon|ellipse/);
    });
});
