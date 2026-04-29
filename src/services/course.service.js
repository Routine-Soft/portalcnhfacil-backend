import { Course } from '../models/Course.model.js'
import { createCourseDto, updateCourseDto } from '../dtos/course.dto.js'

export const CourseService = {

  async findAll() {
    return Course.find()
  },

  async findById(id) {
    const course = await Course.findById(id)
    if (!course) throw new Error('Curso não encontrado')
    return course
  },

  async create(body) {
    const dto = createCourseDto(body)
    return Course.create(dto)
  },

  async update(id, body) {
    const dto = updateCourseDto(body)
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    )
    if (!course) throw new Error('Curso não encontrado')
    return course
  },

  async remove(id) {
    const course = await Course.findByIdAndDelete(id)
    if (!course) throw new Error('Curso não encontrado')
    return { message: 'Curso removido com sucesso' }
  },
}