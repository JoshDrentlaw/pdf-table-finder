import path from "path"
import fs from 'fs'
import { fileURLToPath } from "node:url"

export default defineEventHandler(async event => {
    const uploadDir = fileURLToPath(new URL(path.join('.', '..', '..', 'public', 'uploaded_files'), import.meta.url)),
        query = getQuery(event),
        uuid = query.uuid,
        pdfPath = path.join(uploadDir, query.uuid),
        paths: Array<string> = []

    await new Promise((resolve, reject) => {
        fs.readdir(pdfPath, (err, files) => {
            if (err) {
                // throw createError(err)
                reject(err)
            } else {
                files.forEach(f => {
                    paths.push(path.join('uploaded_files', uuid, f))
                })

                resolve(true)
            }
        })
    })
    console.log(paths)

    return { paths }
})