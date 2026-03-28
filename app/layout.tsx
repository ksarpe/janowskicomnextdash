import "./globals.css";
import { inter } from "./fonts";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} tracking-tight`}>
        {" "}
        <main> {children}</main>
        <Toaster />
      </body>
    </html>
  );
}
