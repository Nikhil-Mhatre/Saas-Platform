import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from './TRPC-Server';
import { deleteFileFromCloudinary } from '../cloudinary';

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
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      const isFileDeleteFromStorage = await deleteFileFromCloudinary(file.key);

      if (!isFileDeleteFromStorage)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to delete from storage',
        });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
  uploadFileToDB: privateProcedure
    .input(z.object({ key: z.string(), name: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const uploadedFile = await db.file.create({
        data: {
          key: input.key,
          name: input.name,
          url: input.url,
          userId,
          uploadStatus: 'PROCESSING',
        },
      });

      if (!uploadedFile)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Unable to upload file to DB',
        });
      return uploadedFile;
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: 'PENDING' as const };

      return { status: file.uploadStatus };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
