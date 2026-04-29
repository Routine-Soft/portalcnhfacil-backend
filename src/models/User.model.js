import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  logradouro: { type: String },
  numero:     { type: String },
  complemento:{ type: String },
  bairro:     { type: String },
  cidade:     { type: String },
  estado:     { type: String },
  cep:        { type: String },
}, { _id: false })

const userSchema = new mongoose.Schema({
  nome:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  senha:          { type: String, required: true },
  whatsapp:       { type: String },
  cpf:            { type: String, unique: true, sparse: true },
  cnh:            { type: String },
  categoriaCnh:   { type: [String], default: [] },   // ex: ['A', 'B', 'E']
  ufCnh:          { type: String, uppercase: true, maxlength: 2 },
  dataNascimento: { type: Date },
  endereco:       { type: addressSchema, default: () => ({}) },
  token:          { type: String, default: null },
  tokenRefresh:   { type: String, default: null },
  access:         { type: Boolean, default: false },
}, {
  timestamps: true,    // createdAt e updatedAt automáticos
  collection: 'users',
})

// Nunca retornar a senha no JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.senha
  delete obj.token
  delete obj.tokenRefresh
  return obj
}

export const User = mongoose.model('User', userSchema)