import { Resolver, Arg, Query, Mutation, ID } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { Feature } from "../../entities";
import FeatureService from "./service";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => Feature)
export default class FeatureResolver {
  constructor(private readonly featureService: FeatureService) {}

  @Query((returns) => Feature)
  async getFeature(@Arg("id") id: ObjectId) {
    const feature = await this.featureService.getById(id);

    return feature;
  }
}
