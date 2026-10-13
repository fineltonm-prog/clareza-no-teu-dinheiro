import { createFileRoute } from '@tanstack/react-router';
import { BudgetPage } from '@/components/finance/calculators';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/orcamento')({
 head: () => moduleHead('Orçamento mensal', 'Dá um destino ao ordenado com essenciais, escolhas e futuro, e simula a regra 50/30/20.'),
 component: BudgetPage,
});
