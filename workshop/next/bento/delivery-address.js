/* Structured local addresses; no map provider, geolocation or paid API. */
function deliveryAddresses(){return Array.isArray(state.profile.addressDetails)?state.profile.addressDetails:[];}
function deliveryAddressText(a){return ['Губкинский',a.street,a.noHouse?'без номера':a.house?'д. '+a.house:'',a.organization,a.apartment?(a.organization?'офис ':'кв. ')+a.apartment:''].filter(Boolean).join(', ');}
function deliveryChoose(a){const address=deliveryAddressText(a);state.profile.addresses=[address,...state.profile.addresses.filter(v=>v!==address)];state.checkoutDraft={...state.checkoutDraft,address,entrance:a.entrance||'',floor:a.floor||'',intercom:a.intercom||'',note:a.note||''};deliverySyncCheckout();}
function deliverySyncCheckout(){const f=document.getElementById('checkout-form');if(!f)return;for(const key of ['address','entrance','floor','intercom','note']){const c=f.elements.namedItem(key);if(c)c.value=state.checkoutDraft[key]||'';}}
function deliveryAddressList(){
 const saved=state.profile.addresses||[];
 accountDialog('Мои адреса',`${saved.length?saved.map((text,i)=>{const a=deliveryAddresses().find(a=>deliveryAddressText(a)===text);return `<div class="delivery-saved"><button data-delivery-select="${i}"><strong>${escapeHTML(a?.label||'Адрес')}</strong><span>${escapeHTML(text)}</span></button>${a?`<button data-delivery-edit="${escapeHTML(a.id)}" aria-label="Изменить адрес ${escapeHTML(a.label)}">Изменить</button>`:''}</div>`;}).join(''):'<p>Сохраните первый адрес в Губкинском.</p>'}<button class="cta" data-delivery-new>Добавить адрес</button>`);
}
function deliveryAddressForm(existing){
 const a=existing||{}, field=(key,label,placeholder='',required=false)=>`<label class="field">${label}<input name="${key}" value="${escapeHTML(a[key]||'')}" placeholder="${placeholder}" maxlength="${['street','organization'].includes(key)?100:30}" ${required?'required':''} ${key==='house'&&a.noHouse?'disabled':''} ${key==='street'?'list="delivery-streets"':''}></label>`;
 const streets=[...new Set(['1 микрорайон',...deliveryAddresses().map(x=>x.street)])];
 accountDialog(existing?'Изменить адрес':'Новый адрес',`<form id="delivery-address-form" data-edit-id="${escapeHTML(a.id||'')}"><label class="field">Город<input value="Губкинский" readonly aria-readonly="true"></label><label class="field">Название адреса<select name="label"><option ${a.label==='Дом'?'selected':''}>Дом</option><option ${a.label==='Работа'?'selected':''}>Работа</option><option ${a.label==='Другой'?'selected':''}>Другой</option></select></label>${field('organization','Организация или место','Необязательно, например офис Сбера')}${field('street','Улица или микрорайон','Например, 1 микрорайон',true)}<datalist id="delivery-streets">${streets.map(s=>`<option value="${escapeHTML(s)}"></option>`).join('')}</datalist><p class="account-note">Можно ввести свой вариант. Подсказки — из ваших сохранённых адресов.</p><div class="delivery-fields">${field('house','Дом / строение','7',!a.noHouse)}${field('apartment','Квартира / офис','Необязательно')}${field('entrance','Подъезд / вход','Необязательно')}${field('floor','Этаж','')}${field('intercom','Домофон','')}</div><label><input type="checkbox" name="noHouse" ${a.noHouse?'checked':''} aria-describedby="delivery-no-number-help"> У здания нет номера</label><p id="delivery-no-number-help" class="account-note">Если номера нет, укажите улицу или микрорайон, а ниже — ориентир и конкретный вход. Одного названия организации недостаточно.</p><label class="field">Ориентир, вход и комментарий курьеру<textarea name="note" maxlength="300" rows="3" ${a.noHouse?'required minlength="15"':''} placeholder="Без номера — обязательно: где здание и с какой стороны вход" aria-describedby="delivery-no-number-help">${escapeHTML(a.note||'')}</textarea></label><p id="delivery-address-error" class="error" role="alert"></p><button class="cta" type="submit">Сохранить и выбрать</button></form>`);
}

