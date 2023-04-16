import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/', async (request, reply) => {
  const test = await knex('sqlite_schema').select('*');
  return test;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333');
  });
