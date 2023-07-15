<template>
    <div>
        <ClientOnly>
            <canvas v-for="(path, i) in paths" :key="path" :id="'pdf-canvas-' + i"></canvas>
        </ClientOnly>
    </div>
</template>

<script setup>
import { readBody } from 'h3'
const paths = useState('paths', () => null)
const viewPaths = ref([])
let uuid = null

if (process.server) {
    try {
        const event = useRequestEvent()
        const body = await readBody(event)

        if (body?.selectedFiles) {
            paths.value = Array.isArray(body.selectedFiles) ? body.selectedFiles : [body.selectedFiles]
        }
    } catch {
        paths.value = null
    }
}

if (process.client) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.js'
    try {
        uuid = window.localStorage.getItem('table-finder-uuid')

        if (uuid === null) {
            throw createError({ message: 'Please go to the home page to generate a UUID' })
        }
    } catch {
        clearError({ redirect: '/' })
    }

    /* viewPaths.value = paths.value || await $fetch(`/api/get_pdf_paths`, { query: { uuid } }).then(res => res?.paths || [])

    console.log(viewPaths.value) */
}

onMounted(() => {
    try {
        paths.value.forEach(async (path, i) => {
            const pdf = await pdfjsLib.getDocument(path).promise,
                page = await pdf.getPage(1),
                viewport = page.getViewport({ scale: 1 }),
                outputScale = window.devicePixelRatio || 1,
                canvas = document.getElementById('pdf-canvas-' + i),
                context = canvas.getContext('2d')

            canvas.width = Math.floor(viewport.width * outputScale)
            canvas.height = Math.floor(viewport.height * outputScale)
            canvas.style.width = Math.floor(viewport.width) + "px"
            canvas.style.height = Math.floor(viewport.height) + "px"

            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null

            page.render({
                canvasContext: context,
                transform,
                viewport
            })
        })
    } catch {
        throw createError({ message: 'Could not load files', fatal: true, stack: false })
    }
})
</script>

<style scoped></style>