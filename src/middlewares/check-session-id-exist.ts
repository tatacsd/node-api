import { FastifyReply, FastifyRequest } from 'fastify';

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.session_id;
  if (!sessionId) {
    return reply.status(401).send({
      message: 'Unauthorized',
    });
  }
}
