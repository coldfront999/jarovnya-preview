// Workshop-only cutouts. Preserve the shared photos and all catalog prices/IDs.
const CARD_IMAGE_ASSETS={};
for(const product of MENU){
  const name=product.id==='mors-half'?'mors-half':product.id==='mors'?'mors-1l-classic':product.image.split('/').pop().replace(/\.webp$/,'');
  const path='images/thumb/'+name+'.webp';
  CARD_IMAGE_ASSETS[product.id]=path;
  product.image=path;
  product.detailImage='images/detail/'+name+'.webp';
}

// Owner-described serving variants, workshop preview only (12 November 2026).
for(const [id,name] of Object.entries({'lula-mix':'lula-red-two','lula-pork':'lula-red-two','lula-chicken':'lula-chicken-two',wings:'wings-whole',potatoes:'potatoes-table-angle',onion:'onion-plate','lunch-pork':'lunch-pork-v2','lunch-breast':'lunch-breast-v2','lunch-thigh':'lunch-thigh-v2'})){
 const p=MENU.find(p=>p.id===id); if(!p)continue;
 p.image='images/thumb/'+name+'.webp';p.detailImage='images/detail/'+name+'.webp';CARD_IMAGE_ASSETS[id]=p.image;
}
