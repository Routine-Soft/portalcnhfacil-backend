import { CourseController } from '../controllers/course.controller.js'

export async function courseRoutes(fastify) {
  fastify.get   ('/courses',      CourseController.findAll)
  fastify.get   ('/courses/:id',  CourseController.findById)
  fastify.post  ('/courses',      CourseController.create)
  fastify.patch ('/courses/:id',  CourseController.update)
  fastify.delete('/courses/:id',  CourseController.remove)
}