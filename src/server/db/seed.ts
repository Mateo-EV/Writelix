import { config } from "dotenv";
import { type InferInsertModel } from "drizzle-orm";
import { FileStatus, FileType, files } from "./schema";
import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

config();

const main = async () => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const data: InferInsertModel<typeof files>[] = [];
  const posibleData = {
    [FileType.PDF]: [
      "f66c9eb9-4249-4e0f-9c34-cfad31299690-fex0co.pdf",
      "Planeta Tierra",
    ],
    [FileType.AUDIO]: [
      "5e7dcb99-290e-4521-8788-f8b6d05e1e72-s2m7wi.app-sonido-RELOJ-_240p_.mp3",
      "Reloj",
    ],
    [FileType.WEB]: ["https://docs.uploadthing.com", "Que es uploadthing?"],
    [FileType.YOUTUBE]: ["ALVLVG60rdA", "Debate Futbol"],
  } as const;

  const user = await db.query.users.findFirst();
  await db.delete(files);
  for (let i = 0; i < 10; i++) {
    const type = faker.helpers.enumValue(FileType);
    console.log(type);

    data.push({
      type,
      key: posibleData[type][0],
      name: posibleData[type][1],
      status: faker.helpers.enumValue(FileStatus),
      userId: user!.id,
    });
  }
  await db.insert(files).values(data);
  console.log("Seed done");
};

void main();
