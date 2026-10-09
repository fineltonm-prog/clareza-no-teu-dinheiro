import { createFileRoute } from '@tanstack/react-router';
import { Investment } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/investimento')({
 head: () => moduleHead('Investimento', 'Compara risco, custos, liquidez e diversificação.'),
 component: Investment,
});
