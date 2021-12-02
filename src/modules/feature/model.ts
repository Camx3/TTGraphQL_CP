import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

import { Feature } from "../../entities";

// This generates the mongoose model for us
export const FeatureMongooseModel = getModelForClass(Feature);

export default class FeatureModel {
  async getById(_id: ObjectId): Promise<Feature | null> {
    // Use mongoose as usual
    return FeatureMongooseModel.findById(_id).lean().exec();
  }

  async getByLocus(locus: string): Promise<Feature | null>{
    
    var lowercase_locus = locus.toLowerCase()
    var uppercase_locus = locus.toUpperCase()
    const feature = await FeatureMongooseModel.findOne({locus_tag: lowercase_locus}).lean().exec();
    if(feature === null){
      return FeatureMongooseModel.findOne({locus_tag: uppercase_locus}).lean().exec();
    }
    return feature;
  }

}
