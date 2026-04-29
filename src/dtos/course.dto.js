export function createCourseDto(body) {
  return {
    imagem:       body.imagem,
    titulo:       body.titulo,
    descricao:    body.descricao,
    preco:        body.preco,
    requisitos:   body.requisitos   ?? [],
    cargaHoraria: body.cargaHoraria,
    sumario:      body.sumario      ?? [],
  }
}

export function updateCourseDto(body) {
  const allowed = ['imagem', 'titulo', 'descricao', 'preco', 'requisitos', 'cargaHoraria', 'sumario']
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key))
  )
}