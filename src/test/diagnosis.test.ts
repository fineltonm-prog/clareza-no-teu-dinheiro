import {describe,it,expect} from 'vitest';
import {accountTotals,monthlyTotals,periodKey,emptyAccounts} from '@/lib/diagnosis';
import {example} from '@/components/finance/state';
import {diagnose} from '@/lib/finance';
describe('Diagnosis periods and additional entries',()=>{
 it('includes added income in the diagnosis',()=>{const t=accountTotals(example,[{id:'1',name:'Extra',amount:100,kind:'income'}]);expect(diagnose(t.income,t.essential,t.choice).balance).toBe(35);});
 it('includes added essentials in the reserve base',()=>expect(accountTotals(example,[{id:'1',name:'Saúde',amount:50,kind:'essential'}]).essential).toBe(870));
 it('includes personal expenses without changing essentials',()=>expect(accountTotals(example,[{id:'1',name:'Cinema',amount:20,kind:'choice'}])).toEqual({income:1200,essential:820,choice:465}));
 it('separates monthly and annual inputs',()=>{expect(periodKey('month','2026-10')).toBe('month:2026-10');expect(periodKey('month','2026-11')).toBe('month:2026-11');expect(periodKey('annual','2026-10')).toBe('annual:2026');expect(periodKey('recent','2026-10')).toBe('recent');});
 it('does not invent amounts for a new period',()=>expect(accountTotals(emptyAccounts)).toEqual({income:0,essential:0,choice:0}));
 it('normalizes annual totals to a monthly planning base',()=>expect(monthlyTotals({...emptyAccounts,income:14400,rent:5400},[],'annual')).toEqual({income:1200,essential:450,choice:0}));
});