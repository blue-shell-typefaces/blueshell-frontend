<template>
  <div>
    <div class="flex">
      <select v-bind:value="value" @input="$emit('input', parseInt($event.target.value))" class="bg-black lg:hidden flex-shrink h-10 m-1 mr-0 mt-0 px-2 rounded-full text-white">
        <option v-for="(marker, key) in markers" :value="key" :key="key">{{ marker }}</option>
      </select>
      <div class="group-hover:bg-orange flex-grow h-10 m-1 mt-0 relative rounded-full transition duration-100"
           @mousemove="move"
           @touchmove="move"
           ref="lane">
        <span class="absolute bg-black cursor-grab active:cursor-grabbing h-10 leading-10 px-3 rounded-full text-white top-1/2 transform -translate-y-1/2 z-10"
              :style="`left: ${100 * value / max}%; --tw-translate-x: ${-100 * value / max}%;`"
              @mousedown="start"
              @touchstart="start"
              @mouseup="end"
              @touchend="end">{{ label }}</span>
        <span class="absolute cursor-pointer hidden lg:inline opacity-0 group-hover:opacity-100 px-3 top-1/2 transform -translate-y-1/2" v-for="(marker, key) in markers"
              :key="key"
              :style="`left: ${100 * key / max}%; --tw-translate-x: ${-100 * key / max}%;`"
              @click="$emit('input', parseInt(key))">{{ marker }}</span>
      </div>
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
  },
  data() {
    return {
      dragging: false,
    }
  },
  computed: {
    label() {
      if (this.value in this.markers) {
        return this.markers[this.value]
      } else {
        return this.value
      }
    }
  },
  methods: {
    start() {
      this.dragging = true
    },
    move(e) {
      if (this.dragging) {
        const left = this.$refs.lane.getBoundingClientRect().left
        const ratio = (e.clientX - left) / this.$refs.lane.offsetWidth
        const value = Math.min(
          Math.max(
            Math.round((this.max - this.min) * ratio + this.min),
            this.min
          ),
          this.max
        )
        this.$emit('input', value)
      }
    },
    end() {
      this.dragging = false
    }
  }
}
</script>