'use client';
import { useActivePage } from "@/providers/active-page";
import { useEffect } from "react";

export default function SetActivePage(props: { pageID: number, headerLight: boolean }) {
  const { activePage, setActivePage, setHeaderLight } = useActivePage();

  useEffect(() => {
    if (activePage !== props.pageID) {
      setActivePage(props.pageID);
    }
  }, [props.pageID]);

  useEffect(() => {
    setHeaderLight(props.headerLight);
  }, [props.headerLight])
  
  return <></>;
}