const phone=document.getElementById('phone');
const content=document.getElementById('preview-content');
const panel=document.getElementById('menu-panel');
const openButton=document.getElementById('open-menu');
const closeButton=document.getElementById('close-menu');
const backgrounds={craft:'Крафт',urban:'Уголь'};
const themes={light:'Светлая',dark:'Тёмная'};
const preferenceKey='jarovnya-workshop-appearance-v1';
const fonts={oswald:'Oswald',neucha:'Neucha'};
const fontIds=Object.keys(fonts);
let background='urban',font='oswald',theme='dark';
try{
  const saved=JSON.parse(localStorage.getItem(preferenceKey)||'{}');
  if(Object.hasOwn(backgrounds,saved.background))background=saved.background;
  if(Object.hasOwn(fonts,saved.font))font=saved.font;
  if(Object.hasOwn(themes,saved.theme))theme=saved.theme;
}catch{/* Storage can be disabled in private browsing. */}

function update(){
  phone.className='phone '+background+' theme-'+theme+' '+font;
  document.querySelectorAll('[data-background]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.background===background)));
  document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));
  document.querySelectorAll('[data-font]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.font===font)));
  document.getElementById('chosen').textContent=backgrounds[background]+' · '+themes[theme]+' · '+fonts[font];
  document.getElementById('font-position').textContent=(fontIds.indexOf(font)+1)+' / '+fontIds.length+' · '+fonts[font];
  document.getElementById('quick-theme').textContent=theme==='dark'?'Включить светлую тему':'Включить тёмную тему';
  try{localStorage.setItem(preferenceKey,JSON.stringify({background,font,theme}));}catch{}
}
function closeMenu(){panel.hidden=true;openButton.setAttribute('aria-expanded','false');}
document.querySelectorAll('[data-background]').forEach(b=>b.addEventListener('click',()=>{background=b.dataset.background;update();}));
document.querySelectorAll('[data-font]').forEach(b=>b.addEventListener('click',()=>{font=b.dataset.font;update();}));
document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.theme;update();}));
document.getElementById('quick-theme').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';update();});
document.getElementById('show-ui').addEventListener('change',e=>{content.hidden=!e.target.checked;closeMenu();});
openButton.addEventListener('click',()=>{panel.hidden=false;openButton.setAttribute('aria-expanded','true');closeButton.focus({preventScroll:true});});
closeButton.addEventListener('click',()=>{closeMenu();openButton.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeMenu();openButton.focus({preventScroll:true});}});
function stepFont(direction){font=fontIds[(fontIds.indexOf(font)+direction+fontIds.length)%fontIds.length];update();}
document.getElementById('previous-font').addEventListener('click',()=>stepFont(-1));
document.getElementById('next-font').addEventListener('click',()=>stepFont(1));
update();

