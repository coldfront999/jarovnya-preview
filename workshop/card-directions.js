const directionDescriptions={table:'Блюда стоят прямо на общем фоне. Крупные фото, спокойные подписи и только тонкая линия между рядами.',signature:'Фотографии расположены свободнее, названия набраны Neucha. Небольшие знаки кухни и поворот тарелок делают подачу живее.',grill:'Название ведёт взгляд к блюду. Графические знаки категорий и одна тонкая линия между колонками заменяют рамки.'};
for(const id of ['pork','shawarma-chicken','adjara','potatoes'])item(id).image='card-assets/'+id+'.png';
const directionBaseCard=card;
card=function(p){const glyph=p.category==='Мангал'?'fire':p.category==='Хачапури'||p.category==='Пироги и пицца'?'chef':'fork';return directionBaseCard(p).replace('<div class="menu-copy">','<div class="menu-copy"><span class="dish-category">'+icon(glyph,26)+'<span>'+escapeHTML(p.category)+'</span></span>');};
function applyDirection(value){
  if(!Object.hasOwn(directionDescriptions,value))value='table';
  document.documentElement.dataset.direction=value;
  document.querySelectorAll('[data-direction-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.directionChoice===value)));
  document.getElementById('direction-description').textContent=directionDescriptions[value];
  const url=new URL(location.href);url.searchParams.set('direction',value);history.replaceState(null,'',url);proposalLink();
}
const directionLink=proposalLink;
proposalLink=function(){directionLink();const url=new URL(document.getElementById('proposal-fullscreen').href);url.searchParams.set('direction',document.documentElement.dataset.direction);document.getElementById('proposal-fullscreen').href=url.pathname+url.search;};
applyDirection(new URLSearchParams(location.search).get('direction'));
menuCatalogSignature=null;render();
document.addEventListener('click',event=>{const choice=event.target.closest('[data-direction-choice]');if(choice)applyDirection(choice.dataset.directionChoice);});

