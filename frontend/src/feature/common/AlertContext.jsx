import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ text: "", type: "error" }); // 객체형 상태

  const showAlert = (message, type = "error") => {
    const msgText = typeof message === "string" ? message : message?.text || "오류가 발생했습니다";
    const msgType = typeof message === "object" && message?.type ? message.type : type;

    setAlert({ text: msgText, type: msgType });

    setTimeout(() => setAlert({ text: "", type: "error" }), 4000); // 자동 사라짐
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {alert.text && (
        <div className={`alert alert-${alert.type} fixed top-4 left-1/2 -translate-x-1/2 z-[9999] text-lg shadow-lg w-fit`}>
          <span>{alert.text}</span>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
