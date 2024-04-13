"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/TRPC-Client";
import { Suspense } from "react";

const Search = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { error, isSuccess } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  if (isSuccess) {
    router.push(origin ? `/${origin}` : "/dashboard");
  }

  if (error) {
    if (error.data?.code === "UNAUTHORIZED") router.push("/sign-in");
  }
  return null;
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
            <h3 className="font-semibold text-xl">
              Setting up your account...
            </h3>
            <p>You will be redirected automatically.</p>
          </div>
        </div>
      }
    >
      <Search />
    </Suspense>
  );
};

export default Page;
