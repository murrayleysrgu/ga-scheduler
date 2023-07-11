import { z } from "zod";
import { createTRPCRouter, publicProcedure,  protectedProcedure, } from "~/server/api/trpc";

export const job_cardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany();
  }),
  getElec: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany({
        where: {
            job_workshop: "ELEC"
        }
    });
  }),
  getHyd: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany({
        where: {
            job_workshop: "HYD"
        }
    });
  }),
  getMech: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany({
        where: {
            job_workshop: "MECH"
        }
    });
  }),  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
