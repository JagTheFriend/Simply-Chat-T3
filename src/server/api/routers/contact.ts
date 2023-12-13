import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  getLatest: protectedProcedure
    .input(z.object({ contactId: z.string(), ownerId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.contact.create({
        data: {
          ownerId: input.ownerId,
          contactId: input.contactId,
        },
      });
    }),

  getContacts: protectedProcedure.query(({ ctx }) => {
    return ctx.db.contact.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
});
