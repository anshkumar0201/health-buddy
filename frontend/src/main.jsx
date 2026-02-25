import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
const App = React.lazy(() => import("./App"));
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LazyMotion, domAnimation } from "framer-motion";


function Root() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LazyMotion features={domAnimation}>
          <Root />
        </LazyMotion>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
