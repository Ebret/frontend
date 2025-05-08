import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Lato, Roboto, Poppins } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AuditLogInitializer from "./AuditLogInitializer";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${lato.variable} ${roboto.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
