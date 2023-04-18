import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*');
    return {
      transactions,
    };
  });

  app.get('/:id', async (request, reply) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    // Validate the request params
    const { id } = getTransactionParamsSchema.parse(request.params);

    // Get the transaction
    const transaction = await knex('transactions').where('id', id).first();
    if (!transaction) {
      return reply.status(404).send();
    }
    return {
      transaction,
    };
  });

  app.post('/', async (request, reply) => {
    //    const { title, amount, type: credit or debit } = request.body;
    console.log(request.body);
    // Validate the request body
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    // Create a transaction
    await knex('transactions').insert({
      id: randomUUID(),
      title: title,
      amount: type === 'credit' ? amount : -amount,
    });

    return reply.status(201).send();
  });

  app.get('/summary', async (request, reply) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first();

    return {
      summary,
    };
  });
}
