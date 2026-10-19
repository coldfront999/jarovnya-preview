/* Reference-one composition; existing menu/business handlers remain the source of truth. */
const referenceCategoryPhotos={'Популярное':'pork','Мангал':'lula-red','Шаурма':'shawarma-chicken','Хачапури':'adjara','Пироги и пицца':'pizza-pepperoni','Гарниры':'potatoes','К мясу':'caucasian','Напитки':'mors-half','Бизнес-ланч':'lunch-pork'};
menuModes=function(){return '<div class="m-modes" role="group" aria-label="Способ получения">'+[['delivery','Доставка'],['pickup','Самовывоз']].map(([value,label])=>'<button data-mode="'+value+'" aria-pressed="'+(state.mode===value)+'">'+icon(value==='delivery'?'truck':'store',18)+'<span><strong>'+label+'</strong><small>'+(value==='delivery'?'От 1 000 ₽ · около '+state.eta+' мин':'Без минимальной суммы')+'</small></span></button>').join('')+'</div>';};
header=function(){return '<header class="m-header m-compact"><div class="reference-header">'+menuProfile()+'<button class="reference-location" data-menu-address><span class="reference-brand"><img src="../../brand/logo-reconstruction-unapproved.png" alt="Жаровня" width="2172" height="724"><span>Губкинский</span></span><strong>'+escapeHTML(state.mode==='pickup'?'1 мкр., д. 7 · ТЦ «Русь»':state.profile.addresses[0]||'Куда привезти?')+icon('arrow',12)+'</strong></button><button class="reference-search" data-menu-search aria-label="Поиск блюда" aria-controls="menu-search-panel" aria-expanded="'+menuSearchOpen+'">'+icon('search',22)+'</button></div>'+menuModes()+'</header>';};
card=function(p){
 const group=p.menuLavashGroup,available=allowed(p),name=escapeHTML(p.name),weighted=p.unit==='100g';
 const favorite=group?state.favorites.some(id=>id==='lavash-150'||id==='lavash-200'):state.favorites.includes(p.id);
 const favoriteAttribute=group?'data-menu-fav-lavash':'data-fav="'+p.id+'"';
 const detail=group?'150 или 200 г':'';
 return '<article class="menu-dish '+(available?'':'menu-unavailable')+'" data-menu-product="'+p.id+'"><div class="menu-photo"><button class="photo-open" data-product="'+p.id+'" aria-label="Подробнее: '+name+'"><img src="'+escapeHTML(p.image)+'" alt="'+name+'" width="280" height="250" loading="lazy" decoding="async"></button><button class="favorite '+(favorite?'on':'')+'" '+favoriteAttribute+' aria-pressed="'+favorite+'" aria-label="В избранное: '+name+'">'+icon('heart',20)+'</button></div><div class="menu-copy"><h2><button class="menu-name" data-product="'+p.id+'">'+name+'</button></h2><small class="reference-unit">'+escapeHTML(detail)+'</small><button type="button" class="menu-price" data-menu-price="'+p.id+'" aria-label="'+(!available?'Недоступно: ':weighted||group?'Выбрать вес: ':'Добавить в корзину: ')+name+'" '+(available?'':'disabled')+'><span>'+(group||weighted?'от ':'')+money(p.priceKopecks??Math.round(p.price*100))+'</span>'+icon('plus',18)+'</button>'+(!available?'<small class="menu-availability">'+(p.available?'Недоступно сейчас':'Закончилось')+'</small>':'')+'</div></article>';
};
renderMenu=function(){
 let dishes=state.category==='Популярное'?['pork','shawarma-chicken','adjara','potatoes'].map(item):MENU.filter(p=>p.category===state.category);
 if(state.query)dishes=MENU.filter(p=>p.name.toLocaleLowerCase('ru-RU').includes(state.query.toLocaleLowerCase('ru-RU')));
 dishes=menuDisplayDishes(dishes);
 const hours=state.time==='closed'?'Сейчас закрыто. Принимаем заказы с 10:00.':state.time==='late'?'После 20:15 — только шаурма самовывозом.':state.time==='friday'?'Бизнес-ланчи доступны с понедельника по четверг.':'Бизнес-ланчи · Пн–Чт, 11:00–16:00';
 const hero=!state.query&&state.category==='Популярное'?'<section class="reference-hero" aria-label="Блюда на мангале"><div><h1>С огня —<br>к вашему столу</h1><p>Готовим в Жаровне</p><button data-category="Мангал">Выбрать шашлык '+icon('arrow',14)+'</button></div><img src="../card-assets/pork.webp" alt="Шашлык из свиной шеи" width="500" height="500" fetchpriority="high"></section>':'';
 return header()+(state.time!=='normal'?'<p class="menu-hours">'+hours+'</p>':'')+'<div id="menu-search-panel" class="menu-search-scene" '+(menuSearchOpen?'':'hidden')+'><label class="menu-search">'+icon('search',20)+'<input id="search" type="search" autocomplete="off" aria-label="Поиск блюда" placeholder="Найти блюдо" value="'+escapeHTML(state.query)+'"></label></div>'+hero+'<section class="menu-catalog-wrap" aria-label="Блюда меню"><div class="menu-catalog"><div class="reference-category-title"><h2>Что приготовим?</h2><span>Меню</span></div><nav class="menu-categories" aria-label="Категории меню">'+CATEGORIES.map(c=>'<button data-category="'+escapeHTML(c)+'" aria-pressed="'+(state.category===c)+'"><span class="reference-category-icon">'+(referenceCategoryPhotos[c]?'<img src="../card-assets/'+referenceCategoryPhotos[c]+'.webp" alt="" width="64" height="64" loading="lazy">':icon('fork',28))+'</span><span>'+escapeHTML(c)+'</span></button>').join('')+'</nav><div class="menu-heading"><h2>'+escapeHTML(state.query?'Нашлось в меню':state.category)+'</h2><span>'+dishes.length+' в меню</span></div><div class="menu-list">'+(dishes.map(card).join('')||'<p class="menu-empty">Блюдо не найдено. Попробуйте другое название.</p>')+'</div></div></section>';
};
// Preserve all original validation, portion selectors, editing and disabled states.
const referenceProductRender=renderProduct;
renderProduct=function(){
 referenceProductRender();
 const sheet=document.querySelector('#modal .sheet');if(!sheet)return;
 sheet.classList.add('reference-product');
 const photo=sheet.querySelector('.big-food'),close=sheet.querySelector('.close');
 const body=document.createElement('div');body.className='reference-product-body';
 Array.from(sheet.children).filter(node=>node!==photo&&node!==close).forEach(node=>body.append(node));
 sheet.append(body);
};
menuCatalogSignature=null;
render();
