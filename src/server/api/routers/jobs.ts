
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const jobsRouter = createTRPCRouter({

  getJAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany();
  }),
});
