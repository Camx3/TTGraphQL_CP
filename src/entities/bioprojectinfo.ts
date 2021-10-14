import { ObjectType, Field, Directive } from "type-graphql";
import { prop } from "@typegoose/typegoose";

@Directive("@cacheControl(maxAge: 600)")
@ObjectType()
export class BioprojectInfo {

  @prop()
  @Field({ nullable: true })
  project_accession?: string;

  @prop()
  @Field({ nullable: true })
  project_type?: string;

  @prop()
  @Field({ nullable: true })
  project_target_material?: string;

  @prop()
  @Field({ nullable: true })
  project_target_scope?: string;

  @prop()
  @Field({ nullable: true })
  registration_date?: string;

  @prop()
  @Field({ nullable: true })
  project_name?: string;

  @prop()
  @Field({ nullable: true })
  project_title?: string;

  @prop()
  @Field({ nullable: true })
  project_description?: string;

  @prop()
  @Field({ nullable: true })
  relevance_agricultural?: string;
  
  @prop()
  @Field({ nullable: true })
  relevance_medical?: string;

  @prop()
  @Field({ nullable: true })
  relevance_industrial?: string;

  @prop()
  @Field({ nullable: true })
  relevance_environmental?: string;

  @prop()
  @Field({ nullable: true })
  relevance_evolution?: string;

  @prop()
  @Field({ nullable: true })
  relevance_other?: string;

  @prop()
  @Field({ nullable: true })
  relevance_model?: string;

  @prop()
  @Field({ nullable: true })
  organism_name?: string;

  @prop()
  @Field({ nullable: true })
  organism_strain?: string;

  @prop()
  @Field({ nullable: true })
  organism_label?: string;

  @prop()
  @Field({ nullable: true })
  sequencing_status?: string;

  @prop()
  @Field({ nullable: true })
  submitter?: string;

  @prop()
  @Field({ nullable: true })
  supergroup?: string;

}
