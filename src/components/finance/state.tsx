import {createContext,useContext,useState,type ReactNode} from 'react';
export const example = {income:1200,rent:450,bills:110,transport:40,groceries:220,restaurants:100,subscriptions:20,shopping:80,leisure:50,other:50,irregular:145};
export type Accounts = typeof example;
const FinancialContext = createContext<{accounts:Accounts;setAccounts:(a:Accounts)=>void;saved:number;setSaved:(v:number)=>void;months:number;setMonths:(v:number)=>void;checked:string[];setChecked:(v:string[])=>void}|null>(null);
export function FinancialProvider({children}:{children:ReactNode}) {
 const [accounts,setAccounts]=useState(example);const [saved,setSaved]=useState(450);const [months,setMonths]=useState(3);const [checked,setChecked]=useState<string[]>([]);
 return <FinancialContext.Provider value={{accounts,setAccounts,saved,setSaved,months,setMonths,checked,setChecked}}>{children}</FinancialContext.Provider>;
}
export function useFinancial(){const context=useContext(FinancialContext);if(!context)throw new Error('FinancialProvider is required');return context;}
