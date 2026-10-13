import {describe,it,expect} from 'vitest';
import {diagnose,reserve,fictitiousIRS,fictitiousPPR,rule503020,financialIndependence,balanceAfter,formatDuration} from '@/lib/finance';
import {example} from '@/components/finance/state';
describe('Educational financial calculations',()=>{
 it('starts the interactive Marta example at the source deficit',()=>{
  const essential=example.rent+example.bills+example.transport+example.groceries;
  const choices=example.restaurants+example.subscriptions+example.shopping+example.leisure+example.other+example.irregular;
  expect(essential).toBe(820);
  expect(diagnose(example.income,essential,choices).balance).toBe(-65);
 });
 it('calculates Marta actual deficit from the source',()=>expect(diagnose(1200,820,445).balance).toBe(-65));
 it('expresses the source deficit as a negative savings rate',()=>expect(diagnose(1200,820,445).savingsRate).toBeCloseTo(-5.4167,4));
 it('calculates the three source emergency targets',()=>expect([1,3,6].map(m=>reserve(820,m,450).target)).toEqual([820,2460,4920]));
 it('caps emergency progress at 100 percent',()=>expect(reserve(820,1,1000).percent).toBe(100));
 it('uses clearly fictitious progressive brackets from the ebook',()=>expect(fictitiousIRS(25000,600,4500)).toEqual({gross:4500,tax:3900,settlement:600}));
 it('does not let deductions create negative tax',()=>expect(fictitiousIRS(0,1000,0).tax).toBe(0));
 it('models ten years of costs on a decreasing balance',()=>expect(fictitiousPPR(1000,1.5,10).fees).toBeCloseTo(140.27,2));
 it('splits a net salary with the 50/30/20 reference',()=>expect(rule503020(1200)).toEqual({needs:600,wants:360,savings:240}));
 it('never allocates a negative salary',()=>expect(rule503020(-100)).toEqual({needs:0,wants:0,savings:0}));
 it('targets 25 times annual expenses with a 4 percent withdrawal',()=>expect(financialIndependence({currentSavings:0,monthlySavings:1000,monthlyExpenses:1000,annualReturn:0,withdrawalRate:4}).target).toBeCloseTo(300000,6));
 it('needs 300 months of 1000 euros without returns',()=>expect(financialIndependence({currentSavings:0,monthlySavings:1000,monthlyExpenses:1000,annualReturn:0,withdrawalRate:4}).months).toBe(300));
 it('finds the first month where compounded savings reach the target',()=>{
  const i={currentSavings:5000,monthlySavings:300,monthlyExpenses:1265,annualReturn:4,withdrawalRate:4};const {months,target}=financialIndependence(i);
  expect(months).not.toBeNull();expect(balanceAfter(5000,300,4,months!)).toBeGreaterThanOrEqual(target-1e-6);expect(balanceAfter(5000,300,4,months!-1)).toBeLessThan(target);
 });
 it('reports no deadline without savings and returns',()=>expect(financialIndependence({currentSavings:0,monthlySavings:0,monthlyExpenses:800,annualReturn:4,withdrawalRate:4}).months).toBeNull());
 it('reports independence already reached when capital covers the target',()=>expect(financialIndependence({currentSavings:300000,monthlySavings:0,monthlyExpenses:1000,annualReturn:0,withdrawalRate:4}).months).toBe(0));
 it('formats durations in Portuguese',()=>expect([formatDuration(13),formatDuration(24),formatDuration(null)]).toEqual(['1 ano e 1 mês','2 anos','Sem prazo']));
});
