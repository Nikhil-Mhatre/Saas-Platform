import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './TRPC-Server';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

export const appRouter = router({
  // Authenticating User
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user.email)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });

    // check if user is in DB
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    // user is not present then create new
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;