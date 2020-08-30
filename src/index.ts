import 'reflect-metadata';
import express from 'express';
import { __prod__ } from './constants';
import { buildSchema } from 'type-graphql';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';

import { PostResolver } from './resolvers/post';
import { HelloResolver } from './resolvers/hello';

const PORT = process.env.PORT || 4000;

const main = async () => {
    // DB Connection
    const orm = await MikroORM.init(mikroOrmConfig);
    // run migrations
    await orm.getMigrator().up();

    // express
    const app = express();
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
