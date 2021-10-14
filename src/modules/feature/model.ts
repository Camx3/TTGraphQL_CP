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
    return FeatureMongooseModel.findOne({locus_tag: locus}).lean().exec()
  }

}
