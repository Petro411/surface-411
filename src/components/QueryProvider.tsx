import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      placeholderData: (prev: any) => prev,
      retry: 2,
      refetchOnWindowFocus: false,
      retryDelay: (attempt) => attempt * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
