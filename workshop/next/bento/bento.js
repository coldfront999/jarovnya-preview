/* Isolated bento experiment. Prices and ordering stay with the existing handlers. */
const bentoPalettes = ['pop'];
const bentoPaletteKey = 'jarovnya-bento-palette-20261101';
let bentoPalette = 'pop';
try { bentoPalette = localStorage.getItem(bentoPaletteKey) || bentoPalette; } catch {}
const linkedPalette = new URLSearchParams(location.search).get('palette');
if (bentoPalettes.includes(linkedPalette)) bentoPalette = linkedPalette;
if (!bentoPalettes.includes(bentoPalette)) bentoPalette = 'pop';
function applyBentoPalette() {
  document.documentElement.dataset.palette = bentoPalette;
  document.querySelectorAll('[data-palette-choice]').forEach(button =>
    button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === bentoPalette)));
  try { localStorage.setItem(bentoPaletteKey, bentoPalette); } catch {}
}
applyBentoPalette();
document.addEventListener('click', event => {
  const choice = event.target.closest('[data-palette-choice]');
  if (!choice || !bentoPalettes.includes(choice.dataset.paletteChoice)) return;
  bentoPalette = choice.dataset.paletteChoice;
  applyBentoPalette();
  const url = new URL(location.href); url.searchParams.set('palette', bentoPalette);
  history.replaceState(null, '', url);
});

header = function () {
  return '<header class="m-header bento-header"><div class="bento-brandrow">' + menuBrand() +
    '<span>Губкинский</span>' + menuProfile() + '</div><div class="bento-address-row"><button class="reference-location" data-menu-address aria-label="' +
    (state.mode === 'pickup' ? 'Адрес самовывоза' : 'Адрес доставки') + '">' + icon('pin', 19) + '<strong>' +
    escapeHTML(state.mode === 'pickup' ? '1 мкр., д. 7 · ТЦ «Русь»' : state.profile.addresses[0] || 'Куда привезти?') +
    '</strong></button></div>' + menuModes() + '</header>';
};

function bentoBoard() {
  return '<section class="bento-board" aria-label="Выберите, что приготовить">' +
    '<button class="bento-tile bento-photo-tile bento-grill" data-category="Мангал"><span class="bento-tile-title">Мангал</span><span class="bento-tile-label">' + '' +
    '</span><img src="images/categories/mangal.webp" alt="" width="384" height="384" fetchpriority="high" decoding="async"></button>' +
    '<button class="bento-tile bento-photo-tile bento-shawarma" data-category="Шаурма"><span class="bento-tile-title">Шаурма</span>' + '' +
    '<img src="images/categories/shawarma.webp" alt="" width="384" height="384" decoding="async"></button>' +
    '<button class="bento-tile bento-photo-tile bento-pies" data-category="Пироги и пицца"><span class="bento-tile-title">Пироги<br>и пицца</span>' + '' +
    '<img src="images/categories/pies.webp" alt="" width="384" height="384" decoding="async"></button></section>';
}

card = function (p) {
  const grouped = p.menuLavashGroup, available = allowed(p), name = escapeHTML(p.name);
  const favorite = grouped ? state.favorites.some(id => ['lavash-150', 'lavash-200'].includes(id)) : state.favorites.includes(p.id);
  return '<article class="menu-dish ' + (available ? '' : 'menu-unavailable') + '" data-menu-product="' + p.id + '"><div class="menu-photo"><button class="photo-open" data-product="' + p.id +
    '" aria-label="Подробнее: ' + name + '"><img src="' + escapeHTML(p.image) + '" alt="' + name + '" width="384" height="384" loading="lazy" decoding="async"></button><button class="favorite ' +
    (favorite ? 'on' : '') + '" ' + (grouped ? 'data-menu-fav-lavash' : 'data-fav="' + p.id + '"') + ' aria-pressed="' + favorite + '" aria-label="В избранное: ' + name + '">' + icon('heart', 20) +
    '</button></div><div class="menu-copy"><h2><button class="menu-name" data-product="' + p.id + '">' + name + '</button></h2><button class="menu-price" data-menu-price="' + p.id + '" ' +
    (available ? '' : 'disabled') + ' aria-label="' + (!available ? 'Недоступно: ' : p.unit === '100g' || grouped ? 'Выбрать вес: ' : 'Добавить в корзину: ') + name + '"><span>' +
    (p.unit === '100g' || grouped ? 'от ' : '') + money(p.priceKopecks ?? Math.round(p.price * 100)) + '</span>' + icon('plus', 18) + '</button>' +
    (!available ? '<small class="menu-availability">' + (p.available ? 'Недоступно сейчас' : 'Закончилось') + '</small>' : '') + '</div></article>';
};

