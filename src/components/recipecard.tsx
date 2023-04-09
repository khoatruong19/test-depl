import React, { useMemo } from "react";
import Pizza from "../assets/images/pizza.jpg";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";
import { HeartIcon as HeaerIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { RecipeWithRatings } from "~/types/recipe.type";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import _ from "lodash";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface IProps {
  recipe: RecipeWithRatings;
}

const RecipeCard = ({ recipe }: IProps) => {
  const { t } = useTranslation();
  const { mutate: toggleSave } = api.saveRecipe.toggleSave.useMutation();

  const user = useUser();
  const router = useRouter();
  const savedByCurrentUser = useMemo(() => {
    if (!user.isSignedIn) return false;
    return _.some(recipe.saves, (save) => save.authorId === user.user.id);
  }, [user, recipe]);

  const ctx = api.useContext();

  const handleToggleSave = () => {
    if (!user.isSignedIn) return alert("Not authenticated");
    toggleSave(
      { authorId: user.user.id, recipeId: recipe.id },
      {
        onSuccess: () => {
          if (savedByCurrentUser) toast.success(t("recipeUnSaved"));
          else toast.success(t("recipeSaved"));
          router.pathname.includes("my-recipes")
            ? void ctx.recipe.getAllByUser.invalidate({ authorId: user.user.id })
            : void ctx.recipe.getAll.invalidate();
        },
      }
    );
  };

  return (
    <div className="relative">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="group w-[100%] cursor-pointer">
          <div className="relative flex items-center justify-center rounded-2xl border-2  border-secondaryColor/30 px-3 py-6">
            <div className="z-1 img-container h-[200px] w-[200px] rounded-md group-hover:scale-110">
              <img src={recipe.image ?? Pizza} alt="" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
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
        </div>
      </Link>
      <div
        onClick={handleToggleSave}
        className="absolute right-4 top-4 z-[9999] cursor-pointer rounded-3xl bg-secondaryColor/30 p-3 hover:bg-secondaryColor"
      >
        {savedByCurrentUser ? (
          <HeaerIconSolid className={`h-7 w-7 text-primaryColor `} />
        ) : (
          <HeartIcon className={`h-7 w-7 text-white `} />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
