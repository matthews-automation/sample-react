'use client';
import { createContext, useContext, useState } from "react";

const ActivePageContext = createContext({ options: {} as SiteOptions, setOptions: (options: SiteOptions) => {} });

export default function OptionsProvider(props: { children: React.ReactNode, initialOpts: SiteOptions }) {
  const { initialOpts, children } = props;
  const [options, setOptions] = useState(initialOpts);
  return (
    <ActivePageContext.Provider value={{ options, setOptions }}>
      {children}
    </ActivePageContext.Provider>
  );
}

export const useOptions = () => useContext(ActivePageContext);