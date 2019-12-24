const {
    makeExtendSchemaPlugin,
    gql,
  } = require('graphile-utils');

  const MySchemaExtensionPlugin =
  makeExtendSchemaPlugin(build => ({
    typeDefs: gql`
      type Random {
        float: Float!
        number(min: Int!, max: Int!): Int!
      }
      extend type Query {
        random: Random
      }
    `,
    resolvers: {
      Query: {
        random() {
          return {};
        },
      },
      Random: {
        float() {
          return Math.random();
        },
        number(_parent, { min, max }) {
          return min + Math.floor(Math.random() * (max - min + 1));
        },
      },
    },
  }));

module.exports = MySchemaExtensionPlugin;