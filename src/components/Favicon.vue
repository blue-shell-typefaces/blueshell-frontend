<template>
    <svg class="hidden" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
        <circle ref="circle" cx="86" cy="86" r="86" :fill="color" />
    </svg>
</template>

<script>
export default {
    props: ['color'],
    data() {
        return {
            svgIcon: null,
            pngIcon: null,
            canvas: null,
        }
    },
    created() {
        this.createSvg()
        this.createPng()
    },
    methods: {
        createSvg() {
            this.svgIcon = document.createElement('link')
            this.svgIcon.setAttribute('rel', 'icon')
            this.svgIcon.setAttribute('type', 'image/svg+xml')
            document.querySelector('head').append(this.svgIcon)
        },
        createPng() {
            this.pngIcon = document.createElement('link')
            this.pngIcon.setAttribute('rel', 'icon')
            this.pngIcon.setAttribute('type', 'image/png')
            document.querySelector('head').append(this.pngIcon)
            this.canvas = document.createElement('canvas')
            this.canvas.width = 64
            this.canvas.height = 64
        },
        updateSvg() {
            this.$nextTick(() => {
                this.svgIcon.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(this.$el.outerHTML)}`)
            })
        },
        updatePng() {
            const ctx = this.canvas.getContext('2d')
            ctx.arc(32, 32, 32, 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
            this.pngIcon.setAttribute('href', this.canvas.toDataURL())
        },
    },
    watch: {
        color() {
            this.updateSvg()
            this.updatePng()
        }
    },
}
</script>