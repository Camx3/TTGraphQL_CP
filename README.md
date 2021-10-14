This project uses the tools provided by Entrez Utilities API, whose usage guidelines can be found at the following link: https://www.ncbi.nlm.nih.gov/books/NBK25497/#chapter2.Usage_Guidelines_and_Requiremen .

Disclaimer: https://www.ncbi.nlm.nih.gov/home/about/policies/

#### Technologies used

- NodeJS and TypeScript
- GraphQL with Apollo Server and Type GraphQL
- MongoDB Database integrated with Mongoose/TypeGoose
- Jest for testing
- Docker 

## Folder structure

#### Overview

```
.
├── src                        
│   ├── bootstrap              # Bootstrapping and loading of the API dependencies (Express, Apollo, Database, ...)
│   ├── entities               # Used to generate typing, schemas and ORM models
│   ├── modules                # Business logic of the app divided by domain 
│   ├── tests                  # Testing strategies and snapshots
│   ├── utils                  # Collection of utils function that we use in the project
│   ├── config.ts              # Config of the app, sourced by environment variables
│   └── index.ts               # Entry point of the API
│
├── jest-mongodb-config.js     
├── jest.config.js             # Jest configuration
├── docker-compose.yml         # Docker compose configuration 
├── .env.example               # Example of what your .env file should look like
├── .gitignore                 # Standard gitignore file
├── package.json               # Node module dependencies
├── README.md                  # Simple readme file
└── tsconfig.json              # TypeScript compiler options
```

#### Module example (Domain)

```
.
├── src
│   └── modules
│       └── user               # Module name
│           ├── input.ts       # Input validation for mutations and queries using class-validator
│           ├── model.ts       # Database model
│           ├── resolver.ts    # GraphQL revolver
│           └── service.ts     # Business logic of your app
```

## How to use

- Duplicate the `.env.example` file and rename it `.env`
- Run `npm install`

#### Start mongoDB with docker-compose

- Make sure you have docker installed on your machine
- Run `docker-compose up` to start the containers
- Run `docker-compose down` to remove the running containers

#### Start server for development

- Run `npm run start:dev`

#### Build server

- Run `npm run build`

#### Start server for production

- Run `npm start`

#### Run integration tests

- Run 'npm test'

> Integration tests are done with Jest, Apollo Server Testing and MongoDB Memory Server. This way every test are testing our entire logic with every graphQL request, from our resolvers to our models!

#### Access to the GraphQL Playground (Dev only)

- `http://localhost:4002/graphql`
