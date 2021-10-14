import dotenv from "dotenv";
dotenv.config();

// Safely get the environment variable in the process
const env = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

export interface Config {
  port: number;
  graphqlPath: string;
  isDev: boolean;
  mongoDB: {
    uri: string;
    username: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
}

// All your secrets, keys go here
export const config: Config = {
  port: +env("PORT"),
  graphqlPath: env("GRAPHQL_PATH"),
  isDev: env("NODE_ENV") === "development",
  mongoDB: {
    uri: env("MONGODB_URI"),
    username: env("MONGODB_USER"),
    password: env("MONGODB_PASSWORD"),
  },
  redis: {
    port: +env("REDIS_PORT"),
    host: env("REDIS_HOST"),
    password: env("REDIS_PASSWORD"),
  },
};
