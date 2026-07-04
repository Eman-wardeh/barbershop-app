import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "THIS IS MY TEST TITLE",
  description: "test",
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
        <main className="page-contents">
          {children}
        </main>
        <footer>
        <p style={{color:"red"}}>© IRON CUTS. All Rights Reserved.</p>
      </footer>
      </body>
      
    </html>
  );
}