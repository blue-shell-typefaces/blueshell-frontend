<template>
    <div class="absolute flex inset-0 items-center overflow-y-auto"
        :class="`font-${$route.params.family}`"
        :style="[ globalDragging ? { background, color } : {} ]">
        <div class="balanced-text bg-transparent break-normal leading-tight max-h-full outline-none text-center w-full"
            placeholder="Tester"
            ref="textarea"
            :style="`--wght: ${values.wght}; font-variation-settings: 'wght' var(--wght);`"
            style="line-height: 1.15"
            spellcheck="false"
            contenteditable="true"
            @input="refresh"
            @paste="paste"
            @keydown="keydown"
            ></div>
    </div>
</template>

<style scoped>
[contenteditable=true] {
  font-family: inherit !important;
  line-break: strict;
  -webkit-line-break: after-white-space;
  -webkit-user-select: text;
  user-select: text;
}

[contenteditable=true]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block;
}
</style>

<script>
import { fonts } from '../data'
export default {
    props: ['values', 'background', 'color', 'globalDragging'],
    created() {
        window.addEventListener('resize', this.windowResized)
    },
    destroyed() {
        window.removeEventListener('resize', this.windowResized)
    },
    mounted() {
        this.$nextTick(() => {
            this.refresh()
        })
    },
    methods: {
        windowResized() {
            this.refresh()
        },
        refresh() {
            const textarea = this.$refs.textarea
            const min = 14
            let fontSize = window.innerHeight / 2
            const ratio = 0.9
            textarea.style.fontSize = `${fontSize}px`

            while ((textarea.offsetWidth < textarea.scrollWidth || textarea.offsetHeight < textarea.scrollHeight) && fontSize * ratio > min) {
                fontSize *= ratio
                textarea.style.fontSize = `${fontSize}px`
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
        resetColors() {
            this.background = 'white'
            this.color = 'black'
        }
    }
}
</script>
