// Reuse the existing catalog, order rules, product dialog, cart, and staff screens.
const menuAppearance={material:'urban',theme:'dark',font:'oswald',header:'compact'};
let menuSearchOpen=false;
const menuCartMotionKey='jarovnya-workshop-cart-motion-v1';
let menuCartMotion='auto';
try{const saved=localStorage.getItem(menuCartMotionKey);if(['auto','flight','quiet'].includes(saved))menuCartMotion=saved;}catch{}
const linkedCartMotion=new URLSearchParams(location.search).get('cartMotion');
if(['auto','flight','quiet'].includes(linkedCartMotion))menuCartMotion=linkedCartMotion;
function applyMenuCartMotion(){document.documentElement.dataset.cartMotion=menuCartMotion;const control=document.getElementById('menu-cart-motion-select');if(control)control.value=menuCartMotion;try{localStorage.setItem(menuCartMotionKey,menuCartMotion);}catch{}}
applyMenuCartMotion();
document.addEventListener('change',event=>{if(event.target.id!=='menu-cart-motion-select'||!['auto','flight','quiet'].includes(event.target.value))return;menuCartMotion=event.target.value;applyMenuCartMotion();const url=new URL(location.href);url.searchParams.set('cartMotion',menuCartMotion);history.replaceState(null,'',url);if(menuCartMotion==='quiet')document.querySelectorAll('.menu-cart-flight').forEach(el=>el.remove());});

