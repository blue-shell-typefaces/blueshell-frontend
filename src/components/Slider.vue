<template>
  <div class="flex lg:hidden">
    <div class="flex-shrink mr-2 relative">
      <select v-model="modelValue"
              @input="$emit('update:modelValue', parseInt($event.target.value))"
              @change="$emit('select')"
              class="appearance-none h-10 px-3 rounded-full">
        <option :value="modelValue" hidden>{{ Math.round(modelValue) }}</option>
        <option v-for="(marker, key) in markers" :value="key" :key="key">{{ marker }}</option>
      </select>
      <div class="absolute pointer-events-none px-2 right-0 top-1/2 -translate-y-1/2">▲</div>
    </div>
    <div class="flex-grow h-10 relative rounded-full" ref="simpleLane">
      <span class="absolute bg-secondary cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-primary transform w-10"
            :style="{ left: `${100 * modelValue / (max - min)}%`, '--tw-translate-x': `${-100 * modelValue / (max - min)}%` }"
            @touchstart="start"
            @mousedown="start"
      ></span>
    </div>
  </div>

  <div class="h-10 hidden lg:block relative rounded-full transition duration-100"
        :class="[dragging || (!globalDragging && hover) ? 'bg-white' : '']"
        @mouseover="over"
        @mouseout="out"
        @mousedown="start"
        ref="lane">
    <span class="absolute bg-secondary cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-primary top-0 transform z-10"
          :class="[modelValue in markers ? 'px-3' : 'w-10']"
          :style="{ left: `${100 * modelValue / (max - min)}%`, '--tw-translate-x': `${-100 * modelValue / (max - min)}%` }"
          ref="handleWrapper"
          style="--alert-color: var(--secondary-color)"
          @mousedown="start"
    ><span ref="handle" :class="[dragging || (!globalDragging && hover) ? '': 'opacity-0']">{{ label }}</span></span>
    <span v-for="(marker, key) in markers"
          class="absolute cursor-pointer h-full hidden lg:inline leading-10 px-3 opacity-0 rounded-full top-1/2 transform -translate-y-1/2 hover:underline"
          :class="[(dragging || (!globalDragging && hover)) && modelValue != key ? 'opacity-100' : 'opacity-0']"
          :key="key"
          :ref="setMarkerRef"
          :style="{ left: `${100 * key / max}%`, '--tw-translate-x': `${-100 * key / max}%` }"
          @mousedown="$emit('update:modelValue', parseInt(key))">{{ marker }}</span>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    min: Number,
    max: Number,
    modelValue: Number,
    markers: Object,
    globalDragging: Boolean,
  },
  emits: ['start', 'end', 'select', 'update:modelValue'],
  data() {
    return {
      dragging: false,
      hover: false,
      leftRaw: 0,
      offsetLane: 0,
      offsetHandle: 0,
      offsetSimpleLane: 0,
      markerRefs: [],
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
    window.addEventListener('touchmove', this.touchMove)
    window.addEventListener('touchend', this.end)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('mouseup', this.end)
    window.removeEventListener('touchmove', this.touchMove)
    window.removeEventListener('touchend', this.end)
  },
  mounted() {
    this.offsetLane = this.$refs.lane.getBoundingClientRect().left
    this.offsetSimpleLane = this.$refs.simpleLane.getBoundingClientRect().left
    this.handleWidth = this.$refs.handle.getBoundingClientRect().width
  },
  methods: {
    over() {
      this.hover = true
    },
    out() {
      this.hover = false
    },
    move(e) {
      if (this.dragging) {
        const x = e.touches ? e.touches[0].clientX : e.clientX
        this.$emit('update:modelValue', this.posToValue(x - this.offsetLane - this.offsetHandle))
      }
    },
    touchMove(e) {
      if (this.dragging) {
        const x = e.touches[0].clientX
        const ratio = (x - this.offsetSimpleLane) / this.$refs.simpleLane.offsetWidth
        const result = this.min + (this.max - this.min) * ratio
        const clamped = Math.min(this.max, Math.max(this.min, result))
        this.$emit('update:modelValue', clamped)
      }
    },
    start(e) {
      this.offsetHandle = e.target === this.$refs.handle ? e.offsetX : -this.handleWidth / 2
      const x = e.touches ? e.touches[0].clientX : e.clientX
      this.leftRaw = x - this.offsetLane - this.offsetHandle

      this.dragging = true
      this.$emit('start')
    },
    end() {
      this.dragging = false
      this.$emit('end')
    },
    posToValue(pos) {
      const markers = Object.keys(this.markers).map(value => parseInt(value))

      const left = this.markerRefs[0].getBoundingClientRect().left
      const right = this.markerRefs[0].getBoundingClientRect().right

      if (pos < left - this.offsetLane - this.handleWidth / 2) {
        const ratio = pos / (left - this.offsetLane - this.handleWidth / 2)
        return Math.round(ratio * markers[0])
      }

      if (pos <= right - this.offsetLane - this.handleWidth / 2) {
        return markers[0]
      }

      for (let i = 1; i < markers.length; i++) {
        const left = this.markerRefs[i].getBoundingClientRect().left
        const right = this.markerRefs[i].getBoundingClientRect().right
        const prev = this.markerRefs[i - 1].getBoundingClientRect().right

        if (pos < left - this.offsetLane - this.handleWidth / 2) {
          const ratio = (pos - prev + this.offsetLane + this.handleWidth / 2) / (left - prev)
          return Math.round(ratio * (markers[i] - markers[i - 1]) + markers[i - 1])
        }

        if (pos >= left - this.offsetLane - this.handleWidth / 2 &&
            pos <= right - this.offsetLane - this.handleWidth / 2) {
          return markers[i]
        }
      }

      return 0
    },
    valueToPos(value) {
      const markers = Object.keys(this.markers).map(value => parseInt(value))

      for (let i = 1; i < markers.length; i++) {
        const left = this.markerRefs[i].getBoundingClientRect().left
        const right = this.markerRefs[i].getBoundingClientRect().right
        const prev = this.markerRefs[i - 1].getBoundingClientRect().right

        if (value < markers[i]) {
          const ratio = (value - markers[i - 1]) / (markers[i] - markers[i - 1])
          return ratio * (left - prev) + prev - this.offsetLane - this.handleWidth / 2
        }

        if (value === markers[i]) {
          return left + (right - left) / 2 - this.offsetLane - this.handleWidth / 2
        }
      }
    },
    blink() {
      const el = this.$refs.handleWrapper
      if (el) {
        el.classList.remove('animate-alert')
        // todo
        window.setTimeout(() => {
          el.classList.add('animate-alert')
        }, 100)
      }
    },
    setMarkerRef(el) {
      if (el) {
        this.markerRefs.push(el)
      }
    }
  }
}
</script>