import { createFileRoute } from '@tanstack/react-router';
import { Resources } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/recursos')({
 head: () => moduleHead('Biblioteca', 'Consulta o ebook Dinheiro com Plano e fontes oficiais.'),
 component: Resources,
});
