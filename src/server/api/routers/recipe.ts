/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import _, { orderBy } from "lodash";
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
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(20),
        orderBy: z.string().default("createdAt"),
        filterByName: z.string().default(""),
        filterByTags: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filterByName, filterByTags, orderBy, skip, take } = input;
      const recipesCount = await ctx.prisma.recipe.count({
        where: {
          name: {
            contains: filterByName,
          },
          tags: {
            contains: filterByTags,
          },
        },
      });
      const recipes = await ctx.prisma.recipe.findMany({
        take: take,
        skip: skip,
        where: {
          name: {
            contains: filterByName,
          },
          tags: {
            contains: filterByTags,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          saves: {
            select: {
              authorId: true,
            },
          },
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

      const result = {
        recipes:
          orderBy === "rating"
            ? _.sortBy(recipesWithRatings, "ratings")
            : recipesWithRatings,
        recipesCount,
      };

      return result;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.recipe.findFirst({
        where: {
          id: input.id,
        },
        include: {
          saves: {
            select: {
              authorId: true,
            },
          },
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
  getAllByUser: publicProcedure
    .input(
      z.object({
        authorId: z.string().default(""),
        skip: z.number().default(0),
        take: z.number().default(20),
        orderBy: z.string().default("createdAt"),
        filterByName: z.string().default(""),
        filterByTags: z.string().default(""),
        type: z.string().default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        filterByName,
        filterByTags,
        orderBy,
        skip,
        take,
        type,
        authorId,
      } = input;
      const whereQuery =
        type === "all"
          ? {
              OR: [
                { authorId },
                {
                  saves: {
                    some: {
                      authorId,
                    },
                  },
                },
              ],
            }
          : type === "mine"
          ? { authorId }
          : {
              saves: {
                some: {
                  authorId,
                },
              },
            };
      const recipesCount = await ctx.prisma.recipe.count({
        where: {
          ...whereQuery,
          name: {
            contains: filterByName,
          },
          tags: {
            contains: filterByTags,
          },
        },
      });
      const recipes = await ctx.prisma.recipe.findMany({
        take: take,
        skip: skip,
        where: {
          ...whereQuery,
          name: {
            contains: filterByName,
          },
          tags: {
            contains: filterByTags,
          },
        },
        orderBy: {
          createdAt: "desc",
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
          saves: {
            where: {
              ...(type === "all" || type === "saved" ? { authorId } : {}),
            },
          },
        },
      });

      const recipesWithRatings = _.map(recipes, (item) => {
        const averageRating = getAverageRating(item);
        return { ...item, ratings: Math.round(averageRating * 2) / 2 };
      });

      const result = {
        recipes:
          orderBy === "rating"
            ? _.sortBy(recipesWithRatings, "ratings")
            : recipesWithRatings,
        recipesCount,
      };

      return result;
    }),
    delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.recipe.delete({
        where: {
          id: input.id
        }
      })
    }),
});
