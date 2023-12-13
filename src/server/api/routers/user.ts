import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  findUser: protectedProcedure
    .input(z.object({ userId: z.string(), ownerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });
    }),
});
