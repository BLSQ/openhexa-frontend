import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

faker.seed(0);

export const WORKSPACES = Array.from({ length: 8 }, () => ({
  id: faker.datatype.uuid(),
  name: faker.animal.insect(),
  description: `# Malaria Data Repository for Cameroon


  Welcome to the Cameroon Malaria Data Repository workspace !
  
  
  This workspace contains :
  
  
  - The data produced by Bluesquare in the context of this project
  - The different notebooks used for exploration and visualisation purposes
  - The data pipelines that we use to process the Malaria Data
  
  
  ## Quick links
  
  
  - [Annex A reports → lien vers le dossier](https://google.com)
  - [Link to pipeline ](https://google.com)
  
  
  ## Overview of the data in the repository
  
  
  Nunc fringilla, nisi eu hendrerit ornare, lacus massa accumsan eros, quis auctor nibh lorem sed ligula. Praesent ac rhoncus mi. Cras fermentum ultrices pellentesque. Maecenas odio ex, euismod sit amet odio ut, tristique cursus massa. 
  
  
  Nam congue mi eu metus sagittis rutrum sit amet suscipit nisi. Donec a consectetur orci, nec tempus dui. Proin tristique ex nec magna porttitor feugiat ut vel est. Pellentesque feugiat aliquet augue. Pellentesque a risus id dolor interdum convallis. Suspendisse condimentum in diam tempus dapibus. Mauris blandit dolor non felis dignissim, et tincidunt justo efficitur.
  
  
  `,
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
  database: {
    workspaceTables: Array.from({ length: 10 }, () => ({
      id: faker.datatype.uuid(),
      name: faker.word.noun({
        length: { min: 15, max: 30 },
        strategy: "longest",
      }),
      content: faker.datatype.number(),
      updatedAt: faker.datatype
        .datetime({
          min: DateTime.now().minus({ days: 28 }).toMillis(),
          max: DateTime.now().toMillis(),
        })
        .toISOString(),
    })),
    sharedTables: Array.from({ length: 4 }, () => ({
      id: faker.datatype.uuid(),
      name: faker.word.noun({
        length: { min: 15, max: 30 },
        strategy: "longest",
      }),
      content: faker.datatype.number(),
      updatedAt: faker.datatype
        .datetime({
          min: DateTime.now().minus({ days: 28 }).toMillis(),
          max: DateTime.now().toMillis(),
        })
        .toISOString(),
    })),
  },
}));
