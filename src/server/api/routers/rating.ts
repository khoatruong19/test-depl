/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        value: z.number(),
        recipeId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exisitingRating = await ctx.prisma.rating.findFirst({
        where: {
          authorId: input.authorId,
          recipeId: input.recipeId,
        },
      });
      if (exisitingRating) {
        return await ctx.prisma.rating.update({
          where: {
            id: exisitingRating.id,
          },
          data: {
            value: input.value,
            createdAt: new Date(),
          },
        });
      }
      const rating = await ctx.prisma.rating.create({
        data: {
          ...input,
        },
      });

      return rating;
    }),
});
