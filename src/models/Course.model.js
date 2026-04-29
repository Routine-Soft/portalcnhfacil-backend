import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  imagem:       { type: String },                       // URL da imagem (S3 depois)
  titulo:       { type: String, required: true, trim: true },
  descricao:    { type: String, required: true },
  preco:        { type: Number, required: true, min: 0 },
  requisitos:   { type: [String], default: [] },        // ex: ['Ter CNH B', 'Maior de 18']
  cargaHoraria: { type: Number, required: true },       // em horas, ex: 40
  sumario:      { type: [String], default: [] },        // ex: ['Aula 1 - Intro', 'Aula 2 - ...']
}, {
  timestamps: true,
  collection: 'courses',
})

export const Course = mongoose.model('Course', courseSchema)