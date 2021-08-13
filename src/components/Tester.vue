<template>
    <div class="flex h-full items-center" :class="`font-${$route.params.family}`">
        <div class="bg-transparent break-normal max-h-full leading-tight placeholder-current outline-none resize-none text-center w-full"
            placeholder="Only kill"
            ref="textarea"
            :style="`--wght: ${values.wght}; --mood: ${values.mood}; font-variation-settings: 'wght' var(--wght), 'mood' var(--mood);`"
            spellcheck="false"
            contenteditable="true"
            @input="input"
            @paste="paste"
            ></div>
    </div>
</template>

<style scoped>
[contenteditable=true] {
  font-family: inherit !important;
}

[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>

<script>
export default {
    props: ['values'],
    created() {
        window.addEventListener('resize', this.windowResized)
    },
    destroyed() {
        window.removeEventListener('resize', this.windowResized)
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.textarea.style.fontSize = `${window.innerHeight / 2}px`
        })
    },
    methods: {
        windowResized() {
            this.$refs.textarea.style.fontSize = `${window.innerHeight / 2}px`
        },
        input() {
            const textarea = this.$refs.textarea
            textarea.style.fontSize = `${window.innerHeight / 2}px`
            // reset font size
            const ratio = Math.min(
                textarea.offsetWidth / textarea.scrollWidth,
                textarea.offsetHeight / textarea.scrollHeight
            )
            const fontSize = Math.max(ratio * parseInt(textarea.style.fontSize), 10)
            textarea.style.fontSize = `${fontSize}px`
        },
        paste(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');    
            document.execCommand('insertText', false, text)
        }
    }
}
</script>
