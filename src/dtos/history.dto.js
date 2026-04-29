import { access } from "node:fs"

export function createHistoryDto(body) {
  return {
    titulo:       body.titulo,
    aluno:        body.aluno,
    preco:        body.preco,
  }
}

export function updateHistoryDto(body) {
  const allowed = ['titulo', 'aluno', 'preco']
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key))
  )
}