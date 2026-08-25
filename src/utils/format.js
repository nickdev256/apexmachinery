export function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Number(amount).toLocaleString()}`;
  }
}

export function truncate(text, length = 100) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function starString(rating) {
  const full = Math.round(rating);
  return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
}
