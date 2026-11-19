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

export function formatReportDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(timestamp));
}

export function formatReportTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}
