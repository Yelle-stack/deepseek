import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";


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
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <AppContextProvider>
            <Toaster toastOptions={
              {
                success: {style: {background: "black", color: "white"}},
                error: {style: {background: "black", color: "white"}}
              }
            }/>
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
