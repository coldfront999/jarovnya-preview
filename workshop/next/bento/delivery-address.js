/* Structured local addresses; no map provider, geolocation or paid API. */
function deliveryAddresses(){return Array.isArray(state.profile.addressDetails)?state.profile.addressDetails:[];}
function deliveryAddressText(a){return ['Губкинский',a.street,'д. '+a.house,a.apartment?'кв. '+a.apartment:''].filter(Boolean).join(', ');}
function deliveryChoose(a){const address=deliveryAddressText(a);state.profile.addresses=[address,...state.profile.addresses.filter(v=>v!==address)];state.checkoutDraft={...state.checkoutDraft,address,entrance:a.entrance||'',floor:a.floor||'',intercom:a.intercom||'',note:a.note||''};deliverySyncCheckout();}
function deliverySyncCheckout(){const f=document.getElementById('checkout-form');if(!f)return;for(const key of ['address','entrance','floor','intercom','note']){const c=f.elements.namedItem(key);if(c)c.value=state.checkoutDraft[key]||'';}}
function deliveryAddressList(){
 const saved=state.profile.addresses||[];
 accountDialog('Мои адреса',`${saved.length?saved.map((text,i)=>{const a=deliveryAddresses().find(a=>deliveryAddressText(a)===text);return `<div class="delivery-saved"><button data-delivery-select="${i}"><strong>${escapeHTML(a?.label||'Адрес')}</strong><span>${escapeHTML(text)}</span></button>${a?`<button data-delivery-edit="${escapeHTML(a.id)}" aria-label="Изменить адрес ${escapeHTML(a.label)}">Изменить</button>`:''}</div>`;}).join(''):'<p>Сохраните первый адрес в Губкинском.</p>'}<button class="cta" data-delivery-new>Добавить адрес</button>`);
}
function deliveryAddressForm(existing){
 const a=existing||{}, field=(key,label,placeholder='',required=false)=>`<label class="field">${label}<input name="${key}" value="${escapeHTML(a[key]||'')}" placeholder="${placeholder}" maxlength="${key==='street'?100:key==='note'?300:30}" ${required?'required':''} ${key==='street'?'list="delivery-streets"':''}></label>`;
 const streets=[...new Set(['1 микрорайон',...deliveryAddresses().map(x=>x.street)])];
 accountDialog(existing?'Изменить адрес':'Новый адрес',`<form id="delivery-address-form" data-edit-id="${escapeHTML(a.id||'')}"><label class="field">Город<input value="Губкинский" readonly aria-readonly="true"></label><label class="field">Название адреса<select name="label"><option ${a.label==='Дом'?'selected':''}>Дом</option><option ${a.label==='Работа'?'selected':''}>Работа</option><option ${a.label==='Другой'?'selected':''}>Другой</option></select></label>${field('street','Улица или микрорайон','Например, 1 микрорайон',true)}<datalist id="delivery-streets">${streets.map(s=>`<option value="${escapeHTML(s)}"></option>`).join('')}</datalist><p class="account-note">Можно ввести свой вариант. Подсказки — из ваших сохранённых адресов.</p><div class="delivery-fields">${field('house','Дом','7',true)}${field('apartment','Квартира','Необязательно')}${field('entrance','Подъезд','')}${field('floor','Этаж','')}${field('intercom','Домофон','')}</div><label class="field">Комментарий курьеру<textarea name="note" maxlength="300" rows="3" placeholder="Как найти вход или что уточнить">${escapeHTML(a.note||'')}</textarea></label><p id="delivery-address-error" class="error" role="alert"></p><button class="cta" type="submit">Сохранить и выбрать</button></form>`);
}
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
 for(const key of ['label','street','house','apartment','entrance','floor','intercom','note'])a[key]=String(fd.get(key)||'').trim();
 if(!a.street||!a.house){$('#delivery-address-error').textContent='Укажите улицу или микрорайон и номер дома.';return;}
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
