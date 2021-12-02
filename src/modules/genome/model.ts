import { getModelForClass } from "@typegoose/typegoose";
// Import and set adapter as above
import { Genome } from "../../entities";
import * as Redis from 'redis';
import { Cacheable, CacheClear } from '@type-cacheable/core';
import { useAdapter } from '@type-cacheable/redis-adapter';
import { config } from "../../config";

const userClient = Redis.createClient({host: config.redis.host, port: config.redis.port, password: config.redis.password});
const clientAdapter = useAdapter(userClient);

// This generates the mongoose model for us
export const GenomeMongooseModel = getModelForClass(Genome);

export default class GenomeModel {
  // This static method is being called to generate a cache key based on the given arguments.
  // Not featured here: the second argument, context, which is the instance the method
  // was called on.
  static setCacheKey = (args: any[]) => args[0];

  @Cacheable({
    cacheKey: GenomeModel.setCacheKey,
    hashKey: 'id',
    client: clientAdapter,
    ttlSeconds: 1800,
  })
  async getById(_id: string): Promise<Genome | null> {
    // Use mongoose as usual
    const genome = await GenomeMongooseModel.findById({_id: _id}).populate({path: 'features',model:'Feature'}).lean().exec()
    //console.log(genome)
    return genome
  }

  @Cacheable({
    cacheKey: GenomeModel.setCacheKey,
    hashKey: 'gid',
    client: clientAdapter,
    ttlSeconds: 1800,
  })
  async getByGenomeId(gId: string): Promise<Genome | null> {
    // Use mongoose as usual
    const genome = await GenomeMongooseModel.findOne({gId: gId}).populate({path: 'features',model:'Feature'}).lean().exec()
    //console.log(genome)
    return genome
  }

  @Cacheable({
    cacheKey: GenomeModel.setCacheKey,
    hashKey: 'accession',
    client: clientAdapter,
    ttlSeconds: 100,
  })
  async getByAccession(accession: string): Promise<Genome | null>{
    const genome = await GenomeMongooseModel.findOne({accession: accession}).populate({path: 'features',model:'Feature'}).lean().exec()

    return genome;
  }

}
