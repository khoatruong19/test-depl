/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useUser } from "@clerk/nextjs";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Comment } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import ReactStars from "react-rating-stars-component";
import AppLayout from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { SyncLoading } from "~/components/loaders";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
interface IProps {
  id: string;
}

const RecipeDetail = ({ id }: IProps) => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const { user, isSignedIn } = useUser();
  const router = useRouter()
  const { data: recipe, isLoading } = api.recipe.getById.useQuery({
    id,
  });
  const { data: comments } = api.comment.getAllByRecipeId.useQuery({
    recipeId: id,
  });
  const { mutate: commentMutate } = api.comment.create.useMutation();
  const { mutate: deleteCommentMutate } = api.comment.delete.useMutation();
  const { mutate: deleteRecipeMutate } = api.recipe.delete.useMutation();
  const { mutate: ratingMutate } = api.rating.create.useMutation();

  const commentInputRef = useRef(null);
  const [ratings, setRatings] = useState(0);

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn) return toast.error(t("notAuthenticated"));
    if (
      commentInputRef &&
      commentInputRef.current &&
      commentInputRef.current.value.length > 0
    ) {
      commentMutate(
        {
          authorId: user?.id!,
          content: commentInputRef.current.value,
          recipeId: id,
        },
        {
          onSuccess: () => {
            void ctx.comment.getAllByRecipeId.invalidate({ recipeId: id });
            toast.success(t("createCommentSuccessfully"));
            commentInputRef.current.value = "";
          },
        }
      );
    }
  };
  const handleSubmitRating = () => {
    if (!isSignedIn) return toast.error(t("notAuthenticated"));
    ratingMutate(
      { authorId: user?.id!, value: ratings, recipeId: id },
      {
        onSuccess: () => {
          void ctx.comment.getAllByRecipeId.invalidate({ recipeId: id });
          toast.success(t("rateSuccessfully"));
        },
        onError: (error) => {
          alert(error);
        },
      }
    );
  };
  const handleDeleteComment = (comment: Comment) => {
    if (!isSignedIn || user.id !== comment.authorId)
      return toast.error(t("notAuthenticated"));
    deleteCommentMutate(
      { id: comment.id },
      {
        onSuccess: () => {
          void ctx.comment.getAllByRecipeId.invalidate({ recipeId: id });
          toast.warning(t("deleteCommentSuccessfully"));
        },
        onError: (error) => {
          alert(error);
        },
      }
    );
  };
  const handleDeleteRecipe = () => {
    if (!isSignedIn || user.id !== recipe?.authorId)
      return toast.error(t("notAuthenticated"));
    deleteRecipeMutate( 
      { id: recipe.id },
      {
        onSuccess: () => {
          toast.warning(t("deleteRecipeSuccessfully"));
          void router.push("/")
        },
        onError: (error) => {
          alert(error);
        },
      }
    );
  };
  if (!recipe) return <div>404 NOT FOUND</div>;
  return (
    <AppLayout>
      {isLoading ? (
        <SyncLoading />
      ) : (
        <div className="relative">
          {user && user.id === recipe.authorId && (
            <div onClick={handleDeleteRecipe} className="absolute top-0 text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-white right-0 border-2 border-primaryColor p-2 font-semibold rounded-md flex items-center gap-2">
              <TrashIcon className="w-4 h-4"/>
              <span>{t('deleteCrecipe')}</span>
            </div>
          )}
          <h1 className="mb-5 text-center text-4xl font-bold">{recipe.name}</h1>
          <div className="mb-8 mt-2 flex flex-col items-center justify-center gap-2">
            <div className="img-container h-16 w-16 rounded-full">
              <img
                alt="recipe-author-avatar"
                src={recipe.author.profileImageUrl}
              />
            </div>
            <p className="font-semibold">{recipe.author.username}</p>
            <p className="text-sm">
              {dayjs(recipe.createdAt).format("DD/MM/YYYY")}
            </p>
            <ReactStars
              count={5}
              value={recipe.ratings}
              edit={false}
              size={16}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
          <div className="img-container mb-4 h-[700px] w-[100%]">
            <img alt="recipe-img" src={recipe.image} />
          </div>
          <div className="mb-3 flex flex-col gap-1">
            <h3 className="text-xl font-semibold">{t("tags")}:</h3>
            <div className="flex flex-wrap gap-3">
              {recipe.tags.split(";").map((tag) => (
                <span
                  className="rounded-md border-2 border-primaryColor px-2 py-0.5 font-bold"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-3 flex flex-col gap-1">
            <h3 className="text-xl font-semibold">{t("ingredients")}:</h3>
            <ul className="flex list-disc flex-col gap-1	pl-5">
              {recipe.ingredients.split(";").map((ingredient) => (
                <li className="" key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3 flex flex-col gap-1">
            <h3 className="text-xl font-semibold">{t("intructions")}:</h3>
            <ReactQuill
              className="min-h-[100px]"
              value={recipe.intructions}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
          <div className="mb-3 flex items-center gap-4">
            <h3 className="text-xl font-semibold">{t("ratings")}:</h3>
            <ReactStars
              count={5}
              value={ratings}
              onChange={(value: number) => setRatings(value)}
              size={30}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
            <button
              onClick={handleSubmitRating}
              className="rounded-sm bg-primaryColor px-2.5 py-1 font-semibold text-white"
            >
              {t("submit")}
            </button>
          </div>
          <div className=" flex flex-col">
            <h3 className="mb-2 text-xl font-semibold">{t("comments")}:</h3>
            <form onSubmit={handleSubmitComment} className="mb-4">
              <input
                ref={commentInputRef}
                className="w-[100%]"
                placeholder={t("commentPlaceholder") ?? "Comments..."}
              />
            </form>
            <div className="pb-5">
              {comments &&
                comments.map((comment) => (
                  <div
                    className="relative mb-1 flex items-start gap-3 rounded-md border border-secondaryColor p-2 pb-1"
                    key={comment.id}
                  >
                    <div className="img-container h-8 w-8 rounded-full">
                      <img
                        alt="comment-author-avatar"
                        src={comment.author.profileImageUrl}
                      />
                    </div>
                    <div>
                      <p className="mt-[-5px] text-lg font-semibold">
                        {comment.author.username}
                      </p>
                      <p className="mt-[-3px] text-xs">
                        {dayjs(comment.createdAt).format("DD/MM/YYYY h:mm A")}
                      </p>
                      <p>{comment.content}</p>
                    </div>
                    {user && user.id === comment.authorId && (
                      <div
                        onClick={() => handleDeleteComment(comment)}
                        className="absolute right-2 top-1 cursor-pointer text-red-400 hover:text-red-600 "
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
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

export default RecipeDetail;
