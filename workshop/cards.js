const cardDescriptions={square:'Полный снимок блюда с небольшим скруглением. Крупная фотография и спокойная композиция.',round:'Круглая рамка фотографии подчёркивает тарелку. Углы исходного снимка обрезаются.',wide:'Широкий кадр делает карточку ниже. Верх и низ исходного снимка немного обрезаются.'};
function applyCardChoice(choice){
  if(!Object.hasOwn(cardDescriptions,choice))choice='square';
  document.documentElement.dataset.card=choice;
  document.querySelectorAll('[data-card-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cardChoice===choice)));
  document.getElementById('cards-description').textContent=cardDescriptions[choice];
  const url=new URL(location.href);url.searchParams.set('card',choice);history.replaceState(null,'',url);
}
const linkedCards=new URLSearchParams(location.search);
for(const key of ['theme','material'])if(menuChoices[key].includes(linkedCards.get(key)))menuAppearance[key]=linkedCards.get(key);
applyMenuAppearance();applyCardChoice(linkedCards.get('card'));render();
document.addEventListener('click',event=>{const button=event.target.closest('[data-card-choice]');if(button)applyCardChoice(button.dataset.cardChoice);});
document.addEventListener('change',event=>{if(!['menu-theme-select','menu-material-select'].includes(event.target.id))return;const url=new URL(location.href);for(const key of ['theme','material'])url.searchParams.set(key,menuAppearance[key]);history.replaceState(null,'',url);});

