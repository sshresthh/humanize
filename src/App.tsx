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
      </div>
    </Suspense>
  );
}

export default App;
