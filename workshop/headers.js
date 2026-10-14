const phone=document.getElementById('header-phone');
const headerHost=document.getElementById('restaurant-header');
const sheet=document.getElementById('address-sheet');
const addressInput=document.getElementById('demo-address');
const appearanceKey='jarovnya-workshop-appearance-v1';
const headerKey='jarovnya-workshop-header-v1';
const names={background:{craft:'Крафт',urban:'Уголь'},theme:{light:'Светлая',dark:'Тёмная'},font:{oswald:'Oswald',neucha:'Neucha'},header:{compact:'Компактная'}};
const descriptions={compact:'Короткая шапка: меню начинается раньше, основные действия рядом.'};
const headerIds=Object.keys(names.header);
const state={background:'urban',theme:'dark',font:'oswald',header:'compact',mode:'delivery',address:''};
try{
  const saved=JSON.parse(localStorage.getItem(appearanceKey)||'{}');
  for(const key of ['background','theme','font'])if(Object.hasOwn(names[key],saved[key]))state[key]=saved[key];
  const savedHeader=localStorage.getItem(headerKey);
  if(Object.hasOwn(names.header,savedHeader))state.header=savedHeader;
}catch{}
const requestedHeader=new URLSearchParams(window.location.search).get('header');
if(Object.hasOwn(names.header,requestedHeader))state.header=requestedHeader;
const paths={phone:'M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.8L8.6 10.6a16 16 0 0 0 4.8 4.8l1.3-1.3a2 2 0 0 1 1.8-.6l2.8.4a2 2 0 0 1 1.7 2z',pin:'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',arrow:'m9 5 7 7-7 7'};
function icon(name){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';}
function logo(){return '<span class="logo-shell"><img src="../brand/logo-reconstruction-unapproved.png" alt="Жаровня" width="2172" height="724"></span>';}
function call(){return '<a class="phone-icon" href="tel:+73493660009" aria-label="Позвонить в Жаровню">'+icon('phone')+'</a>';}
function modes(){return '<div class="receive-controls" role="group" aria-label="Способ получения"><button data-mode="delivery" aria-pressed="'+(state.mode==='delivery')+'">Доставка</button><button data-mode="pickup" aria-pressed="'+(state.mode==='pickup')+'">Самовывоз</button></div>';}
function renderLocation(){return '<button class="location-button" id="open-address" aria-controls="address-sheet" aria-expanded="false">'+icon('pin')+'<span class="address-copy"><strong id="location-title"></strong><small id="location-detail"></small></span>'+icon('arrow')+'</button>';}
function renderHeader(){
  const html='<div class="header-row">'+logo()+call()+'</div>'+renderLocation()+modes();
  headerHost.innerHTML='<header class="app-header header-'+state.header+'">'+html+'<p class="delivery-rule">'+(state.mode==='pickup'?'Без минимальной суммы. Время подтвердит ресторан.':'Доставка от 1 000 ₽')+'</p></header>';
  document.getElementById('location-title').textContent=state.mode==='pickup'?'Забрать в Жаровне':state.address||'Куда привезти?';
  document.getElementById('location-detail').textContent=state.mode==='pickup'?'Губкинский, 1 мкр., д. 7 · ТЦ «Русь»':state.address?'Губкинский · изменить адрес':'Губкинский · укажите адрес доставки';
}
function update(){
  phone.className='phone '+state.background+' theme-'+state.theme+' '+state.font;
  for(const key of ['background','theme','font','header'])document.querySelectorAll('[data-'+key+']').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset[key]===state[key])));
  document.getElementById('selection').textContent=[names.header[state.header],names.background[state.background],names.theme[state.theme],names.font[state.font]].join(' · ');
  document.getElementById('header-position').textContent=(headerIds.indexOf(state.header)+1)+' / '+headerIds.length+' · '+names.header[state.header];
  document.getElementById('header-description').textContent=descriptions[state.header];
  document.getElementById('quick-header-theme').textContent=state.theme==='dark'?'Включить светлую тему':'Включить тёмную тему';
  try{localStorage.setItem(appearanceKey,JSON.stringify({background:state.background,theme:state.theme,font:state.font}));localStorage.setItem(headerKey,state.header);}catch{}
  const url=new URL(window.location.href);url.searchParams.set('header',state.header);history.replaceState(null,'',url);
  renderHeader();
}
function closeAddress(returnFocus=true){sheet.hidden=true;const button=document.getElementById('open-address');button.setAttribute('aria-expanded','false');if(returnFocus)button.focus({preventScroll:true});}
document.addEventListener('click',event=>{
  const control=event.target.closest('button');if(!control)return;
  for(const key of ['background','theme','font','header'])if(control.dataset[key]){state[key]=control.dataset[key];closeAddress(false);update();return;}
  if(control.dataset.mode){state.mode=control.dataset.mode;closeAddress(false);update();document.querySelector('[data-mode="'+state.mode+'"]').focus({preventScroll:true});return;}
  if(control.id==='open-address'){
    const pickup=state.mode==='pickup';sheet.hidden=false;control.setAttribute('aria-expanded','true');
    document.getElementById('address-title').textContent=pickup?'Где забрать заказ':'Адрес доставки';
    document.getElementById('address-form').hidden=pickup;document.getElementById('pickup-address').hidden=!pickup;
    addressInput.value=state.address;(pickup?document.getElementById('close-address'):addressInput).focus({preventScroll:true});
  }
});
document.getElementById('close-address').addEventListener('click',()=>closeAddress());
document.getElementById('address-form').addEventListener('submit',event=>{event.preventDefault();const value=addressInput.value.trim();if(!value){addressInput.setCustomValidity('Укажите пример адреса.');addressInput.reportValidity();return;}state.address=value;closeAddress(false);update();document.getElementById('open-address').focus({preventScroll:true});});
addressInput.addEventListener('input',()=>addressInput.setCustomValidity(''));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sheet.hidden)closeAddress();});
function stepHeader(direction){closeAddress(false);state.header=headerIds[(headerIds.indexOf(state.header)+direction+headerIds.length)%headerIds.length];update();}
document.getElementById('previous-header').addEventListener('click',()=>stepHeader(-1));
document.getElementById('next-header').addEventListener('click',()=>stepHeader(1));
document.getElementById('quick-header-theme').addEventListener('click',()=>{closeAddress(false);state.theme=state.theme==='dark'?'light':'dark';update();});
update();

