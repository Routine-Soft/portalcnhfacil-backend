import { HistoryService } from '../services/history.service.js'

export const HistoryController = {

  async findAll(req, reply) {
    const histories = await HistoryService.findAll()
    return reply.send(histories)
  },

  async findById(req, reply) {
    const history = await HistoryService.findById(req.params.id)
    return reply.send(history)
  },

  async create(req, reply) {
    const history = await HistoryService.create(req.body)
    return reply.status(201).send(history)
  },

  async update(req, reply) {
    const history = await HistoryService.update(req.params.id, req.body)
    return reply.send(history)
  },

  async remove(req, reply) {
    const result = await HistoryService.remove(req.params.id)
    return reply.send(result)
  },
}