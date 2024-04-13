import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, vars-on-top, no-unused-vars
  var cachedPrisma: PrismaClient | undefined;
}

const cachedPrisma = global.cachedPrisma || new PrismaClient();

if (process.env.NODE_ENV === 'production') global.cachedPrisma = cachedPrisma;

export const db = cachedPrisma;
