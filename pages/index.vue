<template>
    <div>
        <h1 class="text-center text-3xl">Extract tables from PDF files with ease.</h1>
        <form @submit.prevent="uploadPdf">
            <label for="pdf-upload">Choose a pdf to upload</label>
            <input type="file" name="pdf-upload" id="pdf-upload" accept=".pdf" @change="changePdfFile" multiple>
            <button type="submit">Upload</button>
        </form>
    </div>
</template>

<script setup>
import { v4 as uuidV4 } from 'uuid'

const pdfFiles = ref(null)
let uuid = null

if (process.client) {
    uuid = window.localStorage.getItem('table-finder-uuid')

    if (uuid === null) {
        uuid = uuidV4()
        window.localStorage.setItem('table-finder-uuid', uuid)
    }
}

function changePdfFile(e) {
    pdfFiles.value = e.target.files[0]
}

async function uploadPdf() {

    const formData = new FormData()

    formData.append('pdfFiles', pdfFiles.value)
    formData.append('uuid', uuid)

    const { data } = await useFetch(
        '/api/pdf_upload',
        {
            method: 'post',
            body: formData
        }
    )

    if (data.value) {
        await navigateTo('/viewer', { external: true })
    }
}
</script>