document.addEventListener('change',e=>{
 if(e.target.name!=='noHouse'||e.target.form?.id!=='delivery-address-form')return;
 const form=e.target.form,noHouse=e.target.checked;
 form.elements.house.disabled=noHouse;form.elements.house.required=!noHouse;
 form.elements.note.required=noHouse;form.elements.note.minLength=noHouse?15:0;
});
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-account-addresses],[data-account-use-address],[data-menu-address],.m-header [data-mode=delivery],[data-delivery-new],[data-delivery-edit],[data-delivery-select]');if(!t)return;
 // Keep pickup location sheet available from the main address button.
 if(t.hasAttribute('data-menu-address')&&!t.hasAttribute('data-profile-address')&&state.mode==='pickup')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(t.hasAttribute('data-account-addresses'))return deliveryAddressList();
 if(t.hasAttribute('data-delivery-edit'))return deliveryAddressForm(deliveryAddresses().find(a=>a.id===t.dataset.deliveryEdit));
 if(t.hasAttribute('data-delivery-select')||t.hasAttribute('data-account-use-address')){const i=+(t.dataset.deliverySelect??t.dataset.accountUseAddress),text=state.profile.addresses[i];if(!text)return;const a=deliveryAddresses().find(a=>deliveryAddressText(a)===text);if(a)deliveryChoose(a);else{state.profile.addresses=[text,...state.profile.addresses.filter(v=>v!==text)];state.checkoutDraft={...state.checkoutDraft,address:text,entrance:'',floor:'',intercom:'',note:''};deliverySyncCheckout();}closeModal();render();toast('Адрес выбран');return;}
 if(t.matches('.m-header [data-mode=delivery]')){state.mode='delivery';render();}
 if(t.hasAttribute('data-delivery-new')||t.hasAttribute('data-profile-address'))return deliveryAddressForm();
 if(state.profile.addresses.length)deliveryAddressList();else deliveryAddressForm();
},true);
document.addEventListener('submit',e=>{
 if(e.target.id!=='delivery-address-form')return;e.preventDefault();e.stopImmediatePropagation();
 const fd=new FormData(e.target),a={id:e.target.dataset.editId||newLineId()};
 for(const key of ['label','organization','street','house','apartment','entrance','floor','intercom','note'])a[key]=String(fd.get(key)||'').trim();
 a.noHouse=fd.get('noHouse')==='on';if(a.noHouse)a.house='';
 if(!a.street||(!a.house&&!a.noHouse)){$('#delivery-address-error').textContent='Укажите улицу или микрорайон и номер дома / строения. Если номера нет, отметьте «У здания нет номера».';return;}
 // A place name alone is not sufficient delivery guidance for an unnumbered building.
 const guidance=a.note.toLocaleLowerCase('ru').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const place=a.organization.toLocaleLowerCase('ru').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 if(a.noHouse&&(guidance.length<15||guidance.split(/\s+/).length<3||guidance===place)){$('#delivery-address-error').textContent='Для здания без номера опишите ориентир и конкретный вход: минимум 15 символов и 3 слова. Одного названия организации недостаточно.';return;}
 if(!['Дом','Работа','Другой'].includes(a.label))a.label='Другой';
 const old=deliveryAddresses().find(x=>x.id===a.id),text=deliveryAddressText(a);
 if(old)state.profile.addresses=state.profile.addresses.filter(v=>v!==deliveryAddressText(old));
 state.profile.addressDetails=[a,...deliveryAddresses().filter(x=>x.id!==a.id&&deliveryAddressText(x)!==text)];
 deliveryChoose(a);closeModal();render();toast('Адрес сохранён на устройстве');
},true);
const structuredCheckoutBase=renderCheckout;
renderCheckout=function(){const host=document.createElement('div');setHTML(host,structuredCheckoutBase());const input=host.querySelector('input[name=address]');if(input){input.readOnly=true;input.placeholder='Выберите или добавьте адрес';const button=document.createElement('button');button.type='button';button.className='secondary delivery-checkout-edit';button.setAttribute('data-menu-address','');button.setAttribute('data-profile-address','');button.textContent='Выбрать адрес';input.parentElement.append(button);button.removeAttribute('data-profile-address');}return host.innerHTML;};

// Repaint once after all experiment overrides are installed (also on first load).
menuCatalogSignature=null;render();
