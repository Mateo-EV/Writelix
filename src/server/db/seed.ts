import { faker } from "@faker-js/faker";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { type InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config();

const main = async () => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema, logger: true });

  const filesSeeded: InferInsertModel<typeof schema.files>[] = [];
  const documentationsSeeded: InferInsertModel<typeof schema.documentations>[] =
    [];
  const posibleData = {
    [schema.FileType.PDF]: [
      "f66c9eb9-4249-4e0f-9c34-cfad31299690-fex0co.pdf",
      "Planeta Tierra",
    ],
    [schema.FileType.AUDIO]: [
      "5e7dcb99-290e-4521-8788-f8b6d05e1e72-s2m7wi.app-sonido-RELOJ-_240p_.mp3",
      "Reloj",
    ],
    [schema.FileType.WEB]: ["https://www.wikipedia.org", "Que es wikipedia"],
    [schema.FileType.YOUTUBE]: ["ALVLVG60rdA", "Debate Futbol"],
  } as const;

  const user = await db.query.users.findFirst();

  await db.delete(schema.files);
  await db.delete(schema.documentations);
  for (let i = 0; i < 10; i++) {
    const type = faker.helpers.enumValue(schema.FileType);
    documentationsSeeded.push({
      userId: user!.id,
      title: faker.lorem.sentence(3),
      content: faker.lorem.text(),
    });
    filesSeeded.push({
      type,
      key: posibleData[type][0],
      name: posibleData[type][1],
      status: faker.helpers.enumValue(schema.FileStatus),
      userId: user!.id,
    });
  }

  await db.insert(schema.documentations).values(documentationsSeeded);
  await db.insert(schema.files).values(filesSeeded);
  console.log("Seed done");
};

void main();
