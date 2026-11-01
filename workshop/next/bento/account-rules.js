/* Optional local experiment. Set enabled:false to remove XP from the account. */
const AccountRules = {
  xp: { enabled: true, per100g: 4, rublesPerPoint: 50, perLevel: 100 },
  meatIds: new Set(['pork','beef','lamb','turkey','lula-mix','lula-pork','lula-chicken','breast','thigh','wings','ribs','ribs-bbq']),
  totalXp(orders) {
    const seen = new Set();
    let points = 0;
    for (const order of orders || []) {
      if (order.owner !== 'me' || order.status !== 'delivered' || !order.paid || seen.has(order.id)) continue;
      seen.add(order.id);
      let earned = 0;
      for (const l of order.lines || []) {
        if (l.unit === '100g') {
          if (this.meatIds.has(l.id) && Number.isInteger(l.actualGrams) && l.actualGrams > 0 && l.actualGrams <= 100000) earned += l.actualGrams * this.xp.per100g / 100;
        } else if (Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 50) {
          const cost = l.priceKopecks ?? Math.round(l.price * 100);
          if (Number.isFinite(cost) && cost > 0) earned += cost * l.qty / (this.xp.rublesPerPoint * 100);
        }
      }
      points += Math.floor(earned);
    }
    return points;
  },
  birthday(year, month, day, today = new Date()) {
    if (!year && !month && !day) return '';
    const y = Number(year), m = Number(month), d = Number(day);
    if (![y,m,d].every(Number.isInteger) || y < 1900 || y > today.getFullYear() || m < 1 || m > 12 || d < 1 || d > new Date(y,m,0).getDate()) return null;
    if (new Date(y,m-1,d) > today) return null;
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
};
if (typeof module !== 'undefined') module.exports = AccountRules;

