import { exampleRouter } from "~/server/api/routers/example";
import { jobsRouter } from "~/server/api/routers/jobs";
import {job_cardsRouter} from "~/server/api/routers/job_cards";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  jobs: jobsRouter,
  jobcards: job_cardsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
