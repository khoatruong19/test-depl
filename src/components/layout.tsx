/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Navbar from "./navbar";

interface IProps {
  children: ReactNode;
}

const AppLayout = ({ children }: IProps) => {
  const {i18n} = useTranslation("common");

  const router = useRouter();

  const onToggleLanguageClick = () => {
    const { pathname, asPath, query } = router;
    const newLocale = router.locale === "en" ? "vi" : "en";
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["common"]);
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto bg-white px-5">
      <Navbar toggleLanguage={onToggleLanguageClick} />
      <div className="pt-10">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
