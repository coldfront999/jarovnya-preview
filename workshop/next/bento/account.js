/* Account composition; login, saving and birthday demo use app.js handlers. */
renderProfile = function () {
  const name = state.authed ? state.profile.name || 'Гость' : 'Добро пожаловать';
  const orders = state.orders.filter(order => order.owner === 'me');
  const addresses = state.profile.addresses || [];
  const row = (symbol, title, detail, attributes, tag = 'button') =>
    `<${tag} class="account-row" ${tag === 'button' ? 'type="button"' : ''} ${attributes}>${icon(symbol, 24)}<span class="account-row-copy"><strong>${title}</strong><small>${detail}</small></span><span class="account-chevron" aria-hidden="true">›</span></${tag}>`;
  return `<div class="content account-page">
    ${pageTitle('Личный кабинет')}
    <header class="account-identity"><div class="account-avatar" aria-hidden="true">${state.authed ? escapeHTML(Array.from(name)[0]) : icon('user', 32)}</div><div><h2>${escapeHTML(name)}</h2><p>${state.authed ? 'Тестовый аккаунт' : 'Любимые блюда всегда под рукой'}</p></div></header>
    ${!state.authed ? `<div class="account-login"><button class="cta" data-act="login">Войти по номеру телефона</button><p>Демо-вход с кодом 1111. SMS не отправляется.</p></div>` : ''}
    <nav class="account-nav" aria-label="Разделы личного кабинета">
      ${row('list', 'Мои заказы', orders.length ? 'История и статус ваших заказов' : 'Здесь появится первый заказ', 'data-page="orders"')}
      ${row('heart', 'Избранное', state.favorites.length ? `Сохранено блюд: ${state.favorites.length}` : 'Сохраняйте блюда сердечком в меню', 'data-page="favorites"')}
      ${row('pin', 'Адреса доставки', addresses.length ? escapeHTML(addresses[0]) + (addresses.length > 1 ? ` · ещё ${addresses.length - 1}` : '') : 'Добавить адрес', 'data-menu-address data-profile-address')}
      ${row('phone', 'Связаться с рестораном', '+7 (349) 366-00-09', 'href="tel:+73493660009"', 'a')}
    </nav>
    <section class="account-birthday" aria-labelledby="account-birthday-title"><div class="account-birthday-heading"><div><h3 id="account-birthday-title">В день рождения — вкуснее</h3><p>Скидка 10% в ваш день</p></div><span class="account-gift" aria-hidden="true">${icon('gift', 34)}</span></div><p class="account-birthday-note">${state.profile.dob ? 'Дата рождения сохранена в личных данных.' : 'Укажите дату рождения в личных данных.'} Скидка действует в сам день рождения по времени Губкинского.</p></section>
    ${state.authed ? `<details class="account-details"><summary>${icon('user', 23)}<span>Личные данные</span><span class="account-chevron" aria-hidden="true">›</span></summary><form id="profile-form"><label class="field">Имя<input name="fullName" autocomplete="name" required maxlength="40" value="${escapeHTML(state.profile.name)}"></label><label class="field">День рождения<input name="dob" autocomplete="bday" type="date" value="${escapeHTML(state.profile.dob || '')}"></label><button class="secondary" type="submit">Сохранить изменения</button></form></details><details class="account-demo"><summary>Проверка скидки в демо</summary><label for="demo-birthday"><input type="checkbox" id="demo-birthday" ${state.birthday ? 'checked' : ''}><span>Применить скидку 10% в макете</span></label></details>` : ''}
    <footer class="account-restaurant"><strong>Жаровня в Губкинском</strong><p>1 микрорайон, д. 7, ТЦ «Русь», 1 этаж</p><p>10:00–22:00 · заказы до 20:15<br>Позже — шаурма самовывозом</p><small>Тестовые заказы не отправляются в ресторан.</small></footer>
  </div>`;
};
