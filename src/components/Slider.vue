<template>
  <div class="flex">
    <select v-bind:value="value" @input="$emit('input', parseInt($event.target.value))" class="lg:hidden flex-shrink h-10 px-2 rounded-full text-white" :style="{ background }">
      <option v-for="(marker, key) in markers" :value="key" :key="key">{{ marker }}</option>
    </select>
    <div class="flex-grow h-10 relative rounded-full transition duration-100"
          :class="[dragging || (!globalDragging && hover) ? 'bg-white' : '']"
          @mouseover="over"
          @mouseout="out"
          ref="lane">
      <span class="absolute bg-black cursor-grab active:cursor-grabbing h-10 leading-10 rounded-full text-center text-white top-1/2 transform -translate-y-1/2 z-10"
            :class="[value in markers ? 'px-3' : 'w-10']"
            :style="`left: ${100 * value / (max - min)}%; --tw-translate-x: ${-100 * value / (max - min)}%; background: ${background}; color: ${color};`"
            ref="handle"
            @mousedown="start"
      >{{ label }}</span>
      <span class="absolute cursor-pointer h-full hidden lg:inline leading-10 px-3 opacity-0 rounded-full top-1/2 transform -translate-y-1/2" v-for="(marker, key) in markers"
            :class="[(dragging || (!globalDragging && hover)) && value != key ? 'opacity-100' : 'opacity-0']"
            :key="key"
            ref="markers"
            :style="{ left: `${100 * key / max}%`, '--tw-translate-x': `${-100 * key / max}%` }"
            @click="$emit('input', parseInt(key))">{{ marker }}</span>
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
        return this.value
      }
    },
    left() {
      try {
        // if (this.value in this.markers) {
          // console.log(this.markers[this.value].getBoundingClientRect().left)
          // return this.markers[this.value].getBoundingClientRect().left
        // }

        return Math.round(Math.max(0, Math.min(this.leftRaw, this.$refs.lane.getBoundingClientRect().width - this.$refs.handle.getBoundingClientRect().width)))
      } catch (e) {
        return 100
      }
    }
  },
  watch: {
    left(left) {
      const value = Math.round(this.posToValue(left))
      this.$emit('input', value)
    }
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
        this.leftRaw = e.clientX - this.offsetLane - this.offsetHandle
      }
    },
    start(e) {
      this.offsetHandle = e.target === this.$refs.handle ? e.offsetX : -this.$refs.handle.width / 2
      this.leftRaw = e.clientX - this.offsetLane - this.offsetHandle

      this.$emit('start')
      this.dragging = true
    },
    end() {
      this.dragging = false
      this.$emit('end')
    },
    posToValue(pos) {
      const markers = Object.keys(this.markers)

      const left = this.$refs.markers[0].getBoundingClientRect().left
      const right = this.$refs.markers[0].getBoundingClientRect().right

      if (pos < left - this.offsetLane - this.handleWidth / 2) {
        const ratio = pos / (left - this.offsetLane - this.handleWidth / 2)
        return ratio * markers[0]
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
          return ratio * (markers[i] - markers[i - 1]) + parseInt(markers[i - 1])
        }

        if (pos >= left - this.offsetLane - this.handleWidth / 2 &&
            pos <= right - this.offsetLane - this.handleWidth / 2) {
          return markers[i]
        }
      }

      return 0
    }
  }
}
</script>