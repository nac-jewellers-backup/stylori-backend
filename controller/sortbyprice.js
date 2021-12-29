const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const MySchemaExtensionPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs: gql`
    extend type Query {
      allUsers: String
    }
  `,
  resolvers: {
    Query: {
      allUsers() {
        return "mano";
      },
    },
  },
}));

module.exports = MySchemaExtensionPlugin;
