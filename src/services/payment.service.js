// src/services/payment.service.js

import { Preference } from 'mercadopago'
import { mpClient } from '../config/mercadopago.js'

export const PaymentService = {

  async createCheckout({ courseId, courseName, coursePrice }) {
    const preference = new Preference(mpClient)

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(courseId),
            title: courseName,
            description: `Curso: ${courseName}`,
            quantity: 1,
            unit_price: Number(coursePrice),
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
      },
    })

    return {
      checkout_id: result.id,
      url: result.init_point,
    }
  },
}