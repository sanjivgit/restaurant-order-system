"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, useState } from "react";

interface QueryProviderShape {
  children: React.ReactNode;
}

const QueryProvider: FC<QueryProviderShape> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
