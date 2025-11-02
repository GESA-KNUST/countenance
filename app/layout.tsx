import { Geist, Geist_Mono, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300","400", "500", "600", "700"],
});

const open_sans = Open_Sans({
  variable: "--font-open_sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "GESA",
  description: "GESA-KNUST Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${open_sans.variable} antialiased`}
      >
        <div>
          <Navbar/>
          <main>{children}</main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
