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
};
