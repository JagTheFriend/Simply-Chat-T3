import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  createContact: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Add contact twice
      await ctx.db.contact.create({
        data: {
          ownerId: ctx.session.user.id,
          contactId: input.contactId,
        },
      });
      await ctx.db.contact.create({
        data: {
          ownerId: input.contactId,
          contactId: ctx.session.user.id,
        },
      });
      return { message: "Created" };
    }),

  deleteContact: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete contact twice
      await ctx.db.contact.delete({
        where: {
          ownerId_contactId: {
            contactId: input.contactId,
            ownerId: ctx.session.user.id,
          },
        },
      });
      await ctx.db.contact.delete({
        where: {
          ownerId_contactId: {
            contactId: ctx.session.user.id,
            ownerId: input.contactId,
          },
        },
      });
      return { message: "Deleted" };
    }),

  getContacts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.contact.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
});
