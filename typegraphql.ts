import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as mongoose from "mongoose";
import {
  Field,
  ObjectType,
  Resolver,
  Query,
  buildSchemaSync,
} from "type-graphql";

@ObjectType()
class Book {
  @Field()
  title!: String;

  @Field()
  author!: String;
}

export interface IBookDocument extends mongoose.Document {
  title: String;
  author: String;
}

export const bookSchemaFields: Record<keyof Book, any> = {
  title: String,
  author: String,
};

const bookSchema = new mongoose.Schema(bookSchemaFields);

export const bookModel = mongoose.model<IBookDocument>("Book", bookSchema);

@Resolver(Book)
class BookResolver {
  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return await bookModel.find();
  }

  @Query(() => Book)
  async book(): Promise<Book | null> {
    return await bookModel.findOne();
  }

  @Query(() => Book)
  async bookfalse(): Promise<Book | null> {
    return {
      title: "testtile",
      author: "12",
    };
  }
}

const graphqlSchema = buildSchemaSync({
  resolvers: [BookResolver],
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema: graphqlSchema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
