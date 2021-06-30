import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { prop, getModelForClass } from "@typegoose/typegoose";
import {
  Field,
  ObjectType,
  Resolver,
  Query,
  buildSchemaSync,
  Mutation,
} from "type-graphql";

@ObjectType()
class Book {
  @prop()
  @Field()
  title!: String;

  @prop()
  @Field()
  author!: String;
}

const bookModel = getModelForClass(Book);

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

  @Mutation(() => Book)
  async bookCreate(): Promise<Book | null> {
    return await bookModel.create({
      title: "test",
      author: "etst",
    });
  }
}

const graphqlSchema = buildSchemaSync({
  resolvers: [BookResolver],
});

const server = new ApolloServer({ schema: graphqlSchema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
