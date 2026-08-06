import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <ReportContext.Provider
      value={{ selectedReport, setSelectedReport }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  return useContext(ReportContext);
}
