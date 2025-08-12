import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLID,
} from "graphql";

import Favorite from "../models/Favorite.js";
import User from "../models/User.js";

// Defines the GraphQL data type for a Favorite
const FavoriteType = new GraphQLObjectType({
  name: "Favorite",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    nasaId: { type: GraphQLString },
  }),
});

// Defines the root query, the entry point for all read operations
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Defines a query field to retrieve a list of all favorites
    favorites: {
      type: new GraphQLList(FavoriteType),
      // The resolver function fetches the data from the database
      resolve(parent, args) {
        return Favorite.find().exec();
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
