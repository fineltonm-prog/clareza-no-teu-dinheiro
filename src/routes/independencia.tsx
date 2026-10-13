import { createFileRoute } from '@tanstack/react-router';
import { Independence } from '@/components/finance/calculators';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/independencia')({
 head: () => moduleHead('Independência financeira', 'Calcula em quanto tempo as tuas poupanças podem gerar rendimento passivo suficiente para as tuas despesas.'),
 component: Independence,
});
