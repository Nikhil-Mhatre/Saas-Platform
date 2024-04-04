import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
const { middleware } = t;

/**
 * Middleware that will verify if user is
 * authenticated or not
 */
const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router } = t;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
