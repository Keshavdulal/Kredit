// User schema using type-graphql
import argon2 from 'argon2';
import { MyContext } from 'src/types';
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Query,
    Mutation,
    ObjectType,
    Resolver,
} from 'type-graphql';

import { User } from '../entities/User';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

// ObjectType can be returned from mutations & InputType for inputs
@ObjectType()
class UserResponse {
    // return User if worked properly else error! wtf bt why!
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    // CURRENT USER
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
        if (!req.session.id) {
            return null;
        }
        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }
    // CREATE USER / SIGN UP
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'length must be greater than 2',
                    },
                ],
            };
        }
        if (options.password.length <= 4) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'length must be greater than 4',
                    },
                ],
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        try {
            await em.persistAndFlush(user);
        } catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [{ field: 'Username', message: 'Already exists ' }],
                };
            }
        }
        return { user };
    }

    // LOG IN
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        // lookup user by username
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'does not exist',
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'Combination',
                        message: 'Does not exist',
                    },
                ],
            };
        }

        // store user id session
        // set cookie in user
        // keep them logged in
        req.session.userId = user.id;

        return {
            user,
        };
    }
}
