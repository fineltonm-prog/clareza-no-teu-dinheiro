import {createContext,useContext,useState,useEffect,useRef,type ReactNode} from 'react';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import type {User} from '@supabase/supabase-js';
import {supabase} from '@/integrations/supabase/client';
import {emptyAccounts,periodKey,type ExtraEntry,type PeriodMode} from '@/lib/diagnosis';
import {recurringEntries,type RecurringMovement,type FinancialGoal} from '@/lib/recurring';
import {loadFinancial} from '@/lib/financial.functions';
import {initialReminder,type ReminderSettings} from '@/lib/reminders';
import type {IndependenceInputs} from '@/lib/finance';
export const example = {income:1200,rent:450,bills:110,transport:40,groceries:220,restaurants:100,subscriptions:20,shopping:80,leisure:50,other:50,irregular:145};
export type Accounts = typeof example;
type PeriodData={accounts:Accounts;entries:ExtraEntry[];isExample:boolean};
type ReminderMap=Record<'fund'|'plan',ReminderSettings>;
type History=Awaited<ReturnType<typeof loadFinancial>>['history'];
type FinancialContextValue={user:User|null;cloudLoading:boolean;cloudError:string;history:History;refreshCloud:()=>Promise<void>;recurring:RecurringMovement[];setRecurring:(v:RecurringMovement[])=>void;goals:FinancialGoal[];setGoals:(v:FinancialGoal[])=>void;today:string;reminders:ReminderMap;setReminders:(r:ReminderMap)=>void;accounts:Accounts;setAccounts:(a:Accounts)=>void;entries:ExtraEntry[];setEntries:(e:ExtraEntry[])=>void;mode:PeriodMode;setMode:(m:PeriodMode)=>void;month:string;setMonth:(m:string)=>void;isExample:boolean;reset:()=>void;saved:number;setSaved:(v:number)=>void;months:number;setMonths:(v:number)=>void;checked:string[];setChecked:(v:string[])=>void;netSalary:number|null;setNetSalary:(v:number|null)=>void;independence:IndependenceDraft;setIndependence:(v:IndependenceDraft)=>void};
export type IndependenceDraft=Omit<IndependenceInputs,'monthlyExpenses'>&{monthlyExpenses:number|null};
const initialIndependence:IndependenceDraft={currentSavings:5000,monthlySavings:300,monthlyExpenses:null,annualReturn:4,withdrawalRate:4};
const FinancialContext=createContext<FinancialContextValue|null>(null);
export function FinancialProvider({children}:{children:ReactNode}) {
 const [mode,setMode]=useState<PeriodMode>('month'),[month,setMonth]=useState('2026-10');
 const [periods,setPeriods]=useState<Record<string,PeriodData>>({'month:2026-10':{accounts:example,entries:[],isExample:true}});
 const [recurring,setRecurring]=useState<RecurringMovement[]>([]),[goals,setGoals]=useState<FinancialGoal[]>([]),[user,setUser]=useState<User|null>(null),[authReady,setAuthReady]=useState(false),[today,setToday]=useState('2026-10-10');
 const client=useQueryClient(),load=useServerFn(loadFinancial),identity=useRef<string|null>(null);
 useEffect(()=>{setToday(new Date().toLocaleDateString('en-CA'));let alive=true;const apply=(u:User|null)=>{if(!alive)return;const id=u?.id??null;if(identity.current!==id){identity.current=id;setPeriods({});setRecurring([]);setGoals([]);client.removeQueries({queryKey:['financial-private']});}setUser(u);setAuthReady(true);};void supabase.auth.getSession().then(({data})=>apply(data.session?.user??null));const {data}=supabase.auth.onAuthStateChange((event,session)=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))apply(session?.user??null);});return()=>{alive=false;data.subscription.unsubscribe();};},[client]);
 const query=useQuery({queryKey:['financial-private',user?.id],queryFn:()=>load(),enabled:authReady&&Boolean(user),retry:false,refetchOnWindowFocus:false});
 const loaded=useRef<unknown>(null);useEffect(()=>{if(query.data&&loaded.current!==query.data){loaded.current=query.data;setRecurring(query.data.settings.recurring);setGoals(query.data.settings.goals);}},[query.data]);
 const key=periodKey(mode,month),data=periods[key]??{accounts:emptyAccounts,entries:[],isExample:false};
 const setAccounts=(accounts:Accounts)=>setPeriods(p=>({...p,[key]:{...(p[key]??data),accounts,isExample:false}}));
 const setEntries=(entries:ExtraEntry[])=>setPeriods(p=>({...p,[key]:{...(p[key]??data),entries:entries.filter(e=>!e.id.startsWith('recurring:')),isExample:false}}));
 const reset=()=>setPeriods(p=>({...p,[key]:{accounts:emptyAccounts,entries:[],isExample:false}}));
 const [saved,setSaved]=useState(450),[months,setMonths]=useState(3),[checked,setChecked]=useState<string[]>([]);
 const [reminders,setReminders]=useState<ReminderMap>({fund:{...initialReminder},plan:{...initialReminder}});
 const [netSalary,setNetSalary]=useState<number|null>(null),[independence,setIndependence]=useState<IndependenceDraft>(initialIndependence);
 useEffect(()=>{setSaved(450);setMonths(3);setChecked([]);setNetSalary(null);setIndependence(initialIndependence);setReminders({fund:{...initialReminder},plan:{...initialReminder}});},[user?.id]);
 return <FinancialContext.Provider value={{user,cloudLoading:!authReady||(Boolean(user)&&query.isPending),cloudError:query.error?'Não foi possível carregar os dados da conta.':'',history:query.data?.history??[],refreshCloud:async()=>{await query.refetch();},recurring,setRecurring,goals,setGoals,today,reminders,setReminders,accounts:data.accounts,setAccounts,entries:[...data.entries,...recurringEntries(recurring,mode,month,today)],setEntries,mode,setMode,month,setMonth,isExample:data.isExample,reset,saved,setSaved,months,setMonths,checked,setChecked,netSalary,setNetSalary,independence,setIndependence}}>{children}</FinancialContext.Provider>;
}
export function useFinancial(){const context=useContext(FinancialContext);if(!context)throw new Error('FinancialProvider is required');return context;}
