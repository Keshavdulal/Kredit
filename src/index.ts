import cors from 'cors';
import 'reflect-metadata';
import express from 'express';
import { __prod__ } from './constants';
import { buildSchema } from 'type-graphql';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const PORT = process.env.PORT || 4000;

const main = async () => {
    // DB Connection
    const orm = await MikroORM.init(mikroOrmConfig);
    // run migrations
    await orm.getMigrator().up();

    // Express
    const app = express();

    // Redis
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    // CORS
    app.use(
        //'/', // coupld apply to a specific route
        cors({ origin: 'http://localhost3000', credentials: true })
    );

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                // disableTTL: true,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 3600 * 24 * 90,
                httpOnly: true, // block cookie access using JS in FE
                secure: __prod__, // https
                sameSite: 'lax', // protect csrf
            },
            // create session data only if user has a session // kinda confusing
            saveUninitialized: false,
            secret: 'randomstringasfasdfdsaf',
            resave: false,
        })
    );

    // Apollo
    const apolloServer = new ApolloServer({
        // pass graphql schema
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        // special object accessed by all resolvers
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });

    // create graphql endpoint in express using apollo
    apolloServer.applyMiddleware({
        app,
        cors: false,
        // cors: { origin: 'https://localhost:3000' },
    });

    app.listen(PORT, () => {
        console.log(`App Running at port ${PORT}`);
    });
};

// wrap orm with async main function cuz top level await is finniky
main().catch((e) => console.error(e));