const menuAppearanceKey='jarovnya-workshop-appearance-v1';
const menuHeaderPreferenceKey='jarovnya-assembled-menu-header-v1';
const menuChoices={material:['craft','urban'],theme:['light','dark'],font:['oswald','neucha'],header:['compact']};
try{const saved=JSON.parse(localStorage.getItem(menuAppearanceKey)||'{}');for(const k of ['theme','font'])if(menuChoices[k].includes(saved[k]))menuAppearance[k]=saved[k];if(menuChoices.material.includes(saved.background))menuAppearance.material=saved.background;const savedHeader=localStorage.getItem(menuHeaderPreferenceKey);if(menuChoices.header.includes(savedHeader))menuAppearance.header=savedHeader;}catch{}
function applyMenuAppearance(){
  const root=document.documentElement;root.dataset.theme=menuAppearance.theme;root.dataset.material=menuAppearance.material;root.dataset.type=menuAppearance.font;
  for(const k of Object.keys(menuChoices)){const control=document.getElementById('menu-'+k+'-select');if(control)control.value=menuAppearance[k];}
  try{localStorage.setItem(menuAppearanceKey,JSON.stringify({background:menuAppearance.material,theme:menuAppearance.theme,font:menuAppearance.font}));localStorage.setItem(menuHeaderPreferenceKey,menuAppearance.header);}catch{}
}
function menuBrand(){return '<span class="m-logo"><img src="../brand/logo-reconstruction-unapproved.png" alt="Жаровня" width="2172" height="724"></span>';}
function menuProfile(){return '<button class="m-profile" data-page="profile" aria-label="Профиль">'+icon('user',25)+'</button>';}
function menuModes(){return '<div class="m-modes" role="group" aria-label="Способ получения">'+[['delivery','Доставка'],['pickup','Самовывоз']].map(([v,label])=>'<button data-mode="'+v+'" aria-pressed="'+(state.mode===v)+'">'+icon(v==='delivery'?'truck':'store',20)+'<span><strong>'+label+'</strong><small>'+(v==='delivery'?'Около '+state.eta+' минут':'Доставка от 1 000 ₽')+'</small></span></button>').join('')+'</div>';}
function menuAddress(){const address=state.profile.addresses[0];return '<button class="m-location" data-menu-address aria-label="'+(state.mode==='pickup'?'Адрес самовывоза':'Адрес доставки')+'">'+icon('pin',22)+'<span><strong>'+escapeHTML(state.mode==='pickup'?'Забрать в Жаровне':address||'Куда привезти?')+'</strong><small>'+escapeHTML(state.mode==='pickup'?'Губкинский, 1 мкр., д. 7 · ТЦ «Русь»':address?'Губкинский · изменить адрес':'Губкинский · укажите адрес доставки')+'</small></span>'+icon('arrow',18)+'</button>';}
header=function(){return '<header class="m-header m-compact"><div class="m-brandrow">'+menuBrand()+menuProfile()+'</div>'+menuAddress()+menuModes()+'<span class="m-pickup-oven"><img src="background-assets/oven-peek.webp" alt="" aria-hidden="true" width="600" height="686"></span></header>';};
nav=function(){return `<nav class="bottom" aria-label="Главная навигация">${[['menu','home','Меню'],['favorites','heart','Избранное'],['orders','list','Заказы'],['contact','phone','Позвонить'],['cart','bag','Корзина']].map(([p,i,n])=>p==='contact'?`<a class="nav-contact" href="tel:+73493660009" aria-label="Позвонить в Жаровню">${icon(i)}<span>Позвонить</span></a>`:`<button data-page="${p}" class="${state.page===p?'active':''}">${icon(i)}<span>${n}</span>${p==='cart'&&state.cart.length?`<b class="bubble">${state.cart.length}</b>`:''}</button>`).join('')}</nav>`;};
function menuIsLavash(p){return p.id==='lavash-150'||p.id==='lavash-200';}
function menuDisplayDishes(dishes){let hasLavash=false;return dishes.flatMap(p=>{if(!menuIsLavash(p))return [p];if(hasLavash)return [];hasLavash=true;const variants=MENU.filter(menuIsLavash);const availableVariants=variants.filter(allowed);const primary=(availableVariants.length?availableVariants:variants).reduce((a,b)=>a.price<b.price?a:b);return [{...primary,name:'Шашлык в лаваше',menuLavashGroup:true}];});}
card=function(p){const group=p.menuLavashGroup;const favorite=group?state.favorites.some(id=>id==='lavash-150'||id==='lavash-200'):state.favorites.includes(p.id);const favoriteAttribute=group?'data-menu-fav-lavash':'data-fav="'+p.id+'"';const unit=p.unit==='100g'||p.unit==='шт'||/порци/i.test(p.unit)||(p.category==='Хачапури'||p.category==='Пироги и пицца')?'':'<small>'+escapeHTML(p.unit)+'</small>';return '<article class="menu-dish" data-menu-product="'+p.id+'"><div class="menu-photo"><button class="photo-open" data-product="'+p.id+'" aria-label="'+(p.unit!=='100g'&&!group?'Добавить в корзину: ':'Подробнее: ')+escapeHTML(p.name)+'"><img src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.name)+'" width="112" height="112" loading="lazy" decoding="async"></button><button class="favorite '+(favorite?'on':'')+'" '+favoriteAttribute+' aria-pressed="'+favorite+'" aria-label="В избранное: '+escapeHTML(p.name)+'">'+icon('heart',18)+'</button></div><div class="menu-copy"><h2>'+escapeHTML(p.name)+'</h2><p class="menu-price">'+(p.unit==='100g'||group?'от ':'')+money(p.priceKopecks??Math.round(p.price*100))+'</p>'+unit+(!allowed(p)?'<small class="menu-availability">'+(p.available?'Недоступно сейчас':'Закончилось')+'</small>':'')+'</div></article>';};
renderFavorites=function(){const dishes=menuDisplayDishes(MENU.filter(p=>state.favorites.includes(p.id)));return '<div class="content" style="padding-bottom:15px">'+pageTitle('Избранное')+'</div><div class="grid">'+(dishes.map(card).join('')||'<p class="menu-empty">Нажмите сердечко на любимом блюде.</p>')+'</div>';};
renderMenu=function(){let dishes=state.category==='Популярное'?['pork','shawarma-chicken','adjara','potatoes'].map(item):MENU.filter(p=>p.category===state.category);if(state.query)dishes=MENU.filter(p=>p.name.toLocaleLowerCase('ru-RU').includes(state.query.toLocaleLowerCase('ru-RU')));dishes=menuDisplayDishes(dishes);const title=state.query?'Нашлось в меню':state.category==='Популярное'?'С огня к столу':state.category;const hours=state.time==='closed'?'Сейчас закрыто. Принимаем заказы с 10:00.':state.time==='late'?'После 20:15 — только шаурма самовывозом.':state.time==='friday'?'Бизнес-ланчи доступны с понедельника по четверг.':'Бизнес-ланчи · Пн–Чт, 11:00–16:00';return header()+(state.time!=='normal'?'<p class="menu-hours">'+hours+'</p>':'')+'<div id="menu-search-panel" class="menu-search-scene" '+(menuSearchOpen?'':'hidden')+'><label class="menu-search">'+icon('search',20)+'<input id="search" type="search" autocomplete="off" aria-label="Поиск блюда" placeholder="Найти блюдо" value="'+escapeHTML(state.query)+'"></label></div><section class="menu-catalog-wrap" aria-label="Блюда меню"><div class="menu-catalog"><nav class="menu-categories" aria-label="Категории меню"><button class="menu-search-toggle" data-menu-search aria-label="Поиск блюда" aria-controls="menu-search-panel" aria-expanded="'+menuSearchOpen+'">'+icon('search',21)+'</button>'+CATEGORIES.map(c=>'<button data-category="'+escapeHTML(c)+'" aria-pressed="'+(state.category===c)+'">'+escapeHTML(c)+'</button>').join('')+'</nav><div class="menu-heading"><h1>'+escapeHTML(title)+'</h1><span>'+dishes.length+' в меню</span></div><div class="menu-list">'+(dishes.map(card).join('')||'<p class="menu-empty">Блюдо не найдено. Попробуйте другое название.</p>')+'</div></div></section>';};
const menuOriginalRender=render;
let menuCategoryScroll=0;
render=function(){const previous=document.querySelector('.menu-categories');if(previous)menuCategoryScroll=previous.scrollLeft;document.body.dataset.role=state.role;document.body.dataset.page=state.page;menuOriginalRender();const categories=document.querySelector('.menu-categories');if(categories){categories.scrollLeft=menuCategoryScroll;const selected=categories.querySelector('[aria-pressed=true]');if(selected&&!state.query){const left=selected.offsetLeft,right=left+selected.offsetWidth;const visibleLeft=categories.scrollLeft+76,visibleRight=categories.scrollLeft+categories.clientWidth-24;if(left<visibleLeft)categories.scrollLeft=Math.max(0,left-76);else if(right>visibleRight)categories.scrollLeft=right-categories.clientWidth+24;}menuCategoryScroll=categories.scrollLeft;}document.querySelectorAll('.bottom [data-page]').forEach(b=>{b.setAttribute('aria-current',b.dataset.page===state.page?'page':'false');});};
document.addEventListener('change',event=>{for(const k of Object.keys(menuChoices))if(event.target.id==='menu-'+k+'-select'&&menuChoices[k].includes(event.target.value)){menuAppearance[k]=event.target.value;applyMenuAppearance();render();}});
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-menu-address],[data-mode=delivery]');if(trigger){const pickup=state.mode==='pickup';setHTML($('#modal'),'<div class="sheet-back menu-address-back"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="menu-address-title"><button class="close" data-menu-close aria-label="Закрыть адрес">'+icon('back',22)+'</button><h2 id="menu-address-title">'+(pickup?'Где забрать заказ':'Адрес доставки')+'</h2>'+(pickup?'<p class="menu-pickup-address">Губкинский, 1 микрорайон, д. 7, ТЦ «Русь», 1 этаж</p>':'<form id="menu-address-form"><label class="field">Микрорайон, дом, квартира<input name="address" maxlength="180" required autocomplete="off" value="'+escapeHTML(state.profile.addresses[0]||'')+'" placeholder="Например, 1 мкр., д. 7"></label><button class="cta" type="submit">Сохранить адрес</button></form>')+'</section></div>');$('#modal').querySelector(pickup?'[data-menu-close]':'input').focus({preventScroll:true});}if(event.target.closest('[data-menu-close]')||event.target.classList.contains('menu-address-back')){closeModal();document.querySelector('[data-menu-address]')?.focus({preventScroll:true});}});
document.addEventListener('submit',event=>{if(event.target.id!=='menu-address-form')return;event.preventDefault();const value=String(new FormData(event.target).get('address')||'').trim();if(!value){event.target.querySelector('input').setCustomValidity('Укажите адрес.');event.target.querySelector('input').reportValidity();return;}state.profile.addresses=[value,...state.profile.addresses.filter(v=>v!==value)];closeModal();render();document.querySelector('[data-menu-address]')?.focus({preventScroll:true});});
document.addEventListener('input',event=>{if(event.target.closest('#menu-address-form'))event.target.setCustomValidity('');});
applyMenuAppearance();render();

