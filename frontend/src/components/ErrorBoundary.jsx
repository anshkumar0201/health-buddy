import React from "react";
import { withTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            {t("ErrorBoundary.title")}
          </h1>

          <p className="text-gray-600 mb-6 max-w-md">
            {t("ErrorBoundary.message")}
          </p>

          <button
            onClick={this.handleReload}
            className="
              px-6 py-2 rounded-lg
              bg-blue-600 text-white font-medium
              transition hover:bg-blue-700
              active:scale-95
            "
          >
            {t("ErrorBoundary.reloadButton")}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ✅ Give the wrapped component a name */
const ErrorBoundaryWithTranslation = withTranslation()(ErrorBoundary);
export default ErrorBoundaryWithTranslation;
