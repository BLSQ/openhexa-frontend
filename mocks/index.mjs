import fs from "fs";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { faker } from "@faker-js/faker";
import _ from "lodash";

faker.seed(0);

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync("./schema.graphql", "utf-8"),
});

const mocks = {
  CollectionPage: () => ({
    totalItems: 10,
    pageNumber: 1,
    totalPages: 1,
    items: [...new Array(10)],
  }),
  DateTime: () => faker.date.recent(),
  Date: () => faker.date.recent(),

  String: () => faker.animal.bird(),
  Number: () => faker.datatype.number(),
  URL: () => faker.internet.url(),

  Collection: {
    id: () => faker.datatype.uuid(),
    name: () => faker.commerce.department(),
    countries: () => [...new Array(faker.datatype.number({ min: 0, max: 2 }))],
  },
  Avatar: {
    initials: () => faker.datatype.string(2),
    color: () => faker.color.rgb(),
  },
  Country: () =>
    _.sample([
      {
        code: "BE",
        alpha3: "BEL",
        name: "Belgium",
        flag: faker.image.animals(),
      },
      {
        code: "FR",
        alpha3: "FRA",
        name: "France",
        flag: faker.image.animals(),
      },
      {
        code: "RDC",
        alpha3: "RDC",
        name: "Democratic Republic of Congo",
        flag: faker.image.animals(),
      },
    ]),
};

const MY_USER_ID = faker.datatype.uuid();
// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  preserveResolvers: false,
  mocks,
  // @ts-ignore
  resolvers: (store) => ({
    Query: {
      collection(_, { id }) {
        return store.get("Collection", id);
      },
    },
    Mutation: {
      login: (_, { input }) => {
        const [firstName, lastName] = [
          faker.name.firstName(),
          faker.name.lastName(),
        ];
        store.set("Query", "ROOT", "me", {
          user: {
            id: MY_USER_ID,
            email: input.email,
            firstName,
            lastName,
            displayName: [firstName, lastName].join(" "),
            avatar: {
              initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
              color: "red",
            },
          },
        });

        return {
          success: true,
          me: store.get("Me"),
        };
      },
      logout: () => {
        store.reset();
        return {
          success: true,
        };
      },
    },
  }),
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
