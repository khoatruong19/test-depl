/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import AppLayout from "~/components/layout";
import TagsInput from "react-tagsinput";
import { useRouter } from "next/router";
import DefaultImg from "../assets/images/default.jpg";

import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

const MyEditor = dynamic(() => import("../components/myeditor"), {
  ssr: false,
});

const CreateRecipe = () => {
  const { t } = useTranslation();
  const createRecipe = api.recipe.create.useMutation();
  const { user } = useUser();

  const router = useRouter();
  const [tags, setTags] = useState([]);
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

  const handleCreateRecipe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error(t("notAuthenticated"));
    if (!name || !tags || !image || !ingredients || !intructions)
      return toast.error(t("fillAll"));
    createRecipe.mutate(
      {
        name,
        tags: tags.join(";"),
        image,
        ingredients,
        intructions,
        authorId: user.id,
      },
      {
        onSuccess: () => {
          setTags([]);
          textAreaRef.current.value = "";
          setName("");
          setImage("");
          setInstructions("");
          toast.success(t("createRecipeSuccessfully"));
        },
      }
    );
  };

  const handleOpenFile = () => {
    console.log("asdshd");
    if (fileInputRef && fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <AppLayout>
      <h1 className="mb-5 text-center text-3xl font-bold">
        {t("createNewRecipe")}
      </h1>
      <form onSubmit={handleCreateRecipe}>
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
            {t("createLabel")}
          </button>
        </div>
      </form>
    </AppLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default CreateRecipe;
