import { useTranslation } from "next-i18next";
import { RecipeWithRatings } from "~/types/recipe.type";
import { SyncLoading } from "./loaders";
import RecipeCard from "./recipecard";
import RecipeFilter from "./recipefilter";
import _ from "lodash";
interface IProps {
  listTitle: string;
  data?: {
    recipes: RecipeWithRatings[];
    recipesCount: number;
  };
  isLoading: boolean;
}

const RecipeList = (props: IProps) => {
  const {
    listTitle,
    data = {
      recipes: [] as RecipeWithRatings[],
      recipesCount: 0,
    },
    isLoading = false,
  } = props;
  const { t } = useTranslation("common");

  return (
    <div className="min-h-[86.75vh]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-0 md:mb-2 text-2xl md:text-3xl font-semibold">{listTitle}</h1>
          <p className="font-medium text-gray-600">{data.recipesCount} {t("recipesFound")}</p>
        </div>
        <RecipeFilter />
      </div>
      {isLoading && <SyncLoading />}
      <div className="mt-10 grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 sm:gap-x-4 md:gap-x-8 gap-y-10">
        {!isLoading &&
          _.get(data, "recipes") &&
          data.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default RecipeList;
