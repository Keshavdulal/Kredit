//  Post schema using type-graphql
import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities/Posts';

@Resolver()
export class PostResolver {
    // CREATE
    @Mutation(() => Post)
    // set type gql type inside @Arg (removed) followed by TS Type
    async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    // Read
    @Query(() => Post, { nullable: true })
    // set type gql type inside @Arg (removed) followed by TS Type
    post(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // Read ALL
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    // UPDATE
    @Mutation(() => Post, { nullable: true })
    // set type gql type inside @Arg (removed) followed by TS Type
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== undefined) {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    // DELETE
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, { id });
        } catch {
            return false;
        }
        return true;
    }
}
