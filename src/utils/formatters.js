export function fmt(d) {
  if (!d) return '—';
  const p = d.split('T')[0].split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
}

export function fmtDt(d) {
  if (!d) return '—';
  const [date, time] = d.split('T');
  const p = date.split('-');
  return p[2] + '/' + p[1] + '/' + p[0] + (time ? ' às ' + time.substring(0, 5) : '');
}

export function starRating(n) {
  return ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'][Math.min(5, Math.max(1, n)) - 1];
}
