'use Server';

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import Dashboard from '../../components/Dashboard';

const Page = async () => {
  // authenticate user using Kinde Authentication Service
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  /**
   * if user is not authenticated/trying to signin for first time
   * then redirect to auth-callback page where user will be
   * authenticated and user's details will be store in
   * database
   */
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  // Verifying whether user is present in db or not
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  /**
   * if user is authenticated but is not in sync
   * with db then explicitly triggering auth-callback redirection
   */
  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  return <Dashboard />;
};
export default Page;
