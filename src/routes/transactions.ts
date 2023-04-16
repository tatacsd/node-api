import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function transactionsRoutes(app: FastifyInstance) {
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
}
