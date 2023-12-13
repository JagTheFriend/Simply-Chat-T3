import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  createContact: protectedProcedure
    .input(z.object({ contactId: z.string(), ownerId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.contact.create({
        data: {
          ownerId: ctx.session.user.id,
          contactId: input.contactId,
        },
      });
    }),

  deleteContact: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.contact.delete({
        where: {
          contactId: input.contactId,
          ownerId: ctx.session.user.id,
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
