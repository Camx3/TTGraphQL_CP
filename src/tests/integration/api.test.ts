import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";
import { buildSchema } from "../../utils";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

import { resolvers } from "../../modules";
import { TodoMongooseModel } from "../../modules/todo/model";
import GenomeModel, { GenomeMongooseModel } from "../../modules/genome/model";
import { FeatureMongooseModel } from "../../modules/feature/model";

import {
  connect,
  clearDatabase,
  closeDatabase,
  populateDatabase,
} from "../utils";
import { config } from "../../config";
import * as redis from 'redis';

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
  });
beforeAll(async () => connect());

// You can populate de DB before each test
beforeEach(async () => {
  //redisClient.flushall();
  await populateDatabase(GenomeMongooseModel, [
    {
      _id: 'NW_007931121',
      features: [
        
        new ObjectId("6140dd824bcf4c451d972bce"),
        new ObjectId("6140dd824bcf4c451d972bcf"),
        new ObjectId("6140dd824bcf4c451d972bd0"),
        new ObjectId("6140dd824bcf4c451d972bd1"),
        new ObjectId("6140dd824bcf4c451d972bd2"),
        new ObjectId("6140dd824bcf4c451d972bd3"),
        new ObjectId("6140dd824bcf4c451d972bd4"),
        new ObjectId("6140dd824bcf4c451d972bd5"),
        new ObjectId("6140dd824bcf4c451d972bd6"),
        new ObjectId("6140dd824bcf4c451d972bd7"),
        new ObjectId("6140dd824bcf4c451d972bd8"),
        new ObjectId("6140dd834bcf4c451d972bd9"),
        new ObjectId("6140dd834bcf4c451d972bda"),
        new ObjectId("6140dd834bcf4c451d972bdb"),
        new ObjectId("6140dd834bcf4c451d972bdc"),
        new ObjectId("6140dd834bcf4c451d972bdd"),
        new ObjectId("6140dd834bcf4c451d972bde"),
        new ObjectId("6140dd834bcf4c451d972bdf"),
        new ObjectId("6140dd834bcf4c451d972be0"),
        new ObjectId("6140dd834bcf4c451d972be1"),
        new ObjectId("6140dd834bcf4c451d972be2"),
        new ObjectId("6140dd834bcf4c451d972be3"),
        new ObjectId("6140dd834bcf4c451d972be4"),
        new ObjectId("6140dd834bcf4c451d972be5"),
        new ObjectId("6140dd834bcf4c451d972be6"),
        new ObjectId("6140dd834bcf4c451d972be7"),
        new ObjectId("6140dd834bcf4c451d972be8"),
        new ObjectId("6140dd844bcf4c451d972be9"),
        new ObjectId("6140dd844bcf4c451d972bea"),
        new ObjectId("6140dd844bcf4c451d972beb"),
        new ObjectId("6140dd844bcf4c451d972bec"),
        new ObjectId("6140dd844bcf4c451d972bed"),
        new ObjectId("6140dd844bcf4c451d972bee"),
        new ObjectId("6140dd844bcf4c451d972bef"),
        new ObjectId("6140dd844bcf4c451d972bf0"),
        new ObjectId("6140dd844bcf4c451d972bf1"),
        new ObjectId("6140dd844bcf4c451d972bf2"),
        new ObjectId("6140dd844bcf4c451d972bf3"),
        new ObjectId("6140dd844bcf4c451d972bf4"),
        new ObjectId("6140dd844bcf4c451d972bf5"),
        new ObjectId("6140dd844bcf4c451d972bf6"),
        new ObjectId("6140dd844bcf4c451d972bf7"),
        new ObjectId("6140dd844bcf4c451d972bf7"),
        new ObjectId("6140dd844bcf4c451d972bf8"),
        new ObjectId("6140dd854bcf4c451d972bf9"),
        new ObjectId("6140dd854bcf4c451d972bfa"),
        new ObjectId("6140dd854bcf4c451d972bfb"),
        new ObjectId("6140dd854bcf4c451d972bfc")
      ],
      gId: '669633252',
      definition: 'Drosophila melanogaster chromosome X; Y rDNA sequence.',
      bioproject_link: '164',
      biosample_link: '2803731',
      assembly_link: '202931',
      pubmedIds: [
        '26109357', '26109356',
        '25589440', '17569867',
        '17569856', '16110336',
        '12537574', '12537573',
        '12537572', '12537568',
        '10731132'
      ]
    },
    {
      _id: 'NW_007931106',
      features: [ new ObjectId("6140ddac4bcf4c451d972c0b") ],
      gId: '669633233',
      definition: 'Drosophila melanogaster chromosome X X3X4_mapped_Scaffold_14_D1732sequence.',
      bioproject_link: '164',
      biosample_link: '2803731',
      assembly_link: '202931',
      pubmedIds: [
        '26109357', '26109356',
        '25589440', '17569867',
        '17569856', '16110336',
        '12537574', '12537573',
        '12537572', '12537568',
        '10731132'
      ]
    },
  ]);
  await populateDatabase(FeatureMongooseModel,[
    {
      _id: new ObjectId("6140dd824bcf4c451d972bce"),
      key: 'source',
      location: '1..76973',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bcf"),
      key: 'gene',
      location: 'complement(<4492..>5312)',
      gene: '28SrRNA-Psi:CR45848',
      locus_tag: 'Dmel_CR45848',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd0"),
      key: 'rRNA',
      location: 'complement(<4492..>5312)',
      gene: '28SrRNA-Psi:CR45848',
      locus_tag: 'Dmel_CR45848',
      product: '28S ribosomal RNA pseudogene',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd1"),
      key: 'gene',
      location: '<16375..>16497',
      gene: '5.8SrRNA-Psi:CR45849',
      locus_tag: 'Dmel_CR45849',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd2"),
      key: 'rRNA',
      location: '<16375..>16497',
      gene: '5.8SrRNA-Psi:CR45849',
      locus_tag: 'Dmel_CR45849',
      product: '5.8S ribosomal RNA pseudogene',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd3"),
      key: 'gene',
      location: '16526..16555',
      gene: '2SrRNA-Psi:CR45850',
      locus_tag: 'Dmel_CR45850',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd4"),
      key: 'rRNA',
      location: '16526..16555',
      gene: '2SrRNA-Psi:CR45850',
      locus_tag: 'Dmel_CR45850',
      product: '2S ribosomal RNA pseudogene',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd5"),
      key: 'gene',
      location: '<16936..>22940',
      gene: '28SrRNA-Psi:CR40596',
      locus_tag: 'Dmel_CR40596',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd6"),
      key: 'rRNA',
      location: 'join(<16936..19585,22816..>22940)',
      gene: '28SrRNA-Psi:CR40596',
      locus_tag: 'Dmel_CR40596',
      product: '28S ribosomal RNA pseudogene',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd7"),
      key: 'gene',
      location: '<35941..>38740',
      gene: '28SrRNA-Psi:CR45851',
      locus_tag: 'Dmel_CR45851',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd824bcf4c451d972bd8"),
      key: 'rRNA',
      location: 'join(<35941..36403,37483..>38740)',
      gene: '28SrRNA-Psi:CR45851',
      locus_tag: 'Dmel_CR45851',
      product: '28S ribosomal RNA pseudogene',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bd9"),
      key: 'gene',
      location: '42623..49485',
      gene: 'pre-rRNA:CR45845',
      locus_tag: 'Dmel_CR45845',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bda"),
      key: 'precursor_RNA',
      location: '42623..49485',
      gene: 'pre-rRNA:CR45845',
      locus_tag: 'Dmel_CR45845',
      product: 'pre-ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bdb"),
      key: 'gene',
      location: '43484..45478',
      gene: '18SrRNA:CR41548',
      locus_tag: 'Dmel_CR41548',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bdc"),
      key: 'rRNA',
      location: '43484..45478',
      gene: '18SrRNA:CR41548',
      locus_tag: 'Dmel_CR41548',
      product: '18S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bdd"),
      key: 'gene',
      location: '46106..46174',
      gene: 'mir-10404-1',
      locus_tag: 'Dmel_CR46346',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bde"),
      key: 'precursor_RNA',
      location: '46106..46174',
      gene: 'mir-10404-1',
      locus_tag: 'Dmel_CR46346',
      product: 'mir-10404-1 precursor RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972bdf"),
      key: 'ncRNA',
      location: '46113..46134',
      gene: 'mir-10404-1',
      locus_tag: 'Dmel_CR46346',
      product: 'mir-10404-1-RA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be0"),
      key: 'ncRNA',
      location: '46146..46167',
      gene: 'mir-10404-1',
      locus_tag: 'Dmel_CR46346',
      product: 'mir-10404-1-RB',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be1"),
      key: 'gene',
      location: '<46205..>46327',
      gene: '5.8SrRNA:CR45852',
      locus_tag: 'Dmel_CR45852',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be2"),
      key: 'rRNA',
      location: '<46205..>46327',
      gene: '5.8SrRNA:CR45852',
      locus_tag: 'Dmel_CR45852',
      product: '5.8S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be3"),
      key: 'gene',
      location: '46356..46385',
      gene: '2SrRNA:CR45836',
      locus_tag: 'Dmel_CR45836',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be4"),
      key: 'rRNA',
      location: '46356..46385',
      gene: '2SrRNA:CR45836',
      locus_tag: 'Dmel_CR45836',
      product: '2S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be5"),
      key: 'gene',
      location: '<46771..>49485',
      gene: '28SrRNA:CR45837',
      locus_tag: 'Dmel_CR45837',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be6"),
      key: 'rRNA',
      location: '<46771..>49485',
      gene: '28SrRNA:CR45837',
      locus_tag: 'Dmel_CR45837',
      product: '28S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be7"),
      key: 'gene',
      location: '55104..59294',
      gene: 'pre-rRNA:CR45846',
      locus_tag: 'Dmel_CR45846',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd834bcf4c451d972be8"),
      key: 'precursor_RNA',
      location: '55104..59294',
      gene: 'pre-rRNA:CR45846',
      locus_tag: 'Dmel_CR45846',
      product: 'pre-ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972be9"),
      key: 'gene',
      location: '55965..57959',
      gene: '18SrRNA:CR45838',
      locus_tag: 'Dmel_CR45838',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bea"),
      key: 'rRNA',
      location: '55965..57959',
      gene: '18SrRNA:CR45838',
      locus_tag: 'Dmel_CR45838',
      product: '18S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972beb"),
      key: 'gene',
      location: '<58654..>58776',
      gene: '5.8SrRNA:CR45839',
      locus_tag: 'Dmel_CR45839',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bec"),
      key: 'rRNA',
      location: '<58654..>58776',
      gene: '5.8SrRNA:CR45839',
      locus_tag: 'Dmel_CR45839',
      product: '5.8S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bed"),
      key: 'gene',
      location: '58805..58834',
      gene: '2SrRNA:CR45840',
      locus_tag: 'Dmel_CR45840',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bee"),
      key: 'rRNA',
      location: '58805..58834',
      gene: '2SrRNA:CR45840',
      locus_tag: 'Dmel_CR45840',
      product: '2S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bef"),
      key: 'gene',
      location: '66807..74924',
      gene: 'pre-rRNA:CR45847',
      locus_tag: 'Dmel_CR45847',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf0"),
      key: 'precursor_RNA',
      location: '66807..74924',
      gene: 'pre-rRNA:CR45847',
      locus_tag: 'Dmel_CR45847',
      product: 'pre-ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf1"),
      key: 'gene',
      location: '67668..69662',
      gene: '18SrRNA:CR45841',
      locus_tag: 'Dmel_CR45841',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf2"),
      key: 'rRNA',
      location: '67668..69662',
      gene: '18SrRNA:CR45841',
      locus_tag: 'Dmel_CR45841',
      product: '18S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf3"),
      key: 'gene',
      location: '70290..70358',
      gene: 'mir-10404-2',
      locus_tag: 'Dmel_CR46347',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf4"),
      key: 'precursor_RNA',
      location: '70290..70358',
      gene: 'mir-10404-2',
      locus_tag: 'Dmel_CR46347',
      product: 'mir-10404-2 precursor RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf5"),
      key: 'ncRNA',
      location: '70297..70318',
      gene: 'mir-10404-2',
      locus_tag: 'Dmel_CR46347',
      product: 'mir-10404-2-RA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf6"),
      key: 'ncRNA',
      location: '70330..70351',
      gene: 'mir-10404-2',
      locus_tag: 'Dmel_CR46347',
      product: 'mir-10404-2-RB',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf7"),
      key: 'gene',
      location: '<70389..>70511',
      gene: '5.8SrRNA:CR45842',
      locus_tag: 'Dmel_CR45842',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd844bcf4c451d972bf8"),
      key: 'rRNA',
      location: '<70389..>70511',
      gene: '5.8SrRNA:CR45842',
      locus_tag: 'Dmel_CR45842',
      product: '5.8S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd854bcf4c451d972bf9"),
      key: 'gene',
      location: '70540..70569',
      gene: '2SrRNA:CR45843',
      locus_tag: 'Dmel_CR45843',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd854bcf4c451d972bfa"),
      key: 'rRNA',
      location: '70540..70569',
      gene: '2SrRNA:CR45843',
      locus_tag: 'Dmel_CR45843',
      product: '2S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd854bcf4c451d972bfb"),
      key: 'gene',
      location: '70955..74924',
      gene: '28SrRNA:CR45844',
      locus_tag: 'Dmel_CR45844',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140dd854bcf4c451d972bfc"),
      key: 'rRNA',
      location: '70955..74924',
      gene: '28SrRNA:CR45844',
      locus_tag: 'Dmel_CR45844',
      product: '28S ribosomal RNA',
      genome_accession: 'NW_007931121'
    },
    {
      _id: new ObjectId("6140ddac4bcf4c451d972c0b"),
      key: 'source',
      location: '1..27447',
      genome_accession: 'NW_007931106'
    },
  ])
});

