import React from "react";
import Pizza from "../assets/images/pizza.jpg";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";
import { HeartIcon as HeaerIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { RecipeWithRatings } from "~/types/recipe.type";
import Link from "next/link";

interface IProps {
  recipe: RecipeWithRatings;
}

const RecipeCard = ({ recipe }: IProps) => {
  const like = false;
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="group z-[9999] w-[100%] cursor-pointer">
        <div className="relative flex items-center justify-center rounded-2xl border-2  border-secondaryColor/50 px-3 py-6">
          <div className="z-1 img-container h-[200px] w-[200px] group-hover:scale-110">
            <img src={recipe.image ?? Pizza} alt="" />
          </div>
          <div className="absolute right-4 top-4 rounded-3xl bg-secondaryColor/50 p-3 hover:bg-secondaryColor">
            {like ? (
              <HeaerIconSolid className={`h-7 w-7 text-primaryColor `} />
            ) : (
              <HeartIcon className={`h-7 w-7 text-white `} />
            )}
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
  );
};

export default RecipeCard;
