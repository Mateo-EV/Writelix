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
  text,
  type PgVarcharConfig,
  boolean,
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
  files: many(files),
  documentations: many(documentations),
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
    userId: uuid("user_id")
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
    userId: uuid("user_id")
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

export type PasswordResetToken = InferSelectModel<typeof passwordResetTokens>;

export enum FileType {
  YOUTUBE = "youtube",
  AUDIO = "audio",
  PDF = "pdf",
  WEB = "web",
}

export enum FileStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  FAILED = "failed",
  SUCCESS = "success",
}

export const files = pgTable("file", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: dVarchar("name").notNull(),
  key: dVarchar("key").notNull(),
  type: varchar("type", { length: 10 }).$type<FileType>().notNull(),
  status: varchar("status", { length: 10 }).$type<FileStatus>().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
  messages: many(messages),
  documentationsToFiles: many(documentationsToFiles),
}));

export type File = InferSelectModel<typeof files>;

export const documentations = pgTable("documentation", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: dVarchar("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentationRelations = relations(
  documentations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [documentations.userId],
      references: [users.id],
    }),
    documentationsToFiles: many(documentationsToFiles),
  }),
);

export type Documentation = InferSelectModel<typeof documentations>;

export const documentationsToFiles = pgTable(
  "documentations_to_files",
  {
    documentationId: uuid("documentation_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.documentationId, t.fileId],
    }),
  }),
);

export const documentationsToFilesRelations = relations(
  documentationsToFiles,
  ({ one }) => ({
    documentation: one(documentations, {
      fields: [documentationsToFiles.documentationId],
      references: [documentations.id],
    }),
    file: one(files, {
      fields: [documentationsToFiles.fileId],
      references: [files.id],
    }),
  }),
);

export const messages = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),

  response: text("response").notNull(),
  fileId: uuid("file_id")
    .references(() => files.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  file: one(files, {
    fields: [messages.fileId],
    references: [files.id],
  }),
}));

export type Message = InferSelectModel<typeof messages>;
