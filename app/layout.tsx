import { ThemeProvider } from "../src/components/theme-provider";
import { Navbar } from "../src/components/layout/navbar";
import { Footer } from "../src/components/layout/footer";
import "../src/index.css";

export const metadata = {
  title: "AI Text Humanizer",
  description: "Transform your text into natural, human-like writing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
