import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Iron Cuts | Modern Barbershop",
  description: "Professional men's haircuts, beard trims, and modern styles.",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body>
        <Navbar />
        <main className="page-content">
          {children}
        </main>
        <footer>
        <p>© IRON CUTS. All Rights Reserved.</p>
      </footer>
      </body>
      
    </html>
  );
}