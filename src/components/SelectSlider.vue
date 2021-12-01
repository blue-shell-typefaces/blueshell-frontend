<template>
  <div class="flex lg:hidden">
    <div class="flex-shrink mr-2 relative">
      <select
        v-model="modelValue"
        @input="$emit('update:modelValue', parseInt($event.target.value))"
        @change="$emit('select')"
        class="appearance-none bg-white h-10 px-3 rounded-full">
        <option :value="modelValue" hidden>{{ Math.round(modelValue) }}</option>
        <option v-for="(marker, key) in markers" :value="key" :key="key">{{ marker }}</option>
      </select>
      <span class="absolute pointer-events-none px-2 right-0 top-1/2 -translate-y-1/2">▲</span>
    </div>
    <div class="flex-grow h-10 relative rounded-full" ref="lane">
      <span
        class="absolute bg-secondary cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-primary transform w-10"
        ref="handle"
        :style="{ left: `${100 * modelValue / (max - min)}%`, '--tw-translate-x': `${-100 * modelValue / (max - min)}%` }"
        @mousedown="start"
        @touchstart="start"></span>
    </div>
  </div>
</template>

<style scoped>
select:focus {
  outline: 0;
  background: var(--secondary-color);
  color: var(--primary-color);
}

select:focus + span {
  color: var(--primary-color);
}
</style>

<script>
export default {
  name: 'SelectSlider',
  props: {
    min: Number,
    max: Number,
    modelValue: Number,
    markers: Object,
  },
  emits: ['start', 'end', 'select', 'update:modelValue'],
  data() {
    return {
      dragging: false,
    }
  },
  created() {
    window.addEventListener('mousemove', this.move)
    window.addEventListener('mouseup', this.end)
    window.addEventListener('touchmove', this.move)
    window.addEventListener('touchend', this.end)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('mouseup', this.end)
    window.removeEventListener('touchmove', this.move)
    window.removeEventListener('touchend', this.end)
  },
  methods: {
    move(e) {
      if (this.dragging) {
        const x = e.touches ? e.touches[0].clientX : e.clientX
        const bbox = this.$refs.lane.getBoundingClientRect()
        const ratio = (x - bbox.left) / bbox.width
        const result = this.min + (this.max - this.min) * ratio
        const clamped = Math.min(this.max, Math.max(this.min, result))
        this.$emit('update:modelValue', clamped)
      }
    },
    start(e) {
      this.dragging = true
      this.move(e)
    },
    end() {
      this.dragging = false
    },
    blink() {
      const el = this.$refs.handle
      if (!el) return
      el.classList.remove('animate-alert')
      // todo
      window.setTimeout(() => {
        el.classList.add('animate-alert')
      }, 100)
    }
  }
}
</script>