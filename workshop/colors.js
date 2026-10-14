const palettes={"cherry":{"name":"Вишнёвый","description":"Выразительный вишнёвый акцент и лёгкая ягодная подложка. Тот красный, с которого начали сравнение."},"scarlet":{"name":"Алый","description":"Более яркий и чистый красный. Акцент заметнее на крафте и угле."},"ruby":{"name":"Рубиновый","description":"Холодный красный с лёгким ягодным оттенком. Более необычное сочетание с крафтом."},"cranberry":{"name":"Клюквенный","description":"Мягкий красный с заметным ягодным оттенком. Менее строгий и более светлый."},"bordeaux":{"name":"Бордовый","description":"Сдержанный глубокий красный. Подложка итогов — приглушённая, винная."},"wine":{"name":"Тёмно-винный","description":"Самый глубокий вариант: почти чёрный винный акцент и спокойная подложка."}};
const paletteRoot=document.documentElement;
function refreshPalette(){
  document.getElementById("palette-select").value=paletteRoot.dataset.palette;
  document.querySelectorAll('[data-palette-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.paletteChoice===paletteRoot.dataset.palette)));
  document.getElementById('palette-description').textContent=palettes[paletteRoot.dataset.palette].description;
  const styles=getComputedStyle(paletteRoot);document.getElementById('accent-code').textContent=styles.getPropertyValue('--accent').trim().toUpperCase();document.getElementById('surface-code').textContent=styles.getPropertyValue('--tint').trim().toUpperCase();
  const url=new URL(location.href);for(const key of ['palette','theme','material'])url.searchParams.set(key,paletteRoot.dataset[key]);history.replaceState(null,'',url);
}
const initial=new URLSearchParams(location.search);if(Object.hasOwn(palettes,initial.get('palette')||''))paletteRoot.dataset.palette=initial.get('palette');if(['light','dark'].includes(initial.get('theme')))paletteRoot.dataset.theme=initial.get('theme');if(['craft','urban'].includes(initial.get('material')))paletteRoot.dataset.material=initial.get('material');
document.getElementById('palette-theme').value=paletteRoot.dataset.theme;document.getElementById('palette-material').value=paletteRoot.dataset.material;
document.querySelectorAll('[data-preview-icon]').forEach(el=>{el.innerHTML=jarovnyaIcon(el.dataset.previewIcon,20);});
let previewQuantity=3;const formatMoney=n=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(n);
document.addEventListener('click',event=>{
  const palette=event.target.closest('[data-palette-choice]');if(palette){paletteRoot.dataset.palette=palette.dataset.paletteChoice;refreshPalette();return;}
  const mode=event.target.closest('.sample-modes button,.sample-categories button');if(mode){mode.parentElement.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===mode)));return;}
  const quantity=event.target.closest('[data-preview-quantity]');if(!quantity)return;previewQuantity=Math.min(9,Math.max(1,previewQuantity+Number(quantity.dataset.previewQuantity)));const subtotal=previewQuantity*340,delivery=subtotal>=3000?0:150;document.getElementById('preview-quantity').textContent=previewQuantity;document.getElementById('line-price').textContent=formatMoney(subtotal);document.getElementById('subtotal').textContent=formatMoney(subtotal);document.getElementById('delivery-price').textContent=delivery?formatMoney(delivery):'Бесплатно';document.getElementById('total').textContent=formatMoney(subtotal+delivery);
});
document.addEventListener('change',event=>{if(event.target.id==='palette-select'&&Object.hasOwn(palettes,event.target.value))paletteRoot.dataset.palette=event.target.value;else if(event.target.id==='palette-theme')paletteRoot.dataset.theme=event.target.value;else if(event.target.id==='palette-material')paletteRoot.dataset.material=event.target.value;else return;refreshPalette();});
refreshPalette();
