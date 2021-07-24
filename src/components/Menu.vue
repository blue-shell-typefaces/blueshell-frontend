<template>
  <div>
    <div class="flex items-start">
      <div class="bg-black h-10 mr-1 relative rounded-full w-10">
        <span class="absolute border-white border-t-1 left-1/4 top-4 w-1/2"></span>
        <span class="absolute border-white border-t-1 bottom-4 left-1/4 w-1/2"></span>
      </div>
      <div class="relative">
        <ul class="absolute flex flex-col group items-start whitespace-nowrap">
          <li class="bg-black h-10 relative rounded-full w-10">
            <span class="absolute border-white border-t-1 left-1/4 top-3 w-1/2"></span>
            <span class="absolute border-white border-l-1 right-1/2 top-3 transform translate-x-1/2 h-1/2"></span>
          </li>
          <li class="bg-blue hover:bg-black h-10 leading-10 hidden rounded-full text-white group-hover:block" v-for="font in fonts" :key="font.slug">
            <router-link class="block px-5" :to="{ name: 'detail', params: { family: font.slug } }">{{ font.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { fonts } from '../data.js'

export default {
  name: 'Menu',
  data() {
    return {
      fonts
    }
  }
}
</script>