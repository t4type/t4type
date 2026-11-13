/**
 * Generates a unique local report reference ID (e.g., T4T-20261112-8A4C2F).
 */
export function generateReportReference(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';

  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(6);
    window.crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i++) {
      suffix += charset[bytes[i] % charset.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      suffix += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return `T4T-${year}${month}${day}-${suffix}`;
}

/**
 * Formats completion date cleanly for formal reports (e.g., November 12, 2026).
 */
export function formatReportDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(timestamp));
}

/**
 * Formats completion time cleanly for formal reports (e.g., 11:55:27 PM).
 */
export function formatReportTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

