import { CourseService } from '../services/course.service.js'

export const CourseController = {

  async findAll(req, reply) {
    const courses = await CourseService.findAll()
    return reply.send(courses)
  },

  async findById(req, reply) {
    const course = await CourseService.findById(req.params.id)
    return reply.send(course)
  },

  async create(req, reply) {
    const course = await CourseService.create(req.body)
    return reply.status(201).send(course)
  },

  async update(req, reply) {
    const course = await CourseService.update(req.params.id, req.body)
    return reply.send(course)
  },

  async remove(req, reply) {
    const result = await CourseService.remove(req.params.id)
    return reply.send(result)
  },
}