/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { generateSSGHelper } from '~/server/helpers/ssgHelper'
import { api } from '~/utils/api'
import AppLayout from '~/components/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
interface IProps{
    id: string
}

const RecipeDetail = ({id}: IProps) => {
  const { t } = useTranslation();

    const { data } = api.recipe.getById.useQuery({
        id,
      });
      if (!data) return <div>404 NOT FOUND</div>;
  return (
    <AppLayout>
      <h1 className="mb-5 text-center text-3xl font-bold">{data.name}</h1>
      <p>{data.author.username}</p>
      <h3 className="text-xl font-semibold">{t('ingrediens')}:</h3>
      <ReactQuill
    value={data.intructions}
    readOnly={true}
    theme={"bubble"}
 /></AppLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = generateSSGHelper();

    const id = context.params?.id;
  
    await ssg.recipe.getById.prefetch({ id:`${id as string}` });
  
    return {
      props: {
        trpcState: ssg.dehydrate(),
        id,
        ...(await serverSideTranslations(context.locale!, ["common"]))
      },
    };
  }
  
  export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
  }

export default RecipeDetail