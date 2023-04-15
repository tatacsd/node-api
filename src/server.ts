import fastify from 'fastify';

const app = fastify();

app.get('/', async (request, reply) => {
  return { msg: 'world' };
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333');
  });
