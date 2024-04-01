import { AppRouter } from '@/lib/trpc/TRPC-Router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({});
