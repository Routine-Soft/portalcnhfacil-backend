// src/services/payment.service.js

import { AbacatePay } from "@abacatepay/sdk";

const abacate = AbacatePay({ secret:process.env.ABACATEPAY_API_KEY });

export const PaymentService = {

  async createCheckout({ courseId, courseName, coursePrice, userId }) {
    // O SDK cria produto e checkout em uma única chamada — sem etapa separada
    const billing = await abacate.billing.create({
      frequency:     'ONE_TIME',
      methods:       ['PIX', 'CARD'],
      products: [
        {
          externalId:  String(courseId),
          name:        courseName,
          description: `Curso: ${courseName}`,
          quantity:    1,
          price:       Math.round(Number(coursePrice) * 100), // centavos
        },
      ],
      returnUrl:     `${process.env.APP_URL}/cursos`,
      completionUrl: `${process.env.APP_URL}/pagamento/sucesso?courseId=${courseId}`,
      metadata: {
        course_id:   String(courseId),
        course_name: courseName,
        user_id:     String(userId),
      },
    })

    return {
      checkout_id: billing.id,
      url:         billing.url,
    }
  },

  async handleWebhook(body) {
    const { event, data } = body
    console.log(`📩 Webhook AbacatePay — evento: ${event}`)
    console.log('Dados webhook:', JSON.stringify(data, null, 2))

    // Nota: O webhook é processado na rota em payment.routes.js
    // Este método é mantido para compatibilidade com o controller

    return { received: true }
  },
}