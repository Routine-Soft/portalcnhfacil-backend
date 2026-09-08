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

const fastify = Fastify({ logger: true })

// CORS — precisa ser registrado ANTES das rotas
await fastify.register(cors, {            // 👈
  origin: true,                           // libera qualquer origem (em prod troca pelo domínio)
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3000}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()