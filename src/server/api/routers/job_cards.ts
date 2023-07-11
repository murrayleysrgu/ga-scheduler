import { z } from "zod";
import { createTRPCRouter, publicProcedure,  protectedProcedure, } from "~/server/api/trpc";

export const job_cardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.job_cards.findMany();
  }),

  getResources: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.Resource.findMany({
        include: {workshop: true},
        orderBy:[{
            resource_workshop: "asc",},{
            resource_name: "asc",} ],
        });
  }),
  getCal: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.Availability.findMany();
    }),
  getCal2: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.Availability.findMany({
        include: {resource: true},
        orderBy:[{
            availability_date: "asc"},{
            resource_id: "asc"} ],
    });
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
