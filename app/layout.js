import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import Logout from "@/components/Logout";
import Head from "./head";

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "Moods",
  description: "Track your daily mood, everyday of the year!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href={"/"}>
        <h1 className={"text-base sm:text-lg textGradient " + fugaz.className}>
          Moods
        </h1>
      </Link>
      <Logout />
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <Link
        href={"https://ajaykrajput.netlify.app/"}
        target="_blank"
        className=""
      >
        <p
          className={
            "text-indigo-500 duration-200 hover:text-white hover:bg-indigo-500 px-4 " +
            fugaz.className
          }
        >
          Built by Ajay Kumar 💛
        </p>
      </Link>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body
          className={
            "w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800  " +
            opensans.className
          }
        >
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
