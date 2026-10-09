import { createFileRoute } from '@tanstack/react-router';
import { IRS } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/irs')({
 head: () => moduleHead('Simulação IRS', 'Explora a progressividade com um exemplo fiscal fictício.'),
 component: IRS,
});
