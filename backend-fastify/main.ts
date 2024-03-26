import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { fastifyStatic } from '@fastify/static'
import { fastifyMultipart } from '@fastify/multipart'
import { resolve } from 'path'
import { config } from 'dotenv'
import documentRoutes from './routes/documents'

config()

async function main (): Promise<void> { 
  const server = fastify()

  await server.register(fastifyCors, {
    origin: '*'
  })

  await server.register(fastifyStatic, {
    root: resolve(__dirname, 'static'),
    prefix: '/static'
  })

  await server.register(fastifyMultipart, {})

  await server.register(documentRoutes)

  await server.ready()

  await server.listen({
    host: '0.0.0.0',
    port: parseInt(process.env.PORT ?? '8080')
  })

  console.log('Server running in http://localhost:8080')
}

main()