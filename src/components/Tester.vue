<template>
    <div class="absolute flex inset-0 items-center overflow-y-auto"
        :class="`font-${$route.params.family}`"
        :style="{ background, color }">
        <div class="balanced-text bg-transparent break-normal leading-none max-h-full overflow-hidden outline-none text-center w-full "
            :placeholder="placeholder"
            ref="textarea"
            :style="[ { '--wght': values.wght }, this.style ]"
            style="font-variation-settings: 'wght' var(--wght);"
            spellcheck="false"
            contenteditable="true"
            @input="refresh"
            @paste="paste"
            @keydown="keydown"
            >{{ values.wght }}</div>
    </div>
</template>

<style scoped>
[contenteditable=true] {
  font-family: inherit !important;
  line-break: strict;
  -webkit-line-break: after-white-space;
}

[contenteditable=true]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block;
}
</style>

<script>
export default {
    props: ['values', 'background', 'color', 'globalDragging', 'bwColors'],
    created() {
        window.addEventListener('resize', this.windowResized)
    },
    destroyed() {
        window.removeEventListener('resize', this.windowResized)
    },
    mounted() {
        this.$nextTick(() => {
            this.refresh()
            this.$refs.textarea.focus()
        })
    },
    data() {
        return {
            fontSize: window.innerHeight / 2,
            placeholder: 'Tester',
        }
    },
    computed: {
        style() {
            const style = {}

            if (this.fontSize < 20) {
                Object.assign(style, { columns: 3, textAlign: 'left' })
            } else if (this.fontSize < 30) {
                Object.assign({ columns: 2, textAlign: 'left' })
            } else {
                Object.assign({ columns: 1, textAlign: 'center' })
            }

            if (this.globalDragging) {
                Object.assign({ 'user-select': 'none' })
            } else {
                Object.assign({ 'user-select': 'text' })
            }

            return style
        }
    },
    methods: {
        windowResized() {
            this.refresh()
        },
        refresh() {
            const textarea = this.$refs.textarea
            const min = 14
            this.fontSize = window.innerHeight / 2
            const ratio = 0.9
            textarea.style.fontSize = `${this.fontSize}px`

            while ((textarea.offsetWidth < textarea.scrollWidth || textarea.offsetHeight < textarea.scrollHeight) && this.fontSize * ratio > min) {
                this.fontSize *= ratio
                textarea.style.fontSize = `${this.fontSize}px`
            }
        },
        paste(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');    
            document.execCommand('insertText', false, text)
        },
        keydown(e) {
            if (e.key === 'Enter') {
                document.execCommand('insertLineBreak')
                e.preventDefault()
            }
        },
    }
}
</script>
