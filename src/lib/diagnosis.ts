export type ExtraEntry = {id:string;name:string;amount:number;kind:'income'|'essential'|'choice'};
export type FinancialAccounts = {income:number;rent:number;bills:number;transport:number;groceries:number;restaurants:number;subscriptions:number;shopping:number;leisure:number;other:number;irregular:number};
export type PeriodMode = 'month'|'annual'|'recent';
export const emptyAccounts:FinancialAccounts = {income:0,rent:0,bills:0,transport:0,groceries:0,restaurants:0,subscriptions:0,shopping:0,leisure:0,other:0,irregular:0};
export const essentialFields:[keyof FinancialAccounts,string][] = [['rent','Renda ou prestação'],['bills','Água, luz e internet'],['transport','Transportes e combustível'],['groceries','Alimentação e supermercado']];
export const choiceFields:[keyof FinancialAccounts,string][] = [['restaurants','Restaurantes e cafés'],['subscriptions','Subscrições'],['shopping','Compras'],['leisure','Lazer e saídas'],['other','Outras despesas'],['irregular','Despesas irregulares']];
export function accountTotals(a:FinancialAccounts,entries:ExtraEntry[]=[]){
 const sum=(kind:ExtraEntry['kind'])=>entries.filter(e=>e.kind===kind).reduce((s,e)=>s+e.amount,0);
 return {income:a.income+sum('income'),essential:essentialFields.reduce((s,[k])=>s+a[k],0)+sum('essential'),choice:choiceFields.reduce((s,[k])=>s+a[k],0)+sum('choice')};
}
export function monthlyTotals(a:FinancialAccounts,entries:ExtraEntry[],mode:PeriodMode){const t=accountTotals(a,entries);const divisor=mode==='annual'?12:1;return {income:t.income/divisor,essential:t.essential/divisor,choice:t.choice/divisor};}
export function periodKey(mode:PeriodMode,month:string){return mode==='annual'?`annual:${month.slice(0,4)}`:mode==='recent'?'recent':`month:${month}`;}
export function periodLabel(mode:PeriodMode,month:string){if(mode==='recent')return 'Últimos 30 dias';if(mode==='annual')return `Ano ${month.slice(0,4)}`;const [year=2026,m=10]=month.split('-').map(Number);return new Intl.DateTimeFormat('pt-PT',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(year,m-1,1)));}