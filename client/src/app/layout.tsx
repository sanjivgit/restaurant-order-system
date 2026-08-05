import type { Metadata, Viewport } from "next";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import QueryProvider from "@/react-query-config/query-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TableServe — Restaurant Management",
  description: "Order, track, and manage — from table to kitchen to bill.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b8420f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="ticket">
      <body className="antialiased bg-base-100 text-base-content">
        <ReduxProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#221D1A",
                  color: "#FBF6EE",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                },
              }}
            />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
