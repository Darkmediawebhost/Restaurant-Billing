const APP_WINDOW_NAME = 'RestoBillApp';

export function appUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('app', '1');
  url.hash = '';
  return url.toString();
}

export function isAppLaunch() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('app') === '1') return true;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function isInstalledDisplay() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

/** Opens RestoBill in its own window. Must run directly from a click. */
export function openAppWindow() {
  if (isAppLaunch()) return window;
  const width = 430;
  const height = 860;
  const left = Math.max(0, window.screenX + 48);
  const top = Math.max(0, window.screenY + 32);
  const features = [
    'popup=yes',
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'resizable=yes',
    'scrollbars=yes',
  ].join(',');
  const opened = window.open(appUrl(), APP_WINDOW_NAME, features);
  opened?.focus();
  return opened;
}

export function downloadDesktopShortcut() {
  const body = `[InternetShortcut]\r\nURL=${appUrl()}\r\n`;
  const blob = new Blob([body], { type: 'application/internet-shortcut' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'RestoBill.url';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
