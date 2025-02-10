import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import { Humanizer } from "./components/Humanizer";
import { Layout } from "./components/layout/index";
import { Navbar } from "./components/layout/navbar";
import { Login } from "./components/login";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pt-16">
          {tempoRoutes}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Humanizer />} />
            </Route>
            <Route path="/login" element={<Login />} />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          <p>© 2025 AI Humanizer. All rights reserved.</p>
          <p className="mt-1">Developed by Shyamsundar Shrestha for friends and family</p>
        </footer>
      </div>
    </Suspense>
  );
}

export default App;
