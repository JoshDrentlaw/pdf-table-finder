<template>
    <div>
        <h1 class="text-center text-3xl mb-8">Extract tables from PDF files with ease.</h1>
        <section class="mt-10 p-8 rounded-lg bg-gray-300">
            <form @submit.prevent="uploadPdf">
                <div class="mx-auto mb-4 w-fit text-lg">
                    <label for="pdf-upload" class="hover:cursor-pointer">Choose a pdf to upload</label>
                </div>
                <div class="w-3/4 mx-auto flex align-center border border-2 bg-white border-black rounded-lg">
                    <input type="file" name="pdf-upload"
                        class="flex-1 grow shrink-0 p-4 border-r-2 border-black hover:cursor-pointer file:border file:border-black file:border-solid file:rounded file:bg-white hover:file:bg-black hover:file:text-white hover:file:cursor-pointer"
                        id="pdf-upload" accept=".pdf" @change="changePdfFile" multiple>
                    <button type="submit"
                        class="flex-1 grow-0 shrink p-4 text-center hover:bg-black hover:text-white transition">Upload</button>
                </div>
            </form>

            <div class="p-4 border-2 border-black rounded-lg bg-gray-500 mt-8">
                <form method="post" action="/viewer">
                    <ClientOnly>
                        <div v-for="file in uploadedFiles" :key="file" class="text-white mb-4">
                            <label :for="file" class="cursor-pointer text-lg">
                                <input type="checkbox" name="selectedFiles" :value="file" :id="file"
                                    class="mr-2 cursor-pointer" v-model="selectedFiles">
                                {{ file.split('/').at(-1) }}
                            </label>
                        </div>
                    </ClientOnly>
                    <button type="submit"
                        class="px-4 py-2 text-center border-white bg-white rounded-lg hover:boder-black hover:bg-black hover:text-white transition">
                        View Selected Files
                    </button>
                </form>
            </div>
        </section>
    </div>
</template>

<script setup>
import { v4 as uuidV4 } from 'uuid'

const pdfFiles = ref(null)
const uploadedFiles = ref([])
const selectedFiles = ref([])
let uuid = null

if (process.client) {
    uuid = window.localStorage.getItem('table-finder-uuid')

    if (uuid === null) {
        uuid = uuidV4()
        window.localStorage.setItem('table-finder-uuid', uuid)
    }

    const data = await $fetch(`/api/get_pdf_paths`, { query: { uuid } })

    uploadedFiles.value = data?.paths || []
}

function changePdfFile(e) {
    pdfFiles.value = e.target.files[0]
}

async function uploadPdf(e) {

    const formData = new FormData()

    formData.append('pdfFiles', pdfFiles.value)
    formData.append('uuid', uuid)

    const data = await $fetch(
        '/api/pdf_upload',
        {
            method: 'post',
            body: formData
        }
    )

    if (data) {
        uploadedFiles.value = [...uploadedFiles.value, ...data]
        e.target.reset()
    }
}

function viewFiles() {
    console.log(selectedFiles.value)
}
</script>