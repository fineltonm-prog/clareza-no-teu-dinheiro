import {ArrowRight,Info,PiggyBank,Sunrise,Target,Wallet} from 'lucide-react';
import {Link} from '@tanstack/react-router';
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine} from 'recharts';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Progress} from '@/components/ui/progress';
import {Budget,Heading,Metric,Panel,Range,Steps} from './modules';
import {useFinancial} from './state';
import {monthlyTotals} from '@/lib/diagnosis';
import {money,rule503020,financialIndependence,balanceAfter,formatDuration} from '@/lib/finance';

const percent=(n:number)=>`${n.toFixed(1).replace('.',',')} %`;

function MoneyField({id,label,value,onChange,hint}:{id:string;label:string;value:number;onChange:(v:number)=>void;hint?:string|undefined}){
 return <div className="mb-5"><label className="block text-xs mb-2" htmlFor={id}>{label}</label><div className="money-input"><Input id={id} type="number" inputMode="decimal" min={0} step={10} value={value} onChange={e=>onChange(Math.max(0,Number(e.target.value)||0))}/><span>€</span></div>{hint&&<p className="text-[11px] text-muted-foreground mt-2">{hint}</p>}</div>;
}

export function RuleSimulator(){
 const {accounts,entries,mode,netSalary,setNetSalary}=useFinancial();
 const actual=monthlyTotals(accounts,entries,mode);
 const salary=netSalary??Math.max(0,actual.income);
 const r=rule503020(salary);
 const actualFuture=actual.income-actual.essential-actual.choice;
 const rows=[
  {name:'Necessidades',share:'50 %',ref:r.needs,current:actual.essential,text:'Renda, contas, transportes, supermercado.'},
  {name:'Desejos',share:'30 %',ref:r.wants,current:actual.choice,text:'Restaurantes, lazer, subscrições, compras.'},
  {name:'Poupança e investimento',share:'20 %',ref:r.savings,current:actualFuture,text:'Fundo de emergência, dívidas, objetivos.'},
 ];
 const showCurrent=actual.income>0;
 return <section aria-labelledby="rule-title" className="mt-8">
  <div className="dashboard-grid">
   <Panel title="Simulador da regra 50/30/20" subtitle="Escreve o teu salário líquido mensal e vê a divisão de referência.">
    <MoneyField id="net-salary" label="Salário líquido mensal" value={salary} onChange={setNetSalary} hint={netSalary===null?'Preenchido com o rendimento do teu diagnóstico. Podes alterar.':undefined}/>
    <div className="grid gap-3 sm:grid-cols-3">
     {rows.map((row,i)=><div key={row.name} className="result-panel" style={{padding:20}}>
      <span className="text-xs flex items-center gap-2"><i className={`legend-dot ${i===1?'choices':i===2?'future':''}`}/>{row.name} · {row.share}</span>
      <strong style={{fontSize:26}}>{money(row.ref)}</strong>
      <p>{row.text}</p>
     </div>)}
    </div>
    <div className="insight"><Info size={17}/>Uma referência simples, não uma regra fixa. Com rendimentos mais baixos, as necessidades podem ocupar mais de metade, e está tudo bem.</div>
    {netSalary!==null&&<Button variant="outline" size="sm" onClick={()=>setNetSalary(null)}>Usar rendimento do diagnóstico</Button>}
   </Panel>
   <Panel title="Comparar com o teu mês" subtitle={showCurrent?'Referência 50/30/20 vs. valores do diagnóstico.':'Preenche o diagnóstico para comparar.'}>
    {showCurrent?<div className="table-scroll"><table className="data-table"><thead><tr><th>Bloco</th><th>Referência</th><th>Atual</th></tr></thead><tbody>{rows.map(row=>{const diff=row.current-row.ref;const over=row.name==='Poupança e investimento'?diff<0:diff>0;return <tr key={row.name}><td className="font-medium">{row.name}</td><td>{money(row.ref)}</td><td><span className={over?'text-destructive':'text-primary'}>{money(row.current)}</span></td></tr>;})}</tbody></table></div>
    :<Button asChild variant="outline"><Link to="/">Abrir diagnóstico <ArrowRight/></Link></Button>}
    {showCurrent&&salary!==actual.income&&<p className="reading-note mt-4">A referência usa {money(salary)}; o diagnóstico usa {money(actual.income)} de rendimento.</p>}
   </Panel>
  </div>
 </section>;
}

export function BudgetPage(){return <><Budget/><RuleSimulator/></>;}

