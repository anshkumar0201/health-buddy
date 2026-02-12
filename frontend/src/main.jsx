import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const App = React.lazy(() => import("./App"));
const ThemeProvider = React.lazy(() => import("./context/ThemeContext"));
const LazyMotion = React.lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.LazyMotion })),
);

function Root() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // lazy load i18n AFTER first paint
    import("./i18n");
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <ThemeProvider>
        <LazyMotion
          features={() =>
            import("framer-motion").then((res) => res.domAnimation)
          }
        >
          <Root />
        </LazyMotion>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>,
);
