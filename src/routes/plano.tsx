import { createFileRoute } from '@tanstack/react-router';
import { Plan } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/plano')({
 head: () => moduleHead('Plano 365', 'Acompanha tarefas financeiras a 30, 90 e 365 dias.'),
 component: Plan,
});
