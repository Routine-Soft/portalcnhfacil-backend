// src/models/History.model.js

import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({

  titulo: {
    type: String,
    required: true,
    trim: true
  },

  aluno: {
    type: String,
    required: false
  },

  preco: {
    type: Number,
    required: true,
    min: 0
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  product_id: {
    type: String,
    required: true
  },

  checkout_id: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },

  paid_at: {
    type: Date
  },

  gateway_response: {
    type: Object,
    default: null
  },

  user: {
    type: Object,
    default: null
  }

}, {
  timestamps: true,
  collection: 'historys',
})

export const History = mongoose.model('History', historySchema)