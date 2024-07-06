import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNav from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcaster",
  description: "Discover & Generate podcasts from AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <LeftSidebar />
          <section>
            <div>
              <div>
                {/* <Image/> */}
                <MobileNav />
              </div>
              <div>
                Toaster
                {children}
              </div>
            </div>
          </section>
          <RightSidebar />
        </main>
      </body>
    </html>
  );
}
