import React, { createContext, useContext, useState, useCallback } from "react";
import { ErrorModal, SuccessModal } from "../../MessageModal/MessageModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [successState, setSuccessState] = useState({ show: false, message: "", onClose: null });
  const [errorState, setErrorState] = useState({ show: false, message: "", onClose: null });

  const showSuccess = useCallback((message, { onClose = null, autoCloseMs = 0 } = {}) => {
    setSuccessState({ show: true, message, onClose });
    if (autoCloseMs > 0) {
      setTimeout(() => {
        setSuccessState(prev => {
          prev.onClose?.();
          return { show: false, message: "", onClose: null };
        });
      }, autoCloseMs);
    }
  }, []);

  const showError = useCallback((message, { onClose = null, autoCloseMs = 0 } = {}) => {
    setErrorState({ show: true, message, onClose });
    if (autoCloseMs > 0) {
      setTimeout(() => {
        setErrorState(prev => {
          prev.onClose?.();
          return { show: false, message: "", onClose: null };
        });
      }, autoCloseMs);
    }
  }, []);

  const hideSuccess = useCallback(() => {
    setSuccessState(prev => {
      prev.onClose?.();
      return { show: false, message: "", onClose: null };
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorState(prev => {
      prev.onClose?.();
      return { show: false, message: "", onClose: null };
    });
  }, []);

  return (
    <ModalContext.Provider value={{ showSuccess, showError, hideSuccess, hideError }}>
      {children}

      {/* Single global modal components */}
      <SuccessModal
        show={successState.show}
        message={successState.message}
        onHide={hideSuccess}
      />

      <ErrorModal
        show={errorState.show}
        message={errorState.message}
        onHide={hideError}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
