/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import _ from "lodash";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Comment, Recipe } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

const addUserDataToComments = async (comment: Comment[]) => {
  const userId = comment.map((comment) => comment.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId,
    })
  ).map(filterUserForClient);

  return comment.map((comment) => {
    const author = users.find((user) => user.id === comment.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", comment);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for comment not found. COMMENT ID: ${comment.id}, USER ID: ${comment.authorId}`,
      });
    }

    return {
      ...comment,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

export const commentRouter = createTRPCRouter({
  getAllByRecipeId: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          recipeId: input.recipeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return await addUserDataToComments(comments);
    }),
  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        recipeId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exisitingComment = await ctx.prisma.comment.findFirst({
        where: {
          authorId: input.authorId,
          recipeId: input.recipeId,
        },
      });
      if (exisitingComment) {
        return await ctx.prisma.comment.update({
          where: {
            id: exisitingComment.id,
          },
          data: {
            content: input.content,
            createdAt: new Date(),
          },
        });
      }
      const comment = await ctx.prisma.comment.create({
        data: {
          ...input,
        },
      });

      return comment;
    }),
    delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.delete({
        where: {
          id: input.id
        }
      })
    }),
});