document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.getElementById('menu-address-title')){event.preventDefault();event.stopPropagation();closeModal();document.querySelector('[data-menu-address]')?.focus({preventScroll:true});}},true);

// Compact search disclosure in category navigation; billing rules stay in the product sheet.
document.addEventListener('click',event=>{if(!event.target.closest('[data-menu-search]'))return;menuSearchOpen=!menuSearchOpen;if(!menuSearchOpen)state.query='';render();document.querySelector(menuSearchOpen?'#search':'[data-menu-search]')?.focus({preventScroll:true});});
document.addEventListener('keydown',event=>{if(event.key!=='Escape'||state.page!=='menu'||!menuSearchOpen||document.getElementById('modal').childElementCount)return;event.preventDefault();menuSearchOpen=false;state.query='';render();document.querySelector('[data-menu-search]')?.focus({preventScroll:true});});
const menuOriginalProduct=renderProduct;
renderProduct=function(){menuOriginalProduct();const p=state.selected;if(p.unit==='шт'||/порци/i.test(p.unit)||(p.category==='Хачапури'||p.category==='Пироги и пицца')){document.querySelector('.product-unit').textContent=money(p.priceKopecks??Math.round(p.price*100));}if(!menuIsLavash(p))return;const sheet=document.querySelector('#modal .sheet');sheet.setAttribute('aria-label','Шашлык в лаваше');sheet.querySelector('h2').textContent='Шашлык в лаваше';const options=document.createElement('fieldset');options.className='menu-lavash-options';options.setAttribute('aria-label','Вес шашлыка в лаваше');options.innerHTML='<legend>Выберите вес</legend><div>'+MENU.filter(menuIsLavash).map(v=>'<button type="button" data-menu-lavash="'+v.id+'" aria-pressed="'+(v.id===p.id)+'" '+(allowed(v)?'':'disabled')+'><span>'+(v.id==='lavash-150'?'150 г':'200 г')+'</span><strong>'+money(v.priceKopecks??Math.round(v.price*100))+'</strong>'+(!allowed(v)?'<small>Недоступно</small>':'')+'</button>').join('')+'</div>';sheet.querySelector('.product-unit').after(options);};

