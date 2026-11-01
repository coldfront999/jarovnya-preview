/* Persistent cart shortcut uses the same quote as checkout, never a fake weighted total. */
function syncFloatingCart(){
 let button=document.querySelector('.floating-cart');
 if(!button){button=document.createElement('button');button.type='button';button.className='floating-cart';button.dataset.page='cart';document.body.append(button);}
 button.hidden=state.role!=='customer'||state.page!=='menu'||!state.cart.length;
 if(button.hidden)return;
 const quote=Rules.quote(state.cart,{mode:state.mode,zone:state.zone,birthday:state.birthday});
 const unknown=state.cart.some(l=>l.unit==='100g'&&l.actualGrams==null);
 setHTML(button,icon('bag',23)+'<span>'+ (unknown?'В корзину':money(quote.subtotal))+(unknown?'<small>Вес уточним</small>':'')+'</span>');
 button.setAttribute('aria-label',unknown?'Открыть корзину, стоимость после взвешивания':'Открыть корзину, блюда на '+money(quote.subtotal));
}
const comfortRender=render;
render=function(){comfortRender();syncFloatingCart();};
syncFloatingCart();
