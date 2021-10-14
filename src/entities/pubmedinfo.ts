import { ObjectType, Field, Directive } from "type-graphql";
import { prop } from "@typegoose/typegoose";

@Directive("@cacheControl(maxAge: 600)")
@ObjectType()
export class PubmedInfo {

  @prop()
  @Field({ nullable: true })
  pub_date?: string;

  @prop()
  @Field({ nullable: true })
  source?: string;

  @prop()
  @Field({ nullable: true })
  title?: string;

  @prop()
  @Field({ nullable: true })
  issn?: string;

  @prop()
  @Field({ nullable: true })
  essn?: string;

  @prop()
  @Field({ nullable: true })
  pub_type?: string;

  @prop()
  @Field({ nullable: true })
  record_status?: string;
}
