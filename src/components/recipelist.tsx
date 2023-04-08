import { useTranslation } from "next-i18next";
import { RecipeWithRatings } from "~/types/recipe.type";
import { SyncLoading } from "./loaders";
import RecipeCard from "./recipecard";
import RecipeFilter from "./recipefilter";
interface IProps {
  listTitle: string;
  data?: RecipeWithRatings[];
  isLoading: boolean;
}

const RecipeList = (props: IProps) => {
  const { listTitle, data = [], isLoading = false } = props;
  const { t } = useTranslation("common");

  return (
    <div className="min-h-[86.75vh]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-semibold">{listTitle}</h1>
          <p className="font-medium text-gray-600">326 {t("recipesFound")}</p>
        </div>
        <RecipeFilter />
      </div>
      {isLoading && <SyncLoading />}
      <div className="mt-10 grid grid-cols-3 gap-x-8 gap-y-10">
        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>
    </div>
  );
};

export default RecipeList;
