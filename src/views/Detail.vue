<template>
  <div class="flex flex-col h-full p-4">
    <div class="flex justify-between">
      <Menu />
      <div>
        <button class="bg-yellow px-3 rounded-full" @click="buy">Buy</button>
      </div>
    </div>
    <div class="h-full">
      <textarea class="bg-transparent flex-grow flex-shrink-0 placeholder-current resize-none text-center w-full"
                :class="`font-${$route.params.family}`"
                placeholder="Only kill"
                ref="textarea"
                rows="1"
                :style="`--wght: ${wght}; --mood: ${mood}; font-variation-settings: 'wght' var(--wght), 'mood' var(--mood);`"
                spellcheck="false"></textarea>
      <div>
        <Slider :value.sync="wght" :min="0" :max="1000" :markers="{0: 'Narrow', 500: 'Normal', 1000: 'Wide'}" />
        <Slider :value.sync="mood" :min="0" :max="1000" :markers="{0: 'Light', 500: 'Normal', 1000: 'Bold'}" />
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Slider from "@/components/Slider";

export default {
  name: 'Detail',
  components: {
    Menu,
    Slider,
  },
  data() {
    return {
      wght: 500,
      mood: 500,
    }
  },
  mounted() {
    const height = window.innerHeight / 2
    this.$refs.textarea.style.fontSize = `${height}px`
  },
  methods: {
    buy() {
      window.Paddle.Checkout.open({
        product: 9726
      })
    }
  }
}
</script>
