import { createFileRoute } from '@tanstack/react-router';
import { Emergency } from '@/components/finance/modules';
import { moduleHead } from '@/lib/finance';
export const Route = createFileRoute('/fundo')({
 head: () => moduleHead('Fundo de emergência', 'Calcula a tua reserva e acompanha o progresso.'),
 component: Emergency,
});
