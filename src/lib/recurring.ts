import type {ExtraEntry,PeriodMode} from './diagnosis';
export type RecurringMovement={id:string;name:string;amount:number;kind:ExtraEntry['kind'];frequency:'monthly'|'weekly'|'yearly';start:string;end:string;enabled:boolean};
export type FinancialGoal={id:string;name:string;target:number;saved:number;deadline:string};
export function recurringEntries(items:RecurringMovement[],mode:PeriodMode,month:string,today:string):ExtraEntry[]{
 const day=(s:string)=>new Date(`${s}T00:00:00Z`);const now=day(today);let from:Date,to:Date;
 if(mode==='recent'){to=now;from=new Date(now);from.setUTCDate(from.getUTCDate()-29);}else{from=day(mode==='annual'?`${month.slice(0,4)}-01-01`:`${month}-01`);to=new Date(Date.UTC(from.getUTCFullYear(),mode==='annual'?12:from.getUTCMonth()+1,0));}
 if(!Number.isFinite(from.getTime())||!Number.isFinite(to.getTime()))return [];
 return items.filter(x=>x.enabled).flatMap(x=>{
  const start=day(x.start),end=x.end?day(x.end):to;if(!Number.isFinite(start.getTime()))return [];
  let count=0;const last=new Date(Math.min(end.getTime(),to.getTime()));
  if(x.frequency==='weekly'){const step=7*86400000;const first=start.getTime()+Math.max(0,Math.ceil((from.getTime()-start.getTime())/step))*step;if(first<=last.getTime())count=Math.floor((last.getTime()-first)/step)+1;}
  else {const firstYear=from.getUTCFullYear();for(let year=firstYear;year<=last.getUTCFullYear();year++){for(let m=0;m<12;m++){if(x.frequency==='yearly'&&m!==start.getUTCMonth())continue;const date=new Date(Date.UTC(year,m,Math.min(start.getUTCDate(),new Date(Date.UTC(year,m+1,0)).getUTCDate())));if(date>=start&&date>=from&&date<=last)count++;}}}
  return count?[{id:`recurring:${x.id}`,name:`${x.name} · recorrente (${count}×)`,amount:Math.round(x.amount*count*100)/100,kind:x.kind}]:[];
 });
}
