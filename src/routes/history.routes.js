import { HistoryController } from '../controllers/history.controller.js'

export async function historyRoutes(fastify) {
  fastify.get   ('/history',      HistoryController.findAll)
  fastify.get   ('/history/:id',  HistoryController.findById)
  fastify.post  ('/history',      HistoryController.create)
  fastify.patch ('/history/:id',  HistoryController.update)
  fastify.delete('/history/:id',  HistoryController.remove)
}