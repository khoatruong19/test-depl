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
  const {t,i18n} = useTranslation("common");

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
    <div className="max-w-[1200px] min-h-[100vh] mx-auto">
      <div className="bg-white px-3 md:px-5">
        <Navbar toggleLanguage={onToggleLanguageClick} />
        <div className="pt-5 md:pt-10 lg:pt-15 xl:pt-18">
          {children}
        </div>
      </div>
      <div className="pb-5 pt-3 bg-primaryColor text-white text-center">
        <h1 className="text-4xl font-bold mb-2">{t("contactUs")}</h1>
        <p><span className="font-semibold">{t("call")}:</span> +84 777520337</p>
        <p><span className="font-semibold">Email:</span> khoa.truongthdk@hcmut.edu.vn</p>
        <button onClick={() => router.push("/report")} className="mt-3 px-2 py-1 border-2 border-white font-semibold rounded-md hover:bg-white hover:text-primaryColor ">{t("report")}</button>
      </div>
    </div>
  );
};

export default AppLayout;
