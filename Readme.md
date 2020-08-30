# Kredit - A Reddit Clone

Tutorial by @BenAwad

Video Link - https://www.youtube.com/watch?v=I6ypD7qv3Z8

## Tech Stacks used

-   React JS
-   TypeScript
-   GraphQL
-   URQL / Appolo
-   Node.js
-   PostgreSQL
-   MikroORM/TypeORM
-   Redis
-   Next.js
-   TypeGraphQL

# Project Setup

1. Node & TypeScript Setup
2. MikroORM Setup

---

## 1. Node & TypeScript Setup

### 1. VS Code Extensions Recommended

-   Bracket Pair Colorizer
-   Docker
-   GraphQL For VS Code
-   Prettier
-   Vim

### 2. Initiate a npm package

```
npm init -y
```

### 3. Setup Typescript & Node Connection

```
yarn add -D @types/node typescript
```

### 4. Add start script in the `package.json` file

```
"star": "ts-node src/index.ts"
```

### 5. Install Custom TypeScript Config File of Ben Awad

Select `node` as a framework during installation.
This installs tsconfig.json file at project root directory.

```
$ npx tsconfig.json
```

### 6. Add a watch script

Spits out `index.js` in `./dist`

```
"watch": "tsc -w",
```

### 7. Add a new start script in `package.json`

```
"start": "node ./dist/index.js",
```

Telling `node` to run compiled js file instead of running a ts files with `ts-node` which is comparatively little slower.
Now pair `yarn watch` with `yarn dev` to compile TS and serve JS on the fly.

---

## 2. MikroORM Setup

```
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
```

Assuming you have Postgres setup, If not follow [this article](https://www.robinwieruch.de/postgres-sql-macos-setup)

## Running Migrations

```
npx mikro-orm migration:create
```

## Install Express, Apollo & GraphQL

```
yarn add express apollo-server-express graphql type-graphql
```

`express` - Server framework on Node
`apollo-server-express` - To create graphql apis on express
`graphql` & `type-graphql` - For Schema

Express doesn't come written in TypeScript. So install types for it.

```
yarn add -D @types/express
```

## Install `argon2` for hashing passwords

```
yarn add argon2
```

Something that came in the middle of video

```
yarn add reflect-metadata
```

## Redis setup for user session management

```
yarn add redis connect-redis express-session
```

`redis` - Redis Client
`connect-redis` - provides Redis session storage for Express
`express-session` - Express Middleware

## Install types

```
yarn add -D @types/redis @types/connect-redis @types/express-session
```
