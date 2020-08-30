import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Posts';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const PORT = process.env.PORT || 4000;
const main = async () => {
  // DB Connection
  const orm = await MikroORM.init(mikroOrmConfig);
  // run migrations
  await orm.getMigrator().up();

  // just creating an instance
  // const post = orm.em.create(Post, { title: 'my first post' });
  // to push to db and await it
  // await orm.em.persistAndFlush(post);
  // alternate way // doesn't work
  // await orm.em.nativeInsert(Post, { title: "my first post 2" });

  // const posts = await orm.em.find(Post, {});
  // console.log('🚀', posts);

  // express
  const app = express();
  // app.get('/', (_, res) => {
  //   res.send('Hello from the Server 👋');
  // });
  const apolloServer = new ApolloServer({
    // pass graphql schema
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    // special object accessed by all resolvers
    context: () => ({ em: orm.em }),
  });

  // create graphql endpoint in express using apollo
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`App Running at port ${PORT}`);
  });
};

// wrap orm with async main function cuz top level await is finniky
main().catch((e) => console.error(e));
