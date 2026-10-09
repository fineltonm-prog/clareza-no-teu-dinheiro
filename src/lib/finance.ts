export const money = (value: number) => new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', maximumFractionDigits:0}).format(value);
export const diagnose = (income: number, essentials: number, choices: number) => ({ expenses: essentials + choices, balance: income - essentials - choices, savingsRate: income > 0 ? (income - essentials - choices) / income * 100 : 0 });
export const reserve = (essential: number, months: number, saved: number) => ({target:essential*months, percent: essential*months > 0 ? Math.min(100, Math.max(0,saved/(essential*months)*100)) : 0});
export const fictitiousIRS = (taxable: number, deductions: number, withheld: number) => {
 const gross = Math.min(taxable,10000)*.1 + Math.min(Math.max(0,taxable-10000),10000)*.2 + Math.max(0,taxable-20000)*.3;
 const tax = Math.max(0,gross-deductions); return {gross,tax,settlement:withheld-tax};
};
export const fictitiousPPR = (contribution: number, cost: number, years: number) => ({ illustrativeBenefit:contribution*.15, remaining:contribution*(1-cost/100)**years, fees:contribution*(1-(1-cost/100)**years) });
export const navItems = [
 {path:'/',title:'Diagnóstico',icon:'diagnosis'}, {path:'/orcamento',title:'Orçamento mensal',icon:'budget'}, {path:'/fundo',title:'Fundo de emergência',icon:'shield'}, {path:'/irs',title:'Simulação IRS',icon:'tax'}, {path:'/ppr',title:'Comparador PPR',icon:'ppr'}, {path:'/investimento',title:'Investimento',icon:'invest'}, {path:'/dividas',title:'Dívidas e crédito',icon:'debt'}, {path:'/plano',title:'Plano 365',icon:'plan'}
] as const;
export type ModulePath = typeof navItems[number]['path'] | '/recursos' | '/legal';
export function moduleHead(title: string, description: string) { return {meta:[{title:`${title} — Dinheiro com Plano`},{name:'description',content:description},{property:'og:title',content:`${title} — Dinheiro com Plano`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }
