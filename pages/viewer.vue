<template>
    <div>
        <canvas id="pdf-canvas"></canvas>
    </div>
</template>

<script setup>
let uuid = null

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

    const { data } = await useFetch(`/api/get_pdf_paths`, { query: { uuid }, key: Math.random().toString() })
    let paths = data.value?.paths

    console.log(paths)

    if (paths) {
        window.localStorage.setItem('pdf-table-paths', JSON.stringify(paths))
    } else {
        paths = JSON.parse(window.localStorage.getItem('pdf-table-paths'))
    }

    paths.forEach(async path => {
        const pdf = await pdfjsLib.getDocument(path).promise,
            page = await pdf.getPage(1),
            viewport = page.getViewport({ scale: 1 }),
            outputScale = window.devicePixelRatio || 1,
            canvas = document.getElementById('pdf-canvas'),
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
}
</script>

<style scoped></style>