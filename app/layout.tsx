import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Persian Movie", description: "Discover Persian and Iranian cinema." };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}