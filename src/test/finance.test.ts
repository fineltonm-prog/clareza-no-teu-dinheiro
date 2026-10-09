import {describe,it,expect} from 'vitest';
import {diagnose,reserve,fictitiousIRS,fictitiousPPR} from '@/lib/finance';
describe('Educational financial calculations',()=>{
 it('calculates Marta actual deficit from the source',()=>expect(diagnose(1200,820,445).balance).toBe(-65));
 it('calculates the three source emergency targets',()=>expect([1,3,6].map(m=>reserve(820,m,450).target)).toEqual([820,2460,4920]));
 it('caps emergency progress at 100 percent',()=>expect(reserve(820,1,1000).percent).toBe(100));
 it('uses clearly fictitious progressive brackets from the ebook',()=>expect(fictitiousIRS(25000,600,4500)).toEqual({gross:4500,tax:3900,settlement:600}));
 it('does not let deductions create negative tax',()=>expect(fictitiousIRS(0,1000,0).tax).toBe(0));
 it('models ten years of costs on a decreasing balance',()=>expect(fictitiousPPR(1000,1.5,10).fees).toBeCloseTo(140.27,2));
});
