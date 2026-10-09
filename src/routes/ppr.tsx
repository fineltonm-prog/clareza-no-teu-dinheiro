import { createFileRoute } from '@tanstack/react-router';
import { PPR } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/ppr')({
 head: () => moduleHead('Comparador PPR', 'Analisa custos e critérios para comparar PPR.'),
 component: PPR,
});
