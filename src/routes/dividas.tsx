import { createFileRoute } from '@tanstack/react-router';
import { Debt } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/dividas')({
 head: () => moduleHead('Dívidas e crédito', 'Compara métodos para organizar a amortização das dívidas.'),
 component: Debt,
});
