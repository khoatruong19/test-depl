/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useUser } from "@clerk/nextjs";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Comment } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import ReactStars from "react-rating-stars-component";
import AppLayout from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { SyncLoading } from "~/components/loaders";
import { useRouter } from "next/router";
import Head from "next/head";
import TagsInput from "react-tagsinput";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const MyEditor = dynamic(() => import("../../components/myeditor"), {
  ssr: false,
});

interface IProps {
  id: string;
}

const UpdateRecipe = ({ id }: IProps) => {
  const { t } = useTranslation();
  const updateRecipe = api.recipe.update.useMutation();
  const { user } = useUser();
  const { data: recipe, isLoading } = api.recipe.getById.useQuery({
    id,
  });
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [intructions, setInstructions] = useState("");
  const textAreaRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false)

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    const formData = new FormData();
    formData.append("file", (e.target.files as FileList)[0]);
    formData.append("upload_preset", "uploadTaskly");
    const data = await fetch(process.env.IMAGE_UPLOAD_URL as string, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    setImage(data.secure_url as string);
    setUploading(false)
  };

  const handleUpdateRecipe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error(t("notAuthenticated"));
    console.log(name, tags,image, ingredients, intructions )
    if (!name || !tags || !image || !intructions)
      return toast.error(t("fillAll"));
    updateRecipe.mutate(
      {
        id: recipe?.id as string,
        name,
        tags: tags.join(";"),
        image,
        ingredients: ingredients || textAreaRef.current.value.replace(/(?:\r\n|\r|\n)/g, ";"),
        intructions,
      },
      {
        onSuccess: () => {
          toast.success(t("updateRecipeSuccessfully"));
        },
      }
    );
  };

  const handleOpenFile = () => {
    if (fileInputRef && fileInputRef.current) fileInputRef.current.click();
  };
  if (!recipe) return <div>404 NOT FOUND</div>;

  useEffect(() => {
    if(!isLoading && recipe){
      setName(recipe.name)
      setTags(recipe.tags.split(";"))
      setImage(recipe.image)
      textAreaRef.current.value = recipe.ingredients.replaceAll(";", "\n");
      setInstructions(recipe.intructions)
    }
}, [recipe, isLoading])  
console.log({ingredients})

  return (
    <>
     <Head>
        <title>{recipe.name}</title>
      </Head>
      <AppLayout>
        {isLoading ? (
          <SyncLoading />
        ) : (
          <>
          <h1 className="mb-5 text-center text-3xl font-bold">
        {t("updateRecipe")}
      </h1>
      <form onSubmit={handleUpdateRecipe}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <label className="text-xl font-semibold">{t("recipeImage")}:</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUploadImage}
              hidden
              accept="image/*"
            />
            <div className="img-container h-[200px] w-[200px]">
              <img alt="recipe-image" src={image || "https://pkmjatijajar.depok.go.id/assets/images/default.jpg"} />
            </div>
            <button
            disabled={uploading}
              className="disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer rounded-lg border-[1.5px] border-primaryColor px-3 py-1 font-semibold text-primaryColor hover:opacity-60"
              onClick={handleOpenFile}
              type="button"
            >
              {t("uploadImage")}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold">{t("recipeName")}:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-md border border-secondaryColor px-2"
              placeholder={t("recipeNamePlaceholder") ?? "Recipe name..."}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold">{t("tags")}:</label>
            <TagsInput
              value={tags}
              onChange={setTags}
              inputProps={{
                placeholder:
                  router.locale === "en" ? "Add tags..." : "Thêm nhãn...",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold">{t("ingredients")}:</label>
            <textarea
              ref={textAreaRef}
              rows={4}
              onBlur={(e) =>
                setIngredients(e.target.value.replace(/(?:\r\n|\r|\n)/g, ";"))
              }
              className="rounded-md border border-secondaryColor px-2"
              placeholder={
                t("recipeIngredientsPlaceholder") ?? "Recipe ingredients..."
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold">{t("intructions")}:</label>
            <MyEditor data={intructions} setData={setInstructions} />
          </div>
          <button className="mb-3 w-[100px] self-center rounded-md bg-primaryColor py-2 font-semibold text-white">
            {t("updateLabel")}
          </button>
        </div>
      </form>
          </>
        )}
      </AppLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  await ssg.recipe.getById.prefetch({ id: `${id as string}` });

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default UpdateRecipe;
