import { UserService } from '../services/user.service.js'

export const UserController = {

  async findAll(req, reply) {
    const users = await UserService.findAll()
    return reply.send(users)
  },

  async findById(req, reply) {
    const user = await UserService.findById(req.params.id)
    return reply.send(user)
  },

  async create(req, reply) {
    const user = await UserService.create(req.body)
    return reply.status(201).send(user)
  },

  async update(req, reply) {
    const user = await UserService.update(req.params.id, req.body)
    return reply.send(user)
  },

  async remove(req, reply) {
    const result = await UserService.remove(req.params.id)
    return reply.send(result)
  },

  async login(req, reply) {
    const result = await UserService.login(req.body)
    return reply.send(result)
  },

  async logout(req, reply) {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) throw new Error('Token não fornecido')
    const decoded = await UserService.verifyToken(token)
    const result = await UserService.logout(decoded.id)
    return reply.send(result)
  },

  async refresh(req, reply) {
    const { refreshToken } = req.body
    const result = await UserService.refresh(refreshToken)
    return reply.send(result)
  },

  async updatePassword(req, reply) {
  const user = await UserService.updatePassword(req.params.id, req.body)
  return reply.send(user)
}
}