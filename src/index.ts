import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Todo } from "./entity/todo";
import { HelloResolver } from "./resolver/hello";
import { TodoResolver } from "./resolver/todo";
import path from "path";

const main = async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "userauthpractice",
    synchronize: true,
    logging: true,
    entities: [Todo],
    migrations: [path.join(__dirname, "/src/migration")],
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, TodoResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

//
main();
