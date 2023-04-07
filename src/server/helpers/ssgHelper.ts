/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers  } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import superjson from "superjson";

export const generateSSGHelper = () =>
  createServerSideHelpers ({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });