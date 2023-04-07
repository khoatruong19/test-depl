import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import AppLayout from "~/components/layout";

const MyRecipes = () => {
  return <AppLayout>MyRecipes</AppLayout>;
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default MyRecipes;