// Keep the two real catalog IDs and prices when choosing the lavash portion.
document.addEventListener('click',event=>{const portion=event.target.closest('[data-menu-lavash]');if(portion){const variant=item(portion.dataset.menuLavash);if(!variant||!menuIsLavash(variant)||!allowed(variant))return;state.selected={...state.selected,...variant};renderProduct();document.querySelector('[data-menu-lavash="'+variant.id+'"]')?.focus({preventScroll:true});return;}if(event.target.closest('[data-menu-fav-lavash]')){const marked=state.favorites.some(id=>id==='lavash-150'||id==='lavash-200');state.favorites=state.favorites.filter(id=>id!=='lavash-150'&&id!=='lavash-200');if(!marked)state.favorites.push('lavash-150');render();return;}const dish=event.target.closest('[data-menu-product]');if(dish&&!event.target.closest('button,a,input'))openProduct(dish.dataset.menuProduct);});

// Observe a successful cart mutation without bypassing the existing validation.
document.addEventListener('click',event=>{
  if(!event.target.closest('[data-act=add]'))return;
  const count=state.cart.length,source=document.querySelector('#modal .big-food img');
  const selected=state.selected;if(!selected)return;
  const rect=(source||event.target.closest('[data-act=add]')).getBoundingClientRect();
  const picture={src:source?.currentSrc||selected.image,rect};
  queueMicrotask(()=>{if(state.cart.length===count+1)menuFlyToCart(picture);});
},true);
async function menuFlyToCart(picture){
  const target=document.querySelector('.bottom [data-page=cart]');if(!target||document.hidden)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const receipt=()=>target.animate([{opacity:.5},{opacity:1}],{duration:220,easing:'ease-out'});
  if(menuCartMotion==='quiet'||(menuCartMotion==='auto'&&reduced)||!picture.src){receipt();return;}
  document.querySelectorAll('.menu-cart-flight').forEach(el=>el.remove());
  const destination=target.getBoundingClientRect(),size=72;
  const startX=picture.rect.left+picture.rect.width/2-size/2;
  const startY=Math.max(0,Math.min(innerHeight-size,picture.rect.top+picture.rect.height/2-size/2));
  const x=destination.left+destination.width/2-size/2-startX;
  const y=destination.top+destination.height/2-size/2-startY;
  const flight=document.createElement('img');flight.src=picture.src;flight.alt='';flight.width=size;flight.height=size;flight.setAttribute('aria-hidden','true');flight.className='menu-cart-flight';
  flight.style.left=startX+'px';flight.style.top=startY+'px';flight.style.visibility='hidden';document.body.append(flight);
  try{await flight.decode();}catch{flight.remove();receipt();return;}
  if(!flight.isConnected||document.hidden||menuCartMotion==='quiet'||(menuCartMotion==='auto'&&reduced)){flight.remove();return;}
  flight.style.visibility='visible';
  const animation=flight.animate([
    {transform:'translate(0,0) scale(1)',opacity:1},
    {transform:'translate('+x*.45+'px,'+(y*.3-45)+'px) scale(.82)',opacity:1,offset:.4},
    {transform:'translate('+x*.9+'px,'+y*.85+'px) scale(.5)',opacity:1,offset:.82},
    {transform:'translate('+x+'px,'+y+'px) scale(.18)',opacity:0}
  ],{duration:720,easing:'cubic-bezier(.3,0,.65,1)'});
  animation.finished.then(()=>{flight.remove();receipt();},()=>flight.remove());
}

