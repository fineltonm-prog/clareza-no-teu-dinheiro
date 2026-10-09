import {createContext,useContext,useState,type ReactNode} from 'react';
import {emptyAccounts,periodKey,type ExtraEntry,type PeriodMode} from '@/lib/diagnosis';
import {initialReminder,type ReminderSettings} from '@/lib/reminders';
export const example = {income:1200,rent:450,bills:110,transport:40,groceries:220,restaurants:100,subscriptions:20,shopping:80,leisure:50,other:50,irregular:145};
export type Accounts = typeof example;
type PeriodData={accounts:Accounts;entries:ExtraEntry[];isExample:boolean};
type ReminderMap=Record<'fund'|'plan',ReminderSettings>;
const FinancialContext = createContext<{reminders:ReminderMap;setReminders:(r:ReminderMap)=>void;accounts:Accounts;setAccounts:(a:Accounts)=>void;entries:ExtraEntry[];setEntries:(e:ExtraEntry[])=>void;mode:PeriodMode;setMode:(m:PeriodMode)=>void;month:string;setMonth:(m:string)=>void;isExample:boolean;reset:()=>void;saved:number;setSaved:(v:number)=>void;months:number;setMonths:(v:number)=>void;checked:string[];setChecked:(v:string[])=>void}|null>(null);
export function FinancialProvider({children}:{children:ReactNode}) {
 const [mode,setMode]=useState<PeriodMode>('month'),[month,setMonth]=useState('2026-10');
 const [periods,setPeriods]=useState<Record<string,PeriodData>>({'month:2026-10':{accounts:example,entries:[],isExample:true}});
 const key=periodKey(mode,month);const data=periods[key]??{accounts:emptyAccounts,entries:[],isExample:false};
 const setAccounts=(accounts:Accounts)=>setPeriods(p=>({...p,[key]:{...(p[key]??data),accounts,isExample:false}}));
 const setEntries=(entries:ExtraEntry[])=>setPeriods(p=>({...p,[key]:{...(p[key]??data),entries,isExample:false}}));
 const reset=()=>setPeriods(p=>({...p,[key]:{accounts:emptyAccounts,entries:[],isExample:false}}));
 const [saved,setSaved]=useState(450);const [months,setMonths]=useState(3);const [checked,setChecked]=useState<string[]>([]);
 const [reminders,setReminders]=useState<ReminderMap>({fund:{...initialReminder},plan:{...initialReminder}});
 return <FinancialContext.Provider value={{reminders,setReminders,accounts:data.accounts,setAccounts,entries:data.entries,setEntries,mode,setMode,month,setMonth,isExample:data.isExample,reset,saved,setSaved,months,setMonths,checked,setChecked}}>{children}</FinancialContext.Provider>;
}
export function useFinancial(){const context=useContext(FinancialContext);if(!context)throw new Error('FinancialProvider is required');return context;}
