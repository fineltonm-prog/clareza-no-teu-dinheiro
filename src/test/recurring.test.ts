import {describe,it,expect} from 'vitest';
import {recurringEntries,type RecurringMovement} from '@/lib/recurring';
import {accountTotals,emptyAccounts} from '@/lib/diagnosis';
const item:RecurringMovement={id:'salary',name:'Salário',amount:1200,kind:'income',frequency:'monthly',start:'2026-01-31',end:'',enabled:true};
describe('configured recurring movements',()=>{
 it('includes one monthly salary and clamps day to February end',()=>{expect(recurringEntries([item],'month','2026-02','2026-10-10')[0]?.amount).toBe(1200);});
 it('includes twelve actual monthly occurrences annually',()=>{expect(recurringEntries([item],'annual','2026-10','2026-10-10')[0]?.amount).toBe(14400);});
 it('respects start and end, including the final date',()=>{const r={...item,start:'2026-03-31',end:'2026-05-31'};expect(recurringEntries([r],'annual','2026-10','2026-10-10')[0]?.amount).toBe(3600);expect(recurringEntries([r],'month','2026-06','2026-10-10')).toEqual([]);});
 it('counts weekly occurrences in a real monthly interval',()=>{const r={...item,amount:25,frequency:'weekly' as const,start:'2026-10-01'};expect(recurringEntries([r],'month','2026-10','2026-10-10')[0]?.amount).toBe(125);});
 it('counts recent 30 days without including a future occurrence',()=>{expect(recurringEntries([item],'recent','2026-10','2026-10-10')[0]?.amount).toBe(1200);});
 it('includes yearly expense only in its anniversary month',()=>{const r={...item,frequency:'yearly' as const,kind:'essential' as const,amount:100};expect(recurringEntries([r],'month','2026-02','2026-10-10')).toEqual([]);expect(recurringEntries([r],'annual','2027-01','2026-10-10')[0]?.amount).toBe(100);});
 it('disabled movement contributes nothing',()=>expect(recurringEntries([{...item,enabled:false}],'month','2026-10','2026-10-10')).toEqual([]));
 it('derived occurrences do not accumulate on repeated evaluation',()=>{const entries=recurringEntries([item],'month','2026-10','2026-10-10');expect(accountTotals(emptyAccounts,entries).income).toBe(1200);expect(accountTotals(emptyAccounts,recurringEntries([item],'month','2026-10','2026-10-10')).income).toBe(1200);});
});
