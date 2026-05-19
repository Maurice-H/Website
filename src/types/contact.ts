export type ContactChannelId = 'email' | 'discord' | 'xing' | 'linkedin';
export type ContactFormState = 'idle' | 'submitting' | 'success' | 'error';
export type ContactCopyState = 'idle' | 'copied' | 'error';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface TurnstileRenderOptions {
  sitekey: string;
  theme: string;
  size?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'timeout-callback'?: () => void;
}

export interface TurnstileWindow extends Window {
  turnstile?: {
    render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (id?: string) => void;
    remove: (id: string) => void;
  };
}

export interface DNSAnswer {
  type: number;
  data: string;
}

export interface DNSResponse {
  Status: number;
  Answer?: DNSAnswer[];
}
