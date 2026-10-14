const phone=document.getElementById('phone');
const content=document.getElementById('preview-content');
const panel=document.getElementById('menu-panel');
const openButton=document.getElementById('open-menu');
const closeButton=document.getElementById('close-menu');
const backgrounds={urban:'Уголь',poster:'Плакат'};
const fonts={oswald:'Oswald',caveat:'Caveat',russo:'Russo One'};
let background='urban',font='oswald';
function update(){phone.className='phone '+background+' '+font;document.querySelectorAll('[data-background]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.background===background)));document.querySelectorAll('[data-font]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.font===font)));document.getElementById('chosen').textContent=backgrounds[background]+' · '+fonts[font];}
function closeMenu(){panel.hidden=true;openButton.setAttribute('aria-expanded','false');}
document.querySelectorAll('[data-background]').forEach(b=>b.addEventListener('click',()=>{background=b.dataset.background;update();}));
document.querySelectorAll('[data-font]').forEach(b=>b.addEventListener('click',()=>{font=b.dataset.font;update();}));
document.getElementById('show-ui').addEventListener('change',e=>{content.hidden=!e.target.checked;closeMenu();});
openButton.addEventListener('click',()=>{panel.hidden=false;openButton.setAttribute('aria-expanded','true');closeButton.focus({preventScroll:true});});
closeButton.addEventListener('click',()=>{closeMenu();openButton.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeMenu();openButton.focus({preventScroll:true});}});
update();
