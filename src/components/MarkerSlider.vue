<template>
  <div
    class="h-10 hidden lg:block relative rounded-full"
    :class="[dragging || (!globalDragging && hover) ? 'bg-white' : '']"
    ref="lane"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @mousedown="start">
    <span v-for="(marker, key) in markers"
      class="absolute cursor-pointer h-full leading-10 px-3 rounded-full top-1/2 transform -translate-y-1/2 hover:underline"
      :key="key"
      :ref="el => setMarkerRef(el, key)"
      :style="{ left: `${100 * key / max}%`, '--tw-translate-x': `${-100 * key / max}%` }"
      @mousedown="$emit('update:modelValue', parseInt(key))">{{ marker }}</span>
    <span class="absolute bg-secondary cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-primary transform -translate-x-1/2"
      :class="[modelValue in markers ? 'px-3' : 'w-10', ]"
      ref="handle"
      style="--alert-color: var(--secondary-color)"
      :style="{ left: `${valueToPos(this.modelValue) * 100}%` }"
      ><span :class="[dragging || (!globalDragging && hover) ? '': 'invisible']">{{ label }}</span></span>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
  name: 'Slider',
  props: {
    min: Number,
    max: Number,
    modelValue: Number,
    markers: Object,
    globalDragging: Boolean,
  },
  emits: ['start', 'end', 'update:modelValue'],
  data() {
    return {
      dragging: false,
      hover: false,
      markerRefs: [],
      markerRefMap: {},
    }
  },
  computed: {
    label() {
      if (this.modelValue in this.markers) {
        return this.markers[this.modelValue]
      } else {
        return Math.round(this.modelValue)
      }
    },
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
  mounted() {
    for (const key of Object.keys(this.markers)) {
      this.markerRefMap[key] = ref(null)
    }
  },
  methods: {
    move(e) {
      if (this.dragging) {
        const x = e.touches ? e.touches[0].clientX : e.clientX
        this.$emit('update:modelValue', this.posToValue(x))
      }
    },
    start(e) {
      this.dragging = true
      this.$emit('start')
      this.move(e)
    },
    end() {
      this.dragging = false
      this.$emit('end')
    },
    posToValue(pos) {
      const markers = Object.keys(this.markers).map(value => parseInt(value))

      const left = this.markerRefs[0].getBoundingClientRect().left
      const right = this.markerRefs[0].getBoundingClientRect().right

      if (pos < left) {
        const ratio = pos / (left)
        return Math.round(ratio * markers[0])
      }

      if (pos <= right) {
        return markers[0]
      }

      for (let i = 1; i < markers.length; i++) {
        const left = this.markerRefs[i].getBoundingClientRect().left
        const right = this.markerRefs[i].getBoundingClientRect().right
        const prev = this.markerRefs[i - 1].getBoundingClientRect().right

        if (pos < left) {
          const ratio = (pos - prev) / (left - prev)
          return Math.round(ratio * (markers[i] - markers[i - 1]) + markers[i - 1])
        }

        if (pos >= left && pos <= right) {
          return markers[i]
        }
      }

      return markers[markers.length - 1]
    },
    valueToPos(value) {
      if (!this.$refs.lane) return

      const markers = Object.keys(this.markerRefMap).map(key => parseInt(key))
      const laneBbox = this.$refs.lane.getBoundingClientRect()

      for (let i = 0; i < markers.length; i++) {
        const left = this.markerRefs[i].getBoundingClientRect().left
        const right = this.markerRefs[i].getBoundingClientRect().right

        if (value === markers[i]) {
          return ((right - left) / 2 + left - laneBbox.left) / laneBbox.width
        }

        if (i === 0) continue
        const prev = this.markerRefs[i - 1].getBoundingClientRect().right

        if (value < markers[i]) {
          const valRatio = (value - markers[i - 1]) / (markers[i] - markers[i - 1])
          return ((left - prev) * valRatio + prev - laneBbox.left) / laneBbox.width
        }
      }
    },
    blink() {
      const el = this.$refs.handle
      if (!el) return
      el.classList.remove('animate-alert')
      // todo
      window.setTimeout(() => {
        el.classList.add('animate-alert')
      }, 100)
    },
    setMarkerRef(el, key) {
      if (el) {
        this.markerRefMap[key] = el
        this.markerRefs.push(el)
      }
    }
  }
}
</script>