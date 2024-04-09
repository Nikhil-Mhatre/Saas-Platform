import { AppRouter } from '@/lib/trpc/TRPC-Router';
import { inferRouterOutputs } from '@trpc/server';
import React from 'react';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Message = RouterOutput['getFileMessages']['messages'];

type OmitText = Omit<Message[number], 'text'>;

type ExtendedText = {
  text: string | React.JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
