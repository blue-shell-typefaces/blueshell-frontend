<template>
  <div class="flex">
    <select v-bind:value="value" @input="$emit('input', parseInt($event.target.value))" class="lg:hidden flex-shrink h-10 px-2 rounded-full">
      <option v-for="(marker, key) in markers" :value="key" :key="key">{{ marker }}</option>
    </select>
    <div class="flex-grow h-10 relative rounded-full transition duration-100"
          :class="[dragging || (!globalDragging && hover) ? 'bg-white' : '']"
          @mouseover="over"
          @mouseout="out"
          @mousedown="start"
          ref="lane">
      <span class="absolute bg-black cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-white top-1/2 transform -translate-y-1/2 z-10"
            :class="[value in markers ? 'px-3' : 'w-10']"
            :style="{ left: `${100 * value / (max - min)}%`, '--tw-translate-x': `${-100 * value / (max - min)}%`, background, color }"
            @mousedown="start"
      ><span ref="handle" :class="[dragging || (!globalDragging && hover) ? '': 'opacity-0']">{{ label }}</span></span>
      <span class="absolute cursor-pointer h-full hidden lg:inline leading-10 px-3 opacity-0 rounded-full top-1/2 transform -translate-y-1/2 hover:underline" v-for="(marker, key) in markers"
            :class="[(dragging || (!globalDragging && hover)) && value != key ? 'opacity-100' : 'opacity-0']"
            :key="key"
            ref="markers"
            :style="{ left: `${100 * key / max}%`, '--tw-translate-x': `${-100 * key / max}%` }"
            @mousedown="$emit('input', parseInt(key))">{{ marker }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    min: Number,
    max: Number,
    value: Number,
    markers: Object,
    background: String,
    color: String,
    globalDragging: Boolean,
  },
  data() {
    return {
      dragging: false,
      hover: false,
      leftRaw: 0,
      offsetLane: 0,
      offsetHandle: 0,
    }
  },
  computed: {
    label() {
      if (this.value in this.markers) {
        return this.markers[this.value]
      } else {
        return Math.round(this.value)
      }
    },
  },
  created() {
    window.addEventListener('mousemove', this.move)
    window.addEventListener('mouseup', this.end)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('mouseup', this.end)
  },
  mounted() {
    this.offsetLane = this.$refs.lane.getBoundingClientRect().left
    this.handleWidth = this.$refs.handle.getBoundingClientRect().width
    
    this.animate(
      function (timeFraction) { return timeFraction },
      progress => {
        this.$emit('input', Math.round(progress * (400 - this.min) + this.min))
      },
      1000
    )
  },
  methods: {
    animate(timing, draw, duration) {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration
        if (timeFraction < 0) timeFraction = 0
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        draw(progress)

        if (timeFraction < 1) {
          requestAnimationFrame(animate)
        }
      });
    },
    over() {
      this.hover = true
    },
    out() {
      this.hover = false
    },
    move(e) {
      if (this.dragging) {
        this.$emit('input', this.posToValue(e.clientX - this.offsetLane - this.offsetHandle))
      }
    },
    start(e) {
      this.offsetHandle = e.target === this.$refs.handle ? e.offsetX : -this.handleWidth / 2
      this.leftRaw = e.clientX - this.offsetLane - this.offsetHandle

      this.dragging = true
      this.$emit('start')
    },
    end() {
      this.dragging = false
      this.$emit('end')
    },
    posToValue(pos) {
      const markers = Object.keys(this.markers).map(value => parseInt(value))

      const left = this.$refs.markers[0].getBoundingClientRect().left
      const right = this.$refs.markers[0].getBoundingClientRect().right

      if (pos < left - this.offsetLane - this.handleWidth / 2) {
        const ratio = pos / (left - this.offsetLane - this.handleWidth / 2)
        return Math.round(ratio * markers[0])
      }

      if (pos <= right - this.offsetLane - this.handleWidth / 2) {
        return markers[0]
      }

      for (let i = 1; i < markers.length; i++) {
        const left = this.$refs.markers[i].getBoundingClientRect().left
        const right = this.$refs.markers[i].getBoundingClientRect().right
        const prev = this.$refs.markers[i - 1].getBoundingClientRect().right

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
        const left = this.$refs.markers[i].getBoundingClientRect().left
        const right = this.$refs.markers[i].getBoundingClientRect().right
        const prev = this.$refs.markers[i - 1].getBoundingClientRect().right

        if (value < markers[i]) {
          const ratio = (value - markers[i - 1]) / (markers[i] - markers[i - 1])
          return ratio * (left - prev) + prev - this.offsetLane - this.handleWidth / 2
        }

        if (value === markers[i]) {
          return left + (right - left) / 2 - this.offsetLane - this.handleWidth / 2
        }
      }
    }
  }
}
</script>