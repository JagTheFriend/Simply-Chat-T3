import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(z.object({ receiverId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.message.create({
        data: {
          senderId: ctx.session.user.id,
          receiverId: input.receiverId,
          content: input.content,
        },
      });
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
    }),

  getMessages: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
    }),
});
