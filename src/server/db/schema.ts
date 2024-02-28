// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { AdapterAccount } from "@auth/core/adapters";
import { type InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  type PgVarcharConfig,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

const dVarchar = (
  name: string,
  config?:
    | PgVarcharConfig<readonly [string, ...string[]] | [string, ...string[]]>
    | undefined,
) => varchar(name, { length: 255, ...config });

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: dVarchar("name").notNull(),
  password: varchar("password", { length: 60 }),
  email: dVarchar("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: dVarchar("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  account: many(accounts),
  verificationTokens: many(verificationTokens),
  passwordResetTokens: many(passwordResetTokens),
}));

export type User = InferSelectModel<typeof users>;

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: dVarchar("type").$type<AdapterAccount["type"]>().notNull(),
    provider: dVarchar("provider").notNull(),
    providerAccountId: dVarchar("providerAccountId").notNull(),
    refresh_token: dVarchar("refresh_token"),
    access_token: dVarchar("access_token"),
    expires_at: integer("expires_at"),
    token_type: dVarchar("token_type"),
    scope: dVarchar("scope"),
    id_token: varchar("id_token", { length: 1140 }),
    session_state: dVarchar("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export type Account = InferSelectModel<typeof accounts>;

export const verificationTokens = pgTable(
  "verification_token",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    token: uuid("token").defaultRandom().unique().notNull(),
    expires: timestamp("expires").notNull(),
  },
  (verificationToken) => ({
    compoundKey: primaryKey({
      columns: [verificationToken.userId, verificationToken.token],
    }),
  }),
);

export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  }),
);

export type VerificationToken = InferSelectModel<typeof verificationTokens>;

export const passwordResetTokens = pgTable(
  "password_reset_token",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    token: uuid("token").defaultRandom().unique().notNull(),
    expires: timestamp("expires").notNull(),
  },
  (passwordResetToken) => ({
    compoundKey: primaryKey({
      columns: [passwordResetToken.userId, passwordResetToken.token],
    }),
  }),
);

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  }),
);
