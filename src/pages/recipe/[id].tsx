/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { generateSSGHelper } from '~/server/helpers/ssgHelper'
import { api } from '~/utils/api'
import AppLayout from '~/components/layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

interface IProps{
    id: string
}

const RecipeDetail = ({id}: IProps) => {
    const { data } = api.recipe.getById.useQuery({
        id,
      });
      if (!data) return <div>404 NOT FOUND</div>;
  return (
    <AppLayout>{JSON.stringify(data)}</AppLayout>
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