// Fixed-price products go straight into the cart. Weight choices stay in the sheet.
document.addEventListener('click',event=>{
  if(state.role!=='customer')return;
  const control=event.target.closest('button,a,input,select');
  if(control&&!control.matches('[data-product]'))return;
  const product=event.target.closest('[data-product]'),dish=event.target.closest('[data-menu-product]');
  const p=item(product?.dataset.product||dish?.dataset.menuProduct);
  if(!p||p.unit==='100g'||menuIsLavash(p))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(!allowed(p)){toast('Блюдо недоступно сейчас');return;}
  const source=(product||dish).querySelector('img');
  const picture={src:source?.currentSrc||p.image,rect:(source||product||dish).getBoundingClientRect()};
  const existing=state.cart.find(l=>l.id===p.id&&!l.addons.length&&l.sauce==='Обычный'&&l.qty<50);
  if(existing)existing.qty+=1;else state.cart.push(line(p.id));
  render();document.querySelector('button[data-product="'+p.id+'"]')?.focus({preventScroll:true});menuFlyToCart(picture);toast('Добавлено в корзину: '+p.name);
},true);

const menuOriginalCartLine=cartLine;
cartLine=function(l,remove=true){
  const html=menuOriginalCartLine(l,remove).replace(l.qty+' шт · шт',l.qty+' шт');if(!remove||state.page!=='cart'||l.unit==='100g')return html;
  const name=escapeHTML(l.name),id=escapeHTML(l.lineId);
  const stepper='<div class="menu-cart-controls"><div class="menu-quantity" role="group" aria-label="Количество: '+name+'">'
    +'<button type="button" data-menu-quantity="'+id+'" data-change="-1" aria-label="Уменьшить количество: '+name+'">'+icon('minus',18)+'</button>'
    +'<output aria-live="polite" aria-label="Количество: '+name+'">'+l.qty+'</output>'
    +'<button type="button" data-menu-quantity="'+id+'" data-change="1" aria-label="Увеличить количество: '+name+'" '+(l.qty>=50?'disabled':'')+'>'+icon('plus',18)+'</button></div>'
    +(l.id.startsWith('shawarma-')||menuIsLavash(l)?'<button class="menu-cart-edit" data-menu-edit="'+id+'" aria-label="Настроить: '+name+'">'+(menuIsLavash(l)?'Изменить вес':'Добавки и соус')+'</button>':'')+'</div>';
  return html.replace('<div style="margin-top:8px">',stepper+'<div style="margin-top:8px">');
};
let menuEditingLineId=null;
const menuCloseBeforeEdit=closeModal;
closeModal=function(){menuEditingLineId=null;menuCloseBeforeEdit();};
const menuProductBeforeEdit=renderProduct;
renderProduct=function(){menuProductBeforeEdit();if(menuEditingLineId){const button=document.querySelector('#modal [data-act=add]');button.dataset.act='menu-save';button.querySelector('span').textContent='Сохранить изменения';}};
document.addEventListener('click',event=>{
  const quantity=event.target.closest('[data-menu-quantity]');
  if(quantity){
    const l=state.cart.find(l=>l.lineId===quantity.dataset.menuQuantity);if(!l||l.unit==='100g')return;
    const next=l.qty+Number(quantity.dataset.change);if(!Number.isInteger(next)||next<0||next>50)return;
    if(next===0)state.cart=state.cart.filter(v=>v.lineId!==l.lineId);else l.qty=next;
    const direction=quantity.dataset.change;render();
    const focus=document.querySelector('[data-menu-quantity="'+l.lineId+'"][data-change="'+direction+'"]');
    (focus||document.querySelector('.bottom [data-page=cart]'))?.focus({preventScroll:true});
    if(next===0)toast('Удалено из корзины: '+l.name);return;
  }
  const edit=event.target.closest('[data-menu-edit]');
  if(edit){const l=state.cart.find(l=>l.lineId===edit.dataset.menuEdit);if(!l)return;menuEditingLineId=l.lineId;state.selected={...l,addons:[...l.addons]};renderProduct();return;}
  if(!event.target.closest('[data-act=menu-save]'))return;
  const p=state.selected,l=state.cart.find(l=>l.lineId===menuEditingLineId);
  if(!l){closeModal();toast('Блюдо уже удалено из корзины');return;}
  if(!Number.isInteger(p.qty)||p.qty<1||p.qty>50){document.querySelector('#product-error').textContent='Введите корректное целое количество';return;}
  if(!allowed(item(p.id))){document.querySelector('#product-error').textContent='Блюдо недоступно сейчас';return;}
  const savedId=l.lineId;Object.assign(l,p,{lineId:savedId,addons:[...p.addons]});closeModal();render();
  document.querySelector('[data-menu-edit="'+savedId+'"]')?.focus({preventScroll:true});toast('Изменения сохранены');
});
render();
