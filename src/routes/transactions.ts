import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExist } from '../middlewares/check-session-id-exist';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExist],
    },
    async (req, reply) => {
      const { sessionId } = req.cookies;

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*');
      return {
        transactions,
      };
    }
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });
      // Validate the request params
      const { id } = getTransactionParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;

      // Get the transaction
      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first();
      if (!transaction) {
        return reply.status(404).send();
      }
      return {
        transaction,
      };
    }
  );

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionID = request.cookies.session_id;
    if (!sessionID) {
      sessionID = randomUUID();
      // Save the cookie for the session_id
      reply.setCookie('session_id', sessionID, {
        path: '/', //  available on all routes
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    // Create a transaction
    await knex('transactions').insert({
      id: randomUUID(),
      title: title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionID,
    });

    return reply.status(201).send();
  });

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first();

      return {
        summary,
      };
    }
  );
}
