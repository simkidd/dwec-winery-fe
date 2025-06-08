import React from "react";
import StoreProvider from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
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
          {children}
        </QueryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Providers;
