import { ObjectType, Field } from "type-graphql";
import { arrayProp, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Feature } from "./feature";
import { AssemblyInfo } from "./assemblyInfo";
import { BioprojectInfo, BiosampleInfo, PubmedInfo } from ".";

@ObjectType()
export class Genome {
  @prop()
  @Field()
  readonly _id!: String;

  @prop({ref: 'Feature'})
  @Field(_type => [Feature])
  features: Feature[];

  @prop()
  @Field({ nullable: true })
  definition?: string;

  @prop()
  @Field()
  gId!: string;

  @prop()
  @Field({nullable: true})
  assembly_link?: string;

  @prop()
  @Field({nullable: true})
  bioproject_link?: string;

  @prop()
  @Field({nullable: true})
  biosample_link?: string;

  @prop()
  @Field(_type => [String],{nullable: true})
  pubmedIds?: string[];


  //@prop({ref: 'AssemblyInfo'})
  @Field(_type => AssemblyInfo,{nullable: true})
  assembly_info?: AssemblyInfo;
  
  @Field(_type => BiosampleInfo,{nullable: true})
  biosample_info?: BiosampleInfo;

  @Field(_type => BioprojectInfo,{nullable: true})
  bioproject_info?: BioprojectInfo;

  @Field(_type => [PubmedInfo],{nullable: true})
  pubmed_info?: PubmedInfo[];
  

}
