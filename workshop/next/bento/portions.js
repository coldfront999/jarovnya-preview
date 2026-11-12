/* Bento-only portion requests. Approximate portions never become billable weight. */
'use strict';
const BentoPortions = {
  specs: {
    beef: 'примерно 900–1 000 г',
    lamb: 'вес порции уточняется',
    turkey: 'вес порции уточняется',
    'lula-mix': 'примерно 400 г · 2 колбаски',
    'lula-pork': 'примерно 400 г · 2 колбаски',
    'lula-chicken': 'примерно 400 г · 2 колбаски',
    wings: 'примерно 800–900 г',
    ribs: 'примерно 800–900 г',
    'ribs-bbq': 'примерно 800–900 г',
    salmon: 'примерно 400 г · 1 кусок',
    'grilled-veg': 'примерно 1 000 г',
    mushrooms: 'примерно 500–600 г, может быть больше',
    potatoes: 'примерно 800–900 г',
    fries: 'примерно 190–210 г'
  },
  has(p) { return !!this.specs[p?.id]; },
  legacy(p) { return this.has(p) && !p.requestedPortions; },
  count(p) { return Number.isInteger(p.requestedPortions) && p.requestedPortions >= 1 && p.requestedPortions <= 50 ? p.requestedPortions : 1; },
  label(p) {
    const n = this.count(p);
    return n + (n % 10 === 1 && n % 100 !== 11 ? ' порция' : [2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100) ? ' порции' : ' порций');
  },
  detail(p) { return '1 порция: ' + this.specs[p.id]; },
  requested(p) { return this.label(p) + ' · ' + this.specs[p.id] + (this.count(p)>1?' каждая':''); },
  rate(p) { return money(p.priceKopecks ?? Math.round(p.price * 100)) + ' / 100 г'; },
  select(p, n) {
    if (!Number.isInteger(n) || n < 1 || n > 50) return false;
    p.requestedPortions = n;
    p.qty = n;
    delete p.requestedGrams;
    return true;
  }
};

const portionBaseCard = card;
card = function(p) {
  const html = portionBaseCard(p);
  if (!BentoPortions.has(p)) return html;
  // Keep the familiar menu price; portion details belong inside the product.
  return html.replace('Выбрать вес:', 'Выбрать порции:');
};

const portionBaseProduct = renderProduct;
renderProduct = function() {
  const p = state.selected;
  if (BentoPortions.has(p)) BentoPortions.select(p, BentoPortions.count(p));
  portionBaseProduct();
  if (!BentoPortions.has(p)) return;
  const sheet = document.querySelector('#modal .sheet'); if (!sheet) return;
  sheet.querySelector('.product-unit').textContent = BentoPortions.rate(p);
  const picker = sheet.querySelector('.requested-weight');
  if (picker) {
    picker.classList.add('portion-picker');
    setHTML(picker, '<legend>Количество порций</legend><p class="muted">' + BentoPortions.detail(p) + '</p><div class="weight-options">' + [1,2].map(n => '<button type="button" data-portion-count="' + n + '" aria-pressed="' + (BentoPortions.count(p) === n) + '">' + (n === 1 ? '1 порция' : '2 порции') + '</button>').join('') + '</div><label class="field">Другое количество порций<input id="portion-count" type="number" inputmode="numeric" min="1" max="50" step="1" value="' + BentoPortions.count(p) + '"></label><p class="muted">Вес указан примерно для одной порции. Итоговая цена — по фактическому общему весу после приготовления.</p>');
  }
};

const portionBaseCartLine = cartLine;
cartLine = function(l, remove = true) {
  if (!BentoPortions.has(l)) return portionBaseCartLine(l, remove);
  if (!l.requestedPortions && (!remove || state.page !== 'cart')) return portionBaseCartLine(l, remove);
  const host = document.createElement('div'); setHTML(host, portionBaseCartLine(l, remove));
  const small = host.querySelector('.line-info > small');
  if (small) small.textContent = !l.requestedPortions ? 'Теперь заказывается порциями. Выберите количество порций заново.' : BentoPortions.requested(l) + ' · ' + BentoPortions.rate(l) + (l.actualGrams != null ? ' · факт ' + l.actualGrams + ' г всего' : '');
  if (remove && state.page === 'cart') {
    const edit = document.createElement('button'); edit.className = 'menu-cart-edit';
    edit.dataset.portionEdit = l.lineId; edit.textContent = 'Изменить порции';
    host.querySelector('.line-info')?.append(edit);
  }
  return host.innerHTML;
};

const portionBaseCart = renderCart;
renderCart = function() {
  return portionBaseCart().replace('Выбранная граммовка — пожелание к весу.', 'Порции и желаемый вес — ориентир; итог после взвешивания.');
};

