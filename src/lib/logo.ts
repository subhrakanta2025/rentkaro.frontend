export const APP_LOGO_PATH = '/logo.png';
export const APP_FAVICON_PATH = '/favicon.png';

export function getAppLogoUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}${APP_LOGO_PATH}`;
  }
  return APP_LOGO_PATH;
}
