import { Recipe } from "@prisma/client";

export type RecipeWithRatings = Recipe & {
    ratings: number
}