import { useUser } from "@clerk/nextjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import AppLayout from "~/components/layout";
import RecipeList from "~/components/recipelist";
import { api } from "~/utils/api";
import { TFunction } from "i18next";

interface Option {
  label: string;
  value: string;
}

const options = (t: TFunction<"translation", string, "translation">) => [
  {
    label: t("all") ?? "All",
    value: "all",
  },
  {
    label: t("myRecipes") ?? "My Recipes",
    value: "mine",
  },
  {
    label: t("savedRecipes") ?? "Saved Recipes",
    value: "saved",
  },
];

const MyRecipes = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const router = useRouter();

  const [selectOption, setSelectOption] = useState<Option>(
    options(t)[0] ?? {
      label: t("all") ?? "All",
      value: "all",
    }
  );

  const { data, isLoading, error } = api.recipe.getAllByUser.useQuery({
    authorId: user?.id,
    orderBy: (router.query.orderBy as string) ?? "createdAt",
    filterByTags: (router.query.tags as string) ?? "",
    filterByName: (router.query.name as string) ?? "",
    type: selectOption.value
  });
  return (
    <>
      <Head>
        <title>Cooking Recipe</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <div className="mb-4 flex justify-center items-center text-lg xs:text-xl sm:text-2xl font-semibold text-gray-400">
          {options(t).map((option: Option) => (
            <div
              onClick={() => setSelectOption(option)}
              key={option.value}
              className={`h-10 cursor-pointer border-primaryColor px-3 text-center hover:border-b-4 hover:text-[#3A5243] ${
                selectOption.value === option.value
                  ? "border-b-4 text-[#3A5243]"
                  : "border-0"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
        <RecipeList
          data={data}
          isLoading={isLoading}
          listTitle={selectOption.label}
        />
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

export default MyRecipes;
