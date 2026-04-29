import { History } from '../models/History.model.js'
import { createHistoryDto, updateHistoryDto } from '../dtos/history.dto.js'

export const HistoryService = {

  async findAll() {
    return History.find()
  },

  async findById(id) {
    const history = await History.findById(id)
    if (!history) throw new Error('Histórico não encontrado')
    return history
  },

  async create(body) {
    const dto = createHistoryDto(body)
    return History.create(dto)
  },

  async update(id, body) {
    const dto = updateHistoryDto(body)
    const history = await History.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    )
    if (!history) throw new Error('Histórico não encontrado')
    return history
  },

  async remove(id) {
    const history = await History.findByIdAndDelete(id)
    if (!history) throw new Error('Histórico não encontrado')
    return { message: 'Histórico removido com sucesso' }
  },
}