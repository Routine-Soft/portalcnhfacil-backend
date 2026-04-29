// // src/routes/payment.routes.js

// import { AbacatePay } from '@abacatepay/sdk'

// const abacate = AbacatePay({ secret: process.env.ABACATEPAY_API_KEY })

// export async function paymentRoutes(fastify) {

//   // POST /api/payments/checkout
//   // Body: { name: "Curso MOPP", price: 199.90 }
//   fastify.post('/payments/checkout', async (req, reply) => {
//     const { name, price } = req.body

//     if (!name || !price) {
//       return reply.status(400).send({ message: 'name e price são obrigatórios.' })
//     }

//     // Passo 1 — cria o produto (retorna direto o objeto, sem .data)
//     const product = await abacate.products.create({
//       externalId: `course_${Date.now()}`,
//       name:       name,
//       price:      Math.round(Number(price) * 100), // centavos
//       currency:   'BRL',
//     })

//     // Passo 2 — cria o checkout (retorna direto o objeto, sem .data)
//     const checkout = await abacate.checkouts.create({
//       items:         [{ id: product.id, quantity: 1 }],
//       methods:       ['PIX', 'CARD'],
//       returnUrl:     `${process.env.APP_URL}/cursos`,
//       completionUrl: `${process.env.APP_URL}/pagamento/sucesso`,
//     })

//     return reply.status(201).send({
//       url: checkout.url,
//       id:  checkout.id,
//     })
//   })

//   // Webhook — AbacatePay chama aqui quando o pagamento é confirmado
//   fastify.post('/payments/webhook', async (req, reply) => {
//     const { event, data } = req.body
//     console.log(`📩 Webhook — evento: ${event}`, data)
//     return reply.send({ received: true })
//   })

// }

// src/routes/payment.routes.js

import { AbacatePay } from '@abacatepay/sdk'
import { History } from '../models/History.model.js'

const abacate = AbacatePay({
  secret: process.env.ABACATEPAY_API_KEY,
})

export async function paymentRoutes(fastify) {

  fastify.post('/payments/checkout', async (req, reply) => {

    const { productId, name } = req.body

    if (!productId) {
      return reply.status(400).send({
        message: 'productId é obrigatório.',
      })
    }

    try {

      // usa produto existente
      const checkout = await abacate.checkouts.create({
        items: [
          {
            id: productId,
            quantity: 1,
          }
        ],

        methods: ['PIX', 'CARD'],

        returnUrl: `${process.env.APP_URL}/cursos`,

        completionUrl: `${process.env.APP_URL}/pagamento/sucesso`,

        metadata: {
          courseName: name || 'curso',
        }
      })

      // salva purchase pending
      await History.create({

        titulo: name,

        // aluno: user?.nome || 'Aluno',

        preco: 199.90,

        // user_id: user?.id,

        product_id: productId,

        checkout_id: checkout.id,

        status: 'pending'

      })

      return reply.status(201).send({
        url: checkout.url,
        id: checkout.id,
      })

    } catch (error) {

      console.error('Erro checkout:', error)

      return reply.status(500).send({
        message: 'Erro ao criar checkout',
      })
    }

  })


  fastify.post('/payments/webhook', async (req, reply) => {

    try {

      const { event, data } = req.body

      console.log('📩 Webhook recebido:', event)

      if (event === 'checkout.paid') {

        const checkoutId = data.id

        console.log('💰 Pagamento confirmado:', checkoutId)

        // atualiza purchase
        await History.findOneAndUpdate(

          { checkout_id: checkoutId },

          {
            status: 'paid',
            paid_at: new Date()
          }

        )

      }

      return reply.send({ received: true })

    } catch (error) {

      console.error('Erro webhook:', error)

      return reply.status(500).send({
        message: 'Erro ao processar webhook'
      })

    }

  })

}