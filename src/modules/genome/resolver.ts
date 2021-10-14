import { Resolver, Arg, Query, Mutation, ID, FieldResolver, Root } from "type-graphql";
import { ApolloError } from 'apollo-server-errors';
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { BioprojectInfo, BiosampleInfo, Feature, Genome, PubmedInfo } from "../../entities";
import GenomeService from "./service";
import FeatureService from "../feature/service";
import { performance } from "perf_hooks";
import { AssemblyInfo } from "../../entities/assemblyInfo";


/*status
0 error
1 ok
2 processing
3 not found in db but processing
4 not found
*/

@Service() // Dependencies injection
@Resolver((of) => Genome)
export default class GenomeResolver {
  constructor(
    private readonly genomeService: GenomeService,
    private readonly featureService: FeatureService) {}
  
  @Query((returns) => Genome, { nullable: true })
  async getGenomebyAccession(
    @Arg("accession") accession: string,
    @Arg("locus_start") locus_start: string,
    @Arg("locus_end") locus_end: string,) {
    let t0 = performance.now()
    if(accession === ""){
      throw new ApolloError('Accession is null','ACCESSION_NOT_FOUND');
    }
    const [genome,status] = await this.genomeService.getByAccession(accession);

    if(genome){
      var start_index: number = -1;
      var end_index: number = -1;
      if(locus_start === ""){
        start_index = 1;
      }
      if(locus_end === ""){
        end_index = genome.features.length -1;
      }
      var isInEndFeature = false;
      var isStartReady = false;
      genome.features.forEach((value,index) =>{

        if(!isStartReady){
          if (value.locus_tag === locus_start){
            start_index = index;
            isStartReady = true;
          }
        } 
        else if(value.locus_tag === locus_end){
          end_index = index;
        }
      });
      if(start_index === -1 || end_index === -1){
        throw new ApolloError('Start or End Locus tag doesnt exist in the genome','LOCUS_TAG_NOT_FOUND')
      }

      genome.features = genome.features.slice(start_index, end_index+1)

    }else{
      if(status === "2"){
        throw new ApolloError('Genome is being processed','PROCESSING_GENOME');
      }else if(status === "3"){
        throw new ApolloError('Genome not found in db but being processed','PROCESSING_GENOME');
      }else if(status === "4"){
        throw new ApolloError('Genome not found','GENOME_NOT_FOUND');
      }
    }
    
    let t1 = performance.now()  
    //console.log("Tiempo de respuesta para obtener gen " + (t1-t0) + " milisegundos")
    return genome;
  }

  @Query((returns) => Genome, { nullable: true })
  async getGenomebyAssembly(
    @Arg("assembly_accession") assembly_accession: string,
    @Arg("locus_start") locus_start: string,
    @Arg("locus_end") locus_end: string,) {
    let t0 = performance.now()
    if(assembly_accession === "" || (locus_start==="" && locus_end === "")){
      throw new ApolloError('Assembly accesion and at least one locus tag should be in the parameters','EMPTY_PARAMETER');
      return null;
    }
    const [genome,status] = await this.genomeService.getByAssembly(assembly_accession, locus_start!== ""?locus_start:locus_end);

    if(genome){
      var start_index: number = -1;
      var end_index: number = -1;
      if(locus_start === ""){
        start_index = 1;
      }
      if(locus_end === ""){
        end_index = genome.features.length -1;
      }
      var isInEndFeature = false;
      var isStartReady = false;
      genome.features.forEach((value,index) =>{

        if(!isStartReady){
          if (value.locus_tag === locus_start){
            start_index = index;
            isStartReady = true;
          }
        } 
        else if(value.locus_tag === locus_end){
          end_index = index;
        }
      });
      if(start_index === -1 || end_index === -1){
        throw new ApolloError('Start or End Locus tag doesnt exist in the genome','LOCUS_TAG_NOT_FOUND')
      }

      genome.features = genome.features.slice(start_index, end_index+1)

    }else{
      if(status === "2"){
        throw new ApolloError('Genome is being processed','PROCESSING_GENOME');
      }else if(status === "3"){
        throw new ApolloError('Genome not found in db but being processed','PROCESSING_GENOME');
      }else if(status === "4"){
        throw new ApolloError('Genome not found','GENOME_NOT_FOUND');
      }
    }
    
    let t1 = performance.now()  
    //console.log("Tiempo de respuesta para obtener gen " + (t1-t0) + " milisegundos")
    return genome;
  }

