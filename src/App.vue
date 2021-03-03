<template>
  <div id="app" class="h-full">
    <div class="flex flex-col h-full">
      <div class="flex justify-between">
        <div>
          <div class="flex items-start">
            <a class="border-b-1 border-t-1 border-transparent mr-4" href="#">Blue Shell</a>
            <div class="relative">
              <ul class="absolute flex flex-col group items-start">
                <li class="bg-black border-black border-1 px-3 rounded-full text-white">
                  <a href="#zaum">Zaum <span class="text-xs">▼</span></a>
                </li>
                <li class="bg-black border-black border-1 invisible px-3 rounded-full text-white group-hover:visible">
                  <a href="#gates">Gatessss</a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <a href="#info">Info</a>
          </div>
        </div>
        <div>
          <button class="bg-yellow px-3 rounded-full">Buy</button>
        </div>
      </div>
      <textarea class="bg-transparent flex-grow flex-shrink-0 font-serif placeholder-current resize-none text-center w-full"
                placeholder="Only kill"
                ref="textarea"
                rows="1"
                spellcheck="false"></textarea>
      <div>
        <Slider min="0" max="1000" />
        <Slider min="0" max="1000" />
        <Slider min="0" max="1000" />
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "@/components/Slider";

export default {
  name: 'App',
  components: {
    Slider,
  },
  mounted() {
    const height = window.innerHeight / 2
    this.$refs.textarea.style.fontSize = `${height}px`
  }
}
</script>
