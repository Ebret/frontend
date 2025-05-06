import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import AuditLogInitializer from "./AuditLogInitializer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Credit Cooperative System",
  description: "A modular, white-label Credit Cooperative System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthProvider>
          <WhiteLabelProvider>
            <NotificationProvider>
              <WebSocketProvider>
                <DashboardProvider>
                  <CookieConsentProvider>
                    <AuditLogInitializer />
                    {children}
                  </CookieConsentProvider>
                </DashboardProvider>
              </WebSocketProvider>
            </NotificationProvider>
          </WhiteLabelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
