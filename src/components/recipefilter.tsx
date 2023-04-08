import { FunnelIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { useRouter } from "next/router";
import { useCheckClickOutside } from "~/hooks/useCheckClickOutside";

const RecipeFilter = () => {
  const { t } = useTranslation();

  const [openFilter, setOpenFilter] = useState(false);
  const [sortByCreatedDate, setSortByCreatedDate] = useState(false)
  const [sortByRating, setSortByRating] = useState(false)
  const filterRef = useRef<HTMLDivElement | null>(null)
  useCheckClickOutside(filterRef, () => setOpenFilter(false))

  const router = useRouter()

  const handleChangeSortBy = (type: 'created-date' | 'rating') => {
    switch(type){
      case 'created-date':
        if(sortByRating) setSortByRating(false)
        setSortByCreatedDate(true)
        break 
      case 'rating':
        if(sortByCreatedDate) setSortByCreatedDate(false)
        setSortByRating(true)
        break 
      default:
        break
    }
  }

  const renderSortByEle = () => (
    <>
      <span className="text-lg font-semibold">{t("orderBy")}:</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <input
            id="created-date-checkbox"
            type="checkbox"
            onChange={() => handleChangeSortBy('created-date')}
            checked={sortByCreatedDate}
            className=" h-4 w-4 rounded-xl border-gray-300 bg-gray-100 text-primaryColor focus:ring-0 focus:ring-offset-0"
          />
          <label
            htmlFor="created-date-checkbox"
            className="font-medium text-gray-900 dark:text-gray-300"
          >
            {t("createdDate")}
          </label>
        </div>
        <div className="flex items-center gap-1">
          <input
            id="rating-checkbox"
            type="checkbox"
            onChange={() => handleChangeSortBy('rating')}
            checked={sortByRating}
            className="h-4 w-4 rounded-xl border-gray-300 bg-gray-100 text-primaryColor ring-0 focus:ring-0 focus:ring-offset-0"
          />
          <label
            htmlFor="rating-checkbox"
            className="font-medium text-gray-900 dark:text-gray-300"
          >
            {t("rating")}
          </label>
        </div>
      </div>
    </>
  );

    const [tags, setTags] = useState([])

  const renderTagSelect = () => (
    <>
      <span className="text-lg font-semibold">{t("tags")}:</span>
      <TagsInput className="react-tagsinput red" value={tags} onChange={setTags} inputProps={{placeholder: router.locale === "en" ? "Add tags..." : "Thêm nhãn..."}} />
    </>
  );
  return (
    <div className="relative">
      <div onClick={() => setOpenFilter(prev => !prev)} className="flex text-white w-44 cursor-pointer items-center justify-between rounded-lg bg-primaryColor px-3 py-2.5 hover:bg-red-400">
        <span className="text-xl font-semibold">{t("filterLabel")}</span>
        <FunnelIcon className="h-5 w-5" />
      </div>
      {openFilter && (
        <div ref={filterRef} className="z-[999999] bg-white absolute bottom-[-220px] right-0 w-[600px] rounded-md border border-primaryColor shadow-lg">
          <div className="px-4 py-3">
            <form action="" className="flex w-[100%] flex-col">
              <input
                className="w-[100%] rounded-md border border-primaryColor p-2 outline-none"
                placeholder={t("recipeNamePlace") ?? ""}
              />
              <div className="mt-4 flex items-center gap-4">
                {renderSortByEle()}
              </div>
              <div className="mb-2 mt-3 flex items-center gap-4">
                {renderTagSelect()}
              </div>

              <button className="w-[85px] self-end rounded-md bg-secondaryColor py-2 font-semibold text-white">
                {t("search")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeFilter;
