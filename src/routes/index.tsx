import { createFileRoute } from '@tanstack/react-router';
import { Diagnosis } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/')({
 head: () => moduleHead('Diagnóstico', 'Organiza rendimentos e despesas e calcula o teu saldo mensal.'),
 component: Diagnosis,
});
<img 
  src="..." 
  alt="..." 
  loading="lazy" 
  decoding="async"
  width="100%" 
/>
