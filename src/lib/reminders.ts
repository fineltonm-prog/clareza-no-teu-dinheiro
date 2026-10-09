export type ReminderSettings={enabled:boolean;date:string;time:string;frequency:'once'|'weekly'|'monthly';advance:string;task:string};
export const initialReminder:ReminderSettings={enabled:false,date:'',time:'09:00',frequency:'monthly',advance:'15',task:'review'};
const escape=(v:string)=>v.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
export function calendarReminder(settings:ReminderSettings,title:string,now:Date,uid:string){
 const start=new Date(`${settings.date}T${settings.time}:00`);
 if(!settings.enabled||!Number.isFinite(start.getTime())||start<=now)throw new Error('Escolhe uma data e hora futuras e ativa o lembrete.');
 const freq=settings.frequency==='weekly'?'RRULE:FREQ=WEEKLY':settings.frequency==='monthly'?`RRULE:FREQ=MONTHLY;BYMONTHDAY=${start.getDate()}`:null;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Dinheiro com Plano//Lembretes//PT','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${escape(uid)}@dinheiro-com-plano`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(new Date(start.getTime()+15*60000))}`,`SUMMARY:${escape(title)}`,'DESCRIPTION:Rever o progresso no Dinheiro com Plano. Não inclui valores financeiros.',...(freq?[freq]:[]),'BEGIN:VALARM',`TRIGGER:-PT${Number(settings.advance)}M`,'ACTION:DISPLAY',`DESCRIPTION:${escape(title)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'];
 // Fold at 75 UTF-8 octets, as required by calendar readers.
 return lines.map(line=>{let result='',part='';for(const c of line){if(new TextEncoder().encode(part+c).length>75){result+=part+'\r\n';part=' ';}part+=c;}return result+part;}).join('\r\n')+'\r\n';
}