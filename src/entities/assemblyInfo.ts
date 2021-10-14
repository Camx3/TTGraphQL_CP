import { ObjectType, Field, Directive } from "type-graphql";
import { prop } from "@typegoose/typegoose";

@Directive("@cacheControl(maxAge: 600)")
@ObjectType()
export class AssemblyInfo {

  @prop()
  @Field({ nullable: true })
  assembly_accession?: string;

  @prop()
  @Field({ nullable: true })
  latest_assembly_accession?: string;

  @prop()
  @Field({ nullable: true })
  taxid?: string;

  @prop()
  @Field({ nullable: true })
  specie?: string;

  @prop()
  @Field({ nullable: true })
  specieTaxId?: string;

  @prop()
  @Field({ nullable: true })
  submitter?: string;

  @prop()
  @Field({ nullable: true })
  ftp_rpt?: string;
}
