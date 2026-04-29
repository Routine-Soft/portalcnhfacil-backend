import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js'
import { createUserDto, updateUserDto, loginUserDto } from '../dtos/user.dto.js'

export const UserService = {

  async findAll() {
    return User.find()
  },

  async findById(id) {
    const user = await User.findById(id)
    if (!user) throw new Error('Usuário não encontrado')
    return user
  },

  async create(body) {
    const dto = createUserDto(body)
    dto.senha = await argon2.hash(dto.senha)
    return User.create(dto)
  },

  async update(id, body) {
    const dto = updateUserDto(body)
    const user = await User.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
    if (!user) throw new Error('Usuário não encontrado')
    return user
  },

  async remove(id) {
    const user = await User.findByIdAndDelete(id)
    if (!user) throw new Error('Usuário não encontrado')
    return { message: 'Usuário removido com sucesso' }
  },

  async login(body) {
    const dto = loginUserDto(body)
    const { email, senha } = dto
    const user = await User.findOne({ email })
    if (!user) throw new Error('Credenciais inválidas')
    const valid = await argon2.verify(user.senha, senha)
    if (!valid) throw new Error('Credenciais inválidas')
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '60d' })
    user.tokenRefresh = refreshToken
    await user.save()
    return { accessToken, refreshToken, user: user.toJSON() }
  },

  async logout(id) {
    const user = await User.findById(id)
    if (!user) throw new Error('Usuário não encontrado')
    user.tokenRefresh = null
    await user.save()
    return { message: 'Logout realizado com sucesso' }
  },

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return decoded
    } catch (err) {
      throw new Error('Token inválido')
    }
  },

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const user = await User.findById(decoded.id)
      if (!user || user.tokenRefresh !== refreshToken) throw new Error('Token inválido')
      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
      return { accessToken: newAccessToken }
    } catch (err) {
      throw new Error('Token inválido')
    }
  },
}