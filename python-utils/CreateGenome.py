import re
import os
import sys
import requests
from pymongo import MongoClient
from pymongo import errors
import redis
from dotenv import load_dotenv

load_dotenv()


connection = MongoClient(os.getenv('MONGODB_URI'))
db = connection['ncbi']
genomesCollection = db['genomes']
featuresCollection = db['features']

redisClient = redis.Redis(host=os.getenv('REDIS_HOST'),port=os.getenv('REDIS_PORT'),password=os.getenv('REDIS_PASSWORD'))

class ExportClass():
    def __init__(self, genome_id):
        self.__re_extract_text = re.compile(r'\s+(?P<text>.*)')
        self.__re_extract_assembly = re.compile(r'(?P<assembly>^GCF_\d*\.\d*)')
        self.__re_extract_submitter = re.compile(r'(?P<submitter>[^\t]*)\tGCA')
        self.__re_extract_accession = re.compile(r'^ACCESSION\s+(?P<accession>[a-zA-Z0-9\_]+)\s+')
        self.__re_extract_locus = re.compile(r'^LOCUS\s*(?P<locus>[A-Z0-9_-a-z]*)\s*')
        self.__re_extract_version = re.compile(r'VERSION\s*(?P<version>[A-Za-z0-9_.]*)\s*')
        self.__re_extract_definition = re.compile(r'^DEFINITION\s*(?P<definition>.*)')
        self.__re_extract_gene_location = re.compile(r'\s*gene\s*[A-Za-z(<>]*(?P<gene_location>\d+<*\.+>*\d+)')
        self.__re_extract_cds = re.compile(r'\s*CDS\s*')
        self.__re_extract_locus_tag = re.compile(r'/locus_tag=\"(?P<locus_tag>.*)\"')
        self.__re_extract_name = re.compile(r'/gene=\"(?P<gene_name>.*)\"')
        self.__re_extract_inference = re.compile(r'/inference=\"(?P<inference>.*)\"')
        self.__re_extract_product = re.compile(r'/product=\"(?P<product>.*)\"*')
        self.__re_extract_translation = re.compile(r'/translation=\"(?P<translation>[A-Z]*)\s*')
        self.__re_extract_middle_translation = re.compile(r'\s*(?P<m_translation>[A-Z]*)\s*')
        self.__re_extract_end_translation = re.compile(r'(?P<end>[A-Z]*)\"\s*')
        self.__re_detect_key = re.compile(r'\s{5}(?P<key>[a-zA-Z0-9\_]+)')
        self.__re_extract_location = re.compile(r'^\s{5}(?P<key>[a-zA-Z0-9\'\_]+)\s+(?P<location>[a-zA-Z\(\)\<\>]*[\<\>\.\^,\)\(\d]+(\^|,|\.|\<|\>)(?P<last_location>\d+)[, \)\(\<\>]*)')
        self.__re_detect_single_location = re.compile(r'^\s{5}(?P<key>[a-zA-Z0-9\'\_]+)\s+(?P<location>\d+)$')
        self.__re_detect_end_comma = re.compile(r'.*\,$')
        self.__re_detect_end_quot = re.compile(r'.*\"$')
        #self.__re_extract_location_cont = re.compile(r'\s{21}(?P<location>\d+[\.\^\(\)\d,]+(\^|,|\.|\<|\>)(?P<last_location>\d+)(?P<last_symbol>[, \)\(\<\>]*))')
        self.__re_extract_location_cont = re.compile(r'^\s{21}(?P<location>.*(?P<last_symbol>[, \)\(\<\>\d]$))')
        self.__re_extract_location_single_end = re.compile(r'^\s{21}(?P<location>\d+[\.\^\(\)\d,]+(?P<last_symbol>[, \)\(\<\>]*))')
        self.__re_extract_property = re.compile(r'^\s{21}\/(?P<property>[a-zA-Z0-9\_\-]+)\=\"(?P<value>[^\n]*)(\"*)$')
        self.__re_extract_end_property = re.compile(r'^\s{21}(?P<end>[^\/\n]*)(\"*)$')
        self.__re_detect_end = re.compile(r'^ORIGIN\s*')
        self.__re_extract_dblink = re.compile(r'^DBLINK\s+(?P<type>.*):\s*(?P<link>[^\,\n]+)')
        self.__re_detect_keywords = re.compile(r'^KEYWORDS(.*)')
        self.__re_extract_dblinks = re.compile(r'^\s+(?P<type>.*):\s*(?P<link>[^\,\n]+)')
        self.genome_id = str(genome_id)
        self.__re_extract_pubmed = re.compile(r'\s{3}PUBMED\s+(?P<pubmedId>[^\n]+)')
        


    def run(self):
        ids_counter = 0
        accessionC = ""
        propertyValue = ""
        locus = ""
        key = ""
        version = ""
        locus_tag = ""
        inference = ""
        translation = ""
        definition = ""
        location = ""
        locus_tag = ""
        product = ""
        sizeB = 0
        name = "genome_" + str(self.genome_id) + ".txt"
        idUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id={self.genome_id}&rettype=gbwithparts&retmode=text&api_key=ec62fbc09b4e1233a5b65bced86579b1d108'
        id_request = requests.get(idUrl,allow_redirects=True)
        try:
            open(name, 'wb').write(id_request.content)
        except Exception as e:
                print(f'An exception ocurred at id: {self.genome_id}::',e)
                return
        with open(name,'r') as genome_data_file:
            property = ""
            genome = {'features': [], "gId": self.genome_id}
            feature = {}
            pubmedIds = []
            pubmedIdsReady = False
            in_def = False
            in_dblink = False
            in_location = False
            for genome_line in genome_data_file:   
                accessionMatch = self.__re_extract_accession.search(genome_line)
                definitionMatch = self.__re_extract_definition.search(genome_line)
                dblinkMatch = self.__re_extract_dblink.search(genome_line)
                keywordsMatch = self.__re_detect_keywords.search(genome_line)
                pubmedMatch = self.__re_extract_pubmed.search(genome_line)

                if pubmedMatch:
                    pubmedIds.append(pubmedMatch.group('pubmedId'))

                if in_def:
                    if accessionMatch:
                        genome["definition"] = definition
                        accessionC = accessionMatch.group('accession')
                        genome["_id"] = accessionC
                        in_def = False
                        continue
                    else:
                        textMatch = self.__re_extract_text.search(genome_line)
                        definition+= textMatch.group('text')
                        continue
                if keywordsMatch:
                    in_dblink = False
                    continue

                if in_dblink:
                    dblinksMatch = self.__re_extract_dblinks.search(genome_line)
                    linkType = dblinksMatch.group('type')
                    link = dblinksMatch.group('link')
                    if dblinksMatch:
                        if(linkType == "Assembly"):
                            linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&term={link}&retmode=json'
                            linkRequest = requests.get(url= linkUrl)
                            linkRequestContent = linkRequest.json()
                            linkId = linkRequestContent['esearchresult']['idlist'][0]
                            genome["assembly_link"] = linkId
                            continue
                        elif(linkType == "BioProject"):
                            linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=bioproject&term={link}&retmode=json'
                            linkRequest = requests.get(url= linkUrl)
                            linkRequestContent = linkRequest.json()
                            linkId = linkRequestContent['esearchresult']['idlist'][0]
                            genome["bioproject_link"] = linkId
                            continue
                        elif(linkType == "BioSample"):
                            linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term={link}&retmode=json'
                            linkRequest = requests.get(url= linkUrl)
                            linkRequestContent = linkRequest.json()
                            linkId = linkRequestContent['esearchresult']['idlist'][0]
                            genome["biosample_link"] = linkId
                            continue

                if definitionMatch:
                    definition = definitionMatch.group('definition')
                    in_def = True
                    continue

                if dblinkMatch:
                    link = dblinkMatch.group('link')
                    linkType = dblinkMatch.group('type')
                    if(linkType == "Assembly"):
                        linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=assembly&term={link}&retmode=json'
                        linkRequest = requests.get(url= linkUrl)
                        linkRequestContent = linkRequest.json()
                        linkId = linkRequestContent['esearchresult']['idlist'][0]
                        genome["assembly_link"] = linkId
                        in_dblink = True
                        continue
                    elif(linkType == "BioProject"):
                        linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=bioproject&term={link}&retmode=json'
                        linkRequest = requests.get(url= linkUrl)
                        linkRequestContent = linkRequest.json()
                        linkId = linkRequestContent['esearchresult']['idlist'][0]
                        genome["bioproject_link"] = linkId
                        in_dblink = True
                        continue
                    elif(linkType == "BioSample"):
                        linkUrl = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=biosample&term={link}&retmode=json'
                        linkRequest = requests.get(url= linkUrl)
                        linkRequestContent = linkRequest.json()
                        linkId = linkRequestContent['esearchresult']['idlist'][0]
                        genome["biosample_link"] = linkId
                        in_dblink = True
                        continue
                    else:
                        in_dblink = True
                        continue
    
                if in_location:
                    locationMatch = self.__re_extract_location_cont.search(genome_line)
                    if locationMatch:
                        location+= locationMatch.group('location')
                        if locationMatch.group('last_symbol') != ",":
                            feature["key"] = key 
                            feature["location"] = location
                            in_location = False
                            continue
                        continue
                    else:
                        locationMatch = self.__re_extract_location_single_end.search(genome_line)
                        if locationMatch:
                            location+= locationMatch.group('location')
                            if locationMatch.group('last_symbol') != ",":
                                feature["key"] = key 
                                feature["location"] = location
                                in_location = False
                                continue
                            continue

                locationMatch = self.__re_extract_location.search(genome_line)
                if locationMatch:
                    if not pubmedIdsReady:
                        genome["pubmedIds"] = pubmedIds
                        pubmedIdsReady = True
                    if key != "":
                        try:
                            feature["genome_accession"] = accessionC
                            feature_id = featuresCollection.insert_one(feature)
                        except Exception as e:
                            print(f'An exception ocurred at feature, accesion: {accessionC}::',e)
                        genome["features"].append(feature_id.inserted_id)
                        feature = {}
                    key = locationMatch.group('key')
                    commaEnd = self.__re_detect_end_comma.search(genome_line)
                    if commaEnd:
                        location = locationMatch.group('location')
                        in_location = True
                    else:
                        location = locationMatch.group('location')
                        feature["key"] = key 
                        feature["location"] = location
                        in_location = False
                else:
                    locationMatch = self.__re_detect_single_location.search(genome_line)
                    if locationMatch:
                        if key != "":
                            try:
                                feature["genome_accession"] = accessionC
                                feature_id = featuresCollection.insert_one(feature)
                            except Exception as e:
                                print(f'An exception ocurred at feature, accesion: {accessionC}::',e)
                            genome["features"].append(feature_id.inserted_id)
                            feature = {}
                        key = locationMatch.group('key')
                        location = locationMatch.group('location')
                        feature["key"] = key
                        feature["location"] = location
                        in_location = False
                        continue
                    else:
                        endMatch = self.__re_detect_end.search(genome_line)
                        if endMatch:
                            if key != "":
                                try:
                                    feature["genome_accession"] = accessionC
                                    feature_id = featuresCollection.insert_one(feature)
                                except Exception as e:
                                    print(f'An exception ocurred at feature, accesion: {accessionC}::',e)
                                genome["features"].append(feature_id.inserted_id)
                                feature = {}
                            break
                        propertyMatch = self.__re_extract_property.search(genome_line)
                        if propertyMatch:
                            property = propertyMatch.group('property')
                            value = propertyMatch.group('value')
                            if property == "gene" or property == "locus_tag" or property == "translation" or property == "product" or property == "mobile_element_type":
                                quotMatch = self.__re_detect_end_quot.search(value)
                                if quotMatch:
                                    feature[property] = value[:-1]

                        else:
                            if property != "":
                                propertyMatch = self.__re_extract_end_property.search(genome_line)
                                if propertyMatch:
                                    if property == "gene" or property == "locus_tag" or property == "translation" or property == "product" or property == "mobile_element_type":
                                        value += "\n" +propertyMatch.group('end')
                                        quotMatch = self.__re_detect_end_quot.search(value)
                                        if quotMatch:
                                            feature[property] = value[:-1] 
            try:
                genomesCollection.insert_one(genome)
                redisClient.delete("id:"+self.genome_id)
            except Exception as e:
                print(f'An exception ocurred at {accessionC}::',e)
        os.remove(name)
            


if __name__ == '__main__':
    try:
        agent = ExportClass(sys.argv[1])
        agent.run()
    except Exception as excep:
        print(excep)