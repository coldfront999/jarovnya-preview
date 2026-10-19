# Жаровня — фотографичная витрина

Выбранный источник композиции: Shahinur Rahman, [Food Delivery Mobile App](https://www.behance.net/gallery/210097699/Food-Delivery-Mobile-App). Локальная иллюстрация: `outputs/reference-one/reference.png`. Это адаптация центрального каталога и правого экрана блюда: компактный заголовок, фотографичный баннер, круги категорий, две колонки блюд и перекрывающий фотографию лист подробностей.

Палитра: белый #FFFFFF — основная поверхность; винный #702938 — фирменное действие и баннер; графит #252126 — текст; серый #716B72 — подписи; розовый #F6EAF0 — выбранные состояния; светлый серый #F5F3F2 — фон фотографий. Тёмная тема использует отдельные поверхности и светлый винный акцент с достаточным контрастом.

Типографика: Golos Text для всего интерфейса, 23–25 px / 750 для заголовков, 13–14 px / 650 для названий блюд, 10–12 px для вторичной информации. Выравнивание текста по левому краю. Oswald и Neucha не используются в этой адаптации.

Макет: мобильная витрина 320–460 px; на большом экране — намеренный широкий мобильный предпросмотр с отдельной колонкой настроек. Баннер занимает 150–160 px и оставляет категории и начало меню в первом экране. Крупные существующие фотографии блюд размещены в двух колонках. Детали используют крупное фото, округлый перекрывающий лист и закреплённое основное действие. Дополнения к корзине сохраняют прозрачные фотографии и фон.

Принцип глубины: один выразительный винный баннер, мягкие предметные тени, спокойные контрастные поверхности. Старые бумажные текстуры отключены только здесь. Нет выдуманных скидок, рейтингов, составов или сроков приготовления. Цена весового блюда явно подписана за 100 г; фактический итог остаётся отдельным расчётом после взвешивания. Бизнес-логика и обработчики остаются в изолированных копиях app.js/menu.js.


## Verification — 2026-10-19
- Existing business regression suite: 23/23 passed; production web validation passed.
- All copied JavaScript files passed syntax parsing.
- Browser smoke: weighted product opened, 500 g selected and added; fixed shawarma price added directly; both lines appeared in cart.
- Delivery address modal opened with the input focused.
- Independent theme selection worked. Dark administrator order view and all 53 stop-list positions rendered; dark KPI, weight entry and sidebar contrast corrected.
- Stop-list toggle made the pork card unavailable with its price action disabled.
- Small-screen DOM check: viewport 305 CSS px, document 305 px, no horizontal page overflow and no broken menu images. Tablet check: 1009/1009 CSS px.
- The old root, workshop and saved snapshot assets were not changed. This prototype still uses local demo data, not server orders or production authentication.
