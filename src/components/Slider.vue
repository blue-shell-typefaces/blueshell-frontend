<template>
  <div>
    <div class="py-4">
      <div class="bg-black h-0.5 relative">
      <span
          class="absolute bg-black cursor-grab active:cursor-grabbing px-3 rounded-full text-white top-1/2 transform -translate-y-1/2">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: ['min', 'max'],
  data() {
    return {
      'value': this.min,
    }
  },
  methods: {
  }
}
</script>