import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity() // This decorates and tells mikro-orm that it is entity and corresponds to DB Table
export class User {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: 'text', unique: true })
    username!: string;

    // @Field() // Exposer
    @Property({ type: 'text' })
    password!: string;
}
