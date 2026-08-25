import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000); // 3 seconds baad auto-hide
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render UI */}
      {toast.show && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div
            className={`toast show align-items-center text-white border-0 shadow-lg ${
              toast.type === "danger" ? "bg-danger" : "bg-warning text-dark"
            }`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body fw-bold">
                {toast.type === "danger" ? "🗑️ " : "✨ "}
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close me-2 m-auto"
                onClick={() => setToast({ show: false, message: "", type: "info" })}
              ></button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);