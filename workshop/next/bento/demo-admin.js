/* Explicit local-only admin shortcut to exercise account XP. */
const accountStaffOrderBase=staffOrder;
staffOrder=function(order){return accountStaffOrderBase(order)+(state.role==='admin'&&order.owner==='me'&&!(order.status==='delivered'&&order.paid)?`<button class="demo-complete" data-demo-complete="${order.id}">Тест: оплачен и выдан · №${order.id}</button>`:'');};
document.addEventListener('click',e=>{
 const trigger=e.target.closest('[data-demo-complete]');if(!trigger||state.role!=='admin')return;
 const order=state.orders.find(o=>o.id===+trigger.dataset.demoComplete&&o.owner==='me');if(!order)return;
 accountDialog('Завершить тестовый заказ',`<p>Заказ №${order.id}. Это проверка на этом устройстве: деньги не списываются, касса не подключена.</p><form id="demo-complete-form" data-order-id="${order.id}">${order.lines.filter(l=>l.unit==='100g').map(l=>`<label class="field">${escapeHTML(l.name)} · фактический вес, г<input name="${escapeHTML(l.lineId)}" type="number" inputmode="numeric" min="1" max="100000" step="1" required value="${l.actualGrams??''}" placeholder="Например, 1000"></label>`).join('')}<p id="demo-complete-error" class="error" role="alert"></p><button type="submit" class="cta">Подтвердить оплату и выдачу в демо</button></form>`);
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='demo-complete-form')return;e.preventDefault();if(state.role!=='admin')return;
 const order=state.orders.find(o=>o.id===+e.target.dataset.orderId&&o.owner==='me');if(!order)return;
 const fd=new FormData(e.target), weights=[];
 for(const l of order.lines.filter(l=>l.unit==='100g')){const g=Number(fd.get(l.lineId)),error=Rules.validateWeight(l,g);if(error){$('#demo-complete-error').textContent=error;return;}weights.push([l,g]);}
 for(const [l,g] of weights)l.actualGrams=g;
 order.paid=true;order.grillDone=true;order.kitchenDone=true;order.status='delivered';
 closeModal();render();toast('Тестовый заказ завершён. XP обновлён в личном кабинете.');
});
const polishCloseModalBase=closeModal;
closeModal=function(){polishCloseModalBase();if(document.body.classList.contains('search-active'))document.body.style.overflow='hidden';};
document.addEventListener('click',e=>{if(document.body.classList.contains('search-active')&&e.target.closest('button[data-page],a[data-page]')){document.body.classList.remove('search-active');document.body.style.overflow='';}},true);
