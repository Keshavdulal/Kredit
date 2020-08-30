//  hello schema using type-graphql
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
    @Query(() => String)
    hello() {
        return 'hello world from type-graphql resolver';
    }
}
