import { Service } from "typedi";

import GenomeModel from "./model";
import FeatureModel from "../feature/model";
import { Genome, Feature, BioprojectInfo, BiosampleInfo, PubmedInfo } from "../../entities";
import axios, { AxiosError } from 'axios';
import { config } from "../../config";
import {PythonShell} from 'python-shell';
import { AssemblyInfo } from "../../entities/assemblyInfo";
import { ApolloError } from "apollo-server-errors";
import { Tedis } from "tedis";

const client = new Tedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
});
const pythonScriptPath = '/usr/app/python-utils';

/*status
0 error
1 ok
2 processing
3 not found in db but processing
4 not found
*/

@Service() // Dependencies injection
export default class GenomeService {
  constructor(
    private readonly genomeModel: GenomeModel,
    private readonly featureModel: FeatureModel) {}

  public async getById(_id: string): Promise<Genome | null> {

    return this.genomeModel.getById(_id);
  }

  public async getByAccession(accession: string): Promise<[Genome | null,string]>{
    accession = accession.toUpperCase();
    const genome = await this.genomeModel.getById(accession);
    var status: string = "1";
    if(genome === null){
      const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term="+accession+"[Accession]&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108"
      await axios.get(url).then( async (response) =>{
        const idlist = response.data.esearchresult.idlist;
        if( idlist.length !== 0){
          const id: string = idlist[0];
          await client.hget("pid:"+id,"status").then( (obj) =>{
            if(obj === "processing"){              
              status = "2";
            }else{
              client.hsetnx("pid:"+id,"status","processing");
              client.expire("pid:"+id,2000);
              status = "3";
              PythonShell.run('CreateGenome.py', {scriptPath: pythonScriptPath,args:[id]}, async (err,result) =>{
                if(err){
                  console.log("python_error",err)
                } 
              });
            }
          })
          .catch(error => {
            console.log("redis error",error);
          });          
          
        }
        else{
          status = "4";
        }
      })
      .catch(function (error){
        console.log("axios error",error)
      })
    }
    return [genome,status];
  }

  public async getByAssembly(assembly_accession: string,locus_start: string,locus_end: string): Promise<[Genome | null, string]>{
    assembly_accession = assembly_accession.toUpperCase();
    var genome: Genome| null = null;
    var status: string = "1";
    const esearchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&term=" +assembly_accession +"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
    await axios.get(esearchUrl).then(async (response) =>{
      const esearchIdList = response.data.esearchresult.idlist;
      if( esearchIdList.length !== 0){
        const esummaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&id="+esearchIdList[0]+"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
        await axios.get(esummaryUrl).then(async (response) =>{
          const bioprojectaccn = response.data.result[esearchIdList[0]].gb_bioprojects[0].bioprojectaccn;
          const biosampleaccn = response.data.result[esearchIdList[0]].biosampleaccn;
          const nuccoreSearchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term="+assembly_accession+"%20OR%20"+bioprojectaccn+"%20OR%20"+biosampleaccn+"%20AND%20"+locus_start+"%20AND%20"+locus_end+"&retmode=json";
          await axios.get(nuccoreSearchUrl).then(async (response)=>{
            const nuccoreIdList = response.data.esearchresult.idlist;
            if( nuccoreIdList.length !== 0){
              const genomeId = nuccoreIdList[0];
              genome = await this.genomeModel.getByGenomeId(genomeId);
              if(genome === null){
                await client.hget("pid:"+genomeId,"status").then( (obj) =>{
                  if(obj === "processing"){              
                    status = "2";
                  }else{
                    client.hsetnx("pid:"+genomeId,"status","processing");
                    client.expire("pid:"+genomeId,2000);
                    status = "3";
                    PythonShell.run('CreateGenome.py', {scriptPath: pythonScriptPath,args:[genomeId]}, async (err,result) =>{
                      if(err){
                        console.log("python_error",err)
                      } 
                    });
                  }
                })
                .catch(error => {
                  console.log("redis error",error);
                }); 
              }
            }else{
              status = "4";
            }
          });
        });
      }
      else{
        status = "4";
      }
    });
    
    //const genome = await this.genomeModel.getById(accession);
    //console.log("se retorno", genome);
    return [genome,status];
  }



