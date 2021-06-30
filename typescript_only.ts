import { ApolloServer, gql } from "apollo-server";
import * as mongoose from "mongoose";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

export interface IBook {
  title: String;
  author: String;
}

export interface IBookDocument extends mongoose.Document {
  title: String;
  author: String;
}

export const bookSchemaFields: Record<keyof IBook, any> = {
  title: String,
  author: String,
};

const bookSchema = new mongoose.Schema(bookSchemaFields);

export const bookModel = mongoose.model<IBookDocument>("Book", bookSchema);

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: async (): Promise<IBook[]> => bookModel.find(),
    book: async (): Promise<IBook | null> => bookModel.findOne(),
    bookfalse: async (): Promise<IBook | null> => ({
      title: "testtile",
      author: "12",
    }),
    bookCreate: async (): Promise<IBook | null> =>
      await bookModel.create({
        title: "test",
        author: "etst",
      }),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
