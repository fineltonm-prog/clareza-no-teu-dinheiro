import { createFileRoute } from '@tanstack/react-router';
import { Budget } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/orcamento')({
 head: () => moduleHead('Orçamento mensal', 'Dá um destino ao ordenado com essenciais, escolhas e futuro.'),
 component: Budget,
});
