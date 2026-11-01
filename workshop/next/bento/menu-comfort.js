/* Keep search and the account entry within reach while browsing the menu. */
let comfortHeader=null;
const comfortObserver=new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.target===comfortHeader)document.body.classList.toggle('menu-scrolled',!entry.isIntersecting);
},{threshold:0});
function syncMenuComfort(){
 const header=state.role==='customer'&&state.page==='menu'?document.querySelector('.bento-header'):null;
 if(header===comfortHeader)return;
 comfortObserver.disconnect();comfortHeader=header;
 document.body.classList.remove('menu-scrolled');
 if(header)comfortObserver.observe(header);
}
const comfortRender=render;
render=function(){comfortRender();syncMenuComfort();syncCartDock();};
// Account shortcuts replace the old bottom navigation.
nav=function(){return '';};
function positionCartDock(){
 const dock=document.querySelector('.cart-dock'),shell=document.querySelector('#app .shell');
 if(dock&&shell)dock.style.right=Math.max(16,innerWidth-shell.getBoundingClientRect().right+16)+'px';
}
function syncCartDock(){
 let dock=document.querySelector('.cart-dock');
 if(!dock){dock=document.createElement('button');dock.type='button';dock.className='cart-dock';dock.dataset.page='cart';
 setHTML(dock,icon('bag',29)+'<span class="cart-dock-label">Корзина</span><b class="cart-dock-count"></b>');document.body.append(dock);}
 const count=state.cart.reduce((sum,l)=>sum+(Number.isInteger(l.qty)&&l.qty>0?l.qty:1),0);
 dock.hidden=state.role!=='customer'||!count||['cart','checkout'].includes(state.page);
 dock.querySelector('.cart-dock-count').textContent=count>99?'99+':String(count);
 dock.setAttribute('aria-label','Открыть корзину. Количество: '+count);
 document.body.classList.toggle('has-cart-dock',!dock.hidden);positionCartDock();
}
window.addEventListener('resize',positionCartDock,{passive:true});
menuCatalogSignature=null;render();