export function Independence(){
 const {accounts,entries,mode,today,independence:d,setIndependence}=useFinancial();
 const actual=monthlyTotals(accounts,entries,mode);
 const monthlyExpenses=d.monthlyExpenses??Math.max(0,actual.essential+actual.choice);
 const inputs={...d,monthlyExpenses};
 const set=(patch:Partial<typeof d>)=>setIndependence({...d,...patch});
 const r=financialIndependence(inputs);
 const horizon=Math.min(50,Math.max(10,r.months===null?30:Math.ceil(r.months/12)+3));
 const data=Array.from({length:horizon+1},(_,year)=>({year,value:Math.round(balanceAfter(d.currentSavings,d.monthlySavings,d.annualReturn,year*12))}));
 const finishYear=r.months!==null&&r.months<=1200?Number(today.slice(0,4))+Math.ceil(r.months/12):null;
 return <>
  <Heading title="Quando o dinheiro trabalha por ti." description="Calcula em quanto tempo as tuas poupanças podem pagar as tuas despesas, só com o rendimento passivo."/>
  <div className="stats-grid">
   <Metric label="Capital necessário" value={money(r.target)} note={`${money(monthlyExpenses)}/mês × 12 ÷ ${percent(d.withdrawalRate)}`} icon={<Target size={17}/>}/>
   <Metric label="Tempo até à liberdade" value={formatDuration(r.months)} note={r.months===null?'Aumenta a poupança mensal':finishYear&&r.months>0?`Por volta de ${finishYear}`:'O teu capital já cobre as despesas'} icon={<Sunrise size={17}/>} tone/>
   <Metric label="Rendimento passivo hoje" value={`${money(r.currentPassiveIncome)}/mês`} note={`${percent(r.progress)} do caminho percorrido`} icon={<PiggyBank size={17}/>}/>
  </div>
  <div className="dashboard-grid">
   <Panel title="Os teus números" subtitle="Valores reais, já descontada a inflação.">
    <MoneyField id="fi-monthly" label="Quanto poupas por mês" value={d.monthlySavings} onChange={v=>set({monthlySavings:v})}/>
    <MoneyField id="fi-current" label="Poupança e investimentos atuais" value={d.currentSavings} onChange={v=>set({currentSavings:v})}/>
    <MoneyField id="fi-expenses" label="Despesas mensais na independência" value={monthlyExpenses} onChange={v=>set({monthlyExpenses:v})} hint={d.monthlyExpenses===null?'Preenchido com as despesas do teu diagnóstico.':undefined}/>
    <Range label="Rentabilidade anual real (hipótese)" value={d.annualReturn} set={v=>set({annualReturn:v})} max={8} step={.5} format={percent}/>
    <Range label="Taxa de levantamento anual" value={d.withdrawalRate} set={v=>set({withdrawalRate:v})} min={3} max={5} step={.25} format={percent}/>
    <div className="flex justify-between text-xs mt-2 mb-3"><span>{money(d.currentSavings)}</span><strong>{money(r.target)}</strong></div>
    <Progress value={r.progress} aria-label="Progresso até à independência financeira"/>
   </Panel>
   <Panel title="O teu capital ao longo do tempo" subtitle={`Projeção de ${horizon} anos com juros compostos mensais.`}>
    <div className="chart-container"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{left:8,right:8,top:8}}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/><XAxis dataKey="year" tick={{fontSize:10}} tickFormatter={y=>`${y}a`}/><YAxis tick={{fontSize:10}} width={52} tickFormatter={v=>`${Math.round(Number(v)/1000)}k`}/><Tooltip formatter={v=>money(Number(v))} labelFormatter={y=>`Ano ${y}`}/><ReferenceLine y={r.target} stroke="var(--chart-2)" strokeDasharray="4 4" label={{value:'Meta',fontSize:10,fill:'var(--muted-foreground)',position:'insideTopLeft'}}/><Area dataKey="value" name="Capital" stroke="var(--primary)" fill="var(--accent)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div>
    <div className="insight"><Info size={17}/>Simulação educativa. A rentabilidade não é garantida e varia de ano para ano; impostos e custos não estão incluídos.</div>
    <Steps items={[
     {title:'A regra dos 4 %',text:'Se levantares cerca de 4 % do capital por ano, historicamente o dinheiro tendeu a durar várias décadas. Precisas, por isso, de cerca de 25 vezes as despesas anuais.'},
     {title:'O que mais acelera',text:'Aumentar a poupança mensal e reduzir as despesas futuras tem mais impacto do que procurar rentabilidades elevadas, que trazem mais risco.'},
     {title:'Antes de investir',text:'Constrói o fundo de emergência e trata as dívidas caras primeiro.'},
    ]}/>
    <div className="flex flex-wrap gap-2 mt-5"><Button asChild variant="outline" size="sm"><Link to="/fundo"><Wallet/>Fundo de emergência</Link></Button><Button asChild variant="outline" size="sm"><Link to="/investimento">Investimento <ArrowRight/></Link></Button></div>
   </Panel>
  </div>
 </>;
}
