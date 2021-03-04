<template>
  <div>
    <div class="-mx-3 py-4 relative">
      <div class="bg-black h-0.5"></div>
      <span class="absolute bg-black cursor-grab active:cursor-grabbing px-3 rounded-full text-white top-1/2 transform -translate-y-1/2 z-10" :style="`left: ${100 * value / max}%; --tw-translate-x: ${-100 * value / max}%;`">{{ label }}</span>
      <span class="absolute bg-pink cursor-pointer px-3 top-1/2 transform -translate-y-1/2" v-for="(marker, key) in markers"
            :key="key"
            :style="`left: ${100 * key / max}%; --tw-translate-x: ${-100 * key / max}%;`"
            @click="value = parseInt(key)">{{ marker }}</span>
    </div>
<!--    <button class="p-2" @click="value += 1">+</button>-->
<!--    <button class="p-2" @click="value -= 1">-</button>-->
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
  computed: {
    label() {
      if (this.value in this.markers) {
        return this.markers[this.value]
      } else {
        return this.value
      }
    }
  },
  watch: {
    value(value) {
      this.$emit('update:value', value)
    }
  }
}
</script>