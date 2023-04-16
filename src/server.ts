import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database';
import { env } from './env';

const app = fastify();

app.get('/', async (request, reply) => {
  const transactions = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Test transaction',
      amount: 1000,
    })
    .returning('*');

  const selectQuery = knex('transactions')
    .where('amount', '<', 500)
    .select('*');

  return selectQuery;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333');
  });