const portionBaseStaffOrder = staffOrder;
staffOrder = function(o) {
  const host = document.createElement('div'); setHTML(host, portionBaseStaffOrder(o));
  const lines = state.role === 'grill' ? o.lines.filter(l => l.station === 'grill') : o.lines;
  host.querySelectorAll('.order-item').forEach((row, i) => {
    const l = lines[i]; if (!BentoPortions.has(l) || !l.requestedPortions) return;
    const small = row.querySelector('small');
    if (small) small.textContent = 'Заказано: ' + BentoPortions.requested(l) + (l.actualGrams != null ? ' · факт ' + l.actualGrams + ' г всего' : ' · запишите общий фактический вес');
    row.querySelector('input')?.setAttribute('aria-label', 'Общий фактический вес всех порций: ' + l.name);
  });
  if (lines.some(l => l.requestedPortions)) {
    const warning = host.querySelector('.warning');
    if (warning?.textContent.includes('Предел клиента')) warning.textContent = 'Количество порций — пожелание клиента. Вес порций ориентировочный; для расчёта нужен общий вес готового блюда.';
  }
  return host.innerHTML;
};

// Window capture runs before the inherited document handler that requires grams.
window.addEventListener('click', event => {
  if (event.target.closest('[data-act="checkout"]') && state.cart.some(l => BentoPortions.legacy(l))) {
    event.preventDefault(); event.stopImmediatePropagation();
    toast('Выберите количество порций заново для ранее добавленных блюд.'); return;
  }
  const edit = event.target.closest('[data-portion-edit]');
  if (edit) {
    event.preventDefault(); event.stopImmediatePropagation();
    const l = state.cart.find(l => l.lineId === edit.dataset.portionEdit); if (!l) return;
    menuEditingLineId = l.lineId; state.selected = {...l, addons: [...l.addons]}; renderProduct(); return;
  }
  const count = event.target.closest('[data-portion-count]');
  if (count && BentoPortions.has(state.selected)) {
    event.preventDefault(); event.stopImmediatePropagation();
    BentoPortions.select(state.selected, Number(count.dataset.portionCount));
    document.querySelector('#portion-count').value = state.selected.requestedPortions;
    document.querySelectorAll('[data-portion-count]').forEach(b => b.setAttribute('aria-pressed', String(b === count)));
    document.querySelector('#product-error').textContent = ''; return;
  }
  const add = event.target.closest('[data-act="add"], [data-act="menu-save"]');
  if (!add || add.disabled || !BentoPortions.has(state.selected)) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const p = state.selected, n = Number(document.querySelector('#portion-count')?.value);
  if (!BentoPortions.select(p, n)) { document.querySelector('#product-error').textContent = 'Укажите целое количество порций от 1 до 50.'; return; }
  if (!allowed(item(p.id))) { document.querySelector('#product-error').textContent = 'Блюдо недоступно сейчас.'; return; }
  const source = document.querySelector('#modal .big-food img');
  const picture = {src: source?.currentSrc || p.image, rect: (source || add).getBoundingClientRect()};
  if (add.dataset.act === 'menu-save') {
    const l = state.cart.find(l => l.lineId === menuEditingLineId); if (!l) return;
    Object.assign(l, p, {lineId: l.lineId, actualGrams: null, addons: [...p.addons]});
    delete l.requestedGrams;
  } else state.cart.push({...p, lineId: newLineId(), actualGrams: null, addons: [...p.addons]});
  closeModal(); render();
  if (add.dataset.act !== 'menu-save') menuFlyToCart(picture);
  toast(add.dataset.act === 'menu-save' ? 'Порции изменены' : 'Добавлено в корзину');
}, true);

window.addEventListener('submit', event => {
  if (event.target.id !== 'checkout-form' || !state.cart.some(l => BentoPortions.legacy(l))) return;
  event.preventDefault(); event.stopImmediatePropagation();
  document.querySelector('#checkout-error').textContent = 'Вернитесь в корзину и выберите количество порций заново для ранее добавленных блюд.';
}, true);

window.addEventListener('input', event => {
  if (event.target.id !== 'portion-count' || !BentoPortions.has(state.selected)) return;
  const n = Number(event.target.value), valid = BentoPortions.select(state.selected, n);
  document.querySelectorAll('[data-portion-count]').forEach(b => b.setAttribute('aria-pressed', String(valid && Number(b.dataset.portionCount) === n)));
  document.querySelector('#product-error').textContent = valid ? '' : 'Укажите целое количество порций от 1 до 50.';
}, true);
menuCatalogSignature = null;
render();
