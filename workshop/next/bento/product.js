/* Full-screen product view, retaining existing ordering and weight rules. */
const fullProductBase = renderProduct;
renderProduct = function () {
  fullProductBase();
  const sheet = document.querySelector('#modal .reference-product');
  if (!sheet) return;
  sheet.classList.add('product-screen');
  sheet.parentElement.classList.add('product-screen-back');
  const p=state.selected, body=sheet.querySelector('.reference-product-body');
  if(p.unit==='100g'){
    body.querySelector('.weight-note')?.remove();
    body.querySelector('.notice')?.remove();
    const legend=body.querySelector('.requested-weight legend');if(legend)legend.textContent='Выберите порцию';
    const hint=body.querySelector('.requested-weight .muted');
    if(hint)hint.textContent='Итоговая цена — по фактическому весу.';
    const field=body.querySelector('.requested-weight .field');
    if(field){const details=document.createElement('details');details.className='custom-portion';const summary=document.createElement('summary');summary.textContent='Другой вес';details.append(summary);field.before(details);details.append(field);if(p.requestedGrams&&!([300,500,800,1000,1500].includes(p.requestedGrams)))details.open=true;}
  }
  const checks=body.querySelector('.checks');
  if(checks){const details=document.createElement('details');details.className='product-addons';const summary=document.createElement('summary');summary.textContent='Добавки к шаурме';details.append(summary);checks.before(details);details.append(checks);}
  sheet.querySelector('.big-food').dataset.portion=String(p.requestedGrams||300);
  if(p.id==='pork'){
    const layer=document.createElement('div');layer.className='portion-pieces';layer.setAttribute('aria-hidden','true');sheet.querySelector('.big-food').append(layer);
    const label=document.createElement('small');label.className='portion-illustration';label.textContent='Анимация порции — условная';sheet.querySelector('.big-food').append(label);
    updatePortionPicture(p.requestedGrams||300,false);
  }
};
function updatePortionPicture(grams,animate=true){
  const photo=document.querySelector('.product-screen .big-food');
  const layer=photo?.querySelector('.portion-pieces');
  if(!layer||!Number.isFinite(grams)||grams<1||grams>100000)return;
  const count=Math.min(9,Math.max(0,Math.ceil((grams-300)/100)));
  const positions=[[42,56],[55,60],[48,68],[60,49],[35,65],[64,66],[38,47],[53,43],[48,56]];
  while(layer.children.length>count)layer.lastElementChild.remove();
  while(layer.children.length<count){
    const i=layer.children.length,piece=document.createElement('img');
    piece.src='images/meat-piece.webp';piece.alt='';piece.width=160;piece.height=160;
    piece.style.left=positions[i][0]+'%';piece.style.top=positions[i][1]+'%';piece.style.rotate=(i*37-50)+'deg';
    layer.append(piece);
    if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)piece.animate([{transform:'translate(-50%, -260px)',opacity:0},{offset:.16,opacity:1},{offset:.8,transform:'translate(-50%, -45%)'},{transform:'translate(-50%, -50%)'}],{duration:650,delay:(i%4)*70,easing:'cubic-bezier(.32,.02,.72,1)',fill:'backwards'});
  }
  photo.dataset.portion=String(grams);
}
// Window capture runs before the existing document weight handler stops propagation.
window.addEventListener('click',event=>{const option=event.target.closest('[data-requested-grams]');if(option)queueMicrotask(()=>updatePortionPicture(Number(option.dataset.requestedGrams)));},true);
window.addEventListener('input',event=>{if(event.target.id==='requested-grams'&&event.target.value)updatePortionPicture(Number(event.target.value));});
