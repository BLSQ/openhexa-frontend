import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

faker.seed(0);

export const WORKSPACES = Array.from({ length: 8 }, () => ({
  id: faker.datatype.uuid(),
  name: faker.animal.insect(),
  files: Array.from({ length: 13 }, () => ({
    id: faker.datatype.uuid(),
    name: faker.system.fileName(),
    type: faker.system.fileType(),
    size: faker.datatype.number(1000 * 10 * 10 * 10),
    updatedAt: faker.datatype
      .datetime({
        min: DateTime.now().minus({ days: 28 }).toMillis(),
        max: DateTime.now().toMillis(),
      })
      .toISOString(),
  })),
  sharedFiles: Array.from({ length: 4 }, () => ({
    id: faker.datatype.uuid(),
    name: faker.system.fileName(),
    type: faker.system.fileType(),
    size: faker.datatype.number(1000 * 10 * 10 * 10),
    origin: faker.company.name(),
    updatedAt: faker.datatype
      .datetime({
        min: DateTime.now().minus({ days: 28 }).toMillis(),
        max: DateTime.now().toMillis(),
      })
      .toISOString(),
  })),
}));
