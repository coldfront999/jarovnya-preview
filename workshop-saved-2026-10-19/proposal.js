// A working design proposal; production/workshop menu files are not changed.
const proposalParams=new URLSearchParams(location.search);
document.documentElement.dataset.capture=String(proposalParams.get('capture')==='1');
// Proposal preferences must not overwrite the main workshop's saved appearance.
applyMenuAppearance=function(){const root=document.documentElement;root.dataset.theme=menuAppearance.theme;root.dataset.material=menuAppearance.material;root.dataset.type=menuAppearance.font;for(const key of Object.keys(menuChoices)){const control=document.getElementById('menu-'+key+'-select');if(control)control.value=menuAppearance[key];}};
menuAppearance.theme=['light','dark'].includes(proposalParams.get('theme'))?proposalParams.get('theme'):'light';
menuAppearance.material=['craft','urban'].includes(proposalParams.get('material'))?proposalParams.get('material'):'craft';
applyMenuAppearance();
menuModes=function(){return '<div class="m-modes" role="group" aria-label="Способ получения">'+[['delivery','Доставка','Около '+state.eta+' минут','truck'],['pickup','Самовывоз','Без минимума','store']].map(([mode,title,detail,glyph])=>'<button data-mode="'+mode+'" aria-pressed="'+(state.mode===mode)+'">'+icon(glyph,20)+'<span><strong>'+title+'</strong><small>'+detail+'</small></span></button>').join('')+'</div>'+(state.mode==='delivery'?'<p class="proposal-delivery-note">Заказ от 1 000 ₽ · доставка по городу 150 ₽</p>':'');};
const proposalCard=card;
card=function(p){let html=proposalCard(p).replace(/(<button[^>]*class="menu-price"[^>]*>)/,'$1'+icon(p.unit==='100g'||p.menuLavashGroup?'scales':'bag',16));const rate=p.unit==='100g'?'<small class="proposal-rate">За 100 г · выбрать вес</small>':'<small class="proposal-rate" aria-hidden="true">&nbsp;</small>';if(p.unit==='100g')html=html.replace('от '+money(p.priceKopecks),money(p.priceKopecks));return html.replace(/(<button[^>]*class="menu-price"[^>]*>[\s\S]*?<\/button>)/,'$1'+rate);};
const proposalRenderProduct=renderProduct;
renderProduct=function(){proposalRenderProduct();const message=document.querySelector('.sheet .notice');if(message&&state.selected.unit==='100g')message.textContent='Выберите вес готового блюда. Окончательную сумму согласуем после взвешивания.';};
let proposalFocus=null;
const proposalOpen=openProduct,proposalClose=closeModal;
openProduct=function(id){proposalFocus=document.activeElement;proposalOpen(id);};
closeModal=function(){proposalClose();if(proposalFocus?.isConnected)proposalFocus.focus({preventScroll:true});proposalFocus=null;};
const proposalRenderCart=renderCart;
renderCart=function(){return proposalRenderCart().replace(/<h3 style="margin:24px 0 12px">К мясу — самое то<\/h3><div class="cart-extras">([\s\S]*?)<\/div>/,'<details class="proposal-addons"><summary>Добавить соус или лаваш</summary><div class="cart-extras">$1</div></details>');};
const proposalRender=render;
let proposalSearchState=menuSearchOpen;
render=function(){if(proposalSearchState!==menuSearchOpen){menuCatalogSignature=null;proposalSearchState=menuSearchOpen;}proposalRender();if(state.role==='customer'&&state.page==='cart'&&state.cart.length){const action=document.querySelector('.content>[data-act=checkout]');if(action&&!document.querySelector('.proposal-checkout')){const dock=document.createElement('div');dock.className='proposal-checkout';const quote=Rules.quote(state.cart,{mode:state.mode,zone:state.zone,birthday:state.birthday});const total=document.createElement('strong');total.textContent=quote.total==null?'Сумму уточним':money(quote.total);dock.append(total,action);document.querySelector('.content').append(dock);}}};
function proposalView(view){
  if(!['menu','product','cart','admin'].includes(view))view='menu';
  closeModal();state.role=view==='admin'?'admin':'customer';state.page=view==='cart'?'cart':'menu';state.staffTab='orders';state.category='Популярное';state.query='';state.time='normal';state.mode='delivery';if(view==='admin')state.orders.sort((a,b)=>Number(b.status==='pending')-Number(a.status==='pending'));
  menuCatalogSignature=null;render();if(view==='product')openProduct('pork');
  document.querySelectorAll('[data-proposal-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.proposalView===view)));
  const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url);proposalLink();window.scrollTo(0,0);
}
function proposalLink(){const url=new URL(location.href);url.searchParams.set('capture','1');for(const key of ['theme','material'])url.searchParams.set(key,menuAppearance[key]);document.getElementById('proposal-fullscreen').href=url.pathname+url.search;}
document.addEventListener('click',event=>{const choice=event.target.closest('[data-proposal-view]');if(choice)proposalView(choice.dataset.proposalView);});
document.addEventListener('change',event=>{if(event.target.id.startsWith('menu-'))proposalLink();});
DemoStore.load().then(()=>{if(!state.cart.length){state.cart=[line('shawarma-chicken',null,3),line('adjara')];}proposalView(proposalParams.get('view'));});

