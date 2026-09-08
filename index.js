// src/index.js

import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import db from './src/database/db.js'
import { userRoutes } from './src/routes/user.routes.js'
import { courseRoutes } from './src/routes/course.routes.js'
import { historyRoutes } from './src/routes/history.routes.js'
import { paymentRoutes } from './src/routes/payment.routes.js'

dotenv.config()
console.log('MP_ACCESS_TOKEN prefix:', process.env.MP_ACCESS_TOKEN?.slice(0, 15))
console.log('MP_ACCESS_TOKEN length:', process.env.MP_ACCESS_TOKEN?.length)

const fastify = Fastify({ logger: true })

// Domínios que podem chamar essa API — mais seguro que origin: true em produção
const ALLOWED_ORIGINS = [
  'https://www.portalcnhfacil.com',
  'https://portalcnhfacil.com',
  'http://localhost:3000', // dev local do frontend
]

// CORS — precisa ser registrado ANTES das rotas
await fastify.register(cors, {
  origin: (origin, callback) => {
    // requisições sem "origin" (ex: curl, Postman, webhook do MP) são liberadas
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
      return
    }
    fastify.log.warn(`Origem bloqueada pelo CORS: ${origin}`)
    callback(new Error('Not allowed by CORS'), false)
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-secret'],
})

// Log de toda requisição recebida — útil pra confirmar se o preflight
// está chegando no servidor. Pode remover depois que resolver o problema.
fastify.addHook('onRequest', async (req) => {
  fastify.log.info(`${req.method} ${req.url} — origin: ${req.headers.origin || 'sem origin'}`)
})

/* =====================================
   Error Handler Global
===================================== */

fastify.setErrorHandler((error, request, reply) => {

  fastify.log.error(error)

  return reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || 'Erro interno do servidor'
  })
})

// Rotas
fastify.register(userRoutes, { prefix: '/api' })
fastify.register(courseRoutes, { prefix: '/api' })
fastify.register(historyRoutes, { prefix: '/api' })
fastify.register(paymentRoutes, { prefix: '/api' })

// Conexão com MongoDB e start do servidor
const start = async () => {
  try {
    await db()

    await fastify.listen({ port: process.env.PORT || 4000, host: '0.0.0.0' })
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()