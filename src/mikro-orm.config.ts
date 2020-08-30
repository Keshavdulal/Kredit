import { __prod__ } from './constants';
import { Post } from './entities/Posts';
import { MikroORM } from '@mikro-orm/core';
import path from 'path'; //node

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the dist folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post], // corresponds to our db tables
    dbName: 'kredit',
    type: 'postgresql',
    debug: !__prod__, // logs what sql is executed under the hood
    user: 'keshavdulal', //might need
    password: '', //might need
    baseDir: __dirname,
} as Parameters<typeof MikroORM.init>[0];
// type casting dbname to kredit and type to postgresql
