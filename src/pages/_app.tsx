import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />    
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
