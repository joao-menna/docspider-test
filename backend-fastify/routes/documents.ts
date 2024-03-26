import { FastifyInstance } from "fastify";
import getDB from "../database/getDB";
import { documentTable } from "../schemas/document";
import { rename, writeFile } from "fs/promises";
import { resolve } from "path";
import { eq } from "drizzle-orm";
import { existsSync, mkdirSync, rmSync } from "fs";

const staticPath = resolve(__dirname, '..', 'static')

export default async function documentRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/documents', async (req, rep) => {
    const { db, client } = await getDB()

    try {
      const result = await db.select().from(documentTable)
      await rep.send(result)
    } catch (err) {
      await rep.code(500).send(err)
    }

    await client.end()

    return await rep
  })

  fastify.post('/documents', async (req, rep) => {
    const { db, client } = await getDB()

    let file: any
    const obj = {
      title: '',
      description: '',
      fileName: '',
    }

    for await (const part of req.parts()) {
      if (part.type === 'file') {
        file = await part.toBuffer()
      } else {
        if (part.fieldname === 'title') {
          obj.title = part.value as string
        }

        if (part.fieldname === 'description') {
          obj.description = part.value as string
        }

        if (part.fieldname === 'fileName') {
          obj.fileName = part.value as string
        }
      }
    }

    try {
      const inserted = await db.insert(documentTable).values({
        ...obj
      }).returning()
      await rep.send(inserted)
    } catch (err) {
      await rep.code(500).send(err)
    }

    if (!existsSync(staticPath)) {
      mkdirSync(staticPath)
    }
    await writeFile(resolve(staticPath, obj.fileName), file)

    await client.end()
    return await rep
  })

  fastify.put('/documents/:id', async (req, rep) => {
    const { id } = req.params as { id: string }
    const { title, description, fileName } = req.body as { title: string, description: string, fileName: string }

    const { db, client } = await getDB()

    try {
      const query = await db
        .select()
        .from(documentTable)
        .where(eq(documentTable.id, parseInt(id)))
        .limit(1)

      if (query.length === 0) {
        await rep.code(400).send({
          'message': 'document not found'
        })
        await client.end()
        return await rep
      }

      if (!existsSync(staticPath)) {
        mkdirSync(staticPath)
      }

      const updated = await db.update(documentTable).set({
        title,
        description,
        fileName
      }).where(eq(documentTable.id, parseInt(id))).returning()

      const document = query[0]
      await rename(
        resolve(staticPath, document.fileName),
        resolve(staticPath, fileName)
      )
      await rep.send(updated)
    } catch (err) {
      await rep.code(500).send(err)
    }

    await client.end()
    return await rep
  })

  fastify.delete('/documents/:id', async (req, rep) => {
    const { id } = req.params as { id: string }
    const { db, client } = await getDB()

    try {
      const query = await db
        .select()
        .from(documentTable)
        .where(eq(documentTable.id, parseInt(id)))
        .limit(1)

      if (query.length === 0) {
        await rep.code(400).send({
          'message': 'document not found'
        })
        await client.end()
        return await rep
      }

      await db.delete(documentTable).where(eq(documentTable.id, parseInt(id)))

      rmSync(resolve(staticPath, query[0].fileName))

      await rep.send({ success: true })
    } catch (err) {
      await rep.code(500).send(err)
    }

    await client.end()
    return await rep
  })
}