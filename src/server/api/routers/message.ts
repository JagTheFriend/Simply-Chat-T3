import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
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
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input.messageId,
        },
      });
    }),

  getMessages: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.message.findMany({
        where: {
          OR: [
            {
              senderId: ctx.session.user.id,
              receiverId: input.contactId,
            },
            {
              senderId: input.contactId,
              receiverId: ctx.session.user.id,
            },
          ],
        },
      });
    }),
});
