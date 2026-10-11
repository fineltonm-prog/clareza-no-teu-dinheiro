import {describe,it,expect} from 'vitest';
import {adviceSchema,settingsSchema,snapshotSchema} from '@/lib/financial.schemas';
import {emptyAccounts,accountTotals} from '@/lib/diagnosis';
describe('private financial request validation',()=>{
 it('requires affirmative AI consent',()=>{expect(adviceSchema.safeParse({period:'outubro 2026',accounts:emptyAccounts,entries:[],goals:[]}).success).toBe(false);expect(adviceSchema.safeParse({consent:true,period:'outubro 2026',accounts:emptyAccounts,entries:[],goals:[]}).success).toBe(true);});
 it('rejects impossible recurring dates and reversed ranges',()=>{const r={id:'r',name:'Renda',amount:600,kind:'essential',frequency:'monthly',start:'2026-02-30',end:'',enabled:true};expect(settingsSchema.safeParse({recurring:[r],goals:[]}).success).toBe(false);expect(settingsSchema.safeParse({recurring:[{...r,start:'2026-03-01',end:'2026-02-01'}],goals:[]}).success).toBe(false);});
 it('keeps monthly snapshot income and expenses concrete',()=>{const s=snapshotSchema.parse({month:'2026-10',accounts:{...emptyAccounts,rent:600,groceries:250},entries:[{id:'recurring:s',name:'Salário',amount:1500,kind:'income'}]});const t=accountTotals(s.accounts,s.entries);expect(t.income).toBe(1500);expect(t.essential+t.choice).toBe(850);expect(t.income-t.essential-t.choice).toBe(650);});
});