  @Query((returns) => Genome, { nullable: true })
  async getGenomebyLocus(
    @Arg("assembly_accession", {nullable: true}) assembly_acc: string,
    @Arg("locus_tag") locus_tag: string,
    @Arg("upper_limit") upper_limit: number,
    @Arg("lower_limit") lower_limit: number,
    ) {
    if(locus_tag === ""){
      throw new ApolloError('Locus tag is null','LOCUS_TAG_NOT_FOUND');
    }
    var locus_first_index = -1;
    var locus_last_index = -1;
    let t0 = performance.now()
    const [genome,status] = assembly_acc? await this.genomeService.getByAssembly(assembly_acc,locus_tag) :await this.genomeService.getByLocus(locus_tag)
    let isIndexReady = false;
    if(genome){
      genome.features.forEach((value,index) =>{
        if(value.locus_tag === locus_tag){
          if(!isIndexReady){
            locus_first_index = index;
            isIndexReady = true;
          }
          else{
            locus_last_index = index;
          }
        }
        
      });

      if(locus_first_index === -1 || locus_last_index === -1){
        throw new ApolloError('Start or End Locus tag doesnt exist in the genome','LOCUS_TAG_NOT_FOUND')
      }
      let re = /(\d+)([\)\(]*$)/; //match[1]
      var lower_count = 0;
      var upper_count = 0;
      var lower_index = -1;
      var upper_index = -1;
      const gene_first_location = genome.features[locus_first_index].location.match(re)
      const gene_last_location = genome.features[locus_last_index].location.match(re)
      var first_location = "";
      var last_location = "";
      if (gene_first_location){
        first_location = gene_first_location[1];
      }
      if (gene_last_location){
        last_location = gene_last_location[1];
      }

      for(let i = (locus_first_index - 1); i >= 0; i-- ){
        if(lower_limit === 0){
          lower_index = locus_first_index;
          break;
        }

        else if(i === 1){
          lower_index = 1;
          break;
        }
        else if(lower_count === lower_limit ){
          var match = genome.features[i].location.match(re)
          if(match){
            if(match[1] >= first_location){
              var matchLocation = genome.features[i].location.match(re)
              
              if (matchLocation){
                first_location = matchLocation[1]
                lower_index = i;
                continue;
              }
              
            }
            else if(match[1] < first_location){
              break;
            }
          }
        }
        
        var match = genome.features[i].location.match(re)
        if(match){
          if(match[1] < first_location){
            var matchLocation = genome.features[i].location.match(re)
            
            if (matchLocation){
              first_location = matchLocation[1]
              lower_index = i;
              lower_count +=1
            }
            
          }
        }
        
      }


      for(let i = (locus_last_index +1 ); i >= 0; i++ ){
        if(upper_limit === 0){
          upper_index = locus_last_index;
          break;
        }

        else if(i === genome.features.length -1){
          upper_index = genome.features.length -1;
          break;
        }
        else if(upper_count === upper_limit ){
          var match = genome.features[i].location.match(re)
          if(match){
            if(match[1] <= last_location){
              var matchLocation = genome.features[i].location.match(re)
              
              if (matchLocation){
                last_location = matchLocation[1]
                upper_index = i;
                continue;
              }
              
            }
            else if(match[1] > last_location){
              break;
            }
          }
        }
        
        var match = genome.features[i].location.match(re)
        if(match){
          if(match[1] > last_location){
            var matchLocation = genome.features[i].location.match(re)
            
            if (matchLocation){
              last_location = matchLocation[1]
              upper_index = i;
              upper_count +=1
            }
            
          }
        }
        
      }

      genome.features = genome.features.slice(lower_index, upper_index+1)
    }else{
      if(status === "2"){
        throw new ApolloError('Genome is being processed','PROCESSING_GENOME');
      }else if(status === "3"){
        throw new ApolloError('Genome not found in db but being processed','PROCESSING_GENOME');
      }else if(status === "4"){
        throw new ApolloError('Genome not found','GENOME_NOT_FOUND');
      }
    }
    
    let t1 = performance.now()
    //console.log("Tiempo de respuesta para obtener gen " + (t1-t0) + " milisegundos")
    return genome;
  }

    
  @FieldResolver()
  async assembly_info(@Root() genome: Genome): Promise<AssemblyInfo | null>{
    let t0 = performance.now()
    if(genome.assembly_link){
      const info = await this.genomeService.getAssemblyInfo(genome.assembly_link);
      let t1 = performance.now()
      //console.log("Tiempo de respuesta para obtener assemblyInfo " + (t1-t0) + " milisegundos")
      return info;
    }
    else{
      return null;
    }
      
  }
    
  @FieldResolver()
  async bioproject_info(@Root() genome: Genome): Promise<BioprojectInfo | null>{
    let t0 = performance.now()
    if(genome.bioproject_link){
      const info = await this.genomeService.getBioprojectInfo(genome.bioproject_link);
      let t1 = performance.now()
      //console.log("Tiempo de respuesta para obtener bioproject info " + (t1-t0) + " milisegundos")
      return info;
    }
    else{
      return null;
    }
      
  }
    
  @FieldResolver()
  async biosample_info(@Root() genome: Genome): Promise<BiosampleInfo | null>{
    let t0 = performance.now()
    if(genome.biosample_link){
      const info = await this.genomeService.getBiosampleInfo(genome.biosample_link);
      let t1 = performance.now()
      //console.log("Tiempo de respuesta para obtener biosample info " + (t1-t0) + " milisegundos")
      return info;
    }
    else{
      return null;
    }
      
  }

  @FieldResolver()
  async pubmed_info(@Root() genome: Genome): Promise<PubmedInfo[] | null>{
    let t0 = performance.now()
    if(genome.pubmedIds){
      const info = await this.genomeService.getPubmedInfo(genome.pubmedIds);
      let t1 = performance.now()
      //console.log("Tiempo de respuesta para obtener pubmed info " + (t1-t0) + " milisegundos")
      return info;
    }
    else{
      return null;
    }
      
  }

}