afterEach(async () => {
  await clearDatabase();
  redisClient.flushall();
});

afterAll(async (done) => {
  await closeDatabase();
  redisClient.quit();
  done();
});

/**
 * Prompt test suite.
 */
describe("API test", () => {

  it(`should get a genome by accession`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      accession: "NW_007931121",
      locus_start: "Dmel_CR45849",
      locus_end: "Dmel_CR46346",
    };

    const GET_GENOME = gql`
      query getGenomebyAccession($accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAccession(accession: $accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a genome by assembly`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      assembly_accession: "GCF_000001215.4",
      locus_start: "Dmel_CR45849",
      locus_end: "Dmel_CR46346",
    };

    const GET_GENOME = gql`
      query getGenomebyAssembly($assembly_accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAssembly(assembly_accession: $assembly_accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a genome by locus`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      locus_tag: "Dmel_CR45849",
      lower_limit: 0,
      upper_limit: 0,
    };

    const GET_GENOME = gql`
      query getGenomebyLocus($locus_tag: String!, $lower_limit: Float!, $upper_limit: Float!) {
        getGenomebyLocus(locus_tag: $locus_tag, lower_limit: $lower_limit, upper_limit: $upper_limit ) {
          _id,
          assembly_info{
            assembly_accession,
            ftp_rpt,
            submitter,
            taxid,
          },
          bioproject_info{
            project_accession,
            project_description,
            project_name,project_title,
            project_target_material,
            project_type,
            submitter,
            supergroup,
          },
          biosample_info{
            accession,
            organism,
            publication_date,
            title,
          },
          definition,
          features{
            gene,
            key,
            location
            locus_tag
            product,
            translation,
          },
          gId,
          pubmed_info{
            pub_date,
            pub_type,
            source,
            title,
          },
        },
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a genome not found error using accession`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      accession: "NT_000",
      locus_start: "Dmel_CR45849",
      locus_end: "Dmel_CR46346",
    };

    const GET_GENOME = gql`
      query getGenomebyAccession($accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAccession(accession: $accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a genome not found error using assembly`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      assembly_accession: "GCF_000",
      locus_start: "Dmel_CR45849",
      locus_end: "Dmel_CR46346",
    };

    const GET_GENOME = gql`
      query getGenomebyAssembly($assembly_accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAssembly(assembly_accession: $assembly_accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });

  it(`should get a genome not found error using locus`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      locus_tag: "Dmel_CR",
      lower_limit: 0,
      upper_limit: 0,
    };

    const GET_GENOME = gql`
      query getGenomebyLocus($locus_tag: String!, $lower_limit: Float!, $upper_limit: Float!) {
        getGenomebyLocus(locus_tag: $locus_tag, lower_limit: $lower_limit, upper_limit: $upper_limit ) {
          _id,
          assembly_info{
            assembly_accession,
            ftp_rpt,
            submitter,
            taxid,
          },
          bioproject_info{
            project_accession,
            project_description,
            project_name,project_title,
            project_target_material,
            project_type,
            submitter,
            supergroup,
          },
          biosample_info{
            accession,
            organism,
            publication_date,
            title,
          },
          definition,
          features{
            gene,
            key,
            location
            locus_tag
            product,
            translation,
          },
          gId,
          pubmed_info{
            pub_date,
            pub_type,
            source,
            title,
          },
        },
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    expect(res).toMatchSnapshot();
  });
  
  it(`should get a genome not found in db but being processed error using accession`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      accession: "NW_024545295",
      locus_start: "",
      locus_end: "",
    };

    const GET_GENOME = gql`
      query getGenomebyAccession($accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAccession(accession: $accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    /*const res2 = await query({
      query: GET_GENOME,
      variables,
    })*/

    expect(res).toMatchSnapshot();
    //expect(res2).toMatchSnapshot("should get a genome is being processed error using accession");
  });

  it(`should get a genome not found in db but being processed error using assembly`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      assembly_accession: "GCF_900519145.1",
      locus_start: "UHO2_10164",
      locus_end: "",
    };

    const GET_GENOME = gql`
      query getGenomebyAssembly($assembly_accession: String!, $locus_start: String!, $locus_end: String!) {
        getGenomebyAssembly(assembly_accession: $assembly_accession, locus_start: $locus_start, locus_end: $locus_end ) {
          definition,
          _id,
          gId,
          pubmed_info{
            pub_date,
            source,
            title,
            pub_type
          },
          bioproject_info{
            project_accession,
            project_type,
            project_target_material,
            project_name,project_title,
            project_description,
            submitter,
            supergroup
          },
          biosample_info{
            title,
            accession,
            publication_date,
            organism,
            organism
          },
          assembly_info{
            submitter,
            ftp_rpt,
            assembly_accession,
            taxid
          },
          features{
            key,
            location,
            locus_tag,
            product,
            gene,
            translation,
          }
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });

    /*const res2 = await query({
      query: GET_GENOME,
      variables,
    });*/

    expect(res).toMatchSnapshot();
    //expect(res2).toMatchSnapshot("API test should get a genome is being processed error using accession");
  });

  it(`should get a genome not found in db but being processed error using locus`, async () => {
    // We build the schema
    const graphQLSchema = await buildSchema();

    // We create the Apollo Server
    const server = new ApolloServer({
      schema: graphQLSchema,
    }) as any;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const variables = {
      locus_tag: "UHO2_10164",
      lower_limit: 0,
      upper_limit: 0,
    };

    const GET_GENOME = gql`
      query getGenomebyLocus($locus_tag: String!, $lower_limit: Float!, $upper_limit: Float!) {
        getGenomebyLocus(locus_tag: $locus_tag, lower_limit: $lower_limit, upper_limit: $upper_limit ) {
          _id,
          assembly_info{
            assembly_accession,
            ftp_rpt,
            submitter,
            taxid,
          },
          bioproject_info{
            project_accession,
            project_description,
            project_name,project_title,
            project_target_material,
            project_type,
            submitter,
            supergroup,
          },
          biosample_info{
            accession,
            organism,
            publication_date,
            title,
          },
          definition,
          features{
            gene,
            key,
            location
            locus_tag
            product,
            translation,
          },
          gId,
          pubmed_info{
            pub_date,
            pub_type,
            source,
            title,
          },
        },
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_GENOME,
      variables,
    });
    /*const res2 = await query({
      query: GET_GENOME,
      variables,
    });*/

    expect(res).toMatchSnapshot();
    //expect(res2).toMatchSnapshot("should get a genome is being processed error using accession");
  });

});
