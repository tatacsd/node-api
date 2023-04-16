import 'dotenv/config';
import { Knex, knex as setupKnex } from 'knex';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true, // all empty values will be null
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = setupKnex(config);
