import fastify from 'fastify';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();
// Fastify will execute following the order of the routes
app.register(transactionsRoutes, {
  prefix: '/transactions',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333');
  });
