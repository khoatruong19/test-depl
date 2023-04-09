/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const saveRecipeRouter = createTRPCRouter({
  toggleSave: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exisitingSaveByUser = await ctx.prisma.saveRecipes.findFirst({
        where: {
          authorId: input.authorId,
          recipeId: input.recipeId,
        },
      });
      if (exisitingSaveByUser) {
        return await ctx.prisma.saveRecipes.delete({
          where: {
            id: exisitingSaveByUser.id,
          },
        });
      }
      await ctx.prisma.saveRecipes.create({
        data: input,
      });
    }),
});
