'use client';
import { createContext, useContext, useState } from "react";

const ActivePageContext = createContext({ activePage: 0, setActivePage: (id: number) => {}, headerLight: true, setHeaderLight: (light: boolean) => {}});

export default function ActivePageProvider(props: { children: React.ReactNode, pageID: number }) {
  const { pageID, children } = props;
  const [activePage, setActivePage] = useState(pageID);
  const [headerLight, setHeaderLight] = useState(false);
  return (
    <ActivePageContext.Provider value={{ activePage, setActivePage, headerLight, setHeaderLight }}>
      {children}
    </ActivePageContext.Provider>
  );
}

export const useActivePage = () => { return useContext(ActivePageContext) };