/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../home/jules/.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { SOCIAL_LINKS } from '../../data/portfolio';
import { usePerformanceStore } from '../../stores/usePerformanceStore';
import { envConfig } from '../../utils/env';
import DiscordIcon from '../icons/DiscordIcon.vue';
import EmailIcon from '../icons/EmailIcon.vue';
import LinkedinIcon from '../icons/LinkedinIcon.vue';
import XingIcon from '../icons/XingIcon.vue';
import BentoCard from '../shared/BentoCard.vue';
// --- State ---
const performance = usePerformanceStore();
const turnstileSiteKey = envConfig.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
const activeChannel = ref('email');
const formState = ref('idle');
const errorMessage = ref('');
const emailError = ref('');
const copyState = ref('idle');
const honeypot = ref('');
const lastSubmitTime = ref(0);
const isMobile = ref(false);
const formData = reactive({
    name: '',
    email: '',
    message: '',
});
const channels = [
    { id: 'email', label: 'Email', icon: EmailIcon },
    { id: 'discord', label: 'Discord', icon: DiscordIcon },
    { id: 'xing', label: 'Xing', icon: XingIcon },
    { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
];
// Social data from centralized config
const discordLink = SOCIAL_LINKS.find((l) => l.id === 'discord');
const xingLink = SOCIAL_LINKS.find((l) => l.id === 'xing');
const linkedinLink = SOCIAL_LINKS.find((l) => l.id === 'linkedin');
const discordUser = discordLink?.copyValue ?? '';
const xingUrl = xingLink?.url ?? '#';
const linkedinUrl = linkedinLink?.url ?? '#';
// --- Computed ---
const submitLabel = computed(() => {
    switch (formState.value) {
        case 'submitting':
            return 'Transmitting...';
        case 'success':
            return 'Transmission Sent ✓';
        case 'error':
            return 'Retry Transmission';
        default:
            return 'Send Transmission';
    }
});
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const widgetId = ref(null);
const captchaScale = ref(1);
const renderTurnstile = () => {
    const win = window;
    if (win.turnstile) {
        nextTick(() => {
            const container = document.querySelector('.cf-turnstile');
            // We don't need to manually remove if we use a :key on the element,
            // as Vue replaces the element for us.
            if (container && !container.querySelector('iframe')) {
                widgetId.value =
                    win.turnstile?.render('.cf-turnstile', {
                        sitekey: turnstileSiteKey,
                        theme: 'dark',
                        size: isMobile.value ? 'compact' : 'normal',
                    }) || null;
                updateCaptchaScale();
            }
        });
    }
};
const updateCaptchaScale = () => {
    const container = document.querySelector('.cf-turnstile');
    if (!container?.parentElement)
        return;
    const parentWidth = container.parentElement.clientWidth;
    const targetWidth = isMobile.value ? 130 : 300;
    if (parentWidth < targetWidth && parentWidth > 0) {
        // Math.max(0.3, ...) ensures it never scales to 0 and becomes invisible
        captchaScale.value = Math.max(0.3, Math.min(1, (parentWidth - 10) / targetWidth));
    }
    else {
        captchaScale.value = 1;
    }
};
const validateEmail = (email) => {
    if (!EMAIL_REGEX.test(email)) {
        emailError.value = 'Invalid email format';
        return false;
    }
    emailError.value = '';
    return true;
};
const checkEmailExistence = async (email) => {
    const domain = email.split('@')[1];
    if (!domain)
        return false;
    try {
        // We use Cloudflare DNS-over-HTTPS to check for MX records.
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
            headers: {
                Accept: 'application/dns-json',
            },
        });
        if (!response.ok)
            return true;
        const data = (await response.json());
        // Status 3 means NXDOMAIN (domain does not exist)
        if (data.Status === 3) {
            return false;
        }
        // Check if we have Answer records (MX)
        if (data.Answer && data.Answer.length > 0) {
            // RFC 7505: Check for "Null MX" (0 .) which means "no mail accepted here"
            const hasValidMX = data.Answer.some((record) => {
                const mxData = record.data.toLowerCase();
                return mxData !== '0 .' && mxData !== '0';
            });
            if (hasValidMX)
                return true;
            // If we only have Null MX records, it's a dead end.
            return false;
        }
        // If no MX records are found, we reject it.
        // While "Implicit MX" (A records) exists in standards, in modern practice,
        // any legitimate mail domain (Gmail, Yahoo, etc.) will have MX records.
        // This catches typo domains like "ahoo.de" which only have A records for parking pages.
        return false;
    }
    catch (err) {
        console.error('DNS verification failed:', err);
        return true; // Don't block user if verification service is down
    }
};
const validateMessage = (msg) => {
    const trimmed = msg.trim();
    if (trimmed.length < 15) {
        errorMessage.value = 'Transmission too short. Minimum 15 characters required.';
        formState.value = 'error';
        return false;
    }
    // A real message usually consists of sentences.
    // We require at least 3 words (2 spaces) to prevent single-string gibberish like "earvwscarevcaevcrw".
    const words = trimmed.split(/\s+/);
    if (words.length < 3) {
        errorMessage.value = 'Transmission rejected. Please use complete sentences.';
        formState.value = 'error';
        return false;
    }
    // Check if any single word is unrealistically long (> 40 chars) and isn't a URL.
    // This catches things like "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd".
    const hasAbsurdlyLongWord = words.some((w) => w.length > 40 && !w.startsWith('http'));
    if (hasAbsurdlyLongWord) {
        errorMessage.value = 'Transmission rejected. Invalid word length detected.';
        formState.value = 'error';
        return false;
    }
    // Check for Cyrillic characters (common in spam bots, irrelevant for this portfolio)
    if (/[А-Яа-яЁё]/.test(trimmed)) {
        errorMessage.value = 'Transmission rejected. Unsupported character set detected.';
        formState.value = 'error';
        return false;
    }
    // Check for SEO spam (multiple URLs)
    const urlCount = (trimmed.match(/https?:\/\//g) || []).length;
    if (urlCount > 1) {
        errorMessage.value = 'Transmission rejected. Too many links detected.';
        formState.value = 'error';
        return false;
    }
    // Basic keyboard mashing (e.g., "aaaaaa")
    if (/(.)\1{5,}/.test(trimmed)) {
        errorMessage.value = 'Transmission rejected. Anomalous pattern detected.';
        formState.value = 'error';
        return false;
    }
    // Repeating sequences (e.g., "asdasdasd", "qwqwqwqw")
    // We check if ANY sequence of 2 to 5 characters repeats 4 or more times in a row anywhere in the string.
    const noSpaces = trimmed.replace(/\s+/g, '');
    if (/(.{2,5})\1{3,}/.test(noSpaces)) {
        errorMessage.value = 'Transmission rejected. Repeating sequence detected.';
        formState.value = 'error';
        return false;
    }
    // Also check for high ratio of repeating characters (catch "asdsafasdfgdsfg" type mashing)
    // If the string is mostly composed of 4-5 unique characters, it's probably spam.
    const uniqueChars = new Set(noSpaces.split('')).size;
    if (noSpaces.length >= 15 && uniqueChars < 6) {
        errorMessage.value = 'Transmission rejected. Low character variance detected.';
        formState.value = 'error';
        return false;
    }
    return true;
};
const handleSubmit = async () => {
    if (formState.value === 'submitting')
        return;
    if (honeypot.value)
        return;
    // Enforce 15-second cooldown
    const now = Date.now();
    if (now - lastSubmitTime.value < 15000) {
        errorMessage.value = 'Please wait 15 seconds before sending another transmission.';
        formState.value = 'error';
        return;
    }
    if (!validateEmail(formData.email))
        return;
    if (!validateMessage(formData.message))
        return;
    formState.value = 'submitting';
    errorMessage.value = '';
    // Advanced verification: Check if domain actually exists/receives mail
    const isDomainValid = await checkEmailExistence(formData.email);
    if (!isDomainValid) {
        errorMessage.value =
            'The email address is not publicly available. Please use a non-internal email that is publicly available or contact via the other platforms.';
        formState.value = 'error';
        return;
    }
    try {
        const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;
        if (!turnstileResponse) {
            throw new Error('Please complete the security check.');
        }
        const formspreeId = envConfig.VITE_FORMSPREE_ID;
        if (!formspreeId) {
            throw new Error('Form configuration missing. Please check VITE_FORMSPREE_ID.');
        }
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                message: formData.message,
                'cf-turnstile-response': turnstileResponse,
            }),
        });
        if (!response.ok) {
            const data = await response.json().catch(() => null);
            const msg = data?.errors?.map((e) => e.message).join(', ') ||
                data?.error ||
                `Status: ${response.status}`;
            throw new Error(msg);
        }
        formState.value = 'success';
        lastSubmitTime.value = Date.now();
        formData.name = '';
        formData.email = '';
        formData.message = '';
        setTimeout(() => {
            formState.value = 'idle';
        }, 4000);
    }
    catch (err) {
        formState.value = 'error';
        errorMessage.value = err instanceof Error ? err.message : 'Network error — please try again.';
    }
};
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        copyState.value = 'copied';
        setTimeout(() => {
            copyState.value = 'idle';
        }, 2000);
    }
    catch (error) {
        console.error('Failed to copy text to clipboard:', error);
        copyState.value = 'error';
        setTimeout(() => {
            copyState.value = 'idle';
        }, 2000);
    }
};
// --- Lifecycle & Watchers ---
let resizeObserver = null;
onMounted(() => {
    isMobile.value = window.innerWidth < 480;
    renderTurnstile();
    // Dynamic scaling observer
    nextTick(() => {
        const container = document.querySelector('.cf-turnstile');
        if (container?.parentElement) {
            resizeObserver = new ResizeObserver(() => {
                updateCaptchaScale();
                const mobile = window.innerWidth < 480;
                if (mobile !== isMobile.value) {
                    isMobile.value = mobile;
                    // Re-render handled by watch(isMobile) below
                }
            });
            resizeObserver.observe(container.parentElement);
        }
    });
});
onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
watch(isMobile, () => {
    renderTurnstile();
});
watch(activeChannel, (newChannel) => {
    if (newChannel === 'email') {
        renderTurnstile();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['contact-input']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['social-link-btn']} */ ;
(__VLS_ctx.isMobile ? "120px" : "65px");
// @ts-ignore
[isMobile,];
const __VLS_0 = BentoCard || BentoCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    id: "contact-form",
    ...{ class: "md:col-span-4 md:row-span-1 flex flex-col" },
    withWindow: true,
    title: "Get In Touch",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}));
