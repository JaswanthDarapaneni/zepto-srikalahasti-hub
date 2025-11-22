import type { CodegenConfig } from "@graphql-codegen/cli";


const config: CodegenConfig = {
  schema: "http://localhost:8081/graphql",
  documents: ["src/**/*.gql"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
    },
  },
};

export default config;
