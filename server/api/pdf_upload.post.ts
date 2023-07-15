import formidable from 'formidable'
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "node:url"

interface Files {
    pdfFiles: File[]
}

const uploadDir = fileURLToPath(new URL(path.join('.', '..', '..', 'public', 'uploaded_files'), import.meta.url))
export default defineEventHandler(async event => {
    const fields: any = await new Promise((resolve, reject) => {
        const form = formidable({
            multiples: true,
            uploadDir
        })

        form.parse(event.node.req, (error: object, fields, files: object) => {
            if (error) {
                reject(error)

                return
            }
            resolve({ uuid: fields.uuid[0], ...files })
        })
    })

    return fields.pdfFiles.map((file: any) => {
        fs.mkdir(path.join(uploadDir, fields.uuid), (err) => {
            if (err && err.code !== 'EEXIST') {
                throw err
            }
        })
        fs.rename(path.join(uploadDir, file.newFilename), path.join(uploadDir, fields.uuid, file.originalFilename), err => {
            if (err) {
                throw err
            }
        })

        return path.join('uploaded_files', fields.uuid, file.originalFilename)
    })
})