const __VLS_2 = __VLS_1({
    id: "contact-form",
    ...{ class: "md:col-span-4 md:row-span-1 flex flex-col" },
    withWindow: true,
    title: "Get In Touch",
    isLowEnd: (__VLS_ctx.performance.isLowEnd),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['md:col-span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:row-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-4 md:p-10 flex flex-col h-full" },
});
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-finished-text/50 text-xs md:text-sm mb-4 md:mb-6 font-mono tracking-wide transition-colors duration-[var(--theme-transition-duration)]" },
});
/** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex gap-1 mb-6 flex-wrap" },
    role: "tablist",
    'aria-label': "Contact channels",
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
for (const [channel] of __VLS_vFor((__VLS_ctx.channels))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeChannel = channel.id;
                // @ts-ignore
                [performance, channels, activeChannel,];
            } },
        key: (channel.id),
        type: "button",
        role: "tab",
        'aria-selected': (__VLS_ctx.activeChannel === channel.id),
        ...{ class: ([
                'channel-tab flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                { 'channel-tab--active': __VLS_ctx.activeChannel === channel.id },
            ]) },
    });
    /** @type {__VLS_StyleScopedClasses['channel-tab']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['channel-tab--active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "w-4 h-4 flex items-center justify-center" },
    });
    /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    const __VLS_7 = (channel.icon);
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    (channel.label);
    // @ts-ignore
    [activeChannel, activeChannel,];
}
if (__VLS_ctx.activeChannel === 'email') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col flex-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
        ...{ class: "flex flex-col gap-3 md:gap-4 flex-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "text",
        name: "website",
        value: (__VLS_ctx.honeypot),
        ...{ class: "hidden" },
        tabindex: "-1",
        autocomplete: "off",
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-1.5" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "contact-name",
        ...{ class: "text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" },
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "input-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "contact-name",
        type: "text",
        required: true,
        value: (__VLS_ctx.formData.name),
        placeholder: "Enter your designation",
        ...{ class: "contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['contact-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder-finished-text/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-1.5" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "contact-email",
        ...{ class: "text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" },
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "input-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "contact-email",
        type: "email",
        required: true,
        placeholder: "Enter comm-link",
        'aria-invalid': (!!__VLS_ctx.emailError),
        'aria-describedby': (__VLS_ctx.emailError ? 'email-error' : undefined),
        ...{ class: "contact-input w-full px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    (__VLS_ctx.formData.email);
    /** @type {__VLS_StyleScopedClasses['contact-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder-finished-text/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    if (__VLS_ctx.emailError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            id: "email-error",
            'aria-live': "polite",
            ...{ class: "text-red-400 text-xs mt-1 ml-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
        (__VLS_ctx.emailError);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-1.5 flex-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "contact-message",
        ...{ class: "text-xs text-finished-text/50 uppercase tracking-widest font-bold ml-1 transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-finished-accent transition-colors duration-[var(--theme-transition-duration)]" },
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "input-wrapper h-full" },
    });
    /** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
        id: "contact-message",
        required: true,
        value: (__VLS_ctx.formData.message),
        placeholder: "Transmit payload...",
        'aria-invalid': (__VLS_ctx.formState === 'error'),
        'aria-describedby': (__VLS_ctx.formState === 'error' ? 'message-error' : undefined),
        ...{ class: "contact-input w-full h-full min-h-[100px] px-4 py-3 text-sm text-finished-text placeholder-finished-text/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent/50 transition-colors duration-[var(--theme-transition-duration)] resize-none" },
    });
    /** @type {__VLS_StyleScopedClasses['contact-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-h-[100px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['placeholder-finished-text/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['resize-none']} */ ;
    if (__VLS_ctx.formState === 'error') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            id: "message-error",
            'aria-live': "polite",
            ...{ class: "text-red-400 text-xs ml-1" },
        });
        /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
        (__VLS_ctx.errorMessage);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (__VLS_ctx.isMobile ? 'mobile' : 'desktop'),
        ...{ class: "cf-turnstile mb-2" },
        'data-sitekey': (__VLS_ctx.turnstileSiteKey),
        'data-theme': "dark",
        'data-size': (__VLS_ctx.isMobile ? 'compact' : 'normal'),
        ...{ style: ({
                transform: `scale(${__VLS_ctx.captchaScale})`,
                display: __VLS_ctx.widgetId ? 'block' : 'none'
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['cf-turnstile']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        disabled: (__VLS_ctx.formState === 'submitting'),
        'aria-live': "polite",
        ...{ class: "relative w-full py-3 md:py-4 px-6 overflow-hidden rounded border border-finished-accent/40 bg-black/40 text-finished-text font-bold text-xs uppercase tracking-[0.3em] hover:bg-finished-accent/15 hover:text-finished-accent hover:border-finished-accent/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-[var(--theme-transition-duration)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:py-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-accent/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-[0.3em]']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-finished-accent/15']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-finished-accent/70']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['active:scale-[0.98]']} */ ;
    /** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "relative z-10 group-hover:drop-shadow-[0_0_8px_currentColor] transition-colors duration-[var(--theme-transition-duration)]" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:drop-shadow-[0_0_8px_currentColor]']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-[var(--theme-transition-duration)]']} */ ;
    (__VLS_ctx.submitLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-finished-accent/60 group-hover:bg-finished-accent group-hover:h-full transition-all duration-300" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
    /** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-1/2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-finished-accent/60']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:bg-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
}
else if (__VLS_ctx.activeChannel === 'discord') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col items-center justify-center flex-1 gap-4 py-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-finished-accent w-12 h-12" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    const __VLS_12 = DiscordIcon;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-finished-text/50 text-sm text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-3 px-4 py-3 rounded border border-finished-border bg-finished-text/[0.03]" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-border']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-finished-text/[0.03]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-finished-accent font-mono text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    (__VLS_ctx.discordUser);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeChannel === 'email'))
                    return;
                if (!(__VLS_ctx.activeChannel === 'discord'))
                    return;
                __VLS_ctx.copyToClipboard(__VLS_ctx.discordUser);
                // @ts-ignore
                [activeChannel, activeChannel, handleSubmit, honeypot, formData, formData, formData, emailError, emailError, emailError, emailError, formState, formState, formState, formState, errorMessage, isMobile, isMobile, turnstileSiteKey, captchaScale, widgetId, submitLabel, discordUser, discordUser, copyToClipboard,];
            } },
        type: "button",
        'aria-live': "polite",
        ...{ class: "px-3 py-1 text-xs uppercase tracking-widest border border-finished-accent/40 rounded bg-black/40 text-finished-accent hover:bg-finished-accent/15 hover:border-finished-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-200 active:scale-95" },
    });
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    /** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-finished-accent/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-finished-accent/15']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:border-finished-accent/70']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
    (__VLS_ctx.copyState === "copied"
        ? "✓ Copied"
        : __VLS_ctx.copyState === "error"
            ? "Failed to copy"
            : "Copy");
}
else if (__VLS_ctx.activeChannel === 'xing') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col items-center justify-center flex-1 gap-4 py-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-finished-accent w-12 h-12" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    const __VLS_17 = XingIcon;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-finished-text/50 text-sm text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: (__VLS_ctx.xingUrl),
        target: "_blank",
        rel: "noopener noreferrer",
        ...{ class: "social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" },
    });
    /** @type {__VLS_StyleScopedClasses['social-link-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
}
else if (__VLS_ctx.activeChannel === 'linkedin') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col items-center justify-center flex-1 gap-4 py-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-finished-accent w-12 h-12" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
    const __VLS_22 = LinkedinIcon;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-finished-text/50 text-sm text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-finished-text/50']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: (__VLS_ctx.linkedinUrl),
        target: "_blank",
        rel: "noopener noreferrer",
        ...{ class: "social-link-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-finished-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black" },
    });
    /** @type {__VLS_StyleScopedClasses['social-link-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-finished-accent']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['focus-visible:ring-offset-black']} */ ;
}
// @ts-ignore
[activeChannel, activeChannel, copyState, copyState, xingUrl, linkedinUrl,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
