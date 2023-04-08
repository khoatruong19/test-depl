/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import _ from "lodash";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Recipe } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

type RatingWithRatingsCount = Recipe & {
  ratings: { value: number }[];
  _count: { ratings: number };
};
type RatingWithRatings = Recipe & { ratings: number };

const getAverageRating = (item: RatingWithRatingsCount) =>
  _.sumBy(item.ratings, "value") / item._count.ratings;

const addUserDataToRecipes = async (recipes: RatingWithRatings[]) => {
  const userId = recipes.map((recipe) => recipe.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId,
    })
  ).map(filterUserForClient);
  return recipes.map((recipe) => {
    const author = users.find((user) => user.id === recipe.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", recipe);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for recipe not found. RECIPE ID: ${recipe.id}, USER ID: ${recipe.authorId}`,
      });
    }

    return {
      ...recipe,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      include: {
        ratings: {
          select: {
            value: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    const recipesWithRatings = _.map(recipes, (item) => {
      const averageRating = getAverageRating(item);
      return { ...item, ratings: Math.round(averageRating * 2) / 2 };
    });

    return recipesWithRatings;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.recipe.findFirst({
        where: {
          id: input.id,
        },
        include: {
          ratings: {
            select: {
              value: true,
            },
          },
          _count: {
            select: {
              ratings: true,
            },
          },
        },
      });

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      const averageRating = getAverageRating(data);

      const recipe = { ...data, ratings: Math.round(averageRating * 2) / 2 };

      return (await addUserDataToRecipes([recipe]))[0];
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        tags: z.string(),
        ingredients: z.string(),
        image: z.string(),
        intructions: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.create({
        data: {
          ...input,
        },
      });

      return recipe;
    }),
});
