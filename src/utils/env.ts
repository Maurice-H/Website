export interface EnvConfig {
  VITE_CI_MODE: string | undefined;
  isCiMode: boolean;
}

/**
 * Validates and parses environment variables to ensure strict type safety.
 */
function parseEnv(): EnvConfig {
  const isCiModeStr = import.meta.env.VITE_CI_MODE;

  if (isCiModeStr && isCiModeStr !== 'true' && isCiModeStr !== 'false') {
    console.warn(`[Env] VITE_CI_MODE is set to an unexpected value: ${isCiModeStr}. Expected 'true' or 'false'.`);
  }

  const isCiMode = isCiModeStr === 'true';

  return {
    VITE_CI_MODE: isCiModeStr,
    isCiMode,
  };
}

export const envConfig = parseEnv();
