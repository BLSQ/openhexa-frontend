import fs from "fs";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { faker } from "@faker-js/faker";

faker.seed(0);

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync("./schema.graphql", "utf-8"),
});

const mocks = {
  DateTime: () => faker.date.recent(),
  Date: () => faker.date.recent(),

  String: () => faker.animal.bird(),
  Number: () => faker.datatype.number(),
  URL: () => faker.internet.url(),

  Collection: {
    id: () => faker.datatype.uuid(),
    name: () => faker.commerce.department(),
  },
  Avatar: {
    initials: () => faker.datatype.string(2),
    color: () => faker.color.rgb(),
  },
  Country: () => ({
    code: "BE",
    alpha3: "BEL",
    name: "Belgium",
    flag: faker.image.animals(),
  }),
};
// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  preserveResolvers: true,
});

export const fetchQuery = (options) => {
  return graphql({
    schema: schemaWithMocks,
    source: options.query,
    variableValues: options.variables,
    operationName: options.operationName,
  });
};

export default mocks;
