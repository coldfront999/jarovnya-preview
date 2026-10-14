/* Reference directions 2, 3, 4, 7, 8. Uses only the existing menu and photos. */
function referenceCategory(category){
 if(!['urban','craft','story'].includes(designKey))return dishIcon(categorySymbols[category]);
 const photo=MENU.find(p=>p.category===category&&p.image)||(category==='Популярное'?item('pork'):null);
 return photo?`<img src="${photo.image}" alt="" width="54" height="54" loading="lazy">`:dishIcon(categorySymbols[category]);
}
function referenceStories(){return `<nav class="story-rail" aria-label="Быстрый выбор блюда">${[['Шаурма','shawarma-chicken'],['Мангал','pork'],['Хачапури','adjara'],['Пироги и пицца','pie-6'],['Напитки','mors']].map(([c,id])=>`<button data-category="${c}" aria-pressed="${state.category===c}"><span><img src="${item(id).image}" alt="" width="58" height="58"></span>${c==='Пироги и пицца'?'Пицца':c}</button>`).join('')}</nav>`;}
function referenceIntro(){
 const button=(category,label='Смотреть меню')=>`<button data-category="${category}" class="intro-link">${label} ${icon('arrow',18)}</button>`;
 if(designKey==='minimal')return `<section class="design-intro minimal-intro"><img src="${item('pork').image}" alt="Шашлык из свиной шеи" width="480" height="400" fetchpriority="high"><div><p class="intro-tag">Собираемся за столом</p><h1>Любимые<br>блюда<br>рядом</h1>${button('Мангал','Перейти в меню')}</div></section>`;
 if(designKey==='urban')return `<section class="design-intro urban-intro"><img src="${item('shawarma-chicken').image}" alt="Шаурма с курицей" width="480" height="500" fetchpriority="high"><div class="urban-copy"><svg class="crown" viewBox="0 0 80 42" width="66" height="35" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 8 19 13L36 3l14 20L73 8l-8 29L13 33Z"/></svg><h1>Больше<br>чем<br><em>еда</em></h1><p>Мясо. Люди. Атмосфера.<br>Губкинский.</p>${button('Шаурма')}</div></section>`;
 if(designKey==='craft')return `<section class="design-intro craft-intro"><div><h1>Настоящая<br><em>Жаровня</em></h1><p>Вкусы, которые<br>собирают людей</p>${button('Мангал','К столу')}</div><img class="oven-drawing" src="../brand/craft-oven.svg" alt="" width="250" height="230"></section>`;
 if(designKey==='brutal')return `<section class="design-intro brutal-intro"><img src="${item('shawarma-chicken').image}" alt="Шаурма с курицей" width="420" height="520" fetchpriority="high"><div><span class="brutal-fire" aria-hidden="true">${icon('fire',60)}</span><h1>Еда<br>без<br>правил</h1><p>Шаурма / Мангал<br>Хачапури / Пироги</p>${button('Шаурма','Выбрать блюдо')}</div></section>`;
 return `<section class="design-intro story-intro"><img src="${item('shawarma-pork').image}" alt="Шаурма со свининой" width="640" height="440" fetchpriority="high"><div><h1>Горячее.<br>Любимое.<br>Ваше.</h1>${button('Шаурма','Смотреть')}</div></section>`;
}
