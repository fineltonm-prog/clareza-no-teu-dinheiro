import { createFileRoute } from '@tanstack/react-router';
import { Legal } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/legal')({
 head: () => moduleHead('Aviso legal', 'Conhece os limites das simulações e os avisos financeiros.'),
 component: Legal,
});
