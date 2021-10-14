import { ObjectType, Field, Directive } from "type-graphql";
import { prop } from "@typegoose/typegoose";

@Directive("@cacheControl(maxAge: 600)")
@ObjectType()
export class BiosampleInfo {

  @prop()
  @Field({ nullable: true })
  title?: string;

  @prop()
  @Field({ nullable: true })
  accession?: string;

  @prop()
  @Field({ nullable: true })
  publication_date?: string;

  @prop()
  @Field({ nullable: true })
  organization?: string;

  @prop()
  @Field({ nullable: true })
  organism?: string;

}
