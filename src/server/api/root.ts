import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { recipeRouter } from "~/server/api/routers/recipe";
import { commentRouter } from "~/server/api/routers/comment";
import { ratingRouter } from "~/server/api/routers/rating";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rating: ratingRouter,
  comment: commentRouter,
  recipe: recipeRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
