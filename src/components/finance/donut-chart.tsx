import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip} from 'recharts';
import {money} from '@/lib/finance';
export default function DonutChart({data}:{data:{name:string;value:number}[]}){
 return <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={65} outerRadius={86} paddingAngle={3} stroke="none" isAnimationActive={false}>{data.map((x,i)=><Cell key={x.name} fill={['var(--primary)','var(--chart-2)','var(--chart-3)'][i]}/>)}</Pie><Tooltip formatter={v=>money(Number(v))}/></PieChart></ResponsiveContainer>;
}
