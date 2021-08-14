<template>
  <div v-if="family">
    <div class="fixed inset-0 min-h-full" :class="[showCart ? 'bg-black text-white w-3/4' : 'w-full']">
      <div class="left-0 right-0 sticky top-0 w-full z-10">
        <div class="flex justify-between p-1">
          <Menu />
          <div class="flex leading-10">
            <a href="#" class="hidden lg:block mx-5">About</a>
            <a href="#" class="hidden lg:block mx-5">Characters</a>
            <a href="#" class="hidden lg:block mx-5">Specimen</a>
            <a href="#" class="hidden lg:block mx-5">Trial</a>
            <button class="bg-orange h-10 leading-10 ml-5 rounded-full w-10" @click="showCart = !showCart" v-show="!showCart">Buy</button>
          </div>
        </div>
      </div>
      <Tester :values="properties" />
      <div class="absolute bottom-0 group left-0 right-0">
        <Slider v-model="properties.wght" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Black'}" />
        <Slider v-model="properties.mood" :min="0" :max="1000" :markers="{0: 'Light', 400: 'Normal', 600: 'Bold', 1000: 'Bold'}" />
      </div>
    </div>

    <div class="bg-white bottom-0 fixed overflow-y-auto p-1 right-0 top-0 w-full lg:w-1/4" v-show="showCart">
      <div class="flex h-10 leading-10 justify-between">
        <span>Buy {{ family.name }}</span>
        <button class="bg-black h-10 relative rounded-full w-10" @click="showCart = false">
          <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
          <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
        </button>
      </div>
      
      <p class="my-3">You have created your own style of {{ family.name }} typeface.</p>

      <p class="my-3">Your style</p>

      <div class="relative">
        <button class="absolute bg-black h-10  rounded-full w-10">          
          <span class="absolute border-t-1 left-1/4 rotate-45 transform w-1/2"></span>
          <span class="absolute border-t-1 left-1/4 -rotate-45 transform w-1/2"></span>
        </button>

        <span class="bg-blue h-10 inline-block leading-10 pl-12 pr-4 rounded-full">BS Zaum ReNa233</span>
      </div>

      <p class="my-3">Preset styles</p>

      <FamilyPreset :preset="preset" :name="name" v-for="(preset, name) in family.presets" :key="name" />

      <label class="cursor-pointer flex items-center my-3">
        <input type="checkbox" name="agree" class="appearance-none bg-beige checked:bg-blue h-10 rounded-full w-10">
        <span class="pl-2">Agree to <a class="underline" href="#">EULA</a></span>
      </label>

      <div class="text-right">
        <button class="bg-orange inline-block h-10 leading-10 rounded-full px-4">Buy</button>
      </div>

      <!--
      <form @submit.prevent="formSubmit" method="post">
       <div v-for="item in items" :key="item.id">
         <label>
           <input type="checkbox" name="variant" :value="item.id" v-model="item.active">
           {{ item.name }}
         </label>
       </div>
        <div>
          <label>Mood <input type="number" name="loc[mood]" value="500"></label>
        </div>
        <div>
          <label>Wght <input type="number" name="loc[wght]" value="500"></label>
        </div>
        <div>
          <input type="hidden" name="font" value="ChrastinaProGX.ttf">
        </div>
        <button type="submit">Pay {{ total }}&euro;</button>
      </form>
      -->
    </div>
  </div>
</template>

<script>
import FamilyPreset from "@/components/FamilyPreset"
import Menu from "@/components/Menu"
import Slider from "@/components/Slider"
import Tester from "@/components/Tester"
import axios from "axios"
import { fonts } from "../data.js"

export default {
  name: 'Detail',
  components: {
    FamilyPreset,
    Menu,
    Slider,
    Tester,
  },
  data() {
    return {
      family: null,
      showCart: false,
      items: [
        { id: 1, price: 70, name: 'Variant 1', active: false },
        { id: 2, price: 80, name: 'Variant 2', active: false },
        { id: 3, price: 90, name: 'Variant 3', active: false },
      ],
      cart: [],
      properties: {
        wght: 400,
        mood: 400,
      }
    }
  },
  mounted() {
    this.family = fonts.find(font => font.slug === this.$route.params.family)
  },
  methods: {
    formSubmit(e) {
      const data = new FormData(e.target);
      axios.post(`${process.env.VUE_APP_API_URL}/pay-link`, data).then(({data}) => {
        window.Paddle.Checkout.open({
          override: data.url,
        })
      })
    },
    toggleInstance(instance) {
      if (this.cart.includes(instance)) {
        this.cart = this.cart.filter(item => item !== instance)
      } else {
        this.cart.push(instance)
      }
    },
  },
  computed: {
    total() {
      return 70
      // return this.items
      //     .filter(item => item.active)
      //     .map(item => item.price)
      //     .reduce((a, b) => a + b, 0);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.showCart = false
    next()
  }
}
</script>