  public async getByLocus(locus_tag: string): Promise<[Genome | null,string]>{
    const feature = await this.featureModel.getByLocus(locus_tag);
    var genome_accession: string = "null";
    var status: string = "1"; 
    if(feature === null){
      const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term="+locus_tag+"[Gene%20Name]&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108"
      await axios.get(url).then( async (response) =>{
        const idlist = response.data.esearchresult.idlist
        if( idlist.length !== 0){
          let id = idlist[0];
          await client.hget("pid:"+id,"status").then( (obj) =>{
            if(obj === "processing"){              
              status = "2";
            }else{
              client.hsetnx("pid:"+id,"status","processing");
              client.expire("pid:"+id,2000);
              status = "3";
              PythonShell.run('CreateGenome.py', {scriptPath: pythonScriptPath,args:[id]}, async (err,result) =>{
                if(err){
                  console.log("python_error",err)
                } 
              });
            }
          })
          .catch(error => {
            console.log("redis error",error);
          }); 
        }
        else{
          status = "4";
        }
      })
      .catch(function (error){
        console.log(error)
      })
    }else{
      genome_accession = feature.genome_accession;
    }
    const genome = await this.genomeModel.getById(genome_accession)
    return [genome,status]
    
  }

  public async getAssemblyInfo(id: string): Promise<AssemblyInfo | null>{
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=assembly&id="+id+"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
    id = id.toString();
    var assembly_info: AssemblyInfo = { }
    await axios.get(url).then( (response) =>{
      assembly_info = {
        submitter: response.data.result[id].submitterorganization,
        assembly_accession: response.data.result[id].assemblyaccession,
        latest_assembly_accession: response.data.result[id].latestaccession,
        taxid: response.data.result[id].taxid,
        specie: response.data.result[id].speciesname,
        specieTaxId: response.data.result[id].speciestaxid,
        ftp_rpt: response.data.result[id].ftppath_assembly_rpt
      }
    })
    .catch(function (error){
      console.log(error)
    })

    return assembly_info;
  }

  public async getBioprojectInfo(id: string): Promise<BioprojectInfo| null>{
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=bioproject&id="+id+"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
    id = id.toString();
    var bioproject_info: BioprojectInfo = { }
    await axios.get(url).then( (response) =>{
      bioproject_info = {
        project_accession: response.data.result[id].project_acc,
        project_type: response.data.result[id].project_type,
        project_target_scope: response.data.result[id].project_target_scope,
        project_target_material: response.data.result[id].project_target_material,
        registration_date: response.data.result[id].registration_date,
        project_name: response.data.result[id].project_name,
        project_title: response.data.result[id].project_title,
        project_description: response.data.result[id].project_description,
        relevance_agricultural: response.data.result[id].relevance_agricultural,
        relevance_medical: response.data.result[id].relevance_medical,
        relevance_industrial: response.data.result[id].relevance_industrial,
        relevance_environmental: response.data.result[id].relevance_environmental,
        relevance_evolution: response.data.result[id].relevance_evolution,
        relevance_model: response.data.result[id].relevance_model,
        relevance_other: response.data.result[id].relevance_other,
        organism_name: response.data.result[id].organism_name,
        organism_strain: response.data.result[id].organism_strain,
        organism_label: response.data.result[id].organism_label,
        sequencing_status: response.data.result[id].sequencing_status,
        submitter: response.data.result[id].submitter_organization,
        supergroup: response.data.result[id].supergroup
      }
    })
    .catch(function (error){
      console.log(error)
    })

    return bioproject_info;
  }

  public async getBiosampleInfo(id: string): Promise<BiosampleInfo | null>{
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=biosample&id="+id+"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
    id = id.toString();
    var biosample_info: BiosampleInfo = { }
    await axios.get(url).then( (response) =>{
      biosample_info = {
        title: response.data.result[id].title,
        accession: response.data.result[id].accession,
        publication_date: response.data.result[id].publicationdate,
        organization: response.data.result[id].organization,
        organism: response.data.result[id].organism
      }
    })
    .catch(function (error){
      console.log(error)
    })

    return biosample_info;
  }

  public async getPubmedInfo(ids: string[]): Promise<PubmedInfo[] | null>{
    var pubmed_info: PubmedInfo[] = [];
    for(let id of ids){ 
      const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id="+id+"&retmode=json&api_key=ec62fbc09b4e1233a5b65bced86579b1d108";
      id = id.toString();
      var pubmed_summary: PubmedInfo = { }
      await axios.get(url).then( (response) =>{
        pubmed_summary = {
          pub_date: response.data.result[id].pubdate,
          source: response.data.result[id].source,
          title: response.data.result[id].title,
          issn: response.data.result[id].issn,
          essn: response.data.result[id].essn,
          pub_type: response.data.result[id].pubtype[0],
          record_status: response.data.result[id].recordstatus
        }
        pubmed_info.push(pubmed_summary)
      })
      .catch(function (error){
        console.log(error)
      })
    }
    return pubmed_info;
  }
  
}
