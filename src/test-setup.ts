import { config } from '@vue/test-utils';
import i18n from '@/i18n';

// Set locale to EN for tests (all test assertions use English strings)
i18n.global.locale.value = 'en';

config.global.plugins = [...(config.global.plugins || []), i18n];
