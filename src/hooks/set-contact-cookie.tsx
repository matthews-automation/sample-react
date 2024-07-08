"use client";
import { useEffect } from "react";
import { COOKIE_EXPIRATION, DIVISON_COOKIE, PRODUCT_COOKIE } from "@/core/constants";
import { removeCookie, setCookie } from "@/actions/cookies";

export default function SetContactCookie({ page, deleteCookie }: { page?: Page; deleteCookie?: boolean}) {
  useEffect(() => {
    if (deleteCookie || !page) {
      removeCookie(DIVISON_COOKIE);
      removeCookie(PRODUCT_COOKIE);
      return;
    }
    const isContactPage = page.template === "contact-page-template.php";
    const { acf: { page_meta: { is_division } }, parent_is_division, ID, post_parent } = page;
    if (is_division || parent_is_division) {
      const division = is_division ? ID : post_parent;
      const expiration = new Date(Date.now() + COOKIE_EXPIRATION);
      setCookie({ name: DIVISON_COOKIE, value: division.toString(), options: { expires: expiration } });
      if (parent_is_division) setCookie({ name: PRODUCT_COOKIE, value: ID.toString(), options: { expires: expiration }});
    } else if (!isContactPage) {
      console.log('removing cookies');
      removeCookie(DIVISON_COOKIE);
      removeCookie(PRODUCT_COOKIE);
    }
  }, []);
  return <></>;
};
