// O que pode ser recebido na criação
export function createUserDto(body) {
  return {
    nome:           body.nome,
    email:          body.email,
    senha:          body.senha,          // será hasheada no service
    whatsapp:       body.whatsapp,
    cpf:            body.cpf,
    cnh:            body.cnh,
    categoriaCnh:   body.categoriaCnh ?? [],
    ufCnh:          body.ufCnh,
    dataNascimento: body.dataNascimento,
    endereco:       body.endereco ?? {},
    access:         body.access ?? false,
  }
}

// O que pode ser atualizado (sem email/senha por aqui — rotas separadas depois)
export function updateUserDto(body) {
  const allowed = ['nome', 'whatsapp', 'cnh', 'categoriaCnh', 'ufCnh', 'dataNascimento', 'endereco', 'access']
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key))
  )
}

// Para login
export function loginUserDto(body) {
  return {
    email: body.email,
    senha: body.senha,
  }
}