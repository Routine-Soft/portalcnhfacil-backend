// src/controllers/payment.controller.js

import { PaymentService } from '../services/payment.service.js'

export const PaymentController = {

  async createCheckout(req, reply) {
    const { courseId, courseName, coursePrice, userId } = req.body

    if (!courseId || !courseName || !coursePrice || !userId) {
      return reply.status(400).send({
        message: 'courseId, courseName, coursePrice e userId são obrigatórios.',
      })
    }

    const result = await PaymentService.createCheckout({
      courseId,
      courseName,
      coursePrice,
      userId,
    })

    return reply.status(201).send(result)
  },

  async webhook(req, reply) {
    const result = await PaymentService.handleWebhook(req.body)
    return reply.send(result)
  },
}