renderMenu = function () {
  let dishes = state.category === 'Популярное' ? ['pork', 'shawarma-chicken', 'adjara', 'potatoes'].map(item) : MENU.filter(p => p.category === state.category);
  if (state.query) dishes = MENU.filter(p => p.name.toLocaleLowerCase('ru-RU').includes(state.query.toLocaleLowerCase('ru-RU')));
  dishes = menuDisplayDishes(dishes);
  const hours = state.time === 'closed' ? 'Сейчас закрыто. Принимаем заказы с 10:00.' : state.time === 'late' ? 'После 20:15 — только шаурма самовывозом.' : state.time === 'friday' ? 'Бизнес-ланчи доступны с понедельника по четверг.' : 'Бизнес-ланчи · Пн–Чт, 11:00–16:00';
  return header() + bentoBoard() + (state.time !== 'normal' ? '<p class="menu-hours">' + hours + '</p>' : '') +
    '<div id="menu-search-panel" class="menu-search-scene"><label class="menu-search">' + icon('search', 20) +
    '<input id="search" type="search" autocomplete="off" aria-label="Поиск блюда" placeholder="Шаурма, пирог, шашлык" value="' + escapeHTML(state.query) + '"></label><button class="search-done" data-close-search type="button">Закрыть</button></div>' +
    '<section class="menu-catalog-wrap" aria-label="Блюда меню"><div class="menu-catalog"><nav class="menu-categories" aria-label="Категории меню">' + CATEGORIES.map(c =>
      '<button data-category="' + escapeHTML(c) + '" aria-pressed="' + (state.category === c) + '">' + escapeHTML(c) + '</button>').join('') +
    '</nav><div class="menu-heading"><h2>' + escapeHTML(state.query ? 'Нашлось в меню' : state.category) + '</h2><span>' + dishes.length +
    ' в меню</span></div><div class="menu-list">' + (dishes.map(card).join('') || '<p class="menu-empty">Блюдо не найдено. Попробуйте другое название.</p>') + '</div></div></section>';
};

// Keep the cached small photo visible while the larger file loads only on opening.
const bentoProductRender = renderProduct;
renderProduct = function () {
  bentoProductRender();
  const sheet = document.querySelector('#modal .sheet');
  if (!sheet) return;
  sheet.classList.add('reference-product');
  const photo = sheet.querySelector('.big-food'), close = sheet.querySelector('.close');
  const body = document.createElement('div'); body.className = 'reference-product-body';
  Array.from(sheet.children).filter(node => node !== photo && node !== close).forEach(node => body.append(node));
  sheet.append(body);
  const image = document.querySelector('#modal .big-food img');
  if (!image) return;
  image.loading = 'eager';
  const detail = item(state.selected.id)?.detailImage;
  if (!detail) return;
  const larger = new Image();
  larger.decoding = 'async';
  larger.onload = () => { if (image.isConnected) image.src = detail; };
  larger.src = detail;
};
document.addEventListener('error', event => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.getAttribute('src')?.startsWith('images/')) image.dataset.imageFailed = 'true';
}, true);
window.addEventListener('online', () => document.querySelectorAll('img[data-image-failed]').forEach(image => {
  delete image.dataset.imageFailed;
  const url = new URL(image.src); url.searchParams.set('retry', Date.now()); image.src = url.href;
}));
// Reuse working profile forms and cart calculations; improve their hierarchy.
const bentoBaseProfile = renderProfile;
renderProfile = function () {
  const shortcut = '<div class="bento-profile-links"><button data-page="orders">' + icon('list',24) + '<span>Мои заказы</span></button><button data-page="favorites">' + icon('heart',24) + '<span>Избранное</span></button></div>';
  return bentoBaseProfile().replace('class="content"','class="content bento-profile"').replace('<div class="panel">',shortcut+'<div class="panel">').replace('<h3>Мои адреса</h3>','<div class="row"><h3>Мои адреса</h3><button class="secondary" data-menu-address>Изменить</button></div>');
};
const bentoBaseCart = renderCart;
renderCart = function () {
  const context = '<div class="bento-cart-context">' + icon(state.mode==='pickup'?'store':'truck',26) + '<div><strong>' + (state.mode==='pickup'?'Самовывоз':'Доставка') + '</strong><small>' + escapeHTML(state.mode==='pickup'?'1 мкр., д. 7 · ТЦ «Русь»':state.checkoutDraft?.address||state.profile.addresses[0]||'Укажите адрес получения') + '</small></div><button data-menu-address>' + (state.mode==='pickup'?'Адрес':'Изменить') + '</button></div>';
  const html=bentoBaseCart().replace('class="content"','class="content bento-cart"');
  return state.cart.length?html.replace('</h1></div>','</h1></div>'+context):html;
};
menuCatalogSignature = null;
render();
