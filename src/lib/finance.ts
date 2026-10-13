export const money = (value: number) => new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', maximumFractionDigits:0}).format(value);
export const diagnose = (income: number, essentials: number, choices: number) => ({ expenses: essentials + choices, balance: income - essentials - choices, savingsRate: income > 0 ? (income - essentials - choices) / income * 100 : 0 });
export const reserve = (essential: number, months: number, saved: number) => ({target:essential*months, percent: essential*months > 0 ? Math.min(100, Math.max(0,saved/(essential*months)*100)) : 0});
export const fictitiousIRS = (taxable: number, deductions: number, withheld: number) => {
 const gross = Math.min(taxable,10000)*.1 + Math.min(Math.max(0,taxable-10000),10000)*.2 + Math.max(0,taxable-20000)*.3;
 const tax = Math.max(0,gross-deductions); return {gross,tax,settlement:withheld-tax};
};
export const fictitiousPPR = (contribution: number, cost: number, years: number) => ({ illustrativeBenefit:contribution*.15, remaining:contribution*(1-cost/100)**years, fees:contribution*(1-(1-cost/100)**years) });
export const rule503020 = (net: number) => { const n = Math.max(0, net); return {needs:n*.5, wants:n*.3, savings:n*.2}; };
export type IndependenceInputs = {currentSavings:number; monthlySavings:number; monthlyExpenses:number; annualReturn:number; withdrawalRate:number};
const monthlyRate = (annualReturn: number) => (1 + annualReturn/100) ** (1/12) - 1;
export function balanceAfter(currentSavings: number, monthlySavings: number, annualReturn: number, months: number) {
 const r = monthlyRate(annualReturn), p = Math.max(0,currentSavings), pmt = Math.max(0,monthlySavings);
 return r === 0 ? p + pmt*months : p*(1+r)**months + pmt*((1+r)**months - 1)/r;
}
export function financialIndependence({currentSavings,monthlySavings,monthlyExpenses,annualReturn,withdrawalRate}: IndependenceInputs) {
 const target = Math.max(0,monthlyExpenses)*12/(withdrawalRate/100), p = Math.max(0,currentSavings), pmt = Math.max(0,monthlySavings), r = monthlyRate(annualReturn);
 let months: number | null;
 if (p >= target) months = 0;
 else if (r === 0) months = pmt > 0 ? Math.ceil((target-p)/pmt) : null;
 else months = p*r + pmt > 0 ? Math.ceil(Math.log((target*r + pmt)/(p*r + pmt))/Math.log(1+r)) : null;
 return {target, months, currentPassiveIncome: p*withdrawalRate/100/12, progress: target > 0 ? Math.min(100, p/target*100) : 100};
}
export function formatDuration(months: number | null) {
 if (months === null) return 'Sem prazo';
 if (months === 0) return 'Já atingido';
 if (months > 1200) return 'Mais de 100 anos';
 const y = Math.floor(months/12), m = months % 12, parts = [y && `${y} ${y===1?'ano':'anos'}`, m && `${m} ${m===1?'mês':'meses'}`].filter(Boolean);
 return parts.join(' e ');
}
export const navItems = [
 {path:'/',title:'Diagnóstico',icon:'diagnosis'}, {path:'/historico',title:'Histórico mensal',icon:'history'}, {path:'/orcamento',title:'Orçamento mensal',icon:'budget'}, {path:'/fundo',title:'Fundo de emergência',icon:'shield'}, {path:'/irs',title:'Simulação IRS',icon:'tax'}, {path:'/ppr',title:'Comparador PPR',icon:'ppr'}, {path:'/investimento',title:'Investimento',icon:'invest'}, {path:'/independencia',title:'Independência financeira',icon:'freedom'}, {path:'/dividas',title:'Dívidas e crédito',icon:'debt'}, {path:'/plano',title:'Plano 365',icon:'plan'}
] as const;
export type ModulePath = typeof navItems[number]['path'] | '/recursos' | '/legal';
export function moduleHead(title: string, description: string) { return {meta:[{title:`${title} — Dinheiro com Plano`},{name:'description',content:description},{property:'og:title',content:`${title} — Dinheiro com Plano`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }
