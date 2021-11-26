import { ObjectType, Field, Directive } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@Directive("@cacheControl(maxAge: 600)")
@ObjectType()
export class Feature {
  
  @prop()
  readonly _id!: ObjectId;

  @prop()
  @Field({ nullable: false })
  location!: string;

  @prop()
  @Field({ nullable: true })
  key?: string;

  @prop()
  @Field({ nullable: true })
  mobile_element_type?: string;

  @prop()
  @Field({ nullable: true })
  locus_tag?: string;

  @prop()
  @Field({ nullable: true })
  gene?: string;

  @prop()
  @Field({ nullable: true })
  product?: string;

  @prop()
  @Field({ nullable: true })
  translation?: string;

  @prop()
  @Field({nullable: false})
  genome_accession!: string;
}
