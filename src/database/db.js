import mongoose from 'mongoose'

const db = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portalcnhfacil.1llqst5.mongodb.net/portalcnhfacil?appName=PortalCNHFacil`
  )
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((error) => console.log('❌ Erro ao conectar ao MongoDB: ' + error))
}

export default db