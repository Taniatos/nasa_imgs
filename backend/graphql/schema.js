import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLID,
} from "graphql";

import Favorite from "../models/Favorite.js";
import User from "../models/User.js";

const FavoriteType = new GraphQLObjectType({
  name: "Favorite",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    nasaId: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    favorites: {
      type: new GraphQLList(FavoriteType),
      resolve(parent, args) {
        return Favorite.find();
      },
    },
  },
});
export default new GraphQLSchema({
  query: RootQuery,
});
