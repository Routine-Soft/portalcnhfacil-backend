import { UserController } from '../controllers/user.controller.js'

export async function userRoutes(fastify) {
  fastify.get   ('/users',      UserController.findAll)
  fastify.get   ('/users/:id',  UserController.findById)
  fastify.post  ('/users',      UserController.create)
  fastify.patch ('/users/:id',  UserController.update)
  fastify.delete('/users/:id',  UserController.remove)
  fastify.post  ('/login',      UserController.login)
  fastify.post  ('/logout',     UserController.logout)
  fastify.post  ('/refresh',    UserController.refresh)
}