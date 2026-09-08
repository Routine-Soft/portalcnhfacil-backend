// src/routes/payment.routes.js

import crypto from 'node:crypto'
import { Preference } from 'mercadopago'
import { mpClient } from '../config/mercadopago.js'
import { History } from '../models/History.model.js'

export async function paymentRoutes(fastify) {

  fastify.post('/payments/checkout', async (req, reply) => {

    const { productId, name, price, user } = req.body

    if (!name || !price) {
      return reply.status(400).send({
        message: 'name e price são obrigatórios.',
      })
    }

    try {
      const preference = new Preference(mpClient)

      // external_reference é o que vamos usar no webhook pra
      // encontrar o registro no History (equivalente ao checkout_id do AbacatePay)
      const externalReference = crypto.randomUUID()

      const result = await preference.create({
        body: {
          items: [
            {
              id: productId || externalReference,
              title: name,
              description: `Curso: ${name}`,
              quantity: 1,
              unit_price: Number(price),
              currency_id: 'BRL',
            },
          ],
          back_urls: {
            success: `${process.env.APP_URL}/pagamento/sucesso`,
            failure: `${process.env.APP_URL}/cursos`,
            pending: `${process.env.APP_URL}/cursos`,
          },
          auto_return: 'approved',
          notification_url: `${process.env.APP_URL_BACKEND || process.env.APP_URL}/api/payments/webhook`,
          external_reference: externalReference,
          metadata: {
            course_name: name,
            product_id: productId || null,
          },
        },
      })

      // salva purchase pending
      await History.create({
        titulo: name,
        preco: Number(price),
        product_id: productId || null,
        checkout_id: externalReference,
        status: 'pending',
        user: user || null,
        created_at: new Date(),
      })

      return reply.status(201).send({
        url: result.init_point,
        id: externalReference,
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
      // ── Validação de assinatura (recomendado pelo MP) ──────────────────
      const xSignature = req.headers['x-signature']
      const xRequestId = req.headers['x-request-id']
      const dataId = req.query['data.id'] || req.body?.data?.id

      if (process.env.MP_WEBHOOK_SECRET && xSignature) {
        const parts = Object.fromEntries(
          xSignature.split(',').map(p => p.trim().split('=').map(s => s.trim()))
        )
        const ts = parts.ts
        const hash = parts.v1

        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
        const expectedHash = crypto
          .createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
          .update(manifest)
          .digest('hex')

        if (expectedHash !== hash) {
          console.log('⚠️ Assinatura de webhook inválida')
          return reply.status(401).send({ message: 'Webhook inválido' })
        }
      }

      const { type, action } = req.body
      console.log('📩 Webhook recebido:', type || action)
      console.log(JSON.stringify(req.body, null, 2))

      // O MP notifica por "type: payment" — precisamos consultar o pagamento
      // pra saber o external_reference e o status
      if (type === 'payment') {
        const paymentId = req.body.data?.id

        const paymentResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
          }
        )
        const payment = await paymentResponse.json()

        console.log('💰 Status do pagamento:', payment.status)

        const externalReference = payment.external_reference

        const history = await History.findOne({
          checkout_id: externalReference,
        })

        if (!history) {
          console.log('⚠️ Histórico não encontrado')
          return reply.send({ received: true })
        }

        // status do MP: pending | approved | authorized | in_process | rejected | cancelled | refunded | charged_back
        if (payment.status === 'approved') {
          history.status = 'paid'
          history.paid_at = new Date()
        } else if (['rejected', 'cancelled'].includes(payment.status)) {
          history.status = 'failed'
        } else {
          history.status = payment.status
        }

        history.gateway_response = payment
        await history.save()

        console.log('✅ Histórico atualizado:', history.status)
      }

      return reply.send({ received: true })

    } catch (error) {
      console.error('Erro webhook:', error)
      return reply.status(500).send({
        message: 'Erro ao processar webhook',
      })
    }

  })

}