import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { knex } from '../database';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const transactions = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'Test transaction',
        amount: 1000,
      })
      .returning('*');

    const selectQuery = knex('transactions')
      .where('amount', '>', 500)
      .select('*');

    return selectQuery;
  });
}
