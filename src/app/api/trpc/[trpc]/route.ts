import { appRouter } from '@/lib/trpc/TRPC-Router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// This will act as intermediatary for our API calls
// this make our api to go via following trpc route

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
