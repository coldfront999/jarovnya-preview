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
render=function(){comfortRender();syncMenuComfort();};
syncMenuComfort();
