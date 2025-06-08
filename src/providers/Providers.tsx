import React from "react";
import StoreProvider from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import AuthGuard from "@/guards/AuthGuard";
import 'react-phone-number-input/style.css'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Providers;
