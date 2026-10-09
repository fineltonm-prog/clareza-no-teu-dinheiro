import {money,diagnose} from './finance';
import {accountTotals,essentialFields,choiceFields,type ExtraEntry,type FinancialAccounts} from './diagnosis';
export async function downloadDiagnosis(accounts:FinancialAccounts,entries:ExtraEntry[],period:string){
 const {jsPDF}=await import('jspdf');const pdf=new jsPDF();
 const css=getComputedStyle(document.documentElement);
 const ink=css.getPropertyValue('--report-ink').trim(),primary=css.getPropertyValue('--report-primary').trim(),border=css.getPropertyValue('--report-border').trim();
 const fmt=(n:number)=>money(n).replace(/[\u00a0\u202f]/g,' ');
 let y=26;
 const line=(text:string,value?:string)=>{if(y>263){pdf.addPage();y=24;}pdf.setTextColor(ink);pdf.setFontSize(10);const wrapped=pdf.splitTextToSize(text,135) as string[];pdf.text(wrapped,20,y);if(value)pdf.text(value,190,y,{align:'right'});y+=Math.max(9,wrapped.length*5+4);};
 pdf.setProperties({title:`Diagnóstico financeiro — ${period}`,author:'Dinheiro com Plano'});
 pdf.setTextColor(primary);pdf.setFont('helvetica','bold');pdf.setFontSize(23);pdf.text('Dinheiro com Plano',20,y);y+=13;
 pdf.setFont('helvetica','normal');line('Diagnóstico financeiro');line(`Período: ${period}`);y+=5;
 const t=accountTotals(accounts,entries),d=diagnose(t.income,t.essential,t.choice);
 line('Rendimentos',fmt(t.income));line('Despesas',fmt(d.expenses));line('Saldo',fmt(d.balance));line('Saldo / rendimento',`${d.savingsRate.toFixed(1).replace('.',',')} %`);y+=5;
 pdf.setDrawColor(border);pdf.line(20,y,190,y);y+=12;
 line('RENDIMENTOS');line('Rendimento líquido',fmt(accounts.income));entries.filter(e=>e.kind==='income').forEach(e=>line(e.name,fmt(e.amount)));
 line('DESPESAS ESSENCIAIS');essentialFields.forEach(([k,name])=>line(name,fmt(accounts[k])));entries.filter(e=>e.kind==='essential').forEach(e=>line(e.name,fmt(e.amount)));
 line('ESCOLHAS');choiceFields.forEach(([k,name])=>line(name,fmt(accounts[k])));entries.filter(e=>e.kind==='choice').forEach(e=>line(e.name,fmt(e.amount)));
 y+=5;line(d.balance<0?'Prioridade: ajustar o orçamento e reduzir o défice.':'Próximo passo: dar um destino ao saldo e reforçar a reserva.');
 line('Conteúdo educativo. Não constitui aconselhamento financeiro ou fiscal.');line('Dados declarados pelo utilizador; não verificados. O PDF contém dados financeiros: guarda-o num local seguro.');
 for(let i=1;i<=pdf.getNumberOfPages();i++){pdf.setPage(i);pdf.setFontSize(8);pdf.text(`Dinheiro com Plano | ${i} / ${pdf.getNumberOfPages()}`,20,285);}
 pdf.save('diagnostico-financeiro.pdf');
}