/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import AppLayout from "~/components/layout";
import RecipeList from "~/components/recipelist";
import { api } from "~/utils/api";

const Home: NextPage = (props) => {
  const { t } = useTranslation('common');
  const {data, isLoading, error} = api.recipe.getAll.useQuery();
  console.log({data})
  return (
    <>
      <Head>
        <title>Cooking Recipe</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <RecipeList data={data} isLoading={isLoading} listTitle={t('recipesResult')}/>
      </AppLayout>
    </>
  );
};


export async function getStaticProps({ locale }: { locale: string }) {  
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Home;
