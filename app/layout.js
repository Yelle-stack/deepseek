import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek - YelleStack",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <AppContextProvider> 
    <html
      lang="en"
      className={`${inter.className} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
    </AppContextProvider> 
    </ClerkProvider>
  );
}
