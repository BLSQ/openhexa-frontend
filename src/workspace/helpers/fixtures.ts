import { faker } from "@faker-js/faker";

faker.seed(0);

export const WORKSPACES = [
  {
    id: faker.datatype.uuid(),
    name: faker.animal.insect(),
  },
];
