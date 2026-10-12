'use strict';
const Rules={
 lineKopecks(l){if(l.unit==='100g'){if(l.actualGrams==null)return null;if(!Number.isInteger(l.actualGrams)||l.actualGrams<1||l.actualGrams>100000)throw new RangeError('Invalid weight');return Math.round((l.priceKopecks??l.price*100)*l.actualGrams/100);}if(!Number.isInteger(l.qty)||l.qty<1||l.qty>50)throw new RangeError('Invalid quantity');return ((l.priceKopecks??Math.round(l.price*100))+(l.addons||[]).length*4900)*l.qty;},
 quote(lines,{mode='delivery',zone='city',birthday=false}={}){const values=lines.map(l=>this.lineKopecks(l));const unknownCount=values.filter(v=>v==null).length;const subtotal=values.reduce((s,v)=>s+(v??0),0);const discount=birthday?Math.round(subtotal/10):0;const delivery=mode==='pickup'?0:zone==='outside'||unknownCount?null:subtotal>=300000?0:15000;return {subtotal,unknownCount,discount,delivery,total:unknownCount||delivery==null?null:subtotal-discount+delivery,minimumMet:mode==='pickup'||subtotal>=100000||unknownCount>0,requiresManualQuote:unknownCount>0,unpricedDelivery:delivery==null};},
 availability(p,mode,day,min){if(min<600||min>=1320)return false;if(p.category==='Бизнес-ланч'&&(!(day>=1&&day<=4)||min<660||min>=960))return false;if(min>=1215)return mode==='pickup'&&p.id.startsWith('shawarma-');return true;},
 validateWeight(l,g){return !Number.isInteger(g)||g<=0||g>100000?'Укажите целое положительное число граммов (до 100 000)':null;},
 stages:['pending','accepted','cooking','ready','courier','delivered'],
 canMove(from,to,mode){const seq=mode==='pickup'?['pending','accepted','cooking','ready','delivered']:this.stages;const at=seq.indexOf(from);return at>=0&&seq.indexOf(to)===at+1;},
 rub(n){return (n/100).toLocaleString('ru-RU',{maximumFractionDigits:2})+' ₽';}
};
if(typeof module!=='undefined')module.exports=Rules;
