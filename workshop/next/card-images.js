// Workshop-only cutouts. Preserve the shared photos and all catalog prices/IDs.
const CARD_IMAGE_ASSETS={};
for(const product of MENU){
  const name=product.id==='mors-half'?'mors-half':product.id==='mors'?'mors-1l-classic':product.image.split('/').pop().replace(/\.webp$/,'');
  const path='../card-assets/'+name+'.webp';
  CARD_IMAGE_ASSETS[product.id]=path;
  product.image=path;